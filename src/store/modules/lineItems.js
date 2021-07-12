import * as fb from "@/firebase";

export default {
  state: {
    lineItems: [],
  },
  getters: {
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
    setLineItems(state, value) {
      state.lineItems = value;
    },
  },
  actions: {
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
              exc_VAT: doc.data().exc_VAT,
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
};
