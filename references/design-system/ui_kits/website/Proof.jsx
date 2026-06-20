// Proof — dark band with impact stats and testimonial cards.
function Proof() {
  const { Eyebrow, Stat } = window.SwitchboardDesignSystem_2b7957;
  const stats = [
    { value: "<5s", label: "Average time to answer a visitor — day or night" },
    { value: "3×", label: "More qualified enquiries vs. a static contact form" },
    { value: "10 min", label: "From your site to a working demo you can try" },
  ];
  const quotes = [
    "Visitors used to bounce when no one replied. Now the assistant answers at 11pm and the booked calls are already qualified by the time they reach me.",
    "Setup was a single script tag. Within a week it was handling the questions my inbox used to drown in, and routing the serious leads to my calendar.",
  ];
  return (
    <section style={{ background: "var(--dark)", color: "var(--paper)" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "44px 24px" }}>
        <Eyebrow tone="amber">Why "results" isn't just a word</Eyebrow>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.5rem,2.6vw,2.1rem)", letterSpacing: "-.02em", maxWidth: "14em", margin: "12px 0 30px", color: "var(--paper)" }}>
          The assistant earns its keep in the first month.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px", marginBottom: "34px" }}>
          {stats.map((s) => <Stat key={s.value} value={s.value} label={s.label} onDark />)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "18px" }} className="quotes">
          {quotes.map((q, i) => (
            <div key={i} style={{ background: "rgba(241,234,221,.06)", border: "1px solid rgba(241,234,221,.16)", borderRadius: "12px", padding: "20px" }}>
              <p style={{ fontSize: ".96rem", lineHeight: 1.5, margin: 0 }}>"{q}"</p>
              <div style={{ marginTop: "12px", fontSize: ".82rem", color: "#bcc4bd" }}><b style={{ color: "var(--paper)", fontFamily: "var(--font-display)", fontWeight: 600 }}>Sample testimonial</b> — swap in a real client quote</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Proof = Proof;
