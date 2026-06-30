import{r as a}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function r({children:t,variant:u="primary",size:J="md",href:g,icon:h,iconRight:f,arrow:K=!1,disabled:e=!1,onClick:v,style:Q={},...y}){const X={sm:{padding:".7em 1.1em",fontSize:".78rem"},md:{padding:".85em 1.3em",fontSize:"var(--fs-button, .86rem)"},lg:{padding:"1em 1.6em",fontSize:".95rem"}},b={primary:{background:"var(--orange)",color:"#fff",borderColor:"var(--orange-deep)",boxShadow:"var(--shadow-btn, 3px 3px 0 var(--ink))"},ghost:{background:"transparent",color:"var(--ink)",borderColor:"var(--ink)",boxShadow:"var(--shadow-btn-ghost, 3px 3px 0 rgba(var(--shadow-ink),.18))"},light:{background:"var(--paper)",color:"var(--ink)",borderColor:"var(--ink)",boxShadow:"var(--shadow-btn-ghost, 3px 3px 0 rgba(var(--shadow-ink),.18))"}},w={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:".5em",fontFamily:"var(--font-display, 'Bricolage Grotesque', sans-serif)",fontWeight:700,letterSpacing:"var(--ls-button, .02em)",textTransform:"uppercase",borderRadius:"10px",borderStyle:"solid",borderWidth:"var(--bw-strong, 2px)",cursor:e?"not-allowed":"pointer",opacity:e?.5:1,transition:"transform var(--dur-fast,.12s) ease, box-shadow var(--dur-fast,.12s) ease",textDecoration:"none",lineHeight:1,...X[J],...b[u],...Q},x=n=>{e||(n.currentTarget.style.transform="translateY(-2px)",n.currentTarget.style.boxShadow=u==="primary"?"var(--shadow-btn-hover, 5px 5px 0 var(--ink))":"5px 5px 0 rgba(var(--shadow-ink),.22)")},S=n=>{e||(n.currentTarget.style.transform="",n.currentTarget.style.boxShadow=b[u].boxShadow)},k=a.createElement(a.Fragment,null,h?a.createElement("span",{style:{display:"inline-flex"}},h):null,t,f?a.createElement("span",{style:{display:"inline-flex"}},f):null,K?a.createElement("span",{style:{fontFamily:"var(--font-body)",fontWeight:600}},"→"):null);return g?a.createElement("a",{href:g,style:w,onClick:e?void 0:v,onMouseEnter:x,onMouseLeave:S,"aria-disabled":e||void 0,...y},k):a.createElement("button",{style:w,onClick:e?void 0:v,onMouseEnter:x,onMouseLeave:S,disabled:e,...y},k)}r.__docgenInfo={description:`Switchboard primary action button: uppercase Bricolage label with a hard,
blur-free offset shadow that grows on hover. No blur, ever.`,methods:[],displayName:"Button",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:'"primary" | "ghost" | "light"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"ghost"'},{name:"literal",value:'"light"'}]},description:'Visual style. @default "primary"',defaultValue:{value:'"primary"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:'@default "md"',defaultValue:{value:'"md"',computed:!1}},href:{required:!1,tsType:{name:"string"},description:"Render as an anchor when set."},type:{required:!1,tsType:{name:"union",raw:'"button" | "submit" | "reset"',elements:[{name:"literal",value:'"button"'},{name:"literal",value:'"submit"'},{name:"literal",value:'"reset"'}]},description:"Button type when rendered as a <button>."},target:{required:!1,tsType:{name:"string"},description:"Anchor target / rel when rendered as a link."},rel:{required:!1,tsType:{name:"string"},description:""},icon:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Optional leading icon node."},iconRight:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Optional trailing icon node."},arrow:{required:!1,tsType:{name:"boolean"},description:"Append a → glyph after the label. @default false",defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"@default false",defaultValue:{value:"false",computed:!1}},style:{defaultValue:{value:"{}",computed:!1},required:!1}},composes:["Omit"]};const ee={title:"Core/Button",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"Uppercase Bricolage label with a HARD, blur-free offset shadow that grows on hover. The primary call-to-action across the brand."}}},args:{children:"Book a 15-min call",variant:"primary",size:"md",arrow:!1,disabled:!1},argTypes:{variant:{control:"inline-radio",options:["primary","ghost","light"]},size:{control:"inline-radio",options:["sm","md","lg"]},arrow:{control:"boolean"},disabled:{control:"boolean"},href:{control:"text"},onClick:{action:"clicked"}}},o={},s={args:{variant:"ghost",children:"See the work"}},i={args:{variant:"light",children:"Book a 15-min call"},parameters:{backgrounds:{default:"dark"}}},l={args:{arrow:!0,children:"Try the chatbot"}},c={args:{href:"#",arrow:!0,children:"Start with a free demo"}},d={args:{disabled:!0}},m={render:t=>React.createElement("div",{style:{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}},React.createElement(r,{...t,size:"sm"},"Small"),React.createElement(r,{...t,size:"md"},"Medium"),React.createElement(r,{...t,size:"lg"},"Large"))},p={render:()=>React.createElement("div",{style:{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}},React.createElement(r,{variant:"primary",arrow:!0},"Primary"),React.createElement(r,{variant:"ghost"},"Ghost"),React.createElement(r,{variant:"light"},"Light"))};var R,B,T;o.parameters={...o.parameters,docs:{...(R=o.parameters)==null?void 0:R.docs,source:{originalSource:"{}",...(T=(B=o.parameters)==null?void 0:B.docs)==null?void 0:T.source}}};var E,z,q;s.parameters={...s.parameters,docs:{...(E=s.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    variant: "ghost",
    children: "See the work"
  }
}`,...(q=(z=s.parameters)==null?void 0:z.docs)==null?void 0:q.source}}};var L,W,N;i.parameters={...i.parameters,docs:{...(L=i.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    variant: "light",
    children: "Book a 15-min call"
  },
  parameters: {
    backgrounds: {
      default: "dark"
    }
  }
}`,...(N=(W=i.parameters)==null?void 0:W.docs)==null?void 0:N.source}}};var V,A,C;l.parameters={...l.parameters,docs:{...(V=l.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    arrow: true,
    children: "Try the chatbot"
  }
}`,...(C=(A=l.parameters)==null?void 0:A.docs)==null?void 0:C.source}}};var I,M,G;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    href: "#",
    arrow: true,
    children: "Start with a free demo"
  }
}`,...(G=(M=c.parameters)==null?void 0:M.docs)==null?void 0:G.source}}};var D,O,P;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...(P=(O=d.parameters)==null?void 0:O.docs)==null?void 0:P.source}}};var _,F,H;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap"
  }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
}`,...(H=(F=m.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var j,U,Y;p.parameters={...p.parameters,docs:{...(j=p.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap"
  }}>
      <Button variant="primary" arrow>
        Primary
      </Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="light">Light</Button>
    </div>
}`,...(Y=(U=p.parameters)==null?void 0:U.docs)==null?void 0:Y.source}}};const re=["Primary","Ghost","Light","WithArrow","AsLink","Disabled","Sizes","Variants"];export{c as AsLink,d as Disabled,s as Ghost,i as Light,o as Primary,m as Sizes,p as Variants,l as WithArrow,re as __namedExportsOrder,ee as default};
