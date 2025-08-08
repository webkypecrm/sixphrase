import React, { Fragment, useState } from "react";
import ReactApexChart from "react-apexcharts";

const GradientDonut = () => {
    const [chartState, setChartState] = useState({
        series: [44, 55, 41, 17, 15],
        options: {
          chart: {
            type: "donut",
            width: 380,
          },
          plotOptions: {
            pie: {
              startAngle: -90,
              endAngle: 270,
            },
          },
          dataLabels: {
            enabled: false,
          },
          fill: {
            type: "gradient",
          },
          legend: {
            formatter: function (val, opts) {
              return val + " - " + opts.w.globals.series[opts.seriesIndex];
            },
          },
          title: {
            text: "Gradient Donut with custom Start-angle",
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          ],
        },
      });
  return (
    <Fragment>
      <div id="chart">
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="donut"
          width={450}
        />
      </div>
    </Fragment>
  );
};

export default GradientDonut;
