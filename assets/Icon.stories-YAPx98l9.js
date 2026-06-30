import{_ as w,a as R,b as q,c as O,d as G,e as V,f as j,g as D,h as A,i as M,j as N,k as F,l as W,m as P,n as U,o as $,p as B,q as H}from"./workflow-LFjrn-sW.js";import{r as J}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function K(e){return typeof e=="string"?e:e.src}function r({src:e,color:s="currentColor",size:m=24,label:c,className:z,style:T={}}){const p=`url(${K(e)}) center / contain no-repeat`;return J.createElement("span",{role:c?"img":void 0,"aria-label":c,"aria-hidden":c?void 0:!0,className:z,style:{display:"inline-block",width:m,height:m,flex:"none",background:s,WebkitMask:p,mask:p,...T}})}r.__docgenInfo={description:"A single bespoke line icon, tinted via CSS `mask` so one SVG renders in any\nbrand colour (`currentColor` is not inherited by `<img>`, hence the mask).\nDefaults to `currentColor`, so an Icon picks up the text colour of its\ncontext unless a `color` is given. Import an SVG from `src/assets/icons` and\npass it as `src`. No icon font, no third-party library, see AGENTS.md.",methods:[],displayName:"Icon",props:{src:{required:!0,tsType:{name:"union",raw:"string | { src: string }",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ src: string }",signature:{properties:[{key:"src",value:{name:"string",required:!0}}]}}]},description:"An SVG from the bespoke set (`src/assets/icons`), imported through the\nbundler. It is mask-tinted, so the file's own colours are ignored."},color:{required:!1,tsType:{name:"string"},description:'Tint colour, any CSS colour or token. @default "currentColor"',defaultValue:{value:'"currentColor"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:"number | string",elements:[{name:"number"},{name:"string"}]},description:"Square size: a px number or any CSS length. @default 24",defaultValue:{value:"24",computed:!1}},label:{required:!1,tsType:{name:"string"},description:"Accessible label. Omit for decorative icons (rendered `aria-hidden`)."},className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}}}};const L=Object.assign({"../../assets/icons/assistant.svg":H,"../../assets/icons/calendar.svg":B,"../../assets/icons/cart.svg":$,"../../assets/icons/chart.svg":U,"../../assets/icons/check.svg":P,"../../assets/icons/funnel.svg":W,"../../assets/icons/lightbulb.svg":F,"../../assets/icons/link.svg":N,"../../assets/icons/mail.svg":M,"../../assets/icons/people.svg":A,"../../assets/icons/play.svg":D,"../../assets/icons/refresh.svg":j,"../../assets/icons/screen.svg":V,"../../assets/icons/search.svg":G,"../../assets/icons/send.svg":O,"../../assets/icons/storefront.svg":q,"../../assets/icons/target.svg":R,"../../assets/icons/workflow.svg":w}),l=Object.fromEntries(Object.entries(L).map(([e,s])=>[e.split("/").pop().replace(".svg",""),s])),Z={title:"Core/Icon",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"A single bespoke line icon, tinted via CSS `mask` so one SVG renders in any brand colour. Defaults to `currentColor` (inherits the surrounding text colour). Import an SVG from `src/assets/icons` and pass it as `src`. No icon font, no third-party library."}}},args:{src:l.assistant,color:"var(--ink)",size:28},argTypes:{color:{control:"color"},size:{control:{type:"number",min:12,max:96,step:2}},src:{control:!1}}},n={},a={args:{color:"var(--orange)"}},t={render:e=>React.createElement("div",{style:{display:"flex",alignItems:"center",gap:16}},[16,24,32,48].map(s=>React.createElement(r,{key:s,...e,size:s})))},o={render:()=>React.createElement("div",{style:{display:"flex",gap:18,alignItems:"center"}},["var(--ink)","var(--orange)","var(--green)","var(--violet)","var(--amber)"].map(e=>React.createElement(r,{key:e,src:l.workflow,color:e,size:34})))},i={parameters:{docs:{description:{story:"Every icon in the set, ink-tinted."}}},render:()=>React.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(76px, 1fr))",gap:16,maxWidth:760}},Object.entries(l).map(([e,s])=>React.createElement("div",{key:e,style:{display:"flex",flexDirection:"column",alignItems:"center",gap:8}},React.createElement(r,{src:s,color:"var(--ink)",size:26}),React.createElement("span",{style:{fontSize:".68rem",color:"var(--ink-soft)",fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace"}},e))))};var d,g,u;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:"{}",...(u=(g=n.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};var _,v,f;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    color: "var(--orange)"
  }
}`,...(f=(v=a.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var y,b,k;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "flex",
    alignItems: "center",
    gap: 16
  }}>
      {[16, 24, 32, 48].map(s => <Icon key={s} {...args} size={s} />)}
    </div>
}`,...(k=(b=t.parameters)==null?void 0:b.docs)==null?void 0:k.source}}};var h,S,x;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 18,
    alignItems: "center"
  }}>
      {["var(--ink)", "var(--orange)", "var(--green)", "var(--violet)", "var(--amber)"].map(c => <Icon key={c} src={icons.workflow} color={c} size={34} />)}
    </div>
}`,...(x=(S=o.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var I,C,E;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Every icon in the set, ink-tinted."
      }
    }
  },
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))",
    gap: 16,
    maxWidth: 760
  }}>
      {Object.entries(icons).map(([name, url]) => <div key={name} style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8
    }}>
          <Icon src={url} color="var(--ink)" size={26} />
          <span style={{
        fontSize: ".68rem",
        color: "var(--ink-soft)",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
      }}>
            {name}
          </span>
        </div>)}
    </div>
}`,...(E=(C=i.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};const ee=["Default","Orange","Sizes","Tints","Gallery"];export{n as Default,i as Gallery,a as Orange,t as Sizes,o as Tints,ee as __namedExportsOrder,Z as default};
