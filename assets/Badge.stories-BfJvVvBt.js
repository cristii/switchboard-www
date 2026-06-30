import{r as M}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function e({children:E,variant:A="neutral",style:N={}}){const T={neutral:{background:"var(--paper-3)",color:"var(--ink)"},green:{background:"var(--tint-green-bg)",color:"var(--tint-green-fg)"},amber:{background:"var(--tint-amber-bg)",color:"var(--tint-amber-fg)"},violet:{background:"var(--tint-violet-bg)",color:"var(--tint-violet-fg)"},solid:{background:"var(--orange)",color:"#fff"}};return M.createElement("span",{style:{display:"inline-block",fontFamily:"var(--font-display, 'Bricolage Grotesque', sans-serif)",fontWeight:700,fontSize:".7rem",textTransform:"uppercase",letterSpacing:".05em",padding:"3px 10px",borderRadius:"var(--r-pill, 20px)",lineHeight:1.5,...T[A],...N}},E)}e.__docgenInfo={description:`Small rounded label. Tint variants categorize (e.g. difficulty levels or
tags); the solid variant is the orange "flag" used for callouts like
"Most popular".`,methods:[],displayName:"Badge",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:'"neutral" | "green" | "amber" | "violet" | "solid"',elements:[{name:"literal",value:'"neutral"'},{name:"literal",value:'"green"'},{name:"literal",value:'"amber"'},{name:"literal",value:'"violet"'},{name:"literal",value:'"solid"'}]},description:'@default "neutral"',defaultValue:{value:'"neutral"',computed:!1}},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}}}};const I={title:"Core/Badge",component:e,tags:["autodocs"],parameters:{docs:{description:{component:"Small rounded label. Tint variants categorize (difficulty levels, tags); the solid variant is the orange 'flag' for callouts like 'Most popular'."}}},args:{children:"n8n",variant:"neutral"},argTypes:{variant:{control:"inline-radio",options:["neutral","green","amber","violet","solid"]}}},a={},r={args:{variant:"green",children:"Beginner"}},t={args:{variant:"amber",children:"Intermediate"}},n={args:{variant:"violet",children:"Advanced"}},o={args:{variant:"solid",children:"Most popular"}},i={render:()=>React.createElement("div",{style:{display:"flex",gap:10,flexWrap:"wrap"}},React.createElement(e,{variant:"neutral"},"Neutral"),React.createElement(e,{variant:"green"},"Beginner"),React.createElement(e,{variant:"amber"},"Intermediate"),React.createElement(e,{variant:"violet"},"Advanced"),React.createElement(e,{variant:"solid"},"Most popular"))};var l,s,d;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:"{}",...(d=(s=a.parameters)==null?void 0:s.docs)==null?void 0:d.source}}};var c,p,u;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    variant: "green",
    children: "Beginner"
  }
}`,...(u=(p=r.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var m,g,v;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    variant: "amber",
    children: "Intermediate"
  }
}`,...(v=(g=t.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var f,b,B;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    variant: "violet",
    children: "Advanced"
  }
}`,...(B=(b=n.parameters)==null?void 0:b.docs)==null?void 0:B.source}}};var h,y,S;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: "solid",
    children: "Most popular"
  }
}`,...(S=(y=o.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var R,x,k;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 10,
    flexWrap: "wrap"
  }}>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="green">Beginner</Badge>
      <Badge variant="amber">Intermediate</Badge>
      <Badge variant="violet">Advanced</Badge>
      <Badge variant="solid">Most popular</Badge>
    </div>
}`,...(k=(x=i.parameters)==null?void 0:x.docs)==null?void 0:k.source}}};const q=["Neutral","Green","Amber","Violet","Solid","AllVariants"];export{i as AllVariants,t as Amber,r as Green,a as Neutral,o as Solid,n as Violet,q as __namedExportsOrder,I as default};
