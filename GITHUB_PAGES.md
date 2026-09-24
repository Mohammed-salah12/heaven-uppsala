# Deploy the frontend to GitHub Pages (client-only)

This publishes the whole site as a static site — there is no server or database anywhere in this project. All content, images and the two background **videos** are shown (they load from the restaurant's CDN, which works fine on GitHub Pages).

The site content for all three languages is baked into the app at build time (`frontend/lib/content.js`), and the language switcher works entirely in the browser. Table booking calls [easyTable](https://api.easytable.com) directly from the browser once you set the `NEXT_PUBLIC_EASYTABLE_*` secrets below — see the root `README.md` "Table booking" section for how that works and its tradeoffs. The newsletter and Festvåning inquiry forms are presentational only (there's no backend to receive them).

**To enable live booking on the deployed site**, add these as repo secrets before your first deploy (**Settings → Secrets and variables → Actions → New repository secret**) — the workflow below already passes them through to the build:

```
NEXT_PUBLIC_EASYTABLE_API_KEY
NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN
NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN_BAKFICKAN   (optional)
```

Remember: these ship inside the built JS by design (no backend to hold them) — anyone can read them via devtools. See the README for the full writeup.

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
  NEXT_PUBLIC_BASE_PATH=/<your-repo> npm run build
  # static site is in frontend/out/  (serve it under /<your-repo>/)
  ```
  (`npm run build` already sets `NEXT_PUBLIC_STATIC=true` — see `frontend/package.json`.)
- Deploying anywhere else (Vercel, Netlify, S3, …) works the same way: run `npm run build` in `frontend/` and serve the `out/` folder, setting the same `NEXT_PUBLIC_EASYTABLE_*` env vars on that host if you want live booking there too.
