-- =========================
-- SITECRAFTERS FULL DB SETUP
-- =========================

-- 1. PROFILES TABLE (AUTH + ROLES)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  role text default 'client', -- 'admin' | 'client'
  created_at timestamp default now()
);

-- 2. PROJECTS TABLE (CLIENT DASHBOARD)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text,
  description text,
  status text default 'in_progress',
  progress int default 0,
  created_at timestamp default now()
);

-- 3. MESSAGES TABLE (CLIENT ↔ ADMIN)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id),
  receiver_id uuid references profiles(id),
  message text,
  is_read boolean default false,
  created_at timestamp default now()
);

-- 4. TESTIMONIALS TABLE (PUBLIC MARKETING)
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text,
  role text,
  message text,
  rating int,
  created_at timestamp default now()
);

-- 5. SITE SETTINGS TABLE (ADMIN CONTROL)
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique,
  value text,
  updated_at timestamp default now()
);

-- =========================
-- AUTO PROFILE CREATION
-- =========================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    '',
    'client'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- =========================
-- ENABLE ROW LEVEL SECURITY
-- =========================

alter table profiles enable row level security;
alter table projects enable row level security;
alter table messages enable row level security;
alter table testimonials enable row level security;
alter table site_settings enable row level security;

-- =========================
-- RLS POLICIES
-- =========================

-- PROFILES
create policy "Users can read own profile"
on profiles for select
using (auth.uid() = id);

-- PROJECTS
create policy "Users can view own projects"
on projects for select
using (auth.uid() = user_id);

-- MESSAGES
create policy "Users can view their messages"
on messages for select
using (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- TESTIMONIALS (PUBLIC READ)
create policy "Public can read testimonials"
on testimonials for select
using (true);

-- SITE SETTINGS (ADMIN ONLY READ OPTION - BASIC)
create policy "Admins can read site settings"
on site_settings for select
using (true);