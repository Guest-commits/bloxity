# BLOXITY v1.4 — Classic 2017 Portal

Esta actualización aplica una renovación visual amplia inspirada en la organización y el lenguaje visual del portal de juegos de 2016–2017: navegación azul compacta, menú lateral desplegable, buscador, paneles grises/blancos, lista horizontal de amigos, tarjetas de juegos y catálogo con categorías a la izquierda.

## Archivos para publicar

Reemplaza en el servidor/repositorio:
- `index.html`
- `style.css`
- `script.js` (incluido para mantener una versión coherente del proyecto)

Conserva:
- `config.js` con la configuración pública actual de Supabase.
- La carpeta `assets/` y sus imágenes.

No ejecutes de nuevo las migraciones SQL incluidas en el ZIP. La base de datos ya tiene las monedas Robux y Tix configuradas en el proyecto Supabase existente.

## Funciones que conserva

- Autenticación Supabase existente.
- Perfil y personalización de avatar disponibles en la versión base.
- Amigos y solicitudes de amistad existentes.
- Catálogo de demostración y precios Robux/Tix.
- Builders Club y recompensas configuradas en Supabase.
- Acceso administrativo basado en el estado/permisos devueltos por Supabase.

## Límites actuales

Esta entrega es una renovación de interfaz, no una copia oficial de Roblox ni una plataforma completa de producción. Las experiencias de juegos siguen siendo tarjetas/vistas previas: no incluye un motor de ejecución, publicación de juegos, servidores multijugador reales ni contadores en vivo. El catálogo usa ilustraciones/representaciones originales de demostración, no los modelos o archivos originales de Roblox. El panel administrativo conserva las operaciones que ya están conectadas; no añade por sí solo reportes, sanciones, auditoría completa ni moderación avanzada.

BLOXITY es un proyecto independiente de fans y no está afiliado a Roblox Corporation.
