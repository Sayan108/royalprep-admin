# RoyalPrep admin

The admin React/Vite application, separated from the RoyalPrep monorepo. It uses the RoyalPrep backend; the student application is a separate project.

## Local development

Use Node 22 or newer.

1. Run `npm ci`.
2. Run the backend on `http://localhost:4000`.
3. Run `npm run dev` and open `http://127.0.0.1:5174/admin`. The app proxies `/api` to the local backend.

Run `npm run build` to type-check and build to `dist`. The public settings are in `src/config.ts`; enable `chapterNotesEnabled` only when the backend's chapter notes feature is enabled.

## Vercel

Import this repository as a Vite project with the repository root as the project root, `npm ci` as the install command, `npm run build` as the build command, and `dist` as the output directory. Staging and production builds use the hosted API origin in `src/config.ts`; no frontend environment variables are required. Change the origin in code and redeploy if the backend URL changes. `vercel.json` provides the SPA fallback. Frontend configuration is public; do not put secrets in it.

Admin sign-in and the shared admin identity are development-only, not production access control. Do not expose the backend's console verification service publicly or use it with real users' data.
