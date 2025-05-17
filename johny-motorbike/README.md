# Johny Motorbike - Frontend

Frontend para la aplicación de rutas en moto Johny Motorbike, desarrollada con React y Vite.

## Requisitos previos

- Node.js 16 o superior
- npm 7 o superior

## Configuración

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
   - Copia el archivo `.env`
   - Actualiza las variables según tu entorno

## Configuración de mapas

Esta aplicación utiliza Geoapify para mostrar mapas estáticos de las rutas. Para configurar correctamente los mapas, sigue las instrucciones en [CÓMO_CONFIGURAR_MAPAS.md](./CÓMO_CONFIGURAR_MAPAS.md).

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Esto iniciará la aplicación en modo desarrollo, normalmente en `http://localhost:5173`.

## Características

- Visualización de rutas en motocicleta
- Filtrado por país, distancia, dificultad, etc.
- Autenticación de usuarios
- Guardar rutas favoritas
- Comentarios en rutas
- Visualización de mapas estáticos de rutas
- Puntuaciones y valoraciones de rutas
