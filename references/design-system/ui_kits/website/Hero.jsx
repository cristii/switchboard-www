// Hero — headline + ticks + CTAs on the left, live ChatWidget on the right.
function Hero() {
  const { Button, Eyebrow, HandUnderline } = window.SwitchboardDesignSystem_2b7957;
  const ticks = ["Answers instantly", "Qualifies leads", "Books calls"];
  return (
    <section id="top" style={{ padding: "54px 0 30px" }}>
      <div className="hero-grid" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 24px",
        display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: "48px", alignItems: "center" }}>
        <div>
          <Eyebrow>AI chatbots · automation · results</Eyebrow>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.6rem,5.4vw,4.2rem)", lineHeight: 1.04, letterSpacing: "-.02em", margin: "14px 0 0" }}>
            Don't read<br />about my service.<br />
            <span style={{ color: "var(--orange)" }}><HandUnderline>Chat with it.</HandUnderline></span>
          </h1>
          <p style={{ margin: "22px 0 18px", fontSize: "1.06rem", maxWidth: "30em", color: "#232b29", lineHeight: 1.55 }}>
            This is the exact assistant I build for small businesses. Ask it anything — it answers instantly, works out whether you're a fit, and books a call on the spot. No forms, no waiting.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "18px 26px", margin: "18px 0 26px" }}>
            {ticks.map((t) => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600, fontSize: ".92rem" }}>
                <span style={{ width: "18px", height: "18px", background: "var(--orange)", WebkitMask: "url(../../assets/icons/check.svg) center/contain no-repeat", mask: "url(../../assets/icons/check.svg) center/contain no-repeat" }} />
                {t}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
            <Button variant="primary" href="#" onClick={(e) => e.preventDefault()}>Try the chatbot → ask it anything</Button>
            <a href="#footcta" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: ".82rem", textTransform: "uppercase", letterSpacing: ".02em", borderBottom: "2px solid var(--orange)", paddingBottom: "2px", textDecoration: "none", color: "inherit" }}>Book a 15-min call</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--ink-soft)", fontSize: ".9rem", marginTop: "16px" }}>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: "1.2rem", color: "var(--ink)" }}>↳ it's live — type a real question</span>
          </div>
        </div>
        <ChatWidget />
      </div>
    </section>
  );
}
window.Hero = Hero;
