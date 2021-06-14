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
              status: doc.data().status,
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

    async createNewProduct({ commit, state }, newProductData) {
      let product = await fb.productsCollection.add({});

      await fb.productsCollection.doc(product.id).set(newProductData);

      let programme = await fb.programmesCollection
        .doc(newProductData.programme.programme_id)
        .get();

      let programmeData = programme.data();

      programmeData.products.push({
        product_name: newProductData.name,
        product_id: product.id,
      });

      fb.programmesCollection.doc(programme.id).set(programmeData);
    },
  },
};
