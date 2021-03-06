<template>
  <v-dialog v-model="newProgrammeDialog" persistent max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class=""
        elevation="2"
        small
        dark
        color="primary"
        v-bind="attrs"
        v-on="on"
        data-cypress="addNewProgrammeBtn"
        :disabled="!user.admin"
      >
        <v-icon dark> mdi-plus </v-icon>
        Add Programme
      </v-btn>
    </template>
    <v-form ref="form">
      <v-card data-cypress="newProgrammeModal">
        <v-card-title class="headline backgroundColorPrimary">
          New Programme
        </v-card-title>
        <v-card-text class="mt-6">
          <v-form class="px-3" ref="newProgrammeForm">
            <v-text-field
              label="Title"
              v-model="newProgramme.name"
              data-cypress="newProgrammeTitle"
            >
            </v-text-field>
            <v-text-field
              label="Team"
              v-model="newProgramme.team.team_name"
              data-cypresss="newProgrammeTeam"
            >
            </v-text-field>
            <v-select
              v-model="newProgramme.programme_type"
              label="Programme Type"
              :items="programmeTypeOptions"
              item-text="text"
              item-value="value"
              return-object
              data-cypress="newProgType"
            ></v-select>
            <v-select
              v-model="newProgramme.status"
              v-if="newProgramme.programme_type.value == 'X'"
              label="Programme Status"
              :items="programmeStatusOptions1"
              item-text="text"
              item-value="value"
              return-object
              data-cypress="newProgType"
            ></v-select>
            <v-select
              v-model="newProgramme.status"
              v-if="newProgramme.programme_type.value == 'BS'"
              label="Programme Status"
              :items="programmeStatusOptions2"
              item-text="text"
              item-value="value"
              return-object
              data-cypress="newProgType"
            ></v-select>
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
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { db } from "@/firebase";

export default {
  data() {
    return {
      inputRules: [(v) => v.length >= 3 || "Minimum length is 3 characters"], //Validation rule for form
      inputRulesMoney: [
        (v) => v.match(/^\d+(?:\.\d{0,2})$/) || "Must be in the format R0.00",
        (v) => v.length >= 5 || "Minimum length is 4 characters",
      ],
      loading: false,
      newProgramme: {
        name: "",
        team: {
          team_name: "",
        },
        budget: "",
        programme_type: { text: "", value: "" },
        status: "",
      },
      newProgrammeDialog: false,
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
      programmeTypeOptions: [
        { text: "Capability Domain", value: "CD" },
        { text: "Blue Sky", value: "BS" },
        { text: "Special Pursuit", value: "X" },
        { text: "R&D Deployment", value: "Y" },
      ],
      programmeStatusOptions1: [
        { text: "Active", value: "active" },
        { text: "Complete", value: "complete" },
        { text: "Suspended", value: "suspended" },
        { text: "Terminated", value: "terminated" },
      ],
      programmeStatusOptions2: [
        { text: "Designated", value: "des" },
        { text: "Undesignated", value: "undes" },
      ],
      selectRequired: [(v) => v.length > 0 || "Required"],
    };
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.profile.userProfile,
      user: (state) => state.profile.userProfile,
      users: (state) => state.users.users,
    }),

    // Make an array where the keys for each user object is changed to text & value for the select
    mapUsersArray() {
      let mapUsersArray = [];
      this.users.forEach((user) => {
        let map = {
          text: user.name + " " + user.surname,
          value: user.id,
          slack_id: user.slack_id,
        };
        mapUsersArray.push(map);
      });
      return mapUsersArray.sort((a, b) => a.text.localeCompare(b.text));
    },
  },

  methods: {
    ...mapActions(["createNewProgramme", "getUsers"]),

    // Submits form and creates new programe in fb
    async submit() {
      if (this.$refs.newProgrammeForm.validate()) {
        //Validates form before allowed to submit
        this.loading = true;

        // Add new programme and team in fb
        let programme = await db.collection("programmes").add({});
        let team = await db.collection("teams").add({});

        if (
          this.newProgramme.programme_type.value == "X" ||
          this.newProgramme.programme_type.value == "BS"
        ) {
          // Setup new programme data
          const progData = {
            name: this.newProgramme.name,
            createdOn: new Date(),
            team: {
              team_id: team.id,
              team_name: this.newProgramme.team.team_name,
            },
            products: [],
            budget: this.newProgramme.budget,
            programme_type: this.newProgramme.programme_type.value,
            total: "0",
            status: this.newProgramme.status.value,
          };

          // Setup new team data
          const teamData = {
            name: progData.team.team_name,
            programme: {
              programme_id: programme.id,
              programme_name: progData.name,
            },
            technical_approver: this.newTeam.technical_approver,
            purchase_approver: this.newTeam.purchase_approver,
            procurer: this.newTeam.procurer,
            quality_approver: this.newTeam.quality_approver,
            receiver: {},
            createdOn: new Date(),
            updatedOn: new Date(),
          };

          // Triggers createNewProgramme defined in vuex
          this.createNewProgramme({ progData, teamData });

          this.newProgrammeDialog = false;
          this.loading = false;

          this.$refs.form.resetValidation();
          this.$refs.form.reset();
        } else {
          // Setup new programme data
          const progData = {
            name: this.newProgramme.name,
            createdOn: new Date(),
            team: {
              team_id: team.id,
              team_name: this.newProgramme.team.team_name,
            },
            products: [],
            budget: this.newProgramme.budget,
            programme_type: this.newProgramme.programme_type.value,
            total: "0",
            status: "",
          };

          // Setup new team data
          const teamData = {
            name: progData.team.team_name,
            programme: {
              programme_id: programme.id,
              programme_name: progData.name,
            },
            technical_approver: this.newTeam.technical_approver,
            purchase_approver: this.newTeam.purchase_approver,
            procurer: this.newTeam.procurer,
            quality_approver: this.newTeam.quality_approver,
            receiver: {},
            createdOn: new Date(),
            updatedOn: new Date(),
          };

          // Triggers createNewProgramme defined in vuex
          this.createNewProgramme({ progData, teamData });

          this.newProgrammeDialog = false;
          this.loading = false;

          this.$refs.form.resetValidation();
          this.$refs.form.reset();
        }
      }
    },
  },

  mounted() {
    this.getUsers();
  },
};
</script>

<style scoped>
.backgroundColorPrimary {
  background-color: #37474f;
  color: white;
}
</style>
