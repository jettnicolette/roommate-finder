INSERT INTO users (username, hashed_password, email, phone_number, real_name, grad_year, is_oncampus, gender, major, home_state)
VALUES
('jdoe', 'hashedpw1', 'jdoe@example.com', '555-111-2222', 'John Doe', 2027, true, 'Male', 'Computer Science', 'PA'),
('asmith', 'hashedpw2', 'asmith@example.com', '555-333-4444', 'Alice Smith', 2026, false, 'Female', 'Biology', 'WV'),
('mlee', 'hashedpw3', 'mlee@example.com', '555-555-6666', 'Marcus Lee', 2028, true, 'Male', 'Business', 'OH');

INSERT INTO habits (user_id, wake_time, sleep_time, study_hours)
VALUES
(1, '08:00:00', '22:00:00', 5),
(2, '07:30:00', '23:00:00', 4),
(3, '09:00:00', '21:00:00', 6);

