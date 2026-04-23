#!/bin/bash

# Start Backend & Frontend - Simple Startup Script
# Usage: ./start.sh

echo "=========================================="
echo "Starting Customer Management System"
echo "=========================================="
echo ""

# Check if Backend is already running
echo "🔍 Checking if Backend is running on port 8080..."
if lsof -i :8080 > /dev/null 2>&1; then
    echo "✅ Backend is already running on port 8080"
else
    echo "❌ Backend not running. Starting Backend..."
    echo ""
    echo "Opening new terminal for Backend..."
    osascript -e 'tell app "Terminal" to do script "cd /Users/admin/Documents/GitHub/Customer-Management-System/Backend/customer-management-system && ./mvnw spring-boot:run"'
    echo "⏳ Waiting for Backend to start (30 seconds)..."
    sleep 30
fi

echo ""
echo "=========================================="
echo "🔍 Checking if Frontend is running on port 5173..."
if lsof -i :5173 > /dev/null 2>&1; then
    echo "✅ Frontend is already running on port 5173"
else
    echo "❌ Frontend not running. Starting Frontend..."
    echo ""
    echo "Opening new terminal for Frontend..."
    osascript -e 'tell app "Terminal" to do script "cd /Users/admin/Documents/GitHub/Customer-Management-System/Frontend && npm run dev"'
    echo "⏳ Waiting for Frontend to start (15 seconds)..."
    sleep 15
fi

echo ""
echo "=========================================="
echo "✅ Application Started!"
echo "=========================================="
echo ""
echo "🌐 Frontend:  http://localhost:5173"
echo "🔌 Backend:   http://localhost:8080"
echo ""
echo "📌 Open your browser and go to: http://localhost:5173"
echo ""

