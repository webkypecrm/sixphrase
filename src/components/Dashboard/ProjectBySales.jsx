import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import axios from "axios";

const ProjectBySales = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';

    const [chartOptions3, setChartOptions3] = useState({
        series: [24, 56, 96, 49, 30, 10], // Updated to match labels count
        options: {
            chart: {
                width: 400,
                height: 300,
                type: "pie",
            },
            legend: {
                position: "bottom",
            },
            labels: ["Total Sales", "Total Receivable", "Total Received", "Total Due", "Total Leads", "Total Customers"],
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

    // Function to get the date range for the last `days` days
    const getDateRange = (days) => {
        const today = new Date();
        let startDate = new Date();
        startDate.setDate(today.getDate() - days);

        return {
            from: startDate.toISOString().split("T")[0] + " 00:00:00.000",
            to: today.toISOString().split("T")[0] + " 23:59:59.999",
        };
    };

    const [filterByObj, setFilterByObj] = useState(getDateRange(30));
    const [selectedFilter, setSelectedFilter] = useState("Last 30 Days");

    const handleApply = (days, label) => {
        setFilterByObj(getDateRange(days));
        setSelectedFilter(label);
    };

    const fetchSalesCountData = async () => {
        try {
            let { from, to } = filterByObj;
            if (!from || !to) return;

            let url = `${apiUrl}/dashboard/project_by_leads?to=${to}&from=${from}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            });

            if (response.data && Array.isArray(response.data.data) && response.data.data.length === 6) {
                setChartOptions3((prev) => ({
                    ...prev,
                    series: response.data.data,
                }));
            } else {
                console.warn("Unexpected API response format", response.data);
            }
        } catch (error) {
            console.error("Error fetching sales data:", error);
        }
    };

    useEffect(() => {
        fetchSalesCountData();
    }, [filterByObj]);

    return (
        <div className="card w-100">
            <div className="card-body">
                <div className="statistic-header">
                    <h4>
                        <i className="ti ti-grip-vertical me-1" />
                        Projects By Sales
                    </h4>
                    <div className="dropdown statistic-dropdown">
                        <div className="card-select">
                            <ul>
                                <li>
                                    <Link className="dropdown-toggle" data-bs-toggle="dropdown" to="#">
                                        {selectedFilter}
                                    </Link>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <Link to="#" className="dropdown-item" onClick={() => handleApply(30, "Last 30 Days")}>
                                            Last 30 Days
                                        </Link>
                                        <Link to="#" className="dropdown-item" onClick={() => handleApply(15, "Last 15 Days")}>
                                            Last 15 Days
                                        </Link>
                                        <Link to="#" className="dropdown-item" onClick={() => handleApply(7, "Last 7 Days")}>
                                            Last 7 Days
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="leadpiechart">
                    <Chart options={chartOptions3.options} series={chartOptions3.series} type="pie" width={chartOptions3.options.chart.width} height={chartOptions3.options.chart.height} />
                </div>
            </div>
        </div>
    );
};

export default ProjectBySales;
