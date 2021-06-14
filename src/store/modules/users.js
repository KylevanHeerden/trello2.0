import * as fb from "@/firebase";

export default {
  state: {
    users: [],
  },

  getters: {
    user(state) {
      return state.user;
    },
  },

  mutations: {
    setUsers(state, value) {
      state.users = value;
    },
  },

  actions: {
    async getUsers({ commit }) {
      fb.usersCollection.onSnapshot(
        (users) => {
          let users_array = [];
          users.forEach((doc) => {
            let object = {
              id: doc.id,
              createdOn: doc.data().createdOn,
              name: doc.data().name,
              surname: doc.data().surname,
              updatedOn: doc.data().updatedOn,
              teams: doc.data().teams,
              slack_id: doc.data().slack_id,
            };
            users_array.push(object);
          });
          commit("setUsers", users_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },
  },
};