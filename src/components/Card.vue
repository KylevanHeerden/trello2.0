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
            <v-stepper-content step="1" class="greyText">
              Purchase request from
              <span class="text">{{ card.supplier_name }}</span
              >. Created on
              <span class="text">{{ dateFormat(card.createdOn) }}</span> by
              <span class="text">{{ cardUser }}</span
              >.
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
              :editable="listId >= 2 || card.technical_approval != null"
              data-cypress="technicalInfo"
            >
              Technical Approval Information
            </v-stepper-step>

            <v-stepper-content step="3">
              <TechApproval
                :stepName="'technical'"
                :team="team"
                :card="card"
                :cardComments="cardComments"
                :counter="counter"
                :commentPosition="1"
                :product="product"
              ></TechApproval>
            </v-stepper-content>

            <v-stepper-step
              step="4"
              :editable="listId >= 3 || card.purchase_approval != null"
            >
              Purchase Approval Information
            </v-stepper-step>

            <v-stepper-content step="4">
              <PurApproval
                :stepName="'purchase'"
                :team="team"
                :card="card"
                :cardComments="cardComments"
                :counter="counter"
                :commentPosition="2"
                :product="product"
              ></PurApproval>
            </v-stepper-content>

            <v-stepper-step
              step="5"
              :editable="listId >= 4 || card.procured != null"
            >
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
                :product="product"
              ></PurchaseInfo>
            </v-stepper-content>

            <v-stepper-step
              step="6"
              :editable="listId >= 5 || card.procured != null"
            >
              Purchase Closure
            </v-stepper-step>
            <v-stepper-content step="6">
              <PurchaseClosure
                :stepName="'procurement_closure'"
                :team="team"
                :card="card"
                :cardComments="cardComments"
                :counter="counter"
                :commentPosition="4"
                :product="product"
              ></PurchaseClosure>
            </v-stepper-content>

            <v-stepper-step
              step="7"
              :editable="listId >= 5"
              data-cypress="qualityInfo"
            >
              Quality Approval Information
            </v-stepper-step>
            <v-stepper-content step="7">
              <QualityInfo
                :team="team"
                :card="card"
                :cardComments="cardComments"
                :counter="counter"
                :commentPosition="5"
              ></QualityInfo>
            </v-stepper-content>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Comments from "@/components/Comments";
import QuoteInfo from "@/components/QuoteInfo";
import TechApproval from "@/components/TechApproval";
import PurApproval from "@/components/PurApproval";
import PurchaseInfo from "@/components/PurchaseInfo";
import QualityInfo from "@/components/QualityInfo";
import moment from "moment";
import { mapActions, mapGetters, mapState } from "vuex";
import PurchaseClosure from "./PurchaseClosure.vue";

export default {
  components: {
    Comments,
    PurchaseInfo,
    QualityInfo,
    QuoteInfo,
    TechApproval,
    PurApproval,
    PurchaseClosure,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
    cardComments: {
      type: Array,
      required: true,
    },
    listId: {
      type: Number,
      required: true,
    },
    product: {
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
      cardDialog: false,
      counter: 0,
    };
  },

  computed: {
    users() {
      let users = this.$store.getters.getUsers;
      return users;
    },

    cardUser() {
      let cardUser = this.users.filter((user) => {
        return user.id == this.card.creator;
      });

      return this.nameSurname(cardUser[0].name, cardUser[0].surname);
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

    // Format fb timestamp to Do MMM YYYY
    dateFormat(param) {
      let date = moment(param.toDate()).format("Do MMM YYYY");
      return date;
    },

    nameSurname(name, surname) {
      return name + " " + surname;
    },
  },

  created() {
    this.$store.dispatch("getUsers");
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

.greyText {
  color: dimgrey;
}

.text {
  font-style: italic;
}
</style>
