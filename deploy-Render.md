Render deployment steps for Ian Christie Electrical

Overview
- This app is a single Node service that serves the Vite-built frontend and Express API.
- We will deploy the bundled server (`dist/server.cjs`) and attach a persistent disk mounted at `/data` for `db.json` and uploads.

Repository changes already made
- `server.ts` updated to use `process.env.PORT`, `DB_FILE` and `UPLOADS_DIR` env vars.

Required environment variables (do NOT store secrets in repo)
- `NODE_ENV=production`
- `DB_FILE=/data/db.json`
- `UPLOADS_DIR=/data/uploads`
- `ADMIN_SESSION_SECRET` - set to a strong random string in the Render dashboard (keep secret)

Render service configuration (web service)
- Build Command: `npm run build`
- Start Command: `npm start`
- Branch: choose your deployment branch (e.g. `main`)

Persistent disk (Render dashboard)
1. In Render: create a new Persistent Disk (via Dashboard > Disks > New Disk).
   - Name: `ian-data` (or any name you like)
   - Size: 1GB (or larger as required)
   - Region: same region as the service
2. In the Web Service settings, attach that disk and mount it at `/data`.
3. The app expects `DB_FILE=/data/db.json` and `UPLOADS_DIR=/data/uploads`.
   - The first run will create `/data/db.json` and `/data/uploads/` if they do not exist.

Environment variables in Render
- Add env vars in the service's Environment > Environment Variables section:
  - `NODE_ENV` = `production`
  - `DB_FILE` = `/data/db.json`
  - `UPLOADS_DIR` = `/data/uploads`
  - `ADMIN_SESSION_SECRET` = (paste a strong secret)

Deploy steps
1. Push code to your Git remote (GitHub/GitLab) connected to Render.
2. On Render, create a new Web Service and connect to repo + branch.
3. Set Build and Start commands above, attach disk, set env vars.
4. Trigger deploy. After deploy, visit service URL to verify frontend loads.

Testing after deploy
- Admin panel: navigate to `/admin` and login with the current password (the default originally was `IAN2026` but if changed locally, use the current hash in `/data/db.json`).
- Uploads: in admin, upload an image — it should be saved under `/data/uploads` on the mounted disk.
- Confirm persistence: restart service from Render dashboard and verify uploaded images remain and db.json persists.

Domain
- After successful deploy and verification, add custom domain `ianchristie.ie` in the Render service’s Custom Domains panel and follow Render's DNS instructions (they will provide CNAME or A records). Render will provision TLS automatically.

Backups and maintenance (recommended)
- Periodically snapshot `/data/db.json` to external storage (S3 or GitHub backup) or use Render backups.
- Store `ADMIN_SESSION_SECRET` in a secure secrets manager (Render's env var is fine).

If you want, I can proceed to connect the repo to Render and deploy it for you (I will need repository access and Render account access), or I can provide the exact UI clicks and screenshots to do it yourself.