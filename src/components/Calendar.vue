<template>
  <div class="text-center">
    <v-dialog v-model="calendarDialog" width="1000">
      <template v-slot:activator="{ on, attrs }">
        <v-btn small color="primary" dark v-bind="attrs" v-on="on">
          Programme Calendar
        </v-btn>
        <v-avatar
          v-if="todayArrivals != 0"
          color="deep-orange darken-3"
          size="23"
          class="todayArrivals"
        >
          {{ todayArrivals }}
        </v-avatar>
      </template>

      <v-card>
        <v-card-title class="cardTitle text-h5 primary">
          {{ programme.name }} Calendar
        </v-card-title>

        <v-card-text class="cardText">
          <v-row class="calendarTitleRow">
            <v-btn icon @click="prev()">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn icon @click="next()">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
          </v-row>

          <v-sheet height="600">
            <v-calendar
              v-model="focus"
              ref="calendar"
              :weekdays="weekday"
              :type="type"
              :events="events"
              @click:event="showEvent"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" width="400px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-toolbar-title
                    v-html="selectedEvent.name"
                  ></v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <div class="eventLabel">Supplier:</div>
                      <div class="eventLabel">Contact Person:</div>
                      <div class="eventLabel">Contact Number:</div>
                      <div class="eventLabel">Nanodyn Person:</div>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <div class="eventAnswer">
                        {{ selectedEvent.supplier_name }}
                      </div>
                      <div class="eventAnswer">
                        {{ selectedEvent.contact_person }}
                      </div>
                      <div class="eventAnswer">
                        {{ selectedEvent.contact_number }}
                      </div>
                      <div class="eventAnswer">{{ selectedEvent.person }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-row justify="center" class="pa-0 ma-0">
                    <router-link
                      :to="{
                        name: 'Product',
                        params: { id: selectedEvent.url },
                      }"
                    >
                      Product Link
                    </router-link>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { mapState, mapGetters } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      calendarDialog: false,
      events: [],
      fetchedProgrammeId: this.$route.params.id,
      focus: "",
      selectedElement: null,
      selectedEvent: {},
      selectedOpen: false,
      type: "month",
      todayArrivals: 0,
      weekday: [1, 2, 3, 4, 5, 6, 0],
    };
  },

  computed: {
    ...mapState({
      products: (state) => state.products.products,
    }),
    ...mapGetters(["getProgrammeById"]),

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

    // Gets the events for the calander
    async getEvents() {
      let events = [];

      // Change data from fb to YYYY-MM-DD
      this.filteredProducts.forEach((product) => {
        let expectDate = product.delivery_date;

        if (expectDate !== "") {
          // Take todays date
          let today = moment().format("YYYY-MM-DD");

          // Add value if arrives today
          if (expectDate == today) {
            this.todayArrivals += 1;
          }

          let card = this.getCard(product.cards[0].card_id);

          // Make an event of each card
          card.then((r) => {
            let event = {
              name: product.name,
              start: expectDate,
              color: this.getEventColor(expectDate),
              url: product.id,
              supplier_name: r.supplier_name,
              supplier_email: r.supplier_email,
              contact_number: r.contact_number,
              contact_person: r.contact_person,
              person: product.person,
            };

            // Add events to events array
            events.push(event);
          });
        }
      });

      this.events = events;
    },

    programme() {
      let programme = { name: "Pending..." };
      if (this.fetchedProgrammeId) {
        programme = this.getProgrammeById(this.fetchedProgrammeId);
      }
      return programme;
    },
  },

  methods: {
    // Function to get the difference in days of dates
    diffOfDates(date1String, date2String) {
      const date1 = new Date(date1String);
      const date2 = new Date(date2String);
      const diffTime = date2 - date1;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    },

    // Based on difference in dates of today and event, chooses relevant color
    getEventColor(receive_date) {
      let colors = ["blue-grey darken-3", "#9ccc65", "deep-orange darken-3"];

      let today = moment().format("YYYY-MM-DD");

      let days = this.diffOfDates(today, receive_date);

      if (days < 0) {
        return colors[2];
      } else if (days === 0) {
        return colors[1];
      } else {
        return colors[0];
      }
    },

    // Returns date in YYYY-MM-DD
    dateFormat(param) {
      let date = moment(param.toDate()).format("YYYY-MM-DD");
      return date;
    },

    // Function to change to previous month
    prev() {
      this.$refs.calendar.prev();
    },

    // Function to change to next month
    next() {
      this.$refs.calendar.next();
    },

    // If click on event it opens up with relevant info
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    // Get card by id
    async getCard(id) {
      const cityRef = db.collection("cards").doc(id);
      const doc = await cityRef.get();
      const docData = doc.data();

      return docData;
    },
  },

  mounted() {
    this.getEvents;
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

.calendarTitleRow {
  padding-bottom: 1rem;
}

.eventLabel {
  color: grey;
}

.eventAnswer {
  color: rgba(37, 37, 37, 0.87);
}

.todayArrivals {
  position: relative;
  right: 15px;
  bottom: 15px;
  padding: 0;
  color: white;
  font-weight: 1000;
}

a {
  font-size: small;
  color: gray;
}
</style>
