-- Leads MVP database schema
-- Clean CRM-first schema with workspace-aware ownership

create extension if not exists "pgcrypto";

drop table if exists activity_logs cascade;
drop table if exists workspace_memberships cascade;
drop table if exists workspaces cascade;
drop table if exists wormhole_integrations cascade;
drop table if exists weekly_sentiment_reports cascade;
drop table if exists weekly_entity_metrics cascade;
drop table if exists watchlist_entities cascade;
drop table if exists scrape_logs cascade;
drop table if exists sentiment_data cascade;
drop table if exists announcements cascade;
drop table if exists contacts cascade;
drop table if exists daily_summaries cascade;
drop table if exists organizations cascade;
drop table if exists app_users cascade;

create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table workspace_memberships (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name text not null,
  slug text,
  website text,
  description text,
  lead_status text not null default 'new' check (
    lead_status in (
      'new',
      'researching',
      'ready_to_contact',
      'contacted',
      'follow_up',
      'qualified',
      'unqualified',
      'archived'
    )
  ),
  priority_score integer not null default 50 check (priority_score between 0 and 100),
  source text not null default 'manual',
  owner_user_id uuid references auth.users(id) on delete set null,
  notes text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  first_name text,
  last_name text,
  full_name text,
  title text,
  role text,
  email text,
  phone text,
  linkedin_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  organization_id uuid references organizations(id) on delete cascade,
  contact_id uuid references contacts(id) on delete cascade,
  type text not null,
  summary text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table daily_summaries (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  summary_date date not null default current_date,
  executive_summary text,
  lead_changes_summary text,
  contact_changes_summary text,
  action_items text,
  raw_data jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_workspace_memberships_user_id on workspace_memberships(user_id);
create index idx_organizations_workspace_id on organizations(workspace_id);
create index idx_organizations_status on organizations(workspace_id, lead_status);
create index idx_organizations_priority on organizations(workspace_id, priority_score desc);
create index idx_organizations_created_at on organizations(workspace_id, created_at desc);
create index idx_organizations_updated_at on organizations(workspace_id, updated_at desc);
create index idx_contacts_workspace_id on contacts(workspace_id);
create index idx_contacts_organization_id on contacts(organization_id);
create index idx_contacts_created_at on contacts(workspace_id, created_at desc);
create index idx_activity_logs_workspace_id on activity_logs(workspace_id, created_at desc);
create index idx_activity_logs_organization_id on activity_logs(organization_id, created_at desc);
create index idx_daily_summaries_workspace_id on daily_summaries(workspace_id, created_at desc);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_workspaces_updated_at
  before update on workspaces
  for each row execute function update_updated_at_column();

create trigger update_organizations_updated_at
  before update on organizations
  for each row execute function update_updated_at_column();

create trigger update_contacts_updated_at
  before update on contacts
  for each row execute function update_updated_at_column();

create or replace function is_workspace_member(target_workspace_id uuid)
returns boolean as $$
  select exists (
    select 1
    from workspace_memberships wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
  );
$$ language sql stable;

create or replace function is_workspace_owner(target_workspace_id uuid)
returns boolean as $$
  select exists (
    select 1
    from workspace_memberships wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
      and wm.role = 'owner'
  );
$$ language sql stable;

alter table workspaces enable row level security;
alter table workspace_memberships enable row level security;
alter table organizations enable row level security;
alter table contacts enable row level security;
alter table activity_logs enable row level security;
alter table daily_summaries enable row level security;

create policy "workspace members can view workspaces"
  on workspaces for select
  using (is_workspace_member(id));

create policy "workspace owners can update workspaces"
  on workspaces for update
  using (is_workspace_owner(id))
  with check (is_workspace_owner(id));

create policy "workspace members can view memberships"
  on workspace_memberships for select
  using (is_workspace_member(workspace_id));

create policy "workspace owners can manage memberships"
  on workspace_memberships for all
  using (is_workspace_owner(workspace_id))
  with check (is_workspace_owner(workspace_id));

create policy "workspace members can read organizations"
  on organizations for select
  using (is_workspace_member(workspace_id));

create policy "workspace members can insert organizations"
  on organizations for insert
  with check (is_workspace_member(workspace_id));

create policy "workspace members can update organizations"
  on organizations for update
  using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

create policy "workspace members can delete organizations"
  on organizations for delete
  using (is_workspace_member(workspace_id));

create policy "workspace members can read contacts"
  on contacts for select
  using (is_workspace_member(workspace_id));

create policy "workspace members can insert contacts"
  on contacts for insert
  with check (is_workspace_member(workspace_id));

create policy "workspace members can update contacts"
  on contacts for update
  using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

create policy "workspace members can delete contacts"
  on contacts for delete
  using (is_workspace_member(workspace_id));

create policy "workspace members can read activity logs"
  on activity_logs for select
  using (is_workspace_member(workspace_id));

create policy "workspace members can insert activity logs"
  on activity_logs for insert
  with check (is_workspace_member(workspace_id));

create policy "workspace members can delete activity logs"
  on activity_logs for delete
  using (is_workspace_owner(workspace_id));

create policy "workspace members can read summaries"
  on daily_summaries for select
  using (is_workspace_member(workspace_id));

create policy "workspace members can insert summaries"
  on daily_summaries for insert
  with check (is_workspace_member(workspace_id));

create policy "workspace members can update summaries"
  on daily_summaries for update
  using (is_workspace_member(workspace_id))
  with check (is_workspace_member(workspace_id));

create policy "workspace members can delete summaries"
  on daily_summaries for delete
  using (is_workspace_owner(workspace_id));
