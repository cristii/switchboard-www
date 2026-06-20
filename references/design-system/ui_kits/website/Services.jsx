// Services — lead column + three numbered service cards.
function Services() {
  const { Eyebrow, Card } = window.SwitchboardDesignSystem_2b7957;
  const svc = [
    { n: "01", icon: "assistant", title: "AI Chatbot Architecture", body: "A website assistant trained on your services, FAQs, offers and rules — ready to answer visitors and guide them to the next step." },
    { n: "02", icon: "funnel", title: "Omnichannel Funnels", body: "Connect website, email, WhatsApp and social into one lead journey — so visitors don't get lost between channels." },
    { n: "03", icon: "workflow", title: "Custom n8n Workflows", body: "Automations that move leads from chat to CRM, email, tasks, calendar and reports — follow-up without the manual copy-paste." },
  ];
  return (
    <section id="services" style={{ background: "var(--paper-2)", padding: "62px 0" }}>
      <div className="svc-grid" style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 24px",
        display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: "48px", alignItems: "start" }}>
        <div>
          <Eyebrow>My services</Eyebrow>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.9rem,3vw,2.5rem)", letterSpacing: "-.02em", margin: "14px 0 0" }}>AI systems that turn conversations into results.</h2>
          <p style={{ marginTop: "16px", color: "var(--ink-soft)", maxWidth: "24em", lineHeight: 1.55 }}>I design and build practical AI and automation that bring more leads, better replies, and cleaner operations — and that you can actually run without me.</p>
        </div>
        <div style={{ display: "grid", gap: "18px" }}>
          {svc.map((s) => (
            <Card key={s.n} tone="paper" style={{ display: "grid", gridTemplateColumns: "auto auto 1fr", gap: "20px", alignItems: "start" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: "var(--orange)", lineHeight: 1 }}>{s.n}</span>
              <span style={{ width: "34px", height: "34px", marginTop: "6px", background: "var(--orange)", WebkitMask: `url(../../assets/icons/${s.icon}.svg) center/contain no-repeat`, mask: `url(../../assets/icons/${s.icon}.svg) center/contain no-repeat` }} />
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.18rem", margin: "0 0 7px" }}>{s.title}</h3>
                <p style={{ fontSize: ".92rem", color: "var(--ink-soft)", margin: 0, lineHeight: 1.5 }}>{s.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Services = Services;
