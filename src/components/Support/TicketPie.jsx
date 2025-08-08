import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import axios from "axios";

const TicketPie = ({allTicketData }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  console.log("allTicketData =>", allTicketData);



     // Count priority
  const [chartOptions1, setChartOptions1] = useState({
    series: [],
    options: {
      chart: {
        width: 350,
        height: 300,
        type: "pie",
      },
      legend: {
        position: "right",
      },
      labels: ["Normal", "Urgent", "Very Urgent"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 275,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  // Count status
  const [chartOptions2, setChartOptions2] = useState({
    series: [],
    options: {
      chart: {
        width: 350,
        height: 300,
        type: "pie",
      },
      legend: {
        position: "right",
      },
      labels: ["Open", "Closed", "Progress"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 275,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

// count category
  const [chartOptions3, setChartOptions3] = useState({
    series: [],
    options: {
      chart: {
        width: 400,
        height: 300,
        type: "pie",
      },
      legend: {
        position: "right",
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 275,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

// Count priority
useEffect(() => {
  // Count priority wise
  const priorityCounts = [
    allTicketData.filter((ticket) => ticket.priority === "Normal").length,
    allTicketData.filter((ticket) => ticket.priority === "Urgent").length,
    allTicketData.filter((ticket) => ticket.priority === "Very Urgent").length,
  ];

  // Update chart options
  setChartOptions1((prevOptions) => ({
    ...prevOptions,
    series: priorityCounts,
  }));
}, [allTicketData]);

// count status
useEffect(() => {
  // Count status wise
  const statusCounts = [
    allTicketData.filter((ticket) => ticket.status === "open").length,
    allTicketData.filter((ticket) => ticket.status === "closed").length,
    allTicketData.filter((ticket) => ticket.status === "Progress").length,
  ];

  // Update chart options
  setChartOptions2((prevOptions) => ({
    ...prevOptions,
    series: statusCounts,
  }));
}, [allTicketData]);


  // get Category
  const getCategoryData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/master/support-category-list`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const formattedData = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setCategoryOptions(formattedData);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    getCategoryData();
  }, []);

  useEffect(() => {
    const ticketCategoryArray = categoryOptions.map((item) => item.label);

    const categoryCounts = ticketCategoryArray.map((category) => {
      return allTicketData.filter((item) => item.supportCategory.name === category).length;
    });

    // Update chart options dynamically
    setChartOptions3((prevOptions) => ({
      ...prevOptions,
      series: [...categoryCounts],
      options: {
        ...prevOptions.options,
        labels: [...ticketCategoryArray],
      },
    }));
  }, [ categoryOptions]);
  return (
    <Fragment>
      {" "}
      <div className="row g-3">
        <div className="col-lg-4 col-md-6 col-12 d-flex">
          <div className="card w-100">
            <div className="card-body">
              <div className="statistic-header">
                <h4>
                  <i className="ti ti-grip-vertical me-1" />
                  Ticket Priority
                </h4>
                <div className="dropdown statistic-dropdown">
                  <div className="card-select">
                    <ul>
                      <li>
                        <Link
                          className="dropdown-toggle"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Last 30 Days
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Last 30 Days
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 15 Days
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 7 Days
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div id="leadpiechart">
                <Chart
                  options={chartOptions1.options}
                  series={chartOptions1.series}
                  type="pie"
                  width="100%"
                  height="250px"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 d-flex">
          <div className="card w-100">
            <div className="card-body">
              <div className="statistic-header">
                <h4>
                  <i className="ti ti-grip-vertical me-1" />
                  Ticket Status
                </h4>
                <div className="dropdown statistic-dropdown">
                  <div className="card-select">
                    <ul>
                      <li>
                        <Link
                          className="dropdown-toggle"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Last 30 Days
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Last 30 Days
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 15 Days
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 7 Days
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div id="leadpiechart">
                <Chart
                  options={chartOptions2.options}
                  series={chartOptions2.series}
                  type="pie"
                  width="100%"
                  height="250px"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 col-12 d-flex">
          <div className="card w-100">
            <div className="card-body">
              <div className="statistic-header">
                <h4>
                  <i className="ti ti-grip-vertical me-1" />
                  Ticket Category
                </h4>
                <div className="dropdown statistic-dropdown">
                  <div className="card-select">
                    <ul>
                      <li>
                        <Link
                          className="dropdown-toggle"
                          data-bs-toggle="dropdown"
                          to="#"
                        >
                          Last 30 Days
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end">
                          <Link to="#" className="dropdown-item">
                            Last 30 Days
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 15 Days
                          </Link>
                          <Link to="#" className="dropdown-item">
                            Last 7 Days
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div id="leadpiechart">
                <Chart
                  options={chartOptions3.options}
                  series={chartOptions3.series}
                  type="pie"
                  width="100%"
                  height="250px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TicketPie;
