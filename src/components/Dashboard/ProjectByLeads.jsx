import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import axios from "axios";

const ProjectByLeads = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem("token") || "";

    const [chartOptions3, setChartOptions3] = useState({
        series: [0, 0, 0, 0, 0, 0],
        options: {
            chart: {
                width: 400,
                height: 300,
                type: "pie",
            },
            colors: ["#3357FF", "#FFC300", "#900C3F", "#FF33A8", "#33FF57", "#FF5733"],
            legend: {
                position: "bottom",
            },
            labels: ["New Lead", "Followup", "Meeting/Demo", "Meeting/Demo Done", "Converted", "Junk"],
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
        if (days === 0) {
            return { from: "", to: "" }; // No date filter for "All"
        }
        const today = new Date();
        let startDate = new Date();
        startDate.setDate(today.getDate() - days); // Subtract days from today

        return {
            from: startDate.toISOString().split("T")[0] + " 00:00:00.000",
            to: today.toISOString().split("T")[0] + " 23:59:59.999",
        };
    };

    // Default state is "All"
    const [filterByObj, setFilterByObj] = useState(getDateRange(0));
    const [selectedFilter, setSelectedFilter] = useState("All");

    const handleApply = (days, label) => {
        setFilterByObj(getDateRange(days));
        setSelectedFilter(label);
    };

    const fetchLeadCountData = async () => {
        try {
            let { from, to } = filterByObj;
            let url = `${apiUrl}/dashboard/project_by_leads`;

            // Append date filters only if they are not empty
            if (from && to) {
                url += `?to=${to}&from=${from}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${Token}`,
                },
            });

            console.log("response.data.data =>", response.data.data)

            setChartOptions3((prev) => ({
                ...prev,
                series: [...response.data.data],
            }));
        } catch (error) {
            console.error("Error fetching lead data:", error);
        }
    };

    // Fetch data initially and whenever filterByObj changes
    useEffect(() => {
        fetchLeadCountData();
    }, [filterByObj]);

    console.log('chartOptions3 =>', chartOptions3)
    return (
        <div className="card w-100">
            <div className="card-body">
                <div className="statistic-header">
                    <h4>
                        <i className="ti ti-grip-vertical me-1" />
                        Leads by Stage
                    </h4>
                    <div className="dropdown statistic-dropdown" >
                        <div className="card-select">
                            <ul>
                                <li>
                                    <Link className="dropdown-toggle" data-bs-toggle="dropdown" to="#">
                                        {selectedFilter}
                                    </Link>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <Link to="#" className="dropdown-item" onClick={() => handleApply(0, "All")}>
                                            All
                                        </Link>
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
    );
};

export default ProjectByLeads;
