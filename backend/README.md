# Scrolla Backend

A Python-based backend for the Scrolla application that processes PDF files and generates videos using FFmpeg.

## Features

-  Upload and process PDF files
-  Convert PDFs to videos using FFmpeg
-  Store videos in Firebase Storage
-  Track user videos in Firestore
-  RESTful API for frontend integration

## Requirements

-  Python 3.8+
-  FFmpeg installed on the system
-  Firebase account with Firestore and Storage set up

## Installation

1. Install FFmpeg if not already installed:

   ```
   # macOS (using Homebrew)
   brew install ffmpeg

   # Ubuntu/Debian
   sudo apt update
   sudo apt install ffmpeg

   # Windows (using Chocolatey)
   choco install ffmpeg
   ```

2. Install Python dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Set up Firebase:

   -  Create a Firebase project if you don't have one
   -  Enable Firestore Database and Storage
   -  Download your service account key and save it as `firebase-service-account.json` in the backend directory
   -  Or set the `FIREBASE_SERVICE_ACCOUNT` environment variable with the JSON content

4. Configure environment variables (optional):
   Create a `.env` file in the backend directory with the following variables:
   ```
   DEBUG=True
   PORT=5000
   HOST=0.0.0.0
   FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket.appspot.com
   UPLOAD_FOLDER=uploads
   OUTPUT_FOLDER=outputs
   TEMP_FOLDER=temp
   MAX_CONTENT_LENGTH=16777216
   VIDEO_QUALITY=medium
   MAX_VIDEO_DURATION=60
   ```

## Running the Server

```
python app.py
```

The server will start on http://localhost:5000 by default.

## API Endpoints

### Health Check

```
GET /health
```

### Upload PDF Files

```
POST /api/upload
Form data:
- userId: string (required)
- files: file[] (required, max 5 for free users, max 50 for pro users)
```

### Generate Videos

```
POST /api/generate
JSON body:
{
  "userId": string (required),
  "files": string[] (required, array of file paths)
}
```

### Serve Video

```
GET /api/videos/<filename>
```
