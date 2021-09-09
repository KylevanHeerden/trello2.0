<script>
import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    chartData: { type: Object, default: null },
  },
  mixins: [mixins.reactiveProp],

  data: () => {
    return {
      chartOptions: {
        responsive: true,
        title: {
          text: "Hello world",
          display: true,
        },
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
          },
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Date",
              },
              bounds: "ticks",
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Value",
              },
            },
          ],
        },
      },
    };
  },

  watch: {
    chartData: function() {
      this.renderChart(this.chartData, this.chartOptions);
      console.log("update");
      console.log(this.chartData);
      console.log(this.chartOptions);
    },
  },

  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.chartOptions);
  },
};
</script>
