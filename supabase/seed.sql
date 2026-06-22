-- Datos ficticios para probar la guía y las reseñas.
-- Puede ejecutarse más de una vez: no duplica actividades existentes.

insert into public.listings (slug, name, category, tags, location, place, icon, phone, verified)
values
  ('carpinteria-el-roble', 'Carpintería El Roble', 'hogar', array['carpintero','muebles','madera','arreglos'], 'coronel-suarez', 'Coronel Suárez', '🪵', '2926 000001', true),
  ('estudio-norte', 'Estudio Norte', 'profesionales', array['arquitectura','planos','construcción'], 'coronel-suarez', 'Coronel Suárez', '📐', '2926 000002', true),
  ('manos-bonitas', 'Manos Bonitas', 'belleza', array['manicura','uñas','pedicura'], 'pueblo-san-jose', 'Pueblo San José', '💅', '2926 000003', true),
  ('sabores-de-casa', 'Sabores de Casa', 'gastronomia', array['comida','viandas','pastas'], 'huanguelen', 'Huanguelén', '🥟', '2926 000004', false),
  ('electro-suarez', 'Electro Suárez', 'hogar', array['electricista','electricidad','instalaciones'], 'pueblo-santa-trinidad', 'Pueblo Santa Trinidad', '⚡', '2926 000005', true),
  ('veterinaria-la-comarca', 'Veterinaria La Comarca', 'mascotas', array['veterinaria','mascotas','alimento'], 'coronel-suarez', 'Coronel Suárez', '🐕', '2926 000006', true)
on conflict (slug) do nothing;

select count(*) as actividades_cargadas from public.listings;
