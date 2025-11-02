const mysql = require('mysql2');

// Create database connection with root user
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '' // Change this to your root password if you have one
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database as root');
    
    // Create database
    db.query('CREATE DATABASE IF NOT EXISTS nextsril_loan_update', (err) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database created successfully');
        
        // Create user and grant privileges
        db.query("CREATE USER IF NOT EXISTS 'nextsril_Roshanloan'@'localhost' IDENTIFIED BY 'Roshan-2025'", (err) => {
            if (err) {
                console.error('Error creating user:', err);
                return;
            }
            console.log('User created successfully');
            
            // Grant privileges
            db.query("GRANT ALL PRIVILEGES ON nextsril_loan_update.* TO 'nextsril_Roshanloan'@'localhost'", (err) => {
                if (err) {
                    console.error('Error granting privileges:', err);
                    return;
                }
                console.log('Privileges granted successfully');
                
                // Flush privileges
                db.query("FLUSH PRIVILEGES", (err) => {
                    if (err) {
                        console.error('Error flushing privileges:', err);
                        return;
                    }
                    console.log('Privileges flushed successfully');
                    
                    // Close database connection
                    db.end((err) => {
                        if (err) {
                            console.error('Error closing database connection:', err);
                        } else {
                            console.log('Database connection closed');
                        }
                    });
                });
            });
        });
    });
});