# BLOXITY v0.8 — interfaz clásica inspirada en 2017

## Incluye
- Navegación independiente: Inicio, Juegos, Avatar, Amigos, Catálogo y BloxCoins.
- Diseño adaptable a Android y escritorio, con estética clásica azul y tarjetas de experiencias.
- Página de Juegos con filtros por género, búsqueda, orden alfabético y fichas de vista previa.
- Editor de avatar con selector R6/R15, pestañas de categorías, vista 3D R6 y catálogo de artículos de demostración.
- Conserva la integración existente con Supabase, amigos, inventario y economía BloxCoins v0.7.

## Publicar
1. Extrae el ZIP.
2. Conserva `config.js` con tu URL y clave publishable de Supabase. No añadas claves `service_role`, `secret` ni contraseñas.
3. Sube el contenido de la carpeta `bloxity-main` al repositorio GitHub, reemplazando los archivos anteriores.
4. Espera a que GitHub Pages termine el despliegue y recarga la web.

## Estado y límites de esta versión
- El selector R15 es preliminar: cambia la presentación, pero todavía no es un rig articulado real de 15 partes.
- Los artículos 3D del catálogo son modelos geométricos de demostración, no modelos importados `.glb`.
- Los juegos son fichas de demostración; todavía no hay motor de ejecución, servidores ni multijugador.
- Los conjuntos guardados y otras funciones del editor se completarán en fases posteriores.
- Antes de abrir el proyecto al público, revisa las políticas RLS y las funciones RPC de Supabase.

BLOXITY es un proyecto independiente inspirado en la estética de plataformas de juegos de 2017. No es Roblox ni está afiliado a Roblox Corporation.


## Acceso sin correo visible (v0.8.1)
- El formulario de BLOXITY solicita únicamente nombre de usuario y contraseña.
- Para usar Supabase Auth, el cliente convierte internamente el nombre de usuario en un alias técnico (`usuario@users.bloxity.invalid`). No se muestra ni se solicita un correo real.
- En Supabase, abre **Authentication → Providers → Email** y desactiva **Confirm email** antes de registrar cuentas. El alias es técnico y no recibe mensajes.
- Los nombres de usuario deben tener entre 3 y 20 caracteres (letras, números y guion bajo).
- Las cuentas antiguas creadas con un correo real no podrán iniciar sesión con este nuevo formulario sin una migración. No borres usuarios existentes hasta decidir cómo migrarlos.
- Al no recopilar correo real, el restablecimiento automático de contraseña por email no estará disponible. Implementa un método seguro de recuperación antes de abrir el registro al público.
