import cv2
import threading
import time
import uuid
import numpy as np
from ultralytics import YOLO
import os
import queue
from collections import deque
class CameraManager:
    def __init__(self):
        self.cameras = {}
        self.models = {}
        self.lock = threading.Lock()
        self.load_models()
    def load_models(self):
        model_paths = {
            'rocket': 'models/best_spaceship.pt',
            'suit': 'models/best_suit.pt',
            'medical': 'models/best.pt'}
    def get_all_cameras(self):
        with self.lock:
            return [
                {
                    "id": cam["id"],
                    "name": cam["name"],
                    "type": cam["type"],
                    "model_type": cam["model_type"],
                    "running": cam["running"],
                    "fps": cam["fps"],
                    "detections": cam["detections"],
                    "status": "active" if cam["running"] else "stopped"}
                for cam in self.cameras.values()]
    def add_camera(self, source=0, name=None, camera_type='ambient', model_type='rocket'):
        camera_id = str(uuid.uuid4())[:8]
        if isinstance(source, str) and source.isdigit():
            source = int(source)
        camera = {
            "id": camera_id,
            "source": source,
            "name": name or f"Camera {len(self.cameras) + 1}",
            "type": camera_type,
            "model_type": model_type,  # Which model to use
            "running": True,
            "frame": None,
            "fps": 0,
            "detections": 0,
            "thread": None,
            "frame_queue": queue.Queue(maxsize=2),
            "frame_count": 0,
            "last_detections": [] }
        with self.lock:
            self.cameras[camera_id] = camera
        thread = threading.Thread(
            target=self._camera_loop,
            args=(camera_id,),
            daemon=True)
        camera["thread"] = thread
        thread.start()
        return camera_id
    def _camera_loop(self, camera_id):
        camera = self.cameras[camera_id]
        source = camera["source"]
        model = self.models.get(camera["model_type"], self.models['rocket'])
        print(f"📹 Opening camera {camera_id} ({source}) with {camera['model_type']} model")
        import platform
        if platform.system() == "Linux" and isinstance(source, int):
            cap = cv2.VideoCapture(source, cv2.CAP_V4L2)
        else:
            cap = cv2.VideoCapture(source)
        if not cap.isOpened():
            print(f"❌ Cannot open camera {camera_id}")
            camera["running"] = False
            return
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        cap.set(cv2.CAP_PROP_FPS, 30)
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        print(f"✅ Camera {camera_id} opened")
        frame_counter = 0
        fps_timer = time.time()
        error_count = 0
        while camera["running"]:
            ret, frame = cap.read()
            if not ret:
                error_count += 1
                if error_count > 10:
                    print(f"❌ Camera {camera_id}: Too many errors")
                    break
                time.sleep(0.1)
                continue
            error_count = 0
            if frame_counter % 3 == 0:
                try:
                    results = model(frame, conf=0.25, verbose=False)
                    frame = results[0].plot()
                    detection_count = len(results[0].boxes)
                    if detection_count > 0:
                        camera["detections"] += detection_count
                        if len(results[0].boxes) > 0:
                            classes = results[0].boxes.cls.cpu().numpy() if hasattr(results[0].boxes, 'cls') else []
                            camera["last_detections"] = [
                                {"class": int(c), "confidence": float(results[0].boxes.conf[i])}
                                for i, c in enumerate(classes[:5])]
                except Exception as e:
                    print(f" YOLO error on {camera_id}:", e)
            camera["frame"] = frame
            if camera["frame_queue"].full():
                try:
                    camera["frame_queue"].get_nowait()
                except queue.Empty:
                    pass
            camera["frame_queue"].put_nowait(frame)
            frame_counter += 1
            if time.time() - fps_timer >= 1:
                camera["fps"] = frame_counter
                frame_counter = 0
                fps_timer = time.time()
            time.sleep(0.01)
        cap.release()
        camera["running"] = False
    def get_frame(self, camera_id):
        camera = self.cameras.get(camera_id)
        if not camera:
            return self._error_frame("Camera not found")
        try:
            return camera["frame_queue"].get_nowait()
        except (queue.Empty, AttributeError):
            if camera["frame"] is not None:
                return camera["frame"]
        return self._error_frame("Waiting for camera")
    def toggle_camera(self, camera_id):
        with self.lock:
            camera = self.cameras.get(camera_id)
            if not camera:
                return False
            camera["running"] = not camera["running"]
            if camera["running"] and not camera["thread"].is_alive():
                thread = threading.Thread(
                    target=self._camera_loop,
                    args=(camera_id,),
                    daemon=True)
                camera["thread"] = thread
                thread.start()
            return camera["running"]
    def remove_camera(self, camera_id):
        with self.lock:
            camera = self.cameras.get(camera_id)
            if not camera:
                return False
            camera["running"] = False
            if camera["thread"] and camera["thread"].is_alive():
                camera["thread"].join(timeout=2)
            del self.cameras[camera_id]
        return True
    def take_snapshot(self, camera_id):
        camera = self.cameras.get(camera_id)
        if not camera or camera["frame"] is None:
            return None
        frame = camera["frame"].copy()
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"snapshot_{camera_id}_{timestamp}.jpg"
        os.makedirs("uploads", exist_ok=True)
        filepath = os.path.join("uploads", filename)
        cv2.imwrite(filepath, frame)
        return filename
    def _error_frame(self, message):
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.putText(frame, message, (100, 240),
                    cv2.FONT_HERSHEY_SIMPLEX, 1,
                    (255, 255, 255), 2)
        return frame
    def get_camera_stats(self, camera_id):
        camera = self.cameras.get(camera_id)
        if not camera:
            return None
        return {
            "id": camera["id"],
            "name": camera["name"],
            "type": camera["type"],
            "model_type": camera["model_type"],
            "fps": camera["fps"],
            "detections": camera["detections"],
            "last_detections": camera["last_detections"][-5:],
            "running": camera["running"],
            "source": str(camera["source"])}
    def cleanup(self):
        for cam_id in list(self.cameras.keys()):
            self.remove_camera(cam_id)