#!/bin/bash

# cPanel Setup Script for Loan Update System
# Run this on your server after uploading files

echo "=========================================="
echo "Loan System cPanel Setup"
echo "=========================================="
echo ""

# Check if in correct directory
if [ ! -f "server.js" ]; then
    echo "ERROR: server.js not found"
    echo "Please run this script from your application directory"
    exit 1
fi

echo "✓ Found server.js"
echo ""

# Install dependencies
echo "Step 1: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "✓ Found .env file"
else
    echo "⚠️  No .env file found"
    echo "   Make sure you've set environment variables in cPanel"
fi
echo ""

# Setup database
echo "Step 2: Setting up database..."
node setup_database.js
if [ $? -ne 0 ]; then
    echo "ERROR: Database setup failed"
    echo "Check your database credentials in environment variables"
    exit 1
fi
echo "✓ Database setup complete"
echo ""

# Import users
echo "Step 3: Importing users..."
if [ -f "add_all_users_fixed.js" ]; then
    node add_all_users_fixed.js
    echo "✓ Users imported"
else
    echo "⚠️  add_all_users_fixed.js not found, skipping user import"
fi
echo ""

# Create logs directory if doesn't exist
if [ ! -d "logs" ]; then
    mkdir logs
    echo "✓ Created logs directory"
fi

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Check environment variables in cPanel Node.js App"
echo "2. Restart your application in cPanel"
echo "3. Access your app using the Application URL"
echo ""
echo "View logs: tail -f logs/combined.log"
echo ""

