import{r as e}from"./index-ClcD9ViR.js";import"./_commonjsHelpers-Cpj98o6Y.js";function l({theme:s,onToggle:i,onDark:r=!1,style:d={},...I}){const c=s==="dark";return e.createElement("button",{type:"button","aria-label":c?"Switch to light theme":"Switch to dark theme","aria-pressed":c,onClick:i,style:{display:"inline-grid",placeItems:"center",height:40,width:40,padding:0,borderRadius:"var(--r-sm, 9px)",border:`var(--bw, 1.5px) solid ${r?"var(--on-dark-line-2)":"var(--ink)"}`,background:r?"transparent":"var(--white)",color:r?"var(--on-dark)":"var(--ink)",boxShadow:r?"none":"var(--shadow-btn-ghost, 3px 3px 0 rgba(var(--shadow-ink),.18))",cursor:"pointer",transition:"transform var(--dur-fast,.12s) ease, box-shadow var(--dur-fast,.12s) ease",...d},...I},c?e.createElement("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"},e.createElement("circle",{cx:"12",cy:"12",r:"4.2"}),e.createElement("path",{d:"M12 2.6v2.4M12 19v2.4M21.4 12H19M5 12H2.6M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7L17 17M7 7L5.3 5.3"})):e.createElement("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"},e.createElement("path",{d:"M20 14.2A8 8 0 1 1 9.8 4a6.4 6.4 0 0 0 10.2 10.2Z"})))}l.__docgenInfo={description:`Site light/dark switch: an ink-outlined square button with the brand's hard
offset shadow, showing a bespoke sun (in dark mode → "switch to light") or
moon (in light mode → "switch to dark"). No third-party icons, no emoji.
Presentational — wire it to the \`useTheme\` hook at the call site.`,methods:[],displayName:"ThemeToggle",props:{theme:{required:!0,tsType:{name:"union",raw:'"light" | "dark"',elements:[{name:"literal",value:'"light"'},{name:"literal",value:'"dark"'}]},description:"The currently active theme."},onToggle:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:"Flip to the other theme."},onDark:{required:!1,tsType:{name:"boolean"},description:"Sit on a dark band (footer): swaps the outline/fill to the on-dark set.",defaultValue:{value:"false",computed:!1}},style:{defaultValue:{value:"{}",computed:!1},required:!1}},composes:["Omit"]};const _={title:"Core/ThemeToggle",component:l,tags:["autodocs"],parameters:{docs:{description:{component:"Site light/dark switch: ink-outlined square with the brand's hard offset shadow, showing a bespoke sun (in dark mode) or moon (in light mode). Presentational — in the app it's wired to the `useTheme` hook in the header and mobile menu."}}},args:{theme:"light",onToggle:()=>{}},argTypes:{theme:{control:"inline-radio",options:["light","dark"]},onDark:{control:"boolean"}}},t={},a={args:{theme:"dark"},parameters:{backgrounds:{default:"dark"}}},o={args:{theme:"light",onDark:!0},parameters:{backgrounds:{default:"dark"}},decorators:[s=>React.createElement("div",{style:{background:"var(--dark)",padding:28,borderRadius:14}},React.createElement(s,null))]},n={render:function(){const[i,r]=e.useState("light");return React.createElement(l,{theme:i,onToggle:()=>r(d=>d==="dark"?"light":"dark")})}};var h,m,u,p,g;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:"{}",...(u=(m=t.parameters)==null?void 0:m.docs)==null?void 0:u.source},description:{story:'Light mode shows the moon ("switch to dark").',...(g=(p=t.parameters)==null?void 0:p.docs)==null?void 0:g.description}}};var k,f,w,v,b;a.parameters={...a.parameters,docs:{...(k=a.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    theme: "dark"
  },
  parameters: {
    backgrounds: {
      default: "dark"
    }
  }
}`,...(w=(f=a.parameters)==null?void 0:f.docs)==null?void 0:w.source},description:{story:'Dark mode shows the sun ("switch to light").',...(b=(v=a.parameters)==null?void 0:v.docs)==null?void 0:b.description}}};var T,y,S,x,E;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    theme: "light",
    onDark: true
  },
  parameters: {
    backgrounds: {
      default: "dark"
    }
  },
  decorators: [Story => <div style={{
    background: "var(--dark)",
    padding: 28,
    borderRadius: 14
  }}>
        <Story />
      </div>]
}`,...(S=(y=o.parameters)==null?void 0:y.docs)==null?void 0:S.source},description:{story:"On a dark band (footer): transparent fill, on-dark outline.",...(E=(x=o.parameters)==null?void 0:x.docs)==null?void 0:E.description}}};var L,M,R,D,q;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`{
  render: function Render() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    return <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === "dark" ? "light" : "dark")} />;
  }
}`,...(R=(M=n.parameters)==null?void 0:M.docs)==null?void 0:R.source},description:{story:"Interactive: click to flip between sun and moon.",...(q=(D=n.parameters)==null?void 0:D.docs)==null?void 0:q.description}}};const j=["Light","Dark","OnDark","Interactive"];export{a as Dark,n as Interactive,t as Light,o as OnDark,j as __namedExportsOrder,_ as default};
