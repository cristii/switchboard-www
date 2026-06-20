A single message in the assistant widget. Bot bubbles are white with an ink hairline + "Assistant" label and a squared bottom-left corner; user bubbles are orange with a squared bottom-right corner. Stack them in a column with `gap:12px`.

```jsx
<ChatBubble from="bot">Hi — I'm a live demo assistant. What would you like to know?</ChatBubble>
<ChatBubble from="user">How much does it cost?</ChatBubble>
```

Set `showLabel={false}` to hide the Assistant label on consecutive bot bubbles.
