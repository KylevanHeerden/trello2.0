<template>
  <v-container>
    <v-row>
      <v-autocomplete
        v-model="chosenProgrammeId"
        label="Programme"
        :items="programmesOptions"
        @change="selectedProgramme()"
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
          @change="datePicked()"
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
          @change="datePicked()"
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
      beginDate: "",
      endDate: "",
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
    selectedProgramme() {
      //   console.log(this.filteredProducts);

      this.getData();

      //   console.log(this.data);
    },

    getData() {
      const programmePaymentsArray = [];

      this.filteredProducts.forEach((product) => {
        if (product.payments !== undefined) {
          product.payments.forEach((payment) => {
            programmePaymentsArray.push(payment);
          });
        }
      });

      const map1 = programmePaymentsArray.map((payment) => {
        return { x: payment.date, y: parseFloat(payment.value) };
      });

      map1.sort((a, b) => (a.x > b.x ? 1 : -1));

      console.log(map1);

      this.data = map1;

      const map2 = programmePaymentsArray.map((payment) => {
        return payment.date;
      });

      this.labels = map2.sort();

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
