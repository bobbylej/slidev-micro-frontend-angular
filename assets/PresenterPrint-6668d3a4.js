import{h as d,j as _,k as p,ak as u,c as m,al as h,m as n,am as t,an as o,z as s,F as f,ao as g,ap as v,aq as x,q as r,ar as y,as as k,n as b,at as N,au as P,_ as S}from"./nav-526f890e.js";import{N as w}from"./NoteDisplay-e0485d8d.js";import{u as z}from"./index-d266b875.js";const D={class:"m-4"},V={class:"mb-10"},j={class:"text-4xl font-bold mt-2"},L={class:"opacity-50"},T={class:"text-lg"},B={class:"font-bold flex gap-2"},C={class:"opacity-50"},H=t("div",{class:"flex-auto"},null,-1),M={key:0,class:"border-gray-400/50 mb-8"},q=d({__name:"PresenterPrint",setup(F){_(p),u(`
@page {
  size: A4;
  margin-top: 1.5cm;
  margin-bottom: 1cm;
}
* {
  -webkit-print-color-adjust: exact;
}
html,
html body,
html #app,
html #page-root {
  height: auto;
  overflow: auto !important;
}
`),z({title:`Notes - ${m.title}`});const i=h(()=>x.slice(0,-1).map(a=>{var l;return(l=a.meta)==null?void 0:l.slide}).filter(a=>a!==void 0&&a.noteHTML!==""));return(a,l)=>(r(),n("div",{id:"page-root",style:v(s(P))},[t("div",D,[t("div",V,[t("h1",j,o(s(m).title),1),t("div",L,o(new Date().toLocaleString()),1)]),(r(!0),n(f,null,g(s(i),(e,c)=>(r(),n("div",{key:c,class:"flex flex-col gap-4 break-inside-avoid-page"},[t("div",null,[t("h2",T,[t("div",B,[t("div",C,o(e==null?void 0:e.no)+"/"+o(s(y)),1),k(" "+o(e==null?void 0:e.title)+" ",1),H])]),b(w,{"note-html":e.noteHTML,class:"max-w-full"},null,8,["note-html"])]),c<s(i).length-1?(r(),n("hr",M)):N("v-if",!0)]))),128))])],4))}}),R=S(q,[["__file","/Users/mateuszadamczyk/Documents/Monterail/Workspace/SelfDevelopment/slidev-micro-frontend-angular/node_modules/@slidev/client/internals/PresenterPrint.vue"]]);export{R as default};
