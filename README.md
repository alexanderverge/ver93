# ver93.com

Landing page for **ver93** — a small software development outfit. Plain static
HTML/CSS/JS, no build step, no framework, no dependencies.

## Structure

```
index.html                  page markup
css/style.css                all styling (design tokens, layout, responsive rules)
js/main.js                    ambient canvas background animation
assets/screenshots/            real Contrail app screenshots shown on the card
favicon.svg
CNAME                         custom domain for GitHub Pages (ver93.com)
```

The Contrail card shows three real app screenshots (`assets/screenshots/`) in
a fixed coverflow-style arrangement — one centered/focused, the other two
peeking from behind at reduced scale — via the `.is-center` / `.is-back-left`
/ `.is-back-right` classes in `css/style.css`. Static for now; an animated,
auto-rotating version is planned (see git history for a prior attempt that
was reverted for looking janky — worth reaching for a proven carousel
library next time rather than hand-rolling the rotation).

## Local preview

No build step — just serve the directory root, e.g.:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`.

## Deployment (GitHub Pages behind Cloudflare)

1. Push this repo to GitHub.
2. In the repo's **Settings → Pages**, set the source to deploy from the
   `main` branch, root (`/`).
3. The `CNAME` file already points Pages at `ver93.com`. In Cloudflare DNS for
   `ver93.com`, add the records GitHub's docs specify for an apex domain
   pointing at GitHub Pages (A records to GitHub's IPs, or a CNAME if using a
   subdomain), and set the proxy status per your preference (proxied for
   Cloudflare's CDN/SSL, or DNS-only).
4. Enable "Enforce HTTPS" in the Pages settings once the DNS is live.
