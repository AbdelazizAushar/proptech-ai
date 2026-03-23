insert into listings (name, description, price, category, location, specs, images, status)
values 
(
  'Modern Apartment Downtown',
  'Spacious 2 bedroom apartment in the heart of the city. Close to all amenities.',
  150000,
  'apartment',
  'Downtown, City Center',
  '{"bedrooms": 2, "bathrooms": 1, "size": "120sqm", "parking": true, "floor": 5}',
  '{"https://example.com/img1.jpg", "https://example.com/img2.jpg"}',
  'available'
),
(
  'Villa with Garden',
  'Luxury 4 bedroom villa with private garden and pool. Quiet neighborhood.',
  450000,
  'villa',
  'North District',
  '{"bedrooms": 4, "bathrooms": 3, "size": "350sqm", "parking": true, "pool": true, "garden": true}',
  '{"https://example.com/img3.jpg", "https://example.com/img4.jpg"}',
  'available'
),
(
  'Studio Near University',
  'Cozy studio apartment perfect for students. 5 min walk from university.',
  45000,
  'studio',
  'University District',
  '{"bedrooms": 1, "bathrooms": 1, "size": "45sqm", "parking": false, "floor": 2}',
  '{"https://example.com/img5.jpg"}',
  'available'
);