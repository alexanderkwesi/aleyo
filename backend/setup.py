"""
Setup configuration for Aleyo Website Builder backend
Compatible with Python 3.14.3+
"""

from setuptools import setup, find_packages
import os

# Read requirements
def read_requirements():
    with open('requirements.txt') as f:
        return [line.strip() for line in f if line.strip() and not line.startswith('#')]

# Read long description
def read_long_description():
    with open('README.md', encoding='utf-8') as f:
        return f.read()

setup(
    name='aleyo-website-builder',
    version='1.0.0',
    description='AI-powered website builder with voice commands and 40+ designs',
    long_description=read_long_description(),
    long_description_content_type='text/markdown',
    author='Aleyo Team',
    author_email='team@aleyo.com',
    url='https://github.com/aleyo/website-builder',
    packages=find_packages(exclude=['tests', 'tests.*']),
    include_package_data=True,
    python_requires='>=3.14',
    install_requires=read_requirements(),
    extras_require={
        'dev': [
            'pytest>=8.0.0',
            'pytest-asyncio>=0.24.0',
            'pytest-cov>=6.0.0',
            'black>=24.0.0',
            'isort>=5.13.0',
            'flake8>=7.0.0',
            'mypy>=1.8.0',
            'pre-commit>=4.0.0',
        ],
        'postgres': [
            'psycopg2-binary>=2.9.0',
            'asyncpg>=0.30.0',
        ],
        'mysql': [
            'pymysql>=1.1.0',
        ],
        'redis': [
            'redis>=5.0.0',
        ],
        'all': [
            'psycopg2-binary>=2.9.0',
            'asyncpg>=0.30.0',
            'pymysql>=1.1.0',
            'redis>=5.0.0',
        ],
    },
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3.14',
        'Operating System :: OS Independent',
    ],
    entry_points={
        'console_scripts': [
            'aleyo-backend=backend.cli:main',
        ],
    },
    zip_safe=False,
)