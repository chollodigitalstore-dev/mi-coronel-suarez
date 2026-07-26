-- Guía Suárez: reglas comunitarias para calificaciones.
-- Ejecutar en Supabase > SQL Editor.
--
-- Reglas:
-- 1) Un usuario no puede calificar su propia actividad.
-- 2) Un usuario no puede calificar la misma actividad más de una vez.
-- 3) Una calificación publicada no puede ser editada o borrada por el usuario desde la API pública.

alter table public.reviews enable row level security;

-- Asegura una sola reseña por usuario y actividad.
create unique index if not exists reviews_listing_user_unique
on public.reviews (listing_id, user_id);

drop policy if exists "Users create own review" on public.reviews;
drop policy if exists "Users update own review" on public.reviews;
drop policy if exists "Users delete own review" on public.reviews;

create policy "Users create own review"
on public.reviews
for insert
to authenticated
with check (
  auth.uid() = user_id
  and status = 'published'
  and not exists (
    select 1
    from public.listings l
    where l.id = listing_id
      and l.owner_id = auth.uid()
  )
);

-- No recreamos policies de update/delete para usuarios finales:
-- así una calificación no se puede cambiar para manipular reputación.
-- La moderación queda disponible desde service_role/Supabase.
