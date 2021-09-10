<template>
  <v-container>
    <apexchart type="line" :options="options" :series="series"></apexchart>
  </v-container>
</template>

<script>
export default {
  props: {
    data1: {
      type: Array,
      default: null,
    },
    data2: {
      type: Array,
      default: null,
    },
    labels: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      options: {
        chart: {
          id: "vuechart-example",
        },
        annotations: {
          yaxis: [
            {
              y: 55,
              borderColor: "#ff6347",
              label: {
                borderColor: "#ff6347",
                style: {
                  color: "#fff",
                  background: "#ff6347",
                },
                text: "Budget",
              },
            },
          ],
        },
        forecastDataPoints: {
          count: 1,
        },
      },
      series: [
        {
          name: "Month Expenditure",
          data: [],
        },
        {
          name: "Accumalative Month Expenditure",
          data: [],
        },
      ],
    };
  },

  watch: {
    data1: function() {
      this.series = [
        {
          data: this.data1,
        },
        {
          data: this.data2,
        },
      ];
    },
  },
};
</script>
