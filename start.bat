@echo off
echo 🎵 Starting ConcertHub - Music Event Management System
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd ..\frontend
npm install

REM Go back to root
cd ..

REM Seed the database
echo 🌱 Seeding database with sample data...
cd backend
node seedData.js
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🎯 Login Credentials:
echo    Admin: admin@concerthub.com / admin123
echo    User:  john@example.com / user123
echo.
echo 🚀 Starting the application...
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo.

REM Start the application
npm run dev

pause
