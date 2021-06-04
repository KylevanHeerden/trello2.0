<template>
  <div class="profile marginTop3rem">
    <div class="text-center">
      <v-avatar size="100">
        <img src="@/assets/avatar.jpg" />
      </v-avatar>
      <h2 class="marginTop2rem">{{ user.name }} {{ user.surname }}</h2>
      <p class="marginTop1remgrey--text">{{ user.email }}</p>
    </div>

    <v-container>
      <v-row align="center">
        <v-col> </v-col>
        <v-col>
          <v-simple-table fixed-header height="300px" class="backgoundColor">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Team Name
                  </th>
                  <th class="text-left">
                    Programme Name
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in user.teams" :key="a.team_id">
                  <td class="grey--text">{{ a.team_name }}</td>
                  <td class="grey--text">{{ a.programme_name }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col> </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Profile",
  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {
    user() {
      let user = this.$store.getters.getUserProfile;
      return user;
    },
  },

  mounted() {
    this.$store.dispatch("getUsers");
  },
};
</script>

<style scoped>
.marginTop3rem {
  margin-top: 3rem !important;
}

.marginTop2rem {
  margin-top: 2rem !important;
}

.marginTop1rem {
  margin-top: 1rem !important;
}

.paddingTop2rem {
  padding-top: 2rem;
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
</style>
