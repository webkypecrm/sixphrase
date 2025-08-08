import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import RecentLeads from "../../components/Dashboard/RecentLeads";
import LeadByStage from "../../components/Dashboard/LeadByStage";
import ProjectByLeads from "../../components/Dashboard/ProjectByLeads";
import WonBySource from "../../components/Dashboard/WonBySource";
import RecentAppointments from "../../components/Dashboard/RecentAppointments";
import RecentCalls from "../../components/Dashboard/RecentCalls";
import RecentConverts from "../../components/Dashboard/RecentConverts";
import WonByService from "../../components/Dashboard/WonByService";
import LeadPipelineInDasboard from "../../components/Dashboard/LeadPipelineInDashboard";
import Funnal1 from "../../components/Dashboard/Funnal1";
import Funnal2 from "../../components/Dashboard/Funnal2";
import GradientDonut from "../../components/Dashboard/GradientDonut";
import NegativeValue from "../../components/Dashboard/NegativeValue";
import Funnal3 from "../../components/Dashboard/Funnal3";
import CircleChart from "../../components/Dashboard/CircleChart";


const SalesDashboard = () => {
  const initialCounts = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
  }
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const [leadForOptions, setLeadForOptions] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [totalStageDataCount, setTotalStageDataCount] = useState(initialCounts);
  const [getStageId, setGetStageId] = useState(null);

  const [counts, setCounts] = useState({
    totalSales: 0,
    totalDiscount: 0,
    // totalAmounts: 0,
    totalDue: 0,
    totalPaid: 0,
    totalInvoices: 0,
    totalLeads: 0,
    convertedLeads: 0,
    totalCustomers: 0,
    totalCounts: 0,
  });

  const handleStatusChange = (index) => {
    // console.log('number =>', number)
    // console.log("index =>", index)
    // setFilterByObj((prevData) => ({
    //     ...prevData,
    //     stage: [index]
    // }))

  }

  const fetchLeadForData = async () => {
    try {
      const response = await fetch(`${apiUrl}/master/lead-for-list`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${Token}`
        },
      });
      const resData = await response.json();
      const formattedData = resData.data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      setLeadForOptions(formattedData);
    } catch (error) {
      console.log(error)
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/dashboard/sales-count`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      setCounts({
        totalSales: response?.data?.totalSales || 0,
        totalDiscount: response?.data?.totalDiscount || 0,
        totalAmounts: response?.data?.totalAmounts || 0,
        totalPaid: response?.data?.totalPaid || 0,
        totalDue: response?.data?.totalDue || 0,
        totalInvoices: response?.data?.totalInvoices || 0,
        totalLeads: response?.data?.totalLeads || 0,
        convertedLeads: response?.data?.convertedLeads || 0,
        totalCustomers: response?.data?.totalCustomers || 0,
        totalCounts: response?.data?.totalCounts || 0,
      });
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };
  const fetchStageData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/stage-list`);
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id,
        order: item.order
      }));
      setStageOptions(() => [...formattedData]);
    } catch (error) {
      console.log(error)
      // toast.error(error.message)
    }
  };
  const fetchLeadData = async (page) => {
    try { 
      let pageSize = 10;
      let url = `${apiUrl}/lead/lead-list?page=${page ? page : 1}&pageSize=${pageSize}`
      const response = await axios.get(url,
        {
          headers: {
            Authorization: `Bearer ${Token}`
          }
        });

      console.log("totalStageDataCount =>", response.data.totalStageDataCount)

      setTotalStageDataCount(() => ({
        ...initialCounts,
        ...response.data.totalStageDataCount
      }));
      // setTotalPages(response.data.totalCount);
      // setResult(response.data.totalResult);
      // setIsLoading(false)

    } catch (error) {
      console.log(error)
      // setIsLoading(false)
    }
  };


  useEffect(() => {
    fetchData();
    fetchLeadForData();
    fetchStageData();
    fetchLeadData();
  }, []);


  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <h3 className="page-title">Sales Dashboard</h3>
                </div>
              </div>
            </div>

            {/* Sales Stats */}
            <div className="row">
              {[
                { title: "Total Sales", value: counts.totalSales, icon: "ti ti-send", bg: "bg-warning-light" },
                {
                  title: "Total Discounts",
                  value: counts.totalDiscount,
                  icon: "ti ti-brand-feedly",
                  bg: "bg-purple-light",
                },
                // { title: "Total Amount", value: counts.totalAmounts, icon: "ti ti-send", bg: "bg-warning-light" },
                { title: "Total Received", value: counts.totalPaid, icon: "ti ti-brand-pocket", bg: "bg-success-light" },
                { title: "Total Due", value: counts.totalDue, icon: "ti ti-brand-campaignmonitor", bg: "bg-danger-light" },
                // { title: "Total Leads", value: counts.totalLeads, icon: "fa-brands fa-leanpub", bg: "bg-warning-light" },
                // {
                //   title: "Total Customers",
                //   value: counts.totalCustomers,
                //   icon: "fa-solid fa-right-from-bracket",
                //   bg: "bg-danger-light",
                // },
              ].map((item, index) => (
                <div key={index} className="col-xl-3 col-lg-6">
                  <div className={`campaign-box ${item.bg}`}>
                    <div className="campaign-img">
                      <span>
                        <i className={item.icon} />
                      </span>
                      <div>
                        <p style={{ fontSize: '13px', marginBottom: '0px' }}>{item.title}</p>
                        <h2 style={{ fontSize: '18px', fontWeight: '400' }}>{item.value}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Lead Components */}
            <div className="row">
              {/* <div className="col-md-12">
                <LeadPipelineInDasboard
                  stageOptions={stageOptions}
                  handleStatusChange={handleStatusChange}
                  totalStageDataCount={totalStageDataCount}
                  getStageId={0}
                />
              </div> */}

              <div className="col-md-6">
                <RecentLeads
                  leadForOptions={leadForOptions}
                />
              </div>
              <div className="col-md-6 d-flex">
                <ProjectByLeads />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <RecentAppointments />
              </div>
              <div className="col-md-6 d-flex">
                <RecentCalls />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                <Funnal2/>
                </div>
              </div>
            </div>




            <div className="row">
              <div className="col-md-12">
                <RecentConverts
                  leadForOptions={leadForOptions}
                />
              </div>
            </div>

            {/* Charts */}
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <LeadByStage 
                  />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <GradientDonut/>
                  </div>
                </div>
              </div>




              <div className="col-md-12">
                <div className="card">
                  <WonBySource />
                  {/* <Chart options={chartOptions3.options} series={chartOptions3.series} type="pie" width={400} /> */}
                </div>
              </div>
              <div className="col-md-12">
                <div className="card">
                  <WonByService />
                  {/* <Chart options={chartOptions3.options} series={chartOptions3.series} type="pie" width={400} /> */}
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <Funnal1/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <NegativeValue/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <Funnal3/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <CircleChart/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
