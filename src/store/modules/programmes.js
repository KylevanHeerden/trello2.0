import * as fb from "@/firebase";

export default {
  state: {
    links: [
      {
        text: "Programmes",
        to: "/",
      },
    ],
    programmes: [],
  },

  getters: {
    getProgrammes(state) {
      return state.programmes;
    },

    getProgrammeById: (state) => (id) => {
      return state.programmes.find((programme) => programme.id === id);
    },
  },

  mutations: {
    setProgrammes(state, value) {
      state.programmes = value;
    },
  },

  actions: {
    async getProgrammes({ commit }) {
      fb.programmesCollection.onSnapshot(
        (programmes) => {
          let programmes_array = [];
          programmes.forEach((doc) => {
            let object = {
              id: doc.id,
              name: doc.data().name,
              team: {
                team_id: doc.data().team.team_id,
                team_name: doc.data().team.team_name,
              },
              products: doc.data().products,
              budget: doc.data().budget,
              total: doc.data().total,
            };
            programmes_array.push(object);
          });
          commit("setProgrammes", programmes_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },

    async createNewProgramme({ commit, state }, payload) {
      await fb.programmesCollection
        .doc(payload.teamData.programme.programme_id)
        .set(payload.progData);

      const teamRef = await fb.teamsCollection.doc(
        payload.progData.team.team_id
      );

      await teamRef.set(payload.teamData);

      payload.teamData.technical_approver.users.forEach((user) => {
        this.setAddTeamtoUsersTeams(
          user.value,
          payload.progData.team.team_id,
          payload.progData.team.team_name,
          payload.progData.name
        );
      });

      payload.teamData.purchase_approver.users.forEach((user) => {
        this.setAddTeamtoUsersTeams(
          user.value,
          payload.progData.team.team_id,
          payload.progData.team.team_name,
          payload.progData.name
        );
      });

      payload.teamData.procurer.users.forEach((user) => {
        this.setAddTeamtoUsersTeams(
          user.value,
          payload.progData.team.team_id,
          payload.progData.team.team_name,
          payload.progData.name
        );
      });
    },
  },

  async setAddTeamtoUsersTeams(user_id, team_id, team_name, programmeName) {
    console.log(user_id, team_id, team_name, programmeName);
    const user = await fb.usersCollection.doc(user_id).get();

    const userData = user.data();

    let user_teams_array = userData.teams;

    if (user_teams_array.length == 0) {
      user_teams_array.push({
        //add the map of the team id and name to the user
        team_id: team_id,
        team_name: team_name,
        programme_name: programmeName,
      });

      userData.updatedOn = new Date();

      fb.usersCollection //write the updated fields to the user doc
        .doc(user_id)
        .set(userData);
    } else {
      user_teams_array.forEach((k) => {
        if (k.team_id == team_id) {
          ("");
        } else {
          user_teams_array.push({
            //add the map of the team id and name to the user
            team_id: team_id,
            team_name: team_name,
            programme_name: programmeName,
          });

          userData.updatedOn = new Date();

          fb.usersCollection //write the updated fields to the user doc
            .doc(user_id)
            .set(userData);
        }
      });
    }
  },
};
