<template>
  <v-container class="adminContainer">
    <v-row align-content="center" justify="center">
      <v-col cols="12" lg="4" md="4" sm="4" align-self="center"> </v-col>
      <v-col cols="12" lg="4" md="4" sm="4" align-self="center">
        Select the programme to export:
        <v-select v-model="programme" :items="getProgrammes"></v-select>
      </v-col>
      <v-col cols="12" lg="4" md="4" sm="4" align-self="center">
        <v-btn small dark color="primary" :href="url">
          Export
        </v-btn>
      </v-col>
    </v-row>
    <v-row align-content="center" justify="center">
      <v-btn :disabled="true" @click="addField()" dark class="addFieldBtn">
        Add Field
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { db } from "@/firebase";

export default {
  name: "Admin",
  components: {},
  data() {
    return {
      programme: "",
      clicked: false,
    };
  },
  methods: {
    addField() {
      db.collection("cards")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            doc.ref.update({
              hubdoc: false,
            });
          });
        });
      return "Done!";
    },
  },
  computed: {
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
  },

  mounted() {
    this.$store.dispatch("getProgrammes");
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
</style>
