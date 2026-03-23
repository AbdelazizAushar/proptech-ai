-- Listings
create table listings (
  id              uuid primary key default gen_random_uuid(),
  name            text,
  description     text,
  price           numeric,
  category        text,
  location        text,
  specs           jsonb,
  images          text[],
  status          text default 'available',
  created_at      timestamp default now(),
  updated_at      timestamp default now()
);

-- Users
create table users (
  id              uuid primary key default gen_random_uuid(),
  whatsapp_number text unique,
  name            text,
  email           text,
  phone           text,
  created_at      timestamp default now()
);

-- Conversations
create table conversations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id),
  listing_id      uuid references listings(id),
  messages        jsonb default '[]',
  status          text default 'active',
  created_at      timestamp default now()
);

-- Appointments
create table appointments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references users(id),
  listing_id      uuid references listings(id),
  conversation_id uuid references conversations(id),
  appointment_date date,
  appointment_time time,
  status          text default 'pending',
  notes           text,
  created_at      timestamp default now()
);

-- Knowledge Base
create table knowledge_base (
  id              uuid primary key default gen_random_uuid(),
  listing_id      uuid references listings(id),
  content         text,
  image_url       text,
  embedding       vector(512),
  type            text default 'text',
  created_at      timestamp default now()
);

-- Admins
create table admins (
  id              uuid primary key default gen_random_uuid(),
  name            text,
  email           text unique,
  password_hash   text,
  created_at      timestamp default now()
);