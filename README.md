# Heaven Uppsala — Multilingual Website (client-only)

A full rebuild of [restaurangheaven.se](https://www.restaurangheaven.se/) with a new, formal dark‑and‑gold churrasco theme and **multi‑language support**. It mirrors the original site page‑for‑page — the same navigation, sections, content, photos and background **videos** — with Swedish, English and Portuguese out of the box.

**Stack:** React (Next.js 14, App Router). There is no backend, no database, and nothing to deploy besides the static frontend — see *Editing content* and *Table booking* below for how that works.

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
| Events | `/events` | Upcoming events (honest empty state until any are added) |
| Om oss / Kontakt | `/#ourstory`, `/#kontakt` | In‑page anchors (as on the original) |

**Faithful to the source:** the two Wix background **videos**, all photos and menu images, the buffet prices (449 / 249 / 199 kr, kids free), phone `018‑505500`, `info@restaurangheaven.se`, both addresses, and real socials (TikTok / Instagram / Facebook).

**More than a static clone — it's functional:**
- **Live table booking via easyTable.** "Boka bord" opens a choice modal (Churrasco Rodizio vs. à la carte at Bakfickan), then a real availability + reservation form that calls [easyTable](https://api.easytable.com) **directly from the browser** — see *Table booking* below for how this works and its tradeoffs.
- **Formal, beautiful theme:** deep charcoal + brass gold, Cormorant Garamond display type, autoplaying video hero, hover‑zoom split sections, price cards, lightbox galleries, FAQ accordions, responsive mobile menu.
- **Multilingual:** every page and UI string is translated (sv/en/pt), with a language switcher that works entirely client-side.

---

## 🗂 Project structure

```
heaven-uppsala/
├── frontend/                        Next.js (React) app — the whole site
│   ├── app/                             # layout.js · page.js (home) · [slug]/page.js · globals.css (theme)
│   ├── components/                      # Nav · Hero (video) · Blocks · Gallery · Footer · BookingModal · EasyTableBookingForm
│   ├── context/                         # LangProvider · BookingProvider · MenuChoiceProvider
│   └── lib/
│       ├── content.js                       # ALL page/site content + UI strings, in every language — the de facto CMS
│       ├── site.js, resolve.js, api.js      # build the site/page objects the components render from content.js
│       └── easytable.js                     # calls easyTable directly from the browser (see below)
├── scripts/download-images.mjs      # localise all images + videos
└── package.json                     # convenience scripts
```

The site is **content‑driven**: each page is built from an ordered list of typed content **blocks** (`split`, `rich`, `pricing`, `gallery`, `menu`, `faq`, `contact`, `newsletter`, `booking`). The frontend renders any block by type, so pages and sections are edited in data, not code.

---

## 🚀 Quick start (local)

```bash
npm run install:all       # installs frontend deps
cp frontend/.env.example frontend/.env
npm run dev                # site on http://localhost:3000
```

There's no database to seed and no second process to start — everything but live booking works with an empty `.env`.

---

## ✏️ Editing content

There is no CMS or admin dashboard — **`frontend/lib/content.js` is the content**. It's one big file with:
- every page's hero + content blocks, in `sv` / `en` / `pt`
- every UI string (button labels, form labels, error messages, …), also in all three languages

Add a section, change copy, or add a language by editing that file directly and redeploying — there's nothing else to keep in sync.

---

## 🍽 Table booking (easyTable) — called directly from the browser

"Boka bord" opens a choice modal (Churrasco Rodizio vs. à la carte at Bakfickan), then a live availability + reservation form for that experience. **There is no backend here** — `frontend/lib/easytable.js` calls [easyTable](https://api.easytable.com/swagger/index.html) straight from the browser:

- `getAvailability({ date, guests, location })` → easyTable `GET /v2/availability`
- `createReservation({ date, time, guests, name, phone, email, message, lang, location })` → easyTable `POST /v2/bookings`

**Set it up:** put your easyTable API key and place token in `frontend/.env`:

```
NEXT_PUBLIC_EASYTABLE_API_KEY=...
NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN=...
# optional — a separate easyTable place for the à la carte Bakfickan option;
# falls back to NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN when blank
NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN_BAKFICKAN=...
```

> **⚠️ Security tradeoff, on purpose.** `NEXT_PUBLIC_*` variables are inlined into the browser bundle by Next.js — that's the only way a backend-free site can call an API that needs a key. Anyone who opens devtools can read your easyTable key and place token this way. This was a deliberate choice (no server to hold secrets), not an oversight. If that risk becomes unacceptable later, the fix is to add a tiny serverless function (a single Vercel/Netlify/Cloudflare function) that holds the key and proxies these two calls — everything in `easytable.js` maps 1:1 onto what that function would do.
>
> **⚠️ CORS is unverified.** easyTable's docs never mention browser/CORS support for these endpoints — they read like a server-to-server API. It's possible easyTable's servers reject cross-origin requests from a browser even with a valid key/token, in which case the booking form will show a network error. **Test a real booking after deploying with real credentials** to confirm this works; if it doesn't, the serverless-proxy fix above also resolves CORS (since the request would then come from your own server, not the browser).

Until both env vars are set, the booking form shows a friendly "please call us" message with the restaurant's phone number instead of a broken form.

---

## 🖼 Localising the media

By default the content references the restaurant's live Wix CDN so you see the same photos **and videos** instantly. To self‑host:

```bash
npm run localize-images                # downloads all images + videos → frontend/public/media/
```

Then replace the CDN URLs in `frontend/lib/content.js` with the printed `/media/…` paths. `frontend/public/media/mapping.json` lists every original URL → local path.

---

## ☁️ Deploy

This is a static site — deploy the `frontend/` build output anywhere that serves static files (GitHub Pages, Vercel, Netlify, S3, …). See `GITHUB_PAGES.md` for the included one-click GitHub Pages workflow. If you host elsewhere, just run:

```bash
cd frontend
npm run build          # writes the static export to frontend/out/
```

If you set the easyTable env vars as secrets on your host (not committed to the repo), live booking works on the deployed site too.

---

## ⚙️ Environment variables

**frontend/.env** — `NEXT_PUBLIC_EASYTABLE_API_KEY`, `NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN`, `NEXT_PUBLIC_EASYTABLE_PLACE_TOKEN_BAKFICKAN` (optional). All three are exposed to the browser by design — see *Table booking* above.

---

## 📝 Notes

- Content, photos and videos are reproduced from the public restaurangheaven.se site for this rebuild — self‑host the media before production (see *Localising the media*).
- Table booking is live via easyTable (see *Table booking* above) — set the `NEXT_PUBLIC_EASYTABLE_*` vars in `frontend/.env` before launch, and test a real booking to confirm easyTable accepts direct browser requests.
- The Festvåning inquiry form and the newsletter signup are presentational only now (there's no backend to receive them) — hook them up to a form service (e.g. Formspree) or a `mailto:` link if you need them working.
- Swedish text is taken from the live site; English and Portuguese are faithful translations — review before launch.
- `optimizeFonts:false` in `next.config.js` loads Google Fonts via a runtime `<link>` (with system‑font fallbacks) so builds work on restricted networks.
