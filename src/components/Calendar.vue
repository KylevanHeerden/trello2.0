<template>
  <div class="text-center">
    <v-dialog v-model="calendarDialog" width="1000">
      <template v-slot:activator="{ on, attrs }">
        <v-btn small color="primary" dark v-bind="attrs" v-on="on">
          Programme Calendar
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="cardTitle text-h5 primary">
          Programme Calendar
        </v-card-title>

        <v-card-text class="cardText">
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              :weekdays="weekday"
              :type="type"
              :events="events"
            ></v-calendar>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import products from "../store/modules/products";

export default {
  data() {
    return {
      fetchedProgrammeId: this.$route.params.id,
      calendarDialog: false,
      weekday: [0, 1, 2, 3, 4, 5, 6],
      type: "month",
      events: [],
    };
  },

  computed: {
    ...mapState({
      products: (state) => state.products.products,
    }),

    programme() {
      let programme = this.getProgrammeById(this.fetchedProgrammeId);
      return programme;
    },

    //Filter the products based on the programme id
    filteredProducts() {
      let filteredProducts = this.products.filter(
        (product) =>
          product.programme.programme_id === this.fetchedProgrammeId &&
          product.archived === false &&
          product.status === "FollowUp"
      );
      return filteredProducts;
    },

    getEvents() {
      let events = [];

      this.filteredProducts.forEach((product) => {
        let expectDate = moment(product.POP_date.toDate())
          .add(parseInt(product.leadTime), "days")
          .format("YYYY-MM-DD");

        let event = {
          name: product.name,
          start: expectDate,
          color: this.getEventColor(expectDate),
        };

        events.push(event);
      });

      this.events = events;
    },
  },

  methods: {
    diffOfDates(date1String, date2String) {
      const date1 = new Date(date1String);
      const date2 = new Date(date2String);
      const diffTime = date2 - date1;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    },

    getEventColor(receive_date) {
      let colors = [
        "blue-grey darken-3",
        "teal darken-2",
        "deep-orange darken-3",
      ];

      let today = moment().format("YYYY-MM-DD");

      let days = this.diffOfDates(receive_date, today);

      console.log(days);

      if (days < 4) {
        return colors[1];
      } else if (days < 0) {
        return colors[2];
      } else {
        return colors[0];
      }
    },

    dateFormat(param) {
      let date = moment(param.toDate()).format("YYYY-MM-DD");
      return date;
    },
  },

  mounted() {
    this.getEvents;
    console.log(this.events);
  },
};
</script>

<style scoped>
.cardTitle {
  color: white;
}

.cardText {
  margin-top: 2rem;
}
</style>
