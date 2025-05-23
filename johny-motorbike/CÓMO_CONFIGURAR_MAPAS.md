# Configuración de mapas estáticos en Johny Motorbike

Debido a cambios en los servicios de mapas, hemos actualizado la aplicación para usar **Geoapify** como proveedor de mapas estáticos. Para que los mapas funcionen correctamente, necesitas configurar una clave API gratuita.

## Cómo obtener una clave API de Geoapify

1. Ve a [Geoapify](https://www.geoapify.com/) y crea una cuenta gratuita.
2. Una vez creada tu cuenta y hayas iniciado sesión, ve a tu [Dashboard](https://myprojects.geoapify.com/).
3. Crea un nuevo proyecto haciendo clic en "Add project".
4. Dale un nombre a tu proyecto (por ejemplo, "Johny Motorbike").
5. Una vez creado el proyecto, verás una clave API. Cópiala.

## Configuración de la clave API en el proyecto

1. En la carpeta raíz del proyecto (`front-johny-motorbike/johny-motorbike/`), abre el archivo `.env.local`.
2. Reemplaza el valor de `VITE_GEOAPIFY_API_KEY=add-your-api-key-here` por tu clave API:

```
VITE_GEOAPIFY_API_KEY=tu-clave-api-aquí
```

3. Guarda el archivo y reinicia la aplicación si ya estaba en ejecución.

## Verificación

Ahora deberías poder ver los mapas estáticos en:
- Las tarjetas de rutas en la página principal
- La vista detallada de cada ruta
- El depurador de mapas

Si sigues teniendo problemas, asegúrate de:
1. Haber copiado correctamente la clave API
2. Haber reiniciado la aplicación después de cambiar el archivo .env
3. No tener bloqueadores de publicidad que puedan estar impidiendo las peticiones a servicios externos

## Límites del plan gratuito

El plan gratuito de Geoapify permite hasta 3,000 solicitudes al mes, lo que debería ser suficiente para desarrollo y pruebas. Si necesitas más, considera actualizar a un plan de pago en Geoapify.

## Problemas conocidos

Si ves errores en la consola del navegador relacionados con las imágenes de los mapas, verifica:
1. Que la clave API esté configurada correctamente
2. Que las coordenadas en las rutas sean válidas
3. Que tu conexión a internet esté funcionando correctamente
