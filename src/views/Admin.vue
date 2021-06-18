<template>
  <v-container class="adminContainer">
    <v-row align-content="center" justify="center">
      <v-card elevation="2" width="50%">
        <v-card-text class="v-card-text">
          Search procurement cards by PO number:
          <v-text-field v-model="search" data-cypress="searchbar">
          </v-text-field>
        </v-card-text>
        <v-card-actions
          v-if="search.length > 2"
          class="justify-center v-card-actions"
        >
          <v-list width="70%" rounded>
            <v-list-item-group>
              <v-list-item
                v-for="card in searchCards"
                :key="card.name"
                class="list-item"
                router
                :to="`/product/${card.product_id}`"
              >
                <!-- <v-list-item-icon>
                  <v-icon small>
                    fiber_manual_record
                  </v-icon>
                </v-list-item-icon> -->
                <v-list-item-content class="text-center">
                  <v-list-item-title
                    v-text="`${card.name}`"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="`PO#: ${card.PO_number}`"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-actions>
      </v-card>
    </v-row>

    <v-row align-content="center" justify="center" class="adminRow">
      <v-card elevation="2" width="50%">
        <v-card-text class="v-card-text">
          Select the programme to export as CSV:
          <v-select v-model="programme" :items="getProgrammes"></v-select>
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

export default {
  name: "Admin",
  components: {},
  data() {
    return {
      programme: "",
      clicked: false,
      search: "",
    };
  },
  methods: {
    // The addField function adds a field to all the docs in a firebase collection.
    addField() {
      db.collection("cards")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({
              POP: [],
            });
          });
        });
      return "Done!";
    },
  },
  computed: {
    ...mapState({
      cards: (state) => state.cards,
    }),

    url() {
      return `https://${process.env.VUE_APP_EXPORT_LINK}.cloudfunctions.net/csvJsonReport/${this.programme}`;
    },

    getProgrammes() {
      let select_options = [];
      this.$store.getters.getProgrammes.map((programme) => {
        select_options.push({ text: programme.name, value: programme.id });
      });
      return select_options;
    },

    searchCards() {
      return this.cards.filter((card) => {
        let cardPO = card.PO_number;
        if (cardPO == null) {
          return;
        } else if (cardPO.toLowerCase().match(this.search.toLowerCase())) {
          return card;
        }
      });
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

.list-item {
  border: solid 1px gray;
}
</style>
