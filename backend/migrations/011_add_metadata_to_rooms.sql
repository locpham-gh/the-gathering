-- Add metadata column to rooms table for pixel map and other configs
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Migration to ensure existing rooms have an empty JSON object
UPDATE rooms SET metadata = '{}' WHERE metadata IS NULL;
