#!/bin/bash

# ConcertHub - Quick Start Script
echo "🎵 Starting ConcertHub - Music Event Management System"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB doesn't seem to be running. Please start MongoDB first."
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Ubuntu: sudo systemctl start mongod"
    echo "   On Windows: net start MongoDB"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

# Go back to root
cd ..

# Seed the database
echo "🌱 Seeding database with sample data..."
cd backend && node seedData.js
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Login Credentials:"
echo "   Admin: admin@concerthub.com / admin123"
echo "   User:  john@example.com / user123"
echo ""
echo "🚀 Starting the application..."
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""

# Start the application
npm run dev
