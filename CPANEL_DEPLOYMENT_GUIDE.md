# cPanel Deployment Guide for Loan Update System

This guide will help you deploy the Loan Update System on your cPanel hosting where another app with a domain name is already running.

## Prerequisites

- cPanel hosting with Node.js support
- MySQL database access via cPanel
- Terminal/SSH access to your cPanel server
- Another app already running on your domain

## Step-by-Step Deployment

### Step 1: Access Your cPanel Account

1. Log into your cPanel account
2. Find "Node.js App" in the software section
3. Click on it to open the Node.js application manager

### Step 2: Create a New Node.js Application

1. Click "Create Application"
2. Configure as follows:
   - **Node.js Version**: Latest stable (v16 or higher)
   - **Application Mode**: Production
   - **Application Root**: `/home/yourusername/loan-system` (or choose a folder)
   - **Application URL**: **LEAVE THIS FIELD EMPTY** or click "Create" to auto-generate
   - **Application Startup File**: `server.js`
   - **Passenger Log File**: Leave default

3. Click "Create" button
4. **Save the auto-generated Application URL** - you'll need this later!

**Important:** cPanel will automatically generate a URL like:
- `http://loan-system.yourdomain.com` (subdomain)
- or `http://yourdomain.com:3000` (port-based)
- or `http://yourdomain.com/loan-system` (path-based)

**No domain purchase needed!** The URL will use your existing domain.

### Step 3: Create MySQL Database via cPanel

1. Go to "MySQL Databases" in cPanel
2. Create a new database:
   - **Database Name**: `username_loan_system` (or your preferred name)
   - Click "Create Database"
3. Create a database user:
   - **Username**: `username_loan_user`
   - **Password**: Generate a strong password
   - Click "Create User"
4. Add user to database:
   - Select the user and database
   - Click "Add"
   - Grant **ALL PRIVILEGES**
   - Click "Make Changes"

**Note down:**
- Database name: `username_loan_system`
- Database user: `username_loan_user`
- Database password: (the one you created)

### Step 4: Upload Project Files

**Option A: Using File Manager**
1. Go to "File Manager" in cPanel
2. Navigate to your loan-system folder (created in Step 2)
3. Upload these files from your local computer:
   - `server.js`
   - `package.json`
   - `ecosystem.config.js`
   - `complete_setup.js`
   - `add_all_users_fixed.js`
   - Folder: `public/` (with all files)
   - Folder: `logs/` (create if doesn't exist)

**Option B: Using SSH/Terminal**
1. Go to "Terminal" in cPanel
2. Navigate to your directory:
   ```bash
   cd ~/loan-system
   ```
3. Upload files via SCP from your local machine:
   ```bash
   # From your local machine
   scp -r * user@yourdomain.com:~/loan-system/
   ```

### Step 5: Install Dependencies

In your Terminal/SSH session:

```bash
cd ~/loan-system
npm install
```

This will install all required packages from `package.json`.

### Step 6: Create Environment Variables

1. In cPanel Node.js App manager, find your loan-system app
2. Click "Environment Variables"
3. Add these variables:

```
NODE_ENV=production
PORT=(look at your app - cPanel assigns this automatically)
DB_HOST=localhost
DB_USER=username_loan_user
DB_PASSWORD=your_database_password
DB_NAME=username_loan_system
SESSION_SECRET=generate_a_strong_random_string_here_min_32_chars
BCRYPT_SALT_ROUNDS=10
```

**Important Notes:**
- PORT is auto-assigned by cPanel - check your app settings
- Generate SESSION_SECRET using: `openssl rand -hex 32` or any random generator
- Use the exact database credentials from Step 3

### Step 7: Setup Database Tables

In Terminal/SSH:

```bash
cd ~/loan-system
node setup_database.js
```

This will:
- Create all required tables
- Import GN divisions data
- You'll see success messages if everything works

### Step 8: Add Users (Banks)

Import your bank users:

```bash
node add_all_users_fixed.js
```

This will import all users from `usernames.csv`.

### Step 9: Restart Your Node.js Application

1. Go back to "Node.js App" in cPanel
2. Find your loan-system app
3. Click "Restart"

Wait for the status to show "Running" (usually takes 30-60 seconds).

### Step 10: Access Your Application

Use the Application URL you saved in Step 2:
```
http://your-server-ip:XXXXX
or
http://loan-system.yourdomain.com
```

You should see the login page!

## Important: Multiple Apps on Same Server

Since you have another app with a domain name:

### Scenario 1: Access via Subdomain
- Set up a subdomain like `loan.yourdomain.com`
- Point it to your loan-system Node.js app
- Users access: `http://loan.yourdomain.com`

### Scenario 2: Access via Port Number
- Use the port number assigned by cPanel
- Users access: `http://yourdomain.com:XXXXX`
- You may need to configure firewall/security settings

### Scenario 3: Access via Subdirectory (Reverse Proxy)
- Requires .htaccess configuration
- More complex setup
- Not recommended unless necessary

## Troubleshooting

### App Won't Start

1. Check logs:
   - In cPanel Node.js App → Click "Logs"
   - Look for error messages

2. Common issues:
   - Wrong PORT number in env vars
   - Database connection failed (check credentials)
   - Missing environment variables
   - Dependencies not installed

### Can't Connect to Database

```bash
# Test database connection from SSH
mysql -u username_loan_user -p username_loan_system
# Enter password when prompted
# If this works, your credentials are correct
```

### View Application Logs

In cPanel → Terminal:
```bash
cd ~/loan-system
tail -f logs/combined.log
# Or
tail -f logs/err.log
```

### Restart Application

**In cPanel:**
- Node.js App → Find your app → Click "Restart"

**Via SSH:**
```bash
cd ~/loan-system
npm run pm2:restart
# Or if using cPanel's PM2
pm2 restart loan-update-system
```

## Management Commands

After deployment, you can manage your app using:

```bash
# Check application status
pm2 status

# View logs
pm2 logs loan-update-system

# Restart
pm2 restart loan-update-system

# Stop
pm2 stop loan-update-system
```

## Security Recommendations

1. **Change default passwords** after first login
2. **Use strong SESSION_SECRET** (at least 32 characters)
3. **Regular backups** of your database via cPanel
4. **Update dependencies** regularly: `npm update`
5. **Monitor logs** for suspicious activity

## Database Backup

Via cPanel:
1. Go to "Backup" in cPanel
2. Click "Generate/Download a Full Website Backup"
3. Or use phpMyAdmin to export your `loan_system` database

## Need Help?

Common issues:
- **Port conflicts**: Make sure your PORT env var matches cPanel's assignment
- **Permission errors**: Contact cPanel support to fix file permissions
- **Database errors**: Verify credentials in environment variables
- **Module not found**: Run `npm install` again

## Next Steps

Once your app is running:
1. Test login with default credentials
2. Change default passwords
3. Configure backups
4. Monitor application logs
5. Set up SSL certificate if needed (Let's Encrypt in cPanel)

## Default Login Credentials

After setup, you can log in with credentials from `usernames.csv`:
- Example: `gampaha_bank_01` / `password123`
- Change these immediately after first login!

---

**Congratulations!** Your Loan Update System is now deployed on cPanel! 🎉

