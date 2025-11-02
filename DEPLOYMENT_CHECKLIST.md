# cPanel Deployment Checklist

Use this checklist to ensure successful deployment of the Loan Update System on your cPanel hosting.

## Pre-Deployment

- [ ] cPanel login credentials ready
- [ ] SSH/Terminal access available (if needed)
- [ ] Another app is running on the server (you confirmed this)
- [ ] Project files ready on local computer
- [ ] Read CPANEL_DEPLOYMENT_GUIDE.md

## Step 1: Create Node.js Application

- [ ] Logged into cPanel
- [ ] Found "Node.js App" in software section
- [ ] Clicked "Create Application"
- [ ] Set Node.js version to v16 or higher
- [ ] Set Application Mode: Production
- [ ] Set Application Root: `/home/username/loan-system`
- [ ] Set Application Startup File: `server.js`
- [ ] Clicked "Create"
- [ ] **SAVED the Application URL** (critical!)

## Step 2: Database Setup

- [ ] Went to "MySQL Databases" in cPanel
- [ ] Created new database: `username_loan_system`
- [ ] Created new database user
- [ ] Set strong database password
- [ ] Added user to database
- [ ] Granted ALL PRIVILEGES to user
- [ ] **SAVED database credentials** (username, password, database name)

## Step 3: Upload Files

- [ ] All files uploaded to: `/home/username/loan-system/`
- [ ] `server.js` uploaded
- [ ] `package.json` uploaded
- [ ] `complete_setup.js` uploaded
- [ ] `add_all_users_fixed.js` uploaded
- [ ] `database_schema.sql` uploaded (optional, for reference)
- [ ] `ecosystem.config.js` uploaded
- [ ] `usernames.csv` uploaded
- [ ] `GN List (1).csv` uploaded
- [ ] `public/` folder uploaded (with all HTML files)
- [ ] `logs/` folder exists (created if not)

## Step 4: Install Dependencies

- [ ] Accessed Terminal/SSH
- [ ] Navigated to `/home/username/loan-system`
- [ ] Ran: `npm install`
- [ ] Installation completed without errors
- [ ] All packages installed successfully

## Step 5: Environment Variables

- [ ] Found "Environment Variables" in Node.js App
- [ ] Added `NODE_ENV=production`
- [ ] Added `PORT=<cPanel assigned port>` (important!)
- [ ] Added `HOST=0.0.0.0`
- [ ] Added `DB_HOST=localhost`
- [ ] Added `DB_USER=<your database user>`
- [ ] Added `DB_PASSWORD=<your database password>`
- [ ] Added `DB_NAME=<your database name>`
- [ ] Generated strong `SESSION_SECRET` (32+ chars)
- [ ] Added `SESSION_SECRET=<generated value>`
- [ ] Added `BCRYPT_SALT_ROUNDS=10`
- [ ] All variables saved

## Step 6: Database Setup

- [ ] Ran: `node setup_database.js`
- [ ] Database connection successful
- [ ] Tables created successfully
- [ ] GN divisions imported successfully
- [ ] No errors in output

## Step 7: Import Users

- [ ] Ran: `node add_all_users_fixed.js`
- [ ] All users imported successfully
- [ ] No errors in output

## Step 8: Restart Application

- [ ] Went back to cPanel Node.js App
- [ ] Found loan-system application
- [ ] Clicked "Restart"
- [ ] Waited 30-60 seconds
- [ ] Status shows "Running"
- [ ] Green checkmark visible

## Step 9: Test Application

- [ ] Accessed Application URL from Step 1
- [ ] Login page loads correctly
- [ ] Can see the application interface
- [ ] No 404 errors
- [ ] No 500 errors

## Step 10: Test Login

- [ ] Attempted login with test credentials
- [ ] Login successful
- [ ] Redirected to dashboard
- [ ] Dashboard displays correctly
- [ ] All navigation works

## Post-Deployment Security

- [ ] Changed default passwords immediately
- [ ] Verified strong SESSION_SECRET is in use
- [ ] Checked database credentials are secure
- [ ] Monitored application logs for errors
- [ ] Set up regular backups

## Documentation

- [ ] Saved Application URL for users
- [ ] Documented database credentials (securely)
- [ ] Saved environment variables list
- [ ] Created user guide for bank users
- [ ] Set up monitoring/alerting if needed

## Troubleshooting Completed

- [ ] Resolved any deployment errors
- [ ] Fixed any configuration issues
- [ ] Verified all functionality works
- [ ] Tested on different browsers
- [ ] Checked mobile responsiveness (if applicable)

## Final Verification

- [ ] Application accessible from browser
- [ ] Login page works
- [ ] Dashboard loads
- [ ] Can submit loan data
- [ ] Database operations work correctly
- [ ] Application logs show no errors
- [ ] PM2/Process manager shows app running

## Handoff Checklist

- [ ] All users have access credentials
- [ ] User documentation provided
- [ ] Support contact information shared
- [ ] Backup procedures documented
- [ ] Monitoring in place
- [ ] Team trained on application

---

## Quick Reference

**Application URL**: _________________________

**Database Details**:
- Host: localhost
- User: _________________________
- Password: _________________________
- Name: _________________________

**Login Credentials** (Change after first use):
- Username: _________________________
- Password: _________________________

**Important Links**:
- cPanel: _________________________
- Application Manager: _________________________
- MySQL Databases: _________________________
- File Manager: _________________________

---

✅ **Deployment Complete!**

Need help? Refer to:
- CPANEL_DEPLOYMENT_GUIDE.md (detailed guide)
- CPANEL_QUICK_SETUP.txt (quick reference)
- Troubleshooting section in deployment guide

