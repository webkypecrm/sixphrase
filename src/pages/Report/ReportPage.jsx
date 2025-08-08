




// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "bootstrap-daterangepicker/daterangepicker.css";
// import PageHeader from "../../components/Layouts/PageHeader"
// import { Empty } from "antd";
// import axios from "axios";
// import CampaignStatus from "../../components/Layouts/CampaignStatus/Index"
// import ManageLeadList from "../../components/Sales/ManageLeadList";
// import AddLead from "../../components/Sales/AddLead";
// import ContentLoader from "../../components/Layouts/ContentLoader/Index";
// import ErrorLoader from "../../components/Layouts/ErrorLoader/Index";
// import EditLead from "../../components/Sales/EditLead";
// import EditCompany from "../../components/Sales/EditCompany";
// import ManageCustomerList from "../../components/Reports/NewReports/ManageCustomerList";
// import SearchSection from "../../components/Reports/NewReports/SearchSection";
// import EditCustomer from "../../components/Customer/EditCustomer";
// // import Filter from "./Filter";
// import Filter from "../Customer/Filter";


// const ReportPage = () => {

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const Token = localStorage.getItem('token') || '';
//   const [addLead, setAddCustomer] = useState(false);
//   const [editCustomer, setEditCustomer] = useState(false);
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sourceOptions, setSourceOptions] = useState([]);
//   const [countryOptions, setCountryOptions] = useState([]);
//   const [customerInfo, setCustomerInfo] = useState({});
//   const [companyDetails, setCompanyDetails] = useState(null);
//   const [filterSlider, setFilterSlider] = useState(false);
//   const [stageOptions, setStageOptions] = useState([]);
//   const [categoryOptions, setCategoryOptions] = useState([]);
//   const [leadForOpitons, setLeadForOpitons] = useState([]);
//   const [manageColumns, setManageColumns] = useState({
//     "Customer Name": true,
//     "Customer Email": true,
//     "Customer Mobile1": true,
//     "Customer Mobile2": false,
//     "Customer Mobile3": false,
//     "Country": true,
//     "City": true,
//     "Source": true,
//     "Lead For": true,
//     "Owner": true,
//     "Assigned Staff": true,
//     "Created Date": true,
//     "Total Estimate Cost": true,
//     "Total Amount": true,
//     "Total Paid": true,
//     "Total Due": true,
//     "Stage": true,
//     "Contact": true,
//     "Action": true,
//   });
//   const [totalPages, setTotalPages] = useState(0);
//   // const [pageSize, setPageSize] = useState(2);
//   const pageSize = 50
//   const [counts, setCounts] = useState({
//     totalSales: 0,
//     totalAmounts: 0,
//     totalDue: 0,
//     totalPaid: 0,
//     totalInvoices: 0,
//     totalLeads: 0,
//     convertedLeads: 0,
//     totalCustomers: 0,
//     totalCounts: 0,
//     totalDiscount: 0,
//   })

//   // const employeeId = localStorage.getItem('staffId') || '';
//   const staffType = localStorage.getItem('type') || '';

//   const initialFilter = {
//     from: "",
//     to: "",
//     source: [],
//     industry: [],
//     country: [],
//     stage: [],
//     leadFor: [],
//     company: [],
//     customerOwner: [],
//     search: "",
//   }
//   const [filterByObj, setFilterByObj] = useState(initialFilter);

//   const togglePopup = () => {
//     setAddCustomer(prev => !prev);
//   };
//   const togglePopupTwo = () => {
//     setEditCustomer(prev => !prev);
//   };
//   function customerDetailsHandler(data) {
//     // console.log("data in customer details=>", data)
//     setCustomerInfo(() => ({
//       ...data
//     }))
//   }
//   function handleRefresh() {
//     fetchCustomerData()
//   }
//   const safeJSONParse = (str, defaultValue = []) => {
//     try {
//       return JSON.parse(str);
//     } catch (e) {
//       return defaultValue;
//     }
//   };
//   // console.log('filterByObj =>', filterByObj, num++)
//   const fetchStageData = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/master/stage-list`);
//       const formattedData = response.data.data.map((item) => ({
//         label: item.name,
//         value: item.id
//       }));
//       setStageOptions(() => [...formattedData]);
//     } catch (error) {
//       toast.error(error.message)
//     }
//   };
//   const fetchCustomerData = async (page) => {
//     try {
//       const { from, to, industry, source, country, stage, company, customerOwner, leadFor, search } = filterByObj;

