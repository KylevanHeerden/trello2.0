<template>
  <div class="card">
    <v-dialog
      v-model="cardDialog"
      persistent
      max-width="1000"
      scrollable
      data-cypress="cardDialog"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-card class="ma-2 border d-flex" v-bind="attrs" v-on="on">
          <v-card-subtitle>
            {{ card.name }}
          </v-card-subtitle>
          <v-progress-circular
            :color="progressbarColor(listId)[0]"
            :value="progressbarColor(listId)[1]"
            size="24"
            class="mt-4 mr-5 ml-auto"
            data-cypress="progressCircle"
          ></v-progress-circular>
        </v-card>
      </template>
      <v-card data-cypress="cardInfo">
        <v-card-actions class="pt-2 pr-2 align-right backgroundColorPrimary">
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            icon
            x-small
            text
            @click="cardDialog = false"
            data-cypress="cardDialogCloseBtn"
          >
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-actions>

        <v-card-title class="mb-2 headline backgroundColorPrimary">
          {{ card.name }}
        </v-card-title>

        <v-card-text>
          <v-stepper flat vertical>
            <v-stepper-step step="1" editable>Purchase Request</v-stepper-step>
            <v-stepper-content step="1">
              Purchase request from
              {{ card.supplier_name }}.
            </v-stepper-content>

            <v-stepper-step
              @click="counter += 1"
              step="2"
              editable
              data-cypress="quoteInfoBtn"
            >
              Quote Information
            </v-stepper-step>

            <v-stepper-content step="2">
              <QuoteInfo :card="card" :team="team"></QuoteInfo>
            </v-stepper-content>

            <v-stepper-step
              step="3"
              :editable="listId >= 2"
              data-cypress="technicalInfo"
            >
              Technical Approval Information
            </v-stepper-step>

            <v-stepper-content step="3">
              <TechPurApproval
                :stepName="'technical'"
                :team="team"
                :card="card"
                :cardComments="cardComments"
                :counter="counter"
                :commentPosition="1"
              ></TechPurApproval>
            </v-stepper-content>

            <v-stepper-step step="4" :editable="listId >= 3">
              Purchase Approval Information
            </v-stepper-step>

            <v-stepper-content step="4">
              <TechPurApproval
                :stepName="'purchase'"
                :team="team"
                :card="card"
                :cardComments="cardComments"
                :counter="counter"
                :commentPosition="2"
              ></TechPurApproval>
            </v-stepper-content>

            <v-stepper-step step="5" :editable="listId >= 4">
              Purchase Information
            </v-stepper-step>
            <v-stepper-content step="5">
              <PurchaseInfo
                :stepName="'procurement'"
                :team="team"
                :card="card"
                :cardComments="cardComments"
                :counter="counter"
                :commentPosition="3"
              ></PurchaseInfo>
            </v-stepper-content>

            <v-stepper-step
              step="6"
              :editable="listId >= 5"
              data-cypress="qualityInfo"
            >
              Quality Approval Information
            </v-stepper-step>
            <v-stepper-content step="6">
              <v-form>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="4"
                      md="4"
                      v-if="!newCard.receiver_approval"
                    >
                      <v-select
                        v-model="newCard.receiver"
                        label="Receiver"
                        :items="mapUsersArray"
                        chips
                        return-object
                        @change="receiver_selected = true"
                        data-cypress="receiverSelect"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="4" md="4" v-else>
                      <v-text-field
                        v-model="newCard.receiver.text"
                        label="Receiver"
                        readonly
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="5" md="5">
                      <v-tooltip
                        top
                        :disabled="Object.keys(newCard.receiver).length !== 0"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on">
                            <v-switch
                              v-model="newCard.receiver_approval"
                              :label="
                                `Receiver Confirmation: ${approvedStatus(
                                  newCard.receiver_approval
                                )}`
                              "
                              @click="handleClick2('receiver_approval')"
                              :disabled="
                                Object.keys(newCard.receiver).length === 0
                              "
                            >
                            </v-switch>
                          </div>
                        </template>
                        <span>Select a Receiver first</span>
                      </v-tooltip>

                      <v-dialog
                        v-model="confirmationDialog"
                        persistent
                        max-width="290"
                      >
                      </v-dialog>
                    </v-col>

                    <v-col cols="12" sm="3" md="3">
                      <v-checkbox
                        v-model="newCard.hubdoc"
                        :label="'Attached to Hubdoc'"
                        @click="handleClick3()"
                        data-cypress="hubdocCheck"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                      v-if="newCard.quality_approval == null"
                    >
                      <v-select
                        v-model="newCard.quality_approver"
                        label="Quality Approver"
                        :items="mapUsersArray"
                        chips
                        return-object
                        @change="quality_selected = true"
                        data-cypress="qualitySelect"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-else>
                      <v-text-field
                        v-model="newCard.quality_approver.text"
                        label="Quality Approver"
                        readonly
                        data-cypress="qualityApprove"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-tooltip
                        top
                        :disabled="
                          Object.keys(newCard.quality_approver).length !== 0
                        "
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on">
                            <v-select
                              v-model="newCard.quality_approval"
                              label="Quality Approval"
                              :items="quality_approval_options"
                              item-text="text"
                              item-value="value"
                              @change="handleClick2('quality_approval')"
                              :disabled="
                                Object.keys(newCard.quality_approver).length ===
                                  0
                              "
                            >
                            </v-select>
                          </div>
                        </template>
                        <span>Select Quality Approver first</span>
                      </v-tooltip>

                      <v-dialog
                        v-model="confirmationDialog"
                        persistent
                        max-width="290"
                      >
                      </v-dialog>
                    </v-col>

                    <v-container fluid v-if="newCard.quality_approval == false">
                      <v-row align-content="center" justify="center">
                        <v-col cols="12" sm="4" md="4">
                          <v-card-title class="qualityRejectedTitle">
                            Quality Check Rejected
                          </v-card-title>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-container
                      fluid
                      v-if="
                        newCard.quality_photos.length === 0 &&
                          newCard.quality_approval !== null
                      "
                    >
                      <v-row align-content="center" justify="center">
                        <v-col cols="12" sm="4" md="4">
                          <v-btn
                            @click="
                              upload_quality_photos = !upload_quality_photos
                            "
                            dark
                            small
                            color="#37474f"
                          >
                            Add Quality Documents
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-container fluid v-if="upload_quality_photos">
                      <v-row>
                        <v-col cols="12" sm="10" md="10">
                          <vue-dropzone
                            ref="myVueDropzone"
                            id="customdropzone"
                            @vdropzone-file-added="fileAddedQuality"
                            :options="dropzoneOptions"
                            :include-styling="false"
                            :useCustomSlot="true"
                            v-on:vdropzone-thumbnail="thumbnail"
                          >
                            <div class="dropzone-custom-content">
                              <h3 style="font-weight: 200">
                                <v-icon medium>backup</v-icon> Drop files here
                                to upload
                              </h3>
                            </div>
                          </vue-dropzone>
                        </v-col>
                        <v-col cols="12" sm="2" md="2" class="bordertop3rem">
                          <v-btn
                            @click="newQualityPhoto(quality_photos)"
                            dark
                            small
                            text
                            class="backgroundColorPrimary "
                          >
                            Upload
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>

                    <v-col
                      cols="12"
                      sm="12"
                      md="12"
                      v-else-if="newCard.quality_photos.length !== 0"
                    >
                      <span>Quality approval files:</span>
                      <v-chip
                        v-for="file in newCard.quality_photos"
                        :key="file.link"
                        :href="file.link"
                        target="_blank"
                        color="primary"
                        dark
                        class="mx-1"
                        small
                        @click="file.link"
                      >
                        {{ file.file_name }}
                      </v-chip>
                    </v-col>
                  </v-row>
                  <Comments
                    :cardComments="cardComments"
                    :position="4"
                    :cardId="card.id"
                  ></Comments>
                </v-container>
              </v-form>
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
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
import { db, storage } from "@/firebase";
import Comments from "@/components/Comments";
import QuoteInfo from "@/components/QuoteInfo";
import TechPurApproval from "@/components/TechPurApproval";
import PurchaseInfo from "@/components/PurchaseInfo";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import FileUploadDialog from "@/components/FileUploadDialog";
import { mapState, mapGetters } from "vuex";

