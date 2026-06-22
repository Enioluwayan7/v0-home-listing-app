-- This script adds sample properties to demonstrate the Browse Properties page
-- Run this in your Supabase SQL editor

-- First, get a test owner ID (replace with an actual user ID from your auth.users table)
-- You can find user IDs by going to Authentication > Users in Supabase dashboard

-- Insert sample properties
INSERT INTO properties (id, owner_id, title, description, location, property_type, bedrooms, bathrooms, area_sqft, price, status, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1), -- Uses the first user in your system
    'Modern Downtown Loft',
    'Beautiful downtown loft with stunning city views, open floor plan, and modern amenities.',
    'Downtown, City Center',
    'apartment',
    2,
    1,
    1200,
    2500,
    'available',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Suburban Family Home',
    'Spacious 3-bedroom family home with a large backyard, perfect for families.',
    'Suburbs, Residential Area',
    'house',
    3,
    2,
    2000,
    3500,
    'available',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Cozy Studio Apartment',
    'Intimate studio apartment, perfect for professionals or students. Recently renovated.',
    'Midtown, Arts District',
    'apartment',
    1,
    1,
    600,
    1500,
    'available',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Luxury Penthouse',
    'Exclusive penthouse with rooftop access, premium finishes, and panoramic views.',
    'Downtown, Skyline District',
    'apartment',
    4,
    3,
    3500,
    6000,
    'available',
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM auth.users LIMIT 1),
    'Charming Garden Cottage',
    'Quaint cottage with a private garden, perfect for a peaceful retreat.',
    'Countryside, Village',
    'house',
    2,
    1,
    1500,
    2000,
    'available',
    now(),
    now()
  );
