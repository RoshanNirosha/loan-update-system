# cPanel Node.js App - URL Configuration Guide

## Your Situation
✅ You have cPanel hosting  
✅ Another app with a domain is already running  
❌ No separate domain purchased for this loan app  

## Solution: cPanel Auto-Generated URL

### Step 1: Creating the Application URL

When you create the Node.js application in cPanel:

1. **Fill in all required fields:**
   - Node.js Version: Choose latest (v16 or higher)
   - Application Mode: Production
   - Application Root: `/home/yourusername/loan-system`
   - Application Startup File: `server.js`

2. **For "Application URL" field:**
   - **DO NOT** enter anything manually
   - **DO NOT** try to create a URL
   - **LEAVE IT EMPTY** or **CLICK "CREATE"** button directly

3. **Click the "CREATE" button**

   cPanel will **automatically generate** a URL like one of these:
   
   **Option A: Subdomain-based**
   ```
   http://loan-system.yourdomain.com
   http://loansystem.yourdomain.com  
   http://loan-123.yourdomain.com
   ```
   
   **Option B: Port-based**
   ```
   http://yourdomain.com:12345
   http://your-ip-address:12345
   ```
   
   **Option C: Path-based**
   ```
   http://yourdomain.com/loan-system
   ```

### Step 2: Save the Generated URL

**IMPORTANT:** After cPanel creates the URL, you'll see it displayed. **Save it immediately!**

The URL will look something like:
```
Application URL: http://loan-system.yourdomain.com
or
Application URL: http://yourdomain.com:3000
```

**Copy this URL** - you'll need it to:
- Access your application
- Share with users
- Configure any integrations
- Set as your SESSION_SECRET callback URL (if needed)

### Step 3: No Domain Purchase Needed

✅ **You don't need to buy a domain**  
✅ cPanel creates the URL automatically  
✅ It uses your existing domain/subdomain  
✅ It's included with your hosting  

## Understanding the Different URL Types

### Type 1: Subdomain (Most Common)
**Example:** `http://loan-system.yourdomain.com`

- cPanel creates a subdomain automatically
- Uses your existing domain
- Works immediately
- **Best option for most users**

### Type 2: Port Number
**Example:** `http://yourdomain.com:3000`

- cPanel assigns an available port
- Uses your existing domain
- Requires no DNS changes
- Works if your host allows custom ports

### Type 3: Directory/Path
**Example:** `http://yourdomain.com/loan-system`

- Runs under your main domain
- Might need .htaccess configuration
- Less common, more complex

## What Happens Behind the Scenes

When you click "CREATE":

1. cPanel checks your existing domain configuration
2. Finds an available subdomain or port
3. Configures reverse proxy/routing
4. Assigns the URL automatically
5. Shows you the result

**You don't need to do anything manually!**

## Common Questions

### Q: Can I choose my own subdomain?
**A:** Usually no, but check with your hosting provider. Some allow custom subdomain selection.

### Q: What if I don't like the generated URL?
**A:** The URL is functional. Custom subdomains typically require DNS changes or additional hosting features.

### Q: Can I use this app alongside my existing domain app?
**A:** Yes! Multiple apps can run on the same server with different URLs/subdomains.

### Q: Will the URL change later?
**A:** No. Once created, the URL remains the same unless you delete and recreate the app.

### Q: Do I need to configure DNS?
**A:** Usually no. cPanel handles DNS automatically for subdomains.

### Q: What if my hosting doesn't support Node.js URLs?
**A:** Contact your hosting provider to enable Node.js app features.

## Example Scenario

**Your Setup:**
- Main domain: `yourdomain.com` (running another app)
- New app: Loan Update System

**When you create the Node.js app:**
1. You leave "Application URL" empty
2. Click "CREATE"
3. cPanel generates: `http://loan-system.yourdomain.com`
4. You save this URL
5. Users access your app at this URL

**Result:**
- `yourdomain.com` → Your original app
- `loan-system.yourdomain.com` → Loan Update System
- Both work on the same server!

## Troubleshooting

### URL Not Displayed After Creation
1. Check the "Actions" column in Node.js App list
2. Click "Manage" or the app name
3. Look for URL in the app details

### Cannot Access the URL
1. Wait 5-10 minutes for DNS propagation
2. Clear your browser cache
3. Try accessing from a different device/network
4. Check application is running (green status)
5. Verify firewall allows the URL

### Want a Different URL
1. Check with hosting support
2. Some hosts allow custom subdomain selection
3. May require additional setup or fees

## What to Do Now

### Step-by-Step for First Time Setup

1. **Login to cPanel**
2. **Go to "Node.js App"**
3. **Click "Create Application"**
4. **Fill in:**
   - Node Version: v16 or higher
   - Mode: Production
   - Root: `/home/yourusername/loan-system`
   - Startup: `server.js`
   - **URL: Leave empty**
5. **Click "CREATE"**
6. **Copy the generated URL**
7. **Paste it somewhere safe!**

## Your Application Will Be Accessible At

After deployment, share this URL with your bank users:
```
http://[whatever-cpanel-generates]
```

Example formats you might see:
- `http://loan-system.yourdomain.com`
- `http://yourdomain.com:12345`
- `http://loansystem.yourdomain.com`

## Final Checklist

- [ ] Created Node.js app in cPanel
- [ ] Left Application URL field empty
- [ ] Clicked "CREATE" button
- [ ] Saved the auto-generated URL
- [ ] Can access the URL in a browser
- [ ] Application shows login page

## Need More Help?

If you encounter issues:
1. Check the main deployment guide: CPANEL_DEPLOYMENT_GUIDE.md
2. Review troubleshooting: TROUBLESHOOTING.md
3. Contact your hosting provider for Node.js support

---

## Summary

**For "Application URL" field in cPanel:**
1. **Leave it EMPTY**
2. **Click "CREATE"**
3. **cPanel generates URL automatically**
4. **Save the generated URL**

**That's it! No domain purchase needed!** ✅

