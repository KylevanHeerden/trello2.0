<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            :label="`${stepNameFn(stepName, 3)} Personal:`"
            v-model="team[stepNameFn(stepName, 2)].users[0].text"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-tooltip
            top
            :disabled="
              checkIfUserInAuthorityArray(team[stepNameFn(stepName, 2)]).boolean
            "
          >
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-radio-group
                  v-model="newCard[stepNameFn(stepName, 1)]"
                  row
                  :label="`${stepNameFn(stepName, 3)}:`"
                  :disabled="
                    !checkIfUserInAuthorityArray(team[stepNameFn(stepName, 2)])
                      .boolean
                  "
                >
                  <v-radio
                    label="Accept"
                    @click="
                      handleClick(
                        team[stepNameFn(stepName, 2)],
                        `${stepNameFn(stepName, 1)}`
                      )
                    "
                    :value="Boolean(true)"
                  ></v-radio>
                  <v-radio
                    label="Reject"
                    @click="
                      handleClick(
                        team[stepNameFn(stepName, 2)],
                        `${stepNameFn(stepName, 1)}`
                      )
                    "
                    :value="Boolean(false)"
                  ></v-radio>
                </v-radio-group>
              </div>
            </template>
            <span>
              {{
                checkIfUserInAuthorityArray(team[stepNameFn(stepName, 2)])
                  .message
              }}
            </span>
          </v-tooltip>

          <v-dialog v-model="confirmationDialog" persistent max-width="290">
          </v-dialog>
        </v-col>

        <Comments
          :cardComments="cardComments"
          :position="commentPosition"
          :cardId="card.id"
        ></Comments>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { db } from "@/firebase";
import { mapState } from "vuex";
import Comments from "@/components/Comments";

export default {
  components: { Comments },
  props: {
    stepName: {
      type: String,
      required: true,
    },
    team: {
      type: Object,
      required: true,
    },
    card: {
      type: Object,
      required: true,
    },
    cardComments: {
      type: Array,
      required: true,
    },
    counter: {
      type: Number,
      required: true,
    },
    commentPosition: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      newCard: {
        purchase_approval: this.card.purchase_approval,
        technical_approval: this.card.technical_approval,
      },
      confirmationDialog: false,
    };
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.profile.userProfile,
    }),

    msgClass() {
      return this.newCard[this.stepNameFn(this.stepName, 1)]
        ? "acceptMsg"
        : "rejectMsg";
    },
  },
  methods: {
    stepNameFn(name, num) {
      // Returns name according to either purchase of technical
      if (num == 1) {
        return `${name}_approval`;
      } else if (num == 2) {
        return `${name}_approver`;
      } else if (num == 3) {
        let str = name.charAt(0).toUpperCase() + name.slice(1);
        return `${str} Approval`;
      }
    },

    approvedStatus(boolean) {
      // Returns whether status apprpved or not from db
      if (boolean == true) {
        return "Approved";
      } else {
        return "Rejected";
      }
    },

    checkIfUserInAuthorityArray(teamAuthority) {
      //This function checks if current user part of the users assigned to the authority role
      let userId = this.currentUser.id;

      let teamAuthorityUsersArray = [];

      teamAuthority.users.forEach((user) => {
        teamAuthorityUsersArray.push(user.value);
      });
      //   console.log(teamAuthorityUsersArray[0]);
      //   console.log(userId);
      if (this.counter > 0 && teamAuthorityUsersArray.includes(userId)) {
        return { boolean: Boolean(true), message: "" };
      } else if (
        this.counter == 0 &&
        teamAuthorityUsersArray.includes(userId)
      ) {
        return {
          boolean: Boolean(false),
          message: "Please check the quote information first",
        };
      } else {
        return {
          boolean: Boolean(false),
          message: "You do not have permission for this action",
        };
      }
    },

    handleClick(teamAuthority, statusType) {
      let authorize = this.checkIfUserInAuthorityArray(teamAuthority).boolean;
      if (authorize == true) {
        this.$confirm({
          message: `Are you sure?`,
          button: {
            no: "No",
            yes: "Yes",
          },
          callback: (confirm) => {
            let param = this.newCard[statusType];

            if (param == 0) {
              let paramBoolean = true;
            } else if (param == 1) {
              let paramBoolean = false;
            }

            if (confirm) {
              if (statusType == "technical_approval") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ technical_approval: param }); // updates the technical approval status on the firebase card
                fbCard.update({ updatedOn: new Date() });

                this.moveCardAuto(fbCard);
              } else if (statusType == "purchase_approval") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ purchase_approval: param }); // updates the purchase approval status on the firebase card
                fbCard.update({ updatedOn: new Date() });
              } else if (statusType == "procured") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ procured: param }); // updates the procured status on the firebase card
                fbCard.update({ updatedOn: new Date() });

                // This function updates the programes total as it is procured
                if (param == true) {
                  fbCard
                    .get()
                    .then((doc) => {
                      let programmeId = doc.data().team.programme.programme_id;

                      let cardTotalIncVat = doc.data().total_inc_vat;

                      const fbProgramme = db
                        .collection("programmes")
                        .doc(programmeId);

                      fbProgramme
                        .get()
                        .then((doc) => {
                          const total = doc.data().total;

                          const newTotal =
                            parseFloat(total) + parseFloat(cardTotalIncVat);

                          fbProgramme.update({ total: newTotal.toString() });
                        })
                        .catch((error) => console.log(error));
                    })
                    .catch((error) => console.log(error));
                }
              } else if (statusType == "quality_approval") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ quality_approval: param }); // updates the quality approval status on the firebase card
                fbCard.update({ updatedOn: new Date() });

                fbCard.update({
                  "team.quality_approver": this.newCard.quality_approver, // updates the quality approver of the card
                });
              }
            } else {
              this.newCard[statusType] = !this.newCard[statusType]; // Reverts to what the status was before it was click
            }
          },
        });
      }
    },

    moveCardAuto(fbCard) {
      fbCard.get().then((card) => {
        let cardData = card.data();
        let listId = cardData.list_id;

        console.log("hello from grandChild");

        this.$emit("move-Card-Auto", listId);
      });
    },
  },

  mounted() {},
};
</script>

<style scoped>
.acceptMsg {
  color: #455a64;
}

.rejectMsg {
  color: tomato;
}
</style>
