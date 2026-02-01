-- Travel Agency System Database Schema
-- Database: travel_agency

CREATE DATABASE IF NOT EXISTS travel_agency_db;
USE travel_agency_db;

-- Users Table
-- Stores customer and admin user information
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    user_type ENUM('customer', 'admin') DEFAULT 'customer',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);

-- Flights Table
-- Stores available flight information
CREATE TABLE IF NOT EXISTS flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airline VARCHAR(100) NOT NULL,
    flight_number VARCHAR(20) NOT NULL,
    aircraft VARCHAR(50),
    origin_code VARCHAR(10) NOT NULL,
    origin_name VARCHAR(255) NOT NULL,
    destination_code VARCHAR(10) NOT NULL,
    destination_name VARCHAR(255) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration VARCHAR(20) NOT NULL,
    stops INT DEFAULT 0,
    stop_duration VARCHAR(20),
    fare_type VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    available_seats INT DEFAULT 100,
    departure_date DATE NOT NULL,
    return_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_origin (origin_code),
    INDEX idx_destination (destination_code),
    INDEX idx_departure_date (departure_date)
);

-- Hotels Table
-- Stores hotel information
CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    star_rating INT DEFAULT 3,
    price_per_night DECIMAL(10, 2) NOT NULL,
    commission DECIMAL(10, 2) DEFAULT 0,
    amenities TEXT,
    description TEXT,
    image_url VARCHAR(500),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_city (city),
    INDEX idx_country (country),
    INDEX idx_star_rating (star_rating)
);

-- Packages Table
-- Stores travel package information
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    duration_days INT NOT NULL,
    duration_nights INT NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 1) DEFAULT 0,
    trip_type VARCHAR(50),
    inclusions TEXT,
    description TEXT,
    image_url VARCHAR(500),
    badge VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_destination (destination),
    INDEX idx_trip_type (trip_type)
);

-- Bookings Table
-- Stores all booking transactions
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_type ENUM('flight', 'hotel', 'package') NOT NULL,
    flight_id INT,
    hotel_id INT,
    package_id INT,
    booking_date DATE NOT NULL,
    check_in_date DATE,
    check_out_date DATE,
    travelers INT DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE SET NULL,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE SET NULL,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_booking_type (booking_type)
);

-- Insert Sample Data

-- Admin user (login: admin@travel.com / admin123)
-- Password hash is for "admin123". ON DUPLICATE KEY so re-import or existing DB still works.
INSERT INTO users (id, email, password, full_name, user_type) VALUES
(1, 'admin@travel.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', 'admin')
ON DUPLICATE KEY UPDATE password = VALUES(password), full_name = VALUES(full_name), user_type = VALUES(user_type);

-- Sample Flights
INSERT INTO flights (airline, flight_number, aircraft, origin_code, origin_name, destination_code, destination_name, departure_time, arrival_time, duration, stops, fare_type, price, departure_date) VALUES
('Delta', 'DL 452', 'Boeing 777', 'JFK', 'John F. Kennedy Airport', 'LHR', 'London Heathrow Airport', '08:00:00', '14:55:00', '6h 55m', 0, 'Eco Flex', 580.00, '2024-10-24'),
('British Airways', 'BA 117', 'Airbus A350', 'JFK', 'John F. Kennedy Airport', 'LHR', 'London Heathrow Airport', '10:30:00', '18:45:00', '8h 15m', 1, 'Economy', 520.00, '2024-10-24'),
('Virgin Atlantic', 'VS 045', 'Airbus A330', 'JFK', 'John F. Kennedy Airport', 'LHR', 'London Heathrow Airport', '13:20:00', '20:25:00', '7h 05m', 0, 'Premium', 615.00, '2024-10-24');

-- Sample Hotels
INSERT INTO hotels (name, location, city, country, star_rating, price_per_night, commission, amenities, description, image_url) VALUES
('Grand Skyline Tokyo', 'Shinjuku Ward', 'Tokyo', 'Japan', 5, 185.00, 25.00, 'Free WiFi,Breakfast Included,Pool', 'Luxurious hotel in the heart of Tokyo', '/images/hotel1.jpg'),
('Shibuya Crossing Inn', 'Shibuya', 'Tokyo', 'Japan', 4, 145.00, 18.00, 'Free WiFi,Gym', 'Modern hotel near Shibuya station', '/images/hotel2.jpg'),
('Asakusa Ryokan Heritage', 'Asakusa', 'Tokyo', 'Japan', 5, 260.00, 40.00, 'Free WiFi,Onsen/Spa,Breakfast Included', 'Traditional Japanese ryokan experience', '/images/hotel3.jpg');

-- Sample Packages
INSERT INTO packages (title, destination, city, country, duration_days, duration_nights, original_price, discounted_price, rating, trip_type, inclusions, description, image_url, badge) VALUES
('Santorini Sunset Getaway', 'Santorini, Greece', 'Santorini', 'Greece', 5, 4, 1800.00, 1499.00, 4.9, 'Romantic', 'Flight Included,4-Star Hotel,Breakfast', 'Experience the beautiful sunsets of Santorini', '/images/santorini.jpg', 'Best Seller'),
('Kyoto Cultural Immersion', 'Kyoto, Japan', 'Kyoto', 'Japan', 7, 6, 2400.00, 2100.00, 4.8, 'Cultural', 'Rail Pass,Ryokan Stay,Guide', 'Discover traditional Japanese culture', '/images/kyoto.jpg', 'All-Inclusive'),
('Cappadocia Dream', 'Cappadocia, Turkey', 'Cappadocia', 'Turkey', 4, 3, 1200.00, 999.00, 5.0, 'Adventure', 'Flight Included,Cave Hotel,Photo Shoot', 'Hot air balloon adventure', '/images/cappadocia.jpg', 'Adventure');

-- Sample Bookings
INSERT INTO bookings (user_id, booking_type, flight_id, booking_date, travelers, total_amount, status, payment_status) VALUES
(1, 'flight', 1, '2024-10-15', 2, 1160.00, 'confirmed', 'paid'),
(1, 'hotel', 1, '2024-10-12', 2, 555.00, 'confirmed', 'paid');

