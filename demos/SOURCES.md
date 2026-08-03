# Fuentes de guías / demos funcionales

Al actualizar un demo, corre desde `project/`:

```bash
npm run demos:sync
```

| Demo (slug) | Ruta pública (CastleXpert) | Fuente original (mantener) |
|-------------|----------------------------|----------------------------|
| `tracklogic` | `public/demos/tracklogic/guide/` | `C:\Proyectos\Track_logistic\guide` |
| `foodly` | `public/demos/foodly/guide/` | `C:\Proyectos\DEMO_fastfood\guide` |
| `cmms` | `public/demos/cmms/guide/` | `C:\Proyectos\MANTE_PREVENTIVO\guide` (solo `index.html` + `images/`; sin `node_modules` ni `mockups`) |

### TrackLogic — nombres públicos

| App | Nombre | URL |
|-----|--------|-----|
| Manager | Tracklogistic Manager | https://tracklogistic-manager.castlexpert.com |
| Clientes | Tracklogistic | https://tracklogistic.castlexpert.com |
| Ruta / bodega | Tracklogistic Logic | https://tracklogistic-logic.castlexpert.com |

Tras editar la fuente de TrackLogic, corre `npm run demos:sync` y luego `node scripts/rewrite-tracklogic-guide.mjs` (o vuelve a aplicar la reescritura) para mantener nombres/URLs.

## APKs (WAdministrativo)

| APK | Destino | Fuente original |
|-----|---------|-----------------|
| `foodly-rest.apk` | `WAdministrativo/server/storage/apks/foodly-rest.apk` | `C:\Proyectos\DEMO_fastfood\FF_APP\build\app\outputs\apk\release\foodly-rest.apk` |

Descarga pública (con tracking): `GET {VITE_ADMIN_URL}/api/public/apk/foodly-rest/download`
