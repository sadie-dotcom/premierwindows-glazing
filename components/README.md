# Components

Reusable HTML snippets for building pages. This is a **no-build** static
site, so these files are **not** compiled or auto-included anywhere — they are
copy-and-paste reference markup that keeps every page consistent.

| File | What it is |
| --- | --- |
| `header.html` | Site header + primary navigation. Paste at the top of `<body>`. |
| `footer.html` | Site footer. Paste at the bottom of `<body>`. |
| `page-template.html` | A full starting point for a brand-new landing page. |

## Building a new page

1. Copy `page-template.html` to `/<page-name>/index.html`.
2. Paste `header.html` and `footer.html` into the marked spots.
3. Update the `<title>`, meta description, canonical link and Open Graph tags.
4. Set `aria-current="page"` on the matching nav link.
5. Add the URL to `/sitemap.xml`.

All shared styling and behaviour comes from `/assets/css/main.css` and
`/assets/js/main.js`, referenced by absolute path so they work at any folder depth.
