# RoomDekho: CRA → Vite

## Frontend

The frontend now uses Vite and React. CRA's `react-scripts` scripts and HTML template were removed. JSX source files use `.jsx` extensions and the entry point is `src/main.jsx`.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the backend origin (for example `http://localhost:5000`), without `/api` at the end. Vite exposes only `VITE_*` variables to browser code; never put secrets there.

Production build and preview:

```bash
npm run build
npm run preview
```

## Backend configuration

Copy `backend/.env.example` to `backend/.env`, then configure `MONGODB_URI`, a unique random `JWT_SECRET` of at least 32 characters, and `FRONTEND_URL` (for Vite local development, `http://localhost:5173`). The server refuses to start when required secrets are missing or weak.

To create an administrator explicitly, configure `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` (at least 12 characters), then run `npm run seed:admin` from `backend`. The server no longer creates an administrator with a publicly known default password.

## Security actions required

- The original uploaded archive contained a MongoDB URI with credentials. Those credentials have been removed from this working copy, but must be rotated in MongoDB Atlas immediately. If the original file or repository was shared/committed, rotate the credentials and remove the secret from repository history.
- Never commit `.env`; use hosting-provider environment settings for production.
- Set `FRONTEND_URL` to the exact deployed frontend origin(s), comma-separated if needed.
- Use HTTPS in production, rotate any exposed JWT secret, and review all roles and access controls before deploying.
