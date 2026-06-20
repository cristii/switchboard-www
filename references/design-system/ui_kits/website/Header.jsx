// Header — sticky nav with the wordmark and primary CTA.
function Header() {
  const { Button } = window.SwitchboardDesignSystem_2b7957;
  const links = ["Services", "Work", "Process", "Pricing", "About", "FAQ"];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 60, backdropFilter: "blur(6px)",
      background: "rgba(233,232,223,.82)", borderBottom: "1.5px solid var(--ink)" }}>
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 24px", height: "70px",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#top" style={{ display: "flex", flexDirection: "column", lineHeight: 1, textDecoration: "none", color: "inherit" }}>
          <b style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.42rem", letterSpacing: "-.03em" }}>Switchboard</b>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: ".6rem", letterSpacing: ".22em", color: "var(--ink-soft)", marginTop: "3px" }}>AI SYSTEMS</span>
        </a>
        <nav style={{ display: "flex", gap: "30px", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: ".85rem" }} className="navlinks">
          {links.map((l) => <a key={l} href={"#" + l.toLowerCase()} style={{ color: "inherit", textDecoration: "none" }}>{l}</a>)}
        </nav>
        <Button variant="primary" size="sm" arrow href="#footcta">Book a call</Button>
      </div>
    </header>
  );
}
window.Header = Header;
