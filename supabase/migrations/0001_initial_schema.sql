-- RAMS Made Easy: multi-tenant foundation. Apply through the Supabase migration workflow.
create type public.member_role as enum ('company_admin','creator','competent_reviewer','supervisor','operative','client_viewer');
create type public.rams_status as enum ('draft','in_review','changes_requested','approved','issued','archived');

create table public.companies (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz not null default now());
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text not null, created_at timestamptz not null default now());
create table public.company_members (company_id uuid references public.companies(id) on delete cascade, user_id uuid references public.profiles(id) on delete cascade, role public.member_role not null, primary key(company_id,user_id));
create table public.sites (id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade, name text not null, client_name text, address text, created_at timestamptz not null default now());
create table public.rams (id uuid primary key default gen_random_uuid(), company_id uuid not null references public.companies(id) on delete cascade, site_id uuid references public.sites(id), reference text not null, title text not null, status public.rams_status not null default 'draft', version integer not null default 1, activity jsonb not null default '{}'::jsonb, created_by uuid not null references public.profiles(id), approved_by uuid references public.profiles(id), approved_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(company_id,reference));
create table public.hazards (id uuid primary key default gen_random_uuid(), company_id uuid references public.companies(id) on delete cascade, name text not null, category text not null, default_controls jsonb not null default '[]'::jsonb, active boolean not null default true);
create table public.rams_hazards (id uuid primary key default gen_random_uuid(), rams_id uuid not null references public.rams(id) on delete cascade, hazard_id uuid not null references public.hazards(id), likelihood_before smallint check(likelihood_before between 1 and 5), severity_before smallint check(severity_before between 1 and 5), controls jsonb not null default '[]'::jsonb, likelihood_after smallint check(likelihood_after between 1 and 5), severity_after smallint check(severity_after between 1 and 5));
create table public.rams_reviews (id uuid primary key default gen_random_uuid(), rams_id uuid not null references public.rams(id) on delete cascade, reviewer_id uuid not null references public.profiles(id), decision text not null check(decision in ('approved','changes_requested')), comments text, created_at timestamptz not null default now());
create table public.acknowledgements (id uuid primary key default gen_random_uuid(), rams_id uuid not null references public.rams(id) on delete cascade, user_id uuid not null references public.profiles(id), acknowledged_at timestamptz not null default now(), ip_address inet, unique(rams_id,user_id));
create table public.audit_events (id bigint generated always as identity primary key, company_id uuid not null references public.companies(id) on delete cascade, rams_id uuid references public.rams(id) on delete cascade, actor_id uuid references public.profiles(id), action text not null, detail jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());

create index company_members_user_idx on public.company_members(user_id);
create index sites_company_idx on public.sites(company_id);
create index rams_company_idx on public.rams(company_id);
create index rams_hazards_rams_idx on public.rams_hazards(rams_id);
create index audit_company_idx on public.audit_events(company_id,created_at desc);

alter table public.companies enable row level security; alter table public.profiles enable row level security; alter table public.company_members enable row level security; alter table public.sites enable row level security; alter table public.rams enable row level security; alter table public.hazards enable row level security; alter table public.rams_hazards enable row level security; alter table public.rams_reviews enable row level security; alter table public.acknowledgements enable row level security; alter table public.audit_events enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select,insert,update,delete on public.companies,public.profiles,public.company_members,public.sites,public.rams,public.hazards,public.rams_hazards,public.rams_reviews,public.acknowledgements to authenticated;
grant select on public.audit_events to authenticated;

create policy "members read companies" on public.companies for select to authenticated using (exists(select 1 from public.company_members m where m.company_id=id and m.user_id=(select auth.uid())));
create policy "users read own profile" on public.profiles for select to authenticated using (id=(select auth.uid()));
create policy "members read memberships" on public.company_members for select to authenticated using (user_id=(select auth.uid()));
create policy "members read sites" on public.sites for select to authenticated using (exists(select 1 from public.company_members m where m.company_id=sites.company_id and m.user_id=(select auth.uid())));
create policy "members read rams" on public.rams for select to authenticated using (exists(select 1 from public.company_members m where m.company_id=rams.company_id and m.user_id=(select auth.uid())));
create policy "creators insert rams" on public.rams for insert to authenticated with check (created_by=(select auth.uid()) and exists(select 1 from public.company_members m where m.company_id=rams.company_id and m.user_id=(select auth.uid()) and m.role in ('company_admin','creator','competent_reviewer')));
create policy "creators update draft rams" on public.rams for update to authenticated using (exists(select 1 from public.company_members m where m.company_id=rams.company_id and m.user_id=(select auth.uid()) and m.role in ('company_admin','creator','competent_reviewer'))) with check (exists(select 1 from public.company_members m where m.company_id=rams.company_id and m.user_id=(select auth.uid()) and m.role in ('company_admin','creator','competent_reviewer')));
