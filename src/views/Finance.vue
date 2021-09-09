<template>
  <v-container>
    <v-row>
      <v-autocomplete
        v-model="chosenProgrammeId"
        label="Programme"
        :items="programmesOptions"
        @change="getData()"
      ></v-autocomplete>

      <v-menu
        ref="menu"
        v-model="menu1"
        :close-on-content-click="true"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="beginDate"
            label="Begin Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="beginDate"
          type="month"
          no-title
          scrollable
          @change="getData()"
        >
        </v-date-picker>
      </v-menu>

      <v-menu
        ref="menu"
        v-model="menu2"
        :close-on-content-click="true"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="endDate"
            label="End Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="endDate"
          type="month"
          no-title
          scrollable
          @change="getData()"
        >
        </v-date-picker>
      </v-menu>
    </v-row>

    <div class="chart-container" style="position: relative">
      <LineGraph :data="data" :labels="labels"></LineGraph>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import LineGraph from "@/components/LineGraph2";

export default {
  components: { LineGraph },
  data: () => {
    return {
      beginDate: null,
      endDate: null,
      beginIndex: null,
      endIndex: null,
      chosenProgrammeId: "",
      data: [],
      labels: [],
      menu1: false,
      menu2: false,
    };
  },

  computed: {
    ...mapState({
      products: (state) => state.products.products,
      programmes: (state) => state.programmes.programmes,
    }),
    ...mapGetters(["getProgrammeById"]),

    //Filter the products based on the programme id
    filteredProducts() {
      let filteredProducts = this.products.filter(
        (product) => product.programme.programme_id === this.chosenProgrammeId
      );

      return filteredProducts;
    },

    programmesOptions() {
      const map = this.programmes.map((programme) => {
        return { text: programme.name, value: programme.id };
      });
      return map;
    },
  },

  methods: {
    // function that generates data based on user selection
    getData() {
      const programmePaymentsArray = [];

      // filter products of chosen programme to only prooducts with payments loaded
      this.filteredProducts.forEach((product) => {
        if (product.payments !== undefined) {
          product.payments.forEach((payment) => {
            programmePaymentsArray.push(payment);
          });
        }
      });

      // map payments to array for data
      const map1 = programmePaymentsArray.map((payment) => {
        return { x: payment.date, y: parseFloat(payment.value) };
      });

      // sort payments by date
      map1.sort((a, b) => (a.x > b.x ? 1 : -1));

      // if begin date is chosen find index of begin date in payments array
      if (this.beginDate !== null) {
        let begin = map1.find((point) => {
          return point.x.includes(this.beginDate);
        });

        this.beginIndex = map1.indexOf(begin);
      }

      // if end date is chosen find index of end date in payments array
      if (this.endDate !== null) {
        let end = map1.reverse().find((point) => {
          return point.x.includes(this.endDate);
        });

        this.endIndex = map1.indexOf(end);
      }

      // if begin date and end date is chosen splice array accordingling
      if (this.beginIndex !== null && this.endIndex !== null) {
        map1.splice(this.beginIndex, this.endIndex);
        this.data = map1;

        // make x labels accprding to data spliced
        const map2 = map1.map((payment) => {
          return payment.x;
        });

        this.labels = map2.sort();
        // if begin date but not end date is chosen splice array accordingling
      } else if (this.beginIndex !== null) {
        let newMap = map1.splice(this.beginIndex);
        this.data = newMap;

        // make x labels accprding to data spliced
        const map2 = newMap.map((payment) => {
          return payment.x;
        });

        this.labels = map2.sort();
        // if end date but not begin date is chosen splice array accordingling
      } else if (this.endIndex !== null) {
        map1.reverse().splice(this.endIndex);
        this.data = map1;

        // make x labels accprding to data spliced
        const map2 = map1.map((payment) => {
          return payment.x;
        });

        this.labels = map2.sort();
        // if no dates were chosen keep data as is
      } else {
        this.data = map1;

        const map2 = map1.map((payment) => {
          return payment.x;
        });

        this.labels = map2.sort();
      }

      console.log(map1);

      const mapDayToMonth = map1.map((x) => ({
        ...x,
        day: new Date(x.x).getMonth(),
      }));

      //   console.log(mapDayToMonth);

      const sumPerMonth = mapDayToMonth.reduce((acc, cur) => {
        acc[cur.day] = acc[cur.day] + cur.y || cur.y;
        return acc;
      }, {});

      //   console.log(sumPerMonth);
    },

    datePicked() {
      //   console.log(this.beginDate);
      //   console.log(this.endDate);
    },
  },

  created() {
    this.$store.dispatch("getProducts");
    this.$store.dispatch("getProgrammes");
  },

  mounted() {},
};
</script>

<style scoped></style>
