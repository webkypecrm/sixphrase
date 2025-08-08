import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contactData } from "../../data/contactData";
import { all_routes } from "../../pages/Router/all_routes.jsx";
import { employDay } from "../../data/employDay.jsx";
import DataTable from "../Table/DataTable";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useParams } from "react-router-dom";
import getApi from "../../utility/Hook.js";
import Select from "react-select";
import axios from "axios";
// import { message } from "antd";
import { toast, ToastContainer } from "react-toastify";

const ManagebyDay = () => {
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

  const allData = employDay;
  // Api
  const { month, id, year } = useParams();
  const envURL = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();

  const URL1 = `${envURL}/staff/month/attendance-summary?year=${year}&month=${month}&staffId=${id}`;
  const URL2 = `${envURL}/staff/year/attendance-summary?staffId=${id}&year=${currentYear}`;

  // const { data1, data2, loading, error } = getApi(URL1, URL2);


  
  const { data1: monthsData, loading: isLoading, error: isError } = getApi(URL1);
  const { data1: yearData, loading: isLoading2, error: isError2 } = getApi(URL2);



  // const { data1: monthsData, loading: isLoading, error: isError } = getApi(URL1);
  // const { data1: yearData, loading: isLoading2, error: isError2 } =getApi(URL2);
  

  console.log("monthsData", monthsData);
  console.log("yearData", yearData);

  const months =
  yearData?.summary?.map((item) => ({
      value: item.month,
      label: item.month,
    })) || [];
  // const months =
  // data2?.summary?.map((item) => ({
  //     value: item.month,
  //     label: item.month,
  //   })) || [];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link to="#" className="table-avatar d-flex align-items-center">
          <Link to="#" className="avatar">
            <img src={monthsData?.staffProfilePic} alt="UserImage" />
          </Link>

          <Link to="#" className="profile-split d-flex flex-column">
            {monthsData?.staffName}
          </Link>
        </Link>
      ),
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },

    {
      title: "Year",
      dataIndex: "year",
      render: (text,render) => <span>{monthsData?.year}</span>,
      // render: (text, render) => (
      //   <span>{(attendanceData?.year || data1?.year) ?? "-"}</span>
      // ),
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      // render: (text, render) => <span>{data1?.monthName}</span>,
      render: (text,record) => <span style={{textTransform:"capitalize"}}>{(attendanceData?.monthName || monthsData?.monthName) ?? "-"}</span>,
      // sorter: (a, b) => a.email.length - b.email.length,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => <span>{record?.loginDate}</span>,
      // sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "Day",
      dataIndex: "status",
      key: "id",
      render: (text, record) => (
        <Link
        >
          {record?.day}
        </Link>
      ),
    },
    {
      title: "LogIn",
      dataIndex: "login",
      key: "login",
      render: (text, record) => <span>{record?.loginTime}</span>,
      // sorter: (a, b) => a.owner.length - b.owner.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        const customStyle =
          record?.status === "Present"
            ? {
                backgroundColor: "green",
                color: "white",
                padding: "5px",
                borderRadius: "4px",
              }
            : record?.status === "Absent"
            ? {
                backgroundColor: "red",
                color: "white",
                padding: "5px",
                borderRadius: "4px",
              }
            : {
                backgroundColor: "#FFA500",
                color: "white",
                padding: "5px",
                borderRadius: "4px",
              };

        return (
          <span className="badge" style={customStyle}>
            {record?.status}
          </span>
        );
      },
    },
    {
      title: "Flag",
      dataIndex: "flag",
      key: "flag",
      render: (text, record) => {
        const customStyle =
          record?.timeFlag === "On Time"
            ? {
                backgroundColor: "green",
                color: "white",
                padding: "5px",
                borderRadius: "4px",
              }
            : record?.timeFlag === "Late"
            ? {
                backgroundColor: "blue",
                color: "white",
                padding: "5px",
                borderRadius: "4px",
              }
            : record?.timeFlag === "Absent"
            ? {
                backgroundColor: "red",
                color: "white",
                padding: "5px",
                borderRadius: "4px",
              }
            : {
                backgroundColor: "saddlebrown",
                color: "white",
                padding: "5px",
                borderRadius: "4px",
              };

        return (
          <span className="badge" style={customStyle}>
            {record?.timeFlag}
          </span>
        );
      },
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
      render: (text, record) => {
        return (
          <span className="badge bg-outline-dark text-dark p-1.5">
            {record?.ipAddress}
          </span>
        );
      },
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "From",
      dataIndex: "wfh",
      key: "wfh",
      render: (text, record) => {
        const badgeClass =
          record?.workplace === "WFO"
            ? "badge bg-success text-light"
            : "badge bg-primary text-light";

        return (
          <Link>
            <span className={badgeClass}>{record?.workplace}</span>
          </Link>
        );
      },
      // sorter: (a, b) =>
      //     a.status - b.status,
    },
  ];
  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent("Hello!");
    const whatsappURL = `https://wa.me/${monthsData?.leadMobile1}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  // Month Change Data
  const [attendanceData, setAttendanceData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [error1, setError1] = useState(null);
  const Token = localStorage.getItem("token") || "";

  const handleMonthChange = (value) => {
    setSelectedMonth(value.value);
  };
  <ToastContainer position="top-right" autoClose={3000} hideProgressBar />;
  const handleMonthViewClick = async () => {
    if (!selectedMonth) {
      // message.info("Please select a month!");
      toast.error("Please select a month!");
      return;
    }
 // Dynamically calculate the year
 const selectedMonthIndex = new Date(`${selectedMonth} 1, ${year}`).getMonth(); // 0-based
 const dynamicYear = selectedMonthIndex === 0 ? Number(year) + 1 : Number(year);

    setLoading1(true);
    try {
      const URL = `${envURL}/staff/month/attendance-summary?year=${dynamicYear}&month=${selectedMonth}&staffId=${id}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      if (response?.data?.data) {
        setAttendanceData({ ...response.data.data });
      } else {
        setAttendanceData(null);
        alert("No data found for selected month.");
      }
    } catch (err) {
      console.error("Axios error:", err);
      setError1(err);
    } finally {
      setLoading1(false);
    }
  };
  return (
    <Fragment>
      <div>
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                <div
                  className="contact-wrap"
                  style={{ padding: "24px 18px 14px" }}
                >
                  <div className="contact-profile">
                    <div
                      className="avatar company-avatar"
                      data-bs-toggle="modal"
                      data-bs-target="#add-lead-image"
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={monthsData?.staffProfilePic}
                        alt="lead image"
                        style={{ height: "100%", width: "100%" }}
                      />
                    </div>

                    <div className="name-user">
                      <h5>{monthsData?.staffName} </h5>
                      <p style={{ marginBottom: "0px", cursor: "pointer" }}>
                        <i className="ti ti ti-mail-check me-1" />
                        {monthsData?.staffEmail}
                      </p>
                      <Link
                        style={{ marginBottom: "0px" }}
                        onClick={openWhatsApp}
                      >
                        <i class="fa-brands fa-whatsapp"></i>
                        <span style={{ marginLeft: "5px" }}>
                          {monthsData?.staffMobile}
                        </span>
                      </Link>
                      <p style={{ marginBottom: "0px" }}>D.O.J : </p>
                      <p style={{ marginBottom: "0px" }}>
                        {monthsData?.staffDepartment} / {monthsData?.staffRole}
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
                      to={`${route.staffmanage}/${monthsData?.staffId}`}
                      className="btn btn add-popup"
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
                      to="#"
                      className="btn btn add-popup active"
                      style={{ border: "1px solid black" }}
                      onClick={handleMonthViewClick}
                    >
                      {/* <div className="table-avatar d-flex align-items-center">
                        <div className="users-group">
                          <ul>
                            <li>Month View</li> */}
                      Month View
                      {/* </ul>
                        </div>
                      </div> */}
                    </Link>
                    <div
                      className="add-popup"
                      style={{
                        border: "1px solid black",
                        borderRadius: "5px",
                        marginBottom: "11px",
                        marginRight: "8px",
                      }}
                    >
                      <ul>
                        <li style={{ width: "167px" }}>
                          <div className=" icon-form">
                            <Select
                              name="assignedTo"
                              placeholder={"Select Month"}
                              // value={filterByObj?.assignedTo}
                              options={months}
                              onChange={handleMonthChange}
                            />
                          </div>
                        </li>
                      </ul>
                    </div>

                    <Link
                      to={route.minicalender}
                      className="btn btn add-popup"
                      style={{ border: "1px solid black" }}
                    >
                      <div className="table-avatar d-flex align-items-center">
                        <div className="users-group">
                          <ul>
                            <li>
                              <i className="ti ti-calendar-month" />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card main-card">
                  <div className="card-body">
                    <div className="table-responsive custom-table">
                      {/* {data &&  */}
                      <DataTable
                        dataSource={attendanceData?.days || monthsData?.days || []}
                        columns={columns}
                        // dataSource={data1?.days}
                        disableSelection={true}
                        pagination={false}
                      />
                      {/* // }  */}
                    </div>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="datatable-length" />
                      </div>
                      <div className="col-md-6">
                        <div className="datatable-paginate" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ManagebyDay;
