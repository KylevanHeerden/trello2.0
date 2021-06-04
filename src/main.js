import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import VueConfirmDialog from "vue-confirm-dialog";
import { auth } from "./firebase";
import { firestorePlugin } from "vuefire";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(firestorePlugin);
Vue.use(VueConfirmDialog);
Vue.component("vue-confirm-dialog", VueConfirmDialog.default);

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

auth.onAuthStateChanged((user) => {
  store.dispatch("logInStatus", user);
});

let app;
auth.onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
  }

  if (user) {
    store.dispatch("fetchUserProfile", user); // We add this so when the page reloads it checks if user is loggedin is true the just fetches profile
  }
});
