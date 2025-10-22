-- migrations/create_missions_schema.sql
-- Create missions schema for Velric application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    field VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    time_estimate VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    company VARCHAR(255),
    context TEXT,
    is_ai_generated BOOLEAN DEFAULT true,
    generated_by VARCHAR(50) DEFAULT 'openai',
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table for normalized storage
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create industries table for normalized storage
CREATE TABLE IF NOT EXISTS industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mission_skills junction table
CREATE TABLE IF NOT EXISTS mission_skills (
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (mission_id, skill_id)
);

-- Create mission_industries junction table
CREATE TABLE IF NOT EXISTS mission_industries (
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
    PRIMARY KEY (mission_id, industry_id)
);

-- Create mission_tasks table for storing task list
CREATE TABLE IF NOT EXISTS mission_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    task_description TEXT NOT NULL,
    task_order INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mission_objectives table for storing objectives
CREATE TABLE IF NOT EXISTS mission_objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    objective_description TEXT NOT NULL,
    objective_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mission_resources table for storing resources
CREATE TABLE IF NOT EXISTS mission_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    resource_description TEXT NOT NULL,
    resource_type VARCHAR(50), -- 'tool', 'document', 'access', 'budget', etc.
    resource_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mission_evaluation_metrics table for storing evaluation criteria
CREATE TABLE IF NOT EXISTS mission_evaluation_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    metric_description TEXT NOT NULL,
    metric_weight DECIMAL(3,2) DEFAULT 1.00, -- weight for scoring (0.00-1.00)
    metric_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_missions table for tracking user interactions with missions
CREATE TABLE IF NOT EXISTS user_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested', 'starred', 'in_progress', 'submitted', 'completed')),
    grade DECIMAL(5,2), -- grade out of 100
    feedback TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, mission_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_missions_difficulty ON missions(difficulty);
CREATE INDEX IF NOT EXISTS idx_missions_category ON missions(category);
CREATE INDEX IF NOT EXISTS idx_missions_company ON missions(company);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_created_at ON missions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_missions_user_id ON user_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_status ON user_missions(status);
CREATE INDEX IF NOT EXISTS idx_mission_tasks_mission_id ON mission_tasks(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_objectives_mission_id ON mission_objectives(mission_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at column
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_missions_updated_at BEFORE UPDATE ON user_missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default skills
INSERT INTO skills (name, category) VALUES 
    ('JavaScript', 'Programming'),
    ('TypeScript', 'Programming'),
    ('React', 'Frontend'),
    ('Next.js', 'Frontend'),
    ('Node.js', 'Backend'),
    ('Python', 'Programming'),
    ('Digital Marketing', 'Marketing'),
    ('Social Media Strategy', 'Marketing'),
    ('Content Creation', 'Marketing'),
    ('Growth Hacking', 'Marketing'),
    ('Data Analysis', 'Analytics'),
    ('SQL', 'Database'),
    ('API Design', 'Backend'),
    ('UI/UX Design', 'Design'),
    ('Project Management', 'Management')
ON CONFLICT (name) DO NOTHING;

-- Insert some default industries
INSERT INTO industries (name, description) VALUES 
    ('AI/ML', 'Artificial Intelligence and Machine Learning'),
    ('SaaS', 'Software as a Service'),
    ('E-commerce', 'Electronic Commerce'),
    ('FinTech', 'Financial Technology'),
    ('HealthTech', 'Healthcare Technology'),
    ('EdTech', 'Educational Technology'),
    ('Gaming', 'Gaming and Entertainment'),
    ('Productivity', 'Productivity and Workflow Tools'),
    ('Social Media', 'Social Media and Communication'),
    ('Enterprise', 'Enterprise Software Solutions')
ON CONFLICT (name) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE missions IS 'Stores AI-generated and manually created missions';
COMMENT ON TABLE user_missions IS 'Tracks user progress and interaction with missions';
COMMENT ON TABLE mission_tasks IS 'Stores individual tasks for each mission';
COMMENT ON TABLE mission_objectives IS 'Stores learning objectives for each mission';
COMMENT ON TABLE mission_resources IS 'Stores resources available for each mission';
COMMENT ON TABLE mission_evaluation_metrics IS 'Stores evaluation criteria for each mission';
COMMENT ON COLUMN missions.is_ai_generated IS 'Flag to indicate if mission was generated by AI';
COMMENT ON COLUMN missions.generated_by IS 'Which AI service generated the mission (openai, claude, etc.)';