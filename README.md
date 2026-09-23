# SRI SUBHAM website

Catalog site for SRI SUBHAM (M) SDN. BHD. Product information is stored in SQLite. There is no online shop.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:4321. The admin console is at http://localhost:4321/admin.

Set `ADMIN_PASSWORD` and `AUTH_SECRET` in `.env` before deploying. In production both are required. Locally, if they are missing, the password falls back to `changeme`.

## Production

```bash
npm run build
npm run start
```

The Node server reads and writes `data/srisubham.db`. Uploaded product images are stored in `data/uploads`.

## GitHub Pages

`.github/workflows/pages.yml` publishes the public catalog when you run **Deploy to GitHub Pages** by hand on the `main` branch. In the repository settings, set Pages to **GitHub Actions** once.

The published site is static HTML at `https://sandconsulting.github.io/srisubham-website/`. Product pages are generated from the catalog in the repo at build time. The admin console is not part of that site.
