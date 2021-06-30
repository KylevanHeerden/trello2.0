<template v-slot:activator="{ on }">
  <div class="dashboard">
    <v-breadcrumbs :items="links" divider="/"> </v-breadcrumbs>
    <!--Have to be :items for the breadcrumbs -->
    <v-row class="noMargin" justify="center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Search Products"
          data-cypress="searchbar"
        >
        </v-text-field>
        <!--Search input-->
      </v-col>
      <v-col cols="12" md="2" class="text-center">
        <v-progress-circular
          :rotate="360"
          :size="70"
          :width="5"
          :value="budgetPercentage"
          :color="budgetColor"
          class="budgetCircle"
          data-cypress="progressCircle"
        >
          {{ `${budgetPercentage}%` }}
        </v-progress-circular>
        <p class="caption">of budget used</p>
      </v-col>
    </v-row>
    <v-container fluid>
      <v-layout row class="mb-3">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text color="grey" @click="sortBy('name')" v-on="on">
              <!--Sort by product name btn-->
              <v-icon left small>list</v-icon>
              <span class="caption text-lowercase">by product name</span>
            </v-btn>
          </template>
          <span>Sort by product name</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              small
              text
              color="grey"
              @click="sortBy('updatedOn')"
              v-on="on"
            >
              <!--Sort by edit date btn-->
              <v-icon left small>event</v-icon>
              <span class="caption text-lowercase">by product edit date</span>
            </v-btn>
          </template>
          <span>Sort by product edit date</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text color="grey" @click="sortByStatus" v-on="on">
              <!--Sort by status btn-->
              <v-icon left small>info</v-icon>
              <span class="caption text-lowercase">By status</span>
            </v-btn>
          </template>
          <span>Sort by status</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              small
              text
              color="grey"
              @click="myProductsClicked = !myProductsClicked"
              v-on="on"
              :class="{ activeBtn: myProductsClicked }"
            >
              <!--Sort by status btn-->
              <v-icon left small>person</v-icon>
              <span class="caption text-lowercase ">By My Products</span>
            </v-btn>
          </template>
          <span>Sort by users products</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <Calendar></Calendar>
        <v-btn
          small
          color="primary"
          dark
          :href="programmeBoardLink"
          data-cypress="programmeBoardLink"
          class="mx-8"
        >
          Programme Board
        </v-btn>
        <Archived></Archived>

        <!--NewProduct btn with programme as prop and @getNewProduct as emited function from child-->
        <NewProduct :programme="programme"></NewProduct>
      </v-layout>
    </v-container>

    <!--The container holding the card-links to the product page-->
    <v-container fluid class="maxHeight" data-cypress="productContainer">
      <v-card
        id="productCard"
        flat
        class=" productCard"
        v-for="product in filteredSearchProducts"
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
            <v-col cols="12" sm="2" md="2">
              <div class="caption grey--text">Edit date</div>
              <div class="card-text-black">
                {{ dateOnly(product.updatedOn) }}
              </div>
            </v-col>
            <v-col cols="12" sm="2" md="2">
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
            <v-col cols="12" sm="2" md="2">
              <v-btn
                small
                text
                color="grey"
                @click.prevent="Archive(product.id)"
                class="archiveBtn"
                :disabled="product.status != 'Quality'"
              >
                <v-icon left small>archive</v-icon>
                <span class="caption text-lowercase">Archive</span>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </router-link>
        <div></div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import NewProduct from "@/components/NewProduct.vue";
import Archived from "@/components/Archived.vue";
import Calendar from "@/components/Calendar.vue";
import { db } from "@/firebase";

