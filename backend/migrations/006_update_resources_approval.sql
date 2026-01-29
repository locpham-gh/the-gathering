-- Add new columns to resources table for approval workflow and metadata
ALTER TABLE resources 
ADD COLUMN IF NOT EXISTS uploader_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS format VARCHAR(10) DEFAULT 'pdf' CHECK (format IN ('pdf', 'mp4')),
ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'English';

-- Update existing resources to be 'approved' by default (assuming admin uploaded them previously)
UPDATE resources SET status = 'approved' WHERE status = 'pending';

-- Seed an uploader_id for existing resources (e.g., the first admin user)
UPDATE resources SET uploader_id = (SELECT id FROM users WHERE role = 'admin' LIMIT 1) WHERE uploader_id IS NULL;
