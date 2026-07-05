-- Ejecutar en Supabase SQL Editor si al publicar un aviso aparece error de permisos/RLS.
-- Permite que un usuario autenticado cree avisos asociados a su propia cuenta.

drop policy if exists "Users create own listings" on public.listings;

create policy "Users create own listings"
on public.listings
for insert
to authenticated
with check (auth.uid() = owner_id);

