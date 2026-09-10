# Restaurang Heaven — Multilingual Website

A full rebuild of [restaurangheaven.se](https://www.restaurangheaven.se/) with a new, formal dark‑and‑gold churrasco theme and **dynamic multi‑language support**. It mirrors the original site page‑for‑page — the same navigation, sections, content, photos and background **videos** — with Swedish, English and Portuguese out of the box and the ability to add more languages at runtime without touching code.

**Stack:** React (Next.js 14, App Router) · Express · MongoDB (Atlas or local).

---

## ✨ What's included

**Every page of the original, rebuilt:**

| Page | Route | Highlights |
| --- | --- | --- |
| Home | `/` | Hero **video**, buffet & prices, About (#ourstory), passion, drinks, "open until 03", gallery, "Perfection on the grill", bar, newsletter signup, Contact (#kontakt) |
| Bakfickan | `/bakfickan` | Welcome copy + drop‑in menu images |
| Konferens | `/konferens` | Up to 300 guests, tech & equipment, booking request, FAQ |
| Festvåning | `/festvaning` | Up to 700 guests, party activities, **video**, cancellation policy, **booking form**, FAQ |
| Mat meny | `/mat-meny` | Buffet & dessert menu images + food gallery |
| Drink meny | `/drink-meny` | Drinks / by‑the‑glass / bottle menu images |
| Om oss / Kontakt | `/#ourstory`, `/#kontakt` | In‑page anchors (as on the original) |

**Faithful to the source:** the two Wix background **videos**, all photos and menu images, the buffet prices (449 / 249 / 199 kr, kids free), phone `018‑505500`, `info@restaurangheaven.se`, both addresses, real socials (TikTok / Instagram / Facebook) and the TheFork booking link.

**More than a static clone — it's functional:**
- **Dynamic languages** stored in MongoDB. Add a language with one API call and the whole site (every page + block) picks it up, falling back to the default until translated. Full **RTL** support (e.g. Arabic).
- **Working forms:** the Festvåning booking form saves inquiries, and the newsletter signup saves subscribers (both to MongoDB) — the original's Wix forms are now real endpoints.
- **Formal, beautiful theme:** deep charcoal + brass gold, Cormorant Garamond display type, autoplaying video hero, hover‑zoom split sections, price cards, lightbox galleries, FAQ accordions, responsive mobile menu.

---

## 🗂 Project structure

```
heaven-uppsala/
├── backend/                         Express + Mongoose API
│   ├── src/
│   │   ├── config/db.js                 # Atlas / local / in‑memory
│   │   ├── models/                      # Language, Setting, Page, Location, UiString, Inquiry, Subscriber
│   │   ├── controllers/                 # site (public) · admin · form
│   │   ├── routes/index.js
│   │   ├── middleware/adminAuth.js
│   │   ├── utils/resolve.js             # translation resolution + fallback
│   │   ├── seed/                        # data.js (all pages/blocks in sv/en/pt) + seed.js
│   │   └── server.js
│   └── test/                            # logic.js (no DB) · verify.js (e2e) · mock-server.js
├── frontend/                        Next.js (React) app
│   ├── app/                             # layout.js · page.js (home) · [slug]/page.js · globals.css (theme)
│   ├── components/                      # Nav · Hero (video) · Blocks · Gallery · Footer · Booking/Newsletter forms
│   └── lib/api.js
├── scripts/download-images.mjs      # localise all images + videos
├── docker-compose.yml               # local MongoDB
└── package.json                     # convenience scripts
```

The site is **content‑driven**: each page is a document with an ordered list of typed content **blocks** (`split`, `rich`, `pricing`, `gallery`, `menu`, `faq`, `contact`, `newsletter`, `booking`). The frontend renders any block by type, so pages and sections are edited in data, not code.

---

## 🚀 Quick start (local)

```bash
npm run install:all                    # backend + frontend deps
```

**Pick a database:** `docker compose up -d` (local Mongo), or paste your Atlas string, or `USE_MEMORY_DB=true`.

```bash
cd backend
cp .env.example .env                   # MONGODB_URI (or USE_MEMORY_DB=true) + ADMIN_TOKEN
npm run seed                           # loads all pages/content in sv/en/pt
npm run dev                            # API on http://localhost:5000

cd ../frontend
cp .env.example .env                   # NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev                            # site on http://localhost:3000
```

---

## 🌍 Multilingual — add a language at runtime

Adding a language copies the default language across **every page, block, location and UI string**, so the site works immediately and you translate at your own pace.

```bash
# Add Arabic (right‑to‑left) — appears in the switcher instantly, site flips to RTL
curl -X POST http://localhost:5000/api/admin/languages \
  -H "Content-Type: application/json" -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{"code":"ar","name":"Arabic","nativeName":"العربية","dir":"rtl","flag":"🇸🇦"}'

# Translate a UI string / page hero as you go
curl -X PUT http://localhost:5000/api/admin/translations/ui/cta.book \
  -H "Content-Type: application/json" -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{"lang":"ar","value":"احجز طاولة"}'
```

---

## 🖥 Admin dashboard

There's a built‑in dashboard at **`/admin`** (e.g. `http://localhost:3000/admin`, or `https://your-site/admin` in production). Open it, enter your `ADMIN_TOKEN` (from the backend `.env`) once, and you get four tabs:

- **Inquiries** — every Festvåning/Konferens booking form submission.
- **Subscribers** — newsletter signups.
- **Languages** — see all languages, enable/disable them, and **add a new one** (which instantly copies the default content across every page so the site works right away).
- **Translations** — set a single translation for a UI string, a location or a page hero.

The token is kept only in your browser session (`sessionStorage`) and sent as the `x-admin-token` header — the same guard the API uses. Use the **Lock** button to clear it. For a real production deployment, put the `/admin` route behind your host's access control too (or swap the shared token for proper auth).

## 🔌 API reference

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | — | Health check |
| `GET` | `/api/languages` | — | Enabled languages (switcher) |
| `GET` | `/api/site?lang=xx` | — | Global chrome: settings, UI strings, nav, locations |
| `GET` | `/api/page/:slug?lang=xx` | — | One page's hero + resolved content blocks |
| `POST` | `/api/inquiries` | — | Booking/party inquiry (Festvåning form) |
| `POST` | `/api/subscribers` | — | Newsletter signup |
| `POST` | `/api/admin/languages` | token | Add a language (+ copy default content) |
| `PATCH` | `/api/admin/languages/:code` | token | Update / enable / disable / reorder |
| `PUT` | `/api/admin/translations/:model/:key` | token | Set one translation (`ui`, `location`, `page`) |
| `GET` | `/api/admin/inquiries` · `/api/admin/subscribers` | token | Read form submissions |

Admin routes require the header `x-admin-token: <ADMIN_TOKEN>`.

---

## 🖼 Localising the media

By default the seed references the restaurant's live Wix CDN so you see the same photos **and videos** instantly. To self‑host:

```bash
# backend running + seeded, then:
npm run localize-images                # downloads all images + videos → frontend/public/media/
```

Then replace the CDN URLs in `backend/src/seed/data.js` with the printed `/media/…` paths and re‑seed. `frontend/public/media/mapping.json` lists every original URL → local path.

---

## ☁️ Deploy

- **Database — MongoDB Atlas:** free cluster → DB user → allow your backend IP → copy the `mongodb+srv://…` string.
- **Backend — Render / Railway / Fly:** service from `backend/`, build `npm install`, start `npm start`; env `MONGODB_URI`, `ADMIN_TOKEN`, `CORS_ORIGIN=https://your-frontend`. Seed once (`npm run seed`).
- **Frontend — Vercel:** root `frontend/`, env `NEXT_PUBLIC_API_URL=https://your-backend/api`.

---

## ✅ Testing

```bash
cd backend
npm test          # resolution logic + seed‑data integrity across all pages (no DB)
npm run test:e2e  # full API: pages in every language, runtime language add (RTL), forms, admin auth
```

---

## ⚙️ Environment variables

**backend/.env** — `PORT`, `MONGODB_URI` (or `USE_MEMORY_DB=true`), `CORS_ORIGIN`, `ADMIN_TOKEN`
**frontend/.env** — `NEXT_PUBLIC_API_URL`

---

## 📝 Notes

- Content, photos and videos are reproduced from the public restaurangheaven.se site for this rebuild — self‑host the media before production (see *Localising the media*) and swap `bookingUrl` for your own.
- Swedish text is taken from the live site; English and Portuguese are faithful translations — review before launch.
- `optimizeFonts:false` in `next.config.js` loads Google Fonts via a runtime `<link>` (with system‑font fallbacks) so builds work on restricted networks.
