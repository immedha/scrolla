import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

# Flask configuration
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
PORT = int(os.getenv("PORT", 5000))
HOST = os.getenv("HOST", "0.0.0.0")

# Firebase configuration
FIREBASE_STORAGE_BUCKET = os.getenv(
    "FIREBASE_STORAGE_BUCKET", "your-firebase-storage-bucket.appspot.com"
)

# File upload settings
UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", 16 * 1024 * 1024))  # 16MB
ALLOWED_EXTENSIONS = {"pdf"}

# Video processing settings
OUTPUT_FOLDER = os.getenv("OUTPUT_FOLDER", "outputs")
TEMP_FOLDER = os.getenv("TEMP_FOLDER", "temp")
VIDEO_QUALITY = os.getenv("VIDEO_QUALITY", "medium")  # low, medium, high
MAX_VIDEO_DURATION = int(os.getenv("MAX_VIDEO_DURATION", 60))  # seconds

# Ensure required directories exist
for folder in [UPLOAD_FOLDER, OUTPUT_FOLDER, TEMP_FOLDER]:
    os.makedirs(folder, exist_ok=True)
