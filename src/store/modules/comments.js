import * as fb from "@/firebase";

export default {
  state: {
    comments: [],
  },
  getters: {
    getComments(state) {
      return state.comments;
    },

    getCommentsByCardId: (state) => (id) => {
      return state.comments.find((comment) => comment.card_id == id);
    },
  },
  mutations: {
    setComments(state, value) {
      state.comments = value;
    },
  },
  actions: {
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
  },
};
