<template>
  <div>
    <v-form class="px-3" ref="form">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Supplier"
              v-model="newCard.supplier_name"
              :readonly="editCardInfo"
              :rules="inputRules"
              data-cypress="quoteSupplierName"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Contact Person"
              v-model="newCard.contact_person"
              :readonly="editCardInfo"
              :rules="inputRules"
              data-cypress="quoteContactPerson"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Contact Number"
              v-model="newCard.contact_number"
              :readonly="editCardInfo"
              :rules="inputRulesConNum"
              data-cypress="quoteContactNumber"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Contact Email"
              v-model="newCard.supplier_email"
              :readonly="editCardInfo"
              :rules="inputRulesEmail"
              data-cypress="quoteContactEmail"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-text-field
              label="Supplier Quote Ref Number"
              v-model="newCard.supplier_quote_num"
              :readonly="editCardInfo"
              :rules="inputRules"
              data-cypress="quoteNum"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <p>Attached Files</p>
            <v-chip
              v-for="file in newCard.files"
              :key="file.link"
              :href="file.link"
              target="_blank"
              color="primary"
              dark
              class="mx-1"
              small
              :close="closeChip"
              close-icon="mdi-delete"
              @click:close="deleteFile(file.file_name)"
              data-cypress="quoteFiles"
            >
              {{ file.file_name }}
            </v-chip>
            <v-chip
              v-for="k in files_count"
              :key="k"
              color="blue-grey lighten-2"
              dark
              class="mx-1"
              small
            >
              Pending...
            </v-chip>
            <v-row v-if="cardInfoEditingButtons" class="text-right">
              <v-spacer></v-spacer>
              <FileUploadDialog
                :programmeName="team.programme.programme_name"
                :productId="card.product_id"
                :cardId="card.id"
              ></FileUploadDialog>
            </v-row>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-text-field
              label="Nanodyn Item Description"
              v-model="newCard.nano_item_description"
              :readonly="editCardInfo"
              :rules="inputRules"
              data-cypress="quoteDesciption"
            >
            </v-text-field>
          </v-col>
          <v-col
            v-for="lineItem in lineItemsFiltered"
            :key="lineItem.id"
            cols="12"
            sm="12"
            md="12"
            class="paddingLineItems"
          >
            <v-row>
              <v-col cols="12" md="2">
                <v-text-field
                  label="Item Number"
                  v-model="lineItem.item_number"
                  :readonly="editCardInfo"
                  :rules="inputRulesRequired"
                  @change="
                    lineItemEdit(
                      lineItem.id,
                      'item_number',
                      lineItem.item_number
                    )
                  "
                  data-cypress="lineItemName"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  label="Item Name"
                  v-model="lineItem.item_name"
                  :readonly="editCardInfo"
                  :rules="inputRules"
                  @change="
                    lineItemEdit(lineItem.id, 'item_name', lineItem.item_name)
                  "
                  data-cypress="lineItemNum"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  :ref="`${lineItem.id}_quantity`"
                  label="Quantity"
                  v-model="lineItem.quantity"
                  :readonly="editCardInfo"
                  :rules="inputRulesRequired"
                  @change="
                    lineItemEdit(lineItem.id, 'quantity', lineItem.quantity)
                  "
                  @focus="thisLineItem_quantity = lineItem.quantity"
                  data-cypress="lineItemQuantity"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  :ref="`${lineItem.id}_unitPrice`"
                  :label="`Unit Price Exc ${nonVAT}`"
                  v-model="lineItem.unit_price"
                  :readonly="editCardInfo"
                  :prefix="newCard.currency"
                  :rules="inputRulesMoney"
                  @change="
                    lineItemEdit(lineItem.id, 'unit_price', lineItem.unit_price)
                  "
                  @focus="thisLineItem_unit_price = lineItem.unit_price"
                  data-cypress="lineItemUnitPrice"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-checkbox
                  v-if="newCard.currency == 'R'"
                  v-model="lineItem.exc_VAT"
                  :readonly="editCardInfo"
                  :ref="`${lineItem.id}_exc_VAT`"
                  label="Excl Item VAT"
                  small
                  @change="
                    lineItemEdit(lineItem.id, 'exc_VAT', lineItem.exc_VAT)
                  "
                  data-cypress="lineItemUnitPrice"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field
              label="Lead Time"
              v-model="newCard.lead_time"
              :readonly="editCardInfo"
              suffix="days"
              :rules="inputRulesQuan"
              data-cypress="quoteLeadTime"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="9" md="9">
            <v-text-field
              label="Payment Terms"
              v-model="newCard.payment_terms"
              :readonly="editCardInfo"
              :rules="inputRules"
              data-cypress="quotePaymentTerms"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              :label="`${nonVAT}`"
              v-model="newCard.VAT"
              :readonly="editCardInfo"
              :prefix="newCard.currency"
              :rules="inputRulesVAT"
              data-cypress="quoteVAT"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              :label="`Total Price Exc ${nonVAT}`"
              v-model="newCard.total_exc_vat"
              :readonly="editCardInfo"
              :prefix="newCard.currency"
              :rules="inputRulesMoney"
              data-cypress="quoteExclVAT"
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              :label="`Total Price Inc ${nonVAT}`"
              v-model="newCard.total_inc_vat"
              :readonly="editCardInfo"
              :prefix="newCard.currency"
              :rules="inputRulesMoney"
              data-cypress="quoteTotalIncVAT"
            >
            </v-text-field>
          </v-col>

          <v-col
            v-if="!newCard.procured"
            cols="12"
            sm="12"
            md="12"
            class="text-right"
          >
            <v-btn
              v-if="!cardInfoEditingButtons"
              color="primary"
              dark
              small
              @click="deleteCard"
              class="deleteBtn"
              data-cypress="cardDeleteBtn"
            >
              Delete
            </v-btn>
            <v-btn
              v-if="!cardInfoEditingButtons"
              color="primary"
              dark
              small
              @click="editCard"
              class="editBtn"
              data-cypress="cardEditBtn"
            >
              Edit
            </v-btn>
            <v-btn
              v-if="cardInfoEditingButtons"
              color="primary"
              dark
              small
              @click="cancelCardInfoEdit"
              class="deleteBtn"
              data-cypress="cardEditCancelBtn"
            >
              Cancel
            </v-btn>
            <v-btn
              v-if="cardInfoEditingButtons"
              color="primary"
              dark
              small
              @click="saveCardInfoEdit"
              class="editBtn"
              data-cypress="cardEditSaveBtn"
            >
              Save
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-snackbar
      v-model="snackbar"
      color="red"
      timeout="-1"
      content-class="center"
      data-cypress="editCardSnackBar"
    >
      <v-icon>create</v-icon>
      You are editing the card now.
    </v-snackbar>
    <v-snackbar
      v-model="savedAlert"
      color="green"
      timeout="2000"
      class="text-center"
      data-cypress="updatedCardSnackbar"
    >
      <v-icon>check_circle</v-icon>
      Card updated!
    </v-snackbar>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { mapState } from "vuex";
