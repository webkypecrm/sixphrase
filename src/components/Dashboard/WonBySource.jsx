import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import axios from "axios";

const WonBySource = () => {
    const type = localStorage.getItem('type');

    // const [chartOptions2, setChartOptions2] = useState({
    //     series: [
    //         {
    //             data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Ensure data length matches categories
    //             color: "#77D882",
    //         },
    //     ],
    //     chart: {
    //         type: "bar",
    //         height: 400,
    //     },
    //     plotOptions: {
    //         bar: {
    //             horizontal: true,
    //         },
    //     },
    //     dataLabels: {
    //         enabled: false,
    //     },
    //     xaxis: {
    //         categories: ["SM", "Facebook", "Direct Lead", "Instagram", "Email", "Website", "Contacts", "Landing Page", "Random Lead", "Cold Calling", "Reference", "Walk In"],
    //         min: 0,
    //         max: type == 1 ? 2000 : 200,
    //         tickAmount: 5,
    //     },
    // });


    const [chartOptions2, setChartOptions2] = useState({
        series: [
            {
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Ensure data length matches categories
                color: "#77D882",
            },
        ],
        chart: {
            type: "bar",
            height: 400,
        },
        plotOptions: {
            bar: {
                horizontal: true, // Display horizontal bars
                dataLabels: {
                    position: "center", // Options: "top", "center", "bottom"
                },
            },
        },
        dataLabels: {
            enabled: true, // Enable count display
            style: {
                colors: ["#000"], // Set label color (change as needed)
                fontSize: "10px",
                // fontWeight: "bold",
            },
            formatter: (val) => (val > 0 ? val : ""), // Show only non-zero values
        },
        xaxis: {
            categories: [
                "SM",
                "Facebook",
                "Direct Lead",
                "Instagram",
                "Email",
                "Website",
                "Contacts",
                "Landing Page",
                "Random Lead",
                "Cold Calling",
                "Reference",
                "Walk In",
            ],
            min: 0,
            max: type == "1" ? 2000 : 1000,
            tickAmount: 5,
        },
    });


    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';

    const initialFilter = { from: "", to: "" };
    const [filterByObj, setFilterByObj] = useState(initialFilter);

    const fetchWonBySource = async () => {
        try {
            let { from, to } = filterByObj;
            // if (!from || !to) return; // Avoid API call if dates are missing

            let url = `${apiUrl}/dashboard/won_by_source?to=${to}&from=${from}`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${Token}` },
            });

            console.log("response =>", response.data)

            if (response.data && Array.isArray(response.data.countsArray)) {
                setChartOptions2((prev) => ({
                    ...prev,
                    series: [
                        {
                            data: [...response.data.countsArray],
                            color: "#77D882",
                        },
                    ],
                }));
            }

            if (response.data && Array.isArray(response.data.sources)) {
                setChartOptions2((prev) => ({
                    ...prev,
                    xaxis: {
                        ...prev.xaxis,
                        categories: [...response.data.sources]
                    }
                }));
            }

        } catch (error) {
            console.error("Error fetching lead data:", error);
        }
    };


    useEffect(() => {
        fetchWonBySource();
    }, []);

    return (
        <>
            <div className="card-body">
                <div className="statistic-header">
                    <h4>
                        <i className="ti ti-grip-vertical me-1" />
                        Won By Source
                    </h4>
                </div>

                <div id="won-chart">
                    <Chart
                        options={chartOptions2}
                        series={chartOptions2.series}
                        type="bar"
                        height={chartOptions2.chart.height}
                    />
                </div>
            </div>

        </>
    );
};

export default WonBySource;
