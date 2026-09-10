# Deploy the frontend to GitHub Pages (client-only showcase)

This publishes just the **frontend** as a static site — no server needed — so you can share a live link with the client. All content, images and the two background **videos** are shown (they load from the restaurant's CDN, which works fine on GitHub Pages).

There's no backend in this build: the site content for all three languages is baked into the app, and the language switcher works entirely in the browser. (The booking/newsletter forms and the `/admin` dashboard need the backend, so they're inert in this static demo — everything the client *looks at* works.)

## One‑time setup (about 3 minutes)

1. **Create a GitHub repo** and push this project to it:
   ```bash
   cd heaven-uppsala
   git init
   git add .
   git commit -m "Heaven Uppsala site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. **Enable Pages:** on GitHub go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.

3. That's it. The included workflow (`.github/workflows/deploy.yml`) runs on every push: it builds the static site, sets the correct base path automatically from your repo name, and deploys it.

Your live URL will be:
```
https://<your-username>.github.io/<your-repo>/
```
The Actions tab shows progress; the first deploy takes ~1–2 minutes, and the final URL is printed on the "deploy" step.

## Notes

- **Custom domain / user page:** if the repo is named `<username>.github.io`, the workflow serves it at the domain root automatically (no base path).
- **Build it yourself locally** (optional preview):
  ```bash
  cd frontend
  NEXT_PUBLIC_STATIC=true NEXT_PUBLIC_BASE_PATH=/<your-repo> npm run build
  # static site is in frontend/out/  (serve it under /<your-repo>/)
  ```
- **The full app with backend** still works as before (`npm run dev` in both folders) — the static build is just an extra mode enabled by `NEXT_PUBLIC_STATIC=true`.
- To wire the forms/admin up later, deploy the backend somewhere (Render/Railway) and build the frontend without `NEXT_PUBLIC_STATIC`, pointing `NEXT_PUBLIC_API_URL` at it.
