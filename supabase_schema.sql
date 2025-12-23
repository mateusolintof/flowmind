-- Create a table to store diagrams
create table if not exists diagrams (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- Anonymous UUID stored in localStorage
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table diagrams enable row level security;

-- Create a policy to allow anyone to read/write (since we are doing anonymous auth based on user_id)
-- In a real production app with auth, you would check auth.uid()
create policy "Allow public access based on user_id" on diagrams
  for all
  using (true)
  with check (true);
