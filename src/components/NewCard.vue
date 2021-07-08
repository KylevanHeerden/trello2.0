<template>
  <v-dialog
    v-model="newCardDialog"
    scrollable
    persistent
    max-width="1000"
    data-cypress="addNewCardDialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="ma-2"
        fab
        elevation="2"
        small
        dark
        color="#26a69a"
        v-bind="attrs"
        v-on="on"
        data-cypress="addNewCardBtn1"
      >
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline backgroundColorPrimary">
        New Quote
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Card Name"
                  v-model="newCard.name"
                  :rules="inputRules"
                  data-cypress="newCardName"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-combobox
                  label="Supplier"
                  v-model="newCard.supplier_name"
                  :rules="inputRules"
                  :items="this.suppliers"
                  item-text="supplier_name"
                  item-value="supplier_name"
                  @change="updateSupplierInfo"
                  hint="Select Supplier or create new one"
                  persistent-hint
                  :search-input.sync="search"
                  data-cypress="newCardSupplier"
                >
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          No results matching "<strong>{{ search }}</strong
                          >". This supplier will be added as a new supplier.
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Contact Person"
                  v-model="newCard.contact_person"
                  :rules="inputRules"
                  data-cypress="newCardContactPerson"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Contact Number"
                  v-model="newCard.contact_number"
                  :rules="inputRulesConNum"
                  data-cypress="newCardContactNum"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Contact Email"
                  v-model="newCard.supplier_email"
                  :rules="inputRulesEmail"
                  data-cypress="newCardSuppEmail"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  label="Quote Ref Number"
                  v-model="newCard.supplier_quote_num"
                  :rules="inputRules"
                  data-cypress="newCardQuoteRef"
                >
                </v-text-field>
              </v-col>

              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  label="Item Description"
                  v-model="newCard.nano_item_description"
                  :rules="inputRules"
                  :counter="100"
                  data-cypress="newCardItemDescrp"
                >
                </v-text-field>
              </v-col>

              <v-container
                fluid
                v-for="n in numOfLineItems"
                :key="n"
                class="padding0"
              >
                <LineItem
                  ref="lineItems"
                  :submitValue="submitValue"
                  :cardId="cardId"
                  :programmeId="programme.id"
                  :componentId="n"
                  :currencyCard="newCard.currency"
                  @quantityTimesUnitPrice="updatePrice($event)"
                  @lineItemData="recieveLineItemsData($event)"
                ></LineItem>
              </v-container>

              <v-col cols="12" sm="6" md="6" align="left" class="padding0">
                <p class="caption">*Add delivery cost as a line item</p>
              </v-col>

              <v-col cols="12" sm="6" md="6" align="right" class="padding0">
                <v-btn
                  x-small
                  @click="numOfLineItems += 1"
                  class="backgroundColorPrimary"
                  data-cypress="addLineItemBtn"
                >
                  + Line Item
                </v-btn>
                <v-btn
                  x-small
                  @click="numOfLineItems -= 1"
                  class="backgroundColorPrimary paddingleft1rem"
                  data-cypress="removeLineItemBtn"
                >
                  - Line Item
                </v-btn>
              </v-col>

              <v-col cols="12" sm="2" md="2">
                <v-select
                  ref="currency"
                  label="Currency"
                  @change="updateTotal()"
                  v-model="newCard.currency"
                  :items="currency_options"
                  :value="currency_options.value"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-text-field
                  label="Lead Time"
                  v-model="newCard.lead_time"
                  suffix="days"
                  :rules="inputRulesQuan"
                  data-cypress="newCardLeadTime"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="7" md="7">
                <v-text-field
                  label="Payment Terms"
                  v-model="newCard.payment_terms"
                  :rules="inputRules"
                  data-cypress="newCardPaymentTerms"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-checkbox
                  v-model="VATexclude"
                  :label="`Exclude ${nonVAT}`"
                  @change="updateTotal()"
                  data-cypress="newCardExcludeVAT"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  v-if="!VATexclude"
                  :label="`${nonVAT}`"
                  v-model="newCard.VAT"
                  @change="updateTotal()"
                  :rules="inputRulesVAT"
                  :prefix="newCard.currency"
                  data-cypress="newCardVAT"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-if="!VATexclude"
                  :label="`Total Price Exc ${nonVAT}`"
                  v-model="newCard.total_exc_vat"
                  :rules="inputRulesMoney"
                  :prefix="newCard.currency"
                  data-cypress="newCardTotalExcVAT"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Total Price"
                  v-model="newCard.total_inc_vat"
                  :rules="inputRulesMoney"
                  :prefix="newCard.currency"
                  data-cypress="newCardTotalInclVAT"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <vue-dropzone
                  ref="myVueDropzone"
                  id="customdropzone"
                  @vdropzone-file-added="fileAdded"
                  :options="dropzoneOptions"
                  :include-styling="false"
                  :useCustomSlot="true"
                  v-on:vdropzone-thumbnail="thumbnail"
                >
                  <div class="dropzone-custom-content">
                    <h3 style="font-weight: 200">
                      <v-icon medium>backup</v-icon> Drop files here to upload
                    </h3>
                  </div>
                </vue-dropzone>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-grey darken-3"
          text
          @click="newCardDialog = false"
          v-if="!loading"
          data-cypress="cancelNewCardBtn"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue-grey darken-3"
          text
          @click="submit"
          :loading="loading"
          data-cypress="addNewCardBtn2"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db, storage } from "@/firebase";
