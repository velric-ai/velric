-- Migration: Add code_input and code_language columns to user_mission table
-- This migration adds support for storing submitted code and its language

-- Add code_input column to store the actual code submitted by users
ALTER TABLE user_mission
ADD COLUMN IF NOT EXISTS code_input TEXT;

-- Add code_language column to store the programming language of the submitted code
ALTER TABLE user_mission
ADD COLUMN IF NOT EXISTS code_language VARCHAR(50);

-- Create index on code_language for faster filtering
CREATE INDEX IF NOT EXISTS idx_user_mission_code_language 
ON user_mission(code_language);

-- Add comment to document the columns
COMMENT ON COLUMN user_mission.code_input IS 'The actual code submitted by the user for technical missions';
COMMENT ON COLUMN user_mission.code_language IS 'The programming language of the submitted code (e.g., python, javascript, java, etc.)';
