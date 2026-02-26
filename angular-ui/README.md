# MeshForge Angular UI

Angular 19 frontend for the MeshForge Tauri app. Uses standalone components and the Tauri invoke API for `list_serial_ports`, `get_mock_status`, and `is_mock_mode`.

## Requirements

- **Node.js 18.19+** (Angular 19 and the CLI require Node 18+). Check with `node -v`.

## Install and run (from repo root)

```bash
# From grbl-rs root
npm install
cd angular-ui && npm install && cd ..

# Development (Angular dev server + Tauri window)
npm run dev

# With mock API (no hardware)
npm run dev:mock
```

Tauri is configured to use this Angular app: `devUrl` is `http://localhost:4200`, and `beforeDevCommand` runs `cd angular-ui && npm run start`.

## Project structure

- `src/app/app.component.ts` — Root component: ports list, mock banner, mock status.
- `src/app/tauri.service.ts` — Wraps `window.__TAURI__.core.invoke` for Tauri commands.
- `src/styles.css` — Global styles (same dark theme as the legacy UI).

## Build (production)

From repo root:

```bash
npm run build
```

This runs `cd angular-ui && npm run build`, then Tauri bundles the output from `angular-ui/dist/meshforge-angular-ui/browser`.
