<template>
  <v-row>
    <v-col cols="12" md="3">
      <v-text-field
        label="Item Number"
        v-model="newItem.supplier_item_num"
        :rules="inputRules"
      >
      </v-text-field>
    </v-col>
    <v-col cols="12" md="4">
      <v-text-field
        label="Item Name"
        v-model="newItem.supplier_item_name"
        :rules="inputRules"
      >
      </v-text-field>
    </v-col>

    <v-col cols="12" md="2">
      <v-text-field
        ref="Quantity"
        label="Quantity"
        v-model="newItem.quantity"
        :rules="inputRulesQuan"
        @input="quantityTimesPrice"
      >
      </v-text-field>
    </v-col>
    <v-col cols="12" md="3">
      <v-text-field
        ref="UnitPrice"
        label="Unit Price Exc VAT"
        v-model="newItem.unit_price"
        :rules="inputRulesMoney"
        :prefix="currency"
        @input="quantityTimesPrice"
      >
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { db } from "@/firebase";

export default {
  props: {
    submitValue: {
      type: Boolean,
      required: true,
    },
    cardId: {
      type: String,
      required: true,
    },
    programmeId: {
      type: String,
      required: true,
    },
    componentId: {
      type: Number,
      required: true,
    },
    currencyCard: {
      type: String,
      required: true,
    },
  },
  watch: {
    submitValue() {
      if (this.submitValue == true) {
        var LineItemData = {
          card_id: this.cardId,
          programme_id: this.programmeId,
          item_number: this.newItem.supplier_item_num,
          item_name: this.newItem.supplier_item_name,
          quantity: this.newItem.quantity,
          unit_price: this.newItem.unit_price,
          updatedOn: new Date(),
          createdOn: new Date(),
        };

        this.$emit("lineItemData", LineItemData);

        let id = this.generateString(21);

        db.collection("line_items")
          .doc(id)
          .set(LineItemData);
      }
    },
  },
  data() {
    return {
      inputRules: [(v) => v.length >= 3 || "Minimum length is 3 characters"], //Validation rule for form
      inputRulesQuan: [
        (v) => v % 1 == 0 || "Must be a whole number",
        (v) => v.length >= 1 || "Required",
      ],
      inputRulesMoney: [
        (v) => v.match(/^\d+(?:\.\d{0,2})$/) || "Must be in the format R0.00",
        (v) => v.length >= 5 || "Minimum length is 4 characters",
      ],
      newItem: {
        nano_item_num: "",
        nano_item_name: "",
        nano_item_description: "",
        supplier_item_num: "",
        supplier_item_name: "",
        quantity: "",
        unit_price: "",
      },
    };
  },

  methods: {
    quantityTimesPrice() {
      if (this.$refs.UnitPrice.validate() && this.$refs.Quantity.validate()) {
        let answer = {
          componentId: this.componentId,
          price:
            Number(this.newItem.quantity) * Number(this.newItem.unit_price),
        };
        this.$emit("quantityTimesUnitPrice", answer);
      }
    },

    generateString(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result;
    },
  },

  computed: {
    currency() {
      return this.currencyCard;
    },
  },
};
</script>
