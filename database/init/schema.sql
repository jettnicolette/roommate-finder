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
