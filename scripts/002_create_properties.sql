-- Create properties table
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(12, 2) not null,
  location text not null,
  bedrooms integer not null,
  bathrooms integer not null,
  area_sqft integer,
  property_type text not null check (property_type in ('apartment', 'house', 'condo', 'townhouse', 'villa')),
  status text not null default 'available' check (status in ('available', 'pending', 'rented', 'sold')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.properties enable row level security;

-- Policies for properties
create policy "properties_select_all"
  on public.properties for select
  using (true);

create policy "properties_insert_own"
  on public.properties for insert
  with check (auth.uid() = owner_id);

create policy "properties_update_own"
  on public.properties for update
  using (auth.uid() = owner_id);

create policy "properties_delete_own"
  on public.properties for delete
  using (auth.uid() = owner_id);
