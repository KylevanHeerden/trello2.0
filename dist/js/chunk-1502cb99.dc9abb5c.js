(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1502cb99"],{"2bc5":function(t,e,a){"use strict";var r=a("5530"),s=(a("a15b"),a("abd3"),a("ade3")),i=a("1c87"),n=a("58df"),o=Object(n["a"])(i["a"]).extend({name:"v-breadcrumbs-item",props:{activeClass:{type:String,default:"v-breadcrumbs__item--disabled"},ripple:{type:[Boolean,Object],default:!1}},computed:{classes:function(){return Object(s["a"])({"v-breadcrumbs__item":!0},this.activeClass,this.disabled)}},render:function(t){var e=this.generateRouteLink(),a=e.tag,s=e.data;return t("li",[t(a,Object(r["a"])(Object(r["a"])({},s),{},{attrs:Object(r["a"])(Object(r["a"])({},s.attrs),{},{"aria-current":this.isActive&&this.isLink?"page":void 0})}),this.$slots.default)])}}),c=a("80d2"),l=Object(c["g"])("v-breadcrumbs__divider","li"),u=a("7560");e["a"]=Object(n["a"])(u["a"]).extend({name:"v-breadcrumbs",props:{divider:{type:String,default:"/"},items:{type:Array,default:function(){return[]}},large:Boolean},computed:{classes:function(){return Object(r["a"])({"v-breadcrumbs--large":this.large},this.themeClasses)}},methods:{genDivider:function(){return this.$createElement(l,this.$slots.divider?this.$slots.divider:this.divider)},genItems:function(){for(var t=[],e=!!this.$scopedSlots.item,a=[],r=0;r<this.items.length;r++){var s=this.items[r];a.push(s.text),e?t.push(this.$scopedSlots.item({item:s})):t.push(this.$createElement(o,{key:a.join("."),props:s},[s.text])),r<this.items.length-1&&t.push(this.genDivider())}return t}},render:function(t){var e=this.$slots.default||this.genItems();return t("ul",{staticClass:"v-breadcrumbs",class:this.classes},e)}})},3540:function(t,e,a){},"3a2f":function(t,e,a){"use strict";var r=a("ade3"),s=(a("a9e3"),a("9734"),a("4ad4")),i=a("a9ad"),n=a("16b7"),o=a("b848"),c=a("f573"),l=a("f2e7"),u=a("80d2"),d=a("d9bd"),h=a("58df");e["a"]=Object(h["a"])(i["a"],n["a"],o["a"],c["a"],l["a"]).extend({name:"v-tooltip",props:{closeDelay:{type:[Number,String],default:0},disabled:Boolean,fixed:{type:Boolean,default:!0},openDelay:{type:[Number,String],default:0},openOnHover:{type:Boolean,default:!0},tag:{type:String,default:"span"},transition:String},data:function(){return{calculatedMinWidth:0,closeDependents:!1}},computed:{calculatedLeft:function(){var t=this.dimensions,e=t.activator,a=t.content,r=!this.bottom&&!this.left&&!this.top&&!this.right,s=!1!==this.attach?e.offsetLeft:e.left,i=0;return this.top||this.bottom||r?i=s+e.width/2-a.width/2:(this.left||this.right)&&(i=s+(this.right?e.width:-a.width)+(this.right?10:-10)),this.nudgeLeft&&(i-=parseInt(this.nudgeLeft)),this.nudgeRight&&(i+=parseInt(this.nudgeRight)),"".concat(this.calcXOverflow(i,this.dimensions.content.width),"px")},calculatedTop:function(){var t=this.dimensions,e=t.activator,a=t.content,r=!1!==this.attach?e.offsetTop:e.top,s=0;return this.top||this.bottom?s=r+(this.bottom?e.height:-a.height)+(this.bottom?10:-10):(this.left||this.right)&&(s=r+e.height/2-a.height/2),this.nudgeTop&&(s-=parseInt(this.nudgeTop)),this.nudgeBottom&&(s+=parseInt(this.nudgeBottom)),"".concat(this.calcYOverflow(s+this.pageYOffset),"px")},classes:function(){return{"v-tooltip--top":this.top,"v-tooltip--right":this.right,"v-tooltip--bottom":this.bottom,"v-tooltip--left":this.left,"v-tooltip--attached":""===this.attach||!0===this.attach||"attach"===this.attach}},computedTransition:function(){return this.transition?this.transition:this.isActive?"scale-transition":"fade-transition"},offsetY:function(){return this.top||this.bottom},offsetX:function(){return this.left||this.right},styles:function(){return{left:this.calculatedLeft,maxWidth:Object(u["f"])(this.maxWidth),minWidth:Object(u["f"])(this.minWidth),opacity:this.isActive?.9:0,top:this.calculatedTop,zIndex:this.zIndex||this.activeZIndex}}},beforeMount:function(){var t=this;this.$nextTick((function(){t.value&&t.callActivate()}))},mounted:function(){"v-slot"===Object(u["o"])(this,"activator",!0)&&Object(d["b"])("v-tooltip's activator slot must be bound, try '<template #activator=\"data\"><v-btn v-on=\"data.on>'",this)},methods:{activate:function(){this.updateDimensions(),requestAnimationFrame(this.startTransition)},deactivate:function(){this.runDelay("close")},genActivatorListeners:function(){var t=this,e=s["a"].options.methods.genActivatorListeners.call(this);return e.focus=function(e){t.getActivator(e),t.runDelay("open")},e.blur=function(e){t.getActivator(e),t.runDelay("close")},e.keydown=function(e){e.keyCode===u["r"].esc&&(t.getActivator(e),t.runDelay("close"))},e},genActivatorAttributes:function(){return{"aria-haspopup":!0,"aria-expanded":String(this.isActive)}},genTransition:function(){var t=this.genContent();return this.computedTransition?this.$createElement("transition",{props:{name:this.computedTransition}},[t]):t},genContent:function(){var t;return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-tooltip__content",class:(t={},Object(r["a"])(t,this.contentClass,!0),Object(r["a"])(t,"menuable__content__active",this.isActive),Object(r["a"])(t,"v-tooltip__content--fixed",this.activatorFixed),t),style:this.styles,attrs:this.getScopeIdAttrs(),directives:[{name:"show",value:this.isContentActive}],ref:"content"}),this.getContentSlot())}},render:function(t){var e=this;return t(this.tag,{staticClass:"v-tooltip",class:this.classes},[this.showLazyContent((function(){return[e.genTransition()]})),this.genActivator()])}})},5142:function(t,e,a){},"841c":function(t,e,a){"use strict";var r=a("d784"),s=a("825a"),i=a("1d80"),n=a("129f"),o=a("14c3");r("search",1,(function(t,e,a){return[function(e){var a=i(this),r=void 0==e?void 0:e[t];return void 0!==r?r.call(e,a):new RegExp(e)[t](String(a))},function(t){var r=a(e,t,this);if(r.done)return r.value;var i=s(t),c=String(this),l=i.lastIndex;n(l,0)||(i.lastIndex=0);var u=o(i,c);return n(i.lastIndex,l)||(i.lastIndex=l),null===u?-1:u.index}]}))},"863e":function(t,e,a){"use strict";a("5142")},"8adc":function(t,e,a){},9734:function(t,e,a){},abd3:function(t,e,a){},cc20:function(t,e,a){"use strict";var r=a("3835"),s=a("5530"),i=(a("4de4"),a("8adc"),a("58df")),n=a("0789"),o=a("9d26"),c=a("a9ad"),l=a("4e82"),u=a("7560"),d=a("f2e7"),h=a("1c87"),p=a("af2b"),m=a("d9bd");e["a"]=Object(i["a"])(c["a"],p["a"],h["a"],u["a"],Object(l["a"])("chipGroup"),Object(d["b"])("inputValue")).extend({name:"v-chip",props:{active:{type:Boolean,default:!0},activeClass:{type:String,default:function(){return this.chipGroup?this.chipGroup.activeClass:""}},close:Boolean,closeIcon:{type:String,default:"$delete"},closeLabel:{type:String,default:"$vuetify.close"},disabled:Boolean,draggable:Boolean,filter:Boolean,filterIcon:{type:String,default:"$complete"},label:Boolean,link:Boolean,outlined:Boolean,pill:Boolean,tag:{type:String,default:"span"},textColor:String,value:null},data:function(){return{proxyClass:"v-chip--active"}},computed:{classes:function(){return Object(s["a"])(Object(s["a"])(Object(s["a"])(Object(s["a"])({"v-chip":!0},h["a"].options.computed.classes.call(this)),{},{"v-chip--clickable":this.isClickable,"v-chip--disabled":this.disabled,"v-chip--draggable":this.draggable,"v-chip--label":this.label,"v-chip--link":this.isLink,"v-chip--no-color":!this.color,"v-chip--outlined":this.outlined,"v-chip--pill":this.pill,"v-chip--removable":this.hasClose},this.themeClasses),this.sizeableClasses),this.groupClasses)},hasClose:function(){return Boolean(this.close)},isClickable:function(){return Boolean(h["a"].options.computed.isClickable.call(this)||this.chipGroup)}},created:function(){var t=this,e=[["outline","outlined"],["selected","input-value"],["value","active"],["@input","@active.sync"]];e.forEach((function(e){var a=Object(r["a"])(e,2),s=a[0],i=a[1];t.$attrs.hasOwnProperty(s)&&Object(m["a"])(s,i,t)}))},methods:{click:function(t){this.$emit("click",t),this.chipGroup&&this.toggle()},genFilter:function(){var t=[];return this.isActive&&t.push(this.$createElement(o["a"],{staticClass:"v-chip__filter",props:{left:!0}},this.filterIcon)),this.$createElement(n["b"],t)},genClose:function(){var t=this;return this.$createElement(o["a"],{staticClass:"v-chip__close",props:{right:!0,size:18},attrs:{"aria-label":this.$vuetify.lang.t(this.closeLabel)},on:{click:function(e){e.stopPropagation(),e.preventDefault(),t.$emit("click:close"),t.$emit("update:active",!1)}}},this.closeIcon)},genContent:function(){return this.$createElement("span",{staticClass:"v-chip__content"},[this.filter&&this.genFilter(),this.$slots.default,this.hasClose&&this.genClose()])}},render:function(t){var e=[this.genContent()],a=this.generateRouteLink(),r=a.tag,i=a.data;i.attrs=Object(s["a"])(Object(s["a"])({},i.attrs),{},{draggable:this.draggable?"true":void 0,tabindex:this.chipGroup&&!this.disabled?0:i.attrs.tabindex}),i.directives.push({name:"show",value:this.active}),i=this.setBackgroundColor(this.color,i);var n=this.textColor||this.outlined&&this.color;return t(r,this.setTextColor(n,i),e)}})},e486:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"dashboard"},[a("v-breadcrumbs",{attrs:{items:t.links,divider:"/"}}),a("v-row",{staticClass:"noMargin",attrs:{justify:"center"}},[a("v-col",{attrs:{cols:"12",md:"4"}},[a("v-text-field",{attrs:{label:"Search Products"},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1),a("v-col",{staticClass:"text-center",attrs:{cols:"12",md:"2"}},[a("v-progress-circular",{staticClass:"budgetCircle",attrs:{rotate:360,size:70,width:5,value:t.budgetPercentage,color:t.budgetColor}},[t._v(" "+t._s(t.budgetPercentage+"%")+" ")]),a("p",{staticClass:"caption"},[t._v("of budget used")])],1)],1),a("v-container",{attrs:{fluid:""}},[a("v-layout",{staticClass:"mb-3",attrs:{row:""}},[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on;return[a("v-btn",t._g({attrs:{small:"",text:"",color:"grey"},on:{click:function(e){return t.sortBy("name")}}},r),[a("v-icon",{attrs:{left:"",small:""}},[t._v("list")]),a("span",{staticClass:"caption text-lowercase"},[t._v("by product name")])],1)]}}])},[a("span",[t._v("Sort by product name")])]),a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on;return[a("v-btn",t._g({attrs:{small:"",text:"",color:"grey"},on:{click:function(e){return t.sortBy("updatedOn")}}},r),[a("v-icon",{attrs:{left:"",small:""}},[t._v("event")]),a("span",{staticClass:"caption text-lowercase"},[t._v("by product edit date")])],1)]}}])},[a("span",[t._v("Sort by product edit date")])]),a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on;return[a("v-btn",t._g({attrs:{small:"",text:"",color:"grey"},on:{click:t.sortByStatus}},r),[a("v-icon",{attrs:{left:"",small:""}},[t._v("person")]),a("span",{staticClass:"caption text-lowercase"},[t._v("By status")])],1)]}}])},[a("span",[t._v("Sort by status")])]),a("v-spacer"),a("v-btn",{attrs:{small:"",color:"primary",dark:"",href:t.programmeBoardLink}},[t._v("Programme Board")]),a("NewProduct",{attrs:{programme:t.programme}})],1)],1),a("v-container",{staticClass:"maxHeight",attrs:{fluid:""}},t._l(t.filteredSearchProducts,(function(e){return a("v-card",{key:e.id,staticClass:"pl-3 productCard",attrs:{id:"productCard",flat:""}},[a("router-link",{attrs:{to:{name:"Product",params:{id:e.id}}}},[a("v-row",{class:"pa-3 product "+e.status},[a("v-col",{staticClass:"col",attrs:{xs:"12",md:"6"}},[a("div",{staticClass:"caption grey--text"},[t._v("Product Name")]),a("div",{staticClass:"card-text-black"},[t._v(t._s(e.name))])]),a("v-col",{attrs:{xs:"6",sm:"4",md:"2"}},[a("div",{staticClass:"caption grey--text"},[t._v("Person")]),a("div",{staticClass:"card-text-black"},[t._v(t._s(e.person))])]),a("v-col",{attrs:{xs:"6",sm:"4",md:"2"}},[a("div",{staticClass:"caption grey--text"},[t._v("Edit date")]),a("div",{staticClass:"card-text-black"},[t._v(" "+t._s(t.dateOnly(e.updatedOn))+" ")])]),a("v-col",{attrs:{xs:"2",sm:"4",md:"2"}},[a("v-chip",{class:e.status+" white--text caption my-2 fixedSize justify-center",attrs:{small:"",color:""+t.chipColor(e.status)}},[t._v(" "+t._s(e.status)+" ")])],1)],1),a("v-divider")],1)],1)})),1)],1)},s=[],i=(a("b680"),a("4de4"),a("b0c0"),a("ac1f"),a("466d"),a("841c"),function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-dialog",{attrs:{persistent:"","max-width":"600px"},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on,s=e.attrs;return[a("v-btn",t._g(t._b({staticClass:"mx-8",attrs:{elevation:"2",small:"",dark:"",color:"primary"}},"v-btn",s,!1),r),[a("v-icon",{attrs:{dark:""}},[t._v(" mdi-plus ")]),t._v(" Add Product ")],1)]}}]),model:{value:t.newProductDialog,callback:function(e){t.newProductDialog=e},expression:"newProductDialog"}},[a("v-card",[a("v-card-title",{staticClass:"headline backgroundColorPrimary"},[t._v(" New Product ")]),a("v-card-text",{staticClass:"mt-6"},[a("v-form",{ref:"form",staticClass:"px-3"},[a("v-row",[a("v-col",{attrs:{cols:"12",sm:"6",md:"6"}},[a("v-text-field",{attrs:{label:"User",readonly:""},model:{value:t.nameSurname,callback:function(e){t.nameSurname=e},expression:"nameSurname"}})],1),a("v-col",{attrs:{cols:"12",sm:"6",md:"6"}},[a("v-text-field",{attrs:{label:"Programme",readonly:""},model:{value:t.newProduct.programme_name,callback:function(e){t.$set(t.newProduct,"programme_name",e)},expression:"newProduct.programme_name"}})],1),a("v-row",[a("v-col",{attrs:{cols:"12"}},[a("v-text-field",{attrs:{label:"Product Name",rules:t.inputRules},model:{value:t.newProduct.name,callback:function(e){t.$set(t.newProduct,"name",e)},expression:"newProduct.name"}})],1)],1)],1)],1)],1),a("v-card-actions",[a("v-spacer"),t.loading?t._e():a("v-btn",{attrs:{color:"blue-grey darken-3",text:""},on:{click:function(e){t.newProductDialog=!1}}},[t._v(" Cancel ")]),a("v-btn",{attrs:{color:"blue-grey darken-3",text:"",loading:t.loading},on:{click:t.submit}},[t._v(" Add ")])],1)],1)],1)}),n=[],o=a("1da1"),c=(a("96cf"),a("dc59")),l={props:{programme:{type:Object,required:!0}},data:function(){return{newProductDialog:!1,loading:!1,newProduct:{name:"",programme_id:this.programme.id,programme_name:this.programme.name,status:"Quotes"},inputRules:[function(t){return t.length>=3||"Minimum length is 3 characters"}]}},methods:{submit:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var a,r,s,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t.$refs.form.validate()){e.next=18;break}return t.loading=!0,e.next=4,c["d"].collection("products").add({});case 4:return a=e.sent,r={name:t.newProduct.name,programme:{programme_id:t.newProduct.programme_id,programme_name:t.newProduct.programme_name},status:"Quotes",person:t.currentUser.name+" "+t.currentUser.surname,cards:[],createdOn:new Date,updatedOn:new Date},c["d"].collection("products").doc(a.id).set(r),e.next=9,c["d"].collection("programmes").doc(t.newProduct.programme_id).get();case 9:s=e.sent,i=s.data(),i.products.push({product_name:t.newProduct.name,product_id:a.id}),c["d"].collection("programmes").doc(s.id).set(i),t.loading=!1,t.newProduct.name="",t.newProduct.status="",t.newProduct.person="",t.newProductDialog=!1;case 18:case"end":return e.stop()}}),e)})))()}},computed:{currentUser:function(){var t=this.$store.getters.getUserProfile;return t},nameSurname:function(){return this.currentUser.name+" "+this.currentUser.surname}},mounted:function(){this.$store.dispatch("getUsers")}},u=l,d=(a("863e"),a("2877")),h=a("6544"),p=a.n(h),m=a("8336"),v=a("b0af"),f=a("99d9"),g=a("62ad"),b=a("169a"),C=a("4bd4"),x=a("132d"),_=a("0fd9"),y=a("2fa4"),w=a("8654"),P=Object(d["a"])(u,i,n,!1,null,"4e48036e",null),k=P.exports;p()(P,{VBtn:m["a"],VCard:v["a"],VCardActions:f["a"],VCardText:f["c"],VCardTitle:f["d"],VCol:g["a"],VDialog:b["a"],VForm:C["a"],VIcon:x["a"],VRow:_["a"],VSpacer:y["a"],VTextField:w["a"]});var O={components:{NewProduct:k},data:function(){return{search:""}},methods:{chipColor:function(t){var e={Quotes:"teal lighten-1",Technical:"amber accent-2",Purchase:"orange",Procurement:"red",Waiting:"light-green lighten-1",Quality:"indigo lighten-1"};return"".concat(e[t])},sortBy:function(t){this.products.sort((function(e,a){return e[t]<a[t]?-1:1}))},sortByStatus:function(){for(var t={},e=["Quotes","Technical","Purchase","Procurement","Waiting","Quality"],a=0;a<e.length;a++)t[e[a]]=a;this.products.sort((function(e,a){return t[e.status]-t[a.status]}))},dateOnly:function(t){var e=new Date(1e3*t.seconds),a=e.getDate(),r=e.getMonth()+1,s=e.getFullYear(),i=s+"-"+r+"-"+a;return i}},computed:{fetchedProgrammeId:function(){var t=this.$route.params.id;return t},programmeBoardLink:function(){var t="/programme_board/".concat(this.fetchedProgrammeId);return t},products:function(){var t=this.$store.getters.getProducts;return t},programme:function(){var t=this.$store.getters.getProgrammeById(this.fetchedProgrammeId);return t},budgetPercentage:function(){var t=parseFloat(this.programme.total)/parseFloat(this.programme.budget)*100;return t.toFixed(2)},budgetColor:function(){if(this.budgetPercentage>90){var t="#B71C1C";return t}var e="#37474f";return e},filteredProducts:function(){var t=this,e=this.products.filter((function(e){return e.programme.programme_id===t.fetchedProgrammeId}));return e},filteredSearchProducts:function(){var t=this;return this.filteredProducts.filter((function(e){var a=e.name;if(a.toLowerCase().match(t.search.toLowerCase()))return e}))},links:function(){return[{text:"Programmes",to:"/"},{text:"".concat(this.programme.name),to:"/programme/"+"".concat(this.fetchedProgrammeId)}]}},created:function(){this.$store.dispatch("getProducts"),this.$store.dispatch("getProgrammes")}},S=O,j=(a("eba9"),a("2bc5")),$=a("cc20"),B=a("a523"),V=a("ce7e"),I=a("a722"),D=a("490a"),A=a("3a2f"),T=Object(d["a"])(S,r,s,!1,null,"51a4f07d",null);e["default"]=T.exports;p()(T,{VBreadcrumbs:j["a"],VBtn:m["a"],VCard:v["a"],VChip:$["a"],VCol:g["a"],VContainer:B["a"],VDivider:V["a"],VIcon:x["a"],VLayout:I["a"],VProgressCircular:D["a"],VRow:_["a"],VSpacer:y["a"],VTextField:w["a"],VTooltip:A["a"]})},eba9:function(t,e,a){"use strict";a("3540")}}]);
//# sourceMappingURL=chunk-1502cb99.dc9abb5c.js.map