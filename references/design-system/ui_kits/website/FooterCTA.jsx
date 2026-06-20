// FooterCTA — dark closing band with the conversion flow pills.
function FooterCTA() {
  const { Button, Pill } = window.SwitchboardDesignSystem_2b7957;
  return (
    <section id="footcta" style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "40px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "30px", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.6rem,3vw,2.3rem)", letterSpacing: "-.02em", color: "var(--paper)", margin: 0 }}>
            Don't read another section.<br /><span style={{ color: "var(--orange)" }}>Try the assistant.</span>
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "14px" }}>
            <Pill active onDark>Conversation</Pill><span style={{ color: "var(--orange)" }}>→</span>
            <Pill onDark>Qualified lead</Pill><span style={{ color: "var(--orange)" }}>→</span>
            <Pill onDark>Booked call</Pill>
          </div>
          <p style={{ fontFamily: "var(--font-hand)", marginTop: "10px", color: "#bcc4bd", fontSize: "1.15rem" }}>↳ that's the whole system.</p>
        </div>
        <p style={{ fontSize: ".92rem", color: "#bcc4bd", maxWidth: "18em" }}>Send me your website and I'll show you exactly what your chatbot could answer, qualify and book.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Button variant="primary" href="#top">Try the chatbot →</Button>
          <Button variant="light" href="#">Book a 15-min call →</Button>
        </div>
      </div>
      <div style={{ background: "var(--dark)", borderTop: "1px solid #20302d" }}>
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "18px 24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", fontSize: ".78rem", color: "#79857d" }}>
          <span><b style={{ color: "var(--paper)", fontFamily: "var(--font-display)", fontWeight: 700 }}>Switchboard AI Systems</b></span>
          <span style={{ letterSpacing: ".06em", fontWeight: 500 }}>AI CHATBOTS · AUTOMATION · RESULTS</span>
          <span>© 2026 — All rights reserved.</span>
        </div>
      </div>
    </section>
  );
}
window.FooterCTA = FooterCTA;
