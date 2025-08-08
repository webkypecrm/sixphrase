import React, { Fragment, useEffect, useState } from "react";
// import Select from "react-select";
import { Link } from "react-router-dom";
import DataTable from "../Table/DataTable";
import axios from "axios";
import { Flip, ToastContainer } from "react-toastify";
import { contactData } from "../../data/contactData";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
import { all_routes } from "../../pages/Router/all_routes.jsx";
import { employMonthly } from "../../data/employMonthly.jsx";
import { render } from "@testing-library/react";
import { Tooltip } from "antd";
import { useParams } from "react-router-dom";
import getApi from "../../utility/Hook.js";

const StaffDetails = () => {
  const [activityToggle, setActivityToggle] = useState(false);
  const [activityToggleTwo, setActivityToggleTwo] = useState(false);
  // const [activityTogglePopupTwo, setActivityTogglePopupTwo] = useState(false)
  const [addTogglePopupTwo, setAddTogglePopupTwo] = useState(false);
  const route = all_routes;

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
  // const handleStarToggle = (index) => {
  //   setStars((prevStars) => ({
  //     ...prevStars,
  //     [index]: !prevStars[index],
  //   }));
  // };
  const allData = employMonthly;
  // Api
  const { id } = useParams();
  const currentYear = new Date().getFullYear();
  const envURL = import.meta.env.VITE_API_URL;
  const URL1 = `${envURL}/staff/year/attendance-summary?staffId=${id}&year=${currentYear}`;
  const { data1, loading, error } = getApi(URL1);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to="#" className="table-avatar d-flex align-items-center">

            <Link to="#" className="avatar">
              <img src={data1?.profilePic} alt="UserImage" />
            </Link>


          <Link to="#" className="profile-split d-flex flex-column">
            {data1?.name}
            <span>id : {data1?.staffId}</span>
          </Link>
        </Link>
      ),
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      render: (text, record) => <span>{record?.year}</span>,
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      render: (text, record) => (
        <span><Link to={`${route.managebyday}/${record.year}/${record.month}/${id}`}>{record.month}</Link> <Link to={route.minicalender}><i className="ti ti-calendar-month" /></Link></span>
      ),
      // sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: <span style={{ color: "green", cursor: "pointer"}}>P ({data1?.totals?.present})</span>,
      dataIndex: "pdays",
      key: "pdays",
      align: "right",
      render: (text, record) => (
        <span style={{ color: "green",textAlign:"right",display:"block"}}>{record.present}</span>
      ),
      // sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      // title: "A (4)",
      title: <span style={{ color: "red", cursor: "pointer" }}>A ({data1?.totals?.absent})</span>,
      dataIndex: "adays",
      key: "adays",
      align: "right",
      render: (text, record) => (
        <span style={{ color: "red",textAlign:"right",display:"block" }}>{record.absent}</span>
      ),
    },
    {
      title: <span style={{ color: "#FFA500", cursor: "pointer" }}>L ({data1?.totals?.leave})</span>,
      dataIndex: "ldays",
      key: "ldays",
      align: "right",
      render: (text, record) => (
        <span style={{ color: "#FFA500",textAlign:"right",display:"block" }}>{record.leave}</span>
      ),
    },
    {
      title: (
        <span style={{ color: "green", cursor: "pointer" }}>On Time ({data1?.totals?.onTime})</span>
      ),
      dataIndex: "ontime",
      key: "ontime",
      align: "right",
      render: (text, record) => (
        <span style={{ color: "green",textAlign:"right",display:"block" }}>{record.onTime}</span>
      ),
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: (
        <span style={{ color: "blue", cursor: "pointer" }}>Late ({data1?.totals?.late})</span>
      ),
      dataIndex: "late",
      key: "late",
      align: "right",
      render: (text, record) => (
        <span style={{ color: "blue",textAlign:"right",display:"block" }}>{record.late}</span>
      ),
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: (
        <span style={{ color: "saddlebrown", cursor: "pointer" }}>
          Halfday ({data1?.totals?.halfDay})
        </span>
      ),
      dataIndex: "halfday",
      key: "halfday",
      align: "right",
      render: (text, record) => (
        <span style={{ color: "saddlebrown",textAlign:"right",display:"block" }}>{record.halfDay}</span>
      ),
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: (
        <span style={{ color: "Red", cursor: "pointer" }}>Warning (0)</span>
      ),
      dataIndex: "warning",
      key: "warning",
      align: "right",
      render: (text, record) => <span style={{ color: "red",textAlign:"right",display:"block" }}>0</span>,
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },
  ];

  // const fetchCustomerData = async (page) => {
  //   try {

  //     let url = `${apiUrl}/customer/customer-list`;

  //     const response = await axios.get(url,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${Token}`
  //         }
  //       });

  //     const formattedData = response.data.data.map((item) => ({
  //       ...item,
  //       key: item.taskId,
  //       tags: JSON.parse(item.tags)
  //     }));

  //     setData(formattedData);
  //     setIsLoading(false)
  //     a

  //   } catch (error) {
  //     setError(error)
  //     setIsLoading(false)

  //   }
  // };

  // useEffect(() => {

  //   fetchCustomerData()
  // }, [])
  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent("Hello!");
    const whatsappURL = `https://wa.me/${data1?.leadMobile1}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank"); // Opens in a new tab
  };
  return (
    <Fragment>
      <div>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                {/* Contact User */}

                <div className="contact-wrap">
                  <div className="contact-profile">
                    <div
                      className="avatar company-avatar"
                      data-bs-toggle="modal"
                      data-bs-target="#add-lead-image"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={data1?.profilePic}
                        alt="lead image"
                        style={{height:"100%",width:"100%"}}
                      />
                    </div>

                    <div className="name-user">
                      <h5>{data1?.name} </h5>
                      <p
                        style={{ marginBottom: "0px", cursor: "pointer" }}
                      >
                        <i className="ti ti ti-mail-check me-1" />
                        {data1?.email}
                      </p>
                      <Link
                        style={{ marginBottom: "0px" }}
                        onClick={openWhatsApp}
                      >
                        <i class="fa-brands fa-whatsapp"></i>
                        <span style={{ marginLeft: "5px" }}>{data1?.mobile}</span>
                      </Link>
                      <p style={{ marginBottom: "0px" }}>D.O.J : </p>
                      <p style={{ marginBottom: "0px" }}>
                        {data1?.department} / {data1?.role}
                      </p>
                    </div>
                  </div>

                  <div
                    className="contacts-action"
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <Link
                      to={route.attendanceLog}
                      className="btn btn add-popup"
                      style={{ border: "1px solid black" }}
                    >
                      <div className="table-avatar d-flex align-items-center">
                        <div className="users-group">
                          <ul>
                            <li>Back to Attendance</li>
                          </ul>
                        </div>
                      </div>
                    </Link>

                    <Link
                      to="#"
                      className="btn btn add-popup active"
                      style={{ border: "1px solid black" }}
                    >
                      <div className="table-avatar d-flex align-items-center">
                        <div className="users-group">
                          <ul>
                            <li>Year View</li>
                          </ul>
                        </div>
                      </div>
                    </Link>

                    <Link
                      // to={`${route.managebyday}/${data?.month}/${id}`}
                      to="#"
                      className="btn btn add-popup"
                      style={{ border: "1px solid black" }}
                    >
                      <div className="table-avatar d-flex align-items-center">
                        <div className="users-group">
                          <ul>
                            <li>Month View</li>
                          </ul>
                        </div>
                      </div>
                    </Link>




                  
                  </div>
                </div>
                {/* /Contact User */}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card main-card">
                  <div className="card-body">
                    {/* Contact List */}
                    <div className="table-responsive custom-table">
                      <DataTable
                        dataSource={data1?.summary}
                        columns={columns}
                        disableSelection={true}
                        pagination={false}
                      />
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
      </div>
    </Fragment>
  );
};

export default StaffDetails;
