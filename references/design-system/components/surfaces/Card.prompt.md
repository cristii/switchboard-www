The workhorse surface — filled, ink-outlined, with a hard (blur-free) offset shadow. Compose anything inside it: service cards, pricing plans, build items.

```jsx
<Card>
  <h3>AI Chatbot Architecture</h3>
  <p>A website assistant trained on your services…</p>
</Card>

<Card featured>{/* orange outline + orange shadow — the "Most popular" plan */}</Card>
<Card tone="paper" flat>{/* on white sections, no shadow */}</Card>
```

`tone` sets the fill (`white` default, `paper`, `sunken`) so cards read on either paper background. `featured` switches to the orange outline + orange shadow. `flat` removes the shadow.
