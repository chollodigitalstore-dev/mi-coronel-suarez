-- Mi Coronel Suárez: esquema inicial de identidad y reputación.
-- Ejecutar una sola vez en Supabase > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 120),
  category text not null,
  tags text[] not null default '{}',
  location text not null,
  place text not null,
  icon text,
  phone text,
  verified boolean not null default false,
  active boolean not null default true,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create table if not exists public.review_responses (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null unique references public.reviews(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 800),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.review_reports (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 300),
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (review_id, reporter_id)
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'Usuario'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace view public.listing_ratings with (security_invoker = true) as
select l.slug, round(avg(r.rating)::numeric, 1) as average_rating, count(r.id)::int as review_count
from public.listings l
left join public.reviews r on r.listing_id = l.id and r.status = 'published'
where l.active = true
group by l.id, l.slug
having count(r.id) > 0;

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.reviews enable row level security;
alter table public.review_responses enable row level security;
alter table public.review_reports enable row level security;

create policy "Public profiles are readable" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Active listings are public" on public.listings for select using (active = true or auth.uid() = owner_id);
create policy "Users create own listings" on public.listings for insert to authenticated with check (auth.uid() = owner_id);
create policy "Owners update listings" on public.listings for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Published reviews are public" on public.reviews for select using (status = 'published' or auth.uid() = user_id);
create policy "Users create own review" on public.reviews for insert to authenticated with check (auth.uid() = user_id and status = 'published');
create policy "Users update own review" on public.reviews for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id and status = 'published');
create policy "Users delete own review" on public.reviews for delete to authenticated using (auth.uid() = user_id);

create policy "Responses are public" on public.review_responses for select using (true);
create policy "Owners respond to reviews" on public.review_responses for insert to authenticated with check (
  auth.uid() = author_id and exists (
    select 1 from public.reviews r join public.listings l on l.id = r.listing_id
    where r.id = review_id and l.owner_id = auth.uid()
  )
);

create policy "Users report reviews" on public.review_reports for insert to authenticated with check (auth.uid() = reporter_id and status = 'pending');
create policy "Users see own reports" on public.review_reports for select to authenticated using (auth.uid() = reporter_id);

insert into public.listings (slug, name, category, tags, location, place, icon, phone, verified)
values
  ('carpinteria-el-roble', 'Carpintería El Roble', 'hogar', array['carpintero','muebles','madera','arreglos'], 'coronel-suarez', 'Coronel Suárez', '🪵', '2926 000001', true),
  ('estudio-norte', 'Estudio Norte', 'profesionales', array['arquitectura','planos','construcción'], 'coronel-suarez', 'Coronel Suárez', '📐', '2926 000002', true),
  ('manos-bonitas', 'Manos Bonitas', 'belleza', array['manicura','uñas','pedicura'], 'pueblo-san-jose', 'Pueblo San José', '💅', '2926 000003', true),
  ('sabores-de-casa', 'Sabores de Casa', 'gastronomia', array['comida','viandas','pastas'], 'huanguelen', 'Huanguelén', '🥟', '2926 000004', false),
  ('electro-suarez', 'Electro Suárez', 'hogar', array['electricista','electricidad','instalaciones'], 'pueblo-santa-trinidad', 'Pueblo Santa Trinidad', '⚡', '2926 000005', true),
  ('veterinaria-la-comarca', 'Veterinaria La Comarca', 'mascotas', array['veterinaria','mascotas','alimento'], 'coronel-suarez', 'Coronel Suárez', '🐕', '2926 000006', true)
on conflict (slug) do nothing;
