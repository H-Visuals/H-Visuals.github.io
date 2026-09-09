# Deploy notes — H-Visuals.github.io

Live site: https://h-visuals.github.io
Repo: H-Visuals/H-Visuals.github.io (public, `main` branch, GitHub Pages auto-publishes on push)

## Files
- `index.html` — page markup, section content, asset `<link>`/`<script>` tags
- `style.css` — all layout/visual styling
- `counts.js` — hero stats (views generated / videos delivered / subscriber reach)
- `player.js` — click-to-open video lightbox (Work + Testimonials sections)
- `carousel.js` — auto-scrolling/drag "marquee" rails in the Work section

## Making a change
1. Clone or edit the repo directly (no local machine required — it's a plain
   static site, clonable from any environment with git + a push-capable token).
2. Edit the relevant file(s).
3. **Cache-busting**: if you changed `style.css`, `counts.js`, `player.js`,
   or `carousel.js`, bump that file's `?v=N` query param in `index.html`
   (e.g. `style.css?v=4` -> `?v=5`). GitHub Pages' CDN caches assets for
   10 minutes; without a version bump, changes can appear "not live" even
   though they've deployed.
4. Commit and push to `main`.
5. GitHub Pages rebuilds automatically (Actions tab -> "pages build and
   deployment", usually done within ~30-60s). If a build fails with a
   transient error (e.g. a 403 on `FinalizeArtifact`), push an empty
   retrigger commit: `git commit --allow-empty -m "Retrigger Pages build"`.

## Verifying a change is actually live
Don't trust a plain browser reload — both GitHub's CDN and your own browser
cache assets. Instead:
```
curl -s "https://raw.githubusercontent.com/H-Visuals/H-Visuals.github.io/main/style.css" | grep "<thing you changed>"
curl -sI "https://h-visuals.github.io/style.css?v=N"   # check last-modified/age headers
```
For a real visual check in a browser, hard-reload (cmd+shift+r), not a normal refresh.

## Known gotchas
- Repo name must stay exactly `H-Visuals.github.io` (matches the GitHub
  account `H-Visuals` case-for-case) — renaming it breaks the auto-publish
  URL.
- `counts.js` calls the YouTube Data API with a hardcoded key. It should be
  restricted (HTTP referrer: `h-visuals.github.io/*`) in Google Cloud
  Console if not already done.
