@echo off
REM Aleyo Website Builder Backend Installation Script for Windows
REM Compatible with Python 3.14.3+

echo 🚀 Aleyo Website Builder Backend Installation
echo ==============================================
echo.

REM Check Python version
echo 📌 Checking Python version...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed
    echo    Please install Python 3.14.3+ from https://python.org
    exit /b 1
)

for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo    Found Python %PYTHON_VERSION%

echo ✅ Python version OK
echo.

REM Create virtual environment
echo 📦 Creating virtual environment...
if exist "venv" (
    echo    Virtual environment already exists
) else (
    python -m venv venv
    echo    Virtual environment created
)
echo.

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat
echo ✅ Virtual environment activated
echo.

REM Upgrade pip
echo ⬆️  Upgrading pip...
python -m pip install --upgrade pip setuptools wheel
echo ✅ Pip upgraded
echo.

REM Install dependencies
echo 📚 Installing dependencies...
echo    This may take a few minutes...

if "%1"=="--minimal" (
    echo    Installing minimal dependencies...
    pip install -r requirements-minimal.txt
) else (
    echo    Installing full dependencies...
    pip install -r requirements.txt
)

echo ✅ Dependencies installed
echo.

REM Create .env file
if not exist ".env" (
    echo 📝 Creating .env file...
    copy .env.example .env >nul 2>&1
    if errorlevel 1 (
        echo    Creating default .env file...
        (
            echo APP_NAME="Aleyo Website Builder"
            echo APP_ENV=development
            echo APP_DEBUG=true
            echo SECRET_KEY=your-secret-key-here-change-in-production
            echo DATABASE_URL=sqlite:///./aleyo.db
            echo JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
            echo JWT_ALGORITHM=HS256
            echo CORS_ORIGINS=["http://localhost:3000", "http://localhost:8000"]
        ) > .env
    )
    echo ✅ .env file created
)
echo.

echo 🎉 Installation complete!
echo.
echo To start the backend server:
echo   venv\Scripts\activate
echo   uvicorn backend.main:app --reload --port 8000
echo.
echo To run tests:
echo   pytest
echo.
echo To verify installation:
echo   python -c "import fastapi, uvicorn, sqlalchemy; print('✅ All imports successful')"
echo.