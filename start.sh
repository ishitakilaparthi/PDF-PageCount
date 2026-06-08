#!/bin/bash

# Start backend and frontend servers

echo "Starting PDF Page Counter Application..."
echo ""

# Start backend
cd backend
echo "Installing backend dependencies..."
npm install
echo ""
echo "Starting backend server on port 5000..."
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
cd frontend
echo "Installing frontend dependencies..."
npm install
echo ""
echo "Starting frontend on port 3000..."
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both servers should be running now!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Handle shutdown
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

# Keep script running
wait
