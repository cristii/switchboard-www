import{N as a}from"./NodePalette-Dgw5_nie.js";import"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./useWorkflowStore-B5i6O06S.js";import"./NodeGlyph-Ds_AotSp.js";const v={title:"Editor/Panels/NodePalette",component:a,parameters:{layout:"centered"},args:{onAdd:()=>{}}};function i({theme:e,children:l}){return React.createElement("div",{"data-editor-theme":e,style:{width:240,height:560,border:"1.5px solid var(--editor-border-soft)",borderRadius:"var(--r-lg, 18px)",overflow:"hidden",background:"var(--editor-bg)"}},l)}const r={render:e=>React.createElement(i,{theme:"light"},React.createElement(a,{...e,style:{height:"100%"}}))},t={render:e=>React.createElement(i,{theme:"dark"},React.createElement(a,{...e,style:{height:"100%"}}))};var o,s,d;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: args => <Frame theme="light">
      <NodePalette {...args} style={{
      height: "100%"
    }} />
    </Frame>
}`,...(d=(s=r.parameters)==null?void 0:s.docs)==null?void 0:d.source}}};var n,m,c;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: args => <Frame theme="dark">
      <NodePalette {...args} style={{
      height: "100%"
    }} />
    </Frame>
}`,...(c=(m=t.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};const y=["Light","Dark"];export{t as Dark,r as Light,y as __namedExportsOrder,v as default};
