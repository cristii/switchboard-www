import{r as m}from"./index-ClcD9ViR.js";import{I as v}from"./IconButton-BRTUtk6P.js";import{F as h,S as f}from"./Select-CS94AYgU.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./NodeGlyph-Ds_AotSp.js";function u({raised:r=!1,style:o,children:e,...g}){return m.createElement("div",{style:{background:"var(--editor-surface)",color:"var(--editor-text)",border:"1.5px solid var(--editor-border-soft)",borderRadius:"var(--r, 14px)",boxShadow:r?"var(--editor-shadow)":"none",...o},...g},e)}u.__docgenInfo={description:"",methods:[],displayName:"Panel",props:{raised:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};const S={title:"Editor/Primitives"};function p(){const[r,o]=m.useState("orthogonal");return React.createElement("div",{style:{display:"flex",flexDirection:"column",gap:18,maxWidth:340}},React.createElement("div",{style:{display:"flex",gap:4,alignItems:"center"}},["undo","redo","zoomIn","zoomOut","fit","reset","download","image","moon"].map(e=>React.createElement(v,{key:e,label:e,glyph:e,onClick:()=>{}}))),React.createElement(u,{raised:!0,style:{padding:16,display:"flex",flexDirection:"column",gap:12}},React.createElement(h,{label:"Label",defaultValue:"Command Parser",onCommit:()=>{}}),React.createElement(f,{label:"Routing",value:r,options:[{value:"orthogonal",label:"Orthogonal"},{value:"smooth",label:"Smooth"},{value:"direct",label:"Direct"}],onChange:o})))}const t={render:()=>React.createElement("div",{"data-editor-theme":"light"},React.createElement(p,null))},a={render:()=>React.createElement("div",{"data-editor-theme":"dark",style:{background:"var(--editor-bg)",padding:24,borderRadius:14}},React.createElement(p,null))};var d,n,i;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <div data-editor-theme="light">
      <Showcase />
    </div>
}`,...(i=(n=t.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};var l,s,c;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <div data-editor-theme="dark" style={{
    background: "var(--editor-bg)",
    padding: 24,
    borderRadius: 14
  }}>
      <Showcase />
    </div>
}`,...(c=(s=a.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const k=["Light","Dark"];export{a as Dark,t as Light,k as __namedExportsOrder,S as default};
