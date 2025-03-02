# Scrolla

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
# npm run dev
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






