import React, { useState, useEffect } from "react";
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
import ManageInvoiceList from "../../components/Finance/Invoice/ManageInvoiceList";
import AddInvoice from "../../components/Finance/Invoice/AddInvoice";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../components/Layouts/ErrorLoader/Index";
import Select from 'react-select';
import { Empty } from "antd";
import SearchBar from "../../components/UI/SearchBar";

const InvoicePage = () => {
  const [activityToggle, setActivityToggle] = useState(false)
  const route = all_routes;
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';
  const [data, setData] = useState([]);
  const [counts, setCounts] = useState({
    totalAmounts: 0,
    totalDue: 0,
    totalPaid: 0,
    totalInvoices: 0,
    totalLeads: 0,
    convertedLeads: 0,
    totalCustomers: 0
  })

  const pageSize = 50;

  const initialFilter = {
    from: "",
    to: "",
    customerId: null,
    staffId: null,
    search: "",
  }
  const [filterByObj, setFilterByObj] = useState(initialFilter);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);

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
      setCustomerOptions(formattedData);

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
      setStaffOptions(formattedData);

    } catch (error) {
      toast.error(error.message);
    }
  };
  const fetchInvoiceData = async (page) => {
    try {

      let { from, to, customerId, search, staffId } = filterByObj;

      console.log({ from, to, customerId, search, staffId })

      const response = await axios.get(`${apiUrl}/customer/invoice-list?page=${page ? page : 1}&pageSize=${pageSize}&search=${search}&from=${from}&to=${to}&customerId=${customerId}&staffId=${staffId}`, {
        headers: {
          'Authorization': `Bearer ${Token}`,
        }
      })
      const formattedData = response.data.data.map((item) => ({
        ...item,
        key: item.id,
      }));
      setIsLoading(false)
      setData(formattedData);

      setCounts((prev) => ({
        ...prev,
        totalAmounts: response?.data?.totalAmounts,
        totalPaid: response?.data?.totalPaid,
        totalDue: response?.data?.totalDue,
        totalInvoices: response?.data?.totalInvoices,
        totalLeads: response?.data?.totalLeads,
        totalCustomers: response?.data?.totalCustomers
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
    fetchInvoiceData()
  }

  useEffect(() => {
    fetchInvoiceData()
    fetchCustomerData()
    fetchStaffData()
  }, [])

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
                      Invoice List<span className="count-title">{data?.length}</span>
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
                      <div className="col-md-9 col-sm-5"
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
                              style={{height:"2.5rem"}}
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
                              // console.log("value =>", value)
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
                      </div>
                      <div className="col-md-3 col-sm-8">
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
                    <div className="col-xl-4 col-lg-6">
                      <div className="campaign-box bg-warning-light">
                        <div className="campaign-img">
                          <span>
                            <i className="ti ti-send" />
                          </span>
                          <p>Total Amount</p>
                        </div>
                        <h2>{counts?.totalAmounts}</h2>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="campaign-box bg-danger-light">
                        <div className="campaign-img">
                          <span>
                            <i className="ti ti-brand-campaignmonitor" />
                          </span>
                          <p>Total Due</p>
                        </div>
                        <h2>{counts?.totalDue}</h2>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="campaign-box bg-success-light">
                        <div className="campaign-img">
                          <span>
                            <i className="ti ti-brand-pocket" />
                          </span>
                          <p>Total Paid</p>
                        </div>
                        <h2>{counts?.totalPaid}</h2>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6">
                      <div className="campaign-box bg-purple-light">
                        <div className="campaign-img">
                          <span>
                            <i className="ti ti-brand-feedly" />
                          </span>
                          <p>Total Invoice</p>
                        </div>
                        <h2>{counts?.totalInvoices}</h2>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-6">
                      <div className="campaign-box bg-warning-light">
                        <div className="campaign-img">
                          <span>
                            <i class="fa-brands fa-leanpub"></i>
                          </span>
                          <p>Total Leads</p>
                        </div>
                        <h2>{counts?.totalLeads}</h2>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-6">
                      <div className="campaign-box bg-danger-light">
                        <div className="campaign-img">
                          <span>
                            <i class="fa-solid fa-right-from-bracket"></i>
                          </span>
                          <p>Total Customers</p>
                        </div>
                        <h2>{counts?.totalCustomers}</h2>
                      </div>
                    </div>

                  </div>


                  {isLoading &&
                    <ContentLoader />
                  }
                  {error &&
                    <ErrorLoader title={error.name} message={error.message} />
                  }
                  {data.length > 0 && !error &&
                    <ManageInvoiceList
                      data={data}
                      handleRefresh={handleRefresh}
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

      <AddInvoice
        activityToggle={activityToggle}
        setActivityToggle={setActivityToggle}
        handleRefresh={handleRefresh}
      />

      {/* /Add Contact */}
      {/* Edit Contact */}

      {/* /Edit Contact */}
      {/* Add New Deals */}

      {/* /Add New Deals */}
      {/* Delete Contact */}
      <div
        className="modal custom-modal fade"
        id="delete_contact"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon">
                  <i className="ti ti-trash-x" />
                </div>
                <h3>Remove Contacts?</h3>
                <p className="del-info">
                  Are you sure you want to remove contact you selected.
                </p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Contact */}
      {/* Create Contact */}
      <div
        className="modal custom-modal fade"
        id="create_contact"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon bg-light-blue">
                  <i className="ti ti-user-plus" />
                </div>
                <h3>Contact Created Successfully!!!</h3>
                <p>View the details of contact, created</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.customerDetails} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Contact */}
      {/* Add New View */}
      <div className="modal custom-modal fade" id="save_view" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New View</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-wrap">
                  <label className="col-form-label">View Name</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-danger">
                    Save
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add New View */}
      {/* Access */}
      <div className="modal custom-modal fade" id="access_view" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Access For</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-wrap icon-form">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                </div>
                <div className="access-wrap">
                  <ul>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-19.jpg"
                            alt=""
                          />
                          <Link to="#">Darlee Robertson</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-20.jpg"
                            alt=""
                          />
                          <Link to="#">Sharon Roy</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-21.jpg"
                            alt=""
                          />
                          <Link to="#">Vaughan</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt=""
                          />
                          <Link to="#">Jessica</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-16.jpg"
                            alt=""
                          />
                          <Link to="#">Carol Thomas</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-22.jpg"
                            alt=""
                          />
                          <Link to="#">Dawn Mercha</Link>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Confirm
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Access */}
    </div>
  );
};

export default InvoicePage;
