import { useState, useEffect, Suspense, lazy, useContext } from "react";
import { useLocation } from 'react-router-dom';
import "bootstrap-daterangepicker/daterangepicker.css";
import PageHeader from "../../components/Layouts/PageHeader"
import Select from 'react-select';
import { Empty } from "antd";
import axios from "axios";
import SearchSection from "../../components/Reports/Lead/SearchSection";
const ManageLeadList = lazy(() => import("../../components/Reports/Lead/ManageLeadList"));
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import './LeadPage.css';
import { SearchContext } from '../../context/SearchProvider';
import SearchBar from "../../components/UI/SearchBar";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {
  initialSettings,
} from "../../selectOption/selectOption";

const LeadReportPage = () => {
  const { searchTerms } = useContext(SearchContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';
  const staffType = localStorage.getItem('type');
  const [addLead, setAddLead] = useState(false);
  const [data, setData] = useState([]);
  const location = useLocation();

  const [sourceOptions, setSourceOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [leadDetails, setLeadDetails] = useState(null);
  const [stageOptions, setStageOptions] = useState([]);
  const [manageColumns, setManageColumns] = useState({
    "Lead Id": true,
    "Source": true,
    "Created Date": true,
    "Lead Name": true,
    "Lead For": true,
    "Country": true,
    "City": true,
    "Assign To": true,
    "Stage": true,
  });
  const initialCounts = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
  }
  const [getStageId, setGetStageId] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  // const [pageSize, setPageSize] = useState(50);
  const pageSize = 50;
  const [totalStageDataCount, setTotalStageDataCount] = useState(initialCounts);
  const [result, setResult] = useState(0);
  // const [debouncedTerm, setDebouncedTerm] = useState(searchTerms);

  const initialFilter = {
    from: "",
    to: "",
    source: [],
    industry: [],
    country: [],
    state: [],
    city: [],
    stage: [],
    company: [],
    leadOwner: [],
    assignedTo: [],
    leadFor: [],
    staffId: null,
    leadForId: null,
    search: "",
  }
  const [filterByObj, setFilterByObj] = useState(initialFilter);
  const [customerOptions, setCustomerOptions] = useState([
    { label: "Choose", value: "" }
  ]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [leadForOptions, setLeadForOptions] = useState([]);
  const [servicesOptions, setServicesOptions] = useState([]);
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
  const togglePopup = () => {
    setAddLead(prev => !prev);
  };
  function leadDetailsHandler(data) {
    setLeadDetails(data)
  }
  const handleStatusChange = (index) => {
    // console.log('number =>', number)
    // console.log("index =>", index)
    setFilterByObj((prevData) => ({
      ...prevData,
      stage: [index]
    }))

  }
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
        value: item.id,
        order: item.order
      }));
      setStageOptions(() => ([
        { label: 'Select Stage', value: "" },
        ...formattedData,
      ]));
    } catch (error) {
      console.log(error)
      // toast.error(error.message)
    }
  };
  const fetchLeadData = async (page) => {
    try {
      let { from, to, industry, source, country, state, city, stage, leadOwner, assignedTo, leadFor, search, staffId, leadForId } = filterByObj;
      let url = `${apiUrl}/lead/lead-reports?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
                &staffId=${staffId}&leadForId=${leadForId}&source=${source}&country=${country}&state=${state}&city=${city}&stage=${stage}&leadOwner=${leadOwner}&assignedTo=${assignedTo}&leadFor=${leadFor}&search=${search}`

      const response = await axios.get(url,
        {
          headers: {
            Authorization: `Bearer ${Token}`
          }
        });

      const formattedData = response.data.data.map((item) => ({
        ...item,
        key: item.leadId,
        tags: safeJSONParse(item?.tags, []), // Safely parse tags
        leadFor: safeJSONParse(item?.leadFor, []), // Safely parse leadFor
      }));

      // console.log("formattedData =>", formattedData)

      setTotalStageDataCount(() => ({
        ...initialCounts,
        ...response.data.totalStageDataCount
      }));

      setCounts((prev) => ({
        ...prev,
        totalDiscount: response?.data?.totalDiscount,
        totalSales: response?.data?.totalSales,
        totalAmounts: response?.data?.totalAmounts,
        totalPaid: response?.data?.totalPaid,
        totalDue: response?.data?.totalDue,
        totalInvoices: response?.data?.totalInvoices,
        // totalLeads: response?.data?.totalLeads,
        totalCustomers: response?.data?.totalCustomers,
        totalCounts: response?.data?.totalCounts,
        totalLeads: response?.data?.totalCount
      }))

      setData(formattedData);
      setTotalPages(response.data.totalCount);
      setResult(response.data.totalResult);
      // setIsLoading(false)

    } catch (error) {
      console.log(error)
      // setIsLoading(false)
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
      setSourceOptions(formattedData);

    } catch (error) {
      console.log(error)

    }
  };
  // const fetchCountryData = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/employee/country-list`, {
  //       headers: {
  //         Authorization: `Bearer ${Token}`
  //       }
  //     });
  //     const formattedData = response.data.data.map((item) => ({
  //       label: item.name,
  //       value: item.id
  //     }));
  //     setCountryOptions(formattedData);

  //   } catch (error) {
  //     console.log(error)

  //   }
  // };
  // const fetchCategoryData = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/master/category-list`, {
  //       headers: {
  //         Authorization: `Bearer ${Token}`
  //       }
  //     });
  //     const formattedData = response.data.data.map((item) => ({
  //       label: item.name,
  //       value: item.id
  //     }));
  //     setCategoryOptions(formattedData);

  //   } catch (error) {
  //     console.log(error)

  //   }
  // };
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
        { label: 'Select Customer', value: "" },
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
        { label: 'Select Service', value: "" },
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
  const handleFilterChange = (event) => {
    let { name, value } = event.target;
    console.log("name =>", name)
    console.log("value =>", value)
    setFilterByObj((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleApply = (event, picker) => {
    const start = picker.startDate.format('YYYY-MM-DD HH:mm:ss.SSS');
    const end = picker.endDate.format('YYYY-MM-DD HH:mm:ss.SSS');

    setFilterByObj((...prev) => ({
      ...prev,
      from: start ? start : "",
      to: end
    }))
  }
  function handleRefreshPage() {
    window.location.reload()
  }
  function handleRefresh() {
    fetchLeadData()
  }
  useEffect(() => {
    if (location?.state?.stage) {
      setGetStageId(location?.state?.stage)
      handleStatusChange(location?.state?.stage)
    }
  }, [location?.state?.stage])

  useEffect(() => {
    fetchLeadData()
    fetchSourceData()
    // fetchCountryData()
    fetchStageData()
    // fetchCategoryData()
    fetchLeadForData()
    fetchCustomerData()
    fetchServicesData()
    fetchLeadForData()
    fetchStaffData()
  }, [])

  useEffect(() => {
    if (searchTerms !== "" && searchTerms !== undefined) {
      setFilterByObj(() => ({
        ...initialFilter,
        search: String(searchTerms)
      }))
    }
  }, [searchTerms])

  return <>
    {/* Page Wrapper */}
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            {/* Page Header */}
            <PageHeader title="Leads Reports" count={result} pageRefresh={handleRefreshPage} />
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
                      <div className=" icon-form" style={{ width: "12rem" }}>
                        <Select
                          className="select"
                          placeholder="Staff List"
                          classNamePrefix="react-select"
                          required
                          value={staffOptions.find(option => option.value === filterByObj.assignedTo)}
                          onChange={(event) => {
                            let { value } = event
                            handleFilterChange({ target: { name: 'assignedTo', value: [value] } })
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
                          value={leadForOptions.find(option => option.value === filterByObj.leadFor)}
                          onChange={(event) => {
                            let { value } = event;
                            handleFilterChange({ target: { name: 'leadFor', value: [value] } })
                          }}
                          options={leadForOptions}
                        />
                      </div>
                      <div className="form-wrap icon-form" style={{ width: "12rem" }}>
                        <Select
                          className="select"
                          placeholder="Stage List"
                          classNamePrefix="react-select"
                          required
                          value={stageOptions.find(option => option.value === filterByObj.stage)}
                          onChange={(event) => {
                            let { value } = event;
                            handleFilterChange({ target: { name: 'stage', value: [value] } })
                          }}
                          options={stageOptions}
                        />
                      </div>
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

                {/* <div className="row"> */}
                  {/* <div className="col-xl-3 col-lg-6">
                    <div className="campaign-box bg-warning-light" style={{ display: 'grid' }}>
                      <div className="campaign-img">
                        <p>Total Amount</p>
                      </div>
                      <h2>{counts?.totalAmounts}</h2>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6">
                    <div className="campaign-box bg-danger-light" style={{ display: 'grid' }}>
                      <div className="campaign-img">
                        <p>Total Due</p>
                      </div>
                      <h2>{counts?.totalDue}</h2>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6">
                    <div className="campaign-box bg-success-light" style={{ display: 'grid' }}>
                      <div className="campaign-img">
                        <p>Total Paid</p>
                      </div>
                      <h2>{counts?.totalPaid}</h2>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6">
                    <div className="campaign-box bg-purple-light" style={{ display: 'grid' }}>
                      <div className="campaign-img">
                        <p>Total Discount</p>
                      </div>
                      <h2>{counts?.totalDiscount}</h2>
                    </div>
                  </div> */}
                  {/* <div className="col-xl-3 col-lg-6">
                    <div className="campaign-box bg-purple-light" style={{ display: 'grid' }}>
                      <div className="campaign-img">
                        <p>Total Invoice</p>
                      </div>
                      <h2>{counts?.totalInvoices}</h2>
                    </div>
                  </div> */}
                  {/* <div className="col-xl-3 col-lg-6">
                    <div className="campaign-box bg-warning-light">
                      <div className="campaign-img">

                        <p>Total Leads</p>
                      </div>
                      <h2>{counts?.totalLeads}</h2>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-6">
                    <div className="campaign-box bg-danger-light">
                      <div className="campaign-img">

                        <p>Total Customers</p>
                      </div>
                      <h2>{counts?.totalCustomers}</h2>
                    </div>
                  </div> */}
                {/* </div> */}

                {/* <SearchSection
                  manageColumns={manageColumns}
                  data={data}
                /> */}
                {/* /Search */}

                <Suspense fallback={data.length > 0 ? <ContentLoader /> : <Empty />}>
                  <ManageLeadList
                    data={data}
                    onLeadDetails={leadDetailsHandler}
                    togglePopup={togglePopup}
                    fetchLeadData={fetchLeadData}
                    leadForOptions={leadForOptions}
                    manageColumns={manageColumns}
                    pageSize={pageSize}
                    totalPages={result}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* /Page Wrapper */}

    {/* <div className="form-sorts dropdown">
      {filterSlider &&
        <Filter
          filterSlider={filterSlider}
          setFilterSlider={setFilterSlider}
          sourceOptions={sourceOptions}
          industryOptions={industryOptions}
          countryOptions={countryOptions}
          leadForOpitons={leadForOpitons}
          setFilterByObj={setFilterByObj}
          fetchLeadData={fetchLeadData}
        />
      }
    </div> */}

  </>
}


export default LeadReportPage