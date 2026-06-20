The primary call-to-action — an uppercase Bricolage label inside an ink-outlined block with a hard, blur-free offset shadow that grows on hover (the button also lifts 2px).

```jsx
<Button variant="primary" arrow>Try the chatbot</Button>
<Button variant="ghost">Book a 15-min call</Button>
<Button variant="light" size="sm" href="#pricing">See pricing</Button>
```

Variants: `primary` (orange fill, white text), `ghost` (transparent, ink outline), `light` (paper fill — use on dark surfaces). Sizes: `sm` / `md` / `lg`. Pass `arrow` to append a → glyph, or `icon` / `iconRight` for custom glyphs. Never soften the shadow with blur — the hard offset is the brand signature.
