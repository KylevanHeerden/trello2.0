<template>
  <div class="teams text-center paddingTop3rem">
    <h1>Teams</h1>

    <template>
      <v-container>
        <v-row>
          <v-col></v-col>
          <v-col xs10 sm4 md4>
            <v-expansion-panels focusable>
              <v-expansion-panel v-for="team in teams" :key="team.id">
                <v-expansion-panel-header class="grey--text">{{
                  capatilise(team.name)
                }}</v-expansion-panel-header>
                <v-expansion-panel-content class="text-left">
                  <p>Programme:</p>
                  <p class="subtitle">
                    {{ team.programme.programme_name }}
                  </p>
                  <p>Technical:</p>
                  <p
                    v-for="a in team.technical_approver.users"
                    :key="a.value"
                    class="subtitle"
                  >
                    - {{ a.text }}
                  </p>
                  <p>Purchase:</p>
                  <p
                    v-for="b in team.purchase_approver.users"
                    :key="b.value"
                    class="subtitle"
                  >
                    - {{ b.text }}
                  </p>
                  <p>Procurer:</p>
                  <p
                    v-for="c in team.procurer.users"
                    :key="c.value"
                    class="subtitle"
                  >
                    - {{ c.text }}
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col></v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Teams",
  computed: {
    teams() {
      return this.$store.getters.getTeams;
    },
  },

  methods: {
    capatilise(word) {
      return word.toUpperCase();
    },
  },

  mounted() {
    this.$store.dispatch("getTeams");
  },
};
</script>

<style scoped>
.marginTop3rem {
  margin-top: 3rem !important;
}

.v-application p {
  margin-bottom: 0rem;
}

.subtitle {
  color: #9e9e9e;
  padding-left: 1rem;
}

p {
  color: rgba(37, 37, 37, 0.87);
}
</style>
