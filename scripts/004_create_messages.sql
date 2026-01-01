-- Create messages table for communication
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policies for messages
create policy "messages_select_own"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "messages_insert_own"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "messages_update_own"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- Create index for faster queries
create index if not exists messages_property_id_idx on public.messages(property_id);
create index if not exists messages_sender_id_idx on public.messages(sender_id);
create index if not exists messages_receiver_id_idx on public.messages(receiver_id);
