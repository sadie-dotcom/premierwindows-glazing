# Premier Windows — Glazing

A **completely static** website for the Premier Windows Australia glazing
subdomain, deployed to **Cloudflare Pages** and managed through **GitHub**.

- **Production URL:** https://glazing.premierwindows.com.au/
- **First landing page:** https://glazing.premierwindows.com.au/replacement/

> ⚠️ This project is **entirely separate** from the live WordPress site hosted
> on Flywheel. Nothing here touches, depends on, or affects that site.

## Tech at a glance

- Pure **HTML5**, modern **CSS**, and **vanilla JavaScript** — nothing else.
- **No framework, no Node, no build tools, no bundler, no Wrangler, no Workers.**
- Files are served exactly as they appear in this repository.
- Mobile-first, accessible, SEO-friendly, and tuned for Core Web Vitals.

Because there is no build step, **what you commit is what gets served**. To
preview locally, just open the files in a browser or run any static file
server (see [Local preview](#local-preview)).

---

## Project structure

```
/
├── index.html              Temporary homepage
├── 404.html                Custom "page not found" page (served by Cloudflare Pages)
├── robots.txt              Search-engine crawl rules
├── sitemap.xml             List of public URLs (keep updated)
├── _headers                Cloudflare Pages: caching + security headers
├── README.md               This file
├── .gitignore
│
├── replacement/
│   └── index.html          The /replacement/ landing page
│
├── assets/
│   ├── css/
│   │   └── main.css        Shared stylesheet (design tokens, layout, components)
│   ├── js/
│   │   └── main.js         Shared vanilla JS (nav toggle, footer year, …)
│   ├── fonts/              Self-hosted web fonts (.woff2)
│   └── images/             Photos, icons, logos, favicons, OG images
│
└── components/
    ├── header.html         Reusable header markup (copy/paste)
    ├── footer.html         Reusable footer markup (copy/paste)
    ├── page-template.html  Starting point for a new landing page
    └── README.md           How to use the components
```

### Why the shared assets are referenced by absolute path

Every page links to `/assets/css/main.css` and `/assets/js/main.js` using
absolute paths (starting with `/`). This means the same files work from any
folder depth (`/`, `/replacement/`, `/something/deeper/`) with no changes.

---

## Local preview

No tooling is required, but a local server gives you clean absolute-path URLs
(so `/assets/...` resolves correctly).

Using Python (already on macOS/Linux):

```bash
# from the project root
python3 -m http.server 8080
# then open http://localhost:8080/
```

Or open `index.html` directly in a browser for a quick look.

---

## Deploy to Cloudflare Pages

This site auto-deploys on every push to GitHub. First-time setup:

### 1. Connect GitHub

1. Push this repository to GitHub (see [Pushing to GitHub](#pushing-to-github)).
2. In the **Cloudflare dashboard** → **Workers & Pages** → **Create** →
   **Pages** → **Connect to Git**.
3. Authorise Cloudflare to access your GitHub account and pick this repository.

### 2. Configure the build

Because this is a static site with **no build step**, use these settings:

| Setting | Value |
| --- | --- |
| **Framework preset** | `None` |
| **Build command** | *(leave empty)* |
| **Build output directory** | `/` (the repository root) |
| **Root directory** | *(leave as default / empty)* |

Save and deploy. Cloudflare will publish the files as-is and give you a
`*.pages.dev` preview URL.

### 3. Add the custom domain

1. In your Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `glazing.premierwindows.com.au`.
3. Follow the prompts to add the `CNAME` record.
   - If the domain's DNS is managed in Cloudflare, this is one click.
   - If DNS is elsewhere, add a `CNAME` for `glazing` pointing to your
     `*.pages.dev` hostname.

> Only the **`glazing`** subdomain is involved. The root `premierwindows.com.au`
> and its WordPress hosting on Flywheel are **not** changed.

### 4. Automatic deployments

Once connected, Cloudflare Pages rebuilds and redeploys **every time you push
to the production branch** (`main`). Pull requests get their own preview
deployments automatically.

---

## Pushing to GitHub

Git is already initialised with an initial commit. To publish it:

```bash
# create an empty repo on GitHub first (no README/licence), then:
git remote add origin git@github.com:<your-org>/<your-repo>.git
git branch -M main
git push -u origin main
```

After this, `git push` is all that's needed to deploy.

---

## Adding a new landing page

1. **Create the folder & file.** Copy the template:

   ```bash
   cp components/page-template.html your-page-name/index.html
   ```

   Using a folder with `index.html` gives clean URLs
   (`/your-page-name/` instead of `/your-page-name.html`).

2. **Add the shared header/footer.** Paste `components/header.html` and
   `components/footer.html` into the marked spots in the new file.

3. **Fill in the `<head>`:** update `<title>`, the meta description, the
   `<link rel="canonical">`, and the Open Graph tags with this page's URL.

4. **Set the active nav link:** add `aria-current="page"` to the matching
   link in the header nav.

5. **Register it for SEO:** add a `<url>` block to `sitemap.xml`.

6. **Commit & push** — Cloudflare Pages deploys it automatically.

The page automatically inherits all shared styling and behaviour from
`/assets/css/main.css` and `/assets/js/main.js`. Reuse the existing CSS classes
(`.container`, `.section`, `.grid`, `.button`, etc.) so pages stay consistent.

---

## Where things belong

| What | Where | Notes |
| --- | --- | --- |
| **Images** | `assets/images/` | Photos, icons, logos, favicons, OG images. Prefer `.webp`/`.avif`; always set `width`/`height`; use `loading="lazy"` for below-the-fold images (never the hero/LCP image). |
| **Fonts** | `assets/fonts/` | Self-hosted `.woff2` files. Add an `@font-face` block in `main.css` and point `--font-sans` at it. Self-hosting is faster than Google Fonts. |
| **Shared styles** | `assets/css/main.css` | Design tokens live at the top as CSS custom properties — change brand colours, spacing and type there. |
| **Shared scripts** | `assets/js/main.js` | Keep it vanilla, small and deferred. |
| **Reusable markup** | `components/` | Copy/paste snippets (no build step to include them automatically). |

---

## Performance & quality notes

- **CSS** is a single small file loaded in the `<head>` (and `preload`ed).
- **JS** is a single small file loaded with `defer`, so it never blocks render.
- **Fonts** use the system font stack by default — zero network cost.
- **Caching & security headers** are set in `_headers`.
- **Accessibility:** skip link, semantic landmarks, visible focus styles,
  ARIA-wired mobile nav, and `prefers-reduced-motion` support are built in.
- **SEO:** per-page titles/descriptions, canonical URLs, Open Graph tags,
  `robots.txt` and `sitemap.xml`.

Keep new pages lean and reuse the shared assets to preserve these gains.
