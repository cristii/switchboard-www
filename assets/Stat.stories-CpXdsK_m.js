import{r as n}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function a({value:e,label:f,onDark:v=!1,style:k={}}){return n.createElement("div",{style:k},n.createElement("div",{style:{fontFamily:"var(--font-display, 'Bricolage Grotesque', sans-serif)",fontWeight:800,fontSize:"2.5rem",lineHeight:1,color:"var(--orange)"}},e),n.createElement("div",{style:{fontSize:".86rem",marginTop:"6px",color:v?"#bcc4bd":"var(--ink-soft)"}},f))}a.__docgenInfo={description:`A large orange Bricolage figure with a muted caption, for proof/impact
numbers. Keep figures honest (the brand never invents fake stats).`,methods:[],displayName:"Stat",props:{value:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:'The headline figure, e.g. "<5s", "3×", "40+".'},label:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Supporting caption."},onDark:{required:!1,tsType:{name:"boolean"},description:"Lighten the caption for dark backgrounds. @default false",defaultValue:{value:"false",computed:!1}},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}}}};const R={title:"Data/Stat",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"A large orange Bricolage figure with a muted caption, for proof/impact numbers. Keep figures honest (the brand never invents fake stats)."}}},args:{value:"<5s",label:"Average time to answer a visitor, day or night",onDark:!1},argTypes:{onDark:{control:"boolean"}}},r={},t={args:{onDark:!0},parameters:{backgrounds:{default:"dark"}},decorators:[e=>React.createElement("div",{style:{background:"var(--dark)",padding:28,borderRadius:14}},React.createElement(e,null))]},o={parameters:{backgrounds:{default:"dark"}},decorators:[e=>React.createElement("div",{style:{background:"var(--dark)",padding:28,borderRadius:14}},React.createElement(e,null))],render:()=>React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:22}},React.createElement(a,{onDark:!0,value:"<5s",label:"Average time to answer a visitor, day or night"}),React.createElement(a,{onDark:!0,value:"3×",label:"More qualified enquiries vs. a static contact form"}),React.createElement(a,{onDark:!0,value:"10 min",label:"From your site to a working demo you can try"}))};var s,i,d;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:"{}",...(d=(i=r.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};var c,l,u;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    onDark: true
  },
  parameters: {
    backgrounds: {
      default: "dark"
    }
  },
  decorators: [Story => <div style={{
    background: "var(--dark)",
    padding: 28,
    borderRadius: 14
  }}>
        <Story />
      </div>]
}`,...(u=(l=t.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};var p,m,g;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: "dark"
    }
  },
  decorators: [Story => <div style={{
    background: "var(--dark)",
    padding: 28,
    borderRadius: 14
  }}>
        <Story />
      </div>],
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 22
  }}>
      <Stat onDark value="<5s" label="Average time to answer a visitor, day or night" />
      <Stat onDark value="3×" label="More qualified enquiries vs. a static contact form" />
      <Stat onDark value="10 min" label="From your site to a working demo you can try" />
    </div>
}`,...(g=(m=o.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};const S=["OnPaper","OnDark","Row"];export{t as OnDark,r as OnPaper,o as Row,S as __namedExportsOrder,R as default};
