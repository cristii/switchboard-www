import{I as p}from"./IsometricWorkflowEditor-CPUPkXm5.js";import{b as g}from"./sampleDiagram-DEqWJYHz.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./jsx-runtime-BYYWji4R.js";import"./Inspector-p7jQkFV7.js";import"./index-Brl4xq4Y.js";import"./Select-CS94AYgU.js";import"./IconButton-BRTUtk6P.js";import"./NodeGlyph-Ds_AotSp.js";import"./useWorkflowStore-B5i6O06S.js";import"./NodePalette-Dgw5_nie.js";import"./Toolbar-DN-GRkP-.js";const O={title:"Editor/Edges",component:p,parameters:{layout:"fullscreen"},args:{defaultTheme:"light",style:{height:"82vh"}}},a={args:{initialDiagram:g}},u={version:1,nodes:[{id:"a1",kind:"action",label:"Orthogonal",x:-5,y:-3},{id:"a2",kind:"database",label:"Target",x:-5,y:3},{id:"b1",kind:"action",label:"Smooth",x:0,y:-3},{id:"b2",kind:"database",label:"Target",x:0,y:3},{id:"c1",kind:"action",label:"Direct (dashed)",x:5,y:-3},{id:"c2",kind:"database",label:"Target",x:5,y:3}],edges:[{id:"r1",source:"a1",target:"a2",routing:"orthogonal",label:"orthogonal"},{id:"r2",source:"b1",target:"b2",routing:"smooth",label:"smooth"},{id:"r3",source:"c1",target:"c2",routing:"direct",style:"dashed",label:"direct"}]},r={args:{initialDiagram:u}},e={args:{initialDiagram:g,defaultTheme:"dark"}};var t,i,o;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    initialDiagram: branchingSampleDiagram
  }
}`,...(o=(i=a.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};var s,n,m;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    initialDiagram: routingStyles
  }
}`,...(m=(n=r.parameters)==null?void 0:n.docs)==null?void 0:m.source}}};var l,d,c;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    initialDiagram: branchingSampleDiagram,
    defaultTheme: "dark"
  }
}`,...(c=(d=e.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};const R=["Branching","RoutingStyles","Dark"];export{a as Branching,e as Dark,r as RoutingStyles,R as __namedExportsOrder,O as default};
