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
      <v-row
        justify="center"
        align-content="center"
        class="programmeTypeTitleRow"
      >
        <div class="programmeTypeTitle">CAPABILITY DOMAIN</div>
      </v-row>
      <v-layout row wrap class="programmeTypeRow">
        <v-flex
          xs12
          s6
          m3
          lg3
          v-for="programme in CD_programmes"
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

      <v-row
        justify="center"
        align-content="center"
        class="programmeTypeTitleRow"
      >
        <div class="programmeTypeTitle">X - PROGRAMMES</div>
      </v-row>

      <v-layout row wrap class="programmeTypeRow">
        <v-flex
          xs12
          s6
          m3
          lg3
          v-for="programme in X_programmes"
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

      <v-row
        justify="center"
        align-content="center"
        class="programmeTypeTitleRow"
      >
        <div class="programmeTypeTitle">Y - PROGRAMMES</div>
      </v-row>

      <v-layout row wrap class="programmeTypeRow">
        <v-flex
          xs12
          s6
          m3
          lg3
          v-for="programme in Y_programmes"
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

  computed: {
    ...mapState({
      programmes: (state) => state.programmes.programmes,
    }),
    ...mapGetters({}),

    // Filters programmes with type CD
    CD_programmes() {
      return this.programmes.filter(
        (programme) => programme.programme_type === "CD"
      );
    },

    // Filters programmes with type X
    X_programmes() {
      return this.programmes.filter(
        (programme) => programme.programme_type === "X"
      );
    },

    // Filters programmes with type Y
    Y_programmes() {
      return this.programmes.filter(
        (programme) => programme.programme_type === "Y"
      );
    },
  },

  methods: {
    ...mapActions(["getProgrammes"]),

    // Sort the programmes by team alphabetically
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

  mounted() {
    this.getProgrammes();
  },
};
</script>

<style scoped>
.border {
  border-left: 3px solid #78909c !important;
}

.programmeTypeTitle {
  font-size: 12px;
  color: #bdbdbd;
}

.programmeTypeTitleRow {
  padding-top: 1.5rem;
  padding-bottom: 0.5rem;
}

.programmeTypeRow {
  padding-bottom: 2rem;
}
</style>
