import{r as y}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function g({children:t,tone:s="orange",style:b={}}){const k=s==="amber"?"var(--amber)":s==="ink"?"var(--ink)":"var(--orange)";return y.createElement("span",{style:{display:"inline-block",fontFamily:"var(--font-display, 'Bricolage Grotesque', sans-serif)",fontWeight:700,letterSpacing:"var(--ls-eyebrow, .14em)",textTransform:"uppercase",fontSize:"var(--fs-eyebrow, .72rem)",color:k,...b}},t)}g.__docgenInfo={description:`The small uppercase Bricolage kicker that labels a section. Orange by
default; amber on dark surfaces, ink when a quiet label is wanted.`,methods:[],displayName:"Eyebrow",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},tone:{required:!1,tsType:{name:"union",raw:'"orange" | "amber" | "ink"',elements:[{name:"literal",value:'"orange"'},{name:"literal",value:'"amber"'},{name:"literal",value:'"ink"'}]},description:'@default "orange"',defaultValue:{value:'"orange"',computed:!1}},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}}}};const h={title:"Core/Eyebrow",component:g,tags:["autodocs"],parameters:{docs:{description:{component:"The small uppercase Bricolage kicker that labels a section. Orange by default; amber on dark surfaces."}}},args:{children:"AI chatbots · automation · results",tone:"orange"},argTypes:{tone:{control:"inline-radio",options:["orange","amber","ink"]}}},e={},r={args:{tone:"ink",children:"My services"}},a={args:{tone:"amber",children:"Why 'results' isn't just a word"},parameters:{backgrounds:{default:"dark"}},decorators:[t=>React.createElement("div",{style:{background:"var(--dark)",padding:28,borderRadius:14}},React.createElement(t,null))]};var o,n,c;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:"{}",...(c=(n=e.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var i,l,d;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    tone: "ink",
    children: "My services"
  }
}`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var m,u,p;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    tone: "amber",
    children: "Why 'results' isn't just a word"
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
}`,...(p=(u=a.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};const w=["Orange","Ink","AmberOnDark"];export{a as AmberOnDark,r as Ink,e as Orange,w as __namedExportsOrder,h as default};
