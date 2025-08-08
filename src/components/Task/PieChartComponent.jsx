import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Chart from "react-apexcharts";

const PieChartComponent = ({ data, taskCategoryOptions }) => {

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
            labels: ["lead", "company", "order", "project"],
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
            labels: ["open", "resolved", "pending", "closed"],
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

    useEffect(() => {
        // Filter tasks with taskType "lead"
        const taskType1 = data.filter(task => task.taskType === "lead");
        const taskType2 = data.filter(task => task.taskType === "company");
        const taskType3 = data.filter(task => task.taskType === "order");
        const taskType4 = data.filter(task => task.taskType === "project");

        // Update chart options dynamically
        setChartOptions1(prevOptions => ({
            ...prevOptions,
            series: [taskType1.length, taskType2.length, taskType3.length, taskType4.length],
        }));
    }, [data])
    useEffect(() => {
        // Filter tasks with taskType "lead"
        const taskStatus1 = data.filter(task => task.status === "open");
        const taskStatus2 = data.filter(task => task.status === "resolved");
        const taskStatus3 = data.filter(task => task.status === "pending");
        const taskStatus4 = data.filter(task => task.status === "closed");

        // Update chart options dynamically
        setChartOptions2(prevOptions => ({
            ...prevOptions,
            series: [taskStatus1.length, taskStatus2.length, taskStatus3.length, taskStatus4.length],
        }));
    }, [data])
    useEffect(() => {
        const taskCategoryArray = taskCategoryOptions.map(item => item.label)

        const categoryCounts = taskCategoryArray.map(category => {
            return data.filter(item => item.taskCategory.name === category).length;
        });

        // Update chart options dynamically
        setChartOptions3(prevOptions => ({
            ...prevOptions,
            series: [...categoryCounts],
            options: {
                ...prevOptions.options,
                labels: [...taskCategoryArray]
            }

        }));
    }, [data, taskCategoryOptions])

    return (
        <>

            <div className="row g-3">
                <div className="col-lg-4 col-md-6 col-12 d-flex">
                    <div className="card w-100">
                        <div className="card-body">
                            <div className="statistic-header">
                                <h4>
                                    <i className="ti ti-grip-vertical me-1" />
                                    Task Type
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
                                                    <Link to="#" className="dropdown-item">Last 30 Days</Link>
                                                    <Link to="#" className="dropdown-item">Last 15 Days</Link>
                                                    <Link to="#" className="dropdown-item">Last 7 Days</Link>
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
                                    Task Status
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
                                                    <Link to="#" className="dropdown-item">Last 30 Days</Link>
                                                    <Link to="#" className="dropdown-item">Last 15 Days</Link>
                                                    <Link to="#" className="dropdown-item">Last 7 Days</Link>
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
                                    Task Category
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
                                                    <Link to="#" className="dropdown-item">Last 30 Days</Link>
                                                    <Link to="#" className="dropdown-item">Last 15 Days</Link>
                                                    <Link to="#" className="dropdown-item">Last 7 Days</Link>
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


            {/* <div style={{ display: 'flex' }}>
                <div className="col-md-4 d-flex">
                    <div className="card w-100">
                        <div className="card-body">
                            <div className="statistic-header">
                                <h4>
                                    <i className="ti ti-grip-vertical me-1" />
                                    Task Type
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
                                                    <Link
                                                        to="#"
                                                        className="dropdown-item"
                                                    >
                                                        Last 30 Days
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="dropdown-item"
                                                    >
                                                        Last 15 Days
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="dropdown-item"
                                                    >
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
                                    width={chartOptions1.options.chart.width}
                                    height={chartOptions1.options.chart.height}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 d-flex">
                    <div className="card w-100">
                        <div className="card-body">
                            <div className="statistic-header">
                                <h4>
                                    <i className="ti ti-grip-vertical me-1" />
                                    Task Status
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
                                                    <Link
                                                        to="#"
                                                        className="dropdown-item"
                                                    >
                                                        Last 30 Days
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="dropdown-item"
                                                    >
                                                        Last 15 Days
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="dropdown-item"
                                                    >
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
                                    width={chartOptions2.options.chart.width}
                                    height={chartOptions2.options.chart.height}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 d-flex">
                    <div className="card w-100">
                        <div className="card-body">
                            <div className="statistic-header">
                                <h4>
                                    <i className="ti ti-grip-vertical me-1" />
                                    Task Category
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
                                                    <Link
                                                        to="#"
                                                        className="dropdown-item"
                                                    >
                                                        Last 30 Days
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="dropdown-item"
                                                    >
                                                        Last 15 Days
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="dropdown-item"
                                                    >
                                                        Last 7 Days
                                                    </Link>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div id="leadpiechart" >
                                <Chart
                                    options={chartOptions3.options}
                                    series={chartOptions3.series}
                                    type="pie"
                                    width={chartOptions3.options.chart.width}
                                    height={chartOptions3.options.chart.height}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default PieChartComponent