<template>
  <v-container class="adminContainer">
    <v-row align-content="center" justify="center">
      <v-card elevation="2" width="50%">
        <v-card-text class="v-card-text">
          Search procurement cards by:
          <v-radio-group v-model="searchOption" row mandatory>
            <v-radio label="PO Number" value="PO#"></v-radio>
            <v-radio label="Supplier" value="Supplier"></v-radio>
            <v-radio label="Total Exc VAT" value="Value"></v-radio>
          </v-radio-group>
          <v-text-field v-model="search" data-cypress="searchbar">
          </v-text-field>
        </v-card-text>
        <v-card-actions
          v-if="search.length > 2"
          class="justify-center v-card-actions"
        >
          <v-virtual-scroll height="400" item-height="75" :items="searchCards">
            <template v-slot:default="{ item }">
              <v-list width="60%" rounded class="searchCardList">
                <v-list-item-group>
                  <v-list-item
                    :key="item.PO_number"
                    class="list-item"
                    router
                    :to="`/product/${item.product_id}`"
                  >
                    <v-list-item-content class="text-center">
                      <v-list-item-title
                        v-text="`${item.name}`"
                      ></v-list-item-title>
                      <v-list-item-subtitle v-if="searchOption === 'PO#'"
                        >PO#: {{ item.PO_number }}</v-list-item-subtitle
                      >
                      <v-list-item-subtitle v-else
                        >Supplier:
                        {{ item.supplier_name }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </template>
          </v-virtual-scroll>
        </v-card-actions>
      </v-card>
    </v-row>

    <v-row align-content="center" justify="center" class="adminRow">
      <v-card elevation="2" width="50%">
        <v-card-text class="v-card-text">
          Select the programme to export as CSV:
          <v-select
            v-model="programme"
            :items="getProgrammes"
            item-text="text"
            item-value="value"
          ></v-select>
        </v-card-text>

        <v-card-actions class="justify-end v-card-actions">
          <v-btn small dark color="primary" :href="url">
            Export
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <!-- <v-row align-content="center" justify="center" class="adminRow">
      <v-card elevation="2" width="50%">
        <v-card-text>
          Add a field to each doc in firebase:
        </v-card-text>
        <v-card-actions class="justify-end v-card-actions">
          <v-btn
            :disabled="true"
            @click="addField()"
            small
            dark
            class="addFieldBtn"
          >
            Add Field
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row> -->
  </v-container>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapGetters, mapState } from "vuex";
import { db } from "@/firebase";
import moment from "moment";

export default {
  name: "Admin",
  components: {},
  data() {
    return {
      clicked: false,
      programme: "",
      search: "",
      searchOption: null,
    };
  },
  computed: {
    ...mapState({
      cards: (state) => state.cards.cards,
    }),

    getProgrammes() {
      let select_options = [];
      this.$store.getters.getProgrammes.map((programme) => {
        select_options.push({
          text: programme.name,
          value: programme.id,
          disabled: false,
        });
      });
      return select_options;
    },

    searchCards() {
      if (this.searchOption == "PO#") {
        let searchCards = this.cards.filter((card) => {
          let cardPO = card.PO_number;
          if (cardPO == null) {
            return;
          } else if (cardPO.toLowerCase().match(this.search.toLowerCase())) {
            return card;
          }
        });

        return searchCards.sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));
      } else if (this.searchOption == "Supplier") {
        let searchCards = this.cards.filter((card) => {
          let cardSupplierName = card.supplier_name;
          if (cardSupplierName == null) {
            return;
          } else if (
            cardSupplierName.toLowerCase().match(this.search.toLowerCase())
          ) {
            return card;
          }
        });

        return searchCards.sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));
      } else if (this.searchOption == "Value") {
        let searchCards = this.cards.filter((card) => {
          let cardTotalExcVAT = card.total_exc_vat;
          if (cardTotalExcVAT == null) {
            return;
          } else if (cardTotalExcVAT.match(this.search)) {
            return card;
          }
        });

        return searchCards.sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));
      }
    },

    url() {
      return `https://${process.env.VUE_APP_EXPORT_LINK}.cloudfunctions.net/csvJsonReport/${this.programme}`;
    },
  },

  methods: {
    // The addField function adds a field to all the docs in a firebase collection.
    // async addField() {
    //   db.collection("cards")
    //     .get()
    //     .then(function(querySnapshot) {
    //       querySnapshot.forEach(function(doc) {
    //         doc.ref.update({
    //           payments: [
    //             {
    //               payment: "Final Payment",
    //               value: doc.data().total_inc_vat,
    //               date: "",
    //               committed: false,
    //             },
    //           ],
    //         });
    //       });
    //     });
    //   return "Done!";
    // },

    async addField() {
      db.collection("products")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({
              delivery_date: "",
            });
          });
        });
      return "Done!";
    },

    // Format fb timestamp to Do MMM YYYY
    dateFormat(param) {
      let date = moment(param.toDate()).format("Do MMM YYYY");
      return date;
    },
  },

  mounted() {
    this.$store.dispatch("getProgrammes");
    this.$store.dispatch("getCards");
  },
};
</script>

<style scoped>
.adminContainer {
  color: grey;
}

.theme--light.v-data-table {
  background-color: #f5f5f5;
}

.theme--light.v-data-table.v-data-table--fixed-header thead th {
  background-color: #f5f5f5;
}

.red {
  background-color: red;
}

.yellow {
  background-color: yellow;
}

.blue {
  background-color: blue;
}

.addFieldBtn {
  background-color: #37474f !important;
}

.adminRow {
  margin-top: 2rem;
}

.v-card-text {
  padding: 2rem;
  padding-bottom: 0rem;
}

.v-card-actions {
  padding-bottom: 1rem;
  padding-right: 2rem;
}

.searchCardList {
  position: absolute;
  left: 20%;
}

.list-item {
  border: solid 1px #cfd8dc;
  background-color: #cfd8dc;
  color: white;
}

.list-item:hover {
  border: solid 2px #37474f;
}
</style>
