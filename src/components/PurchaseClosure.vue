<template>
  <v-form>
    <v-container>
      <v-row>
        <div>Purchase closure component</div>
      </v-row>

      <Comments
        :cardComments="cardComments"
        :position="commentPosition"
        :cardId="card.id"
        class="comments"
      ></Comments>
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

      inputRules: [(v) => v.length >= 3 || "Minimum length is 3 characters"], //Validation rule for form
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.userProfile,
    }),
  },
  methods: {
    //This function checks if current user part of the users assigned to the authority role
    checkIfUserInAuthorityArray(teamAuthority) {
      let userId = this.currentUser.id;

      let teamAuthorityUsersArray = [];

      teamAuthority.users.forEach((user) => {
        teamAuthorityUsersArray.push(user.value);
      });

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

    // Handles the approval click per stage of card
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
              if (statusType == "technical_approval") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ technical_approval: param }); // updates the list id on the firebase card
                fbCard.update({ updatedOn: new Date() });
              } else if (statusType == "purchase_approval") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ purchase_approval: param }); // updates the list id on the firebase card
                fbCard.update({ updatedOn: new Date() });
              } else if (statusType == "procured") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ procured: param }); // updates the list id on the firebase card
                fbCard.update({ updatedOn: new Date() });

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
                } else {
                  this.moveCardAutoBackward(fbCard);
                }
              } else if (statusType == "quality_approval") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ quality_approval: param }); // updates the list id on the firebase card
                fbCard.update({ updatedOn: new Date() });

                fbCard.update({
                  "team.quality_approver": this.newCard.quality_approver,
                });
              }
            } else {
              this.newCard[statusType] = !this.newCard[statusType];
            }
          },
        });
      }
    },

    // Creates new notification in fb which triggers slack/email cloud function
    sendNotification(newListId, status) {
      const person_array = [
        "technical_approver",
        "purchase_approver",
        "procurer",
        "purchase_approver",
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
      } else if (newListId - 2 === 3) {
        // Now purchase approver and card creator is notified when card is in awaiting
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

      this.getNotifications;
    },
  },
  mounted() {},
};
</script>

<style scoped>
.backgroundColorPrimary {
  background-color: #37474f;
  color: white;
}

.comments {
  margin-top: 3rem;
}

.material-icons:before {
  display: none;
}

.fileLabel {
  color: rgba(0, 0, 0, 0.6);
}

.rejectMsg {
  color: tomato;
}
</style>
