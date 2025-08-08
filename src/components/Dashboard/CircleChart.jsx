import React, { Fragment, useState } from "react";
import ReactApexChart from "react-apexcharts";

const CircleChart = () => {
  const [chartState, setChartState] = useState({
    series: [76, 67, 61, 90],
    options: {
      chart: {
        height: 390,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
          barLabels: {
            enabled: true,
            useSeriesColors: true,
            offsetX: -8,
            fontSize: "16px",
            formatter: (seriesName, opts) => {
              return `${seriesName}: ${
                opts.w.globals.series[opts.seriesIndex]
              }`;
            },
          },
        },
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: ["Vimeo", "Messenger", "Facebook", "LinkedIn"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    },
  });
  return (
    <Fragment>
      <div className="card-body">
        <div className="statistic-header">
          <h4>
            <i className="ti ti-grip-vertical me-1" />
            Social Media
          </h4>
        </div>
        <div id="chart">
          <ReactApexChart
            options={chartState.options}
            series={chartState.series}
            type="radialBar"
            height={390}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default CircleChart;
