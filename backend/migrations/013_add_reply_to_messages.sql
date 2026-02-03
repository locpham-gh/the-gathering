-- Add parent_id for message replies
ALTER TABLE messages 
ADD COLUMN parent_id INTEGER REFERENCES messages(id) ON DELETE SET NULL;

-- Index for faster lookup of replies
CREATE INDEX idx_messages_parent_id ON messages(parent_id);
