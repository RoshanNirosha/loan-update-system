-- Database creation
CREATE DATABASE IF NOT EXISTS loan_system;
USE loan_system;

-- Users table (banks)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    bank_id VARCHAR(20) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    division VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GN Divisions table
CREATE TABLE gn_divisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    division VARCHAR(50) NOT NULL,
    gn_division VARCHAR(100) NOT NULL,
    INDEX idx_division (division)
);

-- Loan data table
CREATE TABLE loan_data (
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
);

-- Insert sample users (banks)
-- Note: Passwords should be hashed in a real implementation
INSERT INTO users (username, password, bank_id, bank_name, division) VALUES
('gampaha_bank_01', '$2a$10$8K1p/a0dURXAm7QiTRqUzuN0/SpuDMaM1YWSpGgHl5F89S5u9xT6e', 'BANK001', 'Gampaha Main Branch', 'Gampaha'),
('negombo_bank_01', '$2a$10$8K1p/a0dURXAm7QiTRqUzuN0/SpuDMaM1YWSpGgHl5F89S5u9xT6e', 'BANK002', 'Negombo Central Bank', 'Negombo');

-- Insert sample GN divisions (just a few examples, you would import all from your CSV)
INSERT INTO gn_divisions (division, gn_division) VALUES
('Gampaha', 'Aluthgama/bogamuwa'),
('Gampaha', 'Amunugoda'),
('Gampaha', 'Ganemulla'),
('Gampaha', 'Henarathgoda'),
('Negombo', '77A Kammalthura'),
('Negombo', '77 Pallansena North'),
('Negombo', '78 Kochchikade');