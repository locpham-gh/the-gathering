-- Seed Standard User
-- Password is 'user123' (hashed)
INSERT INTO users (username, email, password_hash, role)
VALUES (
    'user', 
    'user@thegathering.com', 
    '$2b$10$7BP4wHFjLNDfu6157IpYwnWCXa1Od.T1Jw.0YahUOACXzY', 
    'user'
)
ON CONFLICT (username) DO NOTHING;
