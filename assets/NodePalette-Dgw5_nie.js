import{r as t}from"./index-ClcD9ViR.js";import{u as p,c as g}from"./useWorkflowStore-B5i6O06S.js";import{N as l}from"./NodeGlyph-Ds_AotSp.js";const i=n=>`var(--node-${n})`,v={fontFamily:"var(--font-display, sans-serif)",fontWeight:700,fontSize:"0.7rem",textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--editor-text-muted)",margin:"0 0 10px"},y={fontFamily:"var(--font-display, sans-serif)",fontWeight:700,fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.12em",color:"var(--editor-text-muted)",margin:"0 0 5px"},s={display:"flex",alignItems:"center",gap:9,width:"100%",padding:"7px 9px",borderRadius:8,border:"1.5px solid transparent",background:"transparent",color:"var(--editor-text)",fontFamily:"var(--font-body, sans-serif)",fontSize:"0.8rem",cursor:"pointer",textAlign:"left"};function f({onAdd:n,className:d,style:c}){const u=p(a=>a.addNode),o=n??((a,e)=>void u(a,e)),m=g();return t.createElement("div",{className:d,style:{background:"var(--editor-surface)",color:"var(--editor-text)",overflowY:"auto",padding:"14px 12px",...c}},t.createElement("div",{style:v},"Add node"),m.map(a=>t.createElement("div",{key:a.category,style:{marginBottom:12}},t.createElement("div",{style:y},a.category),t.createElement("div",{style:{display:"flex",flexDirection:"column",gap:2}},a.entries.map(e=>t.createElement("button",{key:e.kind,type:"button",style:s,title:e.description,onClick:()=>o(e.kind),onMouseEnter:r=>{r.currentTarget.style.background="var(--editor-surface-2)",r.currentTarget.style.borderColor="var(--editor-border-soft)"},onMouseLeave:r=>{r.currentTarget.style.background="transparent",r.currentTarget.style.borderColor="transparent"}},t.createElement(l,{name:e.glyph,size:17,color:i(e.colorRole)}),t.createElement("span",null,e.label))),a.category==="Annotate"?t.createElement("button",{type:"button",style:s,title:"A styled label chip (bubble tag). Pick the style in the Inspector.",onClick:()=>o("text",{label:"Tag",meta:{labelStyle:"bubble"}}),onMouseEnter:e=>{e.currentTarget.style.background="var(--editor-surface-2)",e.currentTarget.style.borderColor="var(--editor-border-soft)"},onMouseLeave:e=>{e.currentTarget.style.background="transparent",e.currentTarget.style.borderColor="transparent"}},t.createElement(l,{name:"type",size:17,color:i("orange")}),t.createElement("span",null,"Tag")):null))))}f.__docgenInfo={description:"",methods:[],displayName:"NodePalette",props:{onAdd:{required:!1,tsType:{name:"signature",type:"function",raw:"(kind: NodeKind, partial?: Partial<WorkflowNode>) => void",signature:{arguments:[{type:{name:"union",raw:`| "trigger"
| "action"
| "ai"
| "logic"
| "merge"
| "database"
| "queue"
| "service"
| "integration"
| "output"
| "group"
| "note"
| "text"
// device nodes (Phase 6)
| "monitor"
| "laptop"
| "phone"
| "browser"
| "serverStack"
// a procedural 3D step-icon (meta.icon picks which)
| "icon"
// an n8n-style white slab with a flat 2D icon texture on top (meta.icon picks which)
| "nodeCard"`,elements:[{name:"literal",value:'"trigger"'},{name:"literal",value:'"action"'},{name:"literal",value:'"ai"'},{name:"literal",value:'"logic"'},{name:"literal",value:'"merge"'},{name:"literal",value:'"database"'},{name:"literal",value:'"queue"'},{name:"literal",value:'"service"'},{name:"literal",value:'"integration"'},{name:"literal",value:'"output"'},{name:"literal",value:'"group"'},{name:"literal",value:'"note"'},{name:"literal",value:'"text"'},{name:"literal",value:'"monitor"'},{name:"literal",value:'"laptop"'},{name:"literal",value:'"phone"'},{name:"literal",value:'"browser"'},{name:"literal",value:'"serverStack"'},{name:"literal",value:'"icon"'},{name:"literal",value:'"nodeCard"'}]},name:"kind"},{type:{name:"Partial",elements:[{name:"WorkflowNode"}],raw:"Partial<WorkflowNode>"},name:"partial"}],return:{name:"void"}}},description:`Called when a kind is chosen. Defaults to the store's addNode. The optional
 partial seeds node fields (used by Annotate quick-adds, e.g. a styled Tag).`},className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""}}};export{f as N};
