-- Tabla opcional para alimentar la sección "Trabajos" de Guía Suárez.
-- Permite cargar avisos propios/manuales y combinarlos con fuentes externas.

create table if not exists public.job_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text,
  location text not null default 'Coronel Suárez',
  source text not null default 'Guía Suárez',
  source_url text not null unique,
  summary text,
  employment_type text,
  published_at timestamptz default now(),
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.job_posts enable row level security;

drop policy if exists "Public can read active job posts" on public.job_posts;
create policy "Public can read active job posts"
on public.job_posts
for select
using (
  active = true
  and (expires_at is null or expires_at > now())
);

create index if not exists job_posts_active_published_idx
on public.job_posts (active, published_at desc, created_at desc);

create or replace function public.set_job_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_job_posts_updated_at on public.job_posts;
create trigger set_job_posts_updated_at
before update on public.job_posts
for each row
execute function public.set_job_posts_updated_at();
