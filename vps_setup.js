const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config();

console.log('Starting VPS setup...');

// Database configuration from .env
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'loan_system'
};

// Create connection to MySQL
const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL server');
    
    // Create database
    createDatabase();
});

function createDatabase() {
    console.log('Creating database...');
    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`, (err) => {
        if (err) {
            console.error('Error creating database:', err);
            connection.end();
            return;
        }
        console.log(`Database '${dbConfig.database}' created or already exists`);
        
        // Use the database
        connection.query(`USE ${dbConfig.database}`, (err) => {
            if (err) {
                console.error('Error selecting database:', err);
                connection.end();
                return;
            }
            console.log(`Using database '${dbConfig.database}'`);
            
            // Create tables
            createTables();
        });
    });
}

function createTables() {
    console.log('Creating tables...');
    
    // Create users table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            bank_id VARCHAR(20) NOT NULL,
            bank_name VARCHAR(100) NOT NULL,
            division VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    connection.query(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
            connection.end();
            return;
        }
        console.log('Users table created');
        
        // Create GN divisions table
        const createGnDivisionsTable = `
            CREATE TABLE IF NOT EXISTS gn_divisions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                division VARCHAR(50) NOT NULL,
                gn_division VARCHAR(100) NOT NULL,
                INDEX idx_division (division)
            )
        `;
        
        connection.query(createGnDivisionsTable, (err) => {
            if (err) {
                console.error('Error creating gn_divisions table:', err);
                connection.end();
                return;
            }
            console.log('GN divisions table created');
            
            // Create loan data table
            const createLoanDataTable = `
                CREATE TABLE IF NOT EXISTS loan_data (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    bank_id VARCHAR(20) NOT NULL,
                    user_id INT NOT NULL,
                    entry_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    
                    beneficiary_name VARCHAR(100) NOT NULL,
                    beneficiary_nic VARCHAR(20) NOT NULL,
                    beneficiary_address TEXT NOT NULL,
                    beneficiary_gn_division VARCHAR(100) NOT NULL,
                    beneficiary_category ENUM('extremelyPoor', 'transitional', 'samurdhi') NOT NULL,
                    
                    interest_rate DECIMAL(5,2) NOT NULL,
                    loan_type ENUM('empowerment', 'ranpatha') NOT NULL,
                    project ENUM('agricultural', 'industrial', 'trade', 'services', 'vocational') NOT NULL,
                    
                    loan_amount DECIMAL(15,2) NOT NULL,
                    loan_issued_date DATE NOT NULL,
                    
                    INDEX idx_bank_id (bank_id),
                    INDEX idx_user_id (user_id),
                    INDEX idx_entry_timestamp (entry_timestamp),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `;
            
            connection.query(createLoanDataTable, (err) => {
                if (err) {
                    console.error('Error creating loan_data table:', err);
                    connection.end();
                    return;
                }
                console.log('Loan data table created');
                
                // Import usernames and passwords
                importUsernames();
            });
        });
    });
}

function importUsernames() {
    console.log('Importing usernames and passwords...');
    
    // Read usernames from CSV file
    const usernamesPath = path.join(__dirname, 'usernames.csv');
    
    fs.readFile(usernamesPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading usernames CSV file:', err);
            connection.end();
            return;
        }
        
        // Parse CSV data
        const lines = data.split('\n');
        const users = [];
        
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const [bankName, username, password] = line.split(',').map(field => field.trim().replace(/^"|"$/g, ''));
                if (bankName && username && password) {
                    // Generate bank_id based on index
                    const bankId = 'BANK' + (i < 10 ? '00' + i : i < 100 ? '0' + i : i);
                    
                    // Simple division assignment (you can enhance this)
                    let division = 'General';
                    if (bankName.includes('Gampaha') || bankName.includes('Ganemulla') || bankName.includes('Yakkala')) {
                        division = 'Gampaha';
                    } else if (bankName.includes('Negombo') || bankName.includes('Negumbo')) {
                        division = 'Negombo';
                    }
                    
                    users.push({
                        username: username,
                        password: password,
                        bank_id: bankId,
                        bank_name: bankName,
                        division: division
                    });
                }
            }
        }
        
        console.log(`Found ${users.length} users to import`);
        
        // Insert users with bcrypt hashed passwords
        let completed = 0;
        users.forEach((user, index) => {
            bcrypt.hash(user.password, 10, (err, hash) => {
                if (err) {
                    console.error('Error hashing password for', user.username, err);
                    completed++;
                    if (completed === users.length) {
                        finishSetup();
                    }
                    return;
                }
                
                const insertQuery = `
                    INSERT IGNORE INTO users (username, password, bank_id, bank_name, division) 
                    VALUES (?, ?, ?, ?, ?)
                `;
                
                connection.query(insertQuery, [user.username, hash, user.bank_id, user.bank_name, user.division], (err, result) => {
                    if (err) {
                        console.error('Error inserting user', user.username, err);
                    } else if (result.affectedRows > 0) {
                        console.log(`Inserted user: ${user.username}`);
                    } else {
                        console.log(`User ${user.username} already exists, skipped`);
                    }
                    
                    completed++;
                    if (completed === users.length) {
                        console.log(`Successfully processed ${users.length} users`);
                        finishSetup();
                    }
                });
            });
        });
        
        // Handle case where there are no users
        if (users.length === 0) {
            finishSetup();
        }
    });
}

function finishSetup() {
    console.log('VPS setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure your .env file has correct database credentials');
    console.log('2. Start your application with: npm start');
    console.log('3. Access your application at: http://your-vps-ip:3000');
    
    connection.end((err) => {
        if (err) {
            console.error('Error closing connection:', err);
        } else {
            console.log('Database connection closed');
        }
    });
}