<template>
  <v-col cols="12" sm="12" md="12">
    <div v-for="comment in commentsPerPosition(position)" :key="comment.id">
      <v-row data-cypress="comments" class="commentRow">
        <v-col cols="12" sm="1" md="1">
          <v-avatar size="44">
            <img src="@/assets/avatar.jpg" alt="PersonAvatar" />
          </v-avatar>
        </v-col>
        <v-col cols="12" sm="8" md="8" class="d-flex align-center flex-wrap">
          "{{ comment.text }}"
        </v-col>
        <v-col
          cols="12"
          sm="3"
          md="3"
          class="text-right text--secondary align-self-end NameTime"
        >
          <span class="smallP">- {{ comment.username }} </span>
          <span class="smallDate"> {{ dateFormat(comment.date) }} </span>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </div>
    <div class="text-right bordertop2rem">
      <v-btn
        color="primary"
        small
        v-if="!newCommentAction"
        @click="newCommentAction = true"
        data-cypress="newCommentBtn"
      >
        Notes
      </v-btn>
    </div>

    <v-form v-if="newCommentAction" class="text-right">
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-text-field
            label="Submit a Note"
            v-model="newComment.text"
            data-cypress="newCommentInput"
          ></v-text-field>
          <v-btn
            color="primary"
            small
            class="ml-3"
            @click="SubmitComment(position)"
            data-cypress="submitNewCommentBtn"
          >
            Submit
          </v-btn>
          <v-btn
            color="primary"
            small
            @click="newCommentAction = false"
            class="ml-3"
            data-cypress="cancelNewCommentBtn"
          >
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-col>
</template>

<script>
import { db } from "@/firebase";
import moment from "moment";

export default {
  props: {
    cardComments: {
      type: Array,
      required: true,
    },
    cardId: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      newComment: {
        text: "",
        position: "",
      },
      newCommentAction: false,
    };
  },
  computed: {
    currentUser() {
      let user = this.$store.getters.getUserProfile;
      return user;
    },

    nameSurname() {
      return this.currentUser.name + " " + this.currentUser.surname;
    },
  },

  methods: {
    // Filter comments based on where they are on stage of card
    commentsPerPosition(position) {
      let comments = this.cardComments.filter(
        (comment) => comment.position == position
      );
      return comments;
    },

    // Format fb timestamp to Do MMM YYYY
    dateFormat(param) {
      let date = moment(param.toDate()).format("Do MMM YYYY");
      return date;
    },

    // Submits new comment to fb
    SubmitComment(position) {
      db.collection("comments").add({
        card_id: this.cardId,
        text: this.newComment.text,
        createdOn: new Date(),
        position: position,
        username: this.nameSurname,
      });

      this.newCommentAction = false;
      this.newComment.text = "";
      this.newComment.position = "";
    },
  },

  mounted() {
    this.$store.dispatch("getUsers");
  },
};
</script>

<style lang="scss" scoped>
.bordertop2rem {
  padding-top: 2rem !important;
}

.NameTime {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.smallDate {
  font-size: x-small;
}

.commentRow {
  margin-bottom: 1px;
}
</style>
