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
  },
};