//       // console.log("search =>", search)

//       let url = `${apiUrl}/customer/customer-reports?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}&industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&customerOwner=${customerOwner}&leadFor=${leadFor}&search=${search}`

//       if (staffType == '0') {
//         url = `${apiUrl}/customer/customer-list?staffType=${0}&page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
//                 &industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&customerOwner=${customerOwner}&leadFor=${leadFor}&search=${search}`
//       }

//       // console.log('search =>', search)
//       const response = await axios.get(url,
//         {
//           headers: {
//             Authorization: `Bearer ${Token}`
//           }
//         });

//       const formattedData = response.data.data.map((item) => ({
//         ...item,
//         key: item.customerId,
//         leadFor: safeJSONParse(item.leadFor, [])
//       }));

//       setCounts((prev) => ({
//         ...prev,
//         totalDiscount: response?.data?.totalDiscount,
//         totalSales: response?.data?.totalSales,
//         totalAmounts: response?.data?.totalAmounts,
//         totalPaid: response?.data?.totalPaid,
//         totalDue: response?.data?.totalDue,
//         totalInvoices: response?.data?.totalInvoices,
//         totalLeads: response?.data?.totalLeads,
//         totalCustomers: response?.data?.totalCustomers,
//         totalCounts: response?.data?.totalCounts
//       }))

//       setData(formattedData);
//       setTotalPages(response.data.totalCount)
//       setIsLoading(false)

//     } catch (error) {
//       setError(error)
//       setIsLoading(false)

//     }
//   };
//   const fetchSourceData = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/master/source-list`, {
//         headers: {
//           Authorization: `Bearer ${Token}`
//         }
//       });
//       const formattedData = response.data.data.map((item) => ({
//         label: item.name,
//         value: item.id
//       }));
//       setSourceOptions(formattedData);

//     } catch (error) {
//       setError(error)

//     }
//   };
//   const fetchCountryData = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/employee/country-list`, {
//         headers: {
//           Authorization: `Bearer ${Token}`
//         }
//       });
//       const formattedData = response.data.data.map((item) => ({
//         label: item.name,
//         value: item.id
//       }));
//       setCountryOptions(formattedData);

//     } catch (error) {
//       setError(error)

//     }
//   };
//   const fetchCategoryData = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/master/category-list`, {
//         headers: {
//           Authorization: `Bearer ${Token}`
//         }
//       });
//       const formattedData = response.data.data.map((item) => ({
//         label: item.name,
//         value: item.id
//       }));
//       setCategoryOptions(formattedData);

//     } catch (error) {
//       console.log(error)

//     }
//   };
//   const fetchLeadForData = async () => {
//     try {
//       const response = await fetch(`${apiUrl}/master/lead-for-list`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${Token}`
//         },
//       });
//       const resData = await response.json();
//       const formattedData = resData.data.map((item) => ({
//         label: item.name,
//         value: item.id
//       }));
//       setLeadForOpitons(formattedData);
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     fetchCustomerData()
//     fetchSourceData()
//     fetchCountryData()
//     fetchStageData()
//     fetchCategoryData()
//     fetchLeadForData()
//   }, [])

//   // console.log(' data =>', data)

//   console.log("filterByObj =>", filterByObj)

//   return <>
//     {/* Page Wrapper */}
//     <div className="page-wrapper">
//       <div className="content">
//         <div className="row">
//           <div className="col-md-12">
//             {/* Page Header */}
//             <PageHeader title="Sales Report" count={totalPages} />
//             {/* /Page Header */}

//             <div className="card main-card">
//               <div className="card-body">
//                 {/* Search */}
//                 <SearchSection
//                   togglePopup={togglePopup}
//                   onManageColumns={setManageColumns}
//                   manageColumns={manageColumns}
//                   fetchCustomerData={fetchCustomerData}
//                   filterByObj={filterByObj}
//                   setFilterByObj={setFilterByObj}
//                   setFilterSlider={setFilterSlider}
//                   data={data}
//                 />
//                 {/* /Search */}

