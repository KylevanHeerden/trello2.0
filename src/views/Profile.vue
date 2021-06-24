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

      <v-row align="center">
        <v-col cols="4"></v-col>
        <v-col cols="2">
          <v-checkbox
            v-model="emailNotify"
            :label="`Email notifications`"
            @click="saveEmailNotify"
          ></v-checkbox>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            v-model="slackNotify"
            :label="`Slack notifications`"
            @click="saveSlackNotify"
          ></v-checkbox>
        </v-col>
        <v-col cols="4"></v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { db } from "@/firebase";

export default {
  name: "Profile",
  components: {},
  data() {
    return {
      emailNotify: null,
      slackNotify: null,
    };
  },
  computed: {
    user() {
      let user = this.$store.getters.getUserProfile;
      this.emailNotify = user.emailNotify;
      this.slackNotify = user.slackNotify;
      return user;
    },
  },
  methods: {
    saveEmailNotify() {
      const fbUser = db.collection("users").doc(this.user.id); // gets the firebase card
      fbUser.update({ emailNotify: this.emailNotify });
    },

    saveSlackNotify() {
      const fbUser = db.collection("users").doc(this.user.id); // gets the firebase card
      fbUser.update({ slackNotify: this.slackNotify });
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
