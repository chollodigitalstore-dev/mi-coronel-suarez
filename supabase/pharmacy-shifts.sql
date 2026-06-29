-- Guía Suárez: farmacias de turno.
-- Ejecutar en Supabase > SQL Editor.
-- No se muestra fuente en la web. Cargar solo datos confirmados.

create table if not exists public.pharmacy_shifts (
  id uuid primary key default gen_random_uuid(),
  pharmacy_name text not null check (char_length(pharmacy_name) between 2 and 120),
  address text,
  phone text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists pharmacy_shifts_current_idx
on public.pharmacy_shifts (active, starts_at, ends_at);

alter table public.pharmacy_shifts enable row level security;

drop policy if exists "Active pharmacy shifts are public" on public.pharmacy_shifts;
create policy "Active pharmacy shifts are public"
on public.pharmacy_shifts
for select
using (active = true);

-- Ejemplo de carga manual:
-- Ajustar fechas/horarios con zona horaria Argentina (-03).
--
-- insert into public.pharmacy_shifts (pharmacy_name, address, phone, starts_at, ends_at)
-- values (
--   'Farmacia Ejemplo',
--   'Av. Principal 123',
--   '2926-000000',
--   '2026-06-29 08:30:00-03',
--   '2026-06-30 08:30:00-03'
-- );
