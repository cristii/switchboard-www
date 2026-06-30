import{r}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function n({children:a,color:p="var(--orange)",weight:m=7,style:h={}}){return r.createElement("span",{style:{position:"relative",whiteSpace:"nowrap",...h}},a,r.createElement("svg",{viewBox:"0 0 300 20",preserveAspectRatio:"none","aria-hidden":"true",style:{position:"absolute",left:"-2%",bottom:"-0.32em",width:"104%",height:"0.45em",overflow:"visible"}},r.createElement("path",{d:"M4 14 C 60 6, 120 18, 180 9 S 280 6, 296 12",fill:"none",stroke:p,strokeWidth:m,strokeLinecap:"round"})))}n.__docgenInfo={description:`Wraps inline text with the brand's wobbly hand-drawn underline stroke, the
signature emphasis device. Use on a single emphasized phrase inside a heading
or eyebrow, never a whole sentence.`,methods:[],displayName:"HandUnderline",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},color:{required:!1,tsType:{name:"string"},description:'Stroke color. @default "var(--orange)"',defaultValue:{value:'"var(--orange)"',computed:!1}},weight:{required:!1,tsType:{name:"number"},description:"Stroke width in SVG units. @default 7",defaultValue:{value:"7",computed:!1}},style:{required:!1,tsType:{name:"ReactCSSProperties",raw:"React.CSSProperties"},description:"",defaultValue:{value:"{}",computed:!1}}}};const f={title:"Core/HandUnderline",component:n,tags:["autodocs"],parameters:{docs:{description:{component:"Wraps inline text with the brand's wobbly hand-drawn underline. Use on a single emphasized phrase inside a heading or eyebrow, never a whole sentence."}}},args:{children:"Chat with it.",weight:7},argTypes:{color:{control:"color"},weight:{control:{type:"range",min:2,max:12,step:1}}}},e={},t={render:a=>React.createElement("h1",{style:{fontFamily:"var(--font-display)",fontWeight:800,fontSize:"clamp(2rem, 5vw, 3.4rem)",lineHeight:1.04,letterSpacing:"-.02em",margin:0}},"Don't read about my service."," ",React.createElement("span",{style:{color:"var(--orange)"}},React.createElement(n,{...a},"Chat with it.")))};var o,i,s;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:"{}",...(s=(i=e.parameters)==null?void 0:i.docs)==null?void 0:s.source}}};var l,d,c;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: args => <h1 style={{
    fontFamily: "var(--font-display)",
    fontWeight: 800,
    fontSize: "clamp(2rem, 5vw, 3.4rem)",
    lineHeight: 1.04,
    letterSpacing: "-.02em",
    margin: 0
  }}>
      Don&apos;t read about my service.{" "}
      <span style={{
      color: "var(--orange)"
    }}>
        <HandUnderline {...args}>Chat with it.</HandUnderline>
      </span>
    </h1>
}`,...(c=(d=t.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};const w=["Default","InAHeading"];export{e as Default,t as InAHeading,w as __namedExportsOrder,f as default};
