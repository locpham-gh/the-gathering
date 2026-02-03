-- Create rooms table for the forum feature
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    code VARCHAR(15) UNIQUE NOT NULL,
    title VARCHAR(255),
    creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookup by code
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);
