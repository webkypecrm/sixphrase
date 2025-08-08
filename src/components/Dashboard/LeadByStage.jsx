import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { Link } from "react-router-dom";

const LeadByStage = () => {
  const [stageOptions, setStageOptions] = useState([]);
  const [totalStageDataCount, setTotalStageDataCount] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const initialCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };

  // Fetch stages
  const fetchStageData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/stage-list`);
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id,
        order: item.order,
      }));
      setStageOptions(formattedData);
    } catch (error) {
      console.error("Error fetching stages:", error);
    }
  };

  // Fetch lead counts by stage
  const fetchLeadData = async () => {
    try {
      const pageSize = 10;
      const response = await axios.get(
        `${apiUrl}/lead/lead-list?page=1&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setTotalStageDataCount({
        ...initialCounts,
        ...response.data.totalStageDataCount,
      });
    } catch (error) {
      console.error("Error fetching lead data:", error);
    }
  };

  useEffect(() => {
    fetchStageData();
    fetchLeadData();
  }, []);

  // Prepare chart data
  const stageLabels = stageOptions.map((stage) => stage.label);
  const stageData = stageOptions.map(
    (stage) => totalStageDataCount[stage.value] || 0
  );

  const chartOptions = {
    chart: { type: "bar", height: 350 },
    plotOptions: { bar: { horizontal: true } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: stageLabels,
      min: 0,
      tickAmount: 5,
    },
    colors: ["#4CE493"],
  };

  const series = [
    {
      name: "Leads",
      data: stageData,
    },
  ];

  return (
    <div>
      <div className="statistic-header">
        <h4>
          <i className="ti ti-grip-vertical me-1" />
          Leads By Stage
        </h4>
      </div>
      <Link to="/sales/leads">
        <Chart options={chartOptions} series={series} type="bar" height={255} />
      </Link>
    </div>
  );
};

export default LeadByStage;
