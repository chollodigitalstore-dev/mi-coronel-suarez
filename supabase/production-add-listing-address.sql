-- Ejecutar en Supabase SQL Editor.
-- Agrega direccion opcional para que el boton de Google Maps apunte a una ubicacion real.

alter table public.listings
add column if not exists address text;

