import * as fb from "@/firebase";

export default {
  state: {
    lists: [],
  },
  getters: {
    getLits(state) {
      return state.lists;
    },
  },
  mutations: {
    setLists(state, value) {
      state.lists = value;
    },
  },
  actions: {
    async getLists({ commit }) {
      fb.listsCollection.onSnapshot(
        (lists) => {
          let lists_array = [];
          lists.forEach((doc) => {
            let object = {
              name: doc.data().name,
              number: doc.data().number,
              status: doc.data().status,
            };
            lists_array.push(object);
          });

          commit("setLists", lists_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },

    removelist({ dispatch }, listId) {
      fb.listsCollection.doc(listId).delete();

      dispatch("getlists");
    },
  },
};
