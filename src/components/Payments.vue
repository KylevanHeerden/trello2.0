<template>
  <v-container>
    <v-tooltip top :disabled="paymentsAllowed.boolean">
      <template v-slot:activator="{ on, attrs }">
        <v-row
          justify="end"
          align-content="end"
          class="pa-0"
          v-bind="attrs"
          v-on="on"
        >
          <v-col
            cols="12"
            sm="1"
            md="1"
            align-self="center"
            class="d-flex flex-row ma-0 pa-0"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  class=""
                  @click="addPayment()"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="allowed"
                  color="primary"
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </template>
              <span>Add Payment</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  class=""
                  @click="removePayment()"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="allowed"
                  color="primary"
                >
                  <v-icon>remove</v-icon>
                </v-btn>
              </template>
              <span>Remove Payment</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </template>
      <span>{{ paymentsAllowed.message }}</span>
    </v-tooltip>

    <v-row
      justify="center"
      align-content="center"
      v-for="(i, index) in cardInfo.payments"
      :key="index"
    >
      <v-col cols="12" sm="3" md="3">
        <v-text-field
          v-model="i.payment"
          label="Payment"
          :readonly="allowed"
          :disabled="allowed"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2" md="2">
        <v-text-field
          v-model="cardInfo.currency"
          label="Currency"
          :readonly="allowed"
          :disabled="allowed"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2" md="2">
        <v-text-field
          v-model="i.value"
          label="Value"
          @change="changeFinalPaymentValue()"
          :rules="inputRules"
          :readonly="index == 0"
          :disabled="allowed"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3" md="3">
        <v-menu
          :v-model="`menu${cardInfo.payments.length}`"
          :close-on-content-click="true"
          max-width="290"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              :value="i.date"
              :clearable="!allowed"
              label="Payment Date"
              :disabled="allowed"
              v-bind="attrs"
              v-on="on"
              @click:clear="clearDate()"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="i.date"
            @change="addDate(i.date)"
            :allowed-dates="allowedDates"
            :disabled="allowed"
          ></v-date-picker>
        </v-menu>
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
  </v-container>
</template>

<script>
import { db } from "@/firebase";

export default {
  props: {
    cardInfo: {
      type: Object,
      required: true,
    },

    stepNum: {
      type: Number,
      required: true,
    },

    paymentsAllowed: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      date: "",
      inputRules: [(v) => v.length >= 4 || "Must be in format 0.00"], //Validation rule for form
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      menu6: false,
      savedAlert: false,
    };
  },

  computed: {
    // Returns boolean determining authorisation based on user role and wether card is in list 3 or 4
    allowed() {
      let answer = true;
      if (this.paymentsAllowed.boolean) {
        if (this.cardInfo.list_id == 3 || this.cardInfo.list_id == 4) {
          answer = false;
        }
      }

      return answer;
    },
  },

  methods: {
    // save the date for the payment in the payments array
    addDate(date) {
      this.date = date;

      this.saveChanges();
    },

    // add new row to card.payments, first deposit and then there after interim
    addPayment() {
      if (this.cardInfo.payments.length < 2) {
        this.cardInfo.payments.push({
          payment: "Deposit/Down Payment",
          date: "",
          value: "0.00",
          committed: null,
        });
      } else {
        this.cardInfo.payments.push({
          payment: "Interim Payment",
          date: "",
          value: "0.00",
          committed: null,
        });
      }
    },

    // returns dates that are allowed for date picker, only tuesdays and thursdays
    allowedDates(val) {
      if (new Date(val).getDay() == 2) {
        return true;
      } else if (new Date(val).getDay() == 4) {
        return true;
      } else {
        return false;
      }
    },

    // changes final payment amount based on the number of payment values and the total inc vat
    changeFinalPaymentValue() {
      let finalPayment = parseFloat(this.cardInfo.total_inc_vat);

      this.cardInfo.payments.forEach((payment) => {
        if (payment.payment !== "Final Payment") {
          finalPayment = finalPayment - parseFloat(payment.value);
        }
      });

      this.cardInfo.payments[0].value = parseFloat(finalPayment).toFixed(2);

      this.saveChanges();
    },

    // removes date from payment in payment array
    clearDate() {
      this.date = "";

      this.saveChanges();
    },

    // removes payment from card.pamets array
    removePayment() {
      if (this.cardInfo.payments.length > 1) {
        this.cardInfo.payments.pop();

        this.changeFinalPaymentValue();
      }
    },

    // saves the changes made to the payment array to the fb card
    async saveChanges() {
      this.savedAlert = true;

      const fbCard = db.collection("cards").doc(this.cardInfo.id); // gets the firebase card

      // Update fb card
      await fbCard.update({
        payments: this.cardInfo.payments,
      });
    },
  },

  mounted() {},
};
</script>

<style scoped></style>
