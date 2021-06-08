<template>
  <v-dialog v-model="newProgrammeDialog" persistent max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mx-8"
        elevation="2"
        small
        dark
        color="primary"
        v-bind="attrs"
        v-on="on"
        data-cypress="addNewProgrammeBtn"
      >
        <v-icon dark> mdi-plus </v-icon>
        Add Programme
      </v-btn>
    </template>
    <v-card data-cypress="newProgrammeModal">
      <v-card-title class="headline backgroundColorPrimary">
        New Programme
      </v-card-title>
      <v-card-text class="mt-6">
        <v-form class="px-3" ref="form">
          <v-text-field
            label="Title"
            v-model="newProgramme.name"
            :rules="inputRules"
            data-cypress="newProgrammeTitle"
          >
          </v-text-field>
          <v-text-field
            label="Team"
            v-model="newProgramme.team.team_name"
            :rules="inputRules"
            data-cypresss="newProgrammeTeam"
          >
          </v-text-field>
          <v-select
            v-model="newTeam.technical_approver.users"
            label="Technical Authority"
            :items="mapUsersArray"
            item-text="text"
            item-value="value"
            multiple
            chips
            hint="More than one may be selected"
            persistent-hint
            return-object
            :rules="selectRequired"
            data-cypress="newProgTechnicalAuth"
          ></v-select>
          <v-select
            v-model="newTeam.purchase_approver.users"
            label="Purchase Authority"
            :items="mapUsersArray"
            multiple
            chips
            hint="More than one may be selected"
            persistent-hint
            return-object
            :rules="selectRequired"
            data-cypress="newProgPurchaseAuth"
          ></v-select>
          <v-select
            v-model="newTeam.procurer.users"
            label="Procument Authority"
            :items="mapUsersArray"
            multiple
            chips
            hint="More than one may be selected"
            persistent-hint
            return-object
            :rules="selectRequired"
            data-cypress="newProgProcurer"
          ></v-select>
          <v-text-field
            v-model="newProgramme.budget"
            label="Buget Value"
            :rules="inputRulesMoney"
            prefix="R"
            data-cypress="budgetValue"
          >
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-grey darken-3"
          text
          @click="newProgrammeDialog = false"
          v-if="!loading"
          data-cypress="newProgrammeCancelBtn"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue-grey darken-3"
          text
          @click="submit"
          :loading="loading"
          data-cypress="newProgrammeAddBtn"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from "@/firebase";

export default {
  data() {
    return {
      newProgrammeDialog: false,
      loading: false,
      newProgramme: {
        name: "",
        team: {
          team_name: "",
        },
        budget: "",
      },
      newTeam: {
        name: "",
        programme_id: "",
        technical_approver: {
          listRefId: 3,
          users: [],
        },
        purchase_approver: {
          listRefId: 4,
          users: [],
        },
        procurer: {
          listRefId: 5,
          users: [],
        },
        quality_approver: {
          listRefId: 6,
          user: {},
        },
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      selectRequired: [(v) => v.length > 0 || "Required"],
      inputRules: [(v) => v.length >= 3 || "Minimum length is 3 characters"], //Validation rule for form
      inputRulesMoney: [
        (v) => v.match(/^\d+(?:\.\d{0,2})$/) || "Must be in the format R0.00",
        (v) => v.length >= 5 || "Minimum length is 4 characters",
      ],
    };
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        //Validates form before allowed to submit
        this.loading = true;

        let programme = await db.collection("programmes").add({});
        let team = await db.collection("teams").add({});

        const progData = {
          name: this.newProgramme.name,
          createdOn: new Date(),
          team: {
            team_id: team.id,
            team_name: this.newProgramme.team.team_name,
          },
          products: [],
          budget: this.newProgramme.budget,
          total: "0",
        };

        db.collection("programmes")
          .doc(programme.id)
          .set(progData);

        const teamData = {
          name: this.newProgramme.team.team_name,
          programme: {
            programme_id: programme.id,
            programme_name: this.newProgramme.name,
          },
          technical_approver: this.newTeam.technical_approver,
          purchase_approver: this.newTeam.purchase_approver,
          procurer: this.newTeam.procurer,
          quality_approver: this.newTeam.quality_approver,
          receiver: {},
          createdOn: new Date(),
          updatedOn: new Date(),
        };

        const teamRef = await db.collection("teams").doc(team.id);

        teamRef.set(teamData);

        this.newProgrammeDialog = false;
        this.loading = false;

        this.newTeam.technical_approver.users.forEach((user) => {
          this.setAddTeamtoUsersTeams(
            user.value,
            team.id,
            this.newProgramme.team.team_name,
            this.newProgramme.name
          );
        });

        this.newTeam.purchase_approver.users.forEach((user) => {
          this.setAddTeamtoUsersTeams(
            user.value,
            team.id,
            this.newProgramme.team.team_name,
            this.newProgramme.name
          );
        });

        this.newTeam.procurer.users.forEach((user) => {
          this.setAddTeamtoUsersTeams(
            user.value,
            team.id,
            this.newProgramme.team.team_name,
            this.newProgramme.name
          );
        });

        this.newTeam = {
          name: "",
          programme_id: "",
          technical_approver: [],
          purchase_approver: [],
          procurer: [],
          quality_approver: [],
          createdOn: new Date(),
          updatedOn: new Date(),
        };

        this.newProgramme = {
          name: "",
          team: {
            team_name: "",
            team_id: team.id,
          },
          budget: "",
        };
      }
    },

    generateString(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = " ";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    },

    async setAddTeamtoUsersTeams(user_id, team_id, team_name, programmeName) {
      const user = await db
        .collection("users")
        .doc(user_id)
        .get();

      const userData = user.data();

      let user_teams_array = userData.teams;

      if (user_teams_array.length == 0) {
        user_teams_array.push({
          //add the map of the team id and name to the user
          team_id: team_id,
          team_name: team_name,
          programme_name: programmeName,
        });

        userData.updatedOn = new Date();

        db.collection("users") //write the updated fields to the user doc
          .doc(user_id)
          .set(userData);
      } else {
        user_teams_array.forEach(function(k) {
          if (k.team_id == team_id) {
            ("");
          } else {
            user_teams_array.push({
              //add the map of the team id and name to the user
              team_id: team_id,
              team_name: team_name,
              programme_name: programmeName,
            });

            userData.updatedOn = new Date();

            db.collection("users") //write the updated fields to the user doc
              .doc(user_id)
              .set(userData);
          }
        });
      }
    },
  },

  computed: {
    users() {
      return this.$store.getters.getUsers;
    },

    mapUsersArray() {
      // make an array where the keys for each user object is changed to text & value for the select
      let mapUsersArray = [];
      this.users.forEach((user) => {
        let map = {
          text: user.name + " " + user.surname,
          value: user.id,
          slack_id: user.slack_id,
        };
        mapUsersArray.push(map);
      });
      return mapUsersArray;
    },

    currentUser() {
      return this.$store.getters.getUserProfile;
    },
  },

  mounted() {
    this.$store.dispatch("getUsers");
  },
};
</script>

<style scoped>
.backgroundColorPrimary {
  background-color: #37474f;
  color: white;
}
</style>
