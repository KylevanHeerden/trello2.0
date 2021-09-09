<template>
  <div>
    <canvas id="line-chart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  name: "LineChart",
  props: {
    data: {
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
      lineChartSetup: {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Price per product spent",
              data: null,
              borderColor: "#47b784",
              borderWidth: 3,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          lineTension: 1,
          title: {
            display: true,
            text: "Money Spent over time",
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  padding: 25,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Value",
                },
              },
            ],
            xAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Date",
                },
              },
            ],
          },
        },
      },
    };
  },

  watch: {
    data: function() {
      this.lineChartSetup.data.datasets[0].data = this.data;
      this.lineChartSetup.data.labels = this.labels;

      const ctx = document.getElementById("line-chart");
      new Chart(ctx, this.lineChartSetup);
    },
  },

  mounted() {},
};
</script>