import LineItem from "@/components/LineItem.vue";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  name: "NewCard",
  components: { LineItem, vueDropzone: vue2Dropzone },
  props: {
    productId: {
      type: String,
      required: true,
    },
    programme: {
      type: Object,
      required: true,
    },
    team: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      submitValue: false,
      numOfLineItems: 1,
      cardId: "",
      search: null,
      newCardDialog: false,
      loading: false,
      inputRulesRequired: [(v) => !!v || "Required"],
      fileRules: [
        (v) => !!v || "File is required",
        (v) => (v && v.length > 0) || "File is required",
      ],
      inputRules: [(v) => v.length >= 3 || "Minimum length is 3 characters"], //Validation rule for form
      inputRulesConNum: [
        // (v) =>
        //   v.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/) ||
        //   "Invalid contact number",
        (v) => v.match(/^[0-9]*$/) || "Invalid contact number",
        (v) => v.length >= 10 || "Invalid contact number",
      ],
      inputRulesEmail: [
        (v) =>
          /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v) ||
          "Invalid email",
      ],
      inputRulesQuan: [
        (v) => v % 1 == 0 || "Must be a whole number",
        (v) => !!v || "Required",
      ],
      inputRulesMoney: [
        (v) => v.match(/^\d+(?:\.\d{0,2})$/) || "Must be in the format R0.00",
        (v) => v.length >= 5 || "Minimum length is 4 characters",
      ],
      inputRulesVAT: [
        (v) => v.match(/^\d+(?:\.\d{0,2})$/) || "Must be in the format R0.00",
      ],
      newCard: {
        product_id: this.productId,
        list_id: 1,
        name: "",
        supplier_name: "",
        contact_person: "",
        contact_number: "",
        supplier_email: "",
        supplier_quote_num: "",
        nano_item_description: "",
        lead_time: "",
        VAT: "",
        total_inc_vat: "",
        total_exc_vat: "",
        files: [],
        updatedOn: new Date(),
        createdOn: new Date(),
        technical_approval: null,
        purchase_approval: null,
        procured: null,
        receiver_approval: false,
        quality_approval: null,
        purchase_order: [],
        team: {},
        price: 0,
        price_noVAT: 0,
        payment_terms: "",
        currency: "R",
        hubdoc: false,
        creator: "",
        PO_number: null,
        POP: [],
      },
      priceArray: [{ componentId: 0, price: 0, exc_VAT: false }],
      componentIdArray: [],
      lineItemsArray: [],
      VATexclude: false,
      currency_options: [
        { text: "ZAR (R)", value: "R" },
        { text: "EUR(€)", value: "€" },
        { text: "GBP (£)", value: "£" },
        { text: "USD ($)", value: "$" },
      ],
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        previewTemplate: this.template(),
        uploadMultiple: true,
      },
    };
  },

  computed: {
    suppliers() {
      let suppliers = this.$store.getters.getSuppliers;
      return suppliers;
    },

    user() {
      let user = this.$store.getters.getUserProfile;
      return user;
    },

    nonVAT() {
      if (this.newCard.currency != "R") {
        return "Customs Duty";
      } else {
        return "VAT";
      }
    },
  },

  methods: {
    fileAdded(file) {
      this.newCard.files.push(file);
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        this.newCard.product_id = this.productId;

        var FBcard = await db.collection("cards").add({});

        this.cardId = FBcard.id;

        let FBproduct = await db
          .collection("products")
          .doc(this.newCard.product_id)
          .get();

        let FBproductData = FBproduct.data();

        FBproductData.cards.push({
          card_id: FBcard.id,
          card_name: this.newCard.name,
        });

        await db
          .collection("products")
          .doc(this.newCard.product_id)
          .set(FBproductData);

        const cardData = {
          files: [],
          name: this.newCard.name,
          VAT: this.newCard.VAT,
          contact_person: this.newCard.contact_person,
          contact_number: this.newCard.contact_number,
          createdOn: this.newCard.createdOn,
          lead_time: this.newCard.lead_time,
          list_id: this.newCard.list_id,
          nano_item_description: this.newCard.nano_item_description,
          product_id: this.newCard.product_id,
          supplier_name: this.newCard.supplier_name,
          supplier_email: this.newCard.supplier_email,
          supplier_quote_num: this.newCard.supplier_quote_num,
          total_exc_vat: this.newCard.total_exc_vat,
          total_inc_vat: this.newCard.total_inc_vat,
          updatedOn: this.newCard.updatedOn,
          technical_approval: this.newCard.technical_approval,
          purchase_approval: this.newCard.purchase_approval,
          procured: this.newCard.procured,
          receiver_approval: this.newCard.receiver_approval,
          quality_approval: this.newCard.quality_approval,
          purchase_order: [],
          team: this.team,
          lineItems: this.lineItemsArray,
          creator: this.user.id,
          quality_photos: [],
          payment_terms: this.newCard.payment_terms,
          currency: this.newCard.currency,
          files_count: this.newCard.files.length,
          hubdoc: this.newCard.hubdoc,
          PO_number: this.newCard.PO_number,
          POP: this.newCard.POP,
        };

        await db
          .collection("cards")
          .doc(FBcard.id)
          .set(cardData);

        this.uploadfiles(this.newCard.files, FBcard.id);

        await FBcard.update({ lineItems: this.lineItemsArray });

        this.$emit("addNewCardToArray", cardData);

        this.addNewSupplier(
          this.newCard.supplier_name,
          this.newCard.supplier_email,
          this.newCard.contact_number,
          this.newCard.contact_person
        );

        this.submitValue = true;

        this.newCard.product_id = 0;
        this.loading = false;
        this.newCardDialog = false;
      }
    },

    async addNewSupplier(supplierName, email, number, person) {
      let suppliers_names = [];

      this.suppliers.forEach((supplier) => {
        suppliers_names.push(supplier.supplier_name);
      });

      if (!suppliers_names.includes(supplierName)) {
        var FBsupplier = await db.collection("suppliers").add({});
        var supplierData = {
          contact_email: email,
          contact_number: number,
          contact_person: person,
          createdOn: new Date(),
          supplier_name: supplierName,
          updatedOn: new Date(),
        };

        await db
          .collection("suppliers")
          .doc(FBsupplier.id)
          .set(supplierData);
      } else {
        ("");
      }
    },

    uploadfiles(files, cardId) {
      files.forEach((file) => {
        var fileName = file.name;
        var fileref = storage
          .ref()
          .child(
            `Quotes/${this.programme.name}/${this.productId}/${cardId}/${fileName}`
          );

        fileref.put(file);
      });
    },

    updatePrice(answer) {
      if (this.componentIdArray.includes(answer.componentId)) {
        let oldPrice = this.priceArray.find(
          (item) => item.componentId == answer.componentId
        );

        oldPrice.price = answer.price;
        oldPrice.exc_VAT = answer.exc_VAT;

        // Calculate the total price of all lineItems
        let priceSum = this.priceArray.reduce(function(a, b) {
          return a + b.price;
        }, 0);

        let noVAT = 0;

        // Remove from priceSum values that has excVAT == True
        this.priceArray.forEach((objt) => {
          if (objt.exc_VAT == true) {
            priceSum -= objt.price;
            noVAT += objt.price;
          }
        });

        // Use the one to caluculate total VAT and second just to add
        this.newCard.price = Number(priceSum);
        this.newCard.price_noVAT = Number(noVAT);
      } else {
        this.componentIdArray.push(answer.componentId);

        this.priceArray.push({
          componentId: answer.componentId,
          price: answer.price,
          exc_VAT: answer.exc_VAT,
        });

        let priceSum = this.priceArray.reduce(function(a, b) {
          return a + b.price;
        }, 0);

        let noVAT = 0;

        this.priceArray.forEach((objt) => {
          if (objt.exc_VAT == true) {
            priceSum -= objt.price;
            noVAT += objt.price;
          }
        });

        this.newCard.price = Number(priceSum);
        this.newCard.price_noVAT = Number(noVAT);
      }

      this.updateVat(this.newCard.price);
      this.updateTotal();
    },

    updateVat(incVAT) {
      if (this.newCard.currency != "R") {
        if (this.VATexclude) {
          this.newCard.VAT = 0.0;
        }
      } else {
        if (this.VATexclude) {
          this.newCard.VAT = 0.0;
        } else {
          this.newCard.VAT = (incVAT * 0.15).toFixed(2);
        }
      }
    },

    updateTotal() {
      this.updateVat(this.newCard.price);
      if (this.VATexclude) {
        this.newCard.VAT = 0.0;

        this.newCard.total_exc_vat = this.newCard.price.toFixed(2);
        this.newCard.total_inc_vat = (
          parseFloat(this.newCard.price) + parseFloat(this.newCard.VAT)
        ).toFixed(2);
      } else {
        this.newCard.total_exc_vat = (
          parseFloat(this.newCard.price) + parseFloat(this.newCard.price_noVAT)
        ).toFixed(2);
        this.newCard.total_inc_vat = (
          parseFloat(this.newCard.price) +
          parseFloat(this.newCard.price_noVAT) +
          parseFloat(this.newCard.VAT)
        ).toFixed(2);
      }
    },

    updateSupplierInfo(event) {
      if (typeof event == "object") {
        this.newCard.supplier_name = event.supplier_name;

        this.newCard.contact_person = event.contact_person;
        this.newCard.contact_number = event.contact_number;
        this.newCard.supplier_email = event.contact_email;
      }
    },

    recieveLineItemsData(lineItem) {
      this.lineItemsArray.push(lineItem);
    },
    template: function() {
      return `<div class="dz-preview dz-file-preview" style="position: relative; display: inline-block; width: 100px;height: 120px;margin-left: 10px !important;padding: 8px;padding-bottom: 10px;background-color: rgba(0, 0, 0, 0.05); text-align: center; border-radius: 10px;">
                <span data-dz-remove>
                  <i style="transform: translate(45px, -15px);" class="material-icons">cancel</i>
                  </span>
                <div style="margin-top: 2px">
                  <div class="dz-image">
                      <div data-dz-thumbnail></div>
                  </div>
                  <div class="dz-details">
                      <div class="dz-filename"><span data-dz-name></span></div>
                  </div>
                  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                  <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  <div class="dz-success-mark"><i class="fa fa-check"></i></div>
                  <div class="dz-error-mark"><i class="fa fa-close"></i></div>
                </div>
            </div>
        `;
    },
    thumbnail: function(file, dataUrl) {
      var j, len, ref, thumbnailElement;
      if (file.previewElement) {
        file.previewElement.classList.remove("dz-file-preview");
        ref = file.previewElement.querySelectorAll("[data-dz-thumbnail-bg]");
        for (j = 0, len = ref.length; j < len; j++) {
          thumbnailElement = ref[j];
          thumbnailElement.alt = file.name;
          thumbnailElement.style.backgroundImage = 'url("' + dataUrl + '")';
        }
        return setTimeout(
          (function() {
            return function() {
              return file.previewElement.classList.add("dz-image-preview");
            };
          })(this),
          1
        );
      }
    },
  },

  mounted() {
    this.$store.dispatch("getUsers");
    this.$store.dispatch("getSuppliers");
  },
};
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 10px !important;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1 !important;
  border-radius: 5px !important;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #d4d4d4 !important;
  border-radius: 5px !important;
}

.backgroundColorPrimary {
  background-color: #37474f !important;
  color: white;
}

.padding0 {
  padding: 0px !important;
}

.paddingleft1rem {
  margin-left: 1rem;
}

.caption {
  color: #9e9e9e;
  display: inline-block;
}

.dropzone-custom-content {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

#customdropzone {
  background-color: #ffffff;
  font-family: "Arial", sans-serif;
  letter-spacing: 0.2px;
  color: #777;
  transition: background-color 0.2s linear;
  height: 200px;
  padding: 40px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

#customdropzone .dz-preview .dz-image {
  width: 80px;
  height: 80px;
  display: inline;
}
#customdropzone .dz-preview .dz-image > div {
  width: 80px;
  height: inherit;
  border-radius: 50%;
  background-size: contain;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

#customdropzone .dz-preview .dz-details {
  transition: opacity 0.2s linear;
  text-align: center;
}
#customdropzone .dz-success-mark,
.dz-error-mark,
.dz-remove {
  display: none;
}

#customdropzone .dz-remove {
  margin-top: 5px !important;
}
</style>
