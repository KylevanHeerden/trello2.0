import * as fb from "@/firebase";

export default {
  state: {
    users: [],
  },

  getters: {
    getUsers(state) {
      return state.users;
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
              slackNotify: doc.data().slackNotify,
              emailNotify: doc.data().emailNotify,
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
