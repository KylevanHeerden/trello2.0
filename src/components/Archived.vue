<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="1200"
    data-cypress="archivedDialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        small
        color="primary"
        dark
        data-cypress="archivedDialogBtn"
        v-bind="attrs"
        v-on="on"
        class="mx-8"
      >
        Archived
      </v-btn>
    </template>

    <v-card class="dialogHeight">
      <v-card-actions class="pt-2 pr-2 align-right backgroundColorPrimary">
        <v-spacer></v-spacer>
        <v-btn
          color="white"
          icon
          x-small
          text
          @click="dialog = false"
          data-cypress="cardDialogCloseBtn"
        >
          <v-icon>clear</v-icon>
        </v-btn>
      </v-card-actions>

      <v-card-title class="mb-2 headline backgroundColorPrimary">
        Archived Products
      </v-card-title>
      <v-row class="noMargin" justify="center">
        <v-col cols="12" col="4"></v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="search"
            label="Search Products"
            data-cypress="searchbar"
          >
          </v-text-field>
        </v-col>
        <!--Search input-->
        <v-col cols="12" col="4"></v-col>
      </v-row>
      <v-card-text v-if="searchedArchivedProducts != 0" class="maxHeight">
        <v-card
          id="productCard"
          flat
          class=" productCard"
          v-for="product in searchedArchivedProducts"
          :key="product.id"
          data-cypress="productCard"
        >
          <!--filteredSearchProducts is function to filter products on search-->
          <router-link :to="{ name: 'Product', params: { id: product.id } }">
            <v-row :class="`product ${product.status}`">
              <v-col cols="12" sm="3" md="3">
                <div class="caption grey--text">Product Name</div>
                <div class="card-text-black">{{ product.name }}</div>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <div class="caption grey--text">Person</div>
                <div class="card-text-black">{{ product.person }}</div>
              </v-col>
              <v-col cols="12" sm="3" md="2">
                <div class="caption grey--text">Edit date</div>
                <div class="card-text-black">
                  {{ dateOnly(product.updatedOn) }}
                </div>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-chip
                  small
                  :color="`${chipColor(product.status)}`"
                  :class="
                    `${product.status} white--text caption my-2 fixedSize justify-center`
                  "
                >
                  {{ product.status }}
                </v-chip>
                <!--Here we bind the class so that the color of chip changes by status-->
              </v-col>
              <v-col cols="12" sm="1" md="1">
                <span>
                  <v-btn
                    small
                    text
                    color="grey"
                    @click.prevent="Unarchive(product.id)"
                  >
                    <v-icon left small>unarchive</v-icon>
                    <span class="caption text-lowercase">Unarchive</span>
                  </v-btn>
                </span>
              </v-col>
            </v-row>
          </router-link>
        </v-card>
      </v-card-text>
      <v-card-text v-else>
        <v-row justify="center" align-content="center" class="grey--text">
          No Products Archived
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from "@/firebase";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      search: "",
      dialog: false,
      fetchedProgrammeId: this.$route.params.id,
    };
  },
  computed: {
    ...mapState({
      products: (state) => state.products.products,
    }),
    ...mapGetters(["getProgrammeById"]),

    programme() {
      let programme = this.getProgrammeById(this.fetchedProgrammeId);
      return programme;
    },

    filteredProducts() {
      let filteredProducts = this.products.filter(
        (product) =>
          product.programme.programme_id === this.fetchedProgrammeId &&
          product.archived === true
      );
      return filteredProducts;
    },

    searchedArchivedProducts() {
      return this.filteredProducts.filter((product) => {
        let productName = product.name;
        if (productName.toLowerCase().match(this.search.toLowerCase())) {
          return product;
        }
      });
    },
  },

  methods: {
    //Function to get the color based on status given to function
    chipColor: function(status) {
      const colors = {
        Quotes: "teal lighten-1",
        Technical: "amber accent-2",
        Purchase: "orange",
        Procurement: "red",
        FollowUp: "light-green lighten-1",
        Quality: "indigo lighten-1",
      };

      return `${colors[status]}`;
    },

    dateOnly: function(timestamp) {
      let fbDate = new Date(timestamp.seconds * 1000); // date object
      let day = fbDate.getDate();
      let month = fbDate.getMonth() + 1;
      let year = fbDate.getFullYear();
      let date = year + "-" + month + "-" + day;

      return date;
    },

    Unarchive(productId) {
      const fbProduct = db.collection("products").doc(productId);
      fbProduct.update({ archived: false });
    },
  },

  mounted() {},
};
</script>

<style scoped>
.backgroundColorPrimary {
  background-color: #37474f;
  color: white;
}

.dialogHeight {
  max-height: 70vh;
  min-height: 70vh;
}

.productCard {
  margin-bottom: 0px;
}

.product.Quotes {
  border-left: 4px solid #26a69a;
}

.product.Technical {
  border-left: 4px solid #f8d04d;
}

.product.Purchase {
  border-left: 4px solid orange;
}

.product.Procurement {
  border-left: 4px solid tomato;
}

.product.FollowUp {
  border-left: 4px solid #9ccc65;
}

.product.Quality {
  border-left: 4px solid #5c6bc0;
}

.maxHeight {
  max-height: 40vh;
  overflow-y: auto;
  margin-top: 2rem;
}

.row {
  margin: 0px;
}
</style>
