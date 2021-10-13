<template v-slot:activator="{ on }">
  <div class="dashboard">
    <v-breadcrumbs :items="links" divider="/"> </v-breadcrumbs>
    <v-container class="my-5 mx-3">
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
        <!-- <v-btn @click="addStatus"> add status</v-btn> -->
        <NewProgramme></NewProgramme>
      </v-layout>

      <v-expansion-panels class="pt-10 mx-12">
        <v-expansion-panel class="panel">
          <v-expansion-panel-header class="programmeTypeTitle">
            <v-row justify="center" class="py-5">
              Capability Domains
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content class="pt-5">
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
                  <v-card
                    class="ma-3 border"
                    data-cypress="ProgrammeCard"
                    elevation="2"
                  >
                    <v-card-text class="text-center">
                      <div class="subheading">{{ programme.name }}</div>
                      <!-- <div class="grey--text">
                        {{ programme.team.team_name }}
                      </div> -->
                    </v-card-text>
                  </v-card>
                </router-link>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="">
          <v-expansion-panel-header class="programmeTypeTitle">
            <v-row justify="center" class="py-5">
              Blue Sky
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content class="pt-5">
            <v-row class="py-4">
              <div class="pl-5 programmeTypeTitle ">Designated</div>
            </v-row>

            <v-divider class="pb-5"></v-divider>

            <v-layout row wrap class="programmeTypeRow">
              <v-flex
                xs12
                s6
                m3
                lg3
                v-for="programme in des_programmes"
                :key="programme.name"
              >
                <router-link
                  class="card-text-black"
                  :to="{ name: 'Programme', params: { id: programme.id } }"
                >
                  <v-card
                    elevation="2"
                    class="ma-3 border"
                    data-cypress="ProgrammeCard"
                  >
                    <v-card-text class="text-center">
                      <div class="subheading">{{ programme.name }}</div>
                      <!-- <div class="grey--text">
                        {{ programme.team.team_name }}
                      </div> -->
                    </v-card-text>
                  </v-card>
                </router-link>
              </v-flex>
            </v-layout>

            <v-row class="py-4">
              <div class="pl-5 programmeTypeTitle ">Undesignated</div>
            </v-row>

            <v-divider class="pb-5"></v-divider>

            <v-layout row wrap class="programmeTypeRow">
              <v-flex
                xs12
                s6
                m3
                lg3
                v-for="programme in undes_programmes"
                :key="programme.name"
              >
                <router-link
                  class="card-text-black"
                  :to="{ name: 'Programme', params: { id: programme.id } }"
                >
                  <v-card
                    elevation="2"
                    class="ma-3 border"
                    data-cypress="ProgrammeCard"
                  >
                    <v-card-text class="text-center">
                      <div class="subheading">{{ programme.name }}</div>
                      <!-- <div class="grey--text">
                        {{ programme.team.team_name }}
                      </div> -->
                    </v-card-text>
                  </v-card>
                </router-link>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="">
          <v-expansion-panel-header class="programmeTypeTitle">
            <v-row justify="center" class="py-5">
              Special Pursuits
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content class="pt-5">
            <v-row class="py-4">
              <div class="pl-5 programmeTypeTitle ">Active</div>
            </v-row>

            <v-divider class="pb-5"></v-divider>

            <v-layout row wrap class="programmeTypeRow">
              <v-flex
                xs12
                s6
                m3
                lg3
                v-for="programme in active_programmes"
                :key="programme.name"
              >
                <router-link
                  class="card-text-black"
                  :to="{ name: 'Programme', params: { id: programme.id } }"
                >
                  <v-card
                    elevation="2"
                    class="ma-3 border"
                    data-cypress="ProgrammeCard"
                  >
                    <v-card-text class="text-center">
                      <div class="subheading">{{ programme.name }}</div>
                      <!-- <div class="grey--text">
                        {{ programme.team.team_name }}
                      </div> -->
                    </v-card-text>
                  </v-card>
                </router-link>
              </v-flex>
            </v-layout>

            <v-row class="py-4">
              <div class="pl-5 programmeTypeTitle ">Suspended</div>
            </v-row>

            <v-divider class="pb-5"></v-divider>

            <v-layout row wrap class="programmeTypeRow">
              <v-flex
                xs12
                s6
                m3
                lg3
                v-for="programme in suspended_programmes"
                :key="programme.name"
              >
                <router-link
                  class="card-text-black"
                  :to="{ name: 'Programme', params: { id: programme.id } }"
                >
                  <v-card
                    elevation="2"
                    class="ma-3 border"
                    data-cypress="ProgrammeCard"
                  >
                    <v-card-text class="text-center">
                      <div class="subheading">{{ programme.name }}</div>
                      <!-- <div class="grey--text">
                        {{ programme.team.team_name }}
                      </div> -->
                    </v-card-text>
                  </v-card>
                </router-link>
              </v-flex>
            </v-layout>

            <v-row class="py-4">
              <div class="pl-5 programmeTypeTitle ">Terminated</div>
            </v-row>

            <v-divider class="pb-5"></v-divider>

            <v-layout row wrap class="programmeTypeRow">
              <v-flex
                xs12
                s6
                m3
                lg3
                v-for="programme in terminated_programmes"
                :key="programme.name"
              >
                <router-link
                  class="card-text-black"
                  :to="{ name: 'Programme', params: { id: programme.id } }"
                >
                  <v-card
                    elevation="2"
                    class="ma-3 border"
                    data-cypress="ProgrammeCard"
                  >
                    <v-card-text class="text-center">
                      <div class="subheading">{{ programme.name }}</div>
                      <!-- <div class="grey--text">
                        {{ programme.team.team_name }}
                      </div> -->
                    </v-card-text>
                  </v-card>
                </router-link>
              </v-flex>
            </v-layout>

            <v-row class="py-4">
              <div class="pl-5 programmeTypeTitle ">Complete</div>
            </v-row>

            <v-divider class="pb-5"></v-divider>

            <v-layout row wrap class="programmeTypeRow">
              <v-flex
                xs12
                s6
                m3
                lg3
                v-for="programme in complete_programmes"
                :key="programme.name"
              >
                <router-link
                  class="card-text-black"
                  :to="{ name: 'Programme', params: { id: programme.id } }"
                >
                  <v-card
                    elevation="2"
                    class="ma-3 border"
                    data-cypress="ProgrammeCard"
                  >
                    <v-card-text class="text-center">
                      <div class="subheading">{{ programme.name }}</div>
                      <!-- <div class="grey--text">
                        {{ programme.team.team_name }}
                      </div> -->
                    </v-card-text>
                  </v-card>
                </router-link>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel class="">
          <v-expansion-panel-header class="programmeTypeTitle">
            <v-row justify="center" class="py-5">
              R&D Deployment
            </v-row>
          </v-expansion-panel-header>

          <v-expansion-panel-content class="pt-5">
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
                  <v-card
                    elevation="2"
                    class="ma-3 border"
                    data-cypress="ProgrammeCard"
                  >
                    <v-card-text class="text-center">
                      <div class="subheading">{{ programme.name }}</div>
                      <!-- <div class="grey--text">
                        {{ programme.team.team_name }}
                      </div> -->
                    </v-card-text>
                  </v-card>
                </router-link>
              </v-flex>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import NewProgramme from "@/components/NewProgramme.vue";

