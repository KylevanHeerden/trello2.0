<template>
  <div>
    <canvas id="line-chart"></canvas>
  </div>
</template>

<script>
import { Chart } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

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
        plugins: [annotationPlugin],
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
                type: "time",
                distribution: "series",
                time: {
                  unit: "month",
                  round: true,
                },
                scaleLabel: {
                  display: true,
                  labelString: "Date",
                },
              },
            ],
          },
          annotation: {
            // Defines when the annotations are drawn.
            // This allows positioning of the annotation relative to the other
            // elements of the graph.
            //
            // Should be one of: afterDraw, afterDatasetsDraw, beforeDatasetsDraw

            drawTime: "afterDatasetsDraw", // (default)

            // Mouse events to enable on each annotation.
            // Should be an array of one or more browser-supported mouse events
            // See https://developer.mozilla.org/en-US/docs/Web/Events
            events: ["click"],

            // Double-click speed in ms used to distinguish single-clicks from
            // double-clicks whenever you need to capture both. When listening for
            // both click and dblclick, click events will be delayed by this
            // amount.
            dblClickSpeed: 350, // ms (default)

            // Array of annotation configuration objects
            // See below for detailed descriptions of the annotation options
            annotations: [
              {
                drawTime: "afterDraw", // overrides annotation.drawTime if set
                id: "a-line-1", // optional
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: "10",
                borderColor: "red",
                borderWidth: 2,

                // Fires when the user clicks this annotation on the chart
                // (be sure to enable the event in the events array below).
                onClick: function(e) {
                  // `this` is bound to the annotation element
                  console.log(this);
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

      //   this.lineChartSetup.options.xAxes.min = this.data[0];
      //   this.lineChartSetup.options.xAxes.max = this.data[-1];

      const ctx = document.getElementById("line-chart");
      new Chart(ctx, this.lineChartSetup);
    },
  },

  mounted() {},
};
</script>
