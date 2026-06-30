import{r as e}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function f({markSize:r=30,wordmark:g=!0,style:h={}}){const n="var(--font-display, 'Bricolage Grotesque', sans-serif)";return e.createElement("span",{style:{display:"inline-flex",alignItems:"center",gap:10,color:"inherit",...h}},e.createElement("svg",{width:r,height:r,viewBox:"0 0 30 30",fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",style:{flex:"none"}},e.createElement("circle",{cx:"8",cy:"8",r:"3"}),e.createElement("circle",{cx:"22",cy:"22",r:"3"}),e.createElement("path",{d:"M11 8H19a3 3 0 0 1 3 3V19"}),e.createElement("path",{d:"M19 22H11a3 3 0 0 1 -3 -3V11"})),g?e.createElement("span",{style:{display:"flex",flexDirection:"column",lineHeight:1}},e.createElement("b",{style:{fontFamily:n,fontWeight:800,fontSize:"1.32rem",letterSpacing:"-.03em"}},"Switchboard"),e.createElement("span",{style:{fontFamily:n,fontWeight:600,fontSize:".58rem",letterSpacing:".22em",opacity:.62,marginTop:3}},"AI SYSTEMS")):null)}f.__docgenInfo={description:`The Switchboard brand lockup: the line-drawn "connector" mark plus the
Bricolage wordmark. Colour is inherited (\`currentColor\`) so it sits on light
or dark surfaces, the header passes ink, the footer passes paper. The
"AI SYSTEMS" line is the same colour at reduced opacity, so it adapts too.
Presentational only: wrap it in a link to make it navigate.`,methods:[],displayName:"Logo",props:{markSize:{required:!1,tsType:{name:"number"},description:"Pixel size of the square connector mark. @default 30",defaultValue:{value:"30",computed:!1}},wordmark:{required:!1,tsType:{name:"boolean"},description:'Show the "Switchboard / AI SYSTEMS" wordmark beside the mark. @default true',defaultValue:{value:"true",computed:!1}},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}}}};const w={title:"Core/Logo",component:f,tags:["autodocs"],parameters:{docs:{description:{component:"The brand lockup (connector mark + Bricolage wordmark). Colour is inherited, so it adapts to light or dark surfaces. Wrap it in a link to navigate home."}}},args:{markSize:30,wordmark:!0},argTypes:{markSize:{control:{type:"range",min:18,max:64,step:1}},wordmark:{control:"boolean"}}},a={},t={args:{wordmark:!1,markSize:40}},o={parameters:{backgrounds:{default:"dark"}},decorators:[r=>React.createElement("div",{style:{background:"var(--dark)",color:"var(--paper)",padding:28,borderRadius:14}},React.createElement(r,null))]};var s,i,c;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:"{}",...(c=(i=a.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var l,d,p;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    wordmark: false,
    markSize: 40
  }
}`,...(p=(d=t.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var m,u,k;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: "dark"
    }
  },
  decorators: [Story => <div style={{
    background: "var(--dark)",
    color: "var(--paper)",
    padding: 28,
    borderRadius: 14
  }}>
        <Story />
      </div>]
}`,...(k=(u=o.parameters)==null?void 0:u.docs)==null?void 0:k.source}}};const b=["Default","MarkOnly","OnDark"];export{a as Default,t as MarkOnly,o as OnDark,b as __namedExportsOrder,w as default};
