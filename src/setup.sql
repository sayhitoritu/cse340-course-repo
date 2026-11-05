
-- =========================================
-- SERVICE NETWORK DATABASE
-- CSE 340 - W02 Database Retrieval
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
    image VARCHAR(255)
);

-- =========================================
-- 2. PROJECTS TABLE
-- =========================================

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    organization_id INTEGER NOT NULL REFERENCES organizations(organization_id)
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
    project_id INTEGER NOT NULL REFERENCES projects(project_id)
        ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id)
        ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- =========================================
-- INSERT ORGANIZATIONS
-- =========================================

INSERT INTO organizations (name, description, image)
VALUES
(
    'Community Care Network',
    'Supports local families through community outreach and essential resources.',
    'community-care.jpg'
),
(
    'Green Future Initiative',
    'Promotes environmental awareness and sustainable community practices.',
    'green-future.jpg'
),
(
    'Learning Together Foundation',
    'Encourages education, mentoring, and lifelong learning.',
    NULL
);

-- =========================================
-- INSERT PROJECTS
-- =========================================

INSERT INTO projects (name, description, organization_id)
VALUES
(
    'Neighborhood Cleanup',
    'Help keep public spaces clean and welcoming.',
    (SELECT organization_id FROM organizations
     WHERE name = 'Green Future Initiative')
),
(
    'Community Tutoring',
    'Help learners strengthen their reading and study skills.',
    (SELECT organization_id FROM organizations
     WHERE name = 'Learning Together Foundation')
),
(
    'Food Distribution',
    'Support local families by organizing and distributing food supplies.',
    (SELECT organization_id FROM organizations
     WHERE name = 'Community Care Network')
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
-- ASSOCIATE PROJECTS WITH CATEGORIES
-- =========================================

INSERT INTO project_categories (project_id, category_id)
VALUES
(
    (SELECT project_id FROM projects WHERE name = 'Neighborhood Cleanup'),
    (SELECT category_id FROM categories WHERE name = 'Environmental')
),
(
    (SELECT project_id FROM projects WHERE name = 'Community Tutoring'),
    (SELECT category_id FROM categories WHERE name = 'Educational')
),
(
    (SELECT project_id FROM projects WHERE name = 'Food Distribution'),
    (SELECT category_id FROM categories WHERE name = 'Community Service')
);
