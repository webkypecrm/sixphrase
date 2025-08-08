import React, { useState } from "react";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import {
  companyName,
  duration,
  initialSettings,
  optionssymbol,
  priorityList,
  project,
  salestypelist,
  socialMedia,
  status,
  tagInputValues,
} from "../../selectOption/selectOption";
import Select from "react-select";
import { Link } from "react-router-dom";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { contactData } from "../../data/contactData";
import DataTable from "../../components/Table/DataTable";
// import { TableData } from "../../../core/data/interface";

import AddInvoice from "../../components/Finance/Invoice/AddInvoice";
import { TagsInput } from "react-tag-input-component";
import { all_routes } from "../Router/all_routes";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import DefaultEditor from "react-simple-wysiwyg";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
// import { SelectWithImage } from "../../../core/common/selectWithImage";
// import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import axios from "axios";
import Dropdown from "../../components/UI/Dropdown";
import { invoiceStatus } from "../../selectOption/selectOption";
// import Select from 'react-select';

const CustomerList = ({ customerDetails }) => {
  const [activityToggle, setActivityToggle] = useState(false);
  const [activityToggleTwo, setActivityToggleTwo] = useState(false);
  const [activityToggleThree, setActivityToggleThree] = useState(false);
  const [activityTogglePopupTwo, setActivityTogglePopupTwo] = useState(false);
  const [addTogglePopupTwo, setAddTogglePopupTwo] = useState(false);
  const route = all_routes;
  const [owner, setOwner] = useState(["Collab"]);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const [selectedDate, setSelectedDate] = useState(new Date());
  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };

   const [counts, setCounts] = useState({
      receivable: 10000000,
      recived: 4000000,
      totalDue: 0,
      due: 6000000,
      cancel: 4000000,
    });
  const dealsopen = [
    { value: "choose", label: "Choose" },
    { value: "collins", label: "Collins" },
    { value: "konopelski", label: "Konopelski" },
    { value: "adams", label: "Adams" },
    { value: "schumm", label: "Schumm" },
    { value: "wisozk", label: "Wisozk" },
  ];
  const activities = [
    { value: "choose", label: "Choose" },
    { value: "phoneCalls", label: "Phone Calls" },
    { value: "socialMedia", label: "Social Media" },
    { value: "referralSites", label: "Referral Sites" },
    { value: "webAnalytics", label: "Web Analytics" },
    { value: "previousPurchases", label: "Previous Purchases" },
  ];
  const industries = [
    { value: "choose", label: "Choose" },
    { value: "Retail Industry", label: "Retail Industry" },
    { value: "Banking", label: "Banking" },
    { value: "Hotels", label: "Hotels" },
    { value: "Financial Services", label: "Financial Services" },
    { value: "Insurance", label: "Insurance" },
  ];
  const languages = [
    { value: "Choose", label: "Choose" },
    { value: "English", label: "English" },
    { value: "Arabic", label: "Arabic" },
    { value: "Chinese", label: "Chinese" },
    { value: "Hindi", label: "Hindi" },
  ];
  const countries = [
    { value: "Choose", label: "Choose" },
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "France", label: "France" },
    { value: "UAE", label: "UAE" },
  ];
  const [stars, setStars] = useState({});

  const initializeStarsState = () => {
    const starsState = {};
    contactData.forEach((item, index) => {
      starsState[index] = false;
    });
    setStars(starsState);
  };

  // Call initializeStarsState once when the component mounts
  React.useEffect(() => {
    initializeStarsState();
  }, []);
  // const data = contactData;
  const handleStarToggle = (index) => {
    setStars((prevStars) => ({
      ...prevStars,
      [index]: !prevStars[index],
    }));
  };

  const columns = [
    {
      title: "",
      dataIndex: "",
      key: "customerId",
      render: (text, record, index) => (
        <div
          className={`set-star rating-select ${stars[index] ? "filled" : ""}`}
          onClick={() => handleStarToggle(index)}
          key={index}
        >
          <i className="fa fa-star"></i>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "customerName",
      key: "customerId",
      render: (text, record, index) => (
        <div className="table-avatar d-flex align-items-center" key={index}>
          {/* {route.customerPic ?
            <Link to={route.customerDetails} className="avatar">
              <img
                className="avatar-img"
                src={record?.customerPic}
              // alt={text}
              />
            </Link>
            :
            <i className="ti ti-user" />
          } */}

          <Link
            // to={route.customerDetails}
            className="profile-split d-flex flex-column"
          >
            {record.customerName} <span>Id: {record.customerId}</span>
          </Link>
        </div>
      ),
      sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "INV-ID",
      dataIndex: "customerMobile1",
      key: "customerId",
      sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "Customer",
      dataIndex: "customerEmail",
      key: "customerId",
      sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Inv Amount",
      dataIndex: "owner",
      key: "customerId",
      sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "Tax",
      dataIndex: "",
      key: "customerId",
      render: (index) => (
        <div className="social-links d-flex align-items-center" key={index}>
          <li>
            <Link to="#">
              <i className="ti ti-mail me-2"></i>
            </Link>
          </li>
          <li>
            <Link to="#">
              <i className="ti ti-phone-check me-2"></i>
            </Link>
          </li>
          <li>
            <Link to="#">
              <i className="ti ti-message-circle-share me-2"></i>
            </Link>
          </li>
          <li>
            <Link to="#">
              <i className="ti ti-brand-skype me-2"></i>
            </Link>
          </li>
          <li>
            <Link to="#">
              <i className="ti ti-brand-facebook "></i>
            </Link>
          </li>
        </div>
      ),
      sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "Tax Amt",
      dataIndex: "status",
      key: "customerId",
      render: (text, index) => (
        <div key={index}>
          {text === "active" && (
            <span className="badge badge-pill badge-status bg-success">
              {text}
            </span>
          )}
          {text === "inactive" && (
            <span className="badge badge-pill badge-status bg-danger">
              {text}
            </span>
          )}
        </div>
      ),
      sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "Total",
      dataIndex: "status",
      key: "customerId",
      render: (text, index) => (
        <div key={index}>
          {text === "active" && (
            <span className="badge badge-pill badge-status bg-success">
              {text}
            </span>
          )}
          {text === "inactive" && (
            <span className="badge badge-pill badge-status bg-danger">
              {text}
            </span>
          )}
        </div>
      ),
      sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "Invoice",
      dataIndex: "status",
      key: "customerId",
      render: (text, index) => (
        <div key={index}>
          {text === "active" && (
            <span className="badge badge-pill badge-status bg-success">
              {text}
            </span>
          )}
          {text === "inactive" && (
            <span className="badge badge-pill badge-status bg-danger">
              {text}
            </span>
          )}
        </div>
      ),
      sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "View",
      dataIndex: "actions",
      key: "customerId",
      render: (index) => (
        <div className="dropdown table-action" key={index}>
          <Link
            to="#"
            className="action-icon"
            data-bs-toggle="dropdown"
            aria-expanded="true"
          >
            <i className="fa fa-ellipsis-v"></i>
          </Link>
          <div
            className="dropdown-menu dropdown-menu-right"
            style={{
              position: "absolute",
              inset: "0px auto auto 0px",
              margin: "0px",
              transform: "translate3d(-99.3333px, 35.3333px, 0px)",
            }}
            data-popper-placement="bottom-start"
          >
            <Link
              className="dropdown-item edit-popup"
              to="#"
              onClick={() => setActivityToggleTwo((prev) => !prev)}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contact"
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const fetchCustomerData = async (page) => {
    try {
      // const { from, to, industry, source, country, stage, company, leadOwner, search } = filterByObj;
      // console.log({ from, to, industry, source, country, stage, company, leadOwner, search })

      let url = `${apiUrl}/customer/customer-list`;

      // let url = `${apiUrl}/task/task-list?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
      //     &industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&leadOwner=${leadOwner}&search=${search}`

      // if (staffType == "0") {
      //   url = `${apiUrl}/task/task-list?staffType=0&page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
      //       &industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&leadOwner=${leadOwner}&search=${search}`
      // }

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
      a;
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  // ----------------------Product invoice----------------------------------------
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dueDate: date,
    }));
  };
  const handleInvoiceDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      InvoiceDate: date,
    }));
  };
  const initialForm = {
    customerId: null,
    customerEmail: "",
    customerMobile: "",
    customerAddressbill: "",
    customerAddressship: "",
    Item: [
      {
        itemNo: 1,
        product: "",
        brand: "",
        rate: "",
        quantity: "",
        total: 0,
      },
    ],
    discount: "",
    discountAmout: 0,
    subTotal: 0,
    taxRate: "",
    taxAmount: 0,
    total: 0,
    amountPaid: "",
    amountDue: "",
    dueDate: "",
    InvoiceDate: "",
    paymentMethod: "",
    status: "",
    notes: "",
    serviceId: null,
    leadServiceId: null,
    handlingcharges: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [serviceOpitons, setServiceOpitons] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleInputChange1 = (index, value, fieldName) => {
    setFormData((prevData) => {
      const updatedItems = [...prevData.Item];
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value,
      };

      const rate = parseFloat(updatedItems[index].rate || 0);
      const quantity = parseFloat(updatedItems[index].quantity || 0);
      updatedItems[index].total = rate * quantity;

      return { ...prevData, Item: updatedItems };
    });
  };

  const handleAddItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      Item: [
        ...prevData.Item,
        {
          itemNo: prevData.Item.length + 1,
          product: "",
          brand: "",
          rate: "",
          quantity: "",
          total: 0,
        },
      ],
    }));
  };

  // const handleRemoveItem = (index) => {
  //   setFormData((prevData) => {
  //     const updatedItems = prevData.Item.filter((_, i) => i !== index);
  //     return { ...prevData, Item: updatedItems };
  //   });
  // };
  const handleRemoveItem = (index) => {
    setFormData((prevData) => {
      const updatedItems = prevData.Item.filter((_, i) => i !== index).map(
        (item, i) => ({
          ...item,
          itemNo: i + 1,
        })
      );

      return { ...prevData, Item: updatedItems };
    });
  };

  useEffect(() => {
    const subTotal = formData.Item.reduce((sum, item) => {
      const itemTotal = parseFloat(item.total || 0);
      return sum + itemTotal;
    }, 0);

    const discount = parseFloat(formData.discount || 0);
    const discountAmout = (subTotal * discount) / 100;

    const taxRate = parseFloat(formData.taxRate || 0);
    const taxAmount = ((subTotal - discountAmout) * taxRate) / 100;

    const total = subTotal - discountAmout + taxAmount;

    setFormData((prev) => ({
      ...prev,
      subTotal,
      taxAmount,
      discountAmout,
      total,
    }));
  }, [formData.Item, formData.taxRate, formData.discount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let dataToSend = {
        ...formData,
        Item: JSON.stringify(formData.Item),
      };

      if (customerDetails?.convertedLeadId) {
        dataToSend.leadId = customerDetails.convertedLeadId;
      }

      const response = await fetch(`${apiUrl}/customer/add-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const resData = await response.json();

      if (!response.ok)
        throw new Error(resData.message || "Failed to add invoice");

      handleRefresh();
      setFormData(initialForm);
      setActivityToggle(false);
      toast.success("Invoice added successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // ----------------------service invoice----------------------------------------
  const initialForm2 = {
    customerId: null,
    customerEmail: "",
    customerMobile: "",
    billTo: "",
    shipTo: "",
    Item: [
      {
        itemNo2: 1,
        service: "",
        tenure: "",
        rate2: "",
        quantity2: "",
        total2: 0,
      },
    ],
    discount2: "",
    discountAmout2: 0,
    subTotal2: 0,
    taxRate2: "",
    taxAmount2: 0,
    total2: 0,
    invoiceDate2: "",
    amountPaid: "",
    amountDue: "",
    dueDate2: "",
    paymentMethod: "",
    status: "",
    notes2: "",
    serviceId: null,
    leadServiceId: null,
    shipping: "",
  };

  const [formData2, setFormData2] = useState(initialForm2);
  const [selectedCustomer2, setSelectedCustomer2] = useState({});
  const [serviceOpitons2, setServiceOpitons2] = useState([]);
  const [customerOptions2, setCustomerOptions2] = useState([]);

  const handleDateChange2 = (date) => {
    setFormData2((prev) => ({
      ...prev,
      dueDate2: date,
    }));
  };
  const handleInvoiceDateChange2 = (date) => {
    setFormData2((prev) => ({
      ...prev,
      invoiceDate2: date,
    }));
  };

  const handleInputChange2 = (event) => {
    const { name, value } = event.target;
    setFormData2((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleInputChange3 = (index, value, fieldName) => {
    setFormData2((prevData) => {
      const updatedItems = [...prevData.Item];
      updatedItems[index] = {
        ...updatedItems[index],
        [fieldName]: value,
      };

      const rate = parseFloat(updatedItems[index].rate2 || 0);
      const quantity = parseFloat(updatedItems[index].quantity2 || 0);
      updatedItems[index].total2 = rate * quantity;

      return { ...prevData, Item: updatedItems };
    });
  };

  const handleAddItem2 = () => {
    setFormData2((prevData) => ({
      ...prevData,
      Item: [
        ...prevData.Item,
        {
          itemNo2: prevData.Item.length + 1,
          service: "",
          tenure: "",
          rate2: "",
          quantity2: "",
          total2: 0,
        },
      ],
    }));
  };

  const handleRemoveItem2 = (index) => {
    setFormData2((prevData) => {
      const updatedItems = prevData.Item.filter((_, i) => i !== index).map(
        (item, i) => ({
          ...item,
          itemNo2: i + 1,
        })
      );

      return { ...prevData, Item: updatedItems };
    });
  };

  useEffect(() => {
    const subTotall = formData2.Item.reduce((sum, item) => {
      const itemTotal2 = parseFloat(item.total2 || 0);
      return sum + itemTotal2;
    }, 0);

    const discountt = parseFloat(formData2.discount2 || 0);
    const discountAmoutt = (subTotall * discountt) / 100;

    const taxRatee = parseFloat(formData2.taxRate2 || 0);
    const taxAmountt = ((subTotall - discountAmoutt) * taxRatee) / 100;

    const totall = subTotall - discountAmoutt + taxAmountt;

    setFormData2((prev) => ({
      ...prev,
      subTotal2: subTotall,
      discountAmout2: discountAmoutt,
      taxAmount2: taxAmountt,
      total2: totall,
    }));
  }, [formData2.Item, formData2.taxRate2, formData2.discount2]);

  const handleSubmit2 = async (event) => {
    event.preventDefault();
    try {
      let dataToSend = {
        ...formData2,
        Item: JSON.stringify(formData2.Item),
      };

      if (customerDetails?.convertedLeadId) {
        dataToSend.leadId = customerDetails.convertedLeadId;
      }

      const response2 = await fetch(`${apiUrl}/customer/add-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const resData2 = await response2.json();

      if (!response2.ok)
        throw new Error(resData2.message || "Failed to add invoice");

      handleRefresh();
      setFormData2(initialForm2);
      setActivityToggle(false);
      toast.success("Invoice added successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const tenure = [
    { value: "hourly", label: "Hourly" },
    { value: "monthly", label: "Monthly" },
    { value: "onetime", label: "One-time" },
    { value: "yearly contract", label: "Yearly Contract" },
  ];

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
                      Invoice
                      <span className="count-title">{data?.length}</span>
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
              {/* Campaign Status */}
              {/* <div className="row">
                <div className="col-xl-3 col-lg-6">
                  <div
                    className="campaign-box bg-purple-light"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-brand-campaignmonitor" />
                      </span>
                      <p style={{ marginBottom: "auto" }}>Receivable</p>
                    </div>
                    <h2 className="ms-5">1000000</h2>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6">
                  <div
                    className="campaign-box bg-success-light"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-send" />
                      </span>
                      <p style={{ marginBottom: "auto" }}>Recived</p>
                    </div>
                    <h2 className="ms-5">400000</h2>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6">
                  <div
                    className="campaign-box bg-warning-light"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-brand-feedly" />
                      </span>
                      <p style={{ marginBottom: "auto" }}>Due</p>
                    </div>
                    <h2 className="ms-5">600000</h2>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6">
                  <div
                    className="campaign-box bg-danger-light"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-brand-pocket" />
                      </span>
                      <p style={{ marginBottom: "auto" }}>Cancelled</p>
                    </div>
                    <h2 className="ms-5">400000</h2>
                  </div>
                </div>
              </div> */}
                       <div className="row">
              {[
                { title: "Receivable", value: counts.receivable, icon: "ti ti-send", bg: "bg-purple-light" },
                {
                  title: "Received",
                  value: counts.recived,
                  icon: "ti ti-brand-feedly",
                  bg: "bg-success-light",
                },
                // { title: "Total Amount", value: counts.totalAmounts, icon: "ti ti-send", bg: "bg-warning-light" },
                { title: "Due", value: counts.due, icon: "ti ti-brand-pocket", bg: "bg-warning-light" },
                { title: "Cancelled", value: counts.cancel, icon: "ti ti-brand-campaignmonitor", bg: "bg-danger-light" },
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
              {/* /Campaign Status */}
              <div className="card main-card">
                <div className="card-body">
                  {/* Search */}
                  <div className="search-section">
                    <div className="row">
                      <div className="col-md-3 col-sm-4">
                        <div className=" icon-form form-sorts dropdown">
                          <span className="form-icon">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Invoice"
                          />
                        </div>
                      </div>
                      <div className="col-md-9 col-sm-8">
                        <div className="export-list text-sm-end">
                          <ul>
                            <li>
                              <div className=" icon-form form-sorts dropdown">
                                <span className="form-icon">
                                  <i className="ti ti-calendar" />
                                </span>

                                <DateRangePicker
                                  initialSettings={initialSettings}
                                >
                                  <input
                                    className="form-control bookingrange"
                                    type="text"
                                  />
                                </DateRangePicker>
                              </div>
                            </li>
                            <li>
                              <div className="form-sorts dropdown">
                                <Link
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="false"
                                >
                                  <i className="ti ti-filter-share" />
                                  Filter
                                </Link>
                                <div className="filter-dropdown-menu dropdown-menu  dropdown-menu-md-end">
                                  <div className="filter-set-view">
                                    <div className="filter-set-head">
                                      <h4>
                                        <i className="ti ti-filter-share" />
                                        Filter
                                      </h4>
                                    </div>

                                    <div
                                      className="accordion"
                                      id="accordionExample"
                                    >
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-expanded="true"
                                            aria-controls="collapseTwo"
                                          >
                                            Country
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse show"
                                          id="collapseTwo"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <div className="form-wrap icon-form">
                                              <span className="form-icon">
                                                <i className="ti ti-search" />
                                              </span>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search Country"
                                              />
                                            </div>
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>India</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>USA</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>France</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>United Kingdom</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>UAE</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Italy</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Japan</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Germany</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#owner"
                                            aria-expanded="false"
                                            aria-controls="owner"
                                          >
                                            Owner
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="owner"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <div className="form-wrap icon-form">
                                              <span className="form-icon">
                                                <i className="ti ti-search" />
                                              </span>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search Owner"
                                              />
                                            </div>
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Hendry</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Guillory</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Jami</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Theresa</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Espinosa</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#Status"
                                            aria-expanded="false"
                                            aria-controls="Status"
                                          >
                                            Status
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="Status"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Active</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Inactive</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-expanded="false"
                                            aria-controls="collapseOne"
                                          >
                                            Rating
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="collapseOne"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <span>5.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <span>4.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <span>3.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <span>2.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <span>1.0</span>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseThree"
                                            aria-expanded="false"
                                            aria-controls="collapseThree"
                                          >
                                            Tags
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="collapseThree"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Promotion</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Rated</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Rejected</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Collab</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Calls</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="filter-reset-btns">
                                      <div className="row">
                                        <div className="col-6">
                                          <Link
                                            to="#"
                                            className="btn btn-light"
                                          >
                                            Reset
                                          </Link>
                                        </div>
                                        <div className="col-6">
                                          <Link
                                            to={route.customerList}
                                            className="btn btn-primary"
                                          >
                                            Filter
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="export-dropdwon">
                                <Link
                                  to="#"
                                  className="dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  style={{ padding: "9px" }}
                                >
                                  <i className="ti ti-package-export" />
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-end">
                                  <ul>
                                    <li>
                                      <Link to="#">
                                        <i className="ti ti-file-type-pdf text-danger" />
                                        Export as PDF
                                      </Link>
                                    </li>
                                    <li>
                                      <Link to="#">
                                        <i className="ti ti-file-type-xls text-green" />
                                        Export as Excel{" "}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </li>
                            <li>
                              <Link
                                to="#"
                                className="btn btn-primary add-popup"
                                onClick={() =>
                                  setActivityToggle((prev) => !prev)
                                }
                              >
                                <i className="ti ti-square-rounded-plus" />{" "}
                                Product Invoice
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="#"
                                className="btn btn-primary add-popup"
                                onClick={() =>
                                  setActivityToggleThree((prev) => !prev)
                                }
                              >
                                <i className="ti ti-square-rounded-plus" />{" "}
                                Service Invoice
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
                        {/* <li>
                          <div className="sort-dropdown drop-down">
                            <Link
                              to="#"
                              className="dropdown-toggle"
                              data-bs-toggle="dropdown"
                            >
                              <i className="ti ti-sort-ascending-2" />
                              Sort{" "}
                            </Link>
                            <div className="dropdown-menu  dropdown-menu-start">
                              <ul>
                                <li>
                                  <Link to="#">
                                    <i className="ti ti-circle-chevron-right" />
                                    Ascending
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#">
                                    <i className="ti ti-circle-chevron-right" />
                                    Descending
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#">
                                    <i className="ti ti-circle-chevron-right" />
                                    Recently Viewed
                                  </Link>
                                </li>
                                <li>
                                  <Link to="#">
                                    <i className="ti ti-circle-chevron-right" />
                                    Recently Added
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li> */}
                        {/* <li>
                          <div className="form-wrap icon-form">
                            <span className="form-icon">
                              <i className="ti ti-calendar" />
                            </span>

                            <DateRangePicker initialSettings={initialSettings}>
                              <input
                                className="form-control bookingrange"
                                type="text"
                              />
                            </DateRangePicker>
                          </div>
                        </li> */}
                      </ul>
                    </div>
                    <div className="filter-list">
                      <ul>
                        {/* <li>
                          <div className="manage-dropdwon">
                            <Link
                              to="#"
                              className="btn btn-purple-light"
                              data-bs-toggle="dropdown"
                              data-bs-auto-close="false"
                            >
                              <i className="ti ti-columns-3" />
                              Manage Columns
                            </Link>
                            <div className="dropdown-menu  dropdown-menu-md-end">
                              <h4>Want to manage datatables?</h4>
                              <p>
                                Please drag and drop your column to reorder your
                                table and enable see option as you want.
                              </p>
                              <ul>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Name
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-name"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-name"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Phone
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-phone"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-phone"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Email
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-email"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-email"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Tags
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-tag"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-tag"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Location
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-loc"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-loc"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Rating
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-rate"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-rate"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Owner
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-owner"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-owner"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Contact
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-contact"
                                      className="check"
                                      defaultChecked
                                    />
                                    <label
                                      htmlFor="col-contact"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Status
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-status"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-status"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                                <li>
                                  <p>
                                    <i className="ti ti-grip-vertical" />
                                    Action
                                  </p>
                                  <div className="status-toggle">
                                    <input
                                      type="checkbox"
                                      id="col-action"
                                      className="check"
                                    />
                                    <label
                                      htmlFor="col-action"
                                      className="checktoggle"
                                    />
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li> */}
                        {/* <li>
                          <div className="form-sorts dropdown">
                            <Link
                              to="#"
                              data-bs-toggle="dropdown"
                              data-bs-auto-close="false"
                            >
                              <i className="ti ti-filter-share" />
                              Filter
                            </Link>
                            <div className="filter-dropdown-menu dropdown-menu  dropdown-menu-md-end">
                              <div className="filter-set-view">
                                <div className="filter-set-head">
                                  <h4>
                                    <i className="ti ti-filter-share" />
                                    Filter
                                  </h4>
                                </div>

                                <div
                                  className="accordion"
                                  id="accordionExample"
                                >
                                  <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                      <Link
                                        to="#"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseTwo"
                                        aria-expanded="true"
                                        aria-controls="collapseTwo"
                                      >
                                        Country
                                      </Link>
                                    </div>
                                    <div
                                      className="filter-set-contents accordion-collapse collapse show"
                                      id="collapseTwo"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="filter-content-list">
                                        <div className="form-wrap icon-form">
                                          <span className="form-icon">
                                            <i className="ti ti-search" />
                                          </span>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Country"
                                          />
                                        </div>
                                        <ul>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>India</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>USA</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>France</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>United Kingdom</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>UAE</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Italy</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Japan</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Germany</h5>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                      <Link
                                        to="#"
                                        className="collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#owner"
                                        aria-expanded="false"
                                        aria-controls="owner"
                                      >
                                        Owner
                                      </Link>
                                    </div>
                                    <div
                                      className="filter-set-contents accordion-collapse collapse"
                                      id="owner"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="filter-content-list">
                                        <div className="form-wrap icon-form">
                                          <span className="form-icon">
                                            <i className="ti ti-search" />
                                          </span>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Owner"
                                          />
                                        </div>
                                        <ul>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Hendry</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Guillory</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Jami</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Theresa</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Espinosa</h5>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                      <Link
                                        to="#"
                                        className="collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#Status"
                                        aria-expanded="false"
                                        aria-controls="Status"
                                      >
                                        Status
                                      </Link>
                                    </div>
                                    <div
                                      className="filter-set-contents accordion-collapse collapse"
                                      id="Status"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="filter-content-list">
                                        <ul>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Active</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Inactive</h5>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                      <Link
                                        to="#"
                                        className="collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseOne"
                                        aria-expanded="false"
                                        aria-controls="collapseOne"
                                      >
                                        Rating
                                      </Link>
                                    </div>
                                    <div
                                      className="filter-set-contents accordion-collapse collapse"
                                      id="collapseOne"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="filter-content-list">
                                        <ul>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="rating">
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <span>5.0</span>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="rating">
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star" />
                                              <span>4.0</span>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="rating">
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <span>3.0</span>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="rating">
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <span>2.0</span>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="rating">
                                              <i className="fa fa-star filled" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <i className="fa fa-star" />
                                              <span>1.0</span>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                      <Link
                                        to="#"
                                        className="collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseThree"
                                        aria-expanded="false"
                                        aria-controls="collapseThree"
                                      >
                                        Tags
                                      </Link>
                                    </div>
                                    <div
                                      className="filter-set-contents accordion-collapse collapse"
                                      id="collapseThree"
                                      data-bs-parent="#accordionExample"
                                    >
                                      <div className="filter-content-list">
                                        <ul>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input
                                                  type="checkbox"
                                                  defaultChecked
                                                />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Promotion</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Rated</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Rejected</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Collab</h5>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="filter-checks">
                                              <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                              </label>
                                            </div>
                                            <div className="collapse-inside-text">
                                              <h5>Calls</h5>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="filter-reset-btns">
                                  <div className="row">
                                    <div className="col-6">
                                      <Link to="#" className="btn btn-light">
                                        Reset
                                      </Link>
                                    </div>
                                    <div className="col-6">
                                      <Link
                                        to={route.customerList}
                                        className="btn btn-primary"
                                      >
                                        Filter
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li> */}
                        {/* <li>
                          <div className="view-icons">
                            <Link to={route.customerList} className="active">
                              <i className="ti ti-list-tree" />
                            </Link>
                            <Link to={route.customerGrid}>
                              <i className="ti ti-grid-dots" />
                            </Link>
                          </div>
                        </li> */}
                      </ul>
                    </div>
                  </div>
                  {/* /Filter */}
                  {/* Contact List */}
                  <div className="table-responsive custom-table">
                    <DataTable dataSource={data} columns={columns} />
                  </div>
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="datatable-length" />
                    </div>
                    <div className="col-md-6">
                      <div className="datatable-paginate" />
                    </div>
                  </div>
                  {/* /Contact List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* ----PRODUCT INVOICE---- */}
      <div
        className={
          activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout" style={{ maxWidth: "70%" }}>
          <div className="sidebar-header">
            <h4>Add New Invoice</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setActivityToggle(!activityToggle)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <div className="toggle-height">
              <form onSubmit={handleSubmit}>
                <div className="pro-create">
                  <div className="row">
                    {/* Customer and Project Select */}
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Invoice No</label>
                        <input
                          className="form-control"
                          type="text"
                          name="InvoiceNo"
                          // value={formData.customerAddressbill}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <Dropdown
                        label="Select Customer"
                        name="serviceId"
                        isMandatory
                        value={formData.serviceId}
                        onChange={handleInputChange}
                        options={serviceOpitons}
                      />
                    </div>
                    <div
                      className={`form-wrap ${
                        customerDetails?.customerId ? "pe-none" : ""
                      } col-md-6`}
                    >
                      <label className="col-form-label">Select Project</label>
                      <Select
                        className="select"
                        placeholder="Select..."
                        classNamePrefix="react-select"
                        required
                        value={customerOptions.find(
                          (opt) => opt.value === formData.customerId
                        )}
                        onChange={(event) => {
                          handleInputChange({
                            target: { name: "customerId", value: event.value },
                          });
                          setSelectedCustomer(event.data);
                        }}
                        options={customerOptions}
                      />
                    </div>

                    {/* Address */}
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Date of Invoice<span className="text-danger"> *</span>
                        </label>
                        <div className="form-wrap icon-form">
                          <span className="form-icon">
                            <i className="ti ti-calendar" />
                          </span>
                          <DatePicker
                            selected={formData.InvoiceDate}
                            onChange={handleInvoiceDateChange}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select date"
                            // minDate={new Date()}
                            showPopperArrow={false}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Due Date<span className="text-danger"> *</span>
                        </label>
                        <div className="form-wrap icon-form">
                          <span className="form-icon">
                            <i className="ti ti-calendar" />
                          </span>
                          <DatePicker
                            selected={formData.dueDate}
                            onChange={handleDateChange}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select date"
                            // minDate={new Date()}
                            showPopperArrow={false}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Bill To</label>
                        <input
                          className="form-control"
                          type="text"
                          name="customerAddressbill"
                          value={formData.customerAddressbill}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Ship To</label>
                        <input
                          className="form-control"
                          type="text"
                          name="customerAddressship"
                          value={formData.customerAddressship}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Item Table */}

                    <div className="table-responsive">
                      <table
                        className="table table-view"
                        // style={{ width: "81%" }}
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "40px" }}>Sr.No</th>
                            <th>Product</th>
                            <th>Brand</th>
                            <th>Rate</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.Item.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div className="input-table">
                                  <input
                                    style={{
                                      width: "35px",
                                      textAlign: "right",
                                    }}
                                    type="number"
                                    value={item.itemNo}
                                    disabled
                                    // onChange={(e) =>
                                    //   handleInputChange1(
                                    //     index,
                                    //     e.target.value,
                                    //     "itemNo"
                                    //   )
                                    // }
                                  />
                                </div>
                              </td>
                              <td style={{ width: "400px" }}>
                                <div className="input-table input-table-description">
                                  <input
                                    style={{ width: "100%" }}
                                    type="text"
                                    value={item.product}
                                    onChange={(e) =>
                                      handleInputChange1(
                                        index,
                                        e.target.value,
                                        "product"
                                      )
                                    }
                                  />
                                  {/* <Select
                                    className="select"
                                    classNamePrefix="react-select"
                                    placeholder="Select Product"
                                    value={productOptions.find(
                                      (opt) => opt.value === item.product
                                    )}
                                    onChange={(selectedOption) =>
                                      handleInputChange1(
                                        index,
                                        selectedOption.value,
                                        "product"
                                      )
                                    }
                                    options={productOptions}
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  /> */}
                                </div>
                              </td>
                              <td style={{ width: "400px" }}>
                                <div className="input-table input-table-description">
                                  <input
                                    style={{ width: "100%" }}
                                    type="text"
                                    value={item.brand}
                                    onChange={(e) =>
                                      handleInputChange1(
                                        index,
                                        e.target.value,
                                        "brand"
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td style={{ width: "90px" }}>
                                <div className="input-table">
                                  <input
                                    style={{ textAlign: "right" }}
                                    type="number"
                                    value={item.rate}
                                    onChange={(e) =>
                                      handleInputChange1(
                                        index,
                                        e.target.value,
                                        "rate"
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td style={{ width: "90px" }}>
                                <div className="input-table">
                                  <input
                                    style={{ textAlign: "right" }}
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleInputChange1(
                                        index,
                                        e.target.value,
                                        "quantity"
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td style={{ width: "140px" }}>
                                <div className="input-table">
                                  <input
                                    style={{
                                      width: "100%",
                                      textAlign: "right",
                                    }}
                                    type="number"
                                    disabled
                                    value={item.total || 0}
                                  />
                                </div>
                              </td>
                              <td style={{ width: "70px" }}>
                                <div className="d-flex gap-2">
                                  {index === 0 && (
                                    <Link
                                      to="#"
                                      className="btn btn-success-light"
                                      onClick={handleAddItem}
                                    >
                                      <i className="ti ti-plus" />
                                    </Link>
                                  )}
                                  {index !== 0 && (
                                    <Link
                                      to="#"
                                      className="btn btn-danger-light"
                                      onClick={() => handleRemoveItem(index)}
                                    >
                                      <i className="ti ti-minus" />
                                    </Link>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="subtotal-div mb-3">
                      <ul className="mb-3">
                        <li>
                          <h5>Total Cost : </h5>
                          <h6>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              disabled
                              className="form-control"
                              value={formData.subTotal}
                            />
                          </h6>
                        </li>
                        <li
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <h5 style={{ margin: 0, whiteSpace: "nowrap" }}>
                              Discount (%)
                            </h5>
                            <input
                              type="number"
                              className="form-control"
                              name="discount"
                              value={formData.discount}
                              onChange={handleInputChange}
                              style={{ width: "50px" }}
                            />{" "}
                            :
                          </div>
                          <div>
                            <input
                              style={{ textAlign: "right" }}
                              disabled
                              type="number"
                              className="form-control"
                              value={formData.discountAmout}
                            />
                          </div>
                        </li>
                        <li>
                          <h5>Payable Amount :</h5>
                          <h6>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              disabled
                              className="form-control"
                              value={formData.subTotal - formData.discountAmout}
                            />
                          </h6>
                        </li>

                        <li
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <h5 style={{ margin: 0, whiteSpace: "nowrap" }}>
                              GST & Taxes (%)
                            </h5>
                            {/* <input
                              type="number"
                              className="form-control"
                              name="taxRate"
                              value={formData.taxRate}
                              onChange={handleInputChange}
                              style={{ width: "50px" }}
                            />{" "} */}
                            <select
                              className="form-control"
                              name="taxRate"
                              value={formData.taxRate}
                              onChange={handleInputChange}
                              style={{ width: "50px" }}
                            >
                              <option value="">&#9660;</option>
                              <option value="5">5</option>
                              <option value="12">12</option>
                              <option value="18">18</option>
                              <option value="28">28</option>
                            </select>
                            :
                          </div>
                          <div>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              disabled
                              className="form-control"
                              value={formData.taxAmount}
                            />
                          </div>
                        </li>
                        <li>
                          <h5>Final Payment :</h5>
                          <h6>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              disabled
                              className="form-control"
                              value={formData.total}
                            />
                          </h6>
                        </li>
                        <li>
                          <h5>Shipping & Packaging :</h5>
                          <h6>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              className="form-control"
                              name="shipping"
                              value={formData.shipping || ""}
                              onChange={handleInputChange}
                            />
                          </h6>
                        </li>
                        <li>
                          <h5>Receivable Amount :</h5>
                          <h6>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              disabled
                              className="form-control"
                              value={
                                formData.total +
                                (parseFloat(formData.shipping) || 0)
                              }
                            />
                          </h6>
                        </li>
                      </ul>
                    </div>
                    <div className="form-wrap" style={{ width: "81.5%" }}>
                      <label className="col-form-label">Note</label>
                      <textarea
                        className="form-control"
                        rows={5}
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="submit-button text-end">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Save & Send
                  </Link>
                  <Link to="#" className="btn btn-primary">
                    Preview
                  </Link>
                  <Link to="#" className="btn btn-light sidebar-close">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* ----PRODUCT INVOICE---- */}
      {/* ----SERVICE INVOICE---- */}
      <div
        className={
          activityToggleThree ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout" style={{ maxWidth: "70%" }}>
          <div className="sidebar-header">
            <h4>Add New Invoice</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setActivityToggleThree(!activityToggleThree)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <div className="toggle-height">
              <form onSubmit={handleSubmit2}>
                <div className="pro-create">
                  <div className="row">
                    {/* Customer and Project Select */}
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Invoice No</label>
                        <input
                          className="form-control"
                          type="text"
                          name="InvoiceNo2"
                          // value={formData.customerAddressbill}
                          onChange={handleInputChange2}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <Dropdown
                        label="Select Customer"
                        name="selectCustomer"
                        isMandatory
                        value={formData2.serviceId}
                        onChange={handleInputChange2}
                        options={serviceOpitons2}
                      />
                    </div>
                    <div
                      className={`form-wrap ${
                        customerDetails?.customerId ? "pe-none" : ""
                      } col-md-6`}
                    >
                      <label className="col-form-label">Select Project</label>
                      <Select
                        className="select"
                        placeholder="Select..."
                        classNamePrefix="react-select"
                        value={customerOptions2.find(
                          (opt) => opt.value === formData2.customerId
                        )}
                        onChange={(event) => {
                          handleInputChange2({
                            target: { name: "customerId", value: event.value },
                          });
                          setSelectedCustomer2(event.data);
                        }}
                        options={customerOptions2}
                      />
                    </div>

                    {/* Address */}
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Date of Invoice<span className="text-danger"> *</span>
                        </label>
                        <div className="form-wrap icon-form">
                          <span className="form-icon">
                            <i className="ti ti-calendar" />
                          </span>
                          <DatePicker
                            selected={formData2.dueDate2}
                            onChange={handleDateChange2}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select date"
                            // minDate={new Date()}
                            showPopperArrow={false}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Due Date<span className="text-danger"> *</span>
                        </label>
                        <div className="form-wrap icon-form">
                          <span className="form-icon">
                            <i className="ti ti-calendar" />
                          </span>
                          <DatePicker
                            selected={formData2.invoiceDate2}
                            onChange={handleInvoiceDateChange2}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Select date"
                            // minDate={new Date()}
                            showPopperArrow={false}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Bill To</label>
                        <input
                          className="form-control"
                          type="text"
                          name="billTo"
                          value={formData2.billTo}
                          onChange={handleInputChange2}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">Ship To</label>
                        <input
                          className="form-control"
                          type="text"
                          name="shipTo"
                          value={formData2.shipTo}
                          onChange={handleInputChange2}
                        />
                      </div>
                    </div>

                    {/* Item Table */}

                    <div className="table-responsive">
                      <table
                        className="table table-view"
                        // style={{ width: "81%" }}
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "40px" }}>Sr.No</th>
                            <th>Service</th>
                            <th>Tenure</th>
                            <th>Rate</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData2.Item.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <div className="input-table">
                                  <input
                                    style={{
                                      width: "35px",
                                      textAlign: "right",
                                    }}
                                    type="number"
                                    value={item.itemNo2}
                                    disabled
                                  />
                                </div>
                              </td>
                              <td style={{ width: "400px" }}>
                                <div className="input-table input-table-description">
                                  <input
                                    style={{ width: "100%" }}
                                    type="text"
                                    value={item.service}
                                    onChange={(e) =>
                                      handleInputChange3(
                                        index,
                                        e.target.value,
                                        "service"
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td style={{ width: "250px" }}>
                                <div className="input-table input-table-description">
                                  {/* <input
                                    style={{ width: "100%" }}
                                    type="text"
                                    value={item.brand}
                                    onChange={(e) =>
                                      handleInputChange1(
                                        index,
                                        e.target.value,
                                        "brand"
                                      )
                                    }
                                  /> */}

                                  <Select
                                    options={tenure}
                                    placeholder="Select Tenure"
                                    value={tenure.find(
                                      (opt) => opt.value === item.brand
                                    )}
                                    onChange={(selectedOption) =>
                                      handleInputChange3(
                                        index,
                                        selectedOption.value,
                                        "tenure"
                                      )
                                    }
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  />
                                </div>
                              </td>
                              <td style={{ width: "90px" }}>
                                <div className="input-table">
                                  <input
                                    style={{ textAlign: "right" }}
                                    type="number"
                                    value={item.rate2}
                                    onChange={(e) =>
                                      handleInputChange3(
                                        index,
                                        e.target.value,
                                        "rate2"
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td style={{ width: "90px" }}>
                                <div className="input-table">
                                  <input
                                    style={{ textAlign: "right" }}
                                    type="number"
                                    value={item.quantity2}
                                    onChange={(e) =>
                                      handleInputChange3(
                                        index,
                                        e.target.value,
                                        "quantity2"
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              <td style={{ width: "140px" }}>
                                <div className="input-table">
                                  <input
                                    style={{
                                      width: "100%",
                                      textAlign: "right",
                                    }}
                                    type="number"
                                    disabled
                                    value={item.total2 || 0}
                                  />
                                </div>
                              </td>
                              <td style={{ width: "70px" }}>
                                <div className="d-flex gap-2">
                                  {index === 0 && (
                                    <Link
                                      to="#"
                                      className="btn btn-success-light"
                                      onClick={handleAddItem2}
                                    >
                                      <i className="ti ti-plus" />
                                    </Link>
                                  )}
                                  {index !== 0 && (
                                    <Link
                                      to="#"
                                      className="btn btn-danger-light"
                                      onClick={() => handleRemoveItem2(index)}
                                    >
                                      <i className="ti ti-minus" />
                                    </Link>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="subtotal-div mb-3">
                      <ul className="mb-3">
                        <li>
                          <h5>Total Cost : </h5>
                          <h6>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              disabled
                              className="form-control"
                              value={formData2.subTotal2}
                            />
                          </h6>
                        </li>
                        <li
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <h5 style={{ margin: 0, whiteSpace: "nowrap" }}>
                              Discount (%)
                            </h5>
                            <input
                              type="number"
                              className="form-control"
                              name="discount2"
                              value={formData2.discount2}
                              onChange={handleInputChange2}
                              style={{ width: "50px" }}
                            />{" "}
                            :
                          </div>
                          <div>
                            <input
                              style={{ textAlign: "right" }}
                              disabled
                              type="number"
                              className="form-control"
                              value={formData2.discountAmout2}
                            />
                          </div>
                        </li>
                        <li>
                          <h5>Payable Amount :</h5>
                          <h6>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              disabled
                              className="form-control"
                              value={
                                formData2.subTotal2 - formData2.discountAmout2
                              }
                            />
                          </h6>
                        </li>

                        <li
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <h5 style={{ margin: 0, whiteSpace: "nowrap" }}>
                              GST & Taxes (%)
                            </h5>
                            {/* <input
                              type="number"
                              className="form-control"
                              name="taxRate"
                              value={formData.taxRate}
                              onChange={handleInputChange}
                              style={{ width: "50px" }}
                            />{" "} */}
                            <select
                              className="form-control"
                              name="taxRate2"
                              value={formData2.taxRate2}
                              onChange={handleInputChange2}
                              style={{ width: "50px" }}
                            >
                              <option value="">&#9660;</option>
                              <option value="5">5</option>
                              <option value="12">12</option>
                              <option value="18">18</option>
                              <option value="28">28</option>
                            </select>
                            :
                          </div>
                          <div>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              disabled
                              className="form-control"
                              value={formData2.taxAmount2}
                            />
                          </div>
                        </li>
                        <li>
                          <h5>Final Payment :</h5>
                          <h6>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              disabled
                              className="form-control"
                              value={formData2.total2}
                            />
                          </h6>
                        </li>
                        <li>
                          <h5>Handling Charges :</h5>
                          <h6>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              className="form-control"
                              name="handlingcharges"
                              value={formData2.handlingcharges || ""}
                              onChange={handleInputChange2}
                            />
                          </h6>
                        </li>
                        <li>
                          <h5>Receivable Amount :</h5>
                          <h6>
                            <input
                              style={{ textAlign: "right" }}
                              type="number"
                              disabled
                              className="form-control"
                              value={
                                formData2.total2 +
                                (parseFloat(formData2.handlingcharges) || 0)
                              }
                            />
                          </h6>
                        </li>
                      </ul>
                    </div>
                    <div className="form-wrap" style={{ width: "81.5%" }}>
                      <label className="col-form-label">Note</label>
                      <textarea
                        className="form-control"
                        rows={5}
                        name="notes2"
                        value={formData2.notes2}
                        onChange={handleInputChange2}
                      />
                    </div>
                  </div>
                </div>
                <div className="submit-button text-end">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Save & Send
                  </Link>
                  <Link to="#" className="btn btn-primary">
                    Preview
                  </Link>
                  <Link to="#" className="btn btn-light sidebar-close">
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* ----SERVICE INVOICE---- */}
      {/* Edit Contact */}
      <div
        className={
          activityToggleTwo ? "toggle-popup1 sidebar-popup" : "toggle-popup1"
        }
      >
        <div className="sidebar-layout">
          <div className="sidebar-header">
            <h4>Edit Contact</h4>
            <Link
              to="#"
              className="sidebar-close1 toggle-btn"
              onClick={() => setActivityToggleTwo(!activityToggleTwo)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <div className="pro-create">
              <form>
                <div className="accordion-lists" id="list-accords">
                  {/* Basic Info */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap"
                      data-bs-toggle="collapse"
                      data-bs-target="#edit-basic"
                    >
                      <span>
                        <i className="ti ti-user-plus" />
                      </span>
                      Basic Info
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="edit-basic"
                      data-bs-parent="#list-accords"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-wrap">
                              <div className="profile-upload">
                                <div className="profile-upload-img">
                                  <span>
                                    <i className="ti ti-photo" />
                                  </span>
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-20.jpg"
                                    alt="img"
                                    className="preview1"
                                  />
                                  <button
                                    type="button"
                                    className="profile-remove"
                                  >
                                    <i className="ti ti-x" />
                                  </button>
                                </div>
                                <div className="profile-upload-content">
                                  <label className="profile-upload-btn">
                                    <i className="ti ti-file-broken" /> Upload
                                    File
                                    <input type="file" className="input-img" />
                                  </label>
                                  <p>JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="Darlee"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="Robertson"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Job Title <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="Facility Manager"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Company Name
                              </label>

                              <Select
                                className="select"
                                classNamePrefix="react-select"
                                options={companyName}
                                placeholder="NovaWave LLC"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-wrap">
                              <div className="d-flex justify-content-between align-items-center">
                                <label className="col-form-label">
                                  Email <span className="text-danger">*</span>
                                </label>
                                <div className="status-toggle small-toggle-btn d-flex align-items-center">
                                  <span className="me-2 label-text">
                                    Email Opt Out
                                  </span>
                                  <input
                                    type="checkbox"
                                    id="user2"
                                    className="check"
                                    defaultChecked
                                  />
                                  <label
                                    htmlFor="user2"
                                    className="checktoggle"
                                  />
                                </div>
                              </div>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="robertson@example.com"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Phone 1 <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={1234567890}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">Phone 2</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Fax <span className="text-danger">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <div className="d-flex align-items-center justify-content-between">
                                <label className="col-form-label">Deals</label>
                                <Link
                                  to="#"
                                  className="label-add add-popups"
                                  onClick={() =>
                                    dispatch(
                                      setAddTogglePopupTwo(!addTogglePopupTwo)
                                    )
                                  }
                                >
                                  <i className="ti ti-square-rounded-plus" />
                                  Add New
                                </Link>
                              </div>

                              <Select
                                className="select"
                                classNamePrefix="react-select"
                                options={dealsopen}
                                placeholder="NovaWave LLC"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Date of Birth
                              </label>
                              <div className="icon-form-end">
                                <span className="form-icon">
                                  <i className="ti ti-calendar-event" />
                                </span>
                                <DatePicker
                                  className="form-control datetimepicker deals-details"
                                  selected={selectedDate}
                                  onChange={handleDateChange}
                                  dateFormat="dd-MM-yyyy"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">Reviews </label>
                              <div className="icon-form-end">
                                <span className="form-icon">
                                  <i className="ti ti-star" />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="4.2"
                                  defaultValue="4.2"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">Owner</label>
                              {/* <SelectWithImage /> */}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">Tags </label>

                              <TagsInput
                                // className="input-tags form-control"
                                value={owner}
                                onChange={setOwner}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Source <span className="text-danger">*</span>
                              </label>

                              <Select
                                className="select"
                                classNamePrefix="react-select"
                                options={activities}
                                placeholder="Phone Calls"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Industry <span className="text-danger">*</span>
                              </label>

                              <Select
                                className="select"
                                classNamePrefix="react-select"
                                options={industries}
                                placeholder="Banking"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Currency <span className="text-danger">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Language <span className="text-danger">*</span>
                              </label>

                              <Select
                                className="select"
                                classNamePrefix="react-select"
                                options={languages}
                                placeholder="English"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-wrap mb-0">
                              <label className="col-form-label">
                                Description{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <textarea
                                className="form-control"
                                rows={5}
                                defaultValue={""}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Basic Info */}
                  {/* Address Info */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#edit-address"
                    >
                      <span>
                        <i className="ti ti-map-pin-cog" />
                      </span>
                      Address Info
                    </Link>
                    <div
                      className="accordion-collapse collapse"
                      id="edit-address"
                      data-bs-parent="#list-accords"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Street Address{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="22, Ave Street"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">City </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="Denver"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                State / Province{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue="Colorado"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap mb-wrap">
                              <label className="col-form-label">Country</label>

                              <Select
                                className="select"
                                classNamePrefix="react-select"
                                options={countries}
                                placeholder="USA"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap mb-0">
                              <label className="col-form-label">Zipcode </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Address Info */}
                  {/* Social Profile */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#edit-social"
                    >
                      <span>
                        <i className="ti ti-social" />
                      </span>
                      Social Profile
                    </Link>
                    <div
                      className="accordion-collapse collapse"
                      id="edit-social"
                      data-bs-parent="#list-accords"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">Facebook</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">Skype </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Linkedin{" "}
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">Twitter</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap mb-wrap">
                              <label className="col-form-label">Whatsapp</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={1234567890}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap mb-0">
                              <label className="col-form-label">
                                Instagram
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Social Profile */}
                  {/* Access */}
                  <div className="user-accordion-item">
                    <Link
                      to="#"
                      className="accordion-wrap collapsed"
                      data-bs-toggle="collapse"
                      data-bs-target="#edit-access"
                    >
                      <span>
                        <i className="ti ti-accessible" />
                      </span>
                      Access
                    </Link>
                    <div
                      className="accordion-collapse collapse"
                      id="edit-access"
                      data-bs-parent="#list-accords"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="radio-wrap form-wrap">
                              <label className="col-form-label">
                                Visibility
                              </label>
                              <div className="d-flex flex-wrap">
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="edit-public"
                                    name="visible"
                                  />
                                  <label htmlFor="edit-public">Public</label>
                                </div>
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="edit-private"
                                    name="visible"
                                  />
                                  <label htmlFor="edit-private">Private</label>
                                </div>
                                <div
                                  className="radio-btn"
                                  data-bs-toggle="modal"
                                  data-bs-target="#access_view"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="edit-people"
                                    name="visible"
                                  />
                                  <label htmlFor="edit-people">
                                    Select People
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="radio-wrap">
                              <label className="col-form-label">Status</label>
                              <div className="d-flex flex-wrap">
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="edit-active"
                                    name="status"
                                    defaultChecked={true}
                                  />
                                  <label htmlFor="edit-active">Active</label>
                                </div>
                                <div className="radio-btn">
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="edit-inactive"
                                    name="status"
                                  />
                                  <label htmlFor="edit-inactive">
                                    Inactive
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Access */}
                </div>
                <div className="submit-button text-end">
                  <Link to="#" className="btn btn-light sidebar-close1">
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-primary">
                    Save Changes
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Contact */}
      {/* Add New Deals */}
      <div
        className={
          addTogglePopupTwo ? "toggle-popup2 sidebar-popup" : "toggle-popup2"
        }
      >
        <div className="sidebar-layout">
          <div className="sidebar-header">
            <h4>Add New Deals</h4>
            <Link
              to="#"
              className="sidebar-close2 toggle-btn"
              onClick={() => dispatch(setAddTogglePopupTwo(!addTogglePopupTwo))}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <form className="toggle-height">
              <div className="pro-create">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Deal Name <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <div className="d-flex align-items-center justify-content-between">
                        <label className="col-form-label">
                          Pipeine <span className="text-danger">*</span>
                        </label>
                      </div>
                      <Select
                        className="select2"
                        options={salestypelist}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select2"
                        options={status}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Deal Value<span className="text-danger"> *</span>
                      </label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Currency <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select2"
                        options={optionssymbol}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Period <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select2"
                        options={duration}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Period Value <span className="text-danger">*</span>
                      </label>
                      <input className="form-control" type="text" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Contact <span className="text-danger">*</span>
                      </label>
                      {/* <SelectWithImage2 /> */}
                    </div>
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Project <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select2"
                        options={project}
                        defaultValue={tagInputValues}
                        isMulti
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Due Date <span className="text-danger">*</span>
                      </label>
                      <div className="icon-form">
                        <span className="form-icon">
                          <i className="ti ti-calendar-check" />
                        </span>
                        <DatePicker
                          className="form-control datetimepicker deals-details"
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Expected Closing Date{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div className="icon-form">
                        <span className="form-icon">
                          <i className="ti ti-calendar-check" />
                        </span>

                        <DatePicker
                          className="form-control datetimepicker deals-details"
                          selected={selectedDate1}
                          onChange={handleDateChange1}
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Assignee <span className="text-danger">*</span>
                      </label>
                      {/* <SelectWithImage2 /> */}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Follow Up Date <span className="text-danger">*</span>
                      </label>
                      <div className="icon-form">
                        <span className="form-icon">
                          <i className="ti ti-calendar-check" />
                        </span>
                        <DatePicker
                          className="form-control datetimepicker deals-details"
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="dd-MM-yyyy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Source <span className="text-danger">*</span>
                      </label>

                      <Select
                        className="select2"
                        options={socialMedia}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Tags <span className="text-danger">*</span>
                      </label>
                      <TagsInput
                        // className="input-tags form-control"
                        value={owner}
                        onChange={setOwner}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Priority <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select2"
                        options={priorityList}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Description <span className="text-danger">*</span>
                      </label>
                      <DefaultEditor className="summernote" />
                    </div>
                  </div>
                </div>
                <div className="submit-button text-end">
                  <Link to="#" className="btn btn-light sidebar-close2">
                    Cancel
                  </Link>
                  <Link to="#" className="btn btn-primary">
                    Create
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
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

export default CustomerList;
