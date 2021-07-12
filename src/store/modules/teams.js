import * as fb from "@/firebase";

export default {
  state: {
    teams: [],
  },
  getters: {
    getTeams(state) {
      return state.teams;
    },

    getTeams(state) {
      return state.teams;
    },

    getTeamsByProgrammeId: (state) => (id) => {
      return state.teams.find((team) => team.programme.programme_id == id);
    },
  },
  mutations: {
    setTeams(state, value) {
      state.teams = value;
    },
  },
  actions: {
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
  },
};
