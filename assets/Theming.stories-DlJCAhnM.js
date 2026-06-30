import{I as r,a as j,b as V,c as G,o as J}from"./IsometricWorkflowEditor-CPUPkXm5.js";import{r as e}from"./index-ClcD9ViR.js";import{b as p}from"./sampleDiagram-DEqWJYHz.js";import"./jsx-runtime-BYYWji4R.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Inspector-p7jQkFV7.js";import"./index-Brl4xq4Y.js";import"./Select-CS94AYgU.js";import"./IconButton-BRTUtk6P.js";import"./NodeGlyph-Ds_AotSp.js";import"./useWorkflowStore-B5i6O06S.js";import"./NodePalette-Dgw5_nie.js";import"./Toolbar-DN-GRkP-.js";function K(t){switch(t){case"ink":return{bg:"var(--editor-text)",fg:"var(--editor-bg)",sub:"var(--editor-bg)"};case"accent":return{bg:"var(--editor-accent)",fg:"#ffffff",sub:"rgba(255,255,255,0.82)"};default:return{bg:"var(--editor-surface-2)",fg:"var(--editor-text)",sub:"var(--editor-text-muted)"}}}function B({title:t,subtitle:l,logo:d,footer:m,tone:P="light",children:H,className:_,style:O}){const c=K(P);return e.createElement("div",{className:_,style:{display:"flex",flexDirection:"column",width:"100%",height:"100%",borderRadius:"var(--r-lg, 18px)",border:"1.5px solid var(--editor-border-soft)",background:"var(--editor-bg)",boxShadow:"var(--editor-shadow)",overflow:"hidden",...O}},t||l||d?e.createElement("div",{style:{flex:"none",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,padding:"12px 16px",background:c.bg,color:c.fg,borderBottom:"1.5px solid var(--editor-border-soft)"}},e.createElement("div",{style:{minWidth:0}},t?e.createElement("div",{style:{fontFamily:"var(--font-display, sans-serif)",fontWeight:800,fontSize:"1.05rem",letterSpacing:"-0.01em"}},t):null,l?e.createElement("div",{style:{fontFamily:"var(--font-body, sans-serif)",fontSize:"0.78rem",color:c.sub,marginTop:2}},l):null),d?e.createElement("div",{style:{flex:"none"}},d):null):null,e.createElement("div",{style:{position:"relative",flex:1,minHeight:0}},H),m?e.createElement("div",{style:{flex:"none",padding:"8px 16px",background:"var(--editor-surface)",color:"var(--editor-text-muted)",borderTop:"1.5px solid var(--editor-border-soft)",fontFamily:"var(--font-body, sans-serif)",fontSize:"0.72rem"}},m):null)}B.__docgenInfo={description:"",methods:[],displayName:"DiagramFrame",props:{title:{required:!1,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},logo:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Optional right-aligned slot (a logo / badge)."},footer:{required:!1,tsType:{name:"string"},description:""},tone:{required:!1,tsType:{name:"union",raw:'"light" | "ink" | "accent"',elements:[{name:"literal",value:'"light"'},{name:"literal",value:'"ink"'},{name:"literal",value:'"accent"'}]},description:'Header colourway. @default "light"',defaultValue:{value:'"light"',computed:!1}},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{required:!1,tsType:{name:"string"},description:""},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:""}}};const oe={title:"Editor/Theming"},s={parameters:{layout:"fullscreen"},render:()=>React.createElement("div",{style:{display:"flex",gap:16,padding:16,height:"82vh",boxSizing:"border-box"}},React.createElement(r,{defaultTheme:"light",chrome:!1,initialDiagram:p,style:{height:"100%",flex:1}}),React.createElement(r,{defaultTheme:"dark",chrome:!1,initialDiagram:p,style:{height:"100%",flex:1}}))},a={parameters:{layout:"fullscreen"},render:()=>React.createElement("div",{style:{padding:16,height:"82vh",boxSizing:"border-box"}},React.createElement(r,{defaultThemeId:"aws",initialDiagram:j,style:{height:"100%"}}))},i={parameters:{layout:"fullscreen"},render:()=>React.createElement("div",{style:{padding:16,height:"82vh",boxSizing:"border-box"}},React.createElement(r,{defaultThemeId:"blueprint",initialDiagram:G,style:{height:"100%"}}))},o={parameters:{layout:"fullscreen"},render:()=>React.createElement("div",{"data-editor-theme":"light",style:{padding:24,height:"82vh",boxSizing:"border-box",background:"var(--editor-bg)"}},React.createElement(B,{title:"Architecture Diagram",subtitle:"Devices, platform and bubble-tag arrows — Switchboard blueprint",footer:"Switchboard · isometric workflow editor",style:{height:"100%"}},React.createElement(r,{chrome:!1,defaultThemeId:"blueprint",initialDiagram:V,style:{height:"100%",border:"none",borderRadius:0,boxShadow:"none"}})))},n={parameters:{layout:"fullscreen"},render:()=>React.createElement("div",{style:{padding:24,height:"90vh",boxSizing:"border-box"}},React.createElement(r,{chrome:!1,defaultThemeId:"blueprint",initialDiagram:J,style:{height:"100%"}}))};var h,g,u;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  parameters: {
    layout: "fullscreen"
  },
  render: () => <div style={{
    display: "flex",
    gap: 16,
    padding: 16,
    height: "82vh",
    boxSizing: "border-box"
  }}>
      <IsometricWorkflowEditor defaultTheme="light" chrome={false} initialDiagram={branchingSampleDiagram} style={{
      height: "100%",
      flex: 1
    }} />
      <IsometricWorkflowEditor defaultTheme="dark" chrome={false} initialDiagram={branchingSampleDiagram} style={{
      height: "100%",
      flex: 1
    }} />
    </div>
}`,...(u=(g=s.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};var b,f,y,v,x;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  parameters: {
    layout: "fullscreen"
  },
  render: () => <div style={{
    padding: 16,
    height: "82vh",
    boxSizing: "border-box"
  }}>
      <IsometricWorkflowEditor defaultThemeId="aws" initialDiagram={awsWebHostingDiagram} style={{
      height: "100%"
    }} />
    </div>
}`,...(y=(f=a.parameters)==null?void 0:f.docs)==null?void 0:y.source},description:{story:"The built-in `aws` theme: white backdrop, matte-grey nodes, soft shadows,\n thick orange flow, translucent orange platform, 3D text + an edge label.",...(x=(v=a.parameters)==null?void 0:v.docs)==null?void 0:x.description}}};var w,S,D,E,k;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  parameters: {
    layout: "fullscreen"
  },
  render: () => <div style={{
    padding: 16,
    height: "82vh",
    boxSizing: "border-box"
  }}>
      <IsometricWorkflowEditor defaultThemeId="blueprint" initialDiagram={servicesFlowDiagram} style={{
      height: "100%"
    }} />
    </div>
}`,...(D=(S=i.parameters)==null?void 0:S.docs)==null?void 0:D.source},description:{story:'The Switchboard `blueprint` theme with the clean Service-flow example: bubble-tag\n labels (decluttered), bold-arrow connectors, paper backdrop, brand accents. This\n is what embeds on the /services "systematic approach" section.',...(k=(E=i.parameters)==null?void 0:E.docs)==null?void 0:k.description}}};var T,R,I,z,W;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  parameters: {
    layout: "fullscreen"
  },
  render: () => <div data-editor-theme="light" style={{
    padding: 24,
    height: "82vh",
    boxSizing: "border-box",
    background: "var(--editor-bg)"
  }}>
      <DiagramFrame title="Architecture Diagram" subtitle="Devices, platform and bubble-tag arrows — Switchboard blueprint" footer="Switchboard · isometric workflow editor" style={{
      height: "100%"
    }}>
        <IsometricWorkflowEditor chrome={false} defaultThemeId="blueprint" initialDiagram={architectureDeviceDiagram} style={{
        height: "100%",
        border: "none",
        borderRadius: 0,
        boxShadow: "none"
      }} />
      </DiagramFrame>
    </div>
}`,...(I=(R=o.parameters)==null?void 0:R.docs)==null?void 0:I.source},description:{story:`Phase 6: device nodes (browser/phone/monitor/laptop) around a server stack on a
 round platform, dashed corner-connect links + bubble-tag arrows, inside the
 titled DiagramFrame embed chrome — the architecture-reference look, Switchboard
 colors.`,...(W=(z=o.parameters)==null?void 0:z.docs)==null?void 0:W.description}}};var F,q,A,C,N;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`{
  parameters: {
    layout: "fullscreen"
  },
  render: () => <div style={{
    padding: 24,
    height: "90vh",
    boxSizing: "border-box"
  }}>
      <IsometricWorkflowEditor chrome={false} defaultThemeId="blueprint" initialDiagram={opsPillarDiagram} style={{
      height: "100%"
    }} />
    </div>
}`,...(A=(q=n.parameters)==null?void 0:q.docs)==null?void 0:A.source},description:{story:`A capabilities pillar (the reference "Operations Assurance") as stacked
 double-layer hex platforms: a 3D step-icon + label per stage, a left bubble
 tag, a right upright info-card, bold arrows + dashed links. This embeds on
 /services in each capability card.`,...(N=(C=n.parameters)==null?void 0:C.docs)==null?void 0:N.description}}};const ne=["SideBySide","AWS","Blueprint","Architecture","Capabilities"];export{a as AWS,o as Architecture,i as Blueprint,n as Capabilities,s as SideBySide,ne as __namedExportsOrder,oe as default};
