# VPS Quick Start Guide

This guide provides a quick way to deploy the Loan Update System on your VPS.

## Prerequisites

1. Ubuntu 20.04 LTS or newer VPS
2. SSH access to your VPS
3. Root or sudo privileges

## Quick Deployment Steps

1. **Update your system:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install required software:**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MySQL
   sudo apt install mysql-server -y
   
   # Install PM2
   sudo npm install pm2 -g
   ```

3. **Set up MySQL database:**
   ```bash
   sudo mysql -u root -p
   ```
   
   In the MySQL shell:
   ```sql
   CREATE DATABASE loan_system;
   CREATE USER 'loan_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
   GRANT ALL PRIVILEGES ON loan_system.* TO 'loan_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Upload application files** to your VPS (using scp, rsync, or git clone)

5. **Configure environment variables:**
   Edit the `.env` file and update:
   ```env
   DB_HOST=localhost
   DB_USER=loan_user
   DB_PASSWORD=your_secure_password_here
   DB_NAME=loan_system
   PORT=3000
   SESSION_SECRET=your_very_secure_random_string_here
   ```

6. **Install dependencies and set up database:**
   ```bash
   npm install
   node setup_database.js
   ```

7. **Start the application:**
   ```bash
   npm run pm2:start
   ```

8. **Access your application** at `http://your_vps_ip:3000`

## Management Commands

- Check status: `npm run pm2:status`
- View logs: `npm run pm2:logs`
- Stop application: `npm run pm2:stop`
- Restart application: `npm run pm2:restart`

## Security Notes

- Change the default user passwords after first login
- Use a strong SESSION_SECRET
- Consider setting up a firewall to restrict access