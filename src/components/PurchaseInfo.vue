<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" sm="4" md="4">
          <v-text-field
            label="Purchase Personal:"
            v-model="team.procurer.users[0].text"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="2" md="2"></v-col>
        <v-col cols="12" sm="6" md="6">
          <v-tooltip
            top
            :disabled="checkIfUserInAuthorityArray(team.procurer).boolean"
          >
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-radio-group
                  v-model="newCard.procured"
                  row
                  :label="'Procurement Status:'"
                  :disabled="
                    !checkIfUserInAuthorityArray(team.procurer).boolean
                  "
                >
                  <v-radio
                    label="Accept"
                    @click="handleClick(team.procurer, 'procured')"
                    :value="Boolean(true)"
                  ></v-radio>
                  <v-radio
                    label="Reject"
                    @click="handleClick(team.procurer, 'procured')"
                    :value="Boolean(false)"
                  ></v-radio>
                </v-radio-group>
              </div>
            </template>
            <span>{{
              checkIfUserInAuthorityArray(team.procurer).message
            }}</span>
          </v-tooltip>

          <v-dialog v-model="confirmationDialog" persistent max-width="290">
          </v-dialog>
        </v-col>

        <v-container fluid v-if="newCard.procured == false">
          <v-row align-content="center" justify="center">
            <v-col cols="12" sm="2" md="2"></v-col>
            <v-col cols="12" sm="6" md="6">
              <v-card-title class="rejectMsg">
                Procurement Rejected
              </v-card-title>
            </v-col>
          </v-row>
        </v-container>

        <v-row
          v-if="newCard.purchase_order.length == 0 && newCard.procured == true"
          class="purchaseInfoRowPadding"
        >
          <v-col cols="12" sm="5" md="5">
            <v-text-field
              label="Purchase Order Number:"
              v-model="newCard.PO_number"
            >
            </v-text-field>
          </v-col>

          <v-col cols="12" sm="1" md="1"></v-col>

          <v-col cols="12" sm="6" md="6">
            <v-card flat>
              <v-card-text>
                <vue-dropzone
                  ref="myVueDropzone"
                  id="customdropzone"
                  @vdropzone-file-added="fileAddedPurchase"
                  :options="dropzoneOptions"
                  :include-styling="false"
                  :useCustomSlot="true"
                  v-on:vdropzone-thumbnail="thumbnail"
                >
                  <div class="dropzone-custom-content">
                    <h3 style="font-weight: 200">
                      <v-icon medium>backup</v-icon> Drop PO here to upload
                    </h3>
                  </div>
                </vue-dropzone>
              </v-card-text>

              <v-card-actions class="justify-end">
                <v-tooltip left :disabled="newCard.PO_number != null">
                  <template v-slot:activator="{ on, attrs }">
                    <div v-bind="attrs" v-on="on">
                      <v-btn
                        @click="newPurchaseOrder(purchase_order)"
                        dark
                        small
                        text
                        :disabled="newCard.PO_number == null"
                        class="backgroundColorPrimary "
                      >
                        Upload
                      </v-btn>
                    </div>
                  </template>
                  <span>First add Purchase Order Number</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-col v-else-if="newCard.procured == true" cols="12" sm="4" md="4">
          <v-text-field
            label="Purchase Order Number"
            v-model="newCard.PO_number"
            data-cypress="purchaseOrderNumber"
            @change="updatePOnumber()"
          >
          </v-text-field>
        </v-col>

        <v-col cols="12" sm="2" md="2"></v-col>

        <v-col
          v-if="newCard.purchase_order.length != 0 && newCard.procured == true"
          cols="12"
          sm="6"
          md="6"
        >
          <span class="fileLabel">Purchase Order: </span>
          <v-chip
            v-for="file in newCard.purchase_order"
            :key="fileLinkEncoded(file.link)"
            :href="fileLinkEncoded(file.link)"
            target="_blank"
            color="primary"
            dark
            class="mx-1"
            small
          >
            {{ file.file_name }}
          </v-chip>
        </v-col>
        <v-row justify="center" align-content="center">
          <v-col
            cols="12"
            sm="12"
            md="12"
            class="text-center"
            v-if="newCard.POP.length == 0"
          >
            <v-btn
              color="primary"
              small
              dark
              @click="addPOPtoggle = !addPOPtoggle"
            >
              Add POP
            </v-btn>

            <v-card flat v-if="addPOPtoggle">
              <v-card-text>
                <vue-dropzone
                  ref="myVueDropzone"
                  id="customdropzone"
                  @vdropzone-file-added="fileAddedPOP"
                  :options="dropzoneOptions"
                  :include-styling="false"
                  :useCustomSlot="true"
                  v-on:vdropzone-thumbnail="thumbnail"
                >
                  <div class="dropzone-custom-content">
                    <h3 style="font-weight: 200">
                      <v-icon medium>backup</v-icon> Drop POP here to upload
                    </h3>
                  </div>
                </vue-dropzone>
              </v-card-text>

              <v-card-actions class="justify-end">
                <v-btn
                  @click="newPOP(POP)"
                  dark
                  small
                  text
                  class="backgroundColorPrimary "
                >
                  Upload
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-row v-if="newCard.POP.length != 0 && newCard.procured == true">
            <v-col cols="12" sm="3" md="3"></v-col>
            <v-col cols="12" sm="9" md="9" class="text-center">
              <span class="fileLabel">Proof of payment: </span>
              <v-chip
                v-for="file in newCard.POP"
                :key="fileLinkEncoded(file.link)"
                :href="fileLinkEncoded(file.link)"
                target="_blank"
                color="primary"
                dark
                class="mx-1"
                small
              >
                {{ file.file_name }}
              </v-chip>
            </v-col>
          </v-row>
        </v-row>
      </v-row>
      <Comments
        :cardComments="cardComments"
        :position="3"
        :cardId="card.id"
        class="comments"
      ></Comments>
    </v-container>
  </v-form>
