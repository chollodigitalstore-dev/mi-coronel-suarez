-- Limpieza de datos ficticios usados durante el prototipo.
-- Ejecutar en Supabase SQL Editor para quitar los avisos de fantasía.

delete from public.listings
where slug in (
  'carpinteria-el-roble',
  'estudio-norte',
  'manos-bonitas',
  'sabores-de-casa',
  'electro-suarez',
  'veterinaria-la-comarca'
);

select count(*) as avisos_ficticios_restantes
from public.listings
where slug in (
  'carpinteria-el-roble',
  'estudio-norte',
  'manos-bonitas',
  'sabores-de-casa',
  'electro-suarez',
  'veterinaria-la-comarca'
);
