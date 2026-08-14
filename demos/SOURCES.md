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
| `pura-puntos` | `public/demos/pura-puntos/guide/` | `C:\Proyectos\LOYALTY\loyalty-platform\guide` (`pura-puntos-guia.html` → `index.html` + `assets/`) |

### Pura Puntos — nombres públicos

| App | Nombre | URL |
|-----|--------|-----|
| Wallet cliente | Pura Puntos | https://pura-puntos.castlexpert.com |
| Punto de venta | Pura Puntos Cash | https://pura-puntos-cash.castlexpert.com |
| Consola | Pura Puntos Manager | https://pura-puntos-manager.castlexpert.com |

Video promo: `public/images/demos/pp.mp4`

## Mockups / presentaciones

Al actualizar un mockup, corre desde `project/`:

```bash
npm run mockups:sync
```

| Mockup (slug) | Ruta pública | Fuente original |
|---------------|--------------|-----------------|
| `cmms-inventario` | `/mockups/cmms-inventario/` | `C:\Proyectos\MANTE_PREVENTIVO\guide\inventario-mockup.html` |
| `logistic-internacional` | `/mockups/logistic-internacional/` | `C:\Proyectos\Logistic\mockup\index.html` |
| `erp-inventario` | `/mockups/erp-inventario/` | `C:\Users\castl\Downloads\Mockup_ERP_Inventario.html` |

Listado: `/mockups`

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
