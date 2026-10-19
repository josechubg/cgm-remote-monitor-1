# Nightscout: nueva instalación 2026

Esta rama prepara Nightscout **15.0.8** con la imagen oficial. El código histórico del repositorio no se copia a la imagen. Se conserva su usuario sin privilegios y su servidor; un pequeño módulo previo construye la URI de MongoDB en memoria, codificando los caracteres especiales de la contraseña sin mostrarla.

## Instalación desde Safari

Abrir el botón de despliegue usando la rama `nightscout-2026`:

[Configurar Nightscout en Render](https://render.com/deploy?repo=https://github.com/josechubg/cgm-remote-monitor-1/tree/nightscout-2026)

La plantilla `render.yaml` fija un único servicio en Frankfurt, con el plan `0.5c-512mb` (precio base revisado el 19-10-2026: 7 USD/mes, más impuestos aplicables). No crea una base de datos de pago. Revisar el resumen de Render antes de activarlo.

La primera configuración pide tres valores privados, que se introducen directamente en Render:

| Campo | Valor que hay que introducir |
| --- | --- |
| `MONGODB_PASSWORD` | La contraseña guardada del usuario MongoDB `nightscout_app_2026`, tal cual, incluso si contiene símbolos. |
| `CONNECT_SHARE_ACCOUNT_NAME` | El usuario de la cuenta Dexcom G7. |
| `CONNECT_SHARE_PASSWORD` | La contraseña de la cuenta Dexcom. |

Render genera `API_SECRET` automáticamente. Guardarlo después desde la configuración privada de Render para acceder a Nightscout. `AUTH_DEFAULT_ROLES=denied` exige autenticación para consultar los datos.

No introducir una `MONGODB_URI` manual: el módulo de arranque la calcula usando la contraseña privada y los datos del nuevo clúster. Los secretos no forman parte del repositorio. Los campos `sync: false` se solicitan solo en la primera creación; los cambios posteriores de contraseña se hacen en Environment de Render. Los despliegues automáticos están desactivados.

## Estado y comprobaciones pendientes

La plantilla está preparada. El servicio no está desplegado ni se ha probado con datos reales. Tras completar los valores privados:

1. Autorizar en Atlas únicamente los rangos de salida que Render muestre para el nuevo servicio.
2. Comprobar el arranque de Nightscout y su conexión con MongoDB.
3. Confirmar que la app Dexcom G7 sube datos y tiene Share activo con al menos un seguidor.
4. Verificar autenticación, nuevas lecturas, horas y unidades.

MongoDB utiliza el rol `readWrite` solo en la base `nightscout`, limitado al clúster nuevo. La integración de datos de la bomba Tandem se preparará por separado; no se importan perfiles antiguos de insulina.

## Referencias

- [Versión oficial 15.0.8](https://github.com/nightscout/cgm-remote-monitor/releases/tag/v15.0.8)
- [Conexión con Dexcom Share](https://nightscout.github.io/uploader/setup/)
- [Seguridad de Nightscout](https://nightscout.github.io/nightscout/security/)
- [Plantillas de Render](https://render.com/docs/blueprint-spec)
