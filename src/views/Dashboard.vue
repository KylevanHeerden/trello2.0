<template v-slot:activator="{ on }">
  <div class="dashboard">
    <v-breadcrumbs :items="links" divider="/"> </v-breadcrumbs>
    <v-container fluid class="my-5 mx-3">
      <v-layout row class="mb-3">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text color="grey" @click="sortBy('name')" v-on="on">
              <v-icon left small>folder</v-icon>
              <span class="caption text-lowercase">by programme name</span>
            </v-btn>
          </template>
          <span>Sort by project name</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text color="grey" @click="sortBy('team')" v-on="on">
              <v-icon left small>people</v-icon>
              <span class="caption text-lowercase">By team</span>
            </v-btn>
          </template>
          <span>Sort by team</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <NewProgramme></NewProgramme>
      </v-layout>
      <v-layout row wrap>
        <v-flex
          xs12
          s6
          m3
          lg3
          v-for="programme in programmes"
          :key="programme.name"
        >
          <router-link
            class="card-text-black"
            :to="{ name: 'Programme', params: { id: programme.id } }"
          >
            <v-card flat class="ma-3 border" data-cypress="ProgrammeCard">
              <v-card-text class="text-center">
                <div class="subheading">{{ programme.name }}</div>
                <div class="grey--text">
                  {{ programme.team.team_name }}
                </div>
              </v-card-text>
            </v-card>
          </router-link>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import NewProgramme from "@/components/NewProgramme.vue";

export default {
  Name: "Programmes",
  components: { NewProgramme },
  data() {
    return {
      links: [
        {
          text: "Programmes",
          to: "/",
        },
      ],
    };
  },

  methods: {
    sortBy: function(prop) {
      if (prop == "team") {
        this.programmes.sort((a, b) =>
          a[prop]["team_name"] < b[prop]["team_name"] ? -1 : 1
        );
      } else {
        this.programmes.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
      }
    },
  },

  computed: {
    ...mapState({ programmes: (state) => state.dashboard.programmes }),
    ...mapGetters(),
  },

  mounted() {
    this.$store.dispatch("getProgrammes");
  },
};
</script>

<style scoped>
.border {
  border-left: 3px solid #78909c !important;
}
</style>
