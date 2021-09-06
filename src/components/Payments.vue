<template>
  <v-container>
    <v-row
      justify="center"
      align-content="center"
      v-for="i in cardInfo.payments"
      :key="i.Payment"
    >
      <v-col cols="12" sm="3" md="3">
        <v-text-field v-model="i.payment" label="Payment"> </v-text-field>
      </v-col>
      <v-col cols="12" sm="2" md="2">
        <v-text-field
          v-model="cardInfo.currency"
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
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3" md="3">
        <v-menu v-model="menu1" :close-on-content-click="true" max-width="290">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              :value="i.date"
              clearable
              label="Payment Date"
              readonly
              v-bind="attrs"
              v-on="on"
              @click:clear="date = ''"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="i.date"
            @change="addDate(i.date)"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="1" md="1" align-self="center">
        <v-btn
          icon
          small
          class=""
          @click="addPayment()"
          v-if="i == cardInfo.payments[cardInfo.payments.length - 1]"
          ><v-icon>add</v-icon></v-btn
        >
        <v-btn
          icon
          small
          class=""
          @click="removePayment()"
          v-if="i == cardInfo.payments[cardInfo.payments.length - 1]"
          ><v-icon>remove</v-icon></v-btn
        >
      </v-col>
    </v-row>
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
  },
  data: () => {
    return {
      date: "",
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      menu6: false,
      inputRules: [(v) => v.length >= 4 || "Must be in format 0.00"], //Validation rule for form
    };
  },

  computed: {},

  methods: {
    allowedDates() {
      return;
    },

    addPayment() {
      if (this.cardInfo.payments.length < 2) {
        this.cardInfo.payments.push({
          payment: "Deposit/Down Payment",
          date: "",
          value: "0.00",
        });
      } else {
        this.cardInfo.payments.push({
          payment: "Interim Payment",
          date: "",
          value: "0.00",
        });
      }
    },

    removePayment() {
      if (this.cardInfo.payments.length > 1) {
        this.cardInfo.payments.pop();
        this.changeFinalPaymentValue();
      }
    },

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

    addDate(date) {
      this.date = date;

      this.saveChanges();
    },

    async saveChanges() {
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