import FileUploadDialog from "@/components/FileUploadDialog";

export default {
  components: { FileUploadDialog },
  props: {
    card: {
      type: Object,
      require: true,
    },
    team: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      cardInfoEditingButtons: false,
      closeChip: false,
      editCardInfo: true,
      fileRules: [
        (v) => !!v || "File is required",
        (v) => (v && v.length > 0) || "File is required",
      ],
      newCard: {
        name: this.card.name,
        supplier_name: this.card.supplier_name,
        contact_person: this.card.contact_person,
        contact_number: this.card.contact_number,
        supplier_email: this.card.supplier_email,
        supplier_quote_num: this.card.supplier_quote_num,
        nano_item_description: this.card.nano_item_description,
        supplier_item_num: this.card.supp_item_num,
        supplier_item_name: this.card.supp_item_name,
        quantity: this.card.quantity,
        unit_price: this.card.unit_price,
        lead_time: this.card.lead_time,
        VAT: this.card.VAT,
        total_inc_vat: this.card.total_inc_vat,
        total_exc_vat: this.card.total_exc_vat,
        files: this.card.files,
        files_count: this.card.files_count,
        technical_approval: this.card.technical_approval,
        purchase_approval: this.card.purchase_approval,
        procured: this.card.procured,
        receiver_approval: this.card.receiver_approval,
        quality_approval: this.card.quality_approval,
        purchase_order: this.card.purchase_order,
        quality_photos: this.card.quality_photos,
        payment_terms: this.card.payment_terms,
        currency: this.card.currency,
        quality_approver: this.card.team.quality_approver.user,
        receiver: this.card.team.receiver,
        hubdoc: this.card.hubdoc,
        PO_number: this.card.PO_number,
        POP: this.card.POP,
      },
      inputRules: [(v) => v.length >= 3 || "Minimum length is 3 characters"], //Validation rule for form
      inputRulesConNum: [
        (v) =>
          v.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/) ||
          "Invalid contact number",
      ],
      inputRulesEmail: [
        (v) =>
          /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v) ||
          "Invalid email",
      ],
      inputRulesMoney: [
        (v) => v.match(/^\d+(?:\.\d{0,2})$/) || "Must be in the format R0.00",
        (v) => v.length >= 4 || "Minimum length is 4 characters",
      ],
      inputRulesRequired: [(v) => !!v || "Required"],
      inputRulesQuan: [
        (v) => v % 1 == 0 || "Must be a whole number",
        (v) => !!v || "Required",
      ],
      inputRulesVAT: [
        (v) => v.match(/^\d+(?:\.\d{0,2})$/) || "Must be in the format R0.00",
      ],
      savedAlert: false,
      snackbar: false,
    };
  },
  computed: {
    ...mapState({
      cards: (state) => state.cards,
    }),

    card2() {
      return this.cards.find((card) => card.id == this.card.id);
    },

    // This is used to show pending chip if file not uploaded yet
    files_count() {
      let count_array = this.$store.getters.getFilesCount(this.card.id);

      let count = count_array[0] - this.newCard.files.length;

      return count;
    },

    lineItemsFiltered() {
      let FBlineItems = this.$store.getters.getLineItemsByCardId(this.card.id);

      return FBlineItems;
    },

    // Display when the currency not ZAR
    nonVAT() {
      if (this.newCard.currency != "R") {
        return "Customs Duty";
      } else {
        return "VAT";
      }
    },
  },

  methods: {
    // Revert edit after card edit
    cancelCardInfoEdit() {
      this.cardInfoEditingButtons = false;
      this.editCardInfo = true;
      this.snackbar = false;
      this.closeChip = false;

      this.newCard = {
        name: this.card.name,
        supplier_name: this.card.supplier_name,
        contact_person: this.card.contact_person,
        contact_number: this.card.contact_number,
        supplier_email: this.card.supplier_email,
        supplier_quote_num: this.card.supplier_quote_num,
        nano_item_description: this.card.nano_item_description,
        supplier_item_num: this.card.supp_item_num,
        supplier_item_name: this.card.supp_item_name,
        quantity: this.card.quantity,
        unit_price: this.card.unit_price,
        lead_time: this.card.lead_time,
        VAT: this.card.VAT,
        total_inc_vat: this.card.total_inc_vat,
        total_exc_vat: this.card.total_exc_vat,
        files: this.card.files,
        technical_approval: this.card.technical_approval,
        purchase_approval: this.card.purchase_approval,
        procured: this.card.procured,
        receiver_approval: this.card.receiver_approval,
        quality_approval: this.card.quality_approval,
        purchase_order: this.card.purchase_order,
        quality_photos: this.card.quality_photos,
        payment_terms: this.card.payment_terms,
        currency: this.card.currency,
        quality_approver: this.card.team.quality_approver.user,
        receiver: this.card.team.receiver,
      };
    },

    // Function that deletes the card as well as the relevant line items
    deleteCard() {
      this.$confirm({
        message: `Are you sure you want to delete this card permanantly?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
            fbCard.delete();

            this.lineItemsFiltered.forEach((lineItem) => {
              let lineItemId = lineItem.id;

              let lineItemFb = db.collection("line_items").doc(lineItemId);
              lineItemFb.delete();
            });
          }
        },
      });
    },

    // Deletes only the files not the card function
    deleteFile(fileName) {
      this.$confirm({
        message: `Are you sure you want to delete this file permanantly?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: async (confirm) => {
          if (confirm) {
            const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card

            let doc = await fbCard.get();

            // Change the file count
            let old_count = doc.data().files_count;

            // Set the 'files_count' field of the card document
            await fbCard.update({ files_count: old_count - 1 });

            // Find file to delete
            let file = this.newCard.files.find(
              (file) => file.file_name == fileName
            );

            // Find the index of file to delete
            let index = this.newCard.files.indexOf(file);
            let Files = this.newCard.files;

            // Remove file from files array i.e delete file
            Files.splice(index, 1);

            // Update files after file delete
            this.newCard.files = Files;
            fbCard.update({ files: Files });
          }
        },
      });
    },

    // Activates the card edit functionality
    editCard() {
      this.cardInfoEditingButtons = true;
      this.editCardInfo = false;
      this.snackbar = true;
      this.closeChip = true;
    },

    // Edit the line items
    async lineItemEdit(id, changeKey, changeValue) {
      if (this.$refs.form.validate()) {
        const fbCard = db.collection("line_items").doc(id); // gets the firebase card

        // Set value of thisLineItem_unit_price & quantity by focusing
        if (changeKey == "unit_price") {
          this.$refs[`${id}_quantity`][0].focus();
        } else if (changeKey == "quantity") {
          this.$refs[`${id}_unitPrice`][0].focus();
        }

        // Update fb card
        await fbCard.update({
          [changeKey]: changeValue,
        });

        // get new values of lineItem quantity and unit price
        let newQuantity = this.$refs[`${id}_quantity`][0].value;
        let newUnitPrice = this.$refs[`${id}_unitPrice`][0].value;

        let priceArray = [];

        // Set new quantity and unit price values tpo relevant lineItem and make new array with price = quantity*unitprice for all lineItems
        this.lineItemsFiltered.forEach((lineItem) => {
          if (lineItem.id == id) {
            lineItem.unit_price = newUnitPrice;
            lineItem.quantity = newQuantity;
          }

          priceArray.push({
            id: lineItem.id,
            price: Number(lineItem.quantity) * Number(lineItem.unit_price),
            exc_VAT: lineItem.exc_VAT,
          });
        });

        // Calculate the total price of all lineItems
        let priceSum = priceArray.reduce(function(a, b) {
          return Number(a) + Number(b.price);
        }, 0);

        // console.log(`priceSUm: ${priceSum}`);

        let noVAT = 0;
        let yesVAT = 0;

        // Remove from priceSum values that has excVAT == True and add them to noVAt others go to yesVAT
        priceArray.forEach((objt) => {
          if (objt.exc_VAT == true) {
            priceSum -= Number(objt.price);
            noVAT += Number(objt.price);
          } else {
            yesVAT += Number(objt.price);
          }
        });

        // Calculate the desired values
        let finalVAT = (yesVAT * 0.15).toFixed(2);
        let totalExcVAT = Number(yesVAT) + Number(noVAT);
        let finalTotalExc = totalExcVAT.toFixed(2);
        let totalIncVAT = Number(yesVAT) + Number(noVAT) + Number(finalVAT);
        let finalTotalInc = totalIncVAT.toFixed(2);

        // Set newCard value to update UI and fb thereafter
        this.newCard.VAT = finalVAT;
        this.newCard.total_exc_vat = finalTotalExc;
        this.newCard.total_inc_vat = finalTotalInc;
      }
    },

    // Save the card after edit
    saveCardInfoEdit() {
      this.cardInfoEditingButtons = false;
      this.editCardInfo = true;
      this.snackbar = false;
      this.closeChip = false;

      if (this.$refs.form.validate()) {
        const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
        fbCard.update({
          name: this.newCard.name,
          supplier_name: this.newCard.supplier_name,
          contact_person: this.newCard.contact_person,
          contact_number: this.newCard.contact_number,
          supplier_email: this.newCard.supplier_email,
          supplier_quote_num: this.newCard.supplier_quote_num,
          nano_item_description: this.newCard.nano_item_description,
          lead_time: this.newCard.lead_time,
          payment_terms: this.newCard.payment_terms,
          VAT: this.newCard.VAT,
          total_inc_vat: this.newCard.total_inc_vat,
          total_exc_vat: this.newCard.total_exc_vat,
          lineItems: this.lineItemsFiltered,
        });
      }

      this.savedAlert = true;
    },
  },

  mounted() {},
};
</script>

<style scoped>
.deleteBtn {
  margin-left: 5px;
  margin-right: 5px;
}

.editBtn {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
