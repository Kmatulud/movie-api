CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    pass_word VARCHAR NOT NULL
);