</template>

<script>
import { db, storage } from "@/firebase";
import { mapState } from "vuex";
import Comments from "@/components/Comments";
import FileUploadDialog from "@/components/FileUploadDialog";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  components: { Comments, vueDropzone: vue2Dropzone, FileUploadDialog },
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
      addPOPtoggle: false,
      confirmationDialog: false,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        previewTemplate: this.template(),

        uploadMultiple: true,
      },
      inputRules: [(v) => v.length >= 3 || "Minimum length is 3 characters"], //Validation rule for form
      newCard: {
        purchase_order: this.card.purchase_order,
        procured: this.card.procured,
        PO_number: this.card.PO_number,
        POP: this.card.POP,
      },
      POP: [],
      purchase_order: [],
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

    // Add file to POP array
    fileAddedPOP(file) {
      this.POP.push(file);
    },

    // Add file to purchaseOrder array
    fileAddedPurchase(file) {
      this.purchase_order.push(file);
    },

    // Makes sure the link with # doesnt ecscape
    fileLinkEncoded(string) {
      if (string == undefined) {
        return;
      } else if (string.includes("#")) {
        return string.replace("#", "%23");
      } else {
        return string;
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

    // Function moves card by to quotes by making list Id 0
    async moveCardAutoBackward(fbCard) {
      let card = await fbCard.get();
      let cardData = card.data();

      // Move card forward is approved
      fbCard.update({ list_id: 1 });

      // Change the status of product with the moce of card
      let fbProduct = db.collection("products").doc(cardData.product_id);
      await fbProduct.update({
        status: "Quotes",
      });

      // Go up multiple parent components to trigger snackbar
      this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.snackbar.snackbar = true;
      this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.snackbar.newListName =
        "Quotes";

      // Send notification
      this.sendNotification(1, "Quotes");
    },

    // Function moves card by changing the relevant list Id by adding 1
    async moveCardAutoForward(fbCard) {
      let card = await fbCard.get();
      let cardData = card.data();

      // Move card forward is approved
      fbCard.update({ list_id: 5 });

      // Change the status of product with the moce of card
      let fbProduct = db.collection("products").doc(cardData.product_id);
      await fbProduct.update({
        status: "FollowUp",
      });

      // Go up multiple parent components to trigger snackbar
      this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.snackbar.snackbar = true;
      this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.snackbar.newListName =
        "Follow Up";

      // Send notification
      this.sendNotification(5, "Follow Up");
    },

    // Uploads POP to fb
    newPOP(files) {
      const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
      const fbProduct = db.collection("products").doc(this.card.product_id);

      var filesArray = [];

      files.forEach((file) => {
        var fileName = file.name;
        var fileref = storage
          .ref()
          .child(`POP/${this.card.product_id}/${this.card.id}/${fileName}`);

        fileref.put(file);
        let fileObjt = { file_name: fileName, file_doc: file };
        filesArray.push(fileObjt);
      });

      this.newCard.POP = filesArray;

      fbCard.update({ POP_date: new Date() });
      fbProduct.update({ POP_date: new Date() });
      fbProduct.update({ leadTime: this.card.lead_time });

      this.sendNotification(5, "Follow Up");
    },

    // Uploads purchaseOrder to fb
    newPurchaseOrder(files) {
      const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
      fbCard.update({ PO_number: this.newCard.PO_number }); // updates the PO_number on the firebase card
      fbCard.update({ updatedOn: new Date() });

      var filesArray = [];

      files.forEach((file) => {
        var fileName = file.name;
        var fileref = storage
          .ref()
          .child(
            `PurchaseOrders/${this.card.product_id}/${this.card.id}/${fileName}`
          );

        fileref.put(file);
        let fileObjt = { file_name: fileName, file_doc: file };
        filesArray.push(fileObjt);
      });

      this.newCard.purchase_order = filesArray;

      setTimeout(console.log("Done"), 5000);

      this.moveCardAutoForward(fbCard); // move card automatically
    },

    // Changes boolean to Ordered or Not Ordered
    procurementStatus(boolean) {
      if (boolean == true) {
        return "Ordered";
      } else {
        return "Not Ordered";
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

    // Template rendered for dropzone
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

    // Setup function for dropzone
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

    // Update the PO number of the card after it has been typed in
    updatePOnumber() {
      const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
      fbCard.update({ PO_number: this.newCard.PO_number }); // updates the PO_number on the firebase card
      fbCard.update({ updatedOn: new Date() });
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

.fileLabel {
  color: rgba(0, 0, 0, 0.6);
}

.rejectMsg {
  color: tomato;
}
</style>
