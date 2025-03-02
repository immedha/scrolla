#!/bin/bash

# Start the backend server
echo "Starting the Python backend server..."
cd backend
source venv/bin/activate
python3 app.py &
BACKEND_PID=$!
cd ..

# Wait for the backend to start
echo "Waiting for backend to start..."
sleep 3

# Start the frontend development server
echo "Starting the frontend development server..."
npm run dev

# When frontend is closed, close the backend
echo "Shutting down servers..."
kill $BACKEND_PID 