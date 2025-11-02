# VPS Deployment Guide for Loan Update System

This guide will help you deploy the Loan Update System on your purchased VPS server without a domain name.

## Prerequisites

1. A VPS server with Ubuntu 20.04 LTS or newer (recommended)
2. SSH access to your VPS
3. A MySQL server installed on your VPS
4. Node.js v14 or higher installed on your VPS

## Step 1: Prepare Your VPS

### Update Your System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Required Software
```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL (if not already installed)
sudo apt install mysql-server -y

# Install PM2 globally
sudo npm install pm2 -g
```

## Step 2: Set Up MySQL Database

### Secure MySQL Installation
```bash
sudo mysql_secure_installation
```

### Create Database and User
```bash
# Access MySQL
sudo mysql -u root -p

# In MySQL shell, run these commands:
CREATE DATABASE loan_system;
CREATE USER 'loan_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON loan_system.* TO 'loan_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 3: Upload Application Files

You can use `scp` or `rsync` to upload your application files to the VPS:

```bash
# From your local machine, upload the project files
scp -r /path/to/Loan\ Update\ System user@your_vps_ip:/home/user/loan-update-system
```

Alternatively, you can clone the repository if it's available on GitHub:
```bash
git clone https://github.com/RoshanNirosha/loan-update-system.git
```

## Step 4: Configure Environment Variables

Navigate to your project directory and edit the `.env` file:

```bash
cd /home/user/loan-update-system
nano .env
```

Update the following values:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=loan_user
DB_PASSWORD=your_secure_password_here
DB_NAME=loan_system

# Server Configuration
PORT=3000
SESSION_SECRET=your_very_secure_random_string_here

# Security
BCRYPT_SALT_ROUNDS=10
```

Make sure to replace:
- `your_secure_password_here` with the actual password you set for the MySQL user
- `your_very_secure_random_string_here` with a strong random string for session security

## Step 5: Install Dependencies and Set Up Database

```bash
# Install Node.js dependencies
npm install

# Set up the database schema and import data
node setup_database.js
```

## Step 6: Test the Application

Before running in production mode, test the application:

```bash
# Start the application in development mode
npm run dev
```

Visit `http://your_vps_ip:3000` to verify the application is working correctly.

To stop the development server, press `Ctrl+C`.

## Step 7: Start Application with PM2

PM2 is a process manager that will keep your application running even after server restarts:

```bash
# Start the application with PM2
npm run pm2:start

# Check the status
npm run pm2:status

# View logs
npm run pm2:logs
```

## Step 8: Set Up Firewall (Optional but Recommended)

```bash
# Allow SSH (port 22)
sudo ufw allow ssh

# Allow HTTP (port 80) - if you plan to use a reverse proxy
sudo ufw allow http

# Allow your application port (3000)
sudo ufw allow 3000

# Enable firewall
sudo ufw enable
```

## Accessing Your Application

Once deployed, you can access your application at:
```
http://your_vps_ip:3000
```

Replace `your_vps_ip` with your actual VPS IP address.

## Default Login Credentials

After setup, you can log in with these default credentials:
- Username: `gampaha_bank_01`
- Password: `password123`

And:
- Username: `negombo_bank_01`
- Password: `password123`

## Managing the Application

You can manage your application using the provided scripts:

```bash
# Start the application
npm run pm2:start

# Stop the application
npm run pm2:stop

# Restart the application
npm run pm2:restart

# View application status
npm run pm2:status

# View application logs
npm run pm2:logs

# Remove the application from PM2
npm run pm2:delete
```

Alternatively, you can use the `manage.bat` script if you're accessing the VPS from a Windows machine.

## Troubleshooting

1. **Database Connection Issues**: Verify your `.env` file contains the correct database credentials.

2. **Port Already in Use**: Check if another application is using port 3000:
   ```bash
   lsof -i :3000
   ```

3. **PM2 Issues**: Check PM2 logs for detailed error information:
   ```bash
   pm2 logs loan-update-system
   ```

4. **Application Not Accessible**: Ensure your firewall allows connections on port 3000.

## Updating the Application

To update the application:

1. Stop the current instance:
   ```bash
   npm run pm2:stop
   ```

2. Upload new files or pull from repository:
   ```bash
   git pull origin master
   ```

3. Install any new dependencies:
   ```bash
   npm install
   ```

4. Start the application:
   ```bash
   npm run pm2:start
   ```

## Security Considerations

1. Change the default passwords for the sample users after first login
2. Use a strong SESSION_SECRET in your `.env` file
3. Consider setting up a reverse proxy with Nginx for additional security
4. Regularly update your system and dependencies
5. Restrict database access to localhost only