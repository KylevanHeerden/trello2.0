<template>
  <v-dialog v-model="fileUploadDialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" x-small dark v-bind="attrs" v-on="on"
        >Add File</v-btn
      >
    </template>

    <v-card>
      <v-card-title class="headline primary">
        Upload New File
      </v-card-title>

      <v-card-text class="cardText">
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
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="fileUploadDialog = false">
          Cancel
        </v-btn>
        <v-btn color="primary" text @click="uploadFilesFunc()">
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db, storage } from "@/firebase";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  components: { vueDropzone: vue2Dropzone },
  props: {
    programmeName: {
      type: String,
      required: true,
    },
    cardId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fileUploadDialog: false,
      files: [],
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        previewTemplate: this.template(),
        uploadMultiple: true,
      },
    };
  },

  methods: {
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

    fileAdded(file) {
      this.files.push(file);
    },

    async uploadFilesFunc() {
      await this.uploadFiles(this.files, this.cardId);

      const cardRef = db.collection("cards").doc(this.cardId);

      let doc = await cardRef.get();

      let old_count = doc.data().files_count;

      await cardRef.update({ files_count: old_count + 1 });

      this.fileUploadDialog = false;
    },

    uploadFiles(files, cardId) {
      files.forEach((file) => {
        var fileName = file.name;
        var fileref = storage
          .ref()
          .child(
            `Quotes/${this.programmeName}/${this.productId}/${cardId}/${fileName}`
          );

        fileref.put(file);
      });
    },
  },
};
</script>

<style scoped>
.headline {
  color: white;
}

.cardText {
  margin-top: 2rem;
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
