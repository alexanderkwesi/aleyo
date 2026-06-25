@echo off
echo 🚀 Aleyo Website Builder - Starting All Services
echo ================================================
echo.

echo Starting Python Backend...
start "Aleyo Backend" cmd /k "cd backend && uvicorn app:app --reload --port 8000"

echo.
echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting React Frontend...
start "Aleyo Frontend" cmd /k "cd src && npm start"

echo.
echo ✅ Both servers are starting!
echo    Backend:  http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo    Frontend: http://localhost:3000
echo.
echo Close the windows to stop the servers.