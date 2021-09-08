<template>
  <v-container>
    <v-autocomplete
      v-model="chosenProgrammeId"
      :items="programmesOptions"
    ></v-autocomplete>
    <div class="chart-container" style="position: relative">
      <LineGraph :chartdata="chartData" :options="chartOptions" :height="150" />
    </div>
  </v-container>
</template>

<script>
import LineGraph from "@/components/LineGraph";

import { mapState, mapGetters } from "vuex";

export default {
  components: { LineGraph },
  data: () => {
    return {
      chartData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "Looping tension",
            data: [65, 59, 80, 81, 26, 55, 40],
            fill: false,
            borderColor: "rgb(75, 192, 192)",
          },

          {
            label: "Looping tension",
            data: [60, 65, 84, 78, 20, 60, 45],
            fill: false,
            borderColor: "rgb(225, 102, 178)",
          },
        ],
      },
      chartOptions: {
        scales: {
          y: {
            // defining min and max so hiding the dataset does not change scale range
            min: 0,
            max: 100,
          },
        },
      },

      chosenProgrammeId: "",
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
        (product) =>
          product.programme.programme_id === this.chosenProgrammeId &&
          product.status === "FollowUp"
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

  created() {
    this.$store.dispatch("getProducts");
    this.$store.dispatch("getProgrammes");
  },

  mounted() {
    console.log(this.filteredProducts);
  },
};
</script>

<style scoped></style>
