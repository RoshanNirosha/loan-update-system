const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Create database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
    
    // Add test users
    addTestUsers();
});

function addTestUsers() {
    const users = [
        {
            username: 'Bemmulla',
            password: 'Bemmulla1',
            bank_id: 'BANK001',
            bank_name: 'Bemmulla',
            division: 'Attanagalla'
        },
        {
            username: 'Ellakkala',
            password: 'Ellakkala2',
            bank_id: 'BANK002',
            bank_name: 'Ellakkala',
            division: 'Attanagalla'
        },
        {
            username: 'Ganemulla',
            password: 'Ganemulla35',
            bank_id: 'BANK003',
            bank_name: 'Ganemulla',
            division: 'Gampaha'
        }
    ];
    
    let insertCount = 0;
    users.forEach(user => {
        bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return;
            }
            
            const query = 'INSERT INTO users (username, password, bank_id, bank_name, division) VALUES (?, ?, ?, ?, ?)';
            db.query(query, [user.username, hash, user.bank_id, user.bank_name, user.division], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                } else {
                    console.log(`User ${user.username} inserted successfully`);
                    insertCount++;
                    if (insertCount === users.length) {
                        console.log(`Inserted ${insertCount} test users`);
                        db.end();
                    }
                }
            });
        });
    });
}