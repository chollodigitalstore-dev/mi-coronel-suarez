-- Guía Suárez: verificación/reparación de calificaciones.
-- Ejecutar en Supabase > SQL Editor si las reseñas devuelven errores de permisos/RLS.
-- Es idempotente: borra y recrea solo las policies/vista relacionadas.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text check (comment is null or char_length(comment) between 3 and 800),
  status text not null default 'published' check (status in ('published', 'hidden', 'pending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, user_id)
);

alter table public.reviews enable row level security;

drop policy if exists "Published reviews are public" on public.reviews;
drop policy if exists "Users create own review" on public.reviews;
drop policy if exists "Users update own review" on public.reviews;
drop policy if exists "Users delete own review" on public.reviews;

create policy "Published reviews are public"
on public.reviews
for select
using (status = 'published' or auth.uid() = user_id);

create policy "Users create own review"
on public.reviews
for insert
to authenticated
with check (auth.uid() = user_id and status = 'published');

create policy "Users update own review"
on public.reviews
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id and status = 'published');

create policy "Users delete own review"
on public.reviews
for delete
to authenticated
using (auth.uid() = user_id);

create or replace view public.listing_ratings
with (security_invoker = true) as
select
  l.slug,
  round(avg(r.rating)::numeric, 1) as average_rating,
  count(r.id)::int as review_count
from public.listings l
left join public.reviews r
  on r.listing_id = l.id
  and r.status = 'published'
where l.active = true
group by l.id, l.slug
having count(r.id) > 0;

grant select on public.listing_ratings to anon, authenticated;
