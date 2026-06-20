// About — portrait placeholder + bio, impact stat, "what I bring" list, tech-stack sticky note.
function About() {
  const { Eyebrow, StickyNote } = window.SwitchboardDesignSystem_2b7957;
  const bring = [
    { icon: "chart", text: "Clear lead-flow design before any building starts" },
    { icon: "assistant", text: "Chatbot setup connected to booking and follow-up" },
    { icon: "refresh", text: "Monthly review to improve answers and capture more leads" },
  ];
  return (
    <section id="about" style={{ background: "var(--paper-2)", padding: "62px 0" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 24px" }}>
        <Eyebrow>About me</Eyebrow>
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: "44px", alignItems: "start", marginTop: "20px" }}>
          {/* Portrait placeholder — swap for a real <img> when available */}
          <div style={{ border: "2px solid var(--ink)", borderRadius: "14px", overflow: "hidden", aspectRatio: "4/4.4", background: "linear-gradient(160deg,#b9c2b6,#7e8c84)", boxShadow: "var(--shadow-raised)", display: "grid", placeItems: "center", color: "#fff" }}>
            <span style={{ fontFamily: "var(--font-hand)", fontSize: "1.4rem", opacity: .85, textAlign: "center", padding: "20px" }}>[ your photo here ]</span>
          </div>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.6rem,2.6vw,2.2rem)", letterSpacing: "-.02em", margin: 0 }}>I'm Cristi Șatcovschi.</h2>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: "8px", background: "var(--orange)", color: "#fff", padding: "5px 12px", borderRadius: "8px", margin: "14px 0", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              <b style={{ fontSize: "1.3rem" }}>40+</b> assistants &amp; automations shipped
            </div>
            <p style={{ color: "#2c3331", marginBottom: "12px", maxWidth: "34em", lineHeight: 1.55 }}>I build practical AI systems that help businesses capture more leads and save time — combining strategy, automation and clean implementation into something that's easy to run and built to scale.</p>
            <div className="about-cols" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "24px", marginTop: "22px" }}>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {bring.map((b) => (
                  <li key={b.text} style={{ display: "flex", gap: "11px", marginBottom: "14px", fontSize: ".9rem", alignItems: "flex-start" }}>
                    <span style={{ width: "22px", height: "22px", flex: "none", marginTop: "2px", background: "var(--orange)", WebkitMask: `url(../../assets/icons/${b.icon}.svg) center/contain no-repeat`, mask: `url(../../assets/icons/${b.icon}.svg) center/contain no-repeat` }} />{b.text}
                  </li>
                ))}
              </ul>
              <StickyNote title="Tech stack">
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  <li>– n8n</li><li>– OpenAI / GPT</li><li>– Node.js / Nest</li>
                  <li>– React / JS</li><li>– MongoDB</li><li>– Shopify</li>
                </ul>
              </StickyNote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
window.About = About;
