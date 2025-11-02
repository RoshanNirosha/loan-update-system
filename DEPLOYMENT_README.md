# Deployment Files

This directory contains files to help you deploy the Loan Update System on your VPS server.

## Files Included

1. **[VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md)** - A comprehensive guide for manually deploying the application on a VPS
2. **[vps_deploy.sh](vps_deploy.sh)** - An automated deployment script for Ubuntu VPS (BETA)
3. **[ecosystem.config.js](ecosystem.config.js)** - PM2 configuration file for process management

## Deployment Options

### Option 1: Manual Deployment (Recommended)
Follow the detailed instructions in [VPS_DEPLOYMENT_GUIDE.md](VPS_DEPLOYMENT_GUIDE.md) to manually deploy the application. This gives you full control over each step of the process.

### Option 2: Automated Deployment (BETA)
Use the [vps_deploy.sh](vps_deploy.sh) script to automate most of the deployment process on an Ubuntu VPS:

```bash
chmod +x vps_deploy.sh
./vps_deploy.sh
```

Note: This script is in BETA and should be reviewed before use in production environments.

## Accessing Your Application

After deployment, you can access your application at:
```
http://your_vps_ip:3000
```

Replace `your_vps_ip` with your actual VPS IP address.

## Default Credentials

After setup, you can log in with these default credentials:
- Username: `gampaha_bank_01`
- Password: `password123`

And:
- Username: `negombo_bank_01`
- Password: `password123`

Remember to change these passwords after first login for security.