@echo off
REM Aleyo Website Builder Development Script for Windows

echo 🚀 Aleyo Website Builder Development Environment
echo ================================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Virtual environment not found. Running installation...
    call install.bat
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Start backend
echo.
echo 🚀 Starting Backend Server...
start "Aleyo Backend" cmd /c "uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a bit
timeout /t 2 /nobreak >nul

REM Start frontend
echo.
echo 🎨 Starting Frontend Development Server...
if exist "..\src" (
    cd ..\src
    if not exist "node_modules" (
        echo 📦 Installing frontend dependencies...
        call npm install
    )
    start "Aleyo Frontend" cmd /c "npm start"
    cd ..\backend
) else (
    echo ⚠️  Frontend directory not found. Only starting backend.
)

echo.
echo ✅ Development servers running!
echo    Backend: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all servers...
pause >nul

echo.
echo 🛑 Stopping servers...
taskkill /f /im "python.exe" /fi "windowtitle eq Aleyo Backend*" >nul 2>&1
taskkill /f /im "node.exe" /fi "windowtitle eq Aleyo Frontend*" >nul 2>&1
echo Done.