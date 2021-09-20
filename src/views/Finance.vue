<template>
  <v-container>
    <v-row justify="center" class="pl-10">
      <v-col cols="12" sm="2" md="2">
        <v-autocomplete
          v-model="chosenProgrammeId"
          label="Programme"
          :items="programmesOptions"
          @change="getData()"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" sm="2" md="2">
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
              clearable
              @click:clear="clearDates('begin')"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="beginDate"
            no-title
            scrollable
            @change="getData()"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="2" md="2">
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
              clearable
              @click:clear="clearDates('end')"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="endDate"
            no-title
            scrollable
            @change="getData()"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>

    <v-row class="chartContainer" justify="center">
      <LineGraph
        :data1="data1"
        :data2="data2"
        :labels="labels"
        :budget="budgetNumber"
        :currentMonth="today"
        :max="parseFloat(max)"
        :programmeName="programmeName"
        :committedCount="committedCount"
      ></LineGraph>
    </v-row>

    <v-row justify="end" v-if="data1.length != 0" class="pa-0 ma-0">
      <v-col cols="12" sm="10" md="10" class="pa-0 ma-0">
        <v-card-text>
          <v-row justify="start">
            <v-col cols="12" sm="3" md="3">
              <div class="eventLabel">Budget:</div>
              <div class="eventLabel">Committed Expenditure:</div>
              <div class="eventLabel">Acctual Expenditure:</div>
              <div class="eventLabel">Total Expenditure:</div>
            </v-col>
            <v-col cols="12" sm="2" md="2">
              <div class="eventAnswer">R {{ formatNum(budgetNumber) }}</div>
              <div class="eventAnswer">R {{ formatNum(committedTotal) }}</div>
              <div class="eventAnswer">R {{ formatNum(actualTotal) }}</div>
              <div class="eventAnswer">R {{ formatNum(data2.at(-1).y) }}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" sm="2" md="2" class="pa-0 ma-0">
        <v-text-field
          v-model="max"
          class="mt-0 pt-0 max"
          type="number"
          label="Y-Limit"
          rounded
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row> </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";

