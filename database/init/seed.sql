INSERT INTO users (username, hashed_password, email, phone_number, real_name, grad_year, is_oncampus, gender, major, home_state)
VALUES
('jdoe', 'hashedpw1', 'jdoe@example.com', '555-111-2222', 'John Doe', 2027, true, 'Male', 'Computer Science', 'PA'),
('asmith', 'hashedpw2', 'asmith@example.com', '555-333-4444', 'Alice Smith', 2026, false, 'Female', 'Biology', 'WV'),
('mlee', 'hashedpw3', 'mlee@example.com', '555-555-6666', 'Marcus Lee', 2028, true, 'Male', 'Business', 'OH');

INSERT INTO location (address, unit_number, city, state, zip_code, is_onCampus, allows_pets)
VALUES
('123 Main St', 'Apt 1', 'Pittsburgh', 'PA', '15213', true, false),
('456 Oak Ave', NULL, 'Columbus', 'OH', '43210', false, true),
('789 Pine Rd', 'Unit B', 'Charleston', 'WV', '25301', true, true);
