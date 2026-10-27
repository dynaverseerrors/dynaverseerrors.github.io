# Deployment steps — Dynaverse Errors (https://dynaverseerrors.github.io)

## 1. Extract (order does not matter, all parts merge into ONE folder)
- Download all parts below and extract them into the same empty folder.
- Every ZIP contains paths relative to the site root, so extraction merges them cleanly.

## 2. Upload to GitHub (user site -> repo name MUST be: dynaverseerrors.github.io)
- Recommended (20,000+ files): git push
  - git init, git add ., git commit -m "Dynaverse Errors full site", git remote add origin https://github.com/<username>/dynaverseerrors.github.io.git, git push -u origin main
- Do NOT upload AUDIT.md, reports or DEPLOYMENT.md to the repo (they are documentation only; harmless if uploaded).

## 3. Enable GitHub Pages
- Repo Settings -> Pages -> Source: Deploy from a branch -> main / (root) -> Save.
- Site goes live at https://dynaverseerrors.github.io/

## 4. Search Console
- Verify the property with the HTML file method (google4a76338cbc6eddcb.html is already at the site root).
- Submit the sitemap URL: https://dynaverseerrors.github.io/sitemap.xml

## 5. Upload order / dependency notes
- Upload ALL parts BEFORE enabling Pages: hub pages and hub sitemaps (in first-chunk parts) link to post files delivered in later parts, and the search index shards are spread across parts.
- Part 1 = core (homepage, CSS/JS/fonts, brand, legal pages, robots.txt, sitemap.xml, GSC file, AUDIT.md).
- Parts 2..12 = hubs/posts (max 2,000 posts per part).
- Part 13 = reports (this file, link-check, sitemap validation, size report).

## 6. Checks already performed (see reports/)
- 20,000 posts: unique slugs, unique titles, all dates <= 2026-10-25 (backdated).
- Both Adsterra units present on homepage, all hub pages and all posts (A: 468x60 key 2ae45376961d3205d47ae3d3acd65458, B: 300x250 key 76edcf33d56397a5e8a4e65d6779a73f).
- 740,401 internal links checked — 0 broken. Sitemap: 20,008 URLs, all unique, absolute, canonical-matched.
- Extracted total: 571.5 MB (under the 800 MB budget).
