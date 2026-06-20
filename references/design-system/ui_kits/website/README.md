# Website UI kit — Switchboard AI Systems

A high-fidelity, interactive recreation of Switchboard's one-page marketing site (the product is a solo consultant's lead-gen website whose centerpiece is a *working* AI assistant in the hero).

## Source
Recreated from the original single-file site: `switchboard/switchboard.html` (attached codebase).

## Files
- `index.html` — assembles the full page and renders it. Open this.
- `Header.jsx` — sticky nav + wordmark + CTA.
- `Hero.jsx` — headline, ticks, CTAs, and the live `ChatWidget`.
- `ChatWidget.jsx` — interactive assistant. Scripted replies (offline-safe); the real site swaps in a Claude API call with this exact scripted set as the fallback.
- `Proof.jsx` — dark band with impact `Stat`s + testimonial cards.
- `Services.jsx` — three numbered service cards.
- `SampleBuilds.jsx` — "Work": highlight-video placeholder, "what you'll see" list, three tagged build items, demo banner.
- `Process.jsx` — five numbered implementation steps + goal banner.
- `Pricing.jsx` — four plans; the Booking Assistant is `featured`.
- `About.jsx` — portrait placeholder, bio, impact stat, "what I bring" list, tech-stack `StickyNote`.
- `FAQ.jsx` — interactive two-column accordion.
- `FooterCTA.jsx` — dark closing band with the conversion-flow `Pill`s.

## How it composes the system
Primitives come from the design-system bundle (`window.SwitchboardDesignSystem_2b7957`): `Button`, `Eyebrow`, `HandUnderline`, `Card`, `Badge`, `Pill`, `Stat`, `ChatBubble`. Sections only handle layout + copy. Icons are tinted via CSS `mask` against `assets/icons/*.svg`.

## What's a placeholder
The About portrait and the SampleBuilds highlight video are intentionally left as labelled placeholders (as in the original) — swap in real media when available. Testimonials in `Proof.jsx` are labelled sample quotes. The only section from the original omitted here is the small "audiences" band; add it in the same pattern if needed.
