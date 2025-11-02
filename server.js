const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key_for_development',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Create Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL || 'your_supabase_url',
    process.env.SUPABASE_ANON_KEY || 'your_supabase_anon_key'
);

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

// Routes

// Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    
    // Query database for user
    const { data, error } = await supabase
        .from('users')
        .select('id, username, password, bank_id, division')
        .eq('username', username)
        .single();
    
    if (error || !data) {
        console.error('Database error:', error);
        return res.status(401).send('Invalid username or password');
    }
    
    const user = data;
    
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send('Invalid username or password');
    }
    
    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.bankId = user.bank_id;
    req.session.division = user.division;
    
    res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
        }
        res.redirect('/login');
    });
});

// Loan form page (protected)
app.get('/form', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loan_form.html'));
});

// Dashboard page (protected)
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Get GN divisions for user's division
app.get('/api/gn-divisions', isAuthenticated, async (req, res) => {
    const division = req.session.division;
    
    const { data, error } = await supabase
        .from('gn_divisions')
        .select('gn_division')
        .eq('division', division)
        .order('gn_division');
    
    if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    
    const gnDivisions = data.map(row => row.gn_division);
    res.json({ gnDivisions });
});

// Get loan data for user's bank
app.get('/api/loan-data', isAuthenticated, async (req, res) => {
    const bankId = req.session.bankId;
    
    const { data, error } = await supabase
        .from('loan_data')
        .select(`
            id,
            beneficiary_name,
            beneficiary_nic,
            beneficiary_gn_division,
            beneficiary_category,
            interest_rate,
            loan_type,
            project,
            loan_amount,
            loan_issued_date,
            entry_timestamp
        `)
        .eq('bank_id', bankId)
        .order('entry_timestamp', { ascending: false });
    
    if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
    
    // Calculate totals
    let totalLoans = data.length;
    let totalAmount = 0;
    
    data.forEach(loan => {
        totalAmount += parseFloat(loan.loan_amount);
    });
    
    res.json({ 
        loans: data,
        summary: {
            totalLoans: totalLoans,
            totalAmount: totalAmount
        }
    });
});

// Get user information
app.get('/api/user-info', isAuthenticated, (req, res) => {
    res.json({
        userName: req.session.username || 'User Name',
        division: req.session.division || 'Division'
    });
});

// Submit loan data
app.post('/api/loan-data', isAuthenticated, async (req, res) => {
    const {
        beneficiaryName,
        beneficiaryNIC,
        beneficiaryAddress,
        beneficiaryGNDivision,
        beneficiaryCategory,
        interestRate,
        loanType,
        project,
        loanAmount,
        loanIssuedDate
    } = req.body;
    
    const bankId = req.session.bankId;
    const userId = req.session.userId;
    
    const { data, error } = await supabase
        .from('loan_data')
        .insert([
            {
                bank_id: bankId,
                user_id: userId,
                beneficiary_name: beneficiaryName,
                beneficiary_nic: beneficiaryNIC,
                beneficiary_address: beneficiaryAddress,
                beneficiary_gn_division: beneficiaryGNDivision,
                beneficiary_category: beneficiaryCategory,
                interest_rate: interestRate,
                loan_type: loanType,
                project: project,
                loan_amount: loanAmount,
                loan_issued_date: loanIssuedDate
            }
        ])
        .select();
    
    if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to save loan data' });
    }
    
    res.json({ success: true, message: 'Loan data saved successfully' });
});

// Serve the main page
app.get('/', (req, res) => {
    console.log('Root route accessed, redirecting...');
    if (req.session.userId) {
        console.log('User authenticated, redirecting to dashboard');
        res.redirect('/dashboard');
    } else {
        console.log('User not authenticated, redirecting to login');
        res.redirect('/login');
    }
});

// Add a catch-all route for better error handling
app.use((req, res) => {
    console.log(`Route not found: ${req.originalUrl}`);
    res.status(404).json({
        status: "ERROR",
        message: "Route not found",
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        status: "ERROR",
        message: "Internal server error"
    });
});

// Start server
// Use environment variable for host, fallback to 0.0.0.0 for flexibility
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
    console.log(`Access the application at: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});