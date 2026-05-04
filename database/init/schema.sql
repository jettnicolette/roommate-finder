CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    real_name VARCHAR(100) NOT NULL,
    grad_year INT,
    is_oncampus BOOLEAN NOT NULL,
    gender VARCHAR(30),
    major VARCHAR(100),
    home_state VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS habits (
    habit_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    wake_time TIME,
    sleep_time TIME,
    study_hours INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS location (
    location_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    unit_number VARCHAR(50),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    rent DECIMAL(10,2) NOT NULL,
    is_oncampus BOOLEAN NOT NULL,
    allows_pets BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS match (
    match_id SERIAL PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    location_id INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (user1_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES location(location_id) ON DELETE CASCADE
);
