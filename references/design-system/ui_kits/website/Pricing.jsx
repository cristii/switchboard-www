// Pricing — four plans; the Booking Assistant is featured.
function Pricing() {
  const { Eyebrow, Card, Badge } = window.SwitchboardDesignSystem_2b7957;
  const plans = [
    { icon: "screen", name: "Website Assistant", desc: "FAQ answers + basic lead capture.", from: "from", price: "€399", terms: "one-time setup", feats: ["FAQ answers", "Lead capture", "Human handoff"], best: "Best for getting started" },
    { icon: "calendar", name: "Booking Assistant", desc: "Qualification + calendar handoff.", from: "from", price: "€799", terms: "one-time setup", feats: ["Lead qualification", "Calendar integration", "Booked calls"], best: "Best for service businesses", featured: true },
    { icon: "link", name: "Automation System", desc: "Chatbot + CRM + n8n + reports.", from: "from", price: "€1499+", terms: "scales with integrations & workflows", feats: ["CRM integration", "n8n workflows", "Reporting & follow-up"], best: "Best for growing teams" },
    { icon: "refresh", name: "Care & Improvement", desc: "Optional. Keeps it accurate and improving.", from: "from", price: "€99/mo", terms: "optional add-on to any build", feats: ["Conversation review", "FAQ updates", "Performance reports"], best: "Ongoing optimization" },
  ];
  return (
    <section id="pricing" style={{ padding: "62px 0" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 24px" }}>
        <Eyebrow>Engagement options</Eyebrow>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem,3vw,2.4rem)", letterSpacing: "-.02em", margin: "12px 0 0" }}>Clear pricing. Start small, scale when it works.</h2>
        <div className="price-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "18px", marginTop: "36px" }}>
          {plans.map((p) => (
            <Card key={p.name} tone="paper" featured={p.featured} style={{ display: "flex", flexDirection: "column", position: "relative" }}>
              {p.featured ? <div style={{ position: "absolute", top: "-12px", right: "16px" }}><Badge variant="solid">Most popular</Badge></div> : null}
              <span style={{ width: "30px", height: "30px", marginBottom: "12px", background: p.featured ? "var(--orange)" : "var(--ink)", WebkitMask: `url(../../assets/icons/${p.icon}.svg) center/contain no-repeat`, mask: `url(../../assets/icons/${p.icon}.svg) center/contain no-repeat` }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.08rem", margin: 0 }}>{p.name}</h3>
              <div style={{ fontSize: ".82rem", color: "var(--ink-soft)", margin: "5px 0 16px", minHeight: "2.5em" }}>{p.desc}</div>
              <div style={{ fontSize: ".72rem", color: "var(--ink-soft)", fontWeight: 600 }}>{p.from}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", lineHeight: 1 }}>{p.price}</div>
              <div style={{ fontSize: ".74rem", color: "var(--ink-soft)", margin: "4px 0 14px" }}>{p.terms}</div>
              <ul style={{ listStyle: "none", display: "grid", gap: "9px", flex: 1, margin: "0 0 16px", padding: 0 }}>
                {p.feats.map((f) => (
                  <li key={f} style={{ display: "flex", gap: "8px", fontSize: ".86rem", alignItems: "flex-start" }}>
                    <span style={{ width: "15px", height: "15px", marginTop: "3px", flex: "none", background: "var(--green)", WebkitMask: "url(../../assets/icons/check.svg) center/contain no-repeat", mask: "url(../../assets/icons/check.svg) center/contain no-repeat" }} />{f}
                  </li>
                ))}
              </ul>
              <div style={{ textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: ".74rem", textTransform: "uppercase", letterSpacing: ".03em", padding: "9px", borderRadius: "8px", background: p.featured ? "var(--orange)" : "var(--paper-3)", color: p.featured ? "#fff" : "var(--ink)" }}>{p.best}</div>
            </Card>
          ))}
        </div>
        <p style={{ marginTop: "20px", textAlign: "center", fontSize: ".92rem", color: "var(--ink-soft)" }}>
          <b style={{ color: "var(--ink)" }}>Not sure which fits?</b> I'll build you a working demo on your own site — free — before you decide anything.
        </p>
      </div>
    </section>
  );
}
window.Pricing = Pricing;
