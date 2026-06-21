# Mi Coronel Suárez — prototipo inicial

Primera maqueta navegable de una guía local de profesionales, comercios y servicios.

## Cómo abrirla

Abrir `index.html` con cualquier navegador moderno. No requiere instalación ni conexión, salvo para cargar las tipografías; si no hay internet, utiliza una tipografía del sistema.

## Qué permite probar

- Buscar actividades por nombre, servicio o palabra relacionada.
- Filtrar por localidad.
- Explorar rubros.
- Ver fichas resumidas y simular contacto telefónico.
- Abrir el formulario para sumar una actividad.

Todos los nombres, teléfonos y estados son datos ficticios de demostración.

## Próxima etapa sugerida

Validar rubros y localidades con usuarios reales, definir la identidad visual y convertir el prototipo en una aplicación con base de datos, administración y carga pública moderada.

## Publicación en Cloudflare Workers

El proyecto incluye `wrangler.toml`, recursos estáticos y cabeceras de seguridad para Cloudflare Workers.

### Opción recomendada: repositorio conectado

1. Crear un repositorio en GitHub con estos archivos.
2. En Cloudflare, ingresar a **Workers & Pages → Create → Import a repository**.
3. Elegir el repositorio.
4. No indicar comando de compilación.
5. Usar `npx wrangler deploy` como comando de implementación.
6. Publicar y luego asociar el dominio desde **Custom domains**.

Cada cambio subido al repositorio se publicará automáticamente.

### Opción rápida: carga directa

Desde esta carpeta, con Node.js y Wrangler disponibles:

```powershell
npx wrangler deploy
```

Cloudflare solicitará iniciar sesión la primera vez. La carga directa es cómoda para una prueba, pero conectar un repositorio es más conveniente para mantener el sitio.
