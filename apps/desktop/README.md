# Levera Desktop — Windows application

An Electron shell around the shared web UI (`apps/web/index.html`).

- The vault folder is picked once through the native folder dialog; the path is stored in the user profile (`config.json` in the app data directory) and reconnects automatically on every start.
- File access goes through the main process (list/read/write/remove of `.md` files inside the chosen folder only).
- The UI file is copied from `apps/web/index.html` during the release build, so web and desktop stay identical.

## Local build

```bash
cd apps/desktop
mkdir -p app && cp ../web/index.html app/index.html
npm install
npm run dist   # produces dist/Levera.exe (portable, no installation needed)
```

The portable `Levera.exe` is published automatically to the rolling `latest` GitHub release by `.github/workflows/release-build.yml`.
