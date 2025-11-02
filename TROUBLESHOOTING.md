# Troubleshooting Guide

## Issue: "Cannot GET /162.214.204.205:3000/"

This error occurs when there's a reverse proxy configuration issue or when accessing the application incorrectly.

### Solution 1: Direct Access (Recommended)

If you don't have a reverse proxy, access the application directly at:

```
http://162.214.204.205:3000
```

**Note:** Do NOT include the path in the URL. Just use the IP address and port.

### Solution 2: Fix Root Route (Already Fixed)

The application has been updated to handle the root route properly. After uploading the updated `server.js`, restart your application:

```bash
# On your VPS server
cd /path/to/loan-update-system
npm run pm2:restart
```

### Solution 3: Check Reverse Proxy Configuration

If you have Nginx or Apache as a reverse proxy, make sure the configuration is correct.

#### For Nginx:

1. Check your Nginx configuration file (usually in `/etc/nginx/sites-enabled/`):

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

2. Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### For Apache:

1. Check your Apache VirtualHost configuration:

```apache
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/
ProxyPreserveHost On
```

2. Enable required modules and reload:

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo systemctl reload apache2
```

### Solution 4: Verify Server is Running

Check if your Node.js application is running:

```bash
# Check PM2 status
npm run pm2:status

# Or check directly with PM2
pm2 status
pm2 logs loan-update-system
```

If it's not running, start it:

```bash
npm run pm2:start
```

### Solution 5: Check Firewall

Make sure port 3000 is open:

```bash
# For Ubuntu/Debian with UFW
sudo ufw status
sudo ufw allow 3000

# For CentOS/RHEL with firewalld
sudo firewall-cmd --list-ports
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

### Solution 6: Check Application Logs

View the application logs for errors:

```bash
# PM2 logs
npm run pm2:logs

# Or view log files directly
tail -f logs/combined.log
```

## Common Issues

### Database Connection Error

If you see database connection errors in the logs:

1. Verify your `.env` file has correct database credentials
2. Check if MySQL is running: `sudo systemctl status mysql`
3. Test MySQL connection: `mysql -u loan_user -p`

### Port Already in Use

If port 3000 is already in use:

1. Check what's using the port: `sudo lsof -i :3000`
2. Either stop the conflicting service or change the PORT in `.env`
3. Restart the application

### Session Issues

If you experience session-related issues:

1. Make sure SESSION_SECRET is set in `.env`
2. Use a strong random string for SESSION_SECRET
3. Clear browser cookies and try again

## Getting Help

If you continue to experience issues:

1. Check the application logs: `npm run pm2:logs`
2. Review the VPS deployment guide: [VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)
3. Verify all prerequisites are installed correctly

