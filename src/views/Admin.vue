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
                    :to="`/product/{item.product_id}`"
                  >
                    <v-list-item-content class="text-center">
                      <v-list-item-title
                        v-text="`{item.name}`"
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

    <v-row align-content="center" justify="center" class="adminRow">
      <v-card elevation="2" width="50%">
        <v-card-text>
          Admin:
        </v-card-text>
        <v-card-actions class="justify-end v-card-actions">
          <v-btn
            :disabled="false"
            @click="admin()"
            small
            dark
            class="addFieldBtn"
          >
            Admin
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
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
      randomNames: [],
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
      return `https://{process.env.VUE_APP_EXPORT_LINK}.cloudfunctions.net/csvJsonReport/{this.programme}`;
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

    // async admin() {
    //   var cards_ids = [];
    //   db.collection("cards")
    //     .get()
    //     .then(function(querySnapshot) {
    //       var i = 0;
    //       querySnapshot.forEach((doc) => {
    //         i += 1;

    //         var newItems = [];

    //         doc.data().lineItems.forEach((item) => {
    //           var newItem = {
    //             card_id: item.card_id,
    //             createdOn: item.createdOn,
    //             id: item.id == undefined ? "1234567" : item.id,
    //             item_name: `Item {i}.1`,
    //             item_number: item.item_number,
    //             programme_id: item.programme_id,
    //             quantity: item.quantity,
    //             unit_price: item.unit_price,
    //             updatedOn: item.updatedOn,
    //           };

    //           newItems.push(newItem);
    //         });

    //         cards_ids.push({ id: doc.id, i: i, lineItems: newItems });

    //         // // console.log(newCard);

    //         // doc.ref.update(newCard);
    //       });

    //       var batch = db.batch();

    //       cards_ids.forEach((id) => {
    //         var docRef = db.collection("cards").doc(id.id);

    //         var newCard = {
    //           POP: [],
    //           contact_number: "1234567890",
    //           contact_person: "Bob Smith",
    //           files: [
    //             {
    //               file_name: `Quote {id.i}`,
    //               link:
    //                 "https://firebasestorage.googleapis.com/v0/b/trellov2.appspot.com/o/sample.pdf?alt=media&token=3863cdf9-28a8-4056-b3d1-a521ad9449f1",
    //             },
    //           ],
    //           files_count: 1,
    //           lineItems: id.lineItems,
    //           name: `Quote {id.i}`,
    //           nano_item_description: `Simple description of item {id.i}`,
    //           purchase_order: [
    //             {
    //               file_name: `Purchase Order {id.i}`,
    //               link:
    //                 "https://firebasestorage.googleapis.com/v0/b/trellov2.appspot.com/o/sample.pdf?alt=media&token=3863cdf9-28a8-4056-b3d1-a521ad9449f1",
    //             },
    //           ],
    //           supplier_name: "Jack Hall",
    //           supplier_email: "jack@supplier.com",
    //           supplier_quote_num: "123456",
    //           team: {
    //             name: "Team Procurement",
    //             procurer: {
    //               listRefId: 5,
    //               users: [
    //                 {
    //                   slack_id: "U010PGJC431",
    //                   text: "John Duck",
    //                   value: "V8Ylm7toh4bldT7KdgnHg6OX4Iv2",
    //                 },
    //               ],
    //             },
    //             purchase_approver: {
    //               listRefId: 4,
    //               users: [
    //                 {
    //                   slack_id: "U010PGJC431",
    //                   text: "Sammy Smith",
    //                   value: "7ZY2QIfEVUQvbYUCHutKu3PasDF3",
    //                 },
    //               ],
    //             },
    //             technical_approver: {
    //               listRefId: 3,
    //               users: [
    //                 {
    //                   slack_id: "U010PGJC431",
    //                   text: "Alison Ralph",
    //                   value:
    //                     "V8Ylm7Yj8iCheaZcWY5jo1wrLgFubMPir2toh4bldT7KdgnHg6OX4Iv2",
    //                 },
    //               ],
    //             },
    //             receiver: {},
    //             quality_approver: {
    //               listRefId: 6,
    //               user: {
    //                 slack_id: "U010PGJC431",
    //                 text: "Alison Ralph",
    //                 value:
    //                   "V8Ylm7Yj8iCheaZcWY5jo1wrLgFubMPir2toh4bldT7KdgnHg6OX4Iv2",
    //               },
    //             },
    //           },
    //         };

    //         batch.update(docRef, newCard);
    //       });

    //       batch.commit().then(() => {
    //         alert("I am done!");
    //       });
    //     });
    //   return "Done!";
    // },

    // async admin() {
    //   var doc_ids = [];

    //   var names = this.randomNames;

    //   db.collection("comments")
    //     .get()
    //     .then(function(querySnapshot) {
    //       var i = 0;
    //       querySnapshot.forEach((doc) => {
    //         i += 1;

    //         doc_ids.push({ id: doc.id, i: i });
    //       });

    //       var batch = db.batch();

    //       doc_ids.forEach((id) => {
    //         var docRef = db.collection("comments").doc(id.id);

    //         var newComment = {
    //           text:
    //             "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent non rhoncus nulla, ut pretium orci.",
    //           username: names[id.i],
    //         };

    //         batch.update(docRef, newComment);
    //       });

    //       batch.commit().then(() => {
    //         alert("I am done!");
    //       });
    //     });
    //   return "Done!";
    // },

    // async admin() {
    //   var doc_ids = [];

    //   db.collection("line_items")
    //     .get()
    //     .then(function(querySnapshot) {
    //       var i = 0;
    //       querySnapshot.forEach((doc) => {
    //         i += 1;

    //         doc_ids.push({ id: doc.id, i: i });
    //       });

    //       var batch = db.batch();

    //       doc_ids.forEach((id) => {
    //         if (id.i < 500) {
    //           var docRef = db.collection("line_items").doc(id.id);

    //           var newComment = {
    //             item_name: `Item ${id.i}`,
    //           };

    //           batch.update(docRef, newComment);
    //         }
    //       });

    //       batch.commit().then(() => {
    //         alert("I am done!");
    //       });

    //       var batch2 = db.batch();

    //       doc_ids.forEach((id) => {
    //         if (id.i >= 500) {
    //           var docRef = db.collection("line_items").doc(id.id);

    //           var newComment = {
    //             item_name: `Item ${id.i}`,
    //           };

    //           batch2.update(docRef, newComment);
    //         }
    //       });

    //       batch2.commit().then(() => {
    //         alert("I am done!");
    //       });
    //     });
    //   return "Done!";
    // },

    // async admin() {
    //   var doc_ids = [];

    //   var names = this.randomNames;

    //   db.collection("users")
    //     .get()
    //     .then(function(querySnapshot) {
    //       var i = 0;
    //       querySnapshot.forEach((doc) => {
    //         i += 1;

    //         var newTeams = [];

    //         doc.data().teams.forEach((team) => {
    //           var newTeam = {
    //             programme_name: "Programme",
    //             team_id: team.team_id,
    //             team_name: "Team Procurement",
    //           };

    //           newTeams.push(newTeam);
    //         });

    //         doc_ids.push({ id: doc.id, i: i, teams: newTeams });
    //       });

    //       var batch = db.batch();

    //       doc_ids.forEach((id) => {
    //         var docRef = db.collection("users").doc(id.id);

    //         var name = names[i].split(" ");

    //         var newTeam = {
    //           email: `user${i}@mail.com`,
    //           name: name[0],
    //           surname: name[1],
    //           teams: id.teams,
    //         };

    //         batch.update(docRef, newTeam);
    //       });

    //       batch.commit().then(() => {
    //         alert("I am done!");
    //       });
    //     });
    //   return "Done!";
    // },

    async admin() {
      var doc_ids = [];

      var names = this.randomNames;

      db.collection("products")
        .get()
        .then(function(querySnapshot) {
          var i = 0;
          querySnapshot.forEach((doc) => {
            i += 1;

            var programmeData = {
              programme_id: doc.data().programme.programme_id,
              programme_name: `Programme ${i}`,
            };

            doc_ids.push({
              id: doc.id,
              i: i,

              programme: programmeData,
            });
          });

          var batch = db.batch();

          doc_ids.forEach((id) => {
            var docRef = db.collection("products").doc(id.id);

            var newProduct = {
              name: `Product ${id.i}`,
              cards: [],
              programme: id.programme,
              person: names[id.i],
            };

            batch.update(docRef, newProduct);
          });

          batch.commit().then(() => {
            alert("I am done!");
          });
        });
      return "Done!";
    },

    generateNames() {
      let firstNameCollection = [
        "Harry",
        "Ross",
        "Bruce",
        "Cook",
        "Carolyn",
        "Morgan",
        "Albert",
        "Walker",
        "Randy",
        "Reed",
        "Larry",
        "Barnes",
        "Lois",
        "Wilson",
        "Jesse",
        "Campbell",
        "Ernest",
        "Rogers",
        "Theresa",
        "Patterson",
        "Henry",
        "Simmons",
        "Michelle",
        "Perry",
        "Frank",
        "Butler",
        "Shirley",
      ];

      let middleNameCollection = [
        "Brooks",
        "Rachel",
        "Edwards",
        "Christopher",
        "Perez",
        "Thomas",
        "Baker",
        "Sara",
        "Moore",
        "Chris",
        "Bailey",
        "Roger",
        "Johnson",
        "Marilyn",
        "Thompson",
        "Anthony",
        "Evans",
        "Julie",
        "Hall",
        "Paula",
        "Phillips",
        "Annie",
        "Hernandez",
        "Dorothy",
        "Murphy",
        "Alice",
        "Howard",
      ];

      let lastNameCollection = [
        "Ruth",
        "Jackson",
        "Debra",
        "Allen",
        "Gerald",
        "Harris",
        "Raymond",
        "Carter",
        "Jacqueline",
        "Torres",
        "Joseph",
        "Nelson",
        "Carlos",
        "Sanchez",
        "Ralph",
        "Clark",
        "Jean",
        "Alexander",
        "Stephen",
        "Roberts",
        "Eric",
        "Long",
        "Amanda",
        "Scott",
        "Teresa",
        "Diaz",
        "Wanda",
        "Thomas",
      ];

      let fullNameCollection = [];

      for (let i = 0; i < 1000; i++) {
        let newFirstName =
          firstNameCollection[
            this.getRndInteger(0, firstNameCollection.length - 1)
          ];
        let newLastName =
          lastNameCollection[
            this.getRndInteger(0, lastNameCollection.length - 1)
          ];

        fullNameCollection.push(newFirstName + " " + newLastName);
      }

      this.randomNames = fullNameCollection;
    },

    getRndInteger(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
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
    this.generateNames();
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
