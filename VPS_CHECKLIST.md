# VPS Deployment Checklist

## Issue: "Connection Timeout" when accessing 162.214.204.205:3000

Follow these steps to diagnose and fix the issue:

## 1. Verify Application is Running on VPS

**SSH into your VPS server** and run:

```bash
# Check if PM2 is running the application
pm2 status

# If not running, check the application directory
cd /path/to/loan-update-system

# Check PM2 status
npm run pm2:status

# If application is not listed, start it
npm run pm2:start

# Check the logs for errors
npm run pm2:logs
```

## 2. Test Locally on VPS Server

On the VPS itself, test if the application responds:

```bash
# Test from within the VPS
curl http://localhost:3000

# Or test with wget
wget http://localhost:3000
```

If this works, the application is running but not accessible from outside.

## 3. Check Firewall Rules

The firewall might be blocking port 3000:

### For Ubuntu/Debian (UFW):

```bash
# Check firewall status
sudo ufw status

# Allow port 3000
sudo ufw allow 3000

# If firewall is disabled, enable it
sudo ufw enable

# Verify the rule was added
sudo ufw status numbered
```

### For CentOS/RHEL (firewalld):

```bash
# Check firewall status
sudo firewall-cmd --list-all

# Allow port 3000
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload

# Verify
sudo firewall-cmd --list-ports
```

### For iptables:

```bash
# Check current rules
sudo iptables -L -n

# Add rule for port 3000
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

# Save iptables rules (Ubuntu)
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

## 4. Check Cloud Provider Firewall/Security Groups

**If using a cloud provider** (AWS, DigitalOcean, Linode, etc.), you may need to configure security groups:

### AWS EC2:
1. Go to EC2 Dashboard → Security Groups
2. Select your instance's security group
3. Inbound Rules → Edit
4. Add rule:
   - Type: Custom TCP
   - Port: 3000
   - Source: 0.0.0.0/0 (or your IP for security)
   - Save

### DigitalOcean:
1. Go to Networking → Firewalls
2. Create or edit firewall rules
3. Add inbound rule:
   - Type: Custom
   - Port: 3000
   - Protocol: TCP
   - Sources: All IPv4, All IPv6

### Linode:
1. Go to Firewalls
2. Add inbound rule:
   - Label: Node.js App
   - Type: TCP
   - Port: 3000
   - Sources: 0.0.0.0/0

## 5. Check Application Port Binding

Verify the application is listening on the correct interface:

```bash
# Check if port 3000 is listening
sudo netstat -tlnp | grep 3000

# Or use ss command
sudo ss -tlnp | grep 3000

# Should show something like:
# 0.0.0.0:3000  or  :::3000
```

If it shows `127.0.0.1:3000`, the app is only listening on localhost. Check `server.js` line 248:

```javascript
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
```

Should be `'0.0.0.0'` NOT `'localhost'` or `'127.0.0.1'`.

## 6. Check Application Logs

```bash
# View PM2 logs
pm2 logs loan-update-system

# Or view log files directly
tail -f logs/combined.log
tail -f logs/err.log

# Look for errors like:
# - Database connection errors
# - Port already in use
# - Permission denied
# - EADDRINUSE errors
```

## 7. Verify Database Connection

```bash
# Test MySQL connection
mysql -u loan_user -p

# In MySQL shell:
SHOW DATABASES;
USE loan_system;
SHOW TABLES;
EXIT;
```

If database connection fails, check `.env` file:

```bash
cat .env

# Should contain:
DB_HOST=localhost
DB_USER=loan_user
DB_PASSWORD=your_password
DB_NAME=loan_system
PORT=3000
SESSION_SECRET=your_secret
```

## 8. Test Port Accessibility

From **your local machine**, test if the port is reachable:

```bash
# Windows PowerShell
Test-NetConnection -ComputerName 162.214.204.205 -Port 3000

# Linux/Mac
telnet 162.214.204.205 3000
# Or
nc -zv 162.214.204.205 3000
```

## 9. Check Server Uptime

```bash
# Check if server is running
uptime

# Check system resources
free -h
df -h

# Check if Node.js is installed and version
node --version
npm --version
```

## 10. Quick Diagnostic Script

Run this on your VPS to check everything at once:

```bash
#!/bin/bash
echo "=== VPS Diagnostic Check ==="
echo ""
echo "1. Node.js version:"
node --version
echo ""
echo "2. PM2 status:"
pm2 status
echo ""
echo "3. Port 3000 status:"
sudo netstat -tlnp | grep 3000
echo ""
echo "4. Firewall status:"
sudo ufw status 2>/dev/null || sudo firewall-cmd --list-all 2>/dev/null
echo ""
echo "5. Application logs (last 20 lines):"
pm2 logs loan-update-system --lines 20 --nostream
echo ""
echo "=== End Diagnostic ==="
```

## Most Common Solutions

1. **Firewall is blocking**: Open port 3000 (step 3)
2. **Cloud provider firewall**: Configure security groups (step 4)
3. **App not running**: Start with `npm run pm2:start` (step 1)
4. **Wrong port binding**: Should bind to `0.0.0.0` not `localhost` (step 5)
5. **Database connection failed**: Check `.env` file (step 7)

## Still Not Working?

1. Check VPS provider's status page
2. Verify your VPS instance is running
3. Contact VPS provider support
4. Try accessing via SSH tunnel for testing:
   ```bash
   ssh -L 3000:localhost:3000 user@162.214.204.205
   ```
   Then access: `http://localhost:3000`


