// SampleBuilds ("Work") — highlight video placeholder + three tagged build items.
function SampleBuilds() {
  const { Eyebrow, Card, Badge, Button } = window.SwitchboardDesignSystem_2b7957;
  const seeing = ["A realistic build brief", "Website + chatbot implementation", "The lead-capture logic", "Calendar handoff", "The owner dashboard"];
  const builds = [
    { tag: "green", level: "Beginner", title: "Dental Studio — FAQ bot", body: "A simple assistant that answers visitor questions and captures contact details." },
    { tag: "amber", level: "Intermediate", title: "Home Renovations — booking", body: "Qualifies the lead, collects project details, and books a call automatically." },
    { tag: "violet", level: "Advanced", title: "Solar Solutions — automation", body: "CRM + n8n system that routes leads, follows up, and reports on results." },
  ];
  return (
    <section id="work" style={{ padding: "62px 0" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 24px" }}>
        <Eyebrow>See it in action</Eyebrow>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem,3vw,2.4rem)", letterSpacing: "-.02em", margin: "14px 0 0", maxWidth: "16em" }}>Three sample builds. Three levels of complexity.</h2>
        <p style={{ color: "var(--ink-soft)", marginTop: "14px", fontSize: ".96rem", maxWidth: "40em", lineHeight: 1.55 }}>These are demo builds I made to show the range — from a simple FAQ bot to a full automation engine. Each walkthrough is short. Real client work is shared privately on a call.</p>

        <div className="build-main" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "30px", alignItems: "start", marginTop: "30px" }}>
          <div style={{ position: "relative", border: "2px solid var(--ink)", borderRadius: "14px", overflow: "hidden", aspectRatio: "16/10", background: "linear-gradient(135deg,#1e2a28,#11201e)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-raised)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "11px 14px", color: "var(--paper)", fontSize: ".82rem", fontWeight: 600, background: "linear-gradient(rgba(0,0,0,.55),transparent)" }}>
              <span>Sample build · FAQ Chatbot</span><span>2:00 highlight</span>
            </div>
            <div role="button" tabIndex={0} aria-label="Play highlight" style={{ width: "70px", height: "70px", borderRadius: "50%", background: "rgba(241,234,221,.92)", display: "grid", placeItems: "center", cursor: "pointer", border: "2px solid #fff" }}>
              <span style={{ width: "26px", height: "26px", marginLeft: "4px", background: "var(--ink)", WebkitMask: "url(../../assets/icons/play.svg) center/contain no-repeat", mask: "url(../../assets/icons/play.svg) center/contain no-repeat" }} />
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px", color: "var(--paper)" }}>
              <b style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.3rem", display: "block" }}>90-second highlight</b>
              <span style={{ fontSize: ".84rem", color: "#c5cdc4" }}>The fastest way to see what an assistant actually does</span>
            </div>
          </div>
          <Card tone="sunken" flat style={{ border: "1.5px solid var(--line)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", margin: "0 0 14px" }}>What you'll see</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {seeing.map((s) => (
                <li key={s} style={{ display: "flex", gap: "9px", alignItems: "flex-start", fontSize: ".9rem", marginBottom: "10px" }}>
                  <span style={{ width: "16px", height: "16px", flex: "none", marginTop: "3px", background: "var(--green)", WebkitMask: "url(../../assets/icons/check.svg) center/contain no-repeat", mask: "url(../../assets/icons/check.svg) center/contain no-repeat" }} />{s}
                </li>
              ))}
            </ul>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: "1.25rem", color: "var(--orange)", marginTop: "10px", lineHeight: 1.2 }}>↳ Prefer the long version? Full 10-min builds below.</div>
          </Card>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginTop: "26px" }} className="build-list">
          {builds.map((b) => (
            <Card key={b.title} tone="paper" flat style={{ border: "1.5px solid var(--line)" }}>
              <Badge variant={b.tag}>{b.level}</Badge>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", margin: "10px 0 4px" }}>{b.title}</h4>
              <p style={{ fontSize: ".85rem", color: "var(--ink-soft)", margin: 0, lineHeight: 1.5 }}>{b.body}</p>
            </Card>
          ))}
        </div>

        <div style={{ background: "var(--ink)", color: "var(--paper)", borderRadius: "14px", padding: "20px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap", marginTop: "36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "13px", fontSize: "1.05rem", fontWeight: 500 }}>
            <span style={{ width: "24px", height: "24px", flex: "none", background: "var(--orange)", WebkitMask: "url(../../assets/icons/lightbulb.svg) center/contain no-repeat", mask: "url(../../assets/icons/lightbulb.svg) center/contain no-repeat" }} />
            <span>Want one of these built for <b>your</b> website?</span>
          </div>
          <Button variant="primary" href="#footcta">Start with a free demo →</Button>
        </div>
      </div>
    </section>
  );
}
window.SampleBuilds = SampleBuilds;
