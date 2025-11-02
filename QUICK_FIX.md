# Quick Fix Guide for "Connection Timeout" Error

## Immediate Steps to Fix

### Step 1: Upload Updated Files to VPS

Upload these files to your VPS:
- `server.js` (already fixed with the root route fix)

### Step 2: SSH into Your VPS Server

```bash
ssh user@162.214.204.205
```

### Step 3: Navigate to Application Directory

```bash
cd /path/to/loan-update-system
# Replace /path/to with your actual path
```

### Step 4: Make Diagnostic Script Executable

```bash
chmod +x check_vps.sh
./check_vps.sh
```

This will show you what's wrong.

### Step 5: Common Fixes

#### Fix A: If Application is Not Running

```bash
# Start the application
npm run pm2:start

# Check status
pm2 status
```

#### Fix B: If Port 3000 is Blocked by Firewall

```bash
# For Ubuntu/Debian
sudo ufw allow 3000
sudo ufw reload

# For CentOS/RHEL
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

#### Fix C: If Using Cloud Provider

**Go to your cloud provider's dashboard** (AWS, DigitalOcean, Linode, etc.) and:

1. Find Security Groups or Firewall settings
2. Add inbound rule for port 3000
3. Allow traffic from 0.0.0.0/0 (or your specific IP)

### Step 6: Verify It Works

From your local computer, try:

```bash
# Windows PowerShell
Test-NetConnection -ComputerName 162.214.204.205 -Port 3000

# Should return: TcpTestSucceeded : True
```

Then open in browser:
```
http://162.214.204.205:3000
```

You should be redirected to the login page.

## Need More Help?

See detailed instructions in:
- **VPS_CHECKLIST.md** - Comprehensive troubleshooting guide
- **TROUBLESHOOTING.md** - Common issues and solutions
- **check_vps.sh** - Automated diagnostic script

## Still Stuck?

1. Check if your VPS provider has a support chat
2. Verify your VPS instance is running (not stopped/suspended)
3. Try accessing from a different network
4. Check if your ISP is blocking the connection


