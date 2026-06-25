#!/usr/bin/env python3
"""
Verify installation for Aleyo Website Builder backend
Compatible with Python 3.14.3+
"""

import sys
import importlib

def check_python_version():
    """Check Python version compatibility"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 14):
        print(f"❌ Python {version.major}.{version.minor} is not supported")
        print("   Please use Python 3.14.3 or higher")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def check_package(package_name, import_name=None):
    """Check if a package is installed"""
    if import_name is None:
        import_name = package_name
    
    try:
        importlib.import_module(import_name)
        print(f"✅ {package_name} is installed")
        return True
    except ImportError:
        print(f"❌ {package_name} is NOT installed")
        return False

def main():
    """Main verification function"""
    print("🔍 Verifying Aleyo Website Builder Installation")
    print("================================================")
    print()
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    print()
    print("Checking required packages:")
    print("-" * 40)
    
    # Core packages
    packages = [
        ("fastapi", "fastapi"),
        ("uvicorn", "uvicorn"),
        ("pydantic", "pydantic"),
        ("SQLAlchemy", "sqlalchemy"),
        ("alembic", "alembic"),
        ("python-jose", "jose"),
        ("passlib", "passlib"),
        ("bcrypt", "bcrypt"),
        ("email-validator", "email_validator"),
        ("python-dotenv", "dotenv"),
        ("httpx", "httpx"),
        ("websockets", "websockets"),
        ("python-multipart", "multipart"),
    ]
    
    all_installed = True
    for package_name, import_name in packages:
        if not check_package(package_name, import_name):
            all_installed = False
    
    print()
    print("-" * 40)
    
    if all_installed:
        print("🎉 All required packages are installed successfully!")
        print()
        print("Next steps:")
        print("  1. Create .env file with your configuration")
        print("  2. Initialize database: alembic upgrade head")
        print("  3. Start the server: uvicorn backend.main:app --reload")
    else:
        print("⚠️  Some packages are missing. Run:")
        print("   pip install -r requirements.txt")
        print("   or")
        print("   ./install.sh")
        sys.exit(1)

if __name__ == "__main__":
    main()