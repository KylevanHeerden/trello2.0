import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import router from "../router/index";
// import createPersistedState from "vuex-persistedstate";

// Modules import
import notifications from "@/store/modules/notifications";
import home from "@/store/modules/home";
import programmes from "@/store/modules/programmes";
import users from "@/store/modules/users";
import profile from "@/store/modules/profile";
import products from "@/store/modules/products";
import lists from "@/store/modules/lists";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    notifications,
    home,
    programmes,
    users,
    profile,
    products,
    lists,
  },
  state: {
    links: [
      { icon: "dashboard", text: "Programmes", route: "/" },
      { icon: "people", text: "Teams", route: "/teams" },
      { icon: "account_circle", text: "Profile", route: "/profile" },
      { icon: "folder", text: "Admin", route: "/admin" },
    ],
    cards: [],
    suppliers: [],
    comments: [],
    // userProfile: {},
    user: {
      loggedIn: null,
    },
    // users: [],
    teams: [],
    lineItems: [],
  },
  getters: {
    // user(state) {
    //   return state.user;
    // },

    // getUserProfile(state) {
    //   return state.userProfile;
    // },

    // getProgrammes(state) {
    //   return state.programmes;
    // },

    // getProgrammeById: (state) => (id) => {
    //   return state.programmes.find((programme) => programme.id === id);
    // },

    // getProducts(state) {
    //   return state.products;
    // },

    // getProductById: (state) => (id) => {
    //   return state.products.find((product) => product.id === id);
    // },

    getCards(state) {
      return state.cards;
    },

    getFilesCount: (state) => (id) => {
      let card = state.cards.filter((card) => card.id === id);

      return [card[0].files_count, card[0].files.length];
    },

    getCardsByProgrammeId: (state) => (id) => {
      return state.cards.filter(
        (card) => card.team.programme.programme_id === id
      );
    },

    getSuppliers(state) {
      return state.suppliers;
    },

    getComments(state) {
      return state.comments;
    },

    getCommentsByCardId: (state) => (id) => {
      return state.comments.find((comment) => comment.card_id == id);
    },

    getTeams(state) {
      return state.teams;
    },

    getTeamsByProgrammeId: (state) => (id) => {
      return state.teams.find((team) => team.programme.programme_id == id);
    },

    getUsers(state) {
      return state.users;
    },

    getLineItems(state) {
      return state.lineItems;
    },

    getLineItemsByProgrammeId: (state) => (id) => {
      return state.lineItems.filter((lineItem) => lineItem.programme_id == id);
    },

    getLineItemsByCardId: (state) => (id) => {
      return state.lineItems.filter((lineItem) => lineItem.card_id == id);
    },
  },
  mutations: {
    // setUserProfile(state, val) {
    //   state.userProfile = val;
    // },
    SetLoggedIn(state, value) {
      state.user.loggedIn = value;
    },

    // setProgrammes(state, value) {
    //   state.programmes = value;
    // },

    // setProducts(state, value) {
    //   state.products = value;
    // },

    setCards(state, value) {
      state.cards = value;
    },

    setSuppliers(state, value) {
      state.suppliers = value;
    },

    setComments(state, value) {
      state.comments = value;
    },

    setTeams(state, value) {
      state.teams = value;
    },

    // setUsers(state, value) {
    //   state.users = value;
    // },

    setLineItems(state, value) {
      state.lineItems = value;
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

    // async fetchUserProfile({ commit }, user) {
    //   let userColProf = await fb.usersCollection.doc(user.uid).get();

    //   let userProfile = {
    //     id: user.uid,
    //     name: userColProf.data().name,
    //     surname: userColProf.data().surname,
    //     email: user.email,
    //     teams: userColProf.data().teams,
    //     admin: userColProf.data().admin,
    //     slack_id: userColProf.data().slack_id,
    //   };

    //   commit("setUserProfile", userProfile);
    // },

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

    // async getProgrammes({ commit }) {
    //   fb.programmesCollection.onSnapshot(
    //     (programmes) => {
    //       let programmes_array = [];
    //       programmes.forEach((doc) => {
    //         let object = {
    //           id: doc.id,
    //           name: doc.data().name,
    //           team: {
    //             team_id: doc.data().team.team_id,
    //             team_name: doc.data().team.team_name,
    //           },
    //           products: doc.data().products,
    //           budget: doc.data().budget,
    //           total: doc.data().total,
    //         };
    //         programmes_array.push(object);
    //       });
    //       commit("setProgrammes", programmes_array);
    //     },
    //     (err) => {
    //       console.log(`Encountered error: ${err}`);
    //     }
    //   );
    // },

    // async getProducts({ commit }) {
    //   fb.productsCollection.onSnapshot(
    //     (products) => {
    //       let products_array = [];
    //       products.forEach((doc) => {
    //         let object = {
    //           createdOn: doc.data().createdOn,
    //           updatedOn: doc.data().updatedOn,
    //           id: doc.id,
    //           name: doc.data().name,
    //           programme: doc.data().programme,
    //           person: doc.data().person,
    //           status: doc.data().status,
    //         };
    //         products_array.push(object);
    //       });
    //       commit("setProducts", products_array);
    //     },
    //     (err) => {
    //       console.log(`Encountered error: ${err}`);
    //     }
    //   );
    // },

    async getCards({ commit }) {
      fb.cardsCollection.onSnapshot(
        (cards) => {
          let cards_array = [];
          cards.forEach((doc) => {
            let object = {
              id: doc.id,
              name: doc.data().name,
              VAT: doc.data().VAT,
              contact_person: doc.data().contact_person,
              contact_number: doc.data().contact_number,
              createdOn: doc.data().createdOn,
              lead_time: doc.data().lead_time,
              list_id: doc.data().list_id,
              nano_item_num: doc.data().nano_item_num,
              nano_item_name: doc.data().nano_item_name,
              nano_item_description: doc.data().nano_item_description,
              product_id: doc.data().product_id,
              quantity: doc.data().quantity,
              supp_item_name: doc.data().supp_item_name,
              supp_item_num: doc.data().supp_item_num,
              supplier_name: doc.data().supplier_name,
              supplier_email: doc.data().supplier_email,
              supplier_quote_num: doc.data().supplier_quote_num,
              total_exc_vat: doc.data().total_exc_vat,
              total_inc_vat: doc.data().total_inc_vat,
              unit_price: doc.data().unit_price,
              updatedOn: doc.data().updatedOn,
              technical_approval: doc.data().technical_approval,
              purchase_approval: doc.data().purchase_approval,
              procured: doc.data().procured,
              receiver_approval: doc.data().receiver_approval,
              quality_approval: doc.data().quality_approval,
              files: doc.data().files,
              files_count: doc.data().files_count,
              purchase_order: doc.data().purchase_order,
              team: doc.data().team,
              creator: doc.data().creator,
              quality_photos: doc.data().quality_photos,
              payment_terms: doc.data().payment_terms,
              currency: doc.data().currency,
              hubdoc: doc.data().hubdoc,
              PO: doc.data().PO,
            };
            cards_array.push(object);
          });
          commit("setCards", cards_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },

    async getSuppliers({ commit }) {
      fb.suppliersCollection.onSnapshot(
        (suppliers) => {
          let suppliers_array = [];
          suppliers.forEach((doc) => {
            let object = {
              id: doc.id,
              supplier_name: doc.data().supplier_name,
              contact_person: doc.data().contact_person,
              contact_number: doc.data().contact_number,
              contact_email: doc.data().contact_email,
              createdOn: doc.data().createdOn,
              updatedOn: doc.data().updatedOn,
            };
            suppliers_array.push(object);
          });
          commit("setSuppliers", suppliers_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },

    async getComments({ commit }) {
      fb.commentsCollection.onSnapshot(
        (comments) => {
          let comments_array = [];
          comments.forEach((doc) => {
            let object = {
              id: doc.id,
              card_id: doc.data().card_id,
              text: doc.data().text,
              position: doc.data().position,
              username: doc.data().username,
              date: doc.data().createdOn,
            };
            comments_array.push(object);
          });
          commit("setComments", comments_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },

    async getTeams({ commit }) {
      fb.teamsCollection.onSnapshot(
        (teams) => {
          let teams_array = [];
          teams.forEach((doc) => {
            let object = {
              id: doc.id,
              createdOn: doc.data().createdOn,
              name: doc.data().name,
              procurer: doc.data().procurer,
              programme: doc.data().programme,
              purchase_approver: doc.data().purchase_approver,
              receiver: doc.data().receiver,
              quality_approver: doc.data().quality_approver,
              technical_approver: doc.data().technical_approver,
              updatedOn: doc.data().updatedOn,
            };
            teams_array.push(object);
          });
          commit("setTeams", teams_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },

    // async getUsers({ commit }) {
    //   fb.usersCollection.onSnapshot(
    //     (users) => {
    //       let users_array = [];
    //       users.forEach((doc) => {
    //         let object = {
    //           id: doc.id,
    //           createdOn: doc.data().createdOn,
    //           name: doc.data().name,
    //           surname: doc.data().surname,
    //           updatedOn: doc.data().updatedOn,
    //           teams: doc.data().teams,
    //           slack_id: doc.data().slack_id,
    //         };
    //         users_array.push(object);
    //       });
    //       commit("setUsers", users_array);
    //     },
    //     (err) => {
    //       console.log(`Encountered error: ${err}`);
    //     }
    //   );
    // },

    async getLineItems({ commit }) {
      fb.lineItemsCollection.onSnapshot(
        (items) => {
          let items_array = [];
          items.forEach((doc) => {
            let object = {
              id: doc.id,
              createdOn: doc.data().createdOn,
              item_name: doc.data().item_name,
              item_number: doc.data().item_number,
              updatedOn: doc.data().updatedOn,
              quantity: doc.data().quantity,
              unit_price: doc.data().unit_price,
              programme_id: doc.data().programme_id,
              card_id: doc.data().card_id,
            };
            items_array.push(object);
          });
          commit("setLineItems", items_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },
  },
  // plugins: [createPersistedState({})],
});

export default store;