export default {
  components: {
    Comments,
    vueDropzone: vue2Dropzone,
    FileUploadDialog,
    QuoteInfo,
    TechPurApproval,
    PurchaseInfo,
  },
  props: {
    listId: {
      type: Number,
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
    team: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      snackbar: false,
      savedAlert: false,
      disabled: false,
      cardDialog: false,
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
      quality_selected: false,
      receiver_selected: false,
      confirmationDialog: false,
      purchase_order: [],
      addPOPtoggle: false,
      POP: [],
      lineItemsArray: this.lineItemsFiltered,
      thisLineItem_unit_price: "",
      thisLineItem_quantity: "",
      thisLineItem_exc_VAT: null,
      quality_photos: [],
      counter: 0,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        previewTemplate: this.template(),

        uploadMultiple: true,
      },
      customStyles: true,
      editCardInfo: true,
      cardInfoEditingButtons: false,
      closeChip: false,
      quality_approval_options: [
        { text: "Accept", value: true },
        { text: "Reject", value: false },
      ],
      upload_quality_photos: false,
      inputRulesRequired: [(v) => !!v || "Required"],
      fileRules: [
        (v) => !!v || "File is required",
        (v) => (v && v.length > 0) || "File is required",
      ],
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
      inputRulesQuan: [
        (v) => v % 1 == 0 || "Must be a whole number",
        (v) => !!v || "Required",
      ],
      inputRulesMoney: [
        (v) => v.match(/^\d+(?:\.\d{0,2})$/) || "Must be in the format R0.00",
        (v) => v.length >= 4 || "Minimum length is 4 characters",
      ],
      inputRulesVAT: [
        (v) => v.match(/^\d+(?:\.\d{0,2})$/) || "Must be in the format R0.00",
      ],
    };
  },

  computed: {
    ...mapState({
      users: (state) => state.users.users,
      currentUser: (state) => state.profile.userProfile,
      cards: (state) => state.cards,
    }),
    ...mapGetters(["getUsers"]),

    card2() {
      return this.cards.find((card) => card.id == this.card.id);
    },

    lineItemsFiltered() {
      let FBlineItems = this.$store.getters.getLineItemsByCardId(this.card.id);

      return FBlineItems;
    },

    mapUsersArray() {
      // make an array where the keys for each user object is changed to text & value for the select
      let mapUsersArray = [];
      this.users.forEach((user) => {
        let map = {
          text: user.name + " " + user.surname,
          value: user.id,
          slack_id: user.slack_id,
        };
        mapUsersArray.push(map);
      });
      return mapUsersArray;
    },

    files_count() {
      let count_array = this.$store.getters.getFilesCount(this.card.id);

      let count = count_array[0] - this.newCard.files.length;

      return count;
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
    progressbarColor: function(listid) {
      const colors = {
        1: ["teal lighten-1", 14.3],
        2: ["amber accent-2", 28.5],
        3: ["orange", 42.85],
        4: ["red", 57.14],
        5: ["light-green lighten-1", 71.43],
        6: ["indigo lighten-1", 100],
      };

      return colors[listid];
    },
    approvedStatus(boolean) {
      if (boolean == true) {
        return "Approved";
      } else {
        return "Not Approved";
      }
    },
    approvedStatus2(boolean) {
      if (boolean == true) {
        return "Approved";
      } else if (boolean == false) {
        return "Rejected";
      } else {
        return "No Action Yet";
      }
    },
    procurementStatus(boolean) {
      if (boolean == true) {
        return "Ordered";
      } else {
        return "Not Ordered";
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

            if (confirm) {
              if (statusType == "technical_approval") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ technical_approval: param }); // updates the list id on the firebase card
                fbCard.update({ updatedOn: new Date() });
              } else if (statusType == "purchase_approval") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ purchase_approval: param }); // updates the list id on the firebase card
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
                }
              } else if (statusType == "procured") {
                const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
                fbCard.update({ procured: param }); // updates the list id on the firebase card
                fbCard.update({ updatedOn: new Date() });
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

    handleClick2(statusType) {
      this.$confirm({
        message: `Are you sure?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          let param = this.newCard[statusType];

          if (confirm) {
            if (statusType == "receiver_approval") {
              const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
              fbCard.update({ receiver_approval: param }); // updates the list id on the firebase card
              fbCard.update({ updatedOn: new Date() });

              fbCard.update({
                "team.receiver": this.newCard.receiver,
              });
            } else if (statusType == "quality_approval") {
              const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
              fbCard.update({ quality_approval: param }); // updates the list id on the firebase card
              fbCard.update({ updatedOn: new Date() });

              fbCard.update({
                "team.quality_approver.user": this.newCard.quality_approver,
              });
            }
          } else {
            this.newCard[statusType] = !this.newCard[statusType];
          }
        },
      });
    },

    handleClick3() {
      const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
      fbCard.update({ hubdoc: this.newCard.hubdoc }); // updates the hubdoc on the firebase card
      fbCard.update({ updatedOn: new Date() });
    },

    checkIfUserInAuthorityArray(teamAuthority) {
      //This function checks if current user part of the users assigned to the authority role
      let userId = this.currentUser.id;

      let teamAuthorityUsersArray = [];

      teamAuthority.users.forEach((user) => {
        teamAuthorityUsersArray.push(user.value);
      });
      // console.log(teamAuthorityUsersArray);
      // console.log(userId);
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

    fileAddedQuality(file) {
      this.quality_photos.push(file);
      this.customStyles != this.customStyles;
    },

    newQualityPhoto(files) {
      var filesArray = [];

      files.forEach((file) => {
        var fileName = file.name;
        var fileref = storage
          .ref()
          .child(
            `QualityPhotos/${this.product_id}/${this.card.id}/${fileName}`
          );

        fileref.put(file);
        let fileObjt = { file_name: fileName, file_doc: file };
        filesArray.push(fileObjt);
      });

      this.newCard.quality_photos = filesArray;
      this.upload_quality_photos = false;
    },
    template: function() {
      return `<div class="dz-preview dz-file-preview" style=" position: relative; display: inline-block;  margin-left: 5px; width: 100px;height: 60px;padding: 8px;background-color: rgba(0, 0, 0, 0.05); text-align: center; border-radius: 10px;">
                  <span data-dz-remove>
                  <i style="transform: translate(45px, -15px);" class="material-icons">cancel</i>
                  </span>
                  <div class="dz-image">
                      <div data-dz-thumbnail></div>
                  </div>
                  <div class="dz-details" style="transform: translate(0px, -18px)">
                      <div class="dz-filename" style="overflow: hidden; height: 20px"><span data-dz-name></span></div>
                  </div>
                  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                  <div class="dz-error-message"><span data-dz-errormessage></span></div>
                  <div class="dz-success-mark"><i class="fa fa-check"></i></div>
                  <div class="dz-error-mark"><i class="fa fa-close"></i></div>

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

    fileLinkEncoded(string) {
      if (string == undefined) {
        return;
      } else if (string.includes("#")) {
        return string.replace("#", "%23");
      } else {
        return string;
      }
    },
  },

  created() {
    this.getUsers;
  },

  mounted() {},
};
</script>

<style scoped>
.v-card__title {
  padding-top: 0 !important;
}

.border {
  max-width: 250px !important; /* This is only for the cards on the bord, to prevent modal card to be limited */
  border-left: 3px solid #78909c;
}

.v-stepper {
  box-shadow: none;
}

.backgroundColorPrimary {
  background-color: #37474f;
  color: white;
}

.smallP {
  font-size: x-small !important;
}

.bordertop3rem {
  padding-top: 3rem !important;
  padding-right: 2rem !important;
}

.padding0 {
  padding: 0px !important;
}

.paddingLineItems {
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 10px;
  padding-right: 10px;
}

.dropzone-custom-content {
  position: relative;
  top: 60%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}

#customdropzone {
  background-color: #ffffff;
  font-family: "Arial", sans-serif;
  letter-spacing: 0.2px;
  color: #777;
  transition: background-color 0.2s linear;
  height: 120px;
  padding: 20px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  align-content: left;
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

#customdropzone .dz-filename {
  overflow: hidden;
  height: 20px;
}

#customdropzone .dz-success-mark,
.dz-error-mark,
.dz-remove {
  display: none;
}

.material-icons:before {
  display: none;
}

.deleteBtn {
  margin-left: 5px;
  margin-right: 5px;
}

.editBtn {
  margin-left: 5px;
  margin-right: 5px;
}

.qualityRejectedTitle {
  color: tomato;
}

.purchaseInfoRowPadding {
  padding-left: 0.5rem;
}
</style>