//                 <div className="row">
//                   <div className="col-xl-3 col-lg-6">
//                     <div className="campaign-box bg-warning-light" style={{ display: 'grid' }}>
//                       <div className="campaign-img">
//                         <p>Total Amount</p>
//                       </div>
//                       <h2>{counts?.totalAmounts}</h2>
//                     </div>
//                   </div>
//                   <div className="col-xl-3 col-lg-6">
//                     <div className="campaign-box bg-danger-light" style={{ display: 'grid' }}>
//                       <div className="campaign-img">
//                         <p>Total Due</p>
//                       </div>
//                       <h2>{counts?.totalDue}</h2>
//                     </div>
//                   </div>
//                   <div className="col-xl-3 col-lg-6">
//                     <div className="campaign-box bg-success-light" style={{ display: 'grid' }}>
//                       <div className="campaign-img">
//                         <p>Total Paid</p>
//                       </div>
//                       <h2>{counts?.totalPaid}</h2>
//                     </div>
//                   </div>
//                   <div className="col-xl-3 col-lg-6">
//                     <div className="campaign-box bg-purple-light" style={{ display: 'grid' }}>
//                       <div className="campaign-img">
//                         <p>Total Discount</p>
//                       </div>
//                       <h2>{counts?.totalDiscount}</h2>
//                     </div>
//                   </div>
//                   {/* <div className="col-xl-3 col-lg-6">
//                       <div className="campaign-box bg-purple-light" style={{ display: 'grid' }}>
//                         <div className="campaign-img">                        
//                           <p>Total Invoice</p>
//                         </div>
//                         <h2>{counts?.totalInvoices}</h2>
//                       </div>
//                     </div> */}
//                   {/* <div className="col-xl-3 col-lg-6">
//                       <div className="campaign-box bg-warning-light">
//                         <div className="campaign-img">

//                           <p>Total Leads</p>
//                         </div>
//                         <h2>{counts?.totalLeads}</h2>
//                       </div>
//                     </div> */}
//                   {/* <div className="col-xl-3 col-lg-6">
//                       <div className="campaign-box bg-danger-light">
//                         <div className="campaign-img">

//                           <p>Total Customers</p>
//                         </div>
//                         <h2>{counts?.totalCustomers}</h2>
//                       </div>
//                     </div> */}
//                 </div>



//                 {/* Manage Users List */}
//                 {isLoading &&
//                   <ContentLoader />
//                 }
//                 {error &&
//                   <ErrorLoader title={error.name} message={error.message} />
//                 }
//                 {data.length > 0 && !error &&
//                   <ManageCustomerList
//                     data={data}
//                     onCustomerDetails={handleRefresh}
//                     togglePopup={togglePopup}
//                     togglePopupTwo={togglePopupTwo}
//                     fetchCustomerData={fetchCustomerData}
//                     manageColumns={manageColumns}
//                     pageSize={pageSize}
//                     totalPages={totalPages}
//                     customerDetailsHandler={customerDetailsHandler}
//                     setCustomerInfo={setCustomerInfo}
//                     leadForOpitons={leadForOpitons}
//                   />
//                 }
//                 {
//                   data.length === 0 && !isLoading && !error && <Empty />
//                 }
//                 {/* /Manage Users List */}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* {customerInfo &&
//             <EditCustomer
//                 editCompany={editCustomer}
//                 togglePopupTwo={togglePopupTwo}
//                 sourceOptions={sourceOptions}
//                 countryOptions={countryOptions}
//                 categoryOptions={categoryOptions}
//                 leadForOpitons={leadForOpitons}
//                 fetchCustomerData={handleRefresh}
//                 customerDetails={customerInfo}
//                 setCustomerDetails={setCustomerInfo}
//             />
//         } */}

//     <div className="form-sorts dropdown">
//       {filterSlider &&
//         <Filter
//           filterSlider={filterSlider}
//           setFilterSlider={setFilterSlider}
//           sourceOptions={sourceOptions}
//           countryOptions={countryOptions}
//           leadForOpitons={leadForOpitons}
//           setFilterByObj={setFilterByObj}
//           fetchLeadData={fetchCustomerData}
//         />
//       }
//     </div>



