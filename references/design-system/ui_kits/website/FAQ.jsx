// FAQ — interactive two-column accordion. Background paper-2.
function FAQ() {
  const { Eyebrow } = window.SwitchboardDesignSystem_2b7957;
  const qas = [
    ["Will the chatbot make things up?", "No — it only answers from the knowledge I train it on (your services, FAQs and rules). When it doesn't know something, it says so and hands off to you instead of guessing."],
    ["Can it book calls?", "Yes. The Booking Assistant and Automation System qualify the visitor and book straight into your calendar, so the calls you get are already warm."],
    ["Do I need to manage the AI myself?", "Not unless you want to. Everything is set up for you, and the optional Care plan keeps it accurate and improving so you can stay hands-off."],
    ["Can it work on my existing website?", "Almost always. Installation is usually one script tag, so it works on most platforms without rebuilding anything."],
    ["Can I review the conversations?", "Yes — you get an owner dashboard showing what visitors asked, which leads were captured, and what got booked."],
    ["How long does it take to set up?", "A simple assistant can be live within days. A full automation system depends on the integrations, and we'll agree a clear timeline up front."],
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section id="faq" style={{ background: "var(--paper-2)", padding: "62px 0" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 24px" }}>
        <Eyebrow>FAQ</Eyebrow>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem,3vw,2.4rem)", letterSpacing: "-.02em", margin: "12px 0 0" }}>Questions, answered.</h2>
        <div className="faq-list" style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
          {qas.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} style={{ borderBottom: "1.5px solid var(--line)", padding: "16px 0" }}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1rem", color: "var(--ink)" }}>
                  {q}
                  <span style={{ fontSize: "1.4rem", color: "var(--orange)", flex: "none", transition: "transform .2s", transform: isOpen ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                <div style={{ maxHeight: isOpen ? "240px" : "0", overflow: "hidden", transition: "max-height .28s ease", color: "var(--ink-soft)", fontSize: ".92rem", paddingTop: isOpen ? "12px" : "0", lineHeight: 1.5 }}>{a}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
window.FAQ = FAQ;
