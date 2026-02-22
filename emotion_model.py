import numpy as np
import librosa
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import os
class EmotionDetector:
    def __init__(self, model_path='speech_model_c.keras'):
        self.model = None
        self.model_path = model_path
        self.base_emotions = [
            "anger",
            "disgust",
            "fear",
            "happiness",
            "sadness",
            "enthusiasm",
            "neutral"
        ]
        self.load_model()
    def load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = load_model(self.model_path)
                print(f"Emotion model loaded from {self.model_path}")
            else:
                print(f"Emotion model not found at {self.model_path}")
        except Exception as e:
            print(f"Error loading emotion model: {e}")
    def extract_features(self, audio_path=None, audio_data=None, sr=16000):
        try:
            if audio_path and os.path.exists(audio_path):
                audio, sr = librosa.load(audio_path, sr=sr)
            elif audio_data is not None:
                audio = audio_data
            else:
                return None
            mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=40)
            energy = librosa.feature.rms(y=audio)
            energy = (energy - energy.mean()) / (energy.std() + 1e-8)
            energy *= 0.5
            pitch = librosa.yin(
                audio,
                fmin=50,
                fmax=400,
                sr=sr,
                frame_length=2048,
                hop_length=512
            )
            pitch = np.nan_to_num(pitch)
            min_length = min(mfcc.shape[1], len(energy[0]), len(pitch))
            mfcc = mfcc[:, :min_length]
            energy = energy[:, :min_length]
            pitch = pitch[:min_length].reshape(1, -1)
            features = np.vstack([mfcc, energy, pitch])  # (42, time)
            features = features.T  # (time, 42)
            return features
        except Exception as e:
            print(f"❌ Feature extraction error: {e}")
            return None
    def predict_emotion(self, audio_path=None, audio_data=None):
        if self.model is None:
            return {"error": "Model not loaded"}
        features = self.extract_features(audio_path=audio_path, audio_data=audio_data)
        if features is None:
            return {"error": "Could not extract features"}
        features_padded = pad_sequences([features], padding="post", dtype="float32", maxlen=500)
        mean = features_padded.mean()
        std = features_padded.std() + 1e-8
        features_padded = (features_padded - mean) / std
        predictions = self.model.predict(features_padded, verbose=0)[0]
        top_indices = np.argsort(predictions)[-3:][::-1]
        result = {
            "primary": {
                "emotion": self.base_emotions[np.argmax(predictions)],
                "confidence": float(predictions[np.argmax(predictions)])
            },
            "all": {
                emotion: float(predictions[i])
                for i, emotion in enumerate(self.base_emotions)
            },
            "top3": [
                {
                    "emotion": self.base_emotions[i],
                    "confidence": float(predictions[i])
                }
                for i in top_indices
            ]
        }
        return result
    def emotion_to_color(self, emotion):
        colors = {
            "anger": "#ff375f",  # Red
            "disgust": "#00ff9d",  # Green
            "fear": "#9d4edd",  # Purple
            "happiness": "#00f3ff",  # Blue
            "sadness": "#4a6fa5",  # Dark blue
            "enthusiasm": "#ff9900",  # Orange
            "neutral": "#cccccc"  # Gray
        }
        return colors.get(emotion, "#ffffff")
    def emotion_to_icon(self, emotion):
        icons = {
            "anger": "fa-angry",
            "disgust": "fa-face-disgust",
            "fear": "fa-face-fearful",
            "happiness": "fa-smile",
            "sadness": "fa-sad-tear",
            "enthusiasm": "fa-grin-stars",
            "neutral": "fa-meh"
        }
        return icons.get(emotion, "fa-face-smile")