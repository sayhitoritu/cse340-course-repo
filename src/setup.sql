-- =========================================
-- SERVICE NETWORK DATABASE
-- CSE 340 - W03 MVC Implementation
-- Complete database setup and seed data
-- =========================================

-- Drop existing tables in dependency order
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

-- =========================================
-- 1. ORGANIZATIONS TABLE
-- =========================================

CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL
);

-- =========================================
-- 2. PROJECTS TABLE
-- =========================================

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    organization_id INTEGER NOT NULL
        REFERENCES organizations(organization_id),
    location VARCHAR(150),
    project_date DATE NOT NULL
);

-- =========================================
-- 3. CATEGORIES TABLE
-- =========================================

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- =========================================
-- 4. PROJECT_CATEGORIES JUNCTION TABLE
-- =========================================

CREATE TABLE project_categories (
    project_id INTEGER NOT NULL
        REFERENCES projects(project_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL
        REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- =========================================
-- INSERT ORGANIZATIONS
-- Example contact addresses for this assignment.
-- Replace these with verified addresses if available.
-- =========================================

INSERT INTO organizations (name, description, image, contact_email)
VALUES
(
    'Community Care Network',
    'Supports local families through community outreach and essential resources.',
    'community-care.jpg',
    'contact@communitycarenetwork.example'
),
(
    'Green Future Initiative',
    'Promotes environmental awareness and sustainable community practices.',
    'green-future.jpg',
    'info@greenfutureinitiative.example'
),
(
    'Learning Together Foundation',
    'Encourages education, mentoring, and lifelong learning.',
    NULL,
    'hello@learningtogetherfoundation.example'
);

-- =========================================
-- INSERT CATEGORIES
-- =========================================

INSERT INTO categories (name)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');

-- =========================================
-- INSERT PROJECTS
-- 5 projects per organization (15 total).
-- Blank locations in the supplied CSV are stored as NULL.
-- =========================================

-- Community Care Network
INSERT INTO projects (name, description, organization_id, location, project_date)
SELECT
    project_data.name,
    project_data.description,
    organizations.organization_id,
    project_data.location,
    project_data.project_date::DATE
FROM organizations
CROSS JOIN (VALUES
    (
        'Food Distribution',
        'Support local families by organizing and distributing food supplies.',
        NULL,
        '2026-12-01'
    ),
    (
        'Food Donation Campaign',
        'Collect and distribute food donations to families in need.',
        'Community Center',
        '2027-02-05'
    ),
    (
        'Health Awareness Camp',
        'Organize health education and wellness awareness activities.',
        'Community Clinic',
        '2027-02-12'
    ),
    (
        'Senior Citizen Support',
        'Provide companionship and assistance to senior citizens.',
        'Senior Care Center',
        '2027-02-19'
    ),
    (
        'Family Support Program',
        'Connect families with essential community support services.',
        'Community Center',
        '2027-02-26'
    )
) AS project_data(name, description, location, project_date)
WHERE organizations.name = 'Community Care Network';

-- Green Future Initiative
INSERT INTO projects (name, description, organization_id, location, project_date)
SELECT
    project_data.name,
 project_data.description,
    organizations.organization_id,
    project_data.location,
    project_data.project_date::DATE
FROM organizations
CROSS JOIN (VALUES
    (
        'Neighborhood Cleanup',
        'Help keep public spaces clean and welcoming.',
        NULL,
        '2026-11-20'
    ),
    (
        'Tree Plantation Drive',
        'Plant trees and improve green spaces in the community.',
        'City Park',
        '2026-12-05'
    ),
    (
        'Park Restoration',
        'Restore public parks by cleaning paths and maintaining gardens.',
        'Central Park',
        '2026-12-12'
    ),
    (
        'Recycling Awareness Campaign',
        'Educate residents about recycling and waste reduction.',
        'Community Hall',
        '2026-12-19'
    ),
    (
        'Community Garden Project',
        'Create a shared garden to encourage sustainable living.',
        'Community Garden',
        '2026-12-26'
    )
) AS project_data(name, description, location, project_date)
WHERE organizations.name = 'Green Future Initiative';

-- Learning Together Foundation
INSERT INTO projects (name, description, organization_id, location, project_date)
SELECT
    project_data.name,
    project_data.description,
    organizations.organization_id,
    project_data.location,
    project_data.project_date::DATE
FROM organizations
CROSS JOIN (VALUES
    (
         'Community Tutoring',
        'Help learners strengthen their reading and study skills.',
        NULL,
        '2026-11-25'
    ),
    (
        'Reading Support Program',
        'Help children improve their reading and language skills.',
        'Public Library',
        '2027-01-05'
    ),
    (
        'Computer Skills Workshop',
        'Teach basic computer skills to students and adults.',
        'Learning Center',
        '2027-01-12'
    ),
    (
        'Career Guidance Session',
        'Help young people explore career and education options.',
        'Community Hall',
        '2027-01-19'
    ),
    (
        'After School Mentoring',
        'Provide academic guidance and mentoring to students.',
        'Learning Center',
        '2027-01-26'
    )
) AS project_data(name, description, location, project_date)
WHERE organizations.name = 'Learning Together Foundation';

-- =========================================
-- ASSIGN A CATEGORY TO EVERY PROJECT
-- =========================================

INSERT INTO project_categories (project_id, category_id)
SELECT
    projects.project_id,
    categories.category_id
FROM projects
JOIN organizations
    ON projects.organization_id = organizations.organization_id
JOIN categories
    ON categories.name = CASE
        WHEN organizations.name = 'Community Care Network'
             AND projects.name IN ('Health Awareness Camp', 'Senior Citizen Support')
            THEN 'Health and Wellness'
        WHEN organizations.name = 'Community Care Network'
            THEN 'Community Service'
        WHEN organizations.name = 'Green Future Initiative'
            THEN 'Environmental'
        WHEN organizations.name = 'Learning Together Foundation'
            THEN 'Educational'
    END;

-- =========================================
-- VERIFICATION QUERIES
-- Expected: 3 organizations, 15 projects,
-- 5 projects per organization, 15 category assignments.
-- =========================================

SELECT
    organizations.name AS organization,
    COUNT(projects.project_id) AS project_count
FROM organizations
LEFT JOIN projects
    ON organizations.organization_id = projects.organization_id
GROUP BY organizations.organization_id, organizations.name
ORDER BY organizations.name;

SELECT
    COUNT(*) AS total_projects
FROM projects;

SELECT
    COUNT(*) AS projects_without_categories
FROM projects
LEFT JOIN project_categories
    ON projects.project_id = project_categories.project_id
WHERE project_categories.project_id IS NULL;

