(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0316a6a4"],{"605c":function(t,r,e){"use strict";e("6232")},6232:function(t,r,e){},b675:function(t,r,e){"use strict";e.r(r);var a=function(){var t=this,r=t.$createElement,e=t._self._c||r;return e("div",{staticClass:"products"},[e("v-breadcrumbs",{attrs:{items:t.links,divider:"/"}}),e("v-container",{staticClass:"my-5",attrs:{fluid:""}},[e("v-row",{staticClass:"mx-3",attrs:{wrap:""}},t._l(this.Array,(function(r){return e("v-col",{key:r.list_name,class:"list-group mx-2 "+r.list_status,attrs:{xs12:"",sm6:"",md2:""}},[t._v(" "+t._s(r.list_name)+" "),e("br"),e("Draggable",{staticClass:"list-group list-col my-3",attrs:{list:t.cards1(r.id),group:"cards"},on:{change:function(e){return t.cardMoved(r.id,e)}}},t._l(t.cards1(r.id),(function(a){return e("Card",{key:a.id,staticClass:"list-group-item",attrs:{card:a,listId:r.id,cardComments:t.commentsByCard(a.id),team:t.team}})})),1)],1)})),1)],1),e("v-snackbar",{attrs:{color:"primary",timeout:t.snackbar.timeout},scopedSlots:t._u([{key:"action",fn:function(r){var a=r.attrs;return[e("v-btn",t._b({attrs:{color:"white",text:""},on:{click:function(r){t.snackbar.snackbar=!1}}},"v-btn",a,!1),[t._v(" Close ")])]}}]),model:{value:t.snackbar.snackbar,callback:function(r){t.$set(t.snackbar,"snackbar",r)},expression:"snackbar.snackbar"}},[t._v(" "+t._s("You moved a card to "+t.snackbar.newListName)+" ")])],1)},s=[],i=e("1da1"),n=(e("96cf"),e("7db0"),e("b0c0"),e("159b"),e("4de4"),e("d81d"),e("b76a")),o=e.n(n),c=e("ae8d"),d=e("dc59"),u={name:"Products",components:{Draggable:o.a,Card:c["a"]},data:function(){return{programmeId:String(this.$route.params.id),fetchedProgrammeId:this.$route.params.id,update:!0,Array:[{id:1,list_name:"Quotes",list_status:"Quotes",cards:[]},{id:2,list_name:"Technical Approval",list_status:"Technical",cards:[]},{id:3,list_name:"Purchase Approval",list_status:"Purchase",cards:[]},{id:4,list_name:"Purchasing",list_status:"Procurement",cards:[]},{id:5,list_name:"Awaiting Delivery",list_status:"Waiting",cards:[]},{id:6,list_name:"Quality Approval",list_status:"Quality",cards:[]}],snackbar:{snackbar:!1,timeout:2e7,newListName:""}}},watch:{update:function(){console.log(this.update)}},methods:{cardMoved:function(t,r){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){var s,i,n,o,c,u,m;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(s=r.added||r.moved,void 0!=s){a.next=3;break}return a.abrupt("return");case 3:if(i=s.element,void 0!=i){a.next=6;break}return a.abrupt("return");case 6:return n=d["d"].collection("cards").doc(i.id),a.next=9,n.update({list_id:t});case 9:return e.snackbar.newListName=e.Array.find((function(r){return r.id===t})).list_name,e.snackbar.snackbar=!0,o=d["d"].collection("products").doc(i.product_id),a.next=14,o.update({status:e.Array[t-1].list_status});case 14:c=["technical_approver","purchase_approver","procurer","quality_approver"],u=c[t-2],m=e.products.find((function(t){return t.id===i.product_id})),void 0==e.team[u]?d["d"].collection("notifications").add({card_id:i.id,product:{product_name:m.name,product_id:m.id},programme:{programme_name:m.programme.programme_name,programme_id:m.programme.programme_id},user_id:i.creator,createdOn:new Date,status:e.Array[t-1].list_status}):e.team[u].users.forEach((function(r){d["d"].collection("notifications").add({card_id:i.id,product:{product_name:m.name,product_id:m.id},programme:{programme_name:m.programme.programme_name,programme_id:m.programme.programme_id},user_id:r.value,createdOn:new Date,status:e.Array[t-1].list_status})})),e.$store.dispatch("getNotifications");case 19:case"end":return a.stop()}}),a)})))()},commentsByCard:function(t){var r=this.comments.filter((function(r){return r.card_id===t}));return r},cards1:function(t){var r=this.cards.filter((function(r){return r.list_id===t}));return r}},computed:{products:function(){var t=this.$store.getters.getProducts;return t},programme:function(){var t=this.$store.getters.getProgrammeById(this.fetchedProgrammeId);return t},lists:function(){var t=this.$store.getters.getLists;return t},cards:function(){var t=this,r=this.$store.getters.getCardsByProgrammeId(this.programme.id),e=r.sort((function(t,r){return t.createdOn-r.createdOn}));return e.map((function(r){return t.Array[r.list_id-1].cards.push(r)})),r},suppliers:function(){var t=this.$store.getters.getSuppliers;return t},comments:function(){var t=this.$store.getters.getComments;return t},team:function(){var t=this.$store.getters.getTeamsByProgrammeId(this.programme.id);return t},user:function(){var t=this.$store.getters.getUserProfile;return t},users:function(){var t=this.$store.getters.getUserProfile;return t},links:function(){return void 0==this.programme?[{text:"Programmes",to:"/"}]:[{text:"Programmes",to:"/"},{text:"".concat(this.programme.name),to:"/programme/"+"".concat(this.fetchedProgrammeId)}]}},created:function(){this.$store.dispatch("getProducts"),this.$store.dispatch("getProgrammes"),this.$store.dispatch("getLists"),this.$store.dispatch("getSuppliers"),this.$store.dispatch("getComments"),this.$store.dispatch("getTeams"),this.$store.dispatch("getLineItems")},mounted:function(){this.$store.dispatch("getCards")}},m=u,p=(e("605c"),e("2877")),l=e("6544"),g=e.n(l),h=e("2bc5"),f=e("8336"),_=e("62ad"),v=e("a523"),b=e("0fd9"),k=e("2db4"),y=Object(p["a"])(m,a,s,!1,null,"35b35e13",null);r["default"]=y.exports;g()(y,{VBreadcrumbs:h["a"],VBtn:f["a"],VCol:_["a"],VContainer:v["a"],VRow:b["a"],VSnackbar:k["a"]})}}]);
//# sourceMappingURL=chunk-0316a6a4.4f7c7fc8.js.map