//   </>
// }


// export default ReportPage

















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
import ManagePaymentList from "../../components/Reports/Report/ManagePaymentList";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../components/Layouts/ErrorLoader/Index";
import Select from 'react-select';
import { Empty } from "antd";
import SearchBar from "../../components/UI/SearchBar";
import AddPayment from "../../components/Finance/Payments/AddPayment";
import { label } from "yet-another-react-lightbox";
import { AuthContext } from "../../context/AuthProvider";
import SearchSection from "../../components/Reports/Report/SearchSection";

const ReportPage = () => {
  const { staffData } = useContext(AuthContext);
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
    totalInvoiceCount: 0,
    totalAppointmentCount: 0,
    totalCustomer: 0
  })
  const [manageColumns, setManageColumns] = useState({
    "Customer": true,
    "Service": true,
    "Total Amount": true,
    "Paid Amount": true,
    "Due Amount": true,
    "Invoice Count": true,
    "Invoice Requested": true,
    "Invoice Paid": true,
    "Invoice Due": true,
    "Created Date": true,
    "Assigned Staff": true,
  });

  const pageSize = 50;

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
  const [sourceOptions, setSourceOptions] = useState([])


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

      const response = await axios.get(`${apiUrl}/customer/payment-list-report?page=${page ? page : 1}&pageSize=${pageSize}&search=${search}&from=${from}&to=${to}&customerId=${customerId}&staffId=${staffId}&serviceId=${serviceId}&leadForId=${leadForId}`, {
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
        totalCounts: response?.data?.totalCounts,
        totalInvoiceCount: response?.data?.totalInvoiceCount || 0,
        totalAppointmentCount: response?.data?.totalAppointmentCount || 0,
        totalCustomer: response?.data?.totalCustomer || 0,
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

  useEffect(() => {
    fetchData()
    fetchCustomerData()
    fetchServicesData()
    fetchLeadForData()
    fetchSourceData()
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
                      Reports
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
                    {/* <div className="col-xl-3 col-lg-6">
                      <div className="campaign-box bg-purple-light">
                        <div className="campaign-img">
                          <p>Accounts Reports</p>
                        </div>
                        <h2>{result}</h2>
                      </div>
                    </div> */}
                    {/* <div className="col-xl-3 col-lg-6">
                      <div className="campaign-box bg-warning-light" style={{ display: 'grid' }}>
                        <div className="campaign-img">
                          <p>Total Leads</p>
                        </div>
                        <h2>{counts?.totalLeads}</h2>
                      </div>
                    </div> */}
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
                    <div className="col-xl-4 col-lg-6">
                      <div className="campaign-box bg-purple-light" style={{ display: 'grid' }}>
                        <div className="campaign-img">
                          {/* <span>
                            <i className="ti ti-brand-feedly" />
                          </span> */}
                          <p>Total Invoice</p>
                        </div>
                        <h2>{counts?.totalInvoiceCount}</h2>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="campaign-box " style={{ display: 'grid', backgroundColor: '#bfe9e6' }}>
                        <div className="campaign-img">
                          {/* <span>
                            <i className="ti ti-brand-feedly" />
                          </span> */}
                          <p>Total Appointment</p>
                        </div>
                        <h2>{counts?.totalAppointmentCount}</h2>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="campaign-box bg-success-light" style={{ display: 'grid', backgroundColor: '#c0d1ff' }}>
                        <div className="campaign-img">
                          <p>Total Customer</p>
                        </div>
                        <h2>{counts?.totalCustomer}</h2>
                      </div>
                    </div>
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
                  </div>
                  {/* /Campaign Status */}
                  {/* <span className="badge border border-dark text-dark">
                    search counts: {result}
                  </span> */}
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
                      sourceOptions={sourceOptions}
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

      {/* <AddPayment
        activityToggle={activityToggle}
        setActivityToggle={setActivityToggle}
        handleRefresh={handleRefresh}
      /> */}

      {/* /Add Contact */}


    </div>
  );
};

export default ReportPage;
