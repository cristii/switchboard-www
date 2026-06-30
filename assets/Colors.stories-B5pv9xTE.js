const s={title:"Foundations/Colors",parameters:{layout:"fullscreen",backgrounds:{disable:!0}}},o=[{title:"Paper neutrals",note:"Backgrounds & surfaces. The page is recycled paper; two darker steps alternate sections and wells.",tokens:[{name:"--paper",value:"#E9E8DF"},{name:"--paper-2",value:"#E1E2D7"},{name:"--paper-3",value:"#D7D9CB"},{name:"--white",value:"#FFFFFF"}]},{title:"Ink & dark surfaces",note:"Primary text, the signature hard borders, and the near-black dark bands.",tokens:[{name:"--ink",value:"#15211F",dark:!0},{name:"--ink-soft",value:"#54605C",dark:!0},{name:"--dark",value:"#11201E",dark:!0}]},{title:"Lines",note:"Hairline borders and faint dividers on light surfaces.",tokens:[{name:"--line",value:"#B9C2B6"},{name:"--line-soft",value:"#CBD2C5"}]},{title:"Brand accent, burnt orange",note:"The single accent: CTAs, links, numbers, the hand-drawn underline.",tokens:[{name:"--orange",value:"#B45309",dark:!0},{name:"--orange-deep",value:"#92400E",dark:!0},{name:"--amber",value:"#FBBF24"}]},{title:"Supporting hues",note:"Green marks success/checks; violet appears only on the 'Advanced' tag.",tokens:[{name:"--green",value:"#3F7A4E",dark:!0},{name:"--violet",value:"#6A4A8A",dark:!0}]},{title:"Tag tints (paired bg / fg)",note:"A ~12% wash paired with the saturated foreground.",tokens:[{name:"--tint-green-bg",value:"#E6EFE4"},{name:"--tint-green-fg",value:"#3F7A4E",dark:!0},{name:"--tint-amber-bg",value:"#FBE8CF"},{name:"--tint-amber-fg",value:"#92400E",dark:!0},{name:"--tint-violet-bg",value:"#E9E0F0"},{name:"--tint-violet-fg",value:"#6A4A8A",dark:!0}]}];function l({token:e}){return React.createElement("div",{style:{width:150}},React.createElement("div",{style:{height:64,borderRadius:10,border:"1.5px solid var(--ink)",background:e.value,boxShadow:"var(--shadow-card)"}}),React.createElement("div",{style:{fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace",fontSize:".74rem",marginTop:8,color:"var(--ink)"}},e.name),React.createElement("div",{style:{fontSize:".72rem",color:"var(--ink-soft)"}},e.value))}const t={render:()=>React.createElement("div",{style:{maxWidth:980,margin:"0 auto",padding:"40px 24px"}},React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontWeight:800,fontSize:"2rem",letterSpacing:"-.02em",margin:"0 0 6px"}},"Colors"),React.createElement("p",{style:{color:"var(--ink-soft)",maxWidth:"40em",margin:"0 0 32px"}},"A flat printed palette, no gradients as identity. Recycled paper, pine ink, one burnt-orange accent, and quiet supporting hues."),o.map(e=>React.createElement("section",{key:e.title,style:{marginBottom:34}},React.createElement("h2",{style:{fontFamily:"var(--font-display)",fontWeight:700,fontSize:"1.1rem",margin:"0 0 4px"}},e.title),React.createElement("p",{style:{color:"var(--ink-soft)",fontSize:".9rem",margin:"0 0 14px"}},e.note),React.createElement("div",{style:{display:"flex",gap:16,flexWrap:"wrap"}},e.tokens.map(n=>React.createElement(l,{key:n.name,token:n}))))))};var a,r,i;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
        Colors
      </h1>
      <p style={{
      color: "var(--ink-soft)",
      maxWidth: "40em",
      margin: "0 0 32px"
    }}>
        A flat printed palette, no gradients as identity. Recycled paper, pine
        ink, one burnt-orange accent, and quiet supporting hues.
      </p>
      {groups.map(g => <section key={g.title} style={{
      marginBottom: 34
    }}>
          <h2 style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "1.1rem",
        margin: "0 0 4px"
      }}>
            {g.title}
          </h2>
          <p style={{
        color: "var(--ink-soft)",
        fontSize: ".9rem",
        margin: "0 0 14px"
      }}>
            {g.note}
          </p>
          <div style={{
        display: "flex",
        gap: 16,
        flexWrap: "wrap"
      }}>
            {g.tokens.map(t => <Swatch key={t.name} token={t} />)}
          </div>
        </section>)}
    </div>
}`,...(i=(r=t.parameters)==null?void 0:r.docs)==null?void 0:i.source}}};const d=["Palette"];export{t as Palette,d as __namedExportsOrder,s as default};
