import{r as b}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function e({children:v,tone:R="white",featured:o=!1,flat:k=!1,style:S={},...W}){const l={white:"var(--white)",paper:"var(--paper)",sunken:"var(--paper-2)"};return b.createElement("div",{style:{background:l[R]||l.white,border:o?"1.5px solid var(--orange)":"1.5px solid var(--ink)",borderRadius:"var(--r, 14px)",boxShadow:k?"none":o?"var(--shadow-accent, 5px 5px 0 var(--orange))":"var(--shadow-card, 4px 4px 0 rgba(var(--shadow-ink),.1))",padding:"22px 24px",...S},...W},v)}e.__docgenInfo={description:"The workhorse surface: filled, ink-outlined, with a HARD offset shadow.\n`featured` swaps the outline + shadow to orange (the popular-plan treatment).\n`tone` picks the fill so cards read on either paper background.",methods:[],displayName:"Card",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},tone:{required:!1,tsType:{name:"union",raw:'"white" | "paper" | "sunken"',elements:[{name:"literal",value:'"white"'},{name:"literal",value:'"paper"'},{name:"literal",value:'"sunken"'}]},description:'Fill color. @default "white"',defaultValue:{value:'"white"',computed:!1}},featured:{required:!1,tsType:{name:"boolean"},description:"Orange outline + orange shadow (the popular-plan treatment). @default false",defaultValue:{value:"false",computed:!1}},flat:{required:!1,tsType:{name:"boolean"},description:"Drop the offset shadow. @default false",defaultValue:{value:"false",computed:!1}},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}}}};const s=React.createElement(React.Fragment,null,React.createElement("h3",{style:{fontFamily:"var(--font-display)",fontWeight:700,fontSize:"1.18rem",margin:"0 0 7px"}},"Website Assistant"),React.createElement("p",{style:{margin:0,color:"var(--ink-soft)",fontSize:".92rem"}},"FAQ answers + basic lead capture, ready to install with a single script tag.")),T={title:"Surfaces/Card",component:e,tags:["autodocs"],parameters:{docs:{description:{component:"The workhorse surface: filled, ink-outlined, with a HARD offset shadow. `featured` swaps the outline + shadow to orange (the popular-plan treatment)."}}},args:{tone:"white",featured:!1,flat:!1,children:s},argTypes:{tone:{control:"inline-radio",options:["white","paper","sunken"]},featured:{control:"boolean"},flat:{control:"boolean"}}},a={args:{style:{maxWidth:320}}},t={args:{featured:!0,style:{maxWidth:320}}},r={args:{flat:!0,style:{maxWidth:320}}},n={render:()=>React.createElement("div",{style:{display:"flex",gap:18,flexWrap:"wrap"}},React.createElement(e,{tone:"white",style:{maxWidth:240}},s),React.createElement(e,{tone:"paper",style:{maxWidth:240}},s),React.createElement(e,{tone:"sunken",style:{maxWidth:240}},s))};var d,i,p;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    style: {
      maxWidth: 320
    }
  }
}`,...(p=(i=a.parameters)==null?void 0:i.docs)==null?void 0:p.source}}};var c,u,m;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    featured: true,
    style: {
      maxWidth: 320
    }
  }
}`,...(m=(u=t.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var f,h,w;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    flat: true,
    style: {
      maxWidth: 320
    }
  }
}`,...(w=(h=r.parameters)==null?void 0:h.docs)==null?void 0:w.source}}};var g,x,y;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 18,
    flexWrap: "wrap"
  }}>
      <Card tone="white" style={{
      maxWidth: 240
    }}>
        {Sample}
      </Card>
      <Card tone="paper" style={{
      maxWidth: 240
    }}>
        {Sample}
      </Card>
      <Card tone="sunken" style={{
      maxWidth: 240
    }}>
        {Sample}
      </Card>
    </div>
}`,...(y=(x=n.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};const F=["Default","Featured","Flat","Tones"];export{a as Default,t as Featured,r as Flat,n as Tones,F as __namedExportsOrder,T as default};
