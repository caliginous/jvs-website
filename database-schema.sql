-- Vercel Postgres Database Schema for JVS Website
-- This file contains the SQL commands to create the necessary tables

-- Create content table for articles, events, recipes, etc.
CREATE TABLE IF NOT EXISTS content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    featured_image VARCHAR(500),
    author VARCHAR(100),
    type VARCHAR(50) NOT NULL DEFAULT 'post', -- 'post', 'event', 'recipe', 'page'
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Create magazine_issues table for magazine content
CREATE TABLE IF NOT EXISTS magazine_issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    r2_key VARCHAR(500),
    cover_image VARCHAR(500),
    ocr_text TEXT,
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create events table for event management
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location VARCHAR(255),
    price DECIMAL(10,2),
    capacity INTEGER,
    tickets_available INTEGER,
    featured_image VARCHAR(500),
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    servings INTEGER,
    prep_time VARCHAR(50),
    cook_time VARCHAR(50),
    difficulty VARCHAR(20),
    featured_image VARCHAR(500),
    author VARCHAR(100),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for admin access
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create settings table for site configuration
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample content
INSERT INTO content (title, slug, content, excerpt, type, status) VALUES
('Welcome to JVS', 'welcome', '<p>Welcome to the Jewish Vegetarian Society website.</p>', 'Welcome to JVS', 'page', 'published'),
('About Jewish Vegetarianism', 'about-jewish-vegetarianism', '<p>Jewish vegetarianism has deep roots in Jewish tradition and values.</p>', 'Exploring the connection between Jewish values and vegetarianism', 'post', 'published');

-- Insert sample settings
INSERT INTO settings (key, value) VALUES
('site_title', 'Jewish Vegetarian Society'),
('site_description', 'Promoting Jewish values through veganism and sustainability'),
('contact_email', 'info@jvs.org.uk');

-- Create indexes for better performance
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_published_at ON content(published_at);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_recipes_published_at ON recipes(published_at);
