# Seowung Leem — Personal Website

English-first personal website with a Korean language switch. Research, Faith, Interests, and Life in the US.

## Edit content
See [콘텐츠 편집 안내](EDITING.md).

- `content/profile.json`: name, position, education, profile links
- `content/publications.json`: publication list (single source of truth)
- `content/translations.json`: English and Korean interface / homepage copy
- `content/posts.json`: journal entries

`app.js` loads these JSON files at runtime. No build step is required. `style.css` and `index.html` control presentation.

## Privacy
Private source repository. GitHub Pages remains disabled. Do not enable public hosting or change repository visibility without the owner's request.

## Local workspace
The files in this repository correspond to the local project's `dist/` directory. From that directory run `python3 -m http.server 4173` and visit http://localhost:4173. JSON fetching requires HTTP, not file://.

## Content standards
Keep English and Korean aligned. Preserve verified publication details and explicit journal / conference / preprint / presentation categories. REVEAL has one MIDL 2026 entry; REVEAL++ is a separate work. No invented biographical facts. Scholar data is a curated snapshot, not a live feed.
