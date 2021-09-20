<template>
  <v-container>
    <apexchart type="line" :options="options" :series="series"></apexchart>
  </v-container>
</template>

<script>
import moment from "moment";

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
        title: {
          text: "Select a Programme",
          align: "center",
        },

        grid: {
          show: false,
        },

        yaxis: {
          show: false,
        },

        xaxis: {
          type: "datetime",
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
    // When data changes re-setup graph
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

        legend: {
          show: true,
          position: "top",
        },

        grid: {
          show: true,
        },

        forecastDataPoints: {
          count: this.committedCount,
        },

        yaxis: {
          show: true,
          showAlways: true,
          min: 0,
          max: this.max,

          title: {
            text: "Expenditure (R)",
          },
          labels: {
            formatter: function(value) {
              return value.toLocaleString("ru-RU");
            },
          },
        },

        xaxis: {
          type: "datetime",
          labels: {
            formatter: function(value, timestamp) {
              return moment(new Date(timestamp)).format("DD MMM YY"); // The formatter function overrides format property
            },
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
              x: new Date(this.currentMonth).getTime(),
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

        tooltip: {
          y: {
            formatter: function(num) {
              if (num % 1 === 0) {
                return "R " + num.toLocaleString("ru-RU");
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

                return "R " + result;
              }
            },
          },
        },
      };
    },

    // When y-limit changes re-setup graph
    max: function() {
      this.options = {
        chart: {
          height: 500,
        },

        title: {
          text: `${this.programmeName} Expenditure Tracking`,
          align: "center",
        },

        legend: {
          show: true,
          position: "top",
        },

        grid: {
          show: true,
        },

        forecastDataPoints: {
          count: this.committedCount,
        },

        yaxis: {
          show: true,
          showAlways: true,
          min: 0,
          max: this.max,

          title: {
            text: "Expenditure (R)",
          },
          labels: {
            formatter: function(value) {
              return value.toLocaleString("ru-RU");
            },
          },
        },

        xaxis: {
          type: "datetime",
          labels: {
            formatter: function(value, timestamp) {
              return moment(new Date(timestamp)).format("DD MMM YY"); // The formatter function overrides format property
            },
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
              x: new Date(this.currentMonth).getTime(),
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

        tooltip: {
          y: {
            formatter: function(num) {
              if (num % 1 === 0) {
                return "R " + num.toLocaleString("ru-RU");
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

                return "R " + result;
              }
            },
          },
        },
      };
    },
  },

  computed: {},

  mounted() {},
};
</script>
