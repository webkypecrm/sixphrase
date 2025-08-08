import { useState, useEffect } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import PageHeader from "../../components/Layouts/PageHeader"
import { Empty } from "antd";
import axios from "axios";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../components/Layouts/ErrorLoader/Index";
import ManageCustomerList from "../../components/Reports/NewReports/ManageCustomerList";
// import SearchSection from "../../components/Reports/NewReports/SearchSection";
import Filter from "../Customer/Filter";
import {
  initialSettings,
} from "../../selectOption/selectOption";
import DateRangePicker from "react-bootstrap-daterangepicker";
import 'react-datepicker/dist/react-datepicker.css';
import SearchBar from "../../components/UI/SearchBar";
import Select from 'react-select';
import SearchSection from "../../components/Reports/NewReports/SearchSection";
import { months } from "../../selectOption/selectOption";

const SalesReport = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [filterSlider, setFilterSlider] = useState(false);
  const [stageOptions, setStageOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [leadForOpitons, setLeadForOpitons] = useState([]);
  const [manageColumns, setManageColumns] = useState({
    "Customer Id": true,
    "Customer Name": true,
    "Customer Created Date": true,
    "Source": true,
    "Email": true,
    "Mobile": true,
    "City": true,
    "Lead For": true,
    "Owner": true,
    "Assigned By": true,
    "Assigned To": true,
    "Service": true,
    "Total Appointment Done": true,
    "Appointment Date": true,
    "Appointment Status": true,
    "Total Invoice": true,
    "Created Date": true,
    "Total Amount": true,
    "Total Paid": true,
    "Total Due": true,
  });
  const [totalPages, setTotalPages] = useState(0);
  // const [pageSize, setPageSize] = useState(2);
  const pageSize = 50
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
    totalInvoiceCount: 0,
    totalAppointmentCount: 0
  })
  const [leadForOptions, setLeadForOptions] = useState([]);


  // const employeeId = localStorage.getItem('staffId') || '';
  const staffType = localStorage.getItem('type') || '';

  const initialFilter = {
    from: "",
    to: "",
    sourceId: null,
    customerId: null,
    staffId: null,
    leadForId: null,
    serviceId: null,
    search: "",
  };
  const [filterByObj, setFilterByObj] = useState(initialFilter);
  const [staffOptions, setStaffOptions] = useState([]);
  const [servicesOptions, setServicesOptions] = useState([]);

  const startYear = 2000;
  const endYear = 2050;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => ({
    value: startYear + i,
    label: (startYear + i).toString(),
  }));

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
    fetchCustomerData()
  }
  const handleFilterChange = (event) => {
    let { name, value } = event.target;
    // console.log("name =>", name)
    // console.log("value =>", value)
    setFilterByObj((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePopup = () => {
    setAddCustomer(prev => !prev);
  };
  const togglePopupTwo = () => {
    setEditCustomer(prev => !prev);
  };
  function handleRefresh() {
    fetchCustomerData()
  };
  const safeJSONParse = (str, defaultValue = []) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return defaultValue;
    }
  };
  const fetchStageData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/stage-list`);
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      setStageOptions(() => [...formattedData]);
    } catch (error) {
      toast.error(error.message)
    }
  };
  const fetchCustomerData = async (page) => {
    try {
      const { from, to, sourceId, staffId, serviceId, leadForId, search } = filterByObj;
      let url = `${apiUrl}/customer/customer-reports-data?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}&sourceId=${sourceId}&staffId=${staffId}&leadForId=${leadForId}&serviceId=${serviceId}&search=${search}`
      const response = await axios.get(url,
        {
          headers: {
            Authorization: `Bearer ${Token}`
          }
        });

      const formattedData = response.data.data.map((item) => ({
        ...item,
        key: item.customerId,
        leadFor: safeJSONParse(item.leadFor, [])
      }));

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
        totalCounts: response?.data?.totalCounts,
        totalAppointmentCount: response?.data?.totalAppointmentCount,
        totalInvoiceCount: response?.data?.totalInvoiceCount
      }))

      setData(formattedData);
      setTotalPages(response.data.totalCount)
      setIsLoading(false)

    } catch (error) {
      setError(error)
      setIsLoading(false)

    }
  };
  const fetchSourceData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/source-list`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      setSourceOptions(()=>([
        { label: 'Source List', value: "" },
        ...formattedData
      ]));

    } catch (error) {
      setError(error)

    }
  };
  const fetchCountryData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/employee/country-list`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      setCountryOptions(formattedData);

    } catch (error) {
      setError(error)

    }
  };
  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/category-list`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id
      }));
      setCategoryOptions(formattedData);

    } catch (error) {
      console.log(error)

    }
  };
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
      setLeadForOpitons(() => ([
        { label: 'Lead For List', value: "" },
        ...formattedData
      ]));
    } catch (error) {
      console.log(error)
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


  useEffect(() => {
    fetchCustomerData()
    fetchSourceData()
    fetchCountryData()
    fetchStageData()
    fetchCategoryData()
    fetchLeadForData()
    fetchStaffData()
    fetchServicesData()
  }, [])

  // console.log(' data =>', data)

  // console.log("filterByObj =>", filterByObj)

  return <>
    {/* Page Wrapper */}
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            {/* Page Header */}
            <PageHeader title="Sales Reports" count={totalPages} />
            {/* /Page Header */}
            <div className="card main-card">
              <div className="card-body">
                {/* Search */}
                {/* <SearchSection
                  togglePopup={togglePopup}
                  onManageColumns={setManageColumns}
                  manageColumns={manageColumns}
                  fetchCustomerData={fetchCustomerData}
                  filterByObj={filterByObj}
                  setFilterByObj={setFilterByObj}
                  setFilterSlider={setFilterSlider}
                  data={data}
                /> */}


                <div className="search-section">
                  <div className="row">
                    <div className="col-md-12 col-sm-5"
                      style={{
                        display: "flex",
                        gap: " 10px",
                        alignItems: "start"
                      }}
                    >
                      <div className="form-wrap icon-form" style={{ width: "14rem" }} >
                        <SearchBar
                          fetchData={handleRefresh}
                          filterByObj={filterByObj}
                          setFilterByObj={setFilterByObj}
                          placeholder="Search By Name, Email "
                          height={"2.5rem"}
                        />
                      </div>
                      <div className=" icon-form" style={{ width: "14rem" }}>
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
                          placeholder="Source List"
                          classNamePrefix="react-select"
                          required
                          value={sourceOptions.find(option => option.value === filterByObj.sourceId)}
                          onChange={(event) => {
                            let { value } = event;
                            handleFilterChange({ target: { name: 'sourceId', value } })
                          }}
                          options={sourceOptions}
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
                          value={leadForOpitons.find(option => option.value === filterByObj.leadForId)}
                          onChange={(event) => {
                            let { value } = event;
                            handleFilterChange({ target: { name: 'leadForId', value: [value] } })
                          }}
                          options={leadForOpitons}
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
                      {/* <div className="form-wrap icon-form" style={{ width: "8rem" }}>
                        <SearchSection
                          manageColumns={manageColumns}
                          data={data}
                          filterByObj={filterByObj}
                        />
                      </div> */}
                      <div className="form-wrap icon-form" style={{ width: "8rem" }}>
                        <SearchSection
                          manageColumns={manageColumns}
                          data={data}
                          filterByObj={filterByObj}
                        />
                      </div>
                    </div>

                  </div>

                </div>
                {/* /Search */}
                <div className="row">
                  <div className="col-xl-4 col-lg-6">
                    <div className="campaign-box bg-warning-light" style={{ display: 'grid' }}>
                      <div className="campaign-img">
                        <p>Total Amount</p>
                      </div>
                      <h2>{counts?.totalAmounts}</h2>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="campaign-box bg-danger-light" style={{ display: 'grid' }}>
                      <div className="campaign-img">
                        <p>Total Due</p>
                      </div>
                      <h2>{counts?.totalDue}</h2>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="campaign-box bg-success-light" style={{ display: 'grid' }}>
                      <div className="campaign-img">
                        <p>Total Paid</p>
                      </div>
                      <h2>{counts?.totalPaid}</h2>
                    </div>
                  </div>
                  {/* <div className="col-xl-3 col-lg-6">
                    <div className="campaign-box bg-purple-light" style={{ display: 'grid' }}>
                      <div className="campaign-img">
                        <p>Total Discount</p>
                      </div>
                      <h2>{counts?.totalDiscount}</h2>
                    </div>
                  </div> */}
                  <div className="col-xl-4 col-lg-6">
                    <div className="campaign-box bg-purple-light" style={{ display: 'grid' }}>
                      <div className="campaign-img">
                        <p>Total Invoice</p>
                      </div>
                      <h2>{counts?.totalInvoiceCount}</h2>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="campaign-box " style={{ display: 'grid', backgroundColor: '#f8d2f5' }}>
                      <div className="campaign-img">
                        <p>Total Appointment Done</p>
                      </div>
                      <h2>{counts?.totalAppointmentCount}</h2>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6">
                    <div className="campaign-box " style={{ display: 'grid', backgroundColor: 'rgb(198 222 255)' }}>
                      <div className="campaign-img">
                        <p>Total Customer</p>
                      </div>
                      <h2>{totalPages}</h2>
                    </div>
                  </div>


                </div>
                {/* Manage Users List */}
                {isLoading &&
                  <ContentLoader />
                }
                {error &&
                  <ErrorLoader title={error.name} message={error.message} />
                }
                {data.length > 0 && !error &&
                  <ManageCustomerList
                    data={data}
                    onCustomerDetails={handleRefresh}
                    togglePopup={togglePopup}
                    togglePopupTwo={togglePopupTwo}
                    fetchCustomerData={fetchCustomerData}
                    manageColumns={manageColumns}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    // customerDetailsHandler={customerDetailsHandler}
                    // setCustomerInfo={setCustomerInfo}
                    leadForOpitons={leadForOpitons}
                  />
                }
                {
                  data.length === 0 && !isLoading && !error && <Empty />
                }
                {/* /Manage Users List */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* <div className="form-sorts dropdown">
      {filterSlider &&
        <Filter
          filterSlider={filterSlider}
          setFilterSlider={setFilterSlider}
          sourceOptions={sourceOptions}
          countryOptions={countryOptions}
          leadForOpitons={leadForOpitons}
          setFilterByObj={setFilterByObj}
          fetchLeadData={fetchCustomerData}
        />
      }
    </div> */}

  </>
}

export default SalesReport

