#!/bin/bash

# VPS Deployment Script for Loan Update System
# This script automates the deployment process on a Ubuntu VPS

echo "=== Loan Update System VPS Deployment ==="
echo "This script will deploy the Loan Update System on your Ubuntu VPS"
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
  echo "Please do not run this script as root"
  exit 1
fi

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed"
fi

# Install MySQL if not present
if ! command -v mysql &> /dev/null; then
    echo "Installing MySQL..."
    sudo apt install mysql-server -y
else
    echo "MySQL is already installed"
fi

# Install PM2 globally
echo "Installing PM2..."
sudo npm install pm2 -g

# Create database and user
echo "Setting up MySQL database..."
echo "Please enter your MySQL root password:"
sudo mysql -u root -p <<MYSQL_SCRIPT
CREATE DATABASE IF NOT EXISTS loan_system;
CREATE USER IF NOT EXISTS 'loan_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON loan_system.* TO 'loan_user'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT

echo "MySQL setup completed."

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Setup database tables and data
echo "Setting up database tables and importing data..."
node setup_database.js

echo ""
echo "=== Deployment Completed ==="
echo ""
echo "Next steps:"
echo "1. Update the .env file with your actual database password and session secret"
echo "2. Start the application with: npm run pm2:start"
echo "3. Access your application at: http://your_vps_ip:3000"
echo ""
echo "You can manage the application using:"
echo "  npm run pm2:status    - Check application status"
echo "  npm run pm2:logs      - View application logs"
echo "  npm run pm2:stop      - Stop the application"
echo "  npm run pm2:restart   - Restart the application"