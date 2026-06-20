// Process — five numbered steps + a goal banner. Background paper-2.
function Process() {
  const { Eyebrow, HandUnderline } = window.SwitchboardDesignSystem_2b7957;
  const steps = [
    { n: "01", icon: "mail", title: "You send your website", body: "I review your business, services and visitors." },
    { n: "02", icon: "search", title: "I map the opportunities", body: "We define what to answer, qualify and automate." },
    { n: "03", icon: "assistant", title: "I build & train it", body: "Knowledge, flows, rules and integrations." },
    { n: "04", icon: "screen", title: "I install it on your site", body: "One simple script tag. Go live quickly." },
    { n: "05", icon: "chart", title: "We review & improve", body: "I track conversations and make it better." },
  ];
  return (
    <section id="process" style={{ background: "var(--paper-2)", padding: "62px 0" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 24px" }}>
        <Eyebrow><HandUnderline>How the implementation works</HandUnderline></Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "14px", marginTop: "38px", alignItems: "start" }} className="steps">
          {steps.map((s, i) => (
            <div key={s.n} style={{ position: "relative" }}>
              <span style={{ width: "38px", height: "38px", marginBottom: "12px", display: "block", background: "var(--ink)", WebkitMask: `url(../../assets/icons/${s.icon}.svg) center/contain no-repeat`, mask: `url(../../assets/icons/${s.icon}.svg) center/contain no-repeat` }} />
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: ".95rem", color: "var(--orange)" }}>{s.n}</div>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", margin: "4px 0 7px" }}>{s.title}</h4>
              <p style={{ fontSize: ".82rem", color: "var(--ink-soft)", margin: 0, lineHeight: 1.45 }}>{s.body}</p>
              {i < steps.length - 1 ? <span style={{ position: "absolute", top: "8px", right: "-12px", color: "var(--line)", fontSize: "1.1rem" }}>→</span> : null}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "30px", display: "flex", alignItems: "center", gap: "16px", background: "var(--paper)", border: "1.5px solid var(--ink)", borderRadius: "14px", padding: "20px 24px", boxShadow: "var(--shadow-card)" }}>
          <span style={{ width: "34px", height: "34px", flex: "none", background: "var(--orange)", WebkitMask: "url(../../assets/icons/target.svg) center/contain no-repeat", mask: "url(../../assets/icons/target.svg) center/contain no-repeat" }} />
          <b style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }}>All focused on one goal: more qualified leads and booked calls.</b>
        </div>
      </div>
    </section>
  );
}
window.Process = Process;
