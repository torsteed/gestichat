-- Gestichat Database Schema
-- MySQL script to create tables and insert test data

CREATE DATABASE IF NOT EXISTS gestichat;
USE gestichat;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Cats table
CREATE TABLE IF NOT EXISTS cats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT TRUE
);

-- Meals table
CREATE TABLE IF NOT EXISTS meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cat_id INT NOT NULL,
    user_id INT NOT NULL,
    fed_at DATETIME NOT NULL,
    sachets_used INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Stock table
CREATE TABLE IF NOT EXISTS stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sachets_added INT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL,
    note VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert test data

-- Users
INSERT INTO users (name) VALUES 
    ('Alice'),
    ('Bob'),
    ('Charlie'),
    ('Diana')
ON DUPLICATE KEY UPDATE name = name;

-- Cats
INSERT INTO cats (name, active) VALUES 
    ('Whiskers', TRUE),
    ('Mittens', TRUE),
    ('Shadow', TRUE),
    ('Luna', FALSE),
    ('Simba', TRUE)
ON DUPLICATE KEY UPDATE name = name, active = active;

-- Meals (last 7 days for testing)
INSERT INTO meals (cat_id, user_id, fed_at, sachets_used) VALUES 
    -- Today
    (1, 1, DATE_SUB(NOW(), INTERVAL 2 HOUR), 1),
    (2, 2, DATE_SUB(NOW(), INTERVAL 1 HOUR), 1),
    (3, 3, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 2),
    
    -- Yesterday
    (1, 2, DATE_SUB(NOW(), INTERVAL 25 HOUR), 1),
    (4, 1, DATE_SUB(NOW(), INTERVAL 30 HOUR), 1),
    
    -- 2 days ago
    (2, 3, DATE_SUB(NOW(), INTERVAL 50 HOUR), 1),
    (5, 4, DATE_SUB(NOW(), INTERVAL 55 HOUR), 1),
    
    -- 3 days ago
    (1, 4, DATE_SUB(NOW(), INTERVAL 75 HOUR), 1),
    (3, 1, DATE_SUB(NOW(), INTERVAL 80 HOUR), 1),
    
    -- Last week
    (2, 2, DATE_SUB(NOW(), INTERVAL 7 DAY), 1),
    (5, 3, DATE_SUB(NOW(), INTERVAL 8 DAY), 2)
ON DUPLICATE KEY UPDATE 
    cat_id = cat_id, user_id = user_id, fed_at = fed_at, sachets_used = sachets_used;

-- Stock history
INSERT INTO stock (sachets_added, added_at, user_id, note) VALUES 
    (50, DATE_SUB(NOW(), INTERVAL 10 DAY), 1, 'Initial stock'),
    (20, DATE_SUB(NOW(), INTERVAL 5 DAY), 2, 'Weekly restock'),
    (30, DATE_SUB(NOW(), INTERVAL 2 DAY), 3, 'Bulk purchase')
ON DUPLICATE KEY UPDATE 
    sachets_added = sachets_added, added_at = added_at, user_id = user_id, note = note;

-- Show current stock calculation
SELECT 
    (SELECT IFNULL(SUM(sachets_added), 0) FROM stock) as total_added,
    (SELECT IFNULL(SUM(sachets_used), 0) FROM meals) as total_used,
    (SELECT IFNULL(SUM(sachets_added), 0) FROM stock) - 
    (SELECT IFNULL(SUM(sachets_used), 0) FROM meals) as current_stock;
