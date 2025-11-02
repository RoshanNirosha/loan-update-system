#!/bin/bash
# Commands to run ON YOUR SERVER (not locally)
# Run these commands in your SSH session at: /home/nextsril/lu1

echo "========================================"
echo "Loan System Server Diagnostic"
echo "========================================"
echo ""

echo "1. Current directory:"
pwd
echo ""

echo "2. PM2 Status:"
pm2 status
echo ""

echo "3. Application logs (last 20 lines):"
pm2 logs loan-update-system --lines 20 --nostream
echo ""

echo "4. Checking if server.js has the fix..."
if grep -q "if (req.session.userId)" server.js; then
    echo "   ✓ FIX IS APPLIED in server.js"
else
    echo "   ✗ FIX IS NOT APPLIED - need to update server.js"
    echo "   Edit server.js and change lines 243-245"
fi
echo ""

echo "5. List of files in current directory:"
ls -la
echo ""

echo "6. Check if .env file exists:"
if [ -f .env ]; then
    echo "   ✓ .env file exists"
    echo "   Contents:"
    cat .env
else
    echo "   ✗ .env file NOT found"
fi
echo ""

echo "7. Check public directory:"
ls -la public/
echo ""

echo "========================================"
echo "To apply the fix, edit server.js:"
echo "========================================"
echo "nano server.js"
echo ""
echo "Change lines 243-245 from:"
echo "  app.get('/', isAuthenticated, (req, res) => {"
echo "      res.redirect('/dashboard');"
echo "  });"
echo ""
echo "To:"
echo "  app.get('/', (req, res) => {"
echo "      if (req.session.userId) {"
echo "          res.redirect('/dashboard');"
echo "      } else {"
echo "          res.redirect('/login');"
echo "      }"
echo "  });"
echo ""
echo "Then restart: pm2 restart loan-update-system"
echo "========================================"