export default {
  components: { NewProduct, Archived, Calendar },
  data() {
    return {
      search: "",
      fetchedProgrammeId: this.$route.params.id,
      myProductsClicked: false,
    };
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
    //General Sort function
    sortBy: function(prop) {
      this.products.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
    },
    //Sort function unique for status. This function gives priority to status based on the order in which it is in the array
    sortByStatus: function() {
      var ordering = {},
        sortOrder = [
          "Quotes",
          "Technical",
          "Purchase",
          "Procurement",
          "FollowUp",
          "Quality",
        ];
      for (var i = 0; i < sortOrder.length; i++) ordering[sortOrder[i]] = i;

      this.products.sort(function(a, b) {
        return ordering[a.status] - ordering[b.status];
      });
    },
    dateOnly: function(timestamp) {
      let fbDate = new Date(timestamp.seconds * 1000); // date object
      let day = fbDate.getDate();
      let month = fbDate.getMonth() + 1;
      let year = fbDate.getFullYear();
      let date = year + "-" + month + "-" + day;

      return date;
    },

    Archive(productId) {
      const fbProduct = db.collection("products").doc(productId);
      fbProduct.update({ archived: true });
    },
  },

  computed: {
    ...mapState({
      products: (state) => state.products.products,
      currentUser: (state) => state.profile.userProfile,
    }),
    ...mapGetters(["getProgrammeById"]),

    programme() {
      let programme = this.getProgrammeById(this.fetchedProgrammeId);
      return programme;
    },

    programmeBoardLink() {
      let link = `/programme_board/${this.fetchedProgrammeId}`;
      return link;
    },

    budgetPercentage() {
      let percentage =
        (parseFloat(this.programme.total) / parseFloat(this.programme.budget)) *
        100;
      return percentage.toFixed(2);
    },

    budgetColor() {
      if (this.budgetPercentage > 90) {
        let budgetColor = "#B71C1C";
        return budgetColor;
      } else {
        let budgetColor = "#37474f";
        return budgetColor;
      }
    },

    //Filter the products based on the programme id
    filteredProducts() {
      let filteredProducts = this.products.filter(
        (product) =>
          product.programme.programme_id === this.fetchedProgrammeId &&
          product.archived === false
      );
      return filteredProducts;
    },

    filteredProducts2() {
      let filteredProducts2 = this.filteredProducts.filter(
        (product) => product.person_id === this.currentUser.id
      );
      return filteredProducts2;
    },
    //Filters the filtered products based on the input
    filteredSearchProducts() {
      this.filteredProducts2;
      if (this.myProductsClicked) {
        return this.filteredProducts2.filter((product) => {
          let productName = product.name;
          if (productName.toLowerCase().match(this.search.toLowerCase())) {
            return product;
          }
        });
      } else {
        return this.filteredProducts.filter((product) => {
          let productName = product.name;
          if (productName.toLowerCase().match(this.search.toLowerCase())) {
            return product;
          }
        });
      }
    },

    links() {
      if (this.programme == undefined) {
        return [
          {
            text: "Programmes",
            to: "/",
          },
        ];
      } else {
        return [
          {
            text: "Programmes",
            to: "/",
          },
          {
            text: `${this.programme.name}`,
            to: "/programme/" + `${this.fetchedProgrammeId}`,
          },
        ];
      }
    },
  },
  created() {
    // This fires the action to fire the mutation to fill the store
    this.$store.dispatch("getProducts");
    this.$store.dispatch("getProgrammes");
    this.$store.dispatch("getUsers");
  },

  mounted() {},
};
</script>

<style scoped>
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

.activeBtn {
  border: solid 2px #37474f;
}

.fixedSize {
  text-align: center;
  width: 90px;
  height: 25px;
}

.budgetCircle {
  margin-bottom: 8px;
}

.caption {
  color: #9e9e9e;
}

.v-input {
  margin: 0 !important;
  padding: 0 !important;
}

.productCard {
  margin-bottom: 0px;
}

.v-label.theme--light {
  color: #9e9e9e !important;
}

.maxHeight {
  max-height: 57.5vh;
  overflow-y: auto;
  margin-top: 2rem;
}

.row {
  margin: 0px;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #d4d4d4;
  border-radius: 5px;
}

.archiveBtn {
  z-index: 2;
}
</style>
