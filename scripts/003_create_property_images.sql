-- Create property_images table
create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  image_url text not null,
  display_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.property_images enable row level security;

-- Policies for property_images
create policy "property_images_select_all"
  on public.property_images for select
  using (true);

create policy "property_images_insert_own"
  on public.property_images for insert
  with check (
    exists (
      select 1 from public.properties
      where id = property_id and owner_id = auth.uid()
    )
  );

create policy "property_images_update_own"
  on public.property_images for update
  using (
    exists (
      select 1 from public.properties
      where id = property_id and owner_id = auth.uid()
    )
  );

create policy "property_images_delete_own"
  on public.property_images for delete
  using (
    exists (
      select 1 from public.properties
      where id = property_id and owner_id = auth.uid()
    )
  );
