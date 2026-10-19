# Nightscout: nueva instalación 2026

Este directorio prepara una instalación de Nightscout **15.0.8** usando la imagen oficial publicada por el proyecto.

El Dockerfile hereda el programa, las dependencias, el usuario sin privilegios y el comando de arranque de la imagen oficial. El código histórico del resto de este repositorio no se copia a la imagen.

## Estado

La preparación del contenedor está completa. El servicio web aún no está desplegado ni se ha probado con datos reales. Faltan las credenciales de la nueva base de datos, la configuración de red y la conexión de Dexcom Share.

## Configuración de Render

- Tipo: Web Service.
- Runtime: Docker.
- Rama: `nightscout-2026`.
- Dockerfile: `./deployment2026/Dockerfile`.
- Contexto de Docker: `./deployment2026`.
- Región propuesta: Frankfurt.
- El comando de inicio se hereda de la imagen.
- Seleccionar el espacio de trabajo y revisar el precio antes de crear el servicio.
- Para recepción continua se necesita un servicio que permanezca encendido.

## Variables del servicio

Introducir los secretos en la configuración privada del proveedor de alojamiento.

| Variable | Configuración |
| --- | --- |
| `MONGODB_URI` | URI del nuevo usuario, con la base de datos `nightscout` y autenticación en `admin`. |
| `API_SECRET` | Secreto nuevo y aleatorio de al menos 12 caracteres. |
| `AUTH_DEFAULT_ROLES` | `denied`, para exigir autenticación al consultar los datos. |
| `ENABLE` | `careportal dbsize connect` |
| `CONNECT_SOURCE` | `dexcomshare` |
| `CONNECT_SHARE_ACCOUNT_NAME` | Usuario de la cuenta Dexcom. |
| `CONNECT_SHARE_PASSWORD` | Contraseña de la cuenta Dexcom. |
| `CONNECT_SHARE_REGION` | `ous` para una cuenta de fuera de Estados Unidos. |

El usuario de MongoDB debe tener únicamente el rol `readWrite` en la base de datos `nightscout`, limitado al nuevo clúster. Autorizar en la red de Atlas las direcciones de salida del servicio elegido.

## Conexión y comprobación

1. Confirmar que la aplicación Dexcom G7 sube datos y que Share está activo con al menos un seguidor.
2. Desplegar con las credenciales nuevas.
3. Comprobar el arranque, la versión y la conexión con MongoDB.
4. Verificar que los datos requieren autenticación.
5. Comprobar la llegada de nuevas lecturas, sus horas y sus unidades.

La integración de datos de la bomba Tandem se preparará por separado, tras confirmar cómo se suben sus datos. No se importan perfiles antiguos de insulina.

## Referencias

- [Versión oficial 15.0.8](https://github.com/nightscout/cgm-remote-monitor/releases/tag/v15.0.8)
- [Conexión con Dexcom Share](https://nightscout.github.io/uploader/setup/)
- [Seguridad de Nightscout](https://nightscout.github.io/nightscout/security/)