import { db } from "@/firebase";

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

    // Filters programmes with type BS
    BS_programmes() {
      let programmes = this.programmes.filter(
        (programme) => programme.programme_type === "BS"
      );

      return programmes.sort((a, b) => (a["name"] < b["name"] ? -1 : 1));
    },

    // Filters programmes with type CD
    CD_programmes() {
      let programmes = this.programmes.filter(
        (programme) => programme.programme_type === "CD"
      );

      return programmes.sort((a, b) => (a["name"] < b["name"] ? -1 : 1));
    },

    // Filters programmes with type X
    X_programmes() {
      let programmes = this.programmes.filter(
        (programme) => programme.programme_type === "X"
      );

      return programmes.sort((a, b) => (a["name"] < b["name"] ? -1 : 1));
    },

    // Filters programmes with type Y
    Y_programmes() {
      let programmes = this.programmes.filter(
        (programme) => programme.programme_type === "Y"
      );

      return programmes.sort((a, b) => (a["name"] < b["name"] ? -1 : 1));
    },

    // Active programmes
    active_programmes() {
      let programmes = this.programmes.filter(
        (programme) => programme.status === "active"
      );

      return programmes.sort((a, b) => (a["name"] < b["name"] ? -1 : 1));
    },

    // Suspsended programmes
    suspended_programmes() {
      let programmes = this.programmes.filter(
        (programme) => programme.status === "suspended"
      );

      return programmes.sort((a, b) => (a["name"] < b["name"] ? -1 : 1));
    },

    // Terminated programmes
    terminated_programmes() {
      let programmes = this.programmes.filter(
        (programme) => programme.status === "terminated"
      );

      return programmes.sort((a, b) => (a["name"] < b["name"] ? -1 : 1));
    },

    // Complete programmes
    complete_programmes() {
      let programmes = this.programmes.filter(
        (programme) => programme.status === "complete"
      );

      return programmes.sort((a, b) => (a["name"] < b["name"] ? -1 : 1));
    },

    // Undesignated programmes
    undes_programmes() {
      let programmes = this.programmes.filter(
        (programme) => programme.status === "undes"
      );

      return programmes.sort((a, b) => (a["name"] < b["name"] ? -1 : 1));
    },

    // Designated programmes
    des_programmes() {
      let programmes = this.programmes.filter(
        (programme) => programme.status === "des"
      );

      return programmes.sort((a, b) => (a["name"] < b["name"] ? -1 : 1));
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

    // addStatus() {
    //   db.collection("programmes")
    //     .get()
    //     .then(function(querySnapshot) {
    //       querySnapshot.forEach(function(doc) {
    //         doc.ref.update({
    //           status: "",
    //         });
    //       });

    //       alert("I am done!");
    //     });
    //   return "Done!";
    // },
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

.panel {
}

.programmeTypeTitle {
  font-size: medium;
  color: #757575;
}

.programmeTypeTitleRow {
  padding-top: 1.5rem;
  padding-bottom: 0.5rem;
}

.programmeTypeRow {
  padding-bottom: 2rem;
}
</style>
