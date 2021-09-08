import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import router from "../router/index";
// import createPersistedState from "vuex-persistedstate";

// Modules import

import cards from "@/store/modules/cards";
import comments from "@/store/modules/comments";
import home from "@/store/modules/home";
import lineItems from "@/store/modules/lineItems";
import lists from "@/store/modules/lists";
import notifications from "@/store/modules/notifications";
import products from "@/store/modules/products";
import profile from "@/store/modules/profile";
import programmes from "@/store/modules/programmes";
import suppliers from "@/store/modules/suppliers";
import teams from "@/store/modules/teams";
import users from "@/store/modules/users";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    cards,
    comments,
    home,
    lists,
    lineItems,
    notifications,
    products,
    profile,
    programmes,
    suppliers,
    teams,
    users,
  },
  state: {
    links: [
      { icon: "dashboard", text: "Programmes", route: "/" },
      { icon: "people", text: "Teams", route: "/teams" },
      { icon: "account_circle", text: "Profile", route: "/profile" },
      { icon: "folder", text: "Admin", route: "/admin" },
      { icon: "folder", text: "Finance", route: "/finance" },
    ],
    user: {
      loggedIn: null,
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  mutations: {
    SetLoggedIn(state, value) {
      state.user.loggedIn = value;
    },
  },
  actions: {
    async login({ dispatch }, form) {
      // sign user in
      try {
        const { user } = await fb.auth.signInWithEmailAndPassword(
          form.email,
          form.password
        );

        // fetch user profile and set in state
        dispatch("fetchUserProfile", user);

        router.push("/");
      } catch (error) {
        return "Invalid email or password";
      }
    },

    async logout() {
      await fb.auth
        .signOut()
        .then(() => {
          router.push("/login");
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );

      // create user profile object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        surname: form.surname,
        id: user.uid,
        email: user.email,
        createdOn: new Date(),
        updatedOn: new Date(),
        teams: [],
        admin: false,
      });

      // sign user in
      await fb.auth.signInWithEmailAndPassword(form.email, form.password);

      dispatch("fetchUserProfile", user);
      router.push("/");
    },

    async logInStatus({ commit }, user) {
      commit("SetLoggedIn", user !== null);
    },
  },
  // plugins: [createPersistedState({})],
});

export default store;
