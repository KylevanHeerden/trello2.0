(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6d8eafc8"],{"2bfd":function(t,e,n){},"308b":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",[n("v-row",{staticClass:"pl-10",attrs:{justify:"center"}},[n("v-col",{attrs:{cols:"12",sm:"2",md:"2"}},[n("v-autocomplete",{attrs:{label:"Programme",items:t.programmesOptions},on:{change:function(e){return t.getData()}},model:{value:t.chosenProgrammeId,callback:function(e){t.chosenProgrammeId=e},expression:"chosenProgrammeId"}})],1),n("v-col",{attrs:{cols:"12",sm:"2",md:"2"}},[n("v-menu",{ref:"menu",attrs:{"close-on-content-click":!0,transition:"scale-transition","offset-y":"","max-width":"290px","min-width":"auto"},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on,i=e.attrs;return[n("v-text-field",t._g(t._b({attrs:{value:t.beginDate,label:"Begin Date","prepend-icon":"mdi-calendar",readonly:"",clearable:""},on:{"click:clear":function(e){return t.clearDates("begin")}}},"v-text-field",i,!1),a))]}}]),model:{value:t.menu1,callback:function(e){t.menu1=e},expression:"menu1"}},[n("v-date-picker",{attrs:{"no-title":"",scrollable:""},on:{change:function(e){return t.getData()}},model:{value:t.beginDate,callback:function(e){t.beginDate=e},expression:"beginDate"}})],1)],1),n("v-col",{attrs:{cols:"12",sm:"2",md:"2"}},[n("v-menu",{ref:"menu",attrs:{"close-on-content-click":!0,transition:"scale-transition","offset-y":"","max-width":"290px","min-width":"auto"},scopedSlots:t._u([{key:"activator",fn:function(e){var a=e.on,i=e.attrs;return[n("v-text-field",t._g(t._b({attrs:{value:t.endDate,label:"End Date","prepend-icon":"mdi-calendar",readonly:"",clearable:""},on:{"click:clear":function(e){return t.clearDates("end")}}},"v-text-field",i,!1),a))]}}]),model:{value:t.menu2,callback:function(e){t.menu2=e},expression:"menu2"}},[n("v-date-picker",{attrs:{"no-title":"",scrollable:""},on:{change:function(e){return t.getData()}},model:{value:t.endDate,callback:function(e){t.endDate=e},expression:"endDate"}})],1)],1)],1),n("v-row",{staticClass:"chartContainer",attrs:{justify:"center"}},[n("LineGraph",{attrs:{data1:t.data1,data2:t.data2,labels:t.labels,budget:t.budgetNumber,currentMonth:t.today,max:parseFloat(t.max),programmeName:t.programmeName,committedCount:t.committedCount}})],1),0!=t.data1.length?n("v-row",{staticClass:"pa-0 ma-0",attrs:{justify:"end"}},[n("v-col",{staticClass:"pa-0 ma-0",attrs:{cols:"12",sm:"10",md:"10"}},[n("v-card-text",[n("v-row",{attrs:{justify:"start"}},[n("v-col",{attrs:{cols:"12",sm:"3",md:"3"}},[n("div",{staticClass:"eventLabel"},[t._v("Budget:")]),n("div",{staticClass:"eventLabel"},[t._v("Committed Expenditure:")]),n("div",{staticClass:"eventLabel"},[t._v("Acctual Expenditure:")]),n("div",{staticClass:"eventLabel"},[t._v("Total Expenditure:")])]),n("v-col",{attrs:{cols:"12",sm:"2",md:"2"}},[n("div",{staticClass:"eventAnswer"},[t._v("R "+t._s(t.formatNum(t.budgetNumber)))]),n("div",{staticClass:"eventAnswer"},[t._v("R "+t._s(t.formatNum(t.committedTotal)))]),n("div",{staticClass:"eventAnswer"},[t._v("R "+t._s(t.formatNum(t.actualTotal)))]),n("div",{staticClass:"eventAnswer"},[t._v("R "+t._s(t.formatNum(t.data2.at(-1).y)))])])],1)],1)],1),n("v-col",{staticClass:"pa-0 ma-0",attrs:{cols:"12",sm:"2",md:"2"}},[n("v-text-field",{staticClass:"mt-0 pt-0 max",attrs:{type:"number",label:"Y-Limit",rounded:"",outlined:"",dense:""},model:{value:t.max,callback:function(e){t.max=e},expression:"max"}})],1)],1):t._e(),n("v-row")],1)},i=[],r=n("5530"),s=(n("4de4"),n("d81d"),n("b0c0"),n("fb6a"),n("a9e3"),n("b680"),n("d3b7"),n("25f0"),n("159b"),n("7db0"),n("ac1f"),n("1276"),n("2f62")),o=n("c1df"),l=n.n(o),c=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",[n("apexchart",{attrs:{type:"line",options:t.options,series:t.series}})],1)},u=[],d={props:{data1:{type:Array,default:null,require:!0},data2:{type:Array,default:null,require:!0},labels:{type:Array,default:null,require:!0},budget:{type:Number,require:!0},currentMonth:{type:String,required:!0},max:{type:Number,require:!0},programmeName:{type:String,required:!0},committedCount:{type:Number,required:!0}},data:function(){return{options:{title:{text:"Select a Programme",align:"center"},grid:{show:!1},yaxis:{show:!1},xaxis:{type:"datetime"}},series:[{name:"Monthly Expenditure",data:[]},{name:"Accumalative Monthly Expenditure",data:[]}]}},watch:{data1:function(){this.series=[{data:this.data1},{data:this.data2}],this.options={chart:{height:500},title:{text:"".concat(this.programmeName," Expenditure Tracking"),align:"center"},legend:{show:!0,position:"top"},grid:{show:!0},forecastDataPoints:{count:this.committedCount},yaxis:{show:!0,showAlways:!0,min:0,max:this.max,title:{text:"Expenditure (R)"},labels:{formatter:function(t){return t.toLocaleString("ru-RU")}}},xaxis:{type:"datetime",labels:{formatter:function(t,e){return l()(new Date(e)).format("DD MMM YY")}}},annotations:{yaxis:[{y:this.budget,borderColor:"#ff6347",label:{borderColor:"#ff6347",style:{color:"#fff",background:"#ff6347"},text:"Budget"}}],xaxis:[{x:new Date(this.currentMonth).getTime(),borderColor:"#e1ad01",label:{borderColor:"#e1ad01",style:{color:"#fff",background:"#e1ad01"},text:"Current Month"}}]},tooltip:{y:{formatter:function(t){if(t%1===0)return"R "+t.toLocaleString("ru-RU");var e=Number(t.toFixed(2)).toLocaleString("ru-RU").slice(0,-3)+Number(t.toFixed(2)).toString().slice(Number(t.toFixed(2)).toString().indexOf("."));return"R "+e}}}}},max:function(){this.options={chart:{height:500},title:{text:"".concat(this.programmeName," Expenditure Tracking"),align:"center"},legend:{show:!0,position:"top"},grid:{show:!0},forecastDataPoints:{count:this.committedCount},yaxis:{show:!0,showAlways:!0,min:0,max:this.max,title:{text:"Expenditure (R)"},labels:{formatter:function(t){return t.toLocaleString("ru-RU")}}},xaxis:{type:"datetime",labels:{formatter:function(t,e){return l()(new Date(e)).format("DD MMM YY")}}},annotations:{yaxis:[{y:this.budget,borderColor:"#ff6347",label:{borderColor:"#ff6347",style:{color:"#fff",background:"#ff6347"},text:"Budget"}}],xaxis:[{x:new Date(this.currentMonth).getTime(),borderColor:"#e1ad01",label:{borderColor:"#e1ad01",style:{color:"#fff",background:"#e1ad01"},text:"Current Month"}}]},tooltip:{y:{formatter:function(t){if(t%1===0)return"R "+t.toLocaleString("ru-RU");var e=Number(t.toFixed(2)).toLocaleString("ru-RU").slice(0,-3)+Number(t.toFixed(2)).toString().slice(Number(t.toFixed(2)).toString().indexOf("."));return"R "+e}}}}}},computed:{},mounted:function(){}},h=d,m=n("2877"),f=n("6544"),p=n.n(f),g=n("a523"),x=Object(m["a"])(h,c,u,!1,null,null,null),v=x.exports;p()(x,{VContainer:g["a"]});var b={components:{LineGraph:v},data:function(){return{beginDate:null,endDate:null,beginIndex:null,endIndex:null,chosenProgrammeId:"",data1:[],data2:[],labels:[],menu1:!1,menu2:!1,budgetNumber:0,max:1e3,programmeName:"",committedTotal:0,actualTotal:0,committedCount:0,today:l()(new Date).format("YYYY-MM-DD")}},computed:Object(r["a"])(Object(r["a"])(Object(r["a"])({},Object(s["d"])({products:function(t){return t.products.products},programmes:function(t){return t.programmes.programmes}})),Object(s["c"])(["getProgrammeById"])),{},{currentMonth:function(){var t=new Date,e=String(t.getMonth()),n=t.getFullYear(),a=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],i=a[e]+" "+n;return i},filteredProducts:function(){var t=this,e=this.products.filter((function(e){return e.programme.programme_id===t.chosenProgrammeId&&("Procurement"===e.status||"FollowUp"===e.status||"Quality"===e.status)}));return e},programmesOptions:function(){var t=this.programmes.map((function(t){return{text:t.name,value:t.id}}));return t}}),methods:{clearDates:function(t){"begin"==t?this.beginDate=null:"end"==t&&(this.endDate=null),this.getData()},formatNum:function(t){if(t%1===0)return t.toLocaleString("ru-RU");var e=Number(t.toFixed(2)).toLocaleString("ru-RU").slice(0,-3)+Number(t.toFixed(2)).toString().slice(Number(t.toFixed(2)).toString().indexOf("."));return e},getData:function(){var t=this,e=parseFloat(this.getProgrammeById(this.chosenProgrammeId).budget);this.budgetNumber=e,this.max=e,this.programmeName=this.getProgrammeById(this.chosenProgrammeId).name,this.splitCommitted();var n=[];this.filteredProducts.forEach((function(t){void 0!==t.payments&&t.payments.forEach((function(t){n.push(t)}))}));var a=n.map((function(t){return{x:t.date,y:parseFloat(t.value),committed:t.committed}}));a.sort((function(t,e){return t.x>e.x?1:-1}));var i=[];if(null!==this.beginDate&&null!==this.endDate){i=a.filter((function(e){return e.x>=t.beginDate&&e.x<=t.endDate}));var r=i.map((function(t){return t.x}));this.labels=r.sort()}else if(null!==this.beginDate){i=a.filter((function(e){return e.x>=t.beginDate}));var s=i.map((function(t){return t.x}));this.labels=s.sort()}else if(null!==this.endDate){i=a.filter((function(e){return e.x<=t.endDate}));var o=i.map((function(t){return t.x}));this.labels=o.sort()}else{i=a;var l=a.map((function(t){return t.x}));this.labels=l.sort()}var c=i.reduce((function(t,e){return 0==t.length?t.push({x:e.x,y:e.y}):t.at(-1).x==e.x?t.at(-1).y=t.at(-1).y+e.y:t.push({x:e.x,y:e.y}),t}),[]),u=c.reduce((function(t,e){return 0==t.length?t.push({x:e.x,y:e.y}):t.push({x:e.x,y:t.at(-1).y+e.y}),t}),[]),d=c.find((function(e){e.x,t.today}));if(void 0==d){c.push({x:this.today,y:0}),c.sort((function(t,e){return t.x>e.x?1:-1}));var h=c.find((function(e){return e.x==t.today})),m=c.indexOf(h);h.y=c.at(m-1).y}var f=u.find((function(e){e.x,t.today}));if(void 0==f){u.push({x:this.today,y:0}),u.sort((function(t,e){return t.x>e.x?1:-1}));var p=u.find((function(e){return e.x==t.today})),g=u.indexOf(p);p.y=u.at(g-1).y}this.data1=c,this.data2=u;var x=0;c.forEach((function(e){e.x>t.today&&(x+=1)})),this.committedCount=x},splitCommitted:function(){var t=[],e=[],n=l()(new Date).format("MM");this.filteredProducts.forEach((function(a){void 0!==a.payments&&a.payments.forEach((function(a){a.date.split("-")[1]<n?t.push(a):e.push(a)}))}));var a=t.reduce((function(t,e){return t+parseFloat(e.value)}),0),i=e.reduce((function(t,e){return t+parseFloat(e.value)}),0);this.actualTotal=a,this.committedTotal=i}},created:function(){this.$store.dispatch("getProducts"),this.$store.dispatch("getProgrammes")},mounted:function(){}},y=b,I=(n("9f87"),n("c6a6")),D=n("99d9"),S=n("62ad"),C=n("2e4b"),w=n("e449"),M=n("0fd9"),F=n("8654"),N=Object(m["a"])(y,a,i,!1,null,"6a40028c",null);e["default"]=N.exports;p()(N,{VAutocomplete:I["a"],VCardText:D["c"],VCol:S["a"],VContainer:g["a"],VDatePicker:C["a"],VMenu:w["a"],VRow:M["a"],VTextField:F["a"]})},8638:function(t,e,n){},"9f87":function(t,e,n){"use strict";n("8638")},c6a6:function(t,e,n){"use strict";var a=n("5530"),i=(n("d81d"),n("4de4"),n("498a"),n("7db0"),n("caad"),n("2532"),n("2bfd"),n("b974")),r=n("8654"),s=n("d9f7"),o=n("80d2"),l=Object(a["a"])(Object(a["a"])({},i["b"]),{},{offsetY:!0,offsetOverflow:!0,transition:!1});e["a"]=i["a"].extend({name:"v-autocomplete",props:{allowOverflow:{type:Boolean,default:!0},autoSelectFirst:{type:Boolean,default:!1},filter:{type:Function,default:function(t,e,n){return n.toLocaleLowerCase().indexOf(e.toLocaleLowerCase())>-1}},hideNoData:Boolean,menuProps:{type:i["a"].options.props.menuProps.type,default:function(){return l}},noFilter:Boolean,searchInput:{type:String}},data:function(){return{lazySearch:this.searchInput}},computed:{classes:function(){return Object(a["a"])(Object(a["a"])({},i["a"].options.computed.classes.call(this)),{},{"v-autocomplete":!0,"v-autocomplete--is-selecting-index":this.selectedIndex>-1})},computedItems:function(){return this.filteredItems},selectedValues:function(){var t=this;return this.selectedItems.map((function(e){return t.getValue(e)}))},hasDisplayedItems:function(){var t=this;return this.hideSelected?this.filteredItems.some((function(e){return!t.hasItem(e)})):this.filteredItems.length>0},currentRange:function(){return null==this.selectedItem?0:String(this.getText(this.selectedItem)).length},filteredItems:function(){var t=this;return!this.isSearching||this.noFilter||null==this.internalSearch?this.allItems:this.allItems.filter((function(e){var n=Object(o["n"])(e,t.itemText),a=null!=n?String(n):"";return t.filter(e,String(t.internalSearch),a)}))},internalSearch:{get:function(){return this.lazySearch},set:function(t){this.lazySearch!==t&&(this.lazySearch=t,this.$emit("update:search-input",t))}},isAnyValueAllowed:function(){return!1},isDirty:function(){return this.searchIsDirty||this.selectedItems.length>0},isSearching:function(){return this.multiple&&this.searchIsDirty||this.searchIsDirty&&this.internalSearch!==this.getText(this.selectedItem)},menuCanShow:function(){return!!this.isFocused&&(this.hasDisplayedItems||!this.hideNoData)},$_menuProps:function(){var t=i["a"].options.computed.$_menuProps.call(this);return t.contentClass="v-autocomplete__content ".concat(t.contentClass||"").trim(),Object(a["a"])(Object(a["a"])({},l),t)},searchIsDirty:function(){return null!=this.internalSearch&&""!==this.internalSearch},selectedItem:function(){var t=this;return this.multiple?null:this.selectedItems.find((function(e){return t.valueComparator(t.getValue(e),t.getValue(t.internalValue))}))},listData:function(){var t=i["a"].options.computed.listData.call(this);return t.props=Object(a["a"])(Object(a["a"])({},t.props),{},{items:this.virtualizedItems,noFilter:this.noFilter||!this.isSearching||!this.filteredItems.length,searchInput:this.internalSearch}),t}},watch:{filteredItems:"onFilteredItemsChanged",internalValue:"setSearch",isFocused:function(t){t?(document.addEventListener("copy",this.onCopy),this.$refs.input&&this.$refs.input.select()):(document.removeEventListener("copy",this.onCopy),this.$refs.input&&this.$refs.input.blur(),this.updateSelf())},isMenuActive:function(t){!t&&this.hasSlot&&(this.lazySearch=null)},items:function(t,e){e&&e.length||!this.hideNoData||!this.isFocused||this.isMenuActive||!t.length||this.activateMenu()},searchInput:function(t){this.lazySearch=t},internalSearch:"onInternalSearchChanged",itemText:"updateSelf"},created:function(){this.setSearch()},destroyed:function(){document.removeEventListener("copy",this.onCopy)},methods:{onFilteredItemsChanged:function(t,e){var n=this;t!==e&&(this.setMenuIndex(-1),this.$nextTick((function(){n.internalSearch&&(1===t.length||n.autoSelectFirst)&&(n.$refs.menu.getTiles(),n.setMenuIndex(0))})))},onInternalSearchChanged:function(){this.updateMenuDimensions()},updateMenuDimensions:function(){this.isMenuActive&&this.$refs.menu&&this.$refs.menu.updateDimensions()},changeSelectedIndex:function(t){this.searchIsDirty||(this.multiple&&t===o["s"].left?-1===this.selectedIndex?this.selectedIndex=this.selectedItems.length-1:this.selectedIndex--:this.multiple&&t===o["s"].right?this.selectedIndex>=this.selectedItems.length-1?this.selectedIndex=-1:this.selectedIndex++:t!==o["s"].backspace&&t!==o["s"].delete||this.deleteCurrentItem())},deleteCurrentItem:function(){var t=this.selectedIndex,e=this.selectedItems[t];if(this.isInteractive&&!this.getDisabled(e)){var n=this.selectedItems.length-1;if(-1!==this.selectedIndex||0===n){var a=this.selectedItems.length,i=t!==a-1?t:t-1,r=this.selectedItems[i];r?this.selectItem(e):this.setValue(this.multiple?[]:null),this.selectedIndex=i}else this.selectedIndex=n}},clearableCallback:function(){this.internalSearch=null,i["a"].options.methods.clearableCallback.call(this)},genInput:function(){var t=r["a"].options.methods.genInput.call(this);return t.data=Object(s["a"])(t.data,{attrs:{"aria-activedescendant":Object(o["m"])(this.$refs.menu,"activeTile.id"),autocomplete:Object(o["m"])(t.data,"attrs.autocomplete","off")},domProps:{value:this.internalSearch}}),t},genInputSlot:function(){var t=i["a"].options.methods.genInputSlot.call(this);return t.data.attrs.role="combobox",t},genSelections:function(){return this.hasSlot||this.multiple?i["a"].options.methods.genSelections.call(this):[]},onClick:function(t){this.isInteractive&&(this.selectedIndex>-1?this.selectedIndex=-1:this.onFocus(),this.isAppendInner(t.target)||this.activateMenu())},onInput:function(t){if(!(this.selectedIndex>-1)&&t.target){var e=t.target,n=e.value;e.value&&this.activateMenu(),this.internalSearch=n,this.badInput=e.validity&&e.validity.badInput}},onKeyDown:function(t){var e=t.keyCode;!t.ctrlKey&&[o["s"].home,o["s"].end].includes(e)||i["a"].options.methods.onKeyDown.call(this,t),this.changeSelectedIndex(e)},onSpaceDown:function(t){},onTabDown:function(t){i["a"].options.methods.onTabDown.call(this,t),this.updateSelf()},onUpDown:function(t){t.preventDefault(),this.activateMenu()},selectItem:function(t){i["a"].options.methods.selectItem.call(this,t),this.setSearch()},setSelectedItems:function(){i["a"].options.methods.setSelectedItems.call(this),this.isFocused||this.setSearch()},setSearch:function(){var t=this;this.$nextTick((function(){t.multiple&&t.internalSearch&&t.isMenuActive||(t.internalSearch=!t.selectedItems.length||t.multiple||t.hasSlot?null:t.getText(t.selectedItem))}))},updateSelf:function(){(this.searchIsDirty||this.internalValue)&&(this.valueComparator(this.internalSearch,this.getValue(this.internalValue))||this.setSearch())},hasItem:function(t){return this.selectedValues.indexOf(this.getValue(t))>-1},onCopy:function(t){var e,n;if(-1!==this.selectedIndex){var a=this.selectedItems[this.selectedIndex],i=this.getText(a);null==(e=t.clipboardData)||e.setData("text/plain",i),null==(n=t.clipboardData)||n.setData("text/vnd.vuetify.autocomplete.item+plain",i),t.preventDefault()}}}})}}]);
//# sourceMappingURL=chunk-6d8eafc8.13234e83.js.map