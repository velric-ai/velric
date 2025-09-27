-- migrations/create_projects_schema.sql
-- Create projects schema for Velric application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    user_id UUID NOT NULL,
    mission_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create industry_tags table
CREATE TABLE IF NOT EXISTS industry_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_industry_tags junction table
CREATE TABLE IF NOT EXISTS project_industry_tags (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    industry_tag_id UUID NOT NULL REFERENCES industry_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, industry_tag_id)
);

-- Create target_roles table
CREATE TABLE IF NOT EXISTS target_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_target_roles junction table
CREATE TABLE IF NOT EXISTS project_target_roles (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    target_role_id UUID NOT NULL REFERENCES target_roles(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, target_role_id)
);

-- Create project_docs table
CREATE TABLE IF NOT EXISTS project_docs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    doc_type VARCHAR(50) NOT NULL DEFAULT 'other' CHECK (doc_type IN ('readme', 'spec', 'design', 'notes', 'other')),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_mission_id ON projects(mission_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

CREATE INDEX IF NOT EXISTS idx_project_docs_project_id ON project_docs(project_id);
CREATE INDEX IF NOT EXISTS idx_project_docs_doc_type ON project_docs(doc_type);
CREATE INDEX IF NOT EXISTS idx_project_docs_order_index ON project_docs(project_id, order_index);

CREATE INDEX IF NOT EXISTS idx_project_industry_tags_project_id ON project_industry_tags(project_id);
CREATE INDEX IF NOT EXISTS idx_project_industry_tags_industry_tag_id ON project_industry_tags(industry_tag_id);

CREATE INDEX IF NOT EXISTS idx_project_target_roles_project_id ON project_target_roles(project_id);
CREATE INDEX IF NOT EXISTS idx_project_target_roles_target_role_id ON project_target_roles(target_role_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_docs_updated_at 
    BEFORE UPDATE ON project_docs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default industry tags
INSERT INTO industry_tags (name) VALUES 
    ('Technology'),
    ('Finance'),
    ('Healthcare'),
    ('E-commerce'),
    ('Media'),
    ('Education'),
    ('Gaming'),
    ('Automotive'),
    ('Retail'),
    ('Manufacturing')
ON CONFLICT (name) DO NOTHING;

-- Insert default target roles
INSERT INTO target_roles (name) VALUES 
    ('Software Engineer'),
    ('Senior Software Engineer'),
    ('Full Stack Developer'),
    ('Frontend Developer'),
    ('Backend Developer'),
    ('DevOps Engineer'),
    ('Data Scientist'),
    ('ML Engineer'),
    ('Product Manager'),
    ('Engineering Manager'),
    ('Tech Lead'),
    ('Principal Engineer')
ON CONFLICT (name) DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE projects IS 'User projects created from missions or custom work';
COMMENT ON TABLE industry_tags IS 'Industry categories for projects';
COMMENT ON TABLE target_roles IS 'Target job roles for projects';
COMMENT ON TABLE project_docs IS 'Documentation and files associated with projects';
COMMENT ON TABLE project_industry_tags IS 'Many-to-many relationship between projects and industry tags';
COMMENT ON TABLE project_target_roles IS 'Many-to-many relationship between projects and target roles';

COMMENT ON COLUMN projects.status IS 'Project status: draft, in_progress, completed, published';
COMMENT ON COLUMN project_docs.doc_type IS 'Document type: readme, spec, design, notes, other';
COMMENT ON COLUMN project_docs.order_index IS 'Order of documents within a project for display purposes';