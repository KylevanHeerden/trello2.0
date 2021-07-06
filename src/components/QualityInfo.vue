<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" sm="4" md="4" v-if="!newCard.receiver_approval">
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
        <v-col cols="12" sm="4" md="4">
          <v-tooltip top :disabled="Object.keys(newCard.receiver).length !== 0">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-switch
                  v-model="newCard.receiver_approval"
                  :label="`Receiver Confirmation`"
                  @click="handleClick2('receiver_approval')"
                  :disabled="Object.keys(newCard.receiver).length === 0"
                >
                </v-switch>
              </div>
            </template>
            <span>Select a Receiver first</span>
          </v-tooltip>

          <v-dialog v-model="confirmationDialog" persistent max-width="290">
          </v-dialog>
        </v-col>

        <v-col cols="12" sm="3" md="3">
          <v-switch
            v-model="newCard.hubdoc"
            :label="'Attached to Hubdoc'"
            @click="handleClick3()"
            data-cypress="hubdocCheck"
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="6" v-if="newCard.quality_approval == null">
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
            :disabled="Object.keys(newCard.quality_approver).length !== 0"
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
                  :disabled="Object.keys(newCard.quality_approver).length === 0"
                >
                </v-select>
              </div>
            </template>
            <span>Select Quality Approver first</span>
          </v-tooltip>

          <v-dialog v-model="confirmationDialog" persistent max-width="290">
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
                @click="upload_quality_photos = !upload_quality_photos"
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
                    <v-icon medium>backup</v-icon> Drop files here to upload
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
        class="commentsRow"
      ></Comments>
    </v-container>
  </v-form>
</template>

<script>
import { db, storage } from "@/firebase";
import { mapState, mapGetters } from "vuex";
import Comments from "@/components/Comments";
import FileUploadDialog from "@/components/FileUploadDialog";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  components: {
    Comments,
    FileUploadDialog,
    vueDropzone: vue2Dropzone,
  },
  props: {
    team: {
      type: Object,
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
    counter: {
      type: Number,
      required: true,
    },
    commentPosition: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      confirmationDialog: false,
      customStyles: true,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        previewTemplate: this.template(),

        uploadMultiple: true,
      },
      newCard: {
        receiver_approval: this.card.receiver_approval,
        receiver: this.card.team.receiver,
        hubdoc: this.card.hubdoc,
        quality_approval: this.card.quality_approval,
        quality_approver: this.card.team.quality_approver.user,
        quality_photos: this.card.quality_photos,
      },
      quality_approval_options: [
        { text: "Accept", value: true },
        { text: "Reject", value: false },
      ],

      quality_photos: [],
      quality_selected: false,
      receiver_selected: false,
      upload_quality_photos: false,
    };
  },
  computed: {
    ...mapState({
      users: (state) => state.users.users,
      currentUser: (state) => state.profile.userProfile,
      cards: (state) => state.cards,
    }),
    ...mapGetters(["getUsers"]),

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
  },
  methods: {
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
      this.$confirm({
        message: `Are you sure?`,
        button: {
          no: "No",
          yes: "Yes",
        },
        callback: (confirm) => {
          if (confirm) {
            const fbCard = db.collection("cards").doc(this.card.id); // gets the firebase card
            fbCard.update({ hubdoc: this.newCard.hubdoc }); // updates the hubdoc on the firebase card
            fbCard.update({ updatedOn: new Date() });
          } else {
            this.newCard.hubdoc = !this.newCard.hubdoc;
          }
        },
      });
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
  },

  created() {
    this.getUsers;
  },

  mounted() {},
};
</script>

<style>
.backgroundColorPrimary {
  background-color: #37474f;
  color: white;
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

.qualityRejectedTitle {
  color: tomato;
}

.commentsRow {
  margin-top: 1rem;
}
</style>
