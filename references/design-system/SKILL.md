---
name: switchboard-design
description: Use this skill to generate well-branded interfaces and assets for Switchboard AI Systems, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **Brand:** Switchboard AI Systems — a solo consultant building AI chatbots & automation for small businesses. Voice is first-person, direct, anti-fluff, no emoji. Sells outcomes (leads, booked calls).
- **Look:** warm "paper & ink" — recycled-paper backgrounds with grid + grain, pine-green ink outlines, one burnt-orange accent, hand-drawn underlines, and **hard blur-free offset shadows**. Bricolage Grotesque (headings/UI), Inter (body), Caveat (hand marginalia).
- **Never:** soften shadows with blur, use gradients as identity, use emoji, or use a third-party icon library — the line-icon set is bespoke (`assets/icons/`).

## Files
- `styles.css` — link this one file; it `@import`s all tokens + fonts.
- `tokens/` — colors, typography, spacing/shadows/radii, fonts.
- `assets/` — `logo.svg`, `mark.svg`, `grain.svg`, `icons/*.svg` (tint via CSS `mask`).
- `components/` — React primitives (Button, Eyebrow, HandUnderline, Badge, Pill, Card, StickyNote, ChatBubble, Stat), each with `.prompt.md` usage notes.
- `ui_kits/website/` — full interactive recreation of the marketing site; copy its patterns for new screens.
- `README.md` — full content + visual foundations, iconography, and a file index.
