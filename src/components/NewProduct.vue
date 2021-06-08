<template>
  <v-dialog v-model="newProductDialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mx-8"
        elevation="2"
        small
        dark
        color="primary"
        v-bind="attrs"
        v-on="on"
        data-cypress="addProductBtn"
      >
        <v-icon dark> mdi-plus </v-icon>
        Add Product
      </v-btn>
    </template>
    <v-card data-cypress="newProductModal">
      <v-card-title class="headline backgroundColorPrimary">
        New Product
      </v-card-title>
      <v-card-text class="mt-6">
        <v-form class="px-3" ref="form">
          <v-row>
            <v-col cols="12" sm="6" md="6">
              <v-text-field label="User" v-model="nameSurname" readonly>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field
                label="Programme"
                v-model="newProduct.programme_name"
                readonly
              >
              </v-text-field>
            </v-col>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Product Name"
                  v-model="newProduct.name"
                  :rules="inputRules"
                  data-cypress="newProductName"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-grey darken-3"
          text
          @click="newProductDialog = false"
          v-if="!loading"
          data-cypress="newProductCancelBtn"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue-grey darken-3"
          text
          @click="submit"
          :loading="loading"
          data-cypress="newProductAddBtn"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from "@/firebase";

export default {
  props: {
    programme: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newProductDialog: false,
      loading: false,
      newProduct: {
        name: "",
        programme_id: this.programme.id,
        programme_name: this.programme.name,
        status: "Quotes",
      },
      inputRules: [(v) => v.length >= 3 || "Minimum length is 3 characters"], //Validation rule for form
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        //Validates form before allowed to submit
        this.loading = true;

        let product = await db.collection("products").add({});

        let productData = {
          name: this.newProduct.name,
          programme: {
            programme_id: this.newProduct.programme_id,
            programme_name: this.newProduct.programme_name,
          },
          status: "Quotes",
          person: this.currentUser.name + " " + this.currentUser.surname,
          cards: [],
          createdOn: new Date(),
          updatedOn: new Date(),
        };

        db.collection("products")
          .doc(product.id)
          .set(productData);

        let programme = await db
          .collection("programmes")
          .doc(this.newProduct.programme_id)
          .get();

        let programmeData = programme.data();

        programmeData.products.push({
          product_name: this.newProduct.name,
          product_id: product.id,
        });

        db.collection("programmes")
          .doc(programme.id)
          .set(programmeData);

        this.loading = false;
        this.newProduct.name = "";
        this.newProduct.status = "";
        this.newProduct.person = "";
        this.newProductDialog = false;
      }
    },
  },

  computed: {
    currentUser() {
      let user = this.$store.getters.getUserProfile;
      return user;
    },

    nameSurname() {
      return this.currentUser.name + " " + this.currentUser.surname;
    },
  },

  mounted() {
    this.$store.dispatch("getUsers");
  },
};
</script>

<style scoped>
.backgroundColorPrimary {
  background-color: #37474f;
  color: white;
}
</style>
