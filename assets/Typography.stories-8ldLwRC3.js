const i={title:"Foundations/Typography",parameters:{layout:"fullscreen",backgrounds:{disable:!0}}};function e({label:r,children:l}){return React.createElement("div",{style:{display:"grid",gridTemplateColumns:"140px 1fr",gap:20,alignItems:"baseline",padding:"16px 0",borderTop:"1.5px solid var(--line)"}},React.createElement("div",{style:{fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace",fontSize:".74rem",color:"var(--ink-soft)"}},r),React.createElement("div",null,l))}const t={render:()=>React.createElement("div",{style:{maxWidth:980,margin:"0 auto",padding:"40px 24px"}},React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontWeight:800,fontSize:"2rem",letterSpacing:"-.02em",margin:"0 0 6px"}},"Typography"),React.createElement("p",{style:{color:"var(--ink-soft)",maxWidth:"44em",margin:"0 0 24px"}},"Three families, three jobs. ",React.createElement("b",null,"Bricolage Grotesque")," (heavy, tight, −0.02em) for headings and UI labels; ",React.createElement("b",null,"Inter")," for running text;"," ",React.createElement("b",null,"Caveat")," for hand-written marginalia."),React.createElement("h2",{style:{fontFamily:"var(--font-display)",fontSize:"1.1rem",margin:"20px 0 4px"}},"Display, Bricolage Grotesque"),React.createElement(e,{label:"--fs-hero / 800"},React.createElement("div",{style:{font:"var(--type-hero)",letterSpacing:"var(--ls-display)"}},"Chat with it.")),React.createElement(e,{label:"--fs-h2 / 800"},React.createElement("div",{style:{font:"var(--type-h2)",letterSpacing:"var(--ls-display)"}},"The assistant earns its keep.")),React.createElement(e,{label:"--fs-h3 / 700"},React.createElement("div",{style:{font:"var(--type-h3)"}},"AI Chatbot Architecture")),React.createElement("h2",{style:{fontFamily:"var(--font-display)",fontSize:"1.1rem",margin:"28px 0 4px"}},"Body, Inter"),React.createElement(e,{label:"--fs-lead / 400"},React.createElement("p",{style:{fontFamily:"var(--font-body)",fontSize:"var(--fs-lead)",margin:0,maxWidth:"34em"}},"This is the exact assistant I build for small businesses. Ask it anything, it answers instantly and books a call on the spot.")),React.createElement(e,{label:"--fs-body / 400"},React.createElement("p",{style:{fontFamily:"var(--font-body)",fontSize:"var(--fs-body)",margin:0,maxWidth:"34em"}},"Automations that move leads from chat to CRM, email, tasks and reports, follow-up without the manual copy-paste.")),React.createElement(e,{label:"--fs-sm / 400"},React.createElement("p",{style:{fontFamily:"var(--font-body)",fontSize:"var(--fs-sm)",margin:0,color:"var(--ink-soft)"}},"Secondary text and captions sit a step down and a shade muted.")),React.createElement("h2",{style:{fontFamily:"var(--font-display)",fontSize:"1.1rem",margin:"28px 0 4px"}},"Hand & label"),React.createElement(e,{label:"--font-hand"},React.createElement("div",{style:{fontFamily:"var(--font-hand)",fontSize:"1.5rem",color:"var(--ink)"}},"↳ it's live, type a real question")),React.createElement(e,{label:"eyebrow"},React.createElement("span",{style:{fontFamily:"var(--font-display)",fontWeight:700,letterSpacing:"var(--ls-eyebrow)",textTransform:"uppercase",fontSize:"var(--fs-eyebrow)",color:"var(--orange)"}},"AI chatbots · automation · results")))};var n,a,o;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 980,
    margin: "0 auto",
    padding: "40px 24px"
  }}>
      <h1 style={{
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: "2rem",
      letterSpacing: "-.02em",
      margin: "0 0 6px"
    }}>
        Typography
      </h1>
      <p style={{
      color: "var(--ink-soft)",
      maxWidth: "44em",
      margin: "0 0 24px"
    }}>
        Three families, three jobs. <b>Bricolage Grotesque</b> (heavy, tight,
        −0.02em) for headings and UI labels; <b>Inter</b> for running text;{" "}
        <b>Caveat</b> for hand-written marginalia.
      </p>

      <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: "1.1rem",
      margin: "20px 0 4px"
    }}>
        Display, Bricolage Grotesque
      </h2>
      <Row label="--fs-hero / 800">
        <div style={{
        font: "var(--type-hero)",
        letterSpacing: "var(--ls-display)"
      }}>
          Chat with it.
        </div>
      </Row>
      <Row label="--fs-h2 / 800">
        <div style={{
        font: "var(--type-h2)",
        letterSpacing: "var(--ls-display)"
      }}>
          The assistant earns its keep.
        </div>
      </Row>
      <Row label="--fs-h3 / 700">
        <div style={{
        font: "var(--type-h3)"
      }}>AI Chatbot Architecture</div>
      </Row>

      <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: "1.1rem",
      margin: "28px 0 4px"
    }}>
        Body, Inter
      </h2>
      <Row label="--fs-lead / 400">
        <p style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--fs-lead)",
        margin: 0,
        maxWidth: "34em"
      }}>
          This is the exact assistant I build for small businesses. Ask it
          anything, it answers instantly and books a call on the spot.
        </p>
      </Row>
      <Row label="--fs-body / 400">
        <p style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--fs-body)",
        margin: 0,
        maxWidth: "34em"
      }}>
          Automations that move leads from chat to CRM, email, tasks and reports,
          follow-up without the manual copy-paste.
        </p>
      </Row>
      <Row label="--fs-sm / 400">
        <p style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--fs-sm)",
        margin: 0,
        color: "var(--ink-soft)"
      }}>
          Secondary text and captions sit a step down and a shade muted.
        </p>
      </Row>

      <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: "1.1rem",
      margin: "28px 0 4px"
    }}>
        Hand & label
      </h2>
      <Row label="--font-hand">
        <div style={{
        fontFamily: "var(--font-hand)",
        fontSize: "1.5rem",
        color: "var(--ink)"
      }}>
          ↳ it&apos;s live, type a real question
        </div>
      </Row>
      <Row label="eyebrow">
        <span style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "var(--ls-eyebrow)",
        textTransform: "uppercase",
        fontSize: "var(--fs-eyebrow)",
        color: "var(--orange)"
      }}>
          AI chatbots · automation · results
        </span>
      </Row>
    </div>
}`,...(o=(a=t.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};const s=["TypeScale"];export{t as TypeScale,s as __namedExportsOrder,i as default};
