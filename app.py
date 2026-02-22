from flask import Flask, render_template, Response, request, jsonify, send_file
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import cv2
import os
import time
import json
from datetime import datetime
from camera_manager import CameraManager
from config import Config
import requests
from werkzeug.utils import secure_filename
from emotion_model import EmotionDetector
import tempfile
import wave
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
camera_manager = CameraManager()
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/capabilities')
def capabilities():
    cameras = camera_manager.get_all_cameras()
    return render_template('capabilities.html', cameras=cameras)
@app.route('/space-today')
def space_today():
    return render_template('space-today.html')
@app.route('/registration')
def registration():
    return render_template('registration.html')
@app.route('/demo')
def demo():
    cameras = camera_manager.get_all_cameras()
    return render_template('demo.html', cameras=cameras)
@app.route('/api/cameras', methods=['GET'])
def get_cameras():
    return jsonify(camera_manager.get_all_cameras())
@app.route('/api/cameras/<camera_id>', methods=['GET'])
def get_camera(camera_id):
    stats = camera_manager.get_camera_stats(camera_id)
    if stats:
        return jsonify(stats)
    return jsonify({'error': 'Camera not found'}), 404
@app.route('/api/cameras', methods=['POST'])
def add_camera():
    data = request.json
    source = data.get('source')
    if not source:
        return jsonify({'error': 'Source required'}), 400
    camera_id = camera_manager.add_camera(
        source=source,
        name=data.get('name'),
        camera_type=data.get('type', 'ambient')
    )
    socketio.emit('camera_added', {'id': camera_id, 'name': data.get('name')})
    return jsonify({
        'id': camera_id,
        'status': 'added',
        'cameras': camera_manager.get_all_cameras()
    })
@app.route('/api/cameras/<camera_id>', methods=['DELETE'])
def remove_camera(camera_id):
    if camera_manager.remove_camera(camera_id):
        socketio.emit('camera_removed', {'id': camera_id})
        return jsonify({'status': 'removed'})
    return jsonify({'error': 'Camera not found'}), 404
@app.route('/api/cameras/<camera_id>/toggle', methods=['POST'])
def toggle_camera(camera_id):
    status = camera_manager.toggle_camera(camera_id)
    socketio.emit('camera_toggled', {'id': camera_id, 'status': status})
    return jsonify({'status': 'active' if status else 'stopped'})
@app.route('/api/cameras/<camera_id>/snapshot', methods=['POST'])
def take_snapshot(camera_id):
    frame = camera_manager.get_frame(camera_id)
    if frame is not None:
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"snapshot_{camera_id}_{timestamp}.jpg"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        cv2.imwrite(filepath, frame)
        return jsonify({
            'status': 'success',
            'filename': filename,
            'url': f'/uploads/{filename}'
        })
    return jsonify({'error': 'No frame available'}), 404
@app.route('/api/detections', methods=['GET'])
def get_detections():
    limit = request.args.get('limit', 50, type=int)
    return jsonify(camera_manager.get_detection_history(limit))
@app.route('/video_feed/<camera_id>')
def video_feed(camera_id):
    def generate():
        while True:
            frame = camera_manager.get_frame(camera_id)
            if frame is not None:
                ret, jpeg = cv2.imencode('.jpg', frame)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' +
                       jpeg.tobytes() + b'\r\n\r\n')
            else:
                time.sleep(0.05)
    return Response(generate(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
@app.route('/api/space/iss')
def get_iss_location():
    try:
        response = requests.get('http://api.open-notify.org/iss-now.json')
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/space/apod')
def get_apod():
    try:
        response = requests.get(
            f'https://api.nasa.gov/planetary/apod',
            params={'api_key': app.config['NASA_API_KEY']}
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/space/weather')
def get_space_weather():
    try:
        response = requests.get(
            'https://services.swpc.noaa.gov/products/geospace/propagated-solar-wind.json'
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/space/launches')
def get_launches():
    try:
        response = requests.get('https://ll.thespacedevs.com/2.2.0/launch/upcoming/')
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/upload/video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file'}), 400

    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    saved_filename = f"{timestamp}_{filename}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], saved_filename)
    file.save(filepath)
    camera_id = camera_manager.add_camera(
        source=filepath,
        name=f"Video: {filename}",
        camera_type='video'
    )
    return jsonify({
        'status': 'success',
        'filename': saved_filename,
        'camera_id': camera_id
    })
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], filename))
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('connected', {'data': 'Connected to AeroAssist server'})
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
@socketio.on('request_camera_update')
def handle_camera_update():
    emit('camera_update', {'cameras': camera_manager.get_all_cameras()})
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    return jsonify({
        'status': 'success',
        'user_id': f"USER_{int(time.time())}",
        'message': 'Registration successful'
    })
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    return jsonify({
        'status': 'success',
        'token': 'demo_token_' + str(int(time.time())),
        'user': {
            'name': data.get('email', 'User').split('@')[0],
            'role': 'user'
        }
    })
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404
@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500
@app.teardown_appcontext
def cleanup(error):
    camera_manager.cleanup()
emotion_detector = EmotionDetector(model_path='speech_model_c.keras')
@app.route('/api/emotion/detect', methods=['POST'])
def detect_emotion():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file'}), 400
    audio_file = request.files['audio']
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name
    try:
        result = emotion_detector.predict_emotion(audio_path=tmp_path)
        os.unlink(tmp_path)
        return jsonify(result)
    except Exception as e:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
        return jsonify({'error': str(e)}), 500
@app.route('/api/emotion/analyze-live', methods=['POST'])
def analyze_live_emotion():
    data = request.json
    if 'audio' not in data:
        return jsonify({'error': 'No audio data'}), 400
    import base64
    import numpy as np
    try:
        audio_data = base64.b64decode(data['audio'].split(',')[1])
        audio_array = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
        result = emotion_detector.predict_emotion(audio_data=audio_array)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@app.route('/api/emotion/status')
def emotion_status():
    return jsonify({
        'loaded': emotion_detector.model is not None,
        'emotions': emotion_detector.base_emotions
    })
socketio.run(app, host='0.0.0.0', port=5001, debug=True, allow_unsafe_werkzeug=True)