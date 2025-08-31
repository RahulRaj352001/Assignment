-- Migration: 002_seed_categories.sql
-- Description: Seed initial categories for the application

-- Insert common expense categories
INSERT INTO categories (name) VALUES 
    ('Food & Dining'),
    ('Transportation'),
    ('Shopping'),
    ('Entertainment'),
    ('Healthcare'),
    ('Utilities'),
    ('Rent/Mortgage'),
    ('Insurance'),
    ('Education'),
    ('Travel'),
    ('Gifts'),
    ('Subscriptions'),
    ('Personal Care'),
    ('Home & Garden'),
    ('Pets'),
    ('Taxes'),
    ('Other Expenses')
ON CONFLICT (name) DO NOTHING;

-- Insert common income categories
INSERT INTO categories (name) VALUES 
    ('Salary'),
    ('Freelance'),
    ('Investment'),
    ('Business'),
    ('Rental Income'),
    ('Gifts'),
    ('Other Income')
ON CONFLICT (name) DO NOTHING;
