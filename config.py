import os
from dotenv import load_dotenv
load_dotenv()
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'aeroassist-secret-key-2024')
    DEBUG = os.environ.get('DEBUG', 'True') == 'True'
    MODEL_PATH = os.environ.get('MODEL_PATH', 'models/best.pt')
    CONFIDENCE_THRESHOLD = float(os.environ.get('CONFIDENCE_THRESHOLD', 0.25))
    MAX_CAMERAS = int(os.environ.get('MAX_CAMERAS', 10))
    DEFAULT_FPS = int(os.environ.get('DEFAULT_FPS', 30))
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024  # 500MB
    NASA_API_KEY = os.environ.get('NASA_API_KEY', 'DEMO_KEY')
    DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///aeroassist.db')