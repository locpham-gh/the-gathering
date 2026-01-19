-- Seed Admin user
-- Password is 'admin123' (hashed)
INSERT INTO users (username, email, password_hash, role)
VALUES (
    'admin', 
    'admin@thegathering.com', 
    '$2a$10$7R9M6YvHk4f.kB7Z2Y5XOuJjO6G.h4pYF7uXn/7Z1W0h0pI.z5V2C', 
    'admin'
)
ON CONFLICT (username) DO NOTHING;
