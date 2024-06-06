"use strict";(self.webpackChunk_rjsf_docs=self.webpackChunk_rjsf_docs||[]).push([[7744],{3636:(e,n,r)=>{r.d(n,{Iu:()=>d,yg:()=>u});var t=r(5668);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function o(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var c=t.createContext({}),p=function(e){var n=t.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):o(o({},n),e)),r},d=function(e){var n=p(e.components);return t.createElement(c.Provider,{value:n},e.children)},f="mdxType",l={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},m=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),f=p(r),m=i,u=f["".concat(c,".").concat(m)]||f[m]||l[m]||a;return r?t.createElement(u,o(o({ref:n},d),{},{components:r})):t.createElement(u,o({ref:n},d))}));function u(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=m;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s[f]="string"==typeof e?e:i,o[1]=s;for(var p=2;p<a;p++)o[p]=r[p];return t.createElement.apply(null,o)}return t.createElement.apply(null,r)}m.displayName="MDXCreateElement"},6467:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>l,frontMatter:()=>a,metadata:()=>s,toc:()=>p});var t=r(5307),i=(r(5668),r(3636));const a={},o="Schema definitions and references",s={unversionedId:"usage/definitions",id:"version-4.2.3/usage/definitions",title:"Schema definitions and references",description:"This library partially supports inline schema definition dereferencing, which is Barbarian for avoiding to copy and paste commonly used field schemas:",source:"@site/versioned_docs/version-4.2.3/usage/definitions.md",sourceDirName:"usage",slug:"/usage/definitions",permalink:"/react-jsonschema-form/docs/version-4.2.3/usage/definitions",draft:!1,editUrl:"https://github.com/rjsf-team/react-jsonschema-form/tree/main/packages/docs/versioned_docs/version-4.2.3/usage/definitions.md",tags:[],version:"4.2.3",frontMatter:{},sidebar:"docs",previous:{title:"Arrays",permalink:"/react-jsonschema-form/docs/version-4.2.3/usage/arrays"},next:{title:"Dependencies",permalink:"/react-jsonschema-form/docs/version-4.2.3/usage/dependencies"}},c={},p=[],d={toc:p},f="wrapper";function l(e){let{components:n,...r}=e;return(0,i.yg)(f,(0,t.c)({},d,r,{components:n,mdxType:"MDXLayout"}),(0,i.yg)("h1",{id:"schema-definitions-and-references"},"Schema definitions and references"),(0,i.yg)("p",null,"This library partially supports ",(0,i.yg)("a",{parentName:"p",href:"http://json-schema.org/draft/2019-09/json-schema-core.html#ref"},"inline schema definition dereferencing"),", which is Barbarian for ",(0,i.yg)("em",{parentName:"p"},"avoiding to copy and paste commonly used field schemas"),":"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-jsx"},'const schema = {\n  "definitions": {\n    "address": {\n      "type": "object",\n      "properties": {\n        "street_address": { "type": "string" },\n        "city":           { "type": "string" },\n        "state":          { "type": "string" }\n      },\n      "required": ["street_address", "city", "state"]\n    }\n  },\n  "type": "object",\n  "properties": {\n    "billing_address": { "$ref": "#/definitions/address" },\n    "shipping_address": { "$ref": "#/definitions/address" }\n  }\n};\n\nrender((\n  <Form schema={schema} />\n), document.getElementById("app"));\n')),(0,i.yg)("p",null,"Note that this library only supports local definition referencing. The value in the ",(0,i.yg)("inlineCode",{parentName:"p"},"$ref")," keyword should be a ",(0,i.yg)("a",{parentName:"p",href:"https://tools.ietf.org/html/rfc6901"},"JSON Pointer")," in URI fragment identifier format."))}l.isMDXComponent=!0}}]);