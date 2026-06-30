const s={title:"Foundations/Spacing & Layout",parameters:{layout:"fullscreen",backgrounds:{disable:!0}}},l=[{name:"--space-1",px:4},{name:"--space-2",px:8},{name:"--space-3",px:12},{name:"--space-4",px:16},{name:"--space-5",px:22},{name:"--space-6",px:26},{name:"--space-8",px:36},{name:"--space-10",px:48},{name:"--space-12",px:62}],p=[{name:"--r-sm",px:9},{name:"--r",px:14},{name:"--r-lg",px:18},{name:"--r-pill",px:20}],t={fontFamily:"var(--font-display)",fontWeight:700,fontSize:"1.1rem",margin:"28px 0 12px"},n={fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace",fontSize:".74rem",color:"var(--ink-soft)"},a={render:()=>React.createElement("div",{style:{maxWidth:980,margin:"0 auto",padding:"40px 24px"}},React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontWeight:800,fontSize:"2rem",letterSpacing:"-.02em",margin:"0 0 6px"}},"Spacing & layout"),React.createElement("p",{style:{color:"var(--ink-soft)",maxWidth:"44em",margin:0}},"An 8px base scale; 1180px max content width with 24px gutters; ~62px section rhythm."),React.createElement("h2",{style:t},"Spacing scale (8px base)"),React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:8}},l.map(e=>React.createElement("div",{key:e.name,style:{display:"flex",alignItems:"center",gap:14}},React.createElement("div",{style:{width:90,...n}},e.name),React.createElement("div",{style:{width:44,...n}},e.px,"px"),React.createElement("div",{style:{height:14,width:e.px,background:"var(--orange)",borderRadius:3}})))),React.createElement("h2",{style:t},"Radii"),React.createElement("div",{style:{display:"flex",gap:18,flexWrap:"wrap"}},p.map(e=>React.createElement("div",{key:e.name,style:{textAlign:"center"}},React.createElement("div",{style:{width:90,height:64,background:"var(--white)",border:"1.5px solid var(--ink)",borderRadius:e.px,boxShadow:"var(--shadow-card)"}}),React.createElement("div",{style:{...n,marginTop:8}},e.name),React.createElement("div",{style:{...n}},e.px,"px")))),React.createElement("h2",{style:t},"Borders, the ink outline"),React.createElement("div",{style:{display:"flex",gap:18,flexWrap:"wrap"}},[{name:"--bw-hair",px:1},{name:"--bw",px:1.5},{name:"--bw-strong",px:2}].map(e=>React.createElement("div",{key:e.name,style:{textAlign:"center"}},React.createElement("div",{style:{width:120,height:56,background:"var(--paper)",border:`${e.px}px solid var(--ink)`,borderRadius:14}}),React.createElement("div",{style:{...n,marginTop:8}},e.name),React.createElement("div",{style:{...n}},e.px,"px")))))};var i,r,d;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
        Spacing &amp; layout
      </h1>
      <p style={{
      color: "var(--ink-soft)",
      maxWidth: "44em",
      margin: 0
    }}>
        An 8px base scale; 1180px max content width with 24px gutters; ~62px
        section rhythm.
      </p>

      <h2 style={heading}>Spacing scale (8px base)</h2>
      <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 8
    }}>
        {scale.map(s => <div key={s.name} style={{
        display: "flex",
        alignItems: "center",
        gap: 14
      }}>
            <div style={{
          width: 90,
          ...mono
        }}>{s.name}</div>
            <div style={{
          width: 44,
          ...mono
        }}>{s.px}px</div>
            <div style={{
          height: 14,
          width: s.px,
          background: "var(--orange)",
          borderRadius: 3
        }} />
          </div>)}
      </div>

      <h2 style={heading}>Radii</h2>
      <div style={{
      display: "flex",
      gap: 18,
      flexWrap: "wrap"
    }}>
        {radii.map(r => <div key={r.name} style={{
        textAlign: "center"
      }}>
            <div style={{
          width: 90,
          height: 64,
          background: "var(--white)",
          border: "1.5px solid var(--ink)",
          borderRadius: r.px,
          boxShadow: "var(--shadow-card)"
        }} />
            <div style={{
          ...mono,
          marginTop: 8
        }}>{r.name}</div>
            <div style={{
          ...mono
        }}>{r.px}px</div>
          </div>)}
      </div>

      <h2 style={heading}>Borders, the ink outline</h2>
      <div style={{
      display: "flex",
      gap: 18,
      flexWrap: "wrap"
    }}>
        {[{
        name: "--bw-hair",
        px: 1
      }, {
        name: "--bw",
        px: 1.5
      }, {
        name: "--bw-strong",
        px: 2
      }].map(b => <div key={b.name} style={{
        textAlign: "center"
      }}>
            <div style={{
          width: 120,
          height: 56,
          background: "var(--paper)",
          border: \`\${b.px}px solid var(--ink)\`,
          borderRadius: 14
        }} />
            <div style={{
          ...mono,
          marginTop: 8
        }}>{b.name}</div>
            <div style={{
          ...mono
        }}>{b.px}px</div>
          </div>)}
      </div>
    </div>
}`,...(d=(r=a.parameters)==null?void 0:r.docs)==null?void 0:d.source}}};const o=["ScaleAndRadii"];export{a as ScaleAndRadii,o as __namedExportsOrder,s as default};
