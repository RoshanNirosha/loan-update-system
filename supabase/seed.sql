-- Seed data for Loan Update System

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