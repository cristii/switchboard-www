import{r as R}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function e({children:t,active:o=!1,onDark:s=!1,style:g={}}){const k=o?"var(--orange)":s?"#54605C":"var(--line)",y=o?"var(--orange)":s?"var(--paper)":"var(--ink)";return R.createElement("span",{style:{display:"inline-block",border:`1.5px solid ${k}`,borderRadius:"var(--r-pill, 20px)",padding:"6px 14px",fontFamily:"var(--font-display, 'Bricolage Grotesque', sans-serif)",fontWeight:600,fontSize:".74rem",textTransform:"uppercase",letterSpacing:".04em",color:y,...g}},t)}e.__docgenInfo={description:`Outlined capsule used in the conversion "flow" rows
(Conversation → Qualified lead → Booked call). Active state turns orange.`,methods:[],displayName:"Pill",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},active:{required:!1,tsType:{name:"boolean"},description:"@default false",defaultValue:{value:"false",computed:!1}},onDark:{required:!1,tsType:{name:"boolean"},description:"Lighten the resting outline for dark surfaces. @default false",defaultValue:{value:"false",computed:!1}},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}}}};const D={title:"Core/Pill",component:e,tags:["autodocs"],parameters:{docs:{description:{component:"Outlined capsule used in the conversion 'flow' rows (Conversation → Qualified lead → Booked call). Active turns orange; onDark lightens the resting outline."}}},args:{children:"Conversation",active:!1,onDark:!1},argTypes:{active:{control:"boolean"},onDark:{control:"boolean"}}},a={},r={args:{active:!0}},n={parameters:{backgrounds:{default:"dark"}},decorators:[t=>React.createElement("div",{style:{background:"var(--ink)",padding:28,borderRadius:14}},React.createElement(t,null))],render:()=>React.createElement("div",{style:{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}},React.createElement(e,{active:!0,onDark:!0},"Conversation"),React.createElement("span",{style:{color:"var(--orange)"}},"→"),React.createElement(e,{onDark:!0},"Qualified lead"),React.createElement("span",{style:{color:"var(--orange)"}},"→"),React.createElement(e,{onDark:!0},"Booked call"))};var l,i,c;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:"{}",...(c=(i=a.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var d,p,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    active: true
  }
}`,...(u=(p=r.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var m,f,v;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  parameters: {
    backgrounds: {
      default: "dark"
    }
  },
  decorators: [Story => <div style={{
    background: "var(--ink)",
    padding: 28,
    borderRadius: 14
  }}>
        <Story />
      </div>],
  render: () => <div style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap"
  }}>
      <Pill active onDark>
        Conversation
      </Pill>
      <span style={{
      color: "var(--orange)"
    }}>→</span>
      <Pill onDark>Qualified lead</Pill>
      <span style={{
      color: "var(--orange)"
    }}>→</span>
      <Pill onDark>Booked call</Pill>
    </div>
}`,...(v=(f=n.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};const E=["Resting","Active","FlowOnDark"];export{r as Active,n as FlowOnDark,a as Resting,E as __namedExportsOrder,D as default};
