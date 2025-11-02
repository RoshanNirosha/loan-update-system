#!/bin/bash

# VPS Diagnostic Script for Loan Update System
# Run this on your VPS to check if everything is configured correctly

echo "==================================="
echo "VPS Diagnostic Check"
echo "==================================="
echo ""

# Check Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null; then
    echo "   ✓ Node.js version: $(node --version)"
else
    echo "   ✗ Node.js is not installed"
fi
echo ""

# Check PM2
echo "2. Checking PM2..."
if command -v pm2 &> /dev/null; then
    echo "   ✓ PM2 is installed"
    echo ""
    echo "   PM2 Status:"
    pm2 status
else
    echo "   ✗ PM2 is not installed"
    echo "   Run: sudo npm install pm2 -g"
fi
echo ""

# Check application
echo "3. Checking application status..."
if pm2 describe loan-update-system &> /dev/null; then
    echo "   ✓ Application is registered with PM2"
    pm2 info loan-update-system | grep -E "status|uptime|restarts"
else
    echo "   ✗ Application is NOT running with PM2"
    echo "   Run: npm run pm2:start"
fi
echo ""

# Check port 3000
echo "4. Checking port 3000..."
PORT_CHECK=$(sudo netstat -tlnp 2>/dev/null | grep :3000 || sudo ss -tlnp 2>/dev/null | grep :3000)
if [ -z "$PORT_CHECK" ]; then
    echo "   ✗ Port 3000 is NOT listening"
    echo "   Application may not be running"
else
    echo "   ✓ Port 3000 is listening:"
    echo "   $PORT_CHECK"
fi
echo ""

# Check firewall
echo "5. Checking firewall..."
if command -v ufw &> /dev/null; then
    echo "   UFW Status:"
    sudo ufw status | grep "3000" && echo "   ✓ Port 3000 is allowed" || echo "   ✗ Port 3000 is NOT allowed"
elif command -v firewall-cmd &> /dev/null; then
    echo "   Firewalld Status:"
    sudo firewall-cmd --list-ports | grep "3000" && echo "   ✓ Port 3000 is allowed" || echo "   ✗ Port 3000 is NOT allowed"
else
    echo "   No firewall found (check iptables manually)"
fi
echo ""

# Check MySQL
echo "6. Checking MySQL connection..."
if command -v mysql &> /dev/null; then
    if [ -f .env ]; then
        source .env
        if mysql -u "$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME;" 2>/dev/null; then
            echo "   ✓ MySQL connection successful"
        else
            echo "   ✗ MySQL connection failed"
            echo "   Check your .env file database credentials"
        fi
    else
        echo "   ! .env file not found"
    fi
else
    echo "   ✗ MySQL client not installed"
fi
echo ""

# Check application logs
echo "7. Recent application logs (last 10 lines):"
echo ""
pm2 logs loan-update-system --lines 10 --nostream 2>/dev/null || echo "   No logs available"
echo ""

# Check system resources
echo "8. System resources:"
echo "   $(free -h | grep Mem)"
echo "   $(df -h / | tail -1)"
echo ""

echo "==================================="
echo "Diagnostic Complete"
echo "==================================="
echo ""
echo "If you see issues above, check VPS_CHECKLIST.md for solutions"

