-- =========================
-- DASHBOARD TABLES
-- =========================

-- 1. LEADS TABLE (Marketing CRM)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_person text,
  email text,
  phone text,
  status text default 'new_lead', -- new_lead, contacted, interested, proposal_sent, negotiation, converted, lost
  potential_value decimal(10,2),
  follow_up_date date,
  notes text,
  source text, -- website, referral, social_media, etc.
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 2. INVOICES TABLE
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  client_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  amount decimal(10,2) not null,
  tax decimal(10,2) default 0,
  discount decimal(10,2) default 0,
  total decimal(10,2) not null,
  status text default 'pending', -- pending, paid, overdue, cancelled
  due_date date,
  paid_date date,
  file_url text, -- URL to uploaded invoice PDF
  notes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 3. CONTRACTS TABLE
create table if not exists contracts (
  id uuid primary key default gen_random_uuid(),
  contract_number text unique not null,
  client_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  status text default 'draft', -- draft, sent, signed, expired
  file_url text, -- URL to contract PDF
  signed_file_url text, -- URL to signed contract PDF
  start_date date,
  end_date date,
  value decimal(10,2),
  notes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 4. FILES TABLE (Document Center)
create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  name text not null,
  file_url text not null,
  file_type text, -- pdf, image, doc, etc.
  file_size bigint, -- in bytes
  category text, -- contract, invoice, design, asset, report, other
  uploaded_by uuid references profiles(id), -- admin who uploaded
  description text,
  created_at timestamp default now()
);

-- 5. EXPENSES TABLE (Financial Tracking)
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null, -- tools, marketing, staff, operations, misc
  description text,
  amount decimal(10,2) not null,
  date date not null,
  receipt_url text, -- URL to receipt image
  created_by uuid references profiles(id),
  created_at timestamp default now()
);

-- 6. TEAM MEMBERS TABLE (Optional)
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  role text, -- developer, designer, manager, etc.
  department text,
  hourly_rate decimal(10,2),
  availability text default 'available', -- available, busy, unavailable
  skills text[], -- array of skills
  joined_at date,
  created_at timestamp default now()
);

-- 7. TASKS TABLE (Project Management)
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  description text,
  status text default 'todo', -- todo, in_progress, review, completed
  priority text default 'medium', -- low, medium, high, urgent
  assigned_to uuid references profiles(id),
  due_date date,
  completed_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 8. ACTIVITY LOG TABLE
create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  action text not null, -- client_added, project_updated, invoice_paid, etc.
  entity_type text, -- client, project, invoice, contract, file
  entity_id uuid,
  description text,
  metadata jsonb, -- additional data
  created_at timestamp default now()
);

-- 9. NOTIFICATIONS TABLE
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null, -- client_joined, invoice_overdue, contract_signed, etc.
  title text not null,
  message text,
  read boolean default false,
  link text, -- URL to related page
  created_at timestamp default now()
);

-- =========================
-- ENABLE ROW LEVEL SECURITY
-- =========================

alter table leads enable row level security;
alter table invoices enable row level security;
alter table contracts enable row level security;
alter table files enable row level security;
alter table expenses enable row level security;
alter table team_members enable row level security;
alter table tasks enable row level security;
alter table activity_log enable row level security;
alter table notifications enable row level security;

-- =========================
-- RLS POLICIES
-- =========================

-- LEADS (Admin only)
create policy "Admins can manage leads"
  on leads for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- INVOICES
create policy "Admins can manage all invoices"
  on invoices for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Clients can view own invoices"
  on invoices for select
  using (
    auth.uid() = client_id
    and exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'client'
    )
  );

-- CONTRACTS
create policy "Admins can manage all contracts"
  on contracts for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Clients can view own contracts"
  on contracts for select
  using (
    auth.uid() = client_id
    and exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'client'
    )
  );

-- FILES
create policy "Admins can manage all files"
  on files for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Clients can view own files"
  on files for select
  using (
    auth.uid() = client_id
    and exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'client'
    )
  );

-- EXPENSES (Admin only)
create policy "Admins can manage expenses"
  on expenses for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- TEAM MEMBERS (Admin only)
create policy "Admins can manage team"
  on team_members for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- TASKS
create policy "Admins can manage all tasks"
  on tasks for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Clients can view project tasks"
  on tasks for select
  using (
    exists (
      select 1 from projects
      where projects.id = tasks.project_id
      and projects.user_id = auth.uid()
    )
  );

-- ACTIVITY LOG (Admin only)
create policy "Admins can view activity log"
  on activity_log for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "System can insert activity log"
  on activity_log for insert
  WITH CHECK (1=1);

-- NOTIFICATIONS
create policy "Users can view own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

create policy "Admins can create notifications"
  on notifications for insert
  WITH CHECK (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- =========================
-- INDEXES FOR PERFORMANCE
-- =========================

create index idx_invoices_client_id on invoices(client_id);
create index idx_invoices_status on invoices(status);
create index idx_contracts_client_id on contracts(client_id);
create index idx_files_client_id on files(client_id);
create index idx_files_project_id on files(project_id);
create index idx_tasks_project_id on tasks(project_id);
create index idx_notifications_user_id on notifications(user_id);
create index idx_leads_status on leads(status);
create index idx_expenses_date on expenses(date);
create index idx_activity_log_user_id on activity_log(user_id);
create index idx_activity_log_created_at on activity_log(created_at desc);