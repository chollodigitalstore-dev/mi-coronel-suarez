-- Ejecutar en Supabase SQL Editor.
-- Agrega una descripción corta opcional para cada aviso.

alter table public.listings
add column if not exists description text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'listings_description_length'
  ) then
    alter table public.listings
    add constraint listings_description_length
    check (description is null or char_length(description) <= 150);
  end if;
end $$;
