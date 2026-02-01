-- ============================================
-- SAMPLE BOOKINGS SQL COMMANDS
-- Copy and paste this into phpMyAdmin SQL tab
-- ============================================

USE travel_agency_db;

-- Insert Sample Bookings
-- user_id=1 is the admin user (admin@travel.com)
-- flight_id=1 is the first flight (Delta DL 452)
-- hotel_id=1 is the first hotel (Grand Skyline Tokyo)

INSERT INTO bookings (user_id, booking_type, flight_id, hotel_id, booking_date, travelers, total_amount, status, payment_status) VALUES
(1, 'flight', 1, NULL, '2024-10-15', 2, 1160.00, 'confirmed', 'paid'),
(1, 'hotel', NULL, 1, '2024-10-12', 2, 555.00, 'confirmed', 'paid');

-- ============================================
-- DONE!
-- ============================================
-- This creates 2 sample bookings:
-- 1. Flight booking for admin user
-- 2. Hotel booking for admin user