import LineGraph from "@/components/LineGraph";

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
      budgetNumber: 0,
      max: 1000,
      programmeName: "",
      committedTotal: 0,
      actualTotal: 0,
      committedCount: 0,
      today: moment(new Date()).format("YYYY-MM-DD"),
    };
  },

  computed: {
    ...mapState({
      products: (state) => state.products.products,
      programmes: (state) => state.programmes.programmes,
    }),
    ...mapGetters(["getProgrammeById"]),

    currentMonth() {
      const today = new Date();

      const mm = String(today.getMonth()); //January is 0!
      const yyyy = today.getFullYear();

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

      const today2 = months[mm] + " " + yyyy;

      return today2;
    },

    //Filter the products based on the programme id
    filteredProducts() {
      let filteredProducts = this.products.filter(
        (product) =>
          product.programme.programme_id === this.chosenProgrammeId &&
          (product.status === "Procurement" ||
            product.status === "FollowUp" ||
            product.status === "Quality")
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
    // When dates are cleared get data again
    clearDates(dateString) {
      if (dateString == "begin") {
        this.beginDate = null;
      } else if (dateString == "end") {
        this.endDate = null;
      }

      this.getData();
    },

    // format the numbers to have space between three numbers
    formatNum(num) {
      if (num % 1 === 0) {
        return num.toLocaleString("ru-RU");
      } else {
        let result =
          Number(num.toFixed(2))
            .toLocaleString("ru-RU")
            .slice(0, -3) +
          Number(num.toFixed(2))
            .toString()
            .slice(
              Number(num.toFixed(2))
                .toString()
                .indexOf(".")
            );

        return result;
      }
    },

    // function that generates data based on user selection
    getData() {
      const getBuget = parseFloat(
        this.getProgrammeById(this.chosenProgrammeId).budget
      );

      this.budgetNumber = getBuget;

      this.max = getBuget;

      this.programmeName = this.getProgrammeById(this.chosenProgrammeId).name;

      this.splitCommitted();

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
        return {
          x: payment.date,
          y: parseFloat(payment.value),
          committed: payment.committed,
        };
      });

      // sort payments by date
      map1.sort((a, b) => (a.x > b.x ? 1 : -1));

      //   console.log(map1);

      let cutMap = [];

      // if begin date and end date is chosen filter array accordingling
      if (this.beginDate !== null && this.endDate !== null) {
        cutMap = map1.filter((point) => {
          return point.x >= this.beginDate && point.x <= this.endDate;
        });

        // make x labels accprding to data spliced
        const map2 = cutMap.map((payment) => {
          return payment.x;
        });

        this.labels = map2.sort();
        // if begin date but not end date is chosen filter array accordingling
      } else if (this.beginDate !== null) {
        cutMap = map1.filter((point) => {
          return point.x >= this.beginDate;
        });

        // make x labels accprding to data spliced
        const map2 = cutMap.map((payment) => {
          return payment.x;
        });

        this.labels = map2.sort();
        // if end date but not begin date is chosen filter array accordingling
      } else if (this.endDate !== null) {
        cutMap = map1.filter((point) => {
          return point.x <= this.endDate;
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

      // ----------------------- PER MONTH OPTION -----------------------

      // get the month and year of the point to sum by month
      const mapMonthToSum = cutMap.map((x) => ({
        ...x,
        month: new Date(x.x).getMonth(),
        year: new Date(x.x).getFullYear(),
      }));

      // run through array and sum if curr has sam year and month as accumulated (acc)
      const sumPerMonth = mapMonthToSum.reduce((acc, cur) => {
        if (acc.length == 0) {
          acc.push({
            month: cur.month,
            year: cur.year,
            y: cur.y,
          });
        } else {
          if (acc.at(-1).year == cur.year) {
            if (acc.at(-1).month == cur.month) {
              acc.at(-1).y = acc.at(-1).y + cur.y;
            } else {
              acc.push({
                month: cur.month,
                year: cur.year,
                y: cur.y,
              });
            }
          } else {
            acc.push({
              month: cur.month,
              year: cur.year,
              y: cur.y,
            });
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

      // find the point in finalData that is for todays month
      const point = finalData.find((point) => {
        return point.x == this.currentMonth;
      });

      // use the index to count number of months ahead and then set them as forcastCount
      this.committedCount = finalData.length - finalData.indexOf(point) - 1;

      let finalData2 = finalData.reduce((acc, cur) => {
        if (acc.length == 0) {
          acc.push({ x: cur.x, y: cur.y });
        } else {
          acc.push({ x: cur.x, y: acc.at(-1).y + cur.y });
        }

        return acc;
      }, []);

      // this.data1 = finalData;
      // this.data2 = finalData2;

      // ----------------------- PER DAY OPTION -----------------------

      const sumPerDay = cutMap.reduce((acc, cur) => {
        if (acc.length == 0) {
          acc.push({
            x: cur.x,
            y: cur.y,
          });
        } else if (acc.at(-1).x == cur.x) {
          acc.at(-1).y = acc.at(-1).y + cur.y;
        } else {
          acc.push({
            x: cur.x,
            y: cur.y,
          });
        }

        return acc;
      }, []);

      let finalData21 = sumPerDay.reduce((acc, cur) => {
        if (acc.length == 0) {
          acc.push({ x: cur.x, y: cur.y });
        } else {
          acc.push({ x: cur.x, y: acc.at(-1).y + cur.y });
        }

        return acc;
      }, []);

      this.data1 = sumPerDay;
      this.data2 = finalData21;
    },

    splitCommitted() {
      const committedTrue = [];
      const committedFalse = [];

      const current_month = moment(new Date()).format("MM");

      // filter products of chosen programme to only prooducts with payments loaded
      this.filteredProducts.forEach((product) => {
        if (product.payments !== undefined) {
          product.payments.forEach((payment) => {
            if (payment.date.split("-")[1] < current_month) {
              committedTrue.push(payment);
            } else committedFalse.push(payment);
          });
        }
      });

      // Add all the values of the actual payments up for total
      const actualTotal = committedTrue.reduce((accu, curr) => {
        return accu + parseFloat(curr.value);
      }, 0);

      // Add all the values of the committed payments up for total
      const committedTotal = committedFalse.reduce((accu, curr) => {
        return accu + parseFloat(curr.value);
      }, 0);

      this.actualTotal = actualTotal;
      this.committedTotal = committedTotal;
    },
  },

  created() {
    this.$store.dispatch("getProducts");
    this.$store.dispatch("getProgrammes");
  },

  mounted() {},
};
</script>

<style scoped>
.max {
  font-size: small;
}

.eventLabel {
  color: grey;
}

.eventAnswer {
  color: rgba(37, 37, 37, 0.87);
}
</style>
