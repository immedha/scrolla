# Scrolla

A modern web application that converts PDF files into video reels using FFmpeg and Python backend with React frontend.

## Project Structure

This project consists of two main parts:

1. **Frontend**: React/TypeScript application built with Vite
2. **Backend**: Python/Flask API for PDF to video conversion

## Features

-  User authentication via Firebase
-  PDF file upload
-  PDF to video conversion using FFmpeg
-  Video playback and management
-  Firebase Storage for file storage
-  Firebase Firestore for database

## Prerequisites

-  Node.js 18+ and npm
-  Python 3.8+
-  FFmpeg installed on the system
-  Firebase project with Authentication, Firestore and Storage enabled

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/scrolla.git
cd scrolla
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create a .env.local file with your Firebase config
cp .env.example .env.local
# Edit .env.local with your Firebase configuration
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up Firebase service account
# Download your Firebase service account key and save it as firebase-service-account.json in the backend directory
# Or set FIREBASE_SERVICE_ACCOUNT environment variable with the JSON content

# Configure environment variables
cp .env.example .env
# Edit .env with your settings
```

## Running the Application

You can run both the frontend and backend with a single command:

```bash
# Make sure you're in the project root directory
chmod +x start.sh
./start.sh
```

Or run them separately:

### Frontend

```bash
npm run dev
```

### Backend

```bash
cd backend
python app.py
```

## How It Works

1. **User Authentication**: Users can sign in using Firebase Authentication
2. **File Upload**: Users upload PDF files through the frontend
3. **Backend Processing**:
   -  The backend receives the PDF files and extracts images
   -  FFmpeg converts the images into a video
   -  The video is uploaded to Firebase Storage
4. **Video Playback**: Users can view and manage their generated videos

## Technical Details

### Frontend

-  **React 19** with TypeScript
-  **Redux Toolkit** for state management
-  **Redux Saga** for side effects
-  **React Router** for routing
-  **TailwindCSS** for styling
-  **Firebase SDK** for web

### Backend

-  **Flask** web framework
-  **FFmpeg** for video processing
-  **Firebase Admin SDK** for server-side Firebase operations
-  **PyPDF2** for PDF processing
-  **Pillow** for image processing

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
