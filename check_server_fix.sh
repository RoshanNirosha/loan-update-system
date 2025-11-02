#!/bin/bash

echo "========================================"
echo "Checking if server.js has the fix"
echo "========================================"
echo ""

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "ERROR: server.js not found in current directory"
    exit 1
fi

echo "✓ server.js found"
echo ""

# Check for old code (without fix)
if grep -q "app.get('/', isAuthenticated, (req, res) => {" server.js; then
    echo "❌ OLD CODE FOUND - Fix NOT applied"
    echo ""
    echo "Current code around line 243:"
    grep -A 3 "app.get('/'," server.js | grep -A 3 "isAuthenticated"
    echo ""
    echo "Need to replace with:"
    echo "app.get('/', (req, res) => {"
    echo "    if (req.session.userId) {"
    echo "        res.redirect('/dashboard');"
    echo "    } else {"
    echo "        res.redirect('/login');"
    echo "    }"
    echo "});"
    echo ""
    exit 1
fi

# Check for new code (with fix)
if grep -q "if (req.session.userId)" server.js | grep -q "app.get('/', (req, res) => {"; then
    # Double check the context
    if grep -A 5 "app.get('/', (req, res) => {" server.js | grep -q "if (req.session.userId)"; then
        echo "✅ FIX IS APPLIED!"
        echo ""
        echo "Current code around line 243:"
        grep -A 5 "app.get('/', (req, res) => {" server.js | head -6
        echo ""
        echo "✓ Root route will redirect to /login for non-authenticated users"
        exit 0
    fi
fi

# Alternative check - look for the specific pattern
if grep -q 'if (req\.session\.userId)' server.js; then
    context=$(grep -B 2 -A 5 'if (req\.session\.userId)' server.js | grep -A 5 "app.get('/',")
    if [ ! -z "$context" ]; then
        echo "✅ FIX IS APPLIED!"
        echo ""
        echo "Current code around line 243:"
        echo "$context"
        echo ""
        exit 0
    fi
fi

# If we get here, something is odd
echo "⚠️  Cannot determine if fix is applied"
echo ""
echo "Checking around line 243:"
sed -n '240,250p' server.js
echo ""
echo "Please check manually"

