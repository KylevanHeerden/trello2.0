(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-a43ad3b8"],{"0393":function(e,t,a){"use strict";var s=a("5530"),r=(a("0481"),a("210b"),a("604c")),n=a("d9bd");t["a"]=r["a"].extend({name:"v-expansion-panels",provide:function(){return{expansionPanels:this}},props:{accordion:Boolean,disabled:Boolean,flat:Boolean,hover:Boolean,focusable:Boolean,inset:Boolean,popout:Boolean,readonly:Boolean,tile:Boolean},computed:{classes:function(){return Object(s["a"])(Object(s["a"])({},r["a"].options.computed.classes.call(this)),{},{"v-expansion-panels":!0,"v-expansion-panels--accordion":this.accordion,"v-expansion-panels--flat":this.flat,"v-expansion-panels--hover":this.hover,"v-expansion-panels--focusable":this.focusable,"v-expansion-panels--inset":this.inset,"v-expansion-panels--popout":this.popout,"v-expansion-panels--tile":this.tile})}},created:function(){this.$attrs.hasOwnProperty("expand")&&Object(n["a"])("expand","multiple",this),Array.isArray(this.value)&&this.value.length>0&&"boolean"===typeof this.value[0]&&Object(n["a"])(':value="[true, false, true]"',':value="[0, 2]"',this)},methods:{updateItem:function(e,t){var a=this.getValue(e,t),s=this.getValue(e,t+1);e.isActive=this.toggleMethod(a),e.nextIsActive=this.toggleMethod(s)}}})},"210b":function(e,t,a){},"2bc5":function(e,t,a){"use strict";var s=a("5530"),r=(a("a15b"),a("abd3"),a("ade3")),n=a("1c87"),i=a("58df"),o=Object(i["a"])(n["a"]).extend({name:"v-breadcrumbs-item",props:{activeClass:{type:String,default:"v-breadcrumbs__item--disabled"},ripple:{type:[Boolean,Object],default:!1}},computed:{classes:function(){return Object(r["a"])({"v-breadcrumbs__item":!0},this.activeClass,this.disabled)}},render:function(e){var t=this.generateRouteLink(),a=t.tag,r=t.data;return e("li",[e(a,Object(s["a"])(Object(s["a"])({},r),{},{attrs:Object(s["a"])(Object(s["a"])({},r.attrs),{},{"aria-current":this.isActive&&this.isLink?"page":void 0})}),this.$slots.default)])}}),c=a("80d2"),l=Object(c["h"])("v-breadcrumbs__divider","li"),m=a("7560");t["a"]=Object(i["a"])(m["a"]).extend({name:"v-breadcrumbs",props:{divider:{type:String,default:"/"},items:{type:Array,default:function(){return[]}},large:Boolean},computed:{classes:function(){return Object(s["a"])({"v-breadcrumbs--large":this.large},this.themeClasses)}},methods:{genDivider:function(){return this.$createElement(l,this.$slots.divider?this.$slots.divider:this.divider)},genItems:function(){for(var e=[],t=!!this.$scopedSlots.item,a=[],s=0;s<this.items.length;s++){var r=this.items[s];a.push(r.text),t?e.push(this.$scopedSlots.item({item:r})):e.push(this.$createElement(o,{key:a.join("."),props:r},[r.text])),s<this.items.length-1&&e.push(this.genDivider())}return e}},render:function(e){var t=this.$slots.default||this.genItems();return e("ul",{staticClass:"v-breadcrumbs",class:this.classes},t)}})},3040:function(e,t,a){"use strict";a("3ef1")},"3a2f":function(e,t,a){"use strict";var s=a("ade3"),r=(a("a9e3"),a("9734"),a("4ad4")),n=a("a9ad"),i=a("16b7"),o=a("b848"),c=a("f573"),l=a("f2e7"),m=a("80d2"),u=a("d9bd"),p=a("58df");t["a"]=Object(p["a"])(n["a"],i["a"],o["a"],c["a"],l["a"]).extend({name:"v-tooltip",props:{closeDelay:{type:[Number,String],default:0},disabled:Boolean,fixed:{type:Boolean,default:!0},openDelay:{type:[Number,String],default:0},openOnHover:{type:Boolean,default:!0},tag:{type:String,default:"span"},transition:String},data:function(){return{calculatedMinWidth:0,closeDependents:!1}},computed:{calculatedLeft:function(){var e=this.dimensions,t=e.activator,a=e.content,s=!this.bottom&&!this.left&&!this.top&&!this.right,r=!1!==this.attach?t.offsetLeft:t.left,n=0;return this.top||this.bottom||s?n=r+t.width/2-a.width/2:(this.left||this.right)&&(n=r+(this.right?t.width:-a.width)+(this.right?10:-10)),this.nudgeLeft&&(n-=parseInt(this.nudgeLeft)),this.nudgeRight&&(n+=parseInt(this.nudgeRight)),"".concat(this.calcXOverflow(n,this.dimensions.content.width),"px")},calculatedTop:function(){var e=this.dimensions,t=e.activator,a=e.content,s=!1!==this.attach?t.offsetTop:t.top,r=0;return this.top||this.bottom?r=s+(this.bottom?t.height:-a.height)+(this.bottom?10:-10):(this.left||this.right)&&(r=s+t.height/2-a.height/2),this.nudgeTop&&(r-=parseInt(this.nudgeTop)),this.nudgeBottom&&(r+=parseInt(this.nudgeBottom)),"".concat(this.calcYOverflow(r+this.pageYOffset),"px")},classes:function(){return{"v-tooltip--top":this.top,"v-tooltip--right":this.right,"v-tooltip--bottom":this.bottom,"v-tooltip--left":this.left,"v-tooltip--attached":""===this.attach||!0===this.attach||"attach"===this.attach}},computedTransition:function(){return this.transition?this.transition:this.isActive?"scale-transition":"fade-transition"},offsetY:function(){return this.top||this.bottom},offsetX:function(){return this.left||this.right},styles:function(){return{left:this.calculatedLeft,maxWidth:Object(m["f"])(this.maxWidth),minWidth:Object(m["f"])(this.minWidth),opacity:this.isActive?.9:0,top:this.calculatedTop,zIndex:this.zIndex||this.activeZIndex}}},beforeMount:function(){var e=this;this.$nextTick((function(){e.value&&e.callActivate()}))},mounted:function(){"v-slot"===Object(m["p"])(this,"activator",!0)&&Object(u["b"])("v-tooltip's activator slot must be bound, try '<template #activator=\"data\"><v-btn v-on=\"data.on>'",this)},methods:{activate:function(){this.updateDimensions(),requestAnimationFrame(this.startTransition)},deactivate:function(){this.runDelay("close")},genActivatorListeners:function(){var e=this,t=r["a"].options.methods.genActivatorListeners.call(this);return t.focus=function(t){e.getActivator(t),e.runDelay("open")},t.blur=function(t){e.getActivator(t),e.runDelay("close")},t.keydown=function(t){t.keyCode===m["s"].esc&&(e.getActivator(t),e.runDelay("close"))},t},genActivatorAttributes:function(){return{"aria-haspopup":!0,"aria-expanded":String(this.isActive)}},genTransition:function(){var e=this.genContent();return this.computedTransition?this.$createElement("transition",{props:{name:this.computedTransition}},[e]):e},genContent:function(){var e;return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-tooltip__content",class:(e={},Object(s["a"])(e,this.contentClass,!0),Object(s["a"])(e,"menuable__content__active",this.isActive),Object(s["a"])(e,"v-tooltip__content--fixed",this.activatorFixed),e),style:this.styles,attrs:this.getScopeIdAttrs(),directives:[{name:"show",value:this.isContentActive}],ref:"content"}),this.getContentSlot())}},render:function(e){var t=this;return e(this.tag,{staticClass:"v-tooltip",class:this.classes},[this.showLazyContent((function(){return[t.genTransition()]})),this.genActivator()])}})},"3ef1":function(e,t,a){},"49e2":function(e,t,a){"use strict";var s=a("0789"),r=a("9d65"),n=a("a9ad"),i=a("3206"),o=a("80d2"),c=a("58df"),l=Object(c["a"])(r["a"],n["a"],Object(i["a"])("expansionPanel","v-expansion-panel-content","v-expansion-panel"));t["a"]=l.extend().extend({name:"v-expansion-panel-content",computed:{isActive:function(){return this.expansionPanel.isActive}},created:function(){this.expansionPanel.registerContent(this)},beforeDestroy:function(){this.expansionPanel.unregisterContent()},render:function(e){var t=this;return e(s["a"],this.showLazyContent((function(){return[e("div",t.setBackgroundColor(t.color,{staticClass:"v-expansion-panel-content",directives:[{name:"show",value:t.isActive}]}),[e("div",{class:"v-expansion-panel-content__wrap"},Object(o["o"])(t))])]})))}})},7277:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"dashboard"},[a("v-breadcrumbs",{attrs:{items:e.links,divider:"/"}}),a("v-container",{staticClass:"my-5 mx-3"},[a("v-layout",{staticClass:"mb-3",attrs:{row:""}},[a("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(t){var s=t.on;return[a("v-btn",e._g({attrs:{small:"",text:"",color:"grey"},on:{click:function(t){return e.sortBy("name")}}},s),[a("v-icon",{attrs:{left:"",small:""}},[e._v("folder")]),a("span",{staticClass:"caption text-lowercase"},[e._v("by programme name")])],1)]}}])},[a("span",[e._v("Sort by project name")])]),a("v-tooltip",{attrs:{top:""},scopedSlots:e._u([{key:"activator",fn:function(t){var s=t.on;return[a("v-btn",e._g({attrs:{small:"",text:"",color:"grey"},on:{click:function(t){return e.sortBy("team")}}},s),[a("v-icon",{attrs:{left:"",small:""}},[e._v("people")]),a("span",{staticClass:"caption text-lowercase"},[e._v("By team")])],1)]}}])},[a("span",[e._v("Sort by team")])]),a("v-spacer"),a("NewProgramme")],1),a("v-expansion-panels",{staticClass:"pt-10 mx-12"},[a("v-expansion-panel",{staticClass:"panel"},[a("v-expansion-panel-header",{staticClass:"programmeTypeTitle"},[a("v-row",{staticClass:"py-5",attrs:{justify:"center"}},[e._v(" Capability Domains ")])],1),a("v-expansion-panel-content",{staticClass:"pt-5"},[a("v-layout",{staticClass:"programmeTypeRow",attrs:{row:"",wrap:""}},e._l(e.CD_programmes,(function(t){return a("v-flex",{key:t.name,attrs:{xs12:"",s6:"",m3:"",lg3:""}},[a("router-link",{staticClass:"card-text-black",attrs:{to:{name:"Programme",params:{id:t.id}}}},[a("v-card",{staticClass:"ma-3 border",attrs:{"data-cypress":"ProgrammeCard",elevation:"2"}},[a("v-card-text",{staticClass:"text-center"},[a("div",{staticClass:"subheading"},[e._v(e._s(t.name))])])],1)],1)],1)})),1)],1)],1),a("v-expansion-panel",{},[a("v-expansion-panel-header",{staticClass:"programmeTypeTitle"},[a("v-row",{staticClass:"py-5",attrs:{justify:"center"}},[e._v(" Blue Sky ")])],1),a("v-expansion-panel-content",{staticClass:"pt-5"},[a("v-row",{staticClass:"py-4"},[a("div",{staticClass:"pl-5 programmeTypeTitle "},[e._v("Designated")])]),a("v-divider",{staticClass:"pb-5"}),a("v-layout",{staticClass:"programmeTypeRow",attrs:{row:"",wrap:""}},e._l(e.des_programmes,(function(t){return a("v-flex",{key:t.name,attrs:{xs12:"",s6:"",m3:"",lg3:""}},[a("router-link",{staticClass:"card-text-black",attrs:{to:{name:"Programme",params:{id:t.id}}}},[a("v-card",{staticClass:"ma-3 border",attrs:{elevation:"2","data-cypress":"ProgrammeCard"}},[a("v-card-text",{staticClass:"text-center"},[a("div",{staticClass:"subheading"},[e._v(e._s(t.name))])])],1)],1)],1)})),1),a("v-row",{staticClass:"py-4"},[a("div",{staticClass:"pl-5 programmeTypeTitle "},[e._v("Undesignated")])]),a("v-divider",{staticClass:"pb-5"}),a("v-layout",{staticClass:"programmeTypeRow",attrs:{row:"",wrap:""}},e._l(e.undes_programmes,(function(t){return a("v-flex",{key:t.name,attrs:{xs12:"",s6:"",m3:"",lg3:""}},[a("router-link",{staticClass:"card-text-black",attrs:{to:{name:"Programme",params:{id:t.id}}}},[a("v-card",{staticClass:"ma-3 border",attrs:{elevation:"2","data-cypress":"ProgrammeCard"}},[a("v-card-text",{staticClass:"text-center"},[a("div",{staticClass:"subheading"},[e._v(e._s(t.name))])])],1)],1)],1)})),1)],1)],1),a("v-expansion-panel",{},[a("v-expansion-panel-header",{staticClass:"programmeTypeTitle"},[a("v-row",{staticClass:"py-5",attrs:{justify:"center"}},[e._v(" Special Pursuits ")])],1),a("v-expansion-panel-content",{staticClass:"pt-5"},[a("v-row",{staticClass:"py-4"},[a("div",{staticClass:"pl-5 programmeTypeTitle "},[e._v("Active")])]),a("v-divider",{staticClass:"pb-5"}),a("v-layout",{staticClass:"programmeTypeRow",attrs:{row:"",wrap:""}},e._l(e.active_programmes,(function(t){return a("v-flex",{key:t.name,attrs:{xs12:"",s6:"",m3:"",lg3:""}},[a("router-link",{staticClass:"card-text-black",attrs:{to:{name:"Programme",params:{id:t.id}}}},[a("v-card",{staticClass:"ma-3 border",attrs:{elevation:"2","data-cypress":"ProgrammeCard"}},[a("v-card-text",{staticClass:"text-center"},[a("div",{staticClass:"subheading"},[e._v(e._s(t.name))])])],1)],1)],1)})),1),a("v-row",{staticClass:"py-4"},[a("div",{staticClass:"pl-5 programmeTypeTitle "},[e._v("Suspended")])]),a("v-divider",{staticClass:"pb-5"}),a("v-layout",{staticClass:"programmeTypeRow",attrs:{row:"",wrap:""}},e._l(e.suspended_programmes,(function(t){return a("v-flex",{key:t.name,attrs:{xs12:"",s6:"",m3:"",lg3:""}},[a("router-link",{staticClass:"card-text-black",attrs:{to:{name:"Programme",params:{id:t.id}}}},[a("v-card",{staticClass:"ma-3 border",attrs:{elevation:"2","data-cypress":"ProgrammeCard"}},[a("v-card-text",{staticClass:"text-center"},[a("div",{staticClass:"subheading"},[e._v(e._s(t.name))])])],1)],1)],1)})),1),a("v-row",{staticClass:"py-4"},[a("div",{staticClass:"pl-5 programmeTypeTitle "},[e._v("Terminated")])]),a("v-divider",{staticClass:"pb-5"}),a("v-layout",{staticClass:"programmeTypeRow",attrs:{row:"",wrap:""}},e._l(e.terminated_programmes,(function(t){return a("v-flex",{key:t.name,attrs:{xs12:"",s6:"",m3:"",lg3:""}},[a("router-link",{staticClass:"card-text-black",attrs:{to:{name:"Programme",params:{id:t.id}}}},[a("v-card",{staticClass:"ma-3 border",attrs:{elevation:"2","data-cypress":"ProgrammeCard"}},[a("v-card-text",{staticClass:"text-center"},[a("div",{staticClass:"subheading"},[e._v(e._s(t.name))])])],1)],1)],1)})),1),a("v-row",{staticClass:"py-4"},[a("div",{staticClass:"pl-5 programmeTypeTitle "},[e._v("Complete")])]),a("v-divider",{staticClass:"pb-5"}),a("v-layout",{staticClass:"programmeTypeRow",attrs:{row:"",wrap:""}},e._l(e.complete_programmes,(function(t){return a("v-flex",{key:t.name,attrs:{xs12:"",s6:"",m3:"",lg3:""}},[a("router-link",{staticClass:"card-text-black",attrs:{to:{name:"Programme",params:{id:t.id}}}},[a("v-card",{staticClass:"ma-3 border",attrs:{elevation:"2","data-cypress":"ProgrammeCard"}},[a("v-card-text",{staticClass:"text-center"},[a("div",{staticClass:"subheading"},[e._v(e._s(t.name))])])],1)],1)],1)})),1)],1)],1),a("v-expansion-panel",{},[a("v-expansion-panel-header",{staticClass:"programmeTypeTitle"},[a("v-row",{staticClass:"py-5",attrs:{justify:"center"}},[e._v(" R&D Deployment ")])],1),a("v-expansion-panel-content",{staticClass:"pt-5"},[a("v-layout",{staticClass:"programmeTypeRow",attrs:{row:"",wrap:""}},e._l(e.Y_programmes,(function(t){return a("v-flex",{key:t.name,attrs:{xs12:"",s6:"",m3:"",lg3:""}},[a("router-link",{staticClass:"card-text-black",attrs:{to:{name:"Programme",params:{id:t.id}}}},[a("v-card",{staticClass:"ma-3 border",attrs:{elevation:"2","data-cypress":"ProgrammeCard"}},[a("v-card-text",{staticClass:"text-center"},[a("div",{staticClass:"subheading"},[e._v(e._s(t.name))])])],1)],1)],1)})),1)],1)],1)],1)],1)],1)},r=[],n=a("5530"),i=(a("4de4"),a("b0c0"),a("2f62")),o=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-dialog",{attrs:{persistent:"","max-width":"400"},scopedSlots:e._u([{key:"activator",fn:function(t){var s=t.on,r=t.attrs;return[a("v-btn",e._g(e._b({attrs:{elevation:"2",small:"",dark:"",color:"primary","data-cypress":"addNewProgrammeBtn",disabled:!e.user.admin}},"v-btn",r,!1),s),[a("v-icon",{attrs:{dark:""}},[e._v(" mdi-plus ")]),e._v(" Add Programme ")],1)]}}]),model:{value:e.newProgrammeDialog,callback:function(t){e.newProgrammeDialog=t},expression:"newProgrammeDialog"}},[a("v-form",{ref:"form"},[a("v-card",{attrs:{"data-cypress":"newProgrammeModal"}},[a("v-card-title",{staticClass:"headline backgroundColorPrimary"},[e._v(" New Programme ")]),a("v-card-text",{staticClass:"mt-6"},[a("v-form",{ref:"newProgrammeForm",staticClass:"px-3"},[a("v-text-field",{attrs:{label:"Title","data-cypress":"newProgrammeTitle"},model:{value:e.newProgramme.name,callback:function(t){e.$set(e.newProgramme,"name",t)},expression:"newProgramme.name"}}),a("v-text-field",{attrs:{label:"Team","data-cypresss":"newProgrammeTeam"},model:{value:e.newProgramme.team.team_name,callback:function(t){e.$set(e.newProgramme.team,"team_name",t)},expression:"newProgramme.team.team_name"}}),a("v-select",{attrs:{label:"Programme Type",items:e.programmeTypeOptions,"item-text":"text","item-value":"value","return-object":"","data-cypress":"newProgType"},model:{value:e.newProgramme.programme_type,callback:function(t){e.$set(e.newProgramme,"programme_type",t)},expression:"newProgramme.programme_type"}}),"X"==e.newProgramme.programme_type.value?a("v-select",{attrs:{label:"Programme Status",items:e.programmeStatusOptions1,"item-text":"text","item-value":"value","return-object":"","data-cypress":"newProgType"},model:{value:e.newProgramme.status,callback:function(t){e.$set(e.newProgramme,"status",t)},expression:"newProgramme.status"}}):e._e(),"BS"==e.newProgramme.programme_type.value?a("v-select",{attrs:{label:"Programme Status",items:e.programmeStatusOptions2,"item-text":"text","item-value":"value","return-object":"","data-cypress":"newProgType"},model:{value:e.newProgramme.status,callback:function(t){e.$set(e.newProgramme,"status",t)},expression:"newProgramme.status"}}):e._e(),a("v-select",{attrs:{label:"Technical Authority",items:e.mapUsersArray,"item-text":"text","item-value":"value",multiple:"",chips:"",hint:"More than one may be selected","persistent-hint":"","return-object":"","data-cypress":"newProgTechnicalAuth"},model:{value:e.newTeam.technical_approver.users,callback:function(t){e.$set(e.newTeam.technical_approver,"users",t)},expression:"newTeam.technical_approver.users"}}),a("v-select",{attrs:{label:"Purchase Authority",items:e.mapUsersArray,multiple:"",chips:"",hint:"More than one may be selected","persistent-hint":"","return-object":"","data-cypress":"newProgPurchaseAuth"},model:{value:e.newTeam.purchase_approver.users,callback:function(t){e.$set(e.newTeam.purchase_approver,"users",t)},expression:"newTeam.purchase_approver.users"}}),a("v-select",{attrs:{label:"Procument Authority",items:e.mapUsersArray,multiple:"",chips:"",hint:"More than one may be selected","persistent-hint":"","return-object":"","data-cypress":"newProgProcurer"},model:{value:e.newTeam.procurer.users,callback:function(t){e.$set(e.newTeam.procurer,"users",t)},expression:"newTeam.procurer.users"}}),a("v-text-field",{attrs:{label:"Buget Value",rules:e.inputRulesMoney,prefix:"R","data-cypress":"budgetValue"},model:{value:e.newProgramme.budget,callback:function(t){e.$set(e.newProgramme,"budget",t)},expression:"newProgramme.budget"}})],1)],1),a("v-card-actions",[a("v-spacer"),e.loading?e._e():a("v-btn",{attrs:{color:"blue-grey darken-3",text:"","data-cypress":"newProgrammeCancelBtn"},on:{click:function(t){e.newProgrammeDialog=!1}}},[e._v(" Cancel ")]),a("v-btn",{attrs:{color:"blue-grey darken-3",text:"",loading:e.loading,"data-cypress":"newProgrammeAddBtn"},on:{click:e.submit}},[e._v(" Add ")])],1)],1)],1)],1)},c=[],l=a("1da1"),m=(a("96cf"),a("ac1f"),a("466d"),a("159b"),a("dc59")),u={data:function(){return{inputRules:[function(e){return e.length>=3||"Minimum length is 3 characters"}],inputRulesMoney:[function(e){return e.match(/^\d+(?:\.\d{0,2})$/)||"Must be in the format R0.00"},function(e){return e.length>=5||"Minimum length is 4 characters"}],loading:!1,newProgramme:{name:"",team:{team_name:""},budget:"",programme_type:{text:"",value:""},status:""},newProgrammeDialog:!1,newTeam:{name:"",programme_id:"",technical_approver:{listRefId:3,users:[]},purchase_approver:{listRefId:4,users:[]},procurer:{listRefId:5,users:[]},quality_approver:{listRefId:6,user:{}},createdOn:new Date,updatedOn:new Date},programmeTypeOptions:[{text:"Capability Domain",value:"CD"},{text:"Blue Sky",value:"BS"},{text:"Special Pursuit",value:"X"},{text:"R&D Deployment",value:"Y"}],programmeStatusOptions1:[{text:"Active",value:"active"},{text:"Complete",value:"complete"},{text:"Suspended",value:"suspended"},{text:"Terminated",value:"terminated"}],programmeStatusOptions2:[{text:"Designated",value:"des"},{text:"Undesignated",value:"undes"}],selectRequired:[function(e){return e.length>0||"Required"}]}},computed:Object(n["a"])(Object(n["a"])({},Object(i["d"])({currentUser:function(e){return e.profile.userProfile},user:function(e){return e.profile.userProfile},users:function(e){return e.users.users}})),{},{mapUsersArray:function(){var e=[];return this.users.forEach((function(t){var a={text:t.name+" "+t.surname,value:t.id,slack_id:t.slack_id};e.push(a)})),e.sort((function(e,t){return e.text.localeCompare(t.text)}))}}),methods:Object(n["a"])(Object(n["a"])({},Object(i["b"])(["createNewProgramme","getUsers"])),{},{submit:function(){var e=this;return Object(l["a"])(regeneratorRuntime.mark((function t(){var a,s,r,n,i,o;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!e.$refs.newProgrammeForm.validate()){t.next=9;break}return e.loading=!0,t.next=4,m["d"].collection("programmes").add({});case 4:return a=t.sent,t.next=7,m["d"].collection("teams").add({});case 7:s=t.sent,"X"==e.newProgramme.programme_type.value||"BS"==e.newProgramme.programme_type.value?(r={name:e.newProgramme.name,createdOn:new Date,team:{team_id:s.id,team_name:e.newProgramme.team.team_name},products:[],budget:e.newProgramme.budget,programme_type:e.newProgramme.programme_type.value,total:"0",status:e.newProgramme.status.value},n={name:r.team.team_name,programme:{programme_id:a.id,programme_name:r.name},technical_approver:e.newTeam.technical_approver,purchase_approver:e.newTeam.purchase_approver,procurer:e.newTeam.procurer,quality_approver:e.newTeam.quality_approver,receiver:{},createdOn:new Date,updatedOn:new Date},e.createNewProgramme({progData:r,teamData:n}),e.newProgrammeDialog=!1,e.loading=!1,e.$refs.form.resetValidation(),e.$refs.form.reset()):(i={name:e.newProgramme.name,createdOn:new Date,team:{team_id:s.id,team_name:e.newProgramme.team.team_name},products:[],budget:e.newProgramme.budget,programme_type:e.newProgramme.programme_type.value,total:"0",status:""},o={name:i.team.team_name,programme:{programme_id:a.id,programme_name:i.name},technical_approver:e.newTeam.technical_approver,purchase_approver:e.newTeam.purchase_approver,procurer:e.newTeam.procurer,quality_approver:e.newTeam.quality_approver,receiver:{},createdOn:new Date,updatedOn:new Date},e.createNewProgramme({progData:i,teamData:o}),e.newProgrammeDialog=!1,e.loading=!1,e.$refs.form.resetValidation(),e.$refs.form.reset());case 9:case"end":return t.stop()}}),t)})))()}}),mounted:function(){this.getUsers()}},p=u,d=(a("3040"),a("2877")),v=a("6544"),h=a.n(v),g=a("8336"),f=a("b0af"),b=a("99d9"),x=a("169a"),y=a("4bd4"),C=a("132d"),_=a("b974"),w=a("2fa4"),P=a("8654"),k=Object(d["a"])(p,o,c,!1,null,"94f553d4",null),O=k.exports;h()(k,{VBtn:g["a"],VCard:f["a"],VCardActions:b["a"],VCardText:b["c"],VCardTitle:b["d"],VDialog:x["a"],VForm:y["a"],VIcon:C["a"],VSelect:_["a"],VSpacer:w["a"],VTextField:P["a"]});var T={Name:"Programmes",components:{NewProgramme:O},data:function(){return{links:[{text:"Programmes",to:"/"}]}},computed:Object(n["a"])(Object(n["a"])(Object(n["a"])({},Object(i["d"])({programmes:function(e){return e.programmes.programmes}})),Object(i["c"])({})),{},{BS_programmes:function(){var e=this.programmes.filter((function(e){return"BS"===e.programme_type}));return e.sort((function(e,t){return e["name"]<t["name"]?-1:1}))},CD_programmes:function(){var e=this.programmes.filter((function(e){return"CD"===e.programme_type}));return e.sort((function(e,t){return e["name"]<t["name"]?-1:1}))},X_programmes:function(){var e=this.programmes.filter((function(e){return"X"===e.programme_type}));return e.sort((function(e,t){return e["name"]<t["name"]?-1:1}))},Y_programmes:function(){var e=this.programmes.filter((function(e){return"Y"===e.programme_type}));return e.sort((function(e,t){return e["name"]<t["name"]?-1:1}))},active_programmes:function(){var e=this.programmes.filter((function(e){return"active"===e.status}));return e.sort((function(e,t){return e["name"]<t["name"]?-1:1}))},suspended_programmes:function(){var e=this.programmes.filter((function(e){return"suspended"===e.status}));return e.sort((function(e,t){return e["name"]<t["name"]?-1:1}))},terminated_programmes:function(){var e=this.programmes.filter((function(e){return"terminated"===e.status}));return e.sort((function(e,t){return e["name"]<t["name"]?-1:1}))},complete_programmes:function(){var e=this.programmes.filter((function(e){return"complete"===e.status}));return e.sort((function(e,t){return e["name"]<t["name"]?-1:1}))},undes_programmes:function(){var e=this.programmes.filter((function(e){return"undes"===e.status}));return e.sort((function(e,t){return e["name"]<t["name"]?-1:1}))},des_programmes:function(){var e=this.programmes.filter((function(e){return"des"===e.status}));return e.sort((function(e,t){return e["name"]<t["name"]?-1:1}))}}),methods:Object(n["a"])(Object(n["a"])({},Object(i["b"])(["getProgrammes"])),{},{sortBy:function(e){"team"==e?this.programmes.sort((function(t,a){return t[e]["team_name"]<a[e]["team_name"]?-1:1})):this.programmes.sort((function(t,a){return t[e]<a[e]?-1:1}))}}),mounted:function(){this.getProgrammes()}},j=T,B=(a("dd29"),a("2bc5")),D=a("a523"),$=a("ce7e"),A=a("cd55"),S=a("49e2"),R=a("c865"),V=a("0393"),I=a("0e8f"),E=a("a722"),M=a("0fd9"),L=a("3a2f"),N=Object(d["a"])(j,s,r,!1,null,"084dab81",null);t["default"]=N.exports;h()(N,{VBreadcrumbs:B["a"],VBtn:g["a"],VCard:f["a"],VCardText:b["c"],VContainer:D["a"],VDivider:$["a"],VExpansionPanel:A["a"],VExpansionPanelContent:S["a"],VExpansionPanelHeader:R["a"],VExpansionPanels:V["a"],VFlex:I["a"],VIcon:C["a"],VLayout:E["a"],VRow:M["a"],VSpacer:w["a"],VTooltip:L["a"]})},"8adc":function(e,t,a){},9734:function(e,t,a){},abd3:function(e,t,a){},c865:function(e,t,a){"use strict";var s=a("5530"),r=a("0789"),n=a("9d26"),i=a("a9ad"),o=a("3206"),c=a("5607"),l=a("80d2"),m=a("58df"),u=Object(m["a"])(i["a"],Object(o["a"])("expansionPanel","v-expansion-panel-header","v-expansion-panel"));t["a"]=u.extend().extend({name:"v-expansion-panel-header",directives:{ripple:c["a"]},props:{disableIconRotate:Boolean,expandIcon:{type:String,default:"$expand"},hideActions:Boolean,ripple:{type:[Boolean,Object],default:!1}},data:function(){return{hasMousedown:!1}},computed:{classes:function(){return{"v-expansion-panel-header--active":this.isActive,"v-expansion-panel-header--mousedown":this.hasMousedown}},isActive:function(){return this.expansionPanel.isActive},isDisabled:function(){return this.expansionPanel.isDisabled},isReadonly:function(){return this.expansionPanel.isReadonly}},created:function(){this.expansionPanel.registerHeader(this)},beforeDestroy:function(){this.expansionPanel.unregisterHeader()},methods:{onClick:function(e){this.$emit("click",e)},genIcon:function(){var e=Object(l["o"])(this,"actions")||[this.$createElement(n["a"],this.expandIcon)];return this.$createElement(r["d"],[this.$createElement("div",{staticClass:"v-expansion-panel-header__icon",class:{"v-expansion-panel-header__icon--disable-rotate":this.disableIconRotate},directives:[{name:"show",value:!this.isDisabled}]},e)])}},render:function(e){var t=this;return e("button",this.setBackgroundColor(this.color,{staticClass:"v-expansion-panel-header",class:this.classes,attrs:{tabindex:this.isDisabled?-1:null,type:"button","aria-expanded":this.isActive},directives:[{name:"ripple",value:this.ripple}],on:Object(s["a"])(Object(s["a"])({},this.$listeners),{},{click:this.onClick,mousedown:function(){return t.hasMousedown=!0},mouseup:function(){return t.hasMousedown=!1}})}),[Object(l["o"])(this,"default",{open:this.isActive},!0),this.hideActions||this.genIcon()])}})},cc20:function(e,t,a){"use strict";var s=a("3835"),r=a("5530"),n=(a("4de4"),a("8adc"),a("58df")),i=a("0789"),o=a("9d26"),c=a("a9ad"),l=a("4e82"),m=a("7560"),u=a("f2e7"),p=a("1c87"),d=a("af2b"),v=a("d9bd");t["a"]=Object(n["a"])(c["a"],d["a"],p["a"],m["a"],Object(l["a"])("chipGroup"),Object(u["b"])("inputValue")).extend({name:"v-chip",props:{active:{type:Boolean,default:!0},activeClass:{type:String,default:function(){return this.chipGroup?this.chipGroup.activeClass:""}},close:Boolean,closeIcon:{type:String,default:"$delete"},closeLabel:{type:String,default:"$vuetify.close"},disabled:Boolean,draggable:Boolean,filter:Boolean,filterIcon:{type:String,default:"$complete"},label:Boolean,link:Boolean,outlined:Boolean,pill:Boolean,tag:{type:String,default:"span"},textColor:String,value:null},data:function(){return{proxyClass:"v-chip--active"}},computed:{classes:function(){return Object(r["a"])(Object(r["a"])(Object(r["a"])(Object(r["a"])({"v-chip":!0},p["a"].options.computed.classes.call(this)),{},{"v-chip--clickable":this.isClickable,"v-chip--disabled":this.disabled,"v-chip--draggable":this.draggable,"v-chip--label":this.label,"v-chip--link":this.isLink,"v-chip--no-color":!this.color,"v-chip--outlined":this.outlined,"v-chip--pill":this.pill,"v-chip--removable":this.hasClose},this.themeClasses),this.sizeableClasses),this.groupClasses)},hasClose:function(){return Boolean(this.close)},isClickable:function(){return Boolean(p["a"].options.computed.isClickable.call(this)||this.chipGroup)}},created:function(){var e=this,t=[["outline","outlined"],["selected","input-value"],["value","active"],["@input","@active.sync"]];t.forEach((function(t){var a=Object(s["a"])(t,2),r=a[0],n=a[1];e.$attrs.hasOwnProperty(r)&&Object(v["a"])(r,n,e)}))},methods:{click:function(e){this.$emit("click",e),this.chipGroup&&this.toggle()},genFilter:function(){var e=[];return this.isActive&&e.push(this.$createElement(o["a"],{staticClass:"v-chip__filter",props:{left:!0}},this.filterIcon)),this.$createElement(i["b"],e)},genClose:function(){var e=this;return this.$createElement(o["a"],{staticClass:"v-chip__close",props:{right:!0,size:18},attrs:{"aria-label":this.$vuetify.lang.t(this.closeLabel)},on:{click:function(t){t.stopPropagation(),t.preventDefault(),e.$emit("click:close"),e.$emit("update:active",!1)}}},this.closeIcon)},genContent:function(){return this.$createElement("span",{staticClass:"v-chip__content"},[this.filter&&this.genFilter(),this.$slots.default,this.hasClose&&this.genClose()])}},render:function(e){var t=[this.genContent()],a=this.generateRouteLink(),s=a.tag,n=a.data;n.attrs=Object(r["a"])(Object(r["a"])({},n.attrs),{},{draggable:this.draggable?"true":void 0,tabindex:this.chipGroup&&!this.disabled?0:n.attrs.tabindex}),n.directives.push({name:"show",value:this.active}),n=this.setBackgroundColor(this.color,n);var i=this.textColor||this.outlined&&this.color;return e(s,this.setTextColor(i,n),t)}})},cd55:function(e,t,a){"use strict";var s=a("5530"),r=a("4e82"),n=a("3206"),i=a("80d2"),o=a("58df");t["a"]=Object(o["a"])(Object(r["a"])("expansionPanels","v-expansion-panel","v-expansion-panels"),Object(n["b"])("expansionPanel",!0)).extend({name:"v-expansion-panel",props:{disabled:Boolean,readonly:Boolean},data:function(){return{content:null,header:null,nextIsActive:!1}},computed:{classes:function(){return Object(s["a"])({"v-expansion-panel--active":this.isActive,"v-expansion-panel--next-active":this.nextIsActive,"v-expansion-panel--disabled":this.isDisabled},this.groupClasses)},isDisabled:function(){return this.expansionPanels.disabled||this.disabled},isReadonly:function(){return this.expansionPanels.readonly||this.readonly}},methods:{registerContent:function(e){this.content=e},unregisterContent:function(){this.content=null},registerHeader:function(e){this.header=e,e.$on("click",this.onClick)},unregisterHeader:function(){this.header=null},onClick:function(e){e.detail&&this.header.$el.blur(),this.$emit("click",e),this.isReadonly||this.isDisabled||this.toggle()},toggle:function(){var e=this;this.content&&(this.content.isBooted=!0),this.$nextTick((function(){return e.$emit("change")}))}},render:function(e){return e("div",{staticClass:"v-expansion-panel",class:this.classes,attrs:{"aria-expanded":String(this.isActive)}},Object(i["o"])(this))}})},dd29:function(e,t,a){"use strict";a("efe9")},efe9:function(e,t,a){}}]);
//# sourceMappingURL=chunk-a43ad3b8.388dbc3e.js.map