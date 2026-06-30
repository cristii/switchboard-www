import{_ as m,a as c,b as _,c as p,d as g,e as d,f as v,g as f,h as y,i as u,j as h,k as b,l as x,m as k,n as S,o as R,p as E,q as T}from"./workflow-LFjrn-sW.js";const w={title:"Foundations/Icons",parameters:{layout:"fullscreen",backgrounds:{disable:!0}}},F=Object.assign({"../../assets/icons/assistant.svg":T,"../../assets/icons/calendar.svg":E,"../../assets/icons/cart.svg":R,"../../assets/icons/chart.svg":S,"../../assets/icons/check.svg":k,"../../assets/icons/funnel.svg":x,"../../assets/icons/lightbulb.svg":b,"../../assets/icons/link.svg":h,"../../assets/icons/mail.svg":u,"../../assets/icons/people.svg":y,"../../assets/icons/play.svg":f,"../../assets/icons/refresh.svg":v,"../../assets/icons/screen.svg":d,"../../assets/icons/search.svg":g,"../../assets/icons/send.svg":p,"../../assets/icons/storefront.svg":_,"../../assets/icons/target.svg":c,"../../assets/icons/workflow.svg":m}),s=Object.entries(F).map(([e,n])=>({name:e.split("/").pop().replace(".svg",""),url:n})).sort((e,n)=>e.name.localeCompare(n.name));function t({name:e,url:n,color:l}){return React.createElement("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"18px 8px",background:"var(--white)",border:"1.5px solid var(--ink)",borderRadius:14,boxShadow:"var(--shadow-card)"}},React.createElement("span",{"aria-hidden":"true",style:{width:28,height:28,background:l,WebkitMask:`url(${n}) center / contain no-repeat`,mask:`url(${n}) center / contain no-repeat`}}),React.createElement("span",{style:{fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace",fontSize:".7rem",color:"var(--ink-soft)"}},e))}const a={render:()=>React.createElement("div",{style:{maxWidth:980,margin:"0 auto",padding:"40px 24px"}},React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontWeight:800,fontSize:"2rem",letterSpacing:"-.02em",margin:"0 0 6px"}},"Icons"),React.createElement("p",{style:{color:"var(--ink-soft)",maxWidth:"44em",margin:"0 0 28px"}},"A bespoke, hand-drawn-feel line set, ~1.8 stroke, round caps and joins, no fills. There is no icon font and no third-party library. Tint via CSS"," ",React.createElement("code",null,"mask"),": ink by default, orange for emphasis."),React.createElement("h2",{style:{fontFamily:"var(--font-display)",fontSize:"1.05rem",margin:"0 0 12px"}},"Ink (",s.length,")"),React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(108px, 1fr))",gap:14,marginBottom:30}},s.map(e=>React.createElement(t,{key:e.name,name:e.name,url:e.url,color:"var(--ink)"}))),React.createElement("h2",{style:{fontFamily:"var(--font-display)",fontSize:"1.05rem",margin:"0 0 12px"}},"Orange (emphasis)"),React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(108px, 1fr))",gap:14}},s.map(e=>React.createElement(t,{key:e.name,name:e.name,url:e.url,color:"var(--orange)"}))))};var i,o,r;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
        Icons
      </h1>
      <p style={{
      color: "var(--ink-soft)",
      maxWidth: "44em",
      margin: "0 0 28px"
    }}>
        A bespoke, hand-drawn-feel line set, ~1.8 stroke, round caps and joins,
        no fills. There is no icon font and no third-party library. Tint via CSS{" "}
        <code>mask</code>: ink by default, orange for emphasis.
      </p>

      <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: "1.05rem",
      margin: "0 0 12px"
    }}>
        Ink ({icons.length})
      </h2>
      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(108px, 1fr))",
      gap: 14,
      marginBottom: 30
    }}>
        {icons.map(i => <IconTile key={i.name} name={i.name} url={i.url} color="var(--ink)" />)}
      </div>

      <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: "1.05rem",
      margin: "0 0 12px"
    }}>
        Orange (emphasis)
      </h2>
      <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(108px, 1fr))",
      gap: 14
    }}>
        {icons.map(i => <IconTile key={i.name} name={i.name} url={i.url} color="var(--orange)" />)}
      </div>
    </div>
}`,...(r=(o=a.parameters)==null?void 0:o.docs)==null?void 0:r.source}}};const z=["LineSet"];export{a as LineSet,z as __namedExportsOrder,w as default};
