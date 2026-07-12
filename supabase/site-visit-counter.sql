-- Guía Suárez: contador simple de visitas.
-- Ejecutar en Supabase > SQL Editor.
-- El Worker incrementa este contador usando SUPABASE_SERVICE_ROLE_KEY.

create table if not exists public.site_stats (
  key text primary key,
  count bigint not null default 0 check (count >= 0),
  updated_at timestamptz not null default now()
);

insert into public.site_stats (key, count)
values ('visits', 0)
on conflict (key) do nothing;

create or replace function public.increment_site_visit(stat_key text default 'visits')
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  insert into public.site_stats as stats (key, count, updated_at)
  values (stat_key, 1, now())
  on conflict (key)
  do update set
    count = stats.count + 1,
    updated_at = now()
  returning count into new_count;

  return new_count;
end;
$$;

grant execute on function public.increment_site_visit(text) to anon, authenticated, service_role;
grant select on public.site_stats to anon, authenticated, service_role;

alter table public.site_stats enable row level security;

drop policy if exists "Public site stats are readable" on public.site_stats;
create policy "Public site stats are readable"
on public.site_stats
for select
to anon, authenticated
using (true);
