import React, { useState, useEffect, useContext } from "react";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import {
  initialSettings,
} from "../../selectOption/selectOption";
import { Link } from "react-router-dom";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { all_routes } from "../Router/all_routes";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import ManagePaymentList from "../../components/Finance/Payments/ManagePaymentList";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../components/Layouts/ErrorLoader/Index";
import Select from 'react-select';
import { Empty } from "antd";
import SearchBar from "../../components/UI/SearchBar";
import AddPayment from "../../components/Finance/Payments/AddPayment";
import { label } from "yet-another-react-lightbox";
import { AuthContext } from "../../context/AuthProvider";

const PaymentPage = () => {
  const { staffData } = useContext(AuthContext);
  const [activityToggle, setActivityToggle] = useState(false)
  const route = all_routes;
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';
  const staffType = localStorage.getItem('type');
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState({
    totalSales: 0,
    totalAmounts: 0,
    totalDue: 0,
    totalPaid: 0,
    totalInvoices: 0,
    totalLeads: 0,
    convertedLeads: 0,
    totalCustomers: 0,
    totalCounts: 0,
    totalDiscount: 0,
  })

  const pageSize = 20;

  const initialFilter = {
    from: "",
    to: "",
    customerId: null,
    staffId: null,
    leadForId: null,
    serviceId: null,
    search: "",
  }
  const [filterByObj, setFilterByObj] = useState(initialFilter);
  const [customerOptions, setCustomerOptions] = useState([
    { label: "Choose", value: "" }
  ]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [leadForOptions, setLeadForOptions] = useState([]);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [result, setResult] = useState(0);


  const safeJSONParse = (str, defaultValue = []) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return defaultValue;
    }
  };

  const handleFilterChange = (event) => {
    let { name, value } = event.target;
    console.log("name =>", name)
    console.log("value =>", value)
    setFilterByObj((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/customer/customer-list`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item?.customerName,
        value: item?.customerId,
        data: item
      }));
      setCustomerOptions(() => ([
        { label: 'Customer List', value: "" },
        ...formattedData,
      ]));

    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchLeadForData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/lead-for-list`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item?.name,
        value: item?.id,
      }));
      setLeadForOptions(() => ([
        { label: 'Lead For List', value: "" },
        ...formattedData,
      ]));

    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchServicesData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/service-list`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item?.name,
        value: item?.id,
      }));
      setServicesOptions(() => ([
        { label: 'Service List', value: "" },
        ...formattedData,
      ]));

    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchStaffData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/staff/staff-dropdown`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item?.name,
        value: item?.staffId,
      }));


      setStaffOptions(() => ([
        { label: 'Staff List', value: "" },
        ...formattedData,
      ]));

    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchData = async (page) => {
    try {

      let { from, to, customerId, search, staffId, leadForId, serviceId } = filterByObj;

      // console.log({ from, to, customerId, search, staffId })

      const response = await axios.get(`${apiUrl}/customer/payment-list?page=${page ? page : 1}&pageSize=${pageSize}&search=${search}&from=${from}&to=${to}&customerId=${customerId}&staffId=${staffId}&serviceId=${serviceId}&leadForId=${leadForId}`, {
        headers: {
          'Authorization': `Bearer ${Token}`,
        }
      })
      const formattedData = response.data.data.map((item) => ({
        ...item,
        key: item.id,
        leadFor: safeJSONParse(item?.leadFor, []),
      }));
      setIsLoading(false)
      setData(formattedData);
      setResult(response?.data?.totalResults)
      setCounts((prev) => ({
        ...prev,
        totalDiscount: response?.data?.totalDiscount,
        totalSales: response?.data?.totalSales,
        totalAmounts: response?.data?.totalAmounts,
        totalPaid: response?.data?.totalPaid,
        totalDue: response?.data?.totalDue,
        totalInvoices: response?.data?.totalInvoices,
        totalLeads: response?.data?.totalLeads,
        totalCustomers: response?.data?.totalCustomers,
        totalCounts: response?.data?.totalCounts
      }))
    } catch (error) {
      console.log(error)
      setError(error.message);
    }
  };
  const handleApply = (event, picker) => {
    const start = picker.startDate.format('YYYY-MM-DD HH:mm:ss.SSS');
    const end = picker.endDate.format('YYYY-MM-DD HH:mm:ss.SSS');

    setFilterByObj((...prev) => ({
      ...prev,
      from: start ? start : "",
      to: end
    }))
  }

  function handleRefresh() {
    fetchData()
  }

  useEffect(() => {
    fetchData()
    fetchCustomerData()
    fetchServicesData()
    fetchLeadForData()
  }, [])

  useEffect(() => {
    if (staffType == '1') {
      fetchStaffData()
    }
  }, [staffType])



  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-8">
                    <h4 className="page-title">
                      Total Sales
                      {/* <span className="count-title">{counts?.totalCounts}</span> */}
                    </h4>
                  </div>
                  <div className="col-4 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}

              <div className="card main-card">
                <div className="card-body">
                  {/* Search */}
                  <div className="search-section">
                    <div className="row">
                      <div className="col-md-12 col-sm-5"
                        style={{
                          display: "flex",
                          gap: " 10px",
                          alignItems: "start"
                        }}
                      >
                        <div className="form-wrap icon-form" >
                          <SearchBar
                            fetchData={handleRefresh}
                            filterByObj={filterByObj}
                            setFilterByObj={setFilterByObj}
                            placeholder="Search By Name, Email "
                            height={"2.5rem"}
                          />
                        </div>
                        <div className=" icon-form">
                          <span className="form-icon">
                            <i className="ti ti-calendar" />
                          </span>
                          <DateRangePicker
                            initialSettings={initialSettings}
                            onApply={handleApply}
                          >
                            <input
                              className="form-control bookingrange"
                              type="text"
                              style={{ height: "2.5rem" }}
                            />
                          </DateRangePicker>
                        </div>
                        <div className="form-wrap icon-form" style={{ width: "12rem" }}>
                          <Select
                            className="select"
                            placeholder="Customer List"
                            classNamePrefix="react-select"
                            required
                            value={customerOptions.find(option => option.value === filterByObj.customerId)}
                            onChange={(event) => {
                              let { value } = event;
                              handleFilterChange({ target: { name: 'customerId', value } })
                            }}
                            options={customerOptions}
                          />
                        </div>
                        <div className=" icon-form" style={{ width: "12rem" }}>
                          <Select
                            className="select"
                            placeholder="Staff List"
                            classNamePrefix="react-select"
                            required
                            value={staffOptions.find(option => option.value === filterByObj.staffId)}
                            onChange={(event) => {
                              let { value } = event
                              handleFilterChange({ target: { name: 'staffId', value } })
                            }}
                            options={staffOptions}
                          />
                        </div>
                        <div className="form-wrap icon-form" style={{ width: "12rem" }}>
                          <Select
                            className="select"
                            placeholder="Lead For List"
                            classNamePrefix="react-select"
                            required
                            value={leadForOptions.find(option => option.value === filterByObj.leadForId)}
                            onChange={(event) => {
                              let { value } = event;
                              handleFilterChange({ target: { name: 'leadForId', value } })
                            }}
                            options={leadForOptions}
                          />
                        </div>
                        <div className="form-wrap icon-form" style={{ width: "12rem" }}>
                          <Select
                            className="select"
                            placeholder="Service List"
                            classNamePrefix="react-select"
                            required
                            value={servicesOptions.find(option => option.value === filterByObj.serviceId)}
                            onChange={(event) => {
                              let { value } = event;
                              handleFilterChange({ target: { name: 'serviceId', value } })
                            }}
                            options={servicesOptions}
                          />
                        </div>
                      </div>
                      {/* <div className="col-md-3 col-sm-8">
                        <div className="export-list text-sm-end">
                          <ul>
                            <li>
                            </li>
                            <li>
                              <Link
                                to="#"
                                className="btn btn-primary add-popup"
                                onClick={() =>
                                  setActivityToggle(prev => !prev)
                                }
                              >
                                <i className="ti ti-square-rounded-plus" /> Add New
                                Invoice
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  {/* /Search */}
                  {/* Filter */}
                  <div className="filter-section filter-flex">
                    <div className="sortby-list">
                      <ul>
                      </ul>
                    </div>
                  </div>
                  {/* /Filter */}
                  {/* Projects List */}
                  {/* Campaign Status */}
                  <div className="row">
                    <div className="col-xl-3 col-lg-6">
                      <div className="campaign-box bg-purple-light">
                        <div className="campaign-img">
                          {/* <span>
                            <i className="ti ti-send" />
                          </span> */}
                          <p>Total Sales</p>
                        </div>
                        <h2>{counts?.totalSales}</h2>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6">
                      <div className="campaign-box bg-warning-light">
                        <div className="campaign-img">
                          {/* <span>
                            <i className="ti ti-send" />
                          </span> */}
                          <p>Total Amount</p>
                        </div>
                        <h2>{counts?.totalAmounts}</h2>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6">
                      <div className="campaign-box bg-danger-light">
                        <div className="campaign-img">
                          {/* <span>
                            <i className="ti ti-brand-campaignmonitor" />
                          </span> */}
                          <p>Total Due</p>
                        </div>
                        <h2>{counts?.totalDue}</h2>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6">
                      <div className="campaign-box bg-success-light">
                        <div className="campaign-img">
                          {/* <span>
                            <i className="ti ti-brand-pocket" />
                          </span> */}
                          <p>Total Paid</p>
                        </div>
                        <h2>{counts?.totalPaid}</h2>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6">
                      <div className="campaign-box bg-success-light">
                        <div className="campaign-img">
                          {/* <span>
                            <i className="ti ti-brand-pocket" />
                          </span> */}
                          <p>Total Discount</p>
                        </div>
                        <h2>{counts?.totalDiscount}</h2>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6">
                      <div className="campaign-box bg-purple-light">
                        <div className="campaign-img">
                          {/* <span>
                            <i className="ti ti-brand-feedly" />
                          </span> */}
                          <p>Total Invoice</p>
                        </div>
                        <h2>{counts?.totalInvoices}</h2>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6">
                      <div className="campaign-box bg-warning-light">
                        <div className="campaign-img">
                          {/* <span>
                            <i class="fa-brands fa-leanpub"></i>
                          </span> */}
                          <p>Total Leads</p>
                        </div>
                        <h2>{counts?.totalLeads}</h2>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6">
                      <div className="campaign-box bg-danger-light">
                        <div className="campaign-img">
                          {/* <span>
                            <i class="fa-solid fa-right-from-bracket"></i>
                          </span> */}
                          <p>Total Customers</p>
                        </div>
                        <h2>{counts?.totalCustomers}</h2>
                      </div>
                    </div>

                  </div>
                  {/* /Campaign Status */}
                  <span className="badge border border-dark text-dark">
                    search counts: {result}
                  </span>
                  {isLoading &&
                    <ContentLoader />
                  }
                  {error &&
                    <ErrorLoader title={error.name} message={error.message} />
                  }
                  {data.length > 0 && !error &&
                    <ManagePaymentList
                      data={data}
                      handleRefresh={handleRefresh}
                      fetchPaymentData={fetchData}
                      pageSize={pageSize}
                      totalPages={result}
                    />
                  }
                  {
                    data.length === 0 && !isLoading && !error && <Empty />
                  }

                  {/* /Projects List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add Contact */}

      <AddPayment
        activityToggle={activityToggle}
        setActivityToggle={setActivityToggle}
        handleRefresh={handleRefresh}
      />

      {/* /Add Contact */}


    </div>
  );
};

export default PaymentPage;
