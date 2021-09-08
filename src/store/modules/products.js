import * as fb from "@/firebase";

export default {
  state: {
    products: [],
  },

  getters: {
    getProducts(state) {
      return state.products;
    },

    getProductById: (state) => (id) => {
      return state.products.find((product) => product.id === id);
    },
  },

  mutations: {
    setProducts(state, value) {
      state.products = value;
    },
  },

  actions: {
    // Gets the programmes from fb
    async getProducts({ commit }) {
      fb.productsCollection.onSnapshot(
        (products) => {
          let products_array = [];
          products.forEach((doc) => {
            let object = {
              createdOn: doc.data().createdOn,
              updatedOn: doc.data().updatedOn,
              id: doc.id,
              name: doc.data().name,
              programme: doc.data().programme,
              person: doc.data().person,
              person_id: doc.data().person_id,
              status: doc.data().status,
              archived: doc.data().archived,
              POP_date: doc.data().POP_date,
              leadTime: doc.data().leadTime,
              cards: doc.data().cards,
              delivery_date: doc.data().delivery_date,
            };
            products_array.push(object);
          });
          commit("setProducts", products_array);
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
    },

    // Create new Product function fired from newProduct component
    async createNewProduct({ commit, state }, newProductData) {
      // Create empty product in fb
      let product = await fb.productsCollection.add({});

      // Set new product data in fb
      await fb.productsCollection.doc(product.id).set(newProductData);

      // Get related programme
      let programme = await fb.programmesCollection
        .doc(newProductData.programme.programme_id)
        .get();

      let programmeData = programme.data();

      // Update programme data with new product
      programmeData.products.push({
        product_name: newProductData.name,
        product_id: product.id,
      });

      fb.programmesCollection.doc(programme.id).set(programmeData);
    },
  },
};
