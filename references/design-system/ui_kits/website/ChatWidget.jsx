// ChatWidget — the interactive hero assistant. Scripted replies so the demo
// always works offline. Composes ChatBubble from the design system.
function ChatWidget() {
  const { ChatBubble } = window.SwitchboardDesignSystem_2b7957;
  const [msgs, setMsgs] = React.useState([
    { from: "bot", text: "Hi — I'm a live demo assistant. I can tell you what Switchboard builds, what it costs, and help you book a call. What would you like to know?" },
  ]);
  const [val, setVal] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const bodyRef = React.useRef(null);

  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing]);

  function reply(q) {
    q = q.toLowerCase();
    if (/price|cost|how much|€|euro|pricing/.test(q))
      return "Builds start at €399 for a Website Assistant, €799 for a Booking Assistant, and from €1499 for a full Automation System. There's an optional €99/mo Care plan. Want a free demo to see which fits?";
    if (/demo|try|free|show/.test(q))
      return "Happy to! I build a free working demo on your own site before you commit anything. Send your website and I'll show you what your assistant could answer and book.";
    if (/book|call|talk|meeting|appointment/.test(q))
      return "Let's set up a free 15-minute call — use the “Book a call” button up top, or send your website and I'll prep a demo first.";
    if (/build|do|make|offer|service|what can/.test(q))
      return "I build website assistants that answer questions, qualify leads and book calls — from a simple FAQ bot up to a full CRM + automation system. What does your business do?";
    if (/work|website|install|existing|platform/.test(q))
      return "It usually installs with a single script tag, so it works on most existing websites without a rebuild. What platform is your site on?";
    return "Good question! I can tell you what Switchboard builds, what it costs, or set up a free demo on your site. Which would help most?";
  }

  function send(text) {
    text = (text || "").trim();
    if (!text) return;
    setMsgs((m) => [...m, { from: "user", text }]);
    setVal("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: reply(text) }]);
    }, 750);
  }

  const quick = ["What can you build?", "How much does it cost?", "Get a free demo", "Book a call"];

  return (
    <div style={{ background: "var(--white)", border: "2px solid var(--ink)", borderRadius: "18px",
      boxShadow: "var(--shadow-pop)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "560px" }}>
      <div style={{ background: "var(--dark)", color: "var(--paper)", padding: "14px 16px", display: "flex", alignItems: "center", gap: "11px" }}>
        <span style={{ width: "34px", height: "34px", borderRadius: "9px", background: "var(--orange)", display: "grid", placeItems: "center" }}>
          <img src="../../assets/icons/assistant.svg" width="20" style={{ filter: "brightness(0) invert(1)" }} alt="" />
        </span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: ".95rem", lineHeight: 1.1 }}>Switchboard Assistant</div>
          <div style={{ fontSize: ".72rem", color: "#b9c9b6", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#5fcf7a" }}></span> Online
          </div>
        </div>
      </div>
      <div ref={bodyRef} style={{ padding: "16px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "12px", background: "var(--paper)", minHeight: "230px" }}>
        {msgs.map((m, i) => (
          <ChatBubble key={i} from={m.from} showLabel={m.from === "bot" && (i === 0 || msgs[i - 1].from !== "bot")}>{m.text}</ChatBubble>
        ))}
        {typing ? (
          <ChatBubble from="bot" showLabel={false}>
            <span style={{ display: "inline-flex", gap: "4px" }}>
              <Dot d="0s" /><Dot d=".15s" /><Dot d=".3s" />
            </span>
          </ChatBubble>
        ) : null}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", padding: "0 16px 8px", background: "var(--paper)" }}>
        {quick.map((q) => (
          <button key={q} onClick={() => send(q)} style={{ background: "var(--white)", border: "1.5px solid var(--line)", borderRadius: "20px", padding: "7px 13px", fontSize: ".8rem", fontFamily: "var(--font-body)", cursor: "pointer", color: "var(--ink)" }}>{q}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px", padding: "12px 14px", borderTop: "1.5px solid var(--line)", background: "var(--white)" }}>
        <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send(val)}
          placeholder="Type your message…" aria-label="Message the assistant"
          style={{ flex: 1, border: "1.5px solid var(--line)", borderRadius: "9px", padding: "10px 12px", fontFamily: "var(--font-body)", fontSize: ".9rem", outline: "none" }} />
        <button onClick={() => send(val)} aria-label="Send" style={{ background: "var(--orange)", border: "none", borderRadius: "9px", width: "42px", cursor: "pointer", display: "grid", placeItems: "center" }}>
          <img src="../../assets/icons/send.svg" width="18" style={{ filter: "brightness(0) invert(1)" }} alt="" />
        </button>
      </div>
      <div style={{ textAlign: "center", fontSize: ".68rem", color: "var(--ink-soft)", padding: "7px", background: "var(--white)", borderTop: "1px solid var(--line-soft)" }}>
        Built by <b style={{ color: "var(--ink)" }}>Switchboard AI Systems</b>
      </div>
    </div>
  );
}

function Dot({ d }) {
  return <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--ink-soft)", animation: `blink 1s ${d} infinite` }} />;
}

window.ChatWidget = ChatWidget;
