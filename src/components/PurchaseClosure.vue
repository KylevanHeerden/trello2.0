<template>
  <v-form>
    <v-container>
      <v-row justify="start">
        <v-col cols="12" sm="4" md="4">
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="deliveryDate"
                label="Devilvery Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="deliveryDate"
              @input="addDeliveryDate()"
              landscape
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row justify="end" align-content="end" class="ma-0 pa-0">
        <v-btn
          v-model="edit"
          icon
          small
          @click="edit = !edit"
          class="mr-10"
          :disabled="
            !checkIfUserInAuthorityArray(team.purchase_approver).boolean
          "
        >
          <v-icon class="pr-7">
            edit
          </v-icon>
          <div :class="{ editON: edit }">Editing: {{ editingStatus }}</div>
        </v-btn>
      </v-row>
      <v-row
        justify="center"
        align-content="center"
        v-for="i in card.payments"
        :key="i.Payment"
      >
        <v-col cols="12" sm="3" md="3">
          <v-text-field
            v-model="i.payment"
            label="Payment"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="1" md="1">
          <v-text-field
            v-model="card.currency"
            label="Currency"
            readonly
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2" md="2">
          <v-text-field
            v-model="i.value"
            label="Value"
            @change="changeFinalPaymentValue()"
            :rules="inputRules"
            :readonly="!edit"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="2" md="2">
          <v-menu
            :v-model="`menu${card.payments.length}`"
            :close-on-content-click="true"
            max-width="290"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="i.date"
                label="Payment Date"
                :readonly="!edit"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="i.date"
              @change="addDate(i.date)"
              :allowed-dates="allowedDates"
              :disabled="!edit"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" sm="4" md="4" align-self="center">
          <v-tooltip
            top
            :disabled="
              checkIfUserInAuthorityArray(team.purchase_approver).boolean
            "
          >
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-checkbox
                  v-model="i.committed"
                  label="Confirm Payment"
                  :disabled="allowed"
                  color="success"
                  @change="saveChanges()"
                  dense
                  class="ma-0 pa-0"
                ></v-checkbox>
              </div>
            </template>
            <span>
              {{ checkIfUserInAuthorityArray(team.purchase_approver).message }}
            </span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="savedAlert"
        color="green"
        timeout="2000"
        class="text-center"
        data-cypress="updatedCardSnackbar"
      >
        <v-icon>check_circle</v-icon>
        Payment Updated
      </v-snackbar>

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
      savedAlert: false,
      inputRules: [(v) => v.length >= 3 || "Minimum length is 3 characters"], //Validation rule for form
      deliveryDate: "",
      menu2: false,
      edit: false,
      date: "",
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.userProfile,
    }),

    allowed() {
      let answer = true;

      if (
        this.checkIfUserInAuthorityArray(this.team.purchase_approver).boolean
      ) {
        answer = false;
      }

      return answer;
    },

    editingStatus() {
      return this.edit ? "ON" : "OFF";
    },
  },
  methods: {
    allowedDates(val) {
      if (new Date(val).getDay() == 2) {
        return true;
      } else if (new Date(val).getDay() == 4) {
        return true;
      } else {
        return false;
      }
    },

    //This function checks if current user part of the users assigned to the authority role
    checkIfUserInAuthorityArray(teamAuthority) {
      let userId = this.currentUser.id;

      let teamAuthorityUsersArray = [];

      teamAuthority.users.forEach((user) => {
        teamAuthorityUsersArray.push(user.value);
      });

      if (
        this.counter > 0 &&
        teamAuthorityUsersArray.includes(userId) &&
        this.card.list_id == 5
      ) {
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

    async addDeliveryDate() {
      this.savedAlert = true;

      this.menu2 = false;

      const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card

      // Update fb card
      await fbCard.update({
        delivery_date: this.deliveryDate,
      });
    },

    changeFinalPaymentValue() {
      let finalPayment = parseFloat(this.card.total_inc_vat);

      this.card.payments.forEach((payment) => {
        if (payment.payment !== "Final Payment") {
          finalPayment = finalPayment - parseFloat(payment.value);
        }
      });

      this.card.payments[0].value = parseFloat(finalPayment).toFixed(2);

      this.saveChanges();
    },

    async saveChanges() {
      this.savedAlert = true;

      const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card

      // Update fb card
      await fbCard.update({
        payments: this.card.payments,
      });
    },

    addDate(date) {
      this.date = date;

      this.saveChanges();
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
  color: rgb(255, 99, 71);
}

.editON {
  color: tomato;
}
</style>
