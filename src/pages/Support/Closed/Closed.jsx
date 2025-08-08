import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import PageHeader from "../../../components/Layouts/PageHeader";
import { toast } from "react-toastify";
import axios from "axios";
import ContentLoader from "../../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../../components/Layouts/ErrorLoader/Index";
import Filter from "../../../components/Task/Filter";
import { Empty } from "antd";
import Select from "react-select";
import SupportSearch from "../../../components/Support/SupportSearch";
// import ManageTicketList from "../../Progress/ManageTicketList";
import TicketPie from "../../../components/Support/TicketPie";
import ClosedSupportSearch from "./ClosedSupportSearch";
import ManageTicketList from "../ManageTicketList";

export const Closed = () => {
  const [activityToggle, setActivityToggle] = useState(false);
  const [activityToggleTwo, setActivityToggleTwo] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskCategoryOptions, setTaskCategoryOptions] = useState([]);
  const [taskSubCategoryOptions, setTaskSubCategoryOptions] = useState([]);
  const [leadOptions, setLeadOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [filterSlider, setFilterSlider] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);
  const [manageColumns, setManageColumns] = useState({
    TID: true,
    Customer: true,
    "Job/Project": true,
    Category: true,
    "Sub Category": true,
    Details: true,
    "Created By": true,
    "Assigned To": true,
    Status: true,
    Priority: true,
    "View Files": true,
    Action: true,
  });
  const initialFilter = {
    from: "",
    to: "",
    source: [],
    industry: [],
    country: [],
    stage: [],
    company: [],
    leadOwner: [],
    search: "",
  };
  const [filterByObj, setFilterByObj] = useState(initialFilter);
  const [totalPages, setTotalPages] = useState(0);
  // const [pageSize, setPageSize] = useState(2);
  const pageSize = 500;

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const staffType = localStorage.getItem("type") || "";

  function taskDetailsHandler(data) {
    setTaskDetails(data);
  }

  const fetchTaskData = async (page) => {
    try {
      const {
        from,
        to,
        industry,
        source,
        country,
        stage,
        company,
        leadOwner,
        search,
      } = filterByObj;
      console.log({
        from,
        to,
        industry,
        source,
        country,
        stage,
        company,
        leadOwner,
        search,
      });

      let url = `${apiUrl}/task/task-list?page=${
        page ? page : 1
      }&pageSize=${pageSize}&to=${to}&from=${from}
                        &industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&leadOwner=${leadOwner}&search=${search}`;

      if (staffType == "0") {
        url = `${apiUrl}/task/task-list?staffType=0&page=${
          page ? page : 1
        }&pageSize=${pageSize}&to=${to}&from=${from}
                        &industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&leadOwner=${leadOwner}&search=${search}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      const formattedData = response.data.data.map((item) => ({
        ...item,
        key: item.taskId,
        tags: JSON.parse(item.tags),
      }));

      setData(formattedData);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  const fetchTaskCategoryData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/task-category-list`);
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setTaskCategoryOptions(formattedData);
      setIsLoading(false);
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
    }
  };

  const fetchTaskSubCategoryData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/master/task-sub-category-list`
      );
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setTaskSubCategoryOptions(formattedData);
      setIsLoading(false);
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
    }
  };

  const fetchLeadData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/lead/leadDropdown`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      const formattedData = response.data.data.map((item) => ({
        label: `leadId:${item.leadId} | ${item.leadName} | ${item.leadMobile1} |
                         ${
                           item?.company?.companyName
                             ? item.company.companyName
                             : ""
                         }`,
        value: item.leadId,
      }));

      setLeadOptions(formattedData);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/customer/customerDropdown`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      const formattedData = response.data.data.map((item) => ({
        label: `customerId:${item.customerId} | ${item.customerName} | ${
          item.customerMobile1
        } |
                         ${
                           item?.company?.companyName
                             ? item.company.companyName
                             : ""
                         }`,
        value: item.convertedLeadId,
      }));

      setCustomerOptions(formattedData);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  const fetchStaffData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/staff/staff-list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.staffId,
      }));
      setStaffOptions(() => [...formattedData]);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchTaskData();
    fetchTaskCategoryData();
    fetchTaskSubCategoryData();
    fetchLeadData();
    fetchStaffData();
    fetchCustomerData();
  }, []);

  // Get ticket details
  const [ticketdata, setTicketData] = useState([]);
  const [count, setCount] = useState(0);
  const getticketData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/support-ticket-list?status=closed`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      console.log("count", response?.data);
      setTicketData(response?.data?.data);
      setCount(response?.data?.TotalCount);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };
  useEffect(() => {
    getticketData();
  }, []);
  return (
    <Fragment>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <PageHeader title="Closed Ticket" count={count} />
              {/* /Page Header */}
              {/* Campaign Status */}
              {/* <CampaignStatus /> */}
              {/* /Campaign Status */}
              <TicketPie
                data={data}
                taskCategoryOptions={taskCategoryOptions}
              />

              <div className="card main-card">
                <div className="card-body">
                  {/* Search */}
                  <ClosedSupportSearch
                    setActivityToggle={setActivityToggle}
                    onManageColumns={setManageColumns}
                    manageColumns={manageColumns}
                    filterByObj={filterByObj}
                    setFilterSlider={setFilterSlider}
                    setFilterByObj={setFilterByObj}
                    fetchTaskData={fetchTaskData}
                  />
                  {/* /Search */}
                  {isLoading && <ContentLoader />}
                  {error && (
                    <ErrorLoader title={error.name} message={error.message} />
                  )}
                  {data?.length > 0 && !error && (
                    <ManageTicketList
                      data={data}
                      setData={setData}
                      setActivityToggleTwo={setActivityToggleTwo}
                      fetchTaskData={fetchTaskData}
                      staffOptions={staffOptions}
                      manageColumns={manageColumns}
                      pageSize={pageSize}
                      totalPages={totalPages}
                      onTaskDetails={taskDetailsHandler}
                      ticketdata={ticketdata}
                      getticketData={getticketData}
                    />
                  )}
                  {data.length === 0 && !isLoading && !error && <Empty />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      <div className="form-sorts dropdown">
        <Filter
          filterSlider={filterSlider}
          setFilterSlider={setFilterSlider}
          sourceOptions={[]}
          industryOptions={[]}
          countryOptions={[]}
          setFilterByObj={setFilterByObj}
          fetchTaskData={fetchTaskData}
        />
      </div>
    </Fragment>
  );
};
