-- Create default organization
INSERT INTO organizations (name, description, industry, country, is_active, created_at, updated_at) 
VALUES ('Default Organization', 'Default organization for SSI/GRC platform', 'Information Security', 'France', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;
