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
      <LineGraph :data1="data1" :data2="data2" :labels="labels"></LineGraph>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import LineGraph from "@/components/LineGraph3";

export default {
  components: { LineGraph },
  data: () => {
    return {
      beginDate: null,
      endDate: null,
      beginIndex: null,
      endIndex: null,
      chosenProgrammeId: "",
      data1: [],
      data2: [],
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

      map1.push({ x: "2022-01-15", y: 15.5 });

      //   console.log(map1);

      let cutMap = [];

      // if begin date and end date is chosen filter array accordingling
      if (this.beginDate !== null && this.endDate !== null) {
        cutMap = map1.filter((point) => {
          return (
            point.x.substring(0, 7) >= this.beginDate &&
            point.x.substring(0, 7) <= this.endDate
          );
        });

        // make x labels accprding to data spliced
        const map2 = cutMap.map((payment) => {
          return payment.x;
        });

        this.labels = map2.sort();
        // if begin date but not end date is chosen filter array accordingling
      } else if (this.beginDate !== null) {
        cutMap = map1.filter((point) => {
          return point.x.substring(0, 7) >= this.beginDate;
        });

        // make x labels accprding to data spliced
        const map2 = cutMap.map((payment) => {
          return payment.x;
        });

        this.labels = map2.sort();
        // if end date but not begin date is chosen filter array accordingling
      } else if (this.endDate !== null) {
        cutMap = map1.filter((point) => {
          return point.x.substring(0, 7) <= this.endDate;
        });

        // make x labels accprding to data spliced
        const map2 = cutMap.map((payment) => {
          return payment.x;
        });

        this.labels = map2.sort();
        // if no dates were chosen keep data as is
      } else {
        cutMap = map1;

        const map2 = map1.map((payment) => {
          return payment.x;
        });

        this.labels = map2.sort();
      }

      // get the month and year of the point to sum by month
      const mapMonthToSum = cutMap.map((x) => ({
        ...x,
        month: new Date(x.x).getMonth(),
        year: new Date(x.x).getFullYear(),
      }));

      //   console.log(mapMonthToSum);

      // run through array and sum if curr has sam year and month as accumulated (acc)
      const sumPerMonth = mapMonthToSum.reduce((acc, cur) => {
        if (acc.length == 0) {
          acc.push({ month: cur.month, year: cur.year, y: cur.y });
        } else {
          if (acc.at(-1).year == cur.year) {
            if (acc.at(-1).month == cur.month) {
              acc.at(-1).y = acc.at(-1).y + cur.y;
            } else {
              acc.push({ month: cur.month, year: cur.year, y: cur.y });
            }
          } else {
            acc.push({ month: cur.month, year: cur.year, y: cur.y });
          }
        }

        return acc;
      }, []);

      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // map data to look good for graph
      let finalData = sumPerMonth.map((point) => {
        return {
          x: `${months[point.month]} ${point.year}`,
          y: point.y,
        };
      });

      let finalData2 = finalData.reduce((acc, cur) => {
        if (acc.length == 0) {
          acc.push({ x: cur.x, y: cur.y });
        } else {
          acc.push({ x: cur.x, y: acc.at(-1).y + cur.y });
        }

        return acc;
      }, []);

      //   console.log(finalData2);

      this.data1 = finalData;
      this.data2 = finalData2;
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
