The signature emphasis device — a wobbly hand-drawn stroke under one phrase. Use it on a single key word/phrase inside a heading or eyebrow, not a whole sentence.

```jsx
<h1>Don't read about my service. <span className="orange"><HandUnderline>Chat with it.</HandUnderline></span></h1>
```

Pass `color` (defaults to orange) and `weight` to tune the stroke. On dark surfaces use `color="var(--amber)"`.
