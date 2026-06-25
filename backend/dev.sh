#!/bin/bash

# Aleyo Website Builder Development Script
# Starts both frontend and backend in development mode

set -e

echo "🚀 Aleyo Website Builder Development Environment"
echo "================================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Virtual environment not found. Running installation..."
    ./install.sh
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Start backend
echo ""
echo "🚀 Starting Backend Server..."
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a bit
sleep 2

# Start frontend (if in parent directory)
echo ""
echo "🎨 Starting Frontend Development Server..."
if [ -d "../src" ]; then
    cd ../src
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    npm start &
    FRONTEND_PID=$!
    cd ../backend
else
    echo "⚠️  Frontend directory not found. Only starting backend."
    FRONTEND_PID=""
fi

echo ""
echo "✅ Development servers running!"
echo "   Backend: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
if [ -n "$FRONTEND_PID" ]; then
    echo "   Frontend: http://localhost:3000"
fi
echo ""
echo "Press Ctrl+C to stop all servers..."

# Handle shutdown
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Wait
wait