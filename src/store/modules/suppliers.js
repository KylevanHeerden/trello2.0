import * as fb from "@/firebase";

// module for the suppliers
export default {
  state: {
    suppliers: [],
  },
  getters: {
    getSuppliers(state) {
      return state.suppliers;
    },

    getSuppliersByCardId: (state) => (id) => {
      return state.suppliers.find((supplier) => supplier.card_id == id);
    },
  },
  mutations: {
    setSuppliers(state, value) {
      state.suppliers = value;
    },
  },
  actions: {
    async getSuppliers({ commit }) {
      fb.suppliersCollection.onSnapshot(
        (suppliers) => {
          let suppliers_array = [];
          suppliers.forEach((doc) => {
            let object = {
              id: doc.id,
              supplier_name: doc.data().supplier_name,
              contact_person: doc.data().contact_person,
              contact_number: doc.data().contact_number,
              contact_email: doc.data().contact_email,
              createdOn: doc.data().createdOn,
              updatedOn: doc.data().updatedOn,
            };
            suppliers_array.push(object);
          });
          commit("setSuppliers", suppliers_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },
  },
};
