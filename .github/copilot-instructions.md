# Copilot Instructions for `personal-portfolio`

## Build, test, and lint commands

This repository is a static site (plain HTML/CSS/JS) and does **not** define a package manager project or automated build/test/lint scripts.

### Local run
1. `python3 -m http.server 8000`
2. Open `http://localhost:8000`

### Test/lint status
- Full automated test suite: **not configured**
- Single test command: **not configured**
- Lint command: **not configured**

## High-level architecture

- The site is a single-page portfolio: content/sections in `index.html`, design system + responsive layout in `assets/style.css`, and all client behavior in `assets/script.js`.
- Navigation has tight HTML/JS coupling:
  - Desktop/mobile links (`.nav-link`, `.mobile-link`) use `href="#section-id"` anchors.
  - JS smooth-scroll logic and section tracking (`.section-nav` button text) depend on valid `<section id="...">` targets and `IntersectionObserver`.
- Section animations are class-driven:
  - CSS defines `.animate-card`, `.animate-fact`, `.animate-timeline` and related keyframes/staggered delays.
  - JS observers pause/resume animation states and attach hover/entrance behavior.
- Banner effects are generated at runtime: JS creates `.particle` elements inside `.particles-container`; CSS handles particle visuals and `@keyframes float`.
- Mobile menu behavior spans all layers:
  - HTML: `.burger-menu`, `.mobile-nav`, `.mobile-overlay`, `.mobile-link`
  - CSS: off-canvas + overlay active states
  - JS: toggles `.active` and `body.no-scroll`, closes on overlay click, outside click, link click, and `Escape`

## Key conventions in this codebase

- **Selector contracts are strict:** when editing markup, preserve class names and IDs referenced in `assets/script.js` or update JS selectors in the same change.
- **Section navigation coupling:** desktop/mobile nav links (`.nav-link`, `.mobile-link`) must keep `href` values aligned with target section IDs.
- **Theme tokens come from CSS variables in `:root`:** prefer reusing `--bg-color`, `--accent`, `--text-main`, `--text-secondary`, and `--border-color` instead of hardcoding new colors.
- **Animation pattern:** keep `.animate-*` class usage + observer-triggered reveal behavior; when adding/removing siblings in animated grids/timelines, keep `:nth-child(...)` animation delay rules aligned.
- **Responsive edits are section-local:** `assets/style.css` uses repeated section-specific `@media (max-width: 768px)` and `@media (max-width: 480px)` blocks; update the media block near the relevant section instead of adding unrelated global overrides.
- **No module system/bundler:** keep JS browser-compatible and loaded through `index.html` (`<script src="assets/script.js"></script>`), without introducing build-only syntax unless tooling is added first.

## TODO 
- improve display over different browsers and make every section fills the screen .
- improve responsiveness to make the website looks good on any screen size you imagine .
- add `https://github.com/KhaledMahfouz5/linux-course` to my projects section .
