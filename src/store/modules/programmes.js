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
    // Gets the programmes from fb
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
              programme_type: doc.data().programme_type,
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

    async createNewProgramme({ dispatch }, payload) {
      // Set the programme doc with payload data from newProgramme component
      await fb.programmesCollection
        .doc(payload.teamData.programme.programme_id)
        .set(payload.progData);

      // Set the team doc with payload data from newProgramme component
      const teamRef = await fb.teamsCollection.doc(
        payload.progData.team.team_id
      );

      await teamRef.set(payload.teamData);

      // For technical approval user add this team to their team array
      payload.teamData.technical_approver.users.forEach((user) => {
        let teamPayload = {
          user_id: user.value,
          team_id: payload.progData.team.team_id,
          team_name: payload.progData.team.team_name,
          programmeName: payload.progData.name,
        };
        dispatch("setAddTeamtoUsersTeams", teamPayload);
      });

      // For purchase approval user add this team to their team array
      payload.teamData.purchase_approver.users.forEach((user) => {
        let teamPayload = {
          user_id: user.value,
          team_id: payload.progData.team.team_id,
          team_name: payload.progData.team.team_name,
          programmeName: payload.progData.name,
        };
        dispatch("setAddTeamtoUsersTeams", teamPayload);
      });

      // For procurer user add this team to their team array
      payload.teamData.procurer.users.forEach((user) => {
        let teamPayload = {
          user_id: user.value,
          team_id: payload.progData.team.team_id,
          team_name: payload.progData.team.team_name,
          programmeName: payload.progData.name,
        };
        dispatch("setAddTeamtoUsersTeams", teamPayload);
      });
    },

    async setAddTeamtoUsersTeams({ dispatch }, payload) {
      const user = await fb.usersCollection.doc(payload.user_id).get();

      const userData = user.data();

      let user_teams_array = userData.teams;

      if (user_teams_array.length === 0) {
        user_teams_array.push({
          //add the map of the team id and name to the user
          team_id: payload.team_id,
          team_name: payload.team_name,
          programme_name: payload.programmeName,
        });

        userData.updatedOn = new Date();

        fb.usersCollection //write the updated fields to the user doc
          .doc(payload.user_id)
          .set(userData);
      } else {
        user_teams_array.forEach((k) => {
          if (k.team_id == payload.team_id) {
            ("");
          } else {
            user_teams_array.push({
              //add the map of the team id and name to the user
              team_id: payload.team_id,
              team_name: payload.team_name,
              programme_name: payload.programmeName,
            });

            userData.updatedOn = new Date();

            fb.usersCollection //write the updated fields to the user doc
              .doc(payload.user_id)
              .set(userData);
          }
        });
      }
    },
  },
};
