import{r as e}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function c({title:r,children:p,rotate:m=-1.4,style:u={}}){return e.createElement("div",{style:{position:"relative",background:"var(--paper)",border:"1.5px solid var(--ink)",borderRadius:"10px",padding:"18px 20px",transform:`rotate(${m}deg)`,boxShadow:"var(--shadow-card, 4px 4px 0 rgba(var(--shadow-ink),.1))",...u}},e.createElement("span",{"aria-hidden":"true",style:{position:"absolute",top:"-9px",left:"50%",transform:"translateX(-50%)",width:"50px",height:"16px",background:"rgba(180,83,9,.5)",border:"1px solid var(--orange-deep)",borderRadius:"3px"}}),r?e.createElement("h4",{style:{fontFamily:"var(--font-hand, 'Caveat', cursive)",fontSize:"1.5rem",fontWeight:700,margin:"0 0 8px"}},r):null,e.createElement("div",{style:{fontFamily:"var(--font-hand, 'Caveat', cursive)",fontSize:"1.18rem",lineHeight:1.55}},p))}c.__docgenInfo={description:`A slightly rotated, taped paper note set in the Caveat hand. Use sparingly
for asides, tech-stack lists, marginalia. One per view, max.`,methods:[],displayName:"StickyNote",props:{title:{required:!1,tsType:{name:"string"},description:"Heading shown in the Caveat hand."},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},rotate:{required:!1,tsType:{name:"number"},description:"Rotation in degrees. @default -1.4",defaultValue:{value:"-1.4",computed:!1}},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}}}};const y={title:"Surfaces/StickyNote",component:c,tags:["autodocs"],parameters:{docs:{description:{component:"A slightly rotated, taped paper note set in the Caveat hand. Use sparingly for asides, tech-stack lists, marginalia. One per view, max."}}},args:{title:"Tech stack",rotate:-1.4,children:React.createElement("ul",{style:{listStyle:"none",margin:0,padding:0}},React.createElement("li",null,"– n8n"),React.createElement("li",null,"– Trigger.dev"),React.createElement("li",null,"– OpenAI / Claude"),React.createElement("li",null,"– Supabase"))},argTypes:{rotate:{control:{type:"range",min:-6,max:6,step:.2}},title:{control:"text"}}},t={args:{style:{maxWidth:220}}},a={args:{title:void 0,children:"↳ that's the whole system.",style:{maxWidth:220}}};var s,n,i;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    style: {
      maxWidth: 220
    }
  }
}`,...(i=(n=t.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};var o,l,d;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    title: undefined,
    children: "↳ that's the whole system.",
    style: {
      maxWidth: 220
    }
  }
}`,...(d=(l=a.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const f=["Default","NoTitle"];export{t as Default,a as NoTitle,f as __namedExportsOrder,y as default};
