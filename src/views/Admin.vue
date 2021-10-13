<template>
  <v-container class="adminContainer">
    <v-row align-content="center" justify="center">
      <v-card elevation="2" width="50%">
        <v-card-text class="v-card-text">
          Search procurement cards by:
          <v-radio-group v-model="searchOption" row mandatory>
            <v-radio label="PO Number" value="PO#"></v-radio>
            <v-radio label="Supplier" value="Supplier"></v-radio>
            <v-radio label="Total Inc VAT" value="Value"></v-radio>
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
            :rule="inputRulesRequired"
          ></v-select>
        </v-card-text>

        <v-card-actions class="justify-end v-card-actions">
          <v-btn
            small
            dark
            color="primary"
            :href="url"
            :loading="loading"
            @click="downloadCSV()"
          >
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
            :disabled="false"
            @click="addField()"
            small
            dark
            class="addFieldBtn"
          >
            Add Field To Cards
          </v-btn>
          <v-btn
            :disabled="false"
            @click="addField2()"
            small
            dark
            class="addFieldBtn"
          >
            Add Field To Products
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row> -->

    <!-- <v-row align-content="center" justify="center" class="adminRow">
      <v-card elevation="2" width="50%">
        <v-card-text>
          Remove all duplicates from users Teams array:
        </v-card-text>
        <v-card-actions class="justify-end v-card-actions">
          <v-btn
            :disabled="false"
            @click="clearTeamsDuplicates()"
            small
            dark
            class="addFieldBtn"
          >
            Clear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row> -->

    <!-- <v-row align-content="center" justify="center" class="adminRow">
      <v-card elevation="2" width="50%">
        <v-card-text>
          Change the comment in Quality Approval to 5:
        </v-card-text>
        <v-card-actions class="justify-end v-card-actions">
          <v-btn
            :disabled="false"
            @click="changeComment5()"
            small
            dark
            class="addFieldBtn"
          >
            Change
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
      inputRulesRequired: [(v) => !!v || "Required"],
      loading: false,
      programme: "",
      search: "",
      searchOption: null,
    };
  },
  computed: {
    ...mapState({
      cards: (state) => state.cards.cards,
      users: (state) => state.users.users,
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
          let cardTotalIncVAT = card.total_inc_vat;
          if (cardTotalIncVAT == null) {
            return;
          } else if (cardTotalIncVAT.match(this.search)) {
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
    async addField() {
      db.collection("cards")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (doc.data().list_id == 3) {
              doc.ref.update({
                payments: [
                  {
                    payment: "Final Payment",
                    value: doc.data().total_inc_vat,
                    date: "",
                    committed: false,
                  },
                ],
              });
            } else if (doc.data().list_id == 4 || doc.data().list_id == 5) {
              doc.ref.update({
                payments: [
                  {
                    payment: "Final Payment",
                    value: doc.data().total_inc_vat,
                    date: "2021-08-31",
                    committed: false,
                  },
                ],
              });
            } else if (doc.data().list_id == 6) {
              doc.ref.update({
                payments: [
                  {
                    payment: "Final Payment",
                    value: doc.data().total_inc_vat,
                    date: "2021-08-31",
                    committed: true,
                  },
                ],
              });
            }
          });

          alert("I am done!");
        });
      return "Done!";
    },

    async addField2() {
      db.collection("products")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({
              delivery_date: "",
            });

            if (doc.data().cards.length !== 0) {
              let cardID = doc.data().cards.at(0).card_id;

              db.collection("cards")
                .doc(cardID)
                .get()
                .then(function(card) {
                  if (card.data()) {
                    if (doc.data().status == "Procurement") {
                      doc.ref.update({
                        payments: [
                          {
                            payment: "Final Payment",
                            value: card.data().total_inc_vat,
                            date: "2021-09-31",
                            committed: false,
                          },
                        ],
                      });
                    } else if (doc.data().status == "FollowUp") {
                      if (doc.data().POP_date !== null) {
                        doc.ref.update({
                          payments: [
                            {
                              payment: "Final Payment",
                              value: card.data().total_inc_vat,
                              date: moment(doc.data().POP_date.toDate()).format(
                                "YYYY-MM-DD"
                              ),
                              committed: false,
                            },
                          ],
                        });
                      } else {
                        doc.ref.update({
                          payments: [
                            {
                              payment: "Final Payment",
                              value: card.data().total_inc_vat,
                              date: "2021-08-31",
                              committed: false,
                            },
                          ],
                        });
                      }
                    } else if (doc.data().status == "Quality") {
                      doc.ref.update({
                        payments: [
                          {
                            payment: "Final Payment",
                            value: card.data().total_inc_vat,
                            date: "2021-08-31",
                            committed: true,
                          },
                        ],
                      });
                    }
                  }
                });
            }
          });

          alert("I am done!");
        });
      return "Done!";
    },

    async changeComment5() {
      db.collection("comments")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            if (doc.data().position == 4) {
              doc.ref.update({
                position: 5,
              });
            }
          });

          alert("I am done!");
        });
      return "Done!";
    },

    // Format fb timestamp to Do MMM YYYY
    dateFormat(param) {
      let date = moment(param.toDate()).format("Do MMM YYYY");
      return date;
    },

    downloadCSV() {
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
        this.programme = "";
      }, 3000);
    },

    // clearTeamsDuplicates() {
    //   this.users.forEach((user) => {
    //     var result = user.teams.reduce((unique, o) => {
    //       if (
    //         !unique.some(
    //           (obj) =>
    //             obj.programme_name === o.programme_name &&
    //             obj.team_id === o.team_id &&
    //             obj.team_name === o.team_name
    //         )
    //       ) {
    //         unique.push(o);
    //       }
    //       return unique;
    //     }, []);

    //     const userRef = db.collection("users").doc(user.id);

    //     userRef.update({
    //       teams: result,
    //     });
    //   });
    // },
  },

  mounted() {
    this.$store.dispatch("getProgrammes");
    this.$store.dispatch("getCards");
    this.$store.dispatch("getUsers");
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
