# Loan Update System

A secure web application allowing 88 banks to enter loan data with authentication and MySQL storage.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set up the database:
   ```
   node setup_database.js
   ```

3. Configure environment variables in `.env` file

## Running the Application

### Development Mode
```
npm run dev
```

### Production Mode with PM2 (Recommended for VPS)

1. Install PM2 globally (if not already installed):
   ```
   npm install pm2 -g
   ```

2. Start the application with PM2:
   ```
   npm run pm2:start
   ```

3. View application status:
   ```
   npm run pm2:status
   ```

4. View application logs:
   ```
   npm run pm2:logs
   ```

5. Stop the application:
   ```
   npm run pm2:stop
   ```

6. Restart the application:
   ```
   npm run pm2:restart
   ```

7. Remove the application from PM2:
   ```
   npm run pm2:delete
   ```

<<<<<<< HEAD
## Deployment Options

### Free Deployment on Vercel + Supabase (Recommended for Testing)

For a completely free deployment option using Vercel for hosting and Supabase for the database:

- [VERCEL_SUPABASE_DEPLOYMENT.md](VERCEL_SUPABASE_DEPLOYMENT.md) - Complete deployment guide
- [vercel.json](vercel.json) - Vercel configuration file
- [supabase/migrations/001_loan_system_schema.sql](supabase/migrations/001_loan_system_schema.sql) - Database schema for Supabase
- [.env.example](.env.example) - Example environment variables

### cPanel Shared Hosting (Recommended for Easy Setup)

If you're using cPanel shared hosting with Node.js support:

**Quick Start:**
- [CPANEL_DEPLOYMENT_GUIDE.md](CPANEL_DEPLOYMENT_GUIDE.md) - Complete step-by-step cPanel deployment
- [CPANEL_QUICK_SETUP.txt](CPANEL_QUICK_SETUP.txt) - Quick reference guide
- [CPANEL_URL_GUIDE.md](CPANEL_URL_GUIDE.md) - **Important:** Application URL configuration (no domain needed!)
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Deployment checklist
- [env.cpanel.template](env.cpanel.template) - Environment variables template

**Perfect for:** Hosting on shared cPanel servers where another app with a domain is already running. **No separate domain purchase required!**

### VPS/Cloud Server Deployment

For deploying on your own VPS server, please refer to:
- [VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md) - Complete manual deployment guide
- [VPS_QUICK_START.md](VPS_QUICK_START.md) - Quick deployment guide
- [VPS_CHECKLIST.md](VPS_CHECKLIST.md) - Comprehensive VPS troubleshooting checklist

### Troubleshooting

- [QUICK_FIX.md](QUICK_FIX.md) - Quick fix for connection issues
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - General troubleshooting guide
- [DEPLOYMENT_README.md](DEPLOYMENT_README.md) - Overview of deployment files

Having trouble? Run the diagnostic script on your VPS:
```bash
chmod +x check_vps.sh
./check_vps.sh
```

=======
>>>>>>> 88ae652691d05537b708b91080f0b8b552195c48
## PM2 Configuration

The application uses PM2 with the following configuration:
- Maximum memory limit: 512MB
- Automatic restart on crash
- Single instance
- Log rotation to `./logs` directory

## Environment Variables

Create a `.env` file with the following variables:
```
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=loan_system
PORT=3000
<<<<<<< HEAD
HOST=0.0.0.0
SESSION_SECRET=your_secret_key_here
BCRYPT_SALT_ROUNDS=10
```

**For cPanel hosting:** Use the environment variables feature in Node.js App manager instead of a `.env` file. See [env.cpanel.template](env.cpanel.template) for reference.
=======
SESSION_SECRET=your_secret_key_here
BCRYPT_SALT_ROUNDS=10
```
>>>>>>> 88ae652691d05537b708b91080f0b8b552195c48
