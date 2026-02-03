# Marlboro XC Training Hub — Refactoring Plan

## Design System

- **Primary:** School Blue `#0d47a1`, Dark Blue `#0A2463`, Light Blue `#42a5f5`
- **Secondary:** Gold `#D4AF37`, Light Gold `#FFC107`, Cream Gold `#FFECB3`
- **Accent:** White `#ffffff`, Cream `#FEFCF9`
- **Typography:** Syne (headings), DM Sans (body). Clear H1–H6 hierarchy.
- **Spacing:** CSS variables `--space-*`, section gap 80–120px (clamp).
- **Transitions:** 350–500ms, ease-out / spring curves.

## Technical Stack

- **Bootstrap 5:** Responsive grid only (`.container`, `.row`, `.col-*`). All other Bootstrap components overridden in `style.css`.
- **Custom CSS:** All visuals (navbar, hero, cards, buttons, forms, footer).
- **JS:** `navbar.js` (nav toggle, active link, scroll state), `main.js` (preloader, scroll reveal, back-to-top).

## Files Touched

| File | Purpose |
|------|--------|
| `style.css` | Full design system, Bootstrap overrides, navbar glassmorphism, hero, section dividers, cards, buttons, responsive. |
| `index.html` | Preloader, full-viewport hero, wave divider, reveal classes, back-to-top. |
| `main.js` | Preloader hide, Intersection Observer for `.reveal`, back-to-top visibility. |
| `schedule.html` | Added `<body>`, hero-section--inner, back-to-top, main.js. |
| `workouts.html`, `mileage.html`, `recovery.html`, `contact.html`, `admin.html` | Inner hero class, back-to-top, main.js. |

## Implemented Features

- **Navbar:** Glassmorphism, transparent → solid on scroll, underline hover on links, active page styling, mobile hamburger with slide-down.
- **Hero (home):** Full viewport, gradient + mesh overlay, fade-in headline/tagline/CTA, scroll indicator (bouncing arrow).
- **Section dividers:** SVG wave between hero and announcements (no straight line).
- **Scroll reveal:** `.reveal` + `.revealed` via Intersection Observer.
- **Cards:** Hover lift, shadow, rounded corners.
- **Buttons:** Hover lift, glow on primary/light.
- **Preloader:** Animated spinner + logo, hides on `load` or 3s fallback.
- **Back to top:** Fixed button, visible after 400px scroll, smooth scroll to top.
- **Responsive:** Mobile-first, breakpoints 575 / 767 / 991px; touch-friendly nav toggle (44px).
- **Accessibility:** `prefers-reduced-motion`, aria labels where needed, semantic HTML.

## Optional Next Steps

- Typewriter effect on hero headline (add `.typewriter` + JS).
- Parallax on background layers (different scroll speeds).
- Dark/light mode toggle with persisted preference.
- Smooth-scroll library (e.g. Locomotive Scroll) for advanced scroll effects.
