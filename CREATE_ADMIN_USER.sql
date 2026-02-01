-- ============================================
-- CREATE ADMIN USER WITH PASSWORD HASH
-- Run this AFTER creating the database
-- ============================================

USE travel_agency_db;

-- Delete existing admin if exists
DELETE FROM users WHERE email = 'admin@travel.com';

-- ============================================
-- CREATE ADMIN USER
-- ============================================
-- Email: admin@travel.com
-- Password: admin123
-- ============================================

-- Delete existing admin if exists
DELETE FROM users WHERE email = 'admin@travel.com';

-- Insert Admin User with bcrypt hash for password "admin123"
-- Hash generated using: bcrypt.hashSync('admin123', 10)
INSERT INTO users (email, password, full_name, user_type, phone) VALUES
('admin@travel.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', 'admin', NULL);

-- Note: The hash above is for password "admin123"
-- If you want to use a different password, run: node CREATE_ADMIN_SCRIPT.js

-- ============================================
-- ADMIN CREDENTIALS
-- ============================================
-- Email: admin@travel.com
-- Password: admin123
-- User Type: admin

-- ============================================
-- VERIFY ADMIN USER
-- ============================================
SELECT id, email, full_name, user_type FROM users WHERE email = 'admin@travel.com';
