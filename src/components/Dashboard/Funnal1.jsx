import React, { Fragment, useState } from "react";
import ReactApexChart from "react-apexcharts";

const Funnal1 = () => {
  const [chartState, setChartState] = useState({
    series: [
      {
        name: "Funnel Series",
        data: [1380, 1100, 990, 880, 740, 548, 330, 200],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        dropShadow: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          barHeight: "80%",
          isFunnel: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ": " + val;
        },
        dropShadow: {
          enabled: true,
        },
      },
      //   title: {
      //     text: "Recruitment Funnel",
      //     align: "center",
      //   },
      xaxis: {
        categories: [
          "Sourced",
          "Screened",
          "Assessed",
          "HR Interview",
          "Technical",
          "Verify",
          "Offered",
          "Hired",
        ],
      },
      legend: {
        show: false,
      },
    },
  });
  return (
    <Fragment>
      <div className="card-body">
        <div className="statistic-header">
          <h4>
            <i className="ti ti-grip-vertical me-1" />
            Won By Services
          </h4>
        </div>
        <div id="chart">
          <ReactApexChart
            options={chartState.options}
            series={chartState.series}
            type="bar"
            height={370}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Funnal1;
