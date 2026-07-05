-- Ejecutar en Supabase SQL Editor.
-- Permite que cada usuario administre solo sus propios avisos.

drop policy if exists "Users create own listings" on public.listings;
drop policy if exists "Owners update listings" on public.listings;
drop policy if exists "Owners delete listings" on public.listings;

create policy "Users create own listings"
on public.listings
for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "Owners update listings"
on public.listings
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "Owners delete listings"
on public.listings
for delete
to authenticated
using (auth.uid() = owner_id);

