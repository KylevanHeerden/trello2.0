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
      require: true,
    },
    data2: {
      type: Array,
      default: null,
      require: true,
    },
    labels: {
      type: Array,
      default: null,
      require: true,
    },
    budget: {
      type: Number,
      require: true,
    },
    currentMonth: {
      type: String,
      required: true,
    },
    max: {
      type: Number,
      require: true,
    },
    programmeName: {
      type: String,
      required: true,
    },
    committedCount: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      options: {
        chart: {
          height: 500,
        },
        title: {
          text: "Programme Expenditure Tracking",
          align: "center",
        },
        legend: {
          position: "top",
        },
        yaxis: {
          show: true,
          showAlways: true,
          min: 0,
          title: {
            text: "Expenditure (R)",
          },
        },
        xaxis: {
          title: {
            text: "Time (Months)",
          },
        },
      },
      series: [
        {
          name: "Monthly Expenditure",
          data: [],
        },
        {
          name: "Accumalative Monthly Expenditure",
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

      this.options = {
        chart: {
          height: 500,
        },
        title: {
          text: `${this.programmeName} Expenditure Tracking`,
          align: "center",
        },

        annotations: {
          yaxis: [
            {
              y: this.budget,
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

          xaxis: [
            {
              x: this.currentMonth,
              borderColor: "#e1ad01",
              label: {
                borderColor: "#e1ad01",
                style: {
                  color: "#fff",
                  background: "#e1ad01",
                },
                text: "Current Month",
              },
            },
          ],
        },

        forecastDataPoints: {
          count: 1,
        },

        yaxis: {
          show: true,
          showAlways: true,
          min: 0,
          max: this.max,
          title: {
            text: "Expenditure (R)",
          },
        },
      };
    },

    max: function() {
      this.options = {
        chart: {
          height: 500,
        },
        title: {
          text: `${this.programmeName} Expenditure Tracking`,
          align: "center",
        },
        yaxis: {
          show: true,
          showAlways: true,
          min: 0,
          max: this.max,
          title: {
            text: "Expenditure (R)",
          },
        },

        annotations: {
          yaxis: [
            {
              y: this.budget,
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

          xaxis: [
            {
              x: this.currentMonth,
              borderColor: "#e1ad01",
              label: {
                borderColor: "#e1ad01",
                style: {
                  color: "#fff",
                  background: "#e1ad01",
                },
                text: "Current Month",
              },
            },
          ],
        },

        forecastDataPoints: {
          count: this.committedCount,
        },
      };
    },
  },

  computed: {},

  mounted() {},
};
</script>
