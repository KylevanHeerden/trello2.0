<template>
  <v-form>
    <v-container>
      <Payments
        :cardInfo="card"
        :stepNum="commentPosition"
        :paymentsAllowed="paymentsAllowed"
        class="pb-12"
      ></Payments>
      <v-row justify="center" align-content="center">
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
                      .boolean || card.payments[0].date == ''
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
                <p class="caption">
                  *Purchase approval will only be available after payment date
                  is selected
                </p>
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

        <v-row>
          <v-container fluid v-if="newCard[stepNameFn(stepName, 1)] == false">
            <v-row align-content="center" justify="center">
              <v-col cols="12" sm="6" md="6">
                <v-card-title class="rejectMsg">
                  {{ stepNameFn(stepName, 3) }} Rejected
                </v-card-title>
              </v-col>
            </v-row>
          </v-container>
        </v-row>

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
import Payments from "@/components/Payments";

export default {
  components: { Comments, Payments },
  props: {
    card: {
      type: Object,
      required: true,
    },
    cardComments: {
      type: Array,
      required: true,
    },
    commentPosition: {
      type: Number,
      required: true,
    },
    counter: {
      type: Number,
      required: true,
    },
    product: {
      type: Object,
      required: true,
    },
    stepName: {
      type: String,
      required: true,
    },
    team: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      confirmationDialog: false,
      newCard: {
        purchase_approval: this.card.purchase_approval,
        technical_approval: this.card.technical_approval,
      },
    };
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.profile.userProfile,
    }),

    // Chnages colour of message based on approval
    msgClass() {
      return this.newCard[this.stepNameFn(this.stepName, 1)]
        ? "acceptMsg"
        : "rejectMsg";
    },

    // checks if the current user is the purchase approver and then determines authorisation boolean
    paymentsAllowed() {
      return this.checkIfUserInAuthorityArray(this.team.purchase_approver);
    },
  },
  methods: {
    // Returns whether status apprpved or not from db
    approvedStatus(boolean) {
      if (boolean == true) {
        return "Approved";
      } else {
        return "Rejected";
      }
    },

    //This function checks if current user part of the users assigned to the authority role
    checkIfUserInAuthorityArray(teamAuthority) {
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

    // Function handles approval based on which stage the card is in
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

            if (confirm) {
              const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
              this.moveCardAuto(fbCard, param); // Call the cardMoveAuto function with param to decide to move forward or back

              if (statusType == "technical_approval") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ technical_approval: param }); // updates the technical approval status on the firebase card
                fbCard.update({ updatedOn: new Date() });
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

    // Move the card by changing the list Id
    async moveCardAuto(fbCard, param) {
      let card = await fbCard.get();
      let cardData = card.data();

      let listId = cardData.list_id;

      const status = [
        "Quotes",
        "Technical",
        "Purchase",
        "Procurement",
        "FollowUp",
        "Quality",
      ];

      let newListName = "";
      let newListId = listId;

      if (param == true) {
        // Move card forward is approved
        newListId = Number(listId) + 1;
      } else {
        // Move card back if card rejected
        newListId = 1;
      }

      // Move card back if card rejected
      fbCard.update({ list_id: newListId });

      // Change the status of product with the moce of card
      let fbProduct = db.collection("products").doc(cardData.product_id);
      await fbProduct.update({
        status: status[newListId - 1],
      });

      // Get the correct list name for snackbar
      if (newListId == 1 || newListId == 5) {
        newListName = status[newListId - 1];
      } else if (newListId == 4) {
        newListName = "Activate Purchase";
      } else if (newListId == 2 || newListId == 3 || newListId == 6) {
        newListName = `${status[newListId - 1]} Approval`;
      }

      // Go up multiple parent components to trigger snackbar
      this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.snackbar.snackbar = true;
      this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.snackbar.newListName = newListName;

      // Send notifications
      this.sendNotification(newListId, status[newListId - 1]);
    },

    // Creates new notification which triggers email/slack cloud function
    sendNotification(newListId, status) {
      const person_array = [
        "technical_approver",
        "purchase_approver",
        "procurer",
      ];

      const toCall = person_array[newListId - 2];

      if (this.team[toCall] == undefined) {
        // card creator notified when card is in quality
        db.collection("notifications").add({
          card_id: this.card.id,
          product: {
            product_name: this.product.name,
            product_id: this.product.id,
          },
          programme: {
            programme_name: this.product.programme.programme_name,
            programme_id: this.product.programme.programme_id,
          },
          user_id: this.card.creator,
          createdOn: new Date(),
          status: status,
        });
      } else {
        // nofity relevant party when card moves to column
        this.team[toCall].users.forEach((notify) => {
          db.collection("notifications").add({
            card_id: this.card.id,
            product: {
              product_name: this.product.name,
              product_id: this.product.id,
            },
            programme: {
              programme_name: this.product.programme.programme_name,
              programme_id: this.product.programme.programme_id,
            },
            user_id: notify.value,
            createdOn: new Date(),
            status: status,
          });
        });
      }
    },

    // Returns name according to either purchase of technical
    stepNameFn(name, num) {
      if (num == 1) {
        return `${name}_approval`;
      } else if (num == 2) {
        return `${name}_approver`;
      } else if (num == 3) {
        let str = name.charAt(0).toUpperCase() + name.slice(1);
        return `${str} Approval`;
      }
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

.caption {
  color: #9e9e9e;
  display: inline-block;
}
</style>
