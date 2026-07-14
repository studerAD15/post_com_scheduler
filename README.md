# Post Composer Scheduler

A Vite + React static app for composing and validating social posts across platforms.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm ci
npm run build
```

The production output is generated in `dist/`.

## Deploy To Vercel

This repo includes `vercel.json`, so Vercel can deploy it as a Vite app.

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

The rewrite rule sends all paths to `index.html`, which keeps client-side routing deployment-safe.

## Deploy To Render

This repo includes `render.yaml` for a Render Static Site.

- Build command: `npm ci && npm run build`
- Publish directory: `dist`

Render will also rewrite all routes to `index.html`.
