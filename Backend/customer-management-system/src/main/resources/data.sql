-- ==========================================
-- MASTER DATA: COUNTRIES
-- ==========================================
INSERT IGNORE INTO countries (id, name, code) VALUES (1, 'Sri Lanka', 'LKA');
INSERT IGNORE INTO countries (id, name, code) VALUES (2, 'United States', 'USA');
INSERT IGNORE INTO countries (id, name, code) VALUES (3, 'United Kingdom', 'GBR');
INSERT IGNORE INTO countries (id, name, code) VALUES (4, 'Australia', 'AUS');
INSERT IGNORE INTO countries (id, name, code) VALUES (5, 'India', 'IND');

-- ==========================================
-- MASTER DATA: CITIES
-- ==========================================
-- Cities for Sri Lanka (country_id = 1)
INSERT IGNORE INTO cities (id, name, country_id) VALUES (1, 'Colombo', 1);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (2, 'Malabe', 1);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (3, 'Kandy', 1);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (4, 'Galle', 1);

-- Cities for United States (country_id = 2)
INSERT IGNORE INTO cities (id, name, country_id) VALUES (5, 'New York', 2);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (6, 'Los Angeles', 2);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (7, 'Chicago', 2);

-- Cities for United Kingdom (country_id = 3)
INSERT IGNORE INTO cities (id, name, country_id) VALUES (8, 'London', 3);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (9, 'Manchester', 3);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (10, 'Edinburgh', 3);

-- Cities for Australia (country_id = 4)
INSERT IGNORE INTO cities (id, name, country_id) VALUES (11, 'Sydney', 4);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (12, 'Melbourne', 4);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (13, 'Brisbane', 4);

-- Cities for India (country_id = 5)
INSERT IGNORE INTO cities (id, name, country_id) VALUES (14, 'Mumbai', 5);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (15, 'Delhi', 5);
INSERT IGNORE INTO cities (id, name, country_id) VALUES (16, 'Bangalore', 5);

-- ==========================================
-- SAMPLE DATA: CUSTOMERS
-- ==========================================
INSERT IGNORE INTO customers (id, name, date_of_birth, nic_number, created_at, updated_at)
VALUES (1, 'Nimal Perera', '1985-05-15', '851234567V', CURRENT_DATE, CURRENT_DATE);

INSERT IGNORE INTO customers (id, name, date_of_birth, nic_number, created_at, updated_at)
VALUES (2, 'Sunimal Perera', '2008-08-20', '200812345678', CURRENT_DATE, CURRENT_DATE);

INSERT IGNORE INTO customers (id, name, date_of_birth, nic_number, created_at, updated_at)
VALUES (3, 'Amala Silva', '1992-11-10', '921234567V', CURRENT_DATE, CURRENT_DATE);

-- ==========================================
-- SAMPLE DATA: MOBILE NUMBERS
-- ==========================================
INSERT IGNORE INTO mobile_numbers (id, number, customer_id) VALUES (1, '0771234567', 1);
INSERT IGNORE INTO mobile_numbers (id, number, customer_id) VALUES (2, '0719876543', 2);
INSERT IGNORE INTO mobile_numbers (id, number, customer_id) VALUES (3, '0775556666', 3);

-- ==========================================
-- SAMPLE DATA: ADDRESSES
-- ==========================================
INSERT IGNORE INTO addresses (id, address_line1, address_line2, city_id, country_id, customer_id)
VALUES (1, 'No 15, New Kandy Road', 'Campus Area', 2, 1, 1);

INSERT IGNORE INTO addresses (id, address_line1, address_line2, city_id, country_id, customer_id)
VALUES (2, 'No 15, New Kandy Road', 'Campus Area', 2, 1, 2);

INSERT IGNORE INTO addresses (id, address_line1, address_line2, city_id, country_id, customer_id)
VALUES (3, '12A, Galle Face Terrace', 'Colombo 03', 1, 1, 3);

-- ==========================================
-- SAMPLE DATA: FAMILY MEMBERS (Self-Referencing)
-- ==========================================
INSERT IGNORE INTO family_members (id, customer_id, family_customer_id, relationship)
VALUES (1, 1, 2, 'Son');

INSERT IGNORE INTO family_members (id, customer_id, family_customer_id, relationship)
VALUES (2, 2, 1, 'Father');