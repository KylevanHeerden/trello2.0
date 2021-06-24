import * as fb from "@/firebase";

export default {
  state: {
    userProfile: {},
  },

  getters: {
    getUserProfile(state) {
      return state.userProfile;
    },
  },

  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
  },

  actions: {
    async fetchUserProfile({ commit }, user) {
      let userColProf = await fb.usersCollection.doc(user.uid).get();

      let userProfile = {
        id: user.uid,
        name: userColProf.data().name,
        surname: userColProf.data().surname,
        email: user.email,
        teams: userColProf.data().teams,
        admin: userColProf.data().admin,
        slack_id: userColProf.data().slack_id,
        slackNotify: userColProf.data().slackNotify,
        emailNotify: userColProf.data().emailNotify,
      };

      commit("setUserProfile", userProfile);
    },
  },
};
