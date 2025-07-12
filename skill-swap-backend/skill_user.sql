CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    skills_offered TEXT[],
    skills_wanted TEXT[],
    availability VARCHAR(50),
    profile_photo VARCHAR(200),
    profile_visibility VARCHAR(20) DEFAULT 'Public',
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE swaps (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    offered_skill VARCHAR(100),
    wanted_skill VARCHAR(100),
    message TEXT,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM users;

INSERT INTO users (name, email, password, skills_offered, skills_wanted, availability, profile_visibility)
VALUES ('Test User', 'test@example.com', 'test123', ARRAY['HTML', 'CSS'], ARRAY['Python'], 'Weekends', 'Public');


ALTER USER skill_user WITH PASSWORD 'newsecurepass';

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO skill_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO skill_user;

SELECT id, name, is_admin FROM users;

UPDATE users SET is_admin = true WHERE id = 1;

SELECT * FROM users;