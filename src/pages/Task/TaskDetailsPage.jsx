import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import {
  ascendingandDecending,
  companyName,
  languageOptions,
  optionssymbol,
  priorityList,
  salestypelist,
  socialMedia,
  status,
  statusList,
} from "../../selectOption/selectOption";
import CountUp from "react-countup";
import DatePicker from "react-datepicker";
import Chart from "react-apexcharts";
import { TagsInput } from "react-tag-input-component";
import DefaultEditor from "react-simple-wysiwyg";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../Router/all_routes";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
// import { SelectWithImage } from "../../../core/common/selectWithImage";
import "react-datepicker/dist/react-datepicker.css";
import { Empty } from "antd";
import CreateCall from "../../components/Task/TaskDetails/CreateCall";
import CreateMeeting from "../../components/Task/TaskDetails/CreateMeeting";
import CreateComment from "../../components/Task/TaskDetails/CreateComment";
import AddCallComment from "../../components/Task/TaskDetails/AddCallComment";
import AddMeetingComment from "../../components/Task/TaskDetails/AddMeetingComment";
import RescheduleCall from "../../components/Task/TaskDetails/RescheduleCall";
import RescheduleMeeting from "../../components/Task/TaskDetails/RescheduleMeeting";
import TaskStatus from "../../components/Task/TaskStatus";
import AddTaskDocuments from "../../components/Task/TaskDetails/AddTaskDocuments";
import TaskTimer from "../../components/Task/TaskDetails/TaskTimer";
import AssignedTo from "../../components/Task/AssignedTo";

const TaskDetailsPage = () => {
  const params = useParams();
  const { taskId } = params;
  const route = all_routes;
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const [activityToggle, setActivityToggle] = useState(false);
  const [activityToggleTwo, setActivityToggleTwo] = useState(false);
  const [data, setData] = useState(null);
  const [taskLogData, setTaskLogData] = useState([]);
  const [groupActivityByDate, setGroupActivityByDate] = useState({});
  const [callData, setCallData] = useState([]);
  const [meetingData, setMeetingData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [taskLogId, setTaskLogId] = useState("");

  // console.log("callData =>", callData);
  // console.log("meetingData =>", meetingData);
  // console.log("taskLogData =>", taskLogData);
  // console.log('stageOptions =>', stageOptions)
  // console.log("commentData =>", commentData);

  function getDate(value) {
    const isoDateString = value;
    const date = new Date(isoDateString);
    // Format date into "DD MMM YYYY"
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  }

  function getTime(value) {
    const isoDateString = value;
    const date = new Date(isoDateString);

    // Get hours, minutes, and determine AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
  }

  const [owner, setOwner] = useState(["Collab"]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };
  const [selectedDate4, setSelectedDate4] = useState(new Date());
  const handleDateChange4 = (date) => {
    setSelectedDate4(date);
  };
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
  const countries = [
    { value: "Choose", label: "Choose" },
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "France", label: "France" },
    { value: "UAE", label: "UAE" },
  ];

  console.log("data =>", data);

  function handleRefresh() {
    fetchTaskLogData();
    fetchTaskDetails();
    // fetchStageData();
  }

  const getYouTubeVideoId = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const fetchTaskLogData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/task/task-log/${data?.taskId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      console.log('dataaaaa =>', response.data.data)
      setTaskLogData((prev) => [...response.data.data]);
      const groupedData = response.data.data.reduce((acc, item) => {
        // const date = item.createdAt.split("T")[0];
        const date = getDate(item.createdAt);
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});
      setGroupActivityByDate((prev) => ({ ...groupedData }));
      const callUpdates = response.data.data.filter(
        (item) => item.type == "callUpdate"
      );
      setCallData((prev) => [...callUpdates]);

      const meetingUpdate = response.data.data.filter(
        (item) => item.type == "meetingUpdate"
      );
      setMeetingData((prev) => [...meetingUpdate]);

      const commentUpdate = response.data.data.filter(
        (item) => item.type == "taskComment"
      );
      setCommentData((prev) => [...commentUpdate]);

      const fileUpdate = response.data.data.filter(
        (item) => item.type == "fileUpdate"
      );
      setFileData((prev) => [...fileUpdate]);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/task/task-details/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setData((prev) => ({
        ...response.data.data,
        tags: JSON.parse(response.data.data.tags),
      }));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (data?.taskId) {
      fetchTaskLogData();
      // fetchStageData()
    }
  }, [data?.leadId]);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetails();
    }
  }, [taskId]);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">Task Overview</h4>
                  </div>
                  <div className="col-sm-8 text-sm-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              {/* Contact User */}
              <div className="contact-head">
                <div className="row align-items-center">
                  <div className="col-sm-6">
                    <ul className="contact-breadcrumb">
                      <li>
                        <Link to={route.tasks}>
                          <i className="ti ti-arrow-narrow-left" />
                          Task
                        </Link>
                      </li>
                      <li>{data?.taskTitle.slice(0, 40)}</li>
                    </ul>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                      <p>1 of 40</p>
                      <ul>
                        <li>
                          <Link to={route.companyDetails}>
                            <i className="ti ti-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link to={route.companyDetails}>
                            <i className="ti ti-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-wrap">
                <div
                  className="col-md-2"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div className="card" style={{ boxShadow: "none" }}>
                    <div
                      className="card-header"
                      style={{
                        borderBottom: "none",
                        padding: "10px 10px",
                        paddingBottom: "0px",
                      }}
                    >
                      <span className="text-icon">
                        <img
                          src="https://media.lordicon.com/icons/wired/gradient/45-clock-time.gif"
                          style={{ maxWidth: "64%", margin: "1rem" }}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-md-1">
                  <div
                    className="card"
                    style={{
                      boxShadow: "none",
                      width: "8rem",
                      height: "auto",
                    }}
                  >
                    <div
                      className="card-body"
                      style={{
                        boxShadow: "none",
                        fontSize: "0.9rem",
                        padding: "5px",
                        color: "#d84b4b",
                        textAlign: "center",
                        marginLeft: "-41px",
                      }}
                    >
                      {data?.endDate && (
                        <TaskTimer
                          startDate={String(data?.startDate)}
                          endDate={String(data?.endDate)}
                        />
                      )}
                      <p style={{ margin: "0px", color: "green" }}>
                        IN PROCESS
                      </p>
                      <p className="badge badge-tag badge-danger-light">
                        {" "}
                        Priority: {data?.priority}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: "1px",
                    height: "200px",
                    backgroundColor: "#ddd",
                    margin: "0 20px",
                  }}
                ></div>

                <div
                  className="col-md-4"
                  style={{
                    position: "relative",
                    top: "-18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h5>{data?.taskTitle.slice(0, 40)}</h5>

                    <ul style={{ marginTop: "5px" }}>
                      <li>
                        {data?.taskCategoryName}{" "}
                        <i className="ti ti-arrow-narrow-right" />{" "}
                        {data?.taskSubCategoryName}
                      </li>
                      <li
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <i className="ti ti-calendar-month" />{" "}
                          {data?.startDate}
                        </span>
                        <i className="ti ti-arrow-narrow-right" />
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <i className="ti ti-calendar-month" /> {data?.endDate}
                        </span>
                      </li>
                      <li></li>
                    </ul>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      float: "right",
                      position: "relative",
                      right: "-20px",
                    }}
                  >
                    <Link
                      to={route.chat}
                      className="btn-icon"
                      aria-label="Chat"
                    >
                      <i className="ti ti-brand-hipchat" />
                    </Link>
                    <Link
                      to="#"
                      className="btn-icon edit-popup"
                      aria-label="Edit"
                      onClick={() => setActivityToggle(!activityToggle)}
                    >
                      <i className="ti ti-edit-circle" />
                    </Link>
                    <Link
                      to="#"
                      className="btn-icon rating"
                      aria-label="Rating"
                    >
                      <i className="fa-solid fa-star" />
                    </Link>
                    <div className="act-dropdown">
                      <Link
                        to="#"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ti ti-dots-vertical" />
                      </Link>
                      <div className="dropdown-menu dropdown-menu-right">
                        <Link
                          className="dropdown-item"
                          to="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_contact"
                        >
                          <i className="ti ti-trash text-danger" />
                          Delete
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: "1px",
                    height: "200px",
                    backgroundColor: "#ddd",
                    margin: "0 20px",
                  }}
                ></div>

                <div className="col-md-3" style={{ width: "23rem" }}>
                  <div className="contact-profile">
                    <div
                      className="avatar company-avatar"
                      data-bs-toggle="modal"
                      data-bs-target="#add-lead-image"
                      style={{ cursor: "pointer" }}
                    >
                      {/* {data?.leadPicUrl ? */}
                      <img
                        src="https://png.pngtree.com/png-vector/20240402/ourmid/pngtree-young-man-wearing-glasses-icon-png-image_12258730.png"
                        alt="lead image"
                      />
                      :
                      {/* <span className="text-icon">
                                                {data?.leadName[0]}{data?.lead?.leadName[data?.leadName?.length - 1]}
                                            </span>
                                        } */}
                    </div>

                    <div className="name-user">
                      <h5>
                        {data?.lead?.leadName} {"("}Id: {data?.lead?.leadId}
                        {")"}
                      </h5>
                      <p style={{ marginBottom: "0px" }}>
                        <i className="ti ti ti-mail-check me-1" />
                        {data?.lead?.leadEmail}
                      </p>
                      <p style={{ marginBottom: "0px" }}>
                        <i className="ti ti-phone me-1" />
                        {data?.lead?.leadMobile1}
                      </p>
                      <p style={{ marginBottom: "0px" }}>
                        <i className="ti ti-map-pin-pin me-1" />
                        {data?.lead?.country?.name}, {data?.lead?.state?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* /Contact User */}
            </div>
            {/* Contact Details */}
            <div className="col-xl-9">
              <div className="contact-tab-wrap">
                <ul className="contact-nav nav">
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#activities"
                      className="active"
                    >
                      <i className="ti ti-alarm-minus" />
                      Activities
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#task-calls"
                    >
                      <i className="ti ti-phone" />
                      Calls
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#task-meeting"
                    >
                      <i className="ti ti-notes" />
                      Meeting
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#task-comment"
                    >
                      <i className="ti ti-files" />
                      Comment
                    </Link>
                  </li>
                  {/* <li>
                                    <Link to="#" data-bs-toggle="tab" data-bs-target="#lead-proposal">
                                        <i className="ti ti-files" />
                                        Proposal
                                    </Link>
                                </li> */}
                  {/* <li>
                                        <Link to="#" data-bs-toggle="tab" data-bs-target="#lead-details-task">
                                            <i className="ti ti-files" />
                                            Task
                                        </Link>
                                    </li> */}
                  <li>
                    <Link
                      to="#"
                      data-bs-toggle="tab"
                      data-bs-target="#task-files"
                    >
                      <i className="ti ti-file" />
                      Files
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Tab Content */}
              <div className="contact-tab-view">
                <div className="tab-content pt-0">
                  {/* <LeadPreview /> */}

                  {/* Activities */}
                  <div className="tab-pane active show" id="activities">
                    <div className="view-header">
                      <h4>Activities</h4>
                      <ul>
                        <li>
                          <div className="form-sort">
                            <i className="ti ti-sort-ascending-2" />

                            <Select
                              className="select"
                              options={ascendingandDecending}
                              classNamePrefix="react-select"
                              placeholder="Ascending"
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="contact-activity">
                      {taskLogData.length == 0 && <Empty description={false} />}
                      {Object.keys(groupActivityByDate).map((date) => (
                        <div key={date}>
                          <div className="badge-day">
                            <i className="ti ti-calendar-check" />
                            {date}
                          </div>
                          <ul>
                            {groupActivityByDate[`${date}`].map((lead) => (
                              <li
                                className={
                                  lead.type == "fileUpdate" ||
                                  lead.type == "meetingUpdate" ||
                                  lead.type == "callUpdate"
                                    ? ""
                                    : "activity-wrap"
                                }
                                key={lead.taskLogId}
                                style={{ marginBottom: "1rem" }}
                              >
                                {lead.type == "callUpdate" && (
                                  <>
                                    <div className="calls-activity">
                                      <div className="calls-box">
                                        <div className="caller-info">
                                          <div className="calls-user">
                                            <img
                                              src={lead?.staff?.profilePicUrl}
                                              alt="img"
                                            />
                                            <div style={{ display: "grid" }}>
                                              {callData[0]?.taskLogId !==
                                                lead?.taskLogId &&
                                              lead?.status !== "Done" ? (
                                                <p>
                                                  <del style={{ color: "red" }}>
                                                    <span>
                                                      {lead?.staff?.name}
                                                    </span>{" "}
                                                    <strong>
                                                      {" "}
                                                      {lead?.status.toLowerCase()}{" "}
                                                    </strong>
                                                    a call on{" "}
                                                    {getDate(lead.callBackDate)}
                                                    ,{" "}
                                                    {getTime(lead.callBackTime)}{" "}
                                                  </del>
                                                </p>
                                              ) : (
                                                <p style={{ color: "green" }}>
                                                  <span>
                                                    {lead?.staff?.name}
                                                  </span>{" "}
                                                  <strong>
                                                    {" "}
                                                    {lead?.status.toLowerCase()}{" "}
                                                  </strong>
                                                  a call on{" "}
                                                  {getDate(lead.callBackDate)},{" "}
                                                  {getTime(lead.callBackTime)}
                                                </p>
                                              )}
                                              <span
                                                className="badge-day"
                                                style={{
                                                  fontSize: "x-small",
                                                  margin: "0",
                                                  maxWidth: "8rem",
                                                }}
                                              >
                                                {getDate(lead?.createdAt)},
                                                {getTime(lead?.createdAt)}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="calls-action">
                                            <div className="dropdown call-drop">
                                              {lead?.status == "Done" ? (
                                                <Link
                                                  to="#"
                                                  aria-expanded="false"
                                                >
                                                  <img
                                                    src="/assets/img/call-done.jpg"
                                                    alt="img"
                                                    style={{
                                                      width: "50px",
                                                      height: "50px",
                                                    }}
                                                  />
                                                </Link>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <p>
                                          {lead.lastCallSummary} <br />
                                        </p>
                                        {lead?.comment && (
                                          <div
                                            className="reply-box"
                                            style={{
                                              backgroundColor: "#F9F9FC",
                                              borderRadius: "5px",
                                              margin: "0 0 15px",
                                              padding: "15px",
                                            }}
                                          >
                                            <p>{lead?.comment}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                )}
                                {lead.type == "taskComment" && (
                                  <>
                                    <span className="activity-icon bg-pending">
                                      <i className="ti ti-mail-code" />
                                    </span>
                                    <div className="activity-info">
                                      <h6>
                                        {" "}
                                        Comment was posted by
                                        <span className="avatar-xs">
                                          <img
                                            src={lead?.staff?.profilePicUrl}
                                            alt="img"
                                          />
                                        </span>{" "}
                                        {lead?.staff?.name.split(" ")[0]}
                                      </h6>
                                      <p>{lead?.comment}</p>
                                      <p>{lead?.createdAtTime}</p>
                                    </div>
                                  </>
                                )}
                                {lead.type == "meetingUpdate" && (
                                  <>
                                    <div className="notes-activity">
                                      <div className="calls-box">
                                        <div className="caller-info">
                                          <div className="calls-user">
                                            <img
                                              src={lead?.staff?.profilePicUrl}
                                              alt="img"
                                            />
                                            <div style={{ display: "grid" }}>
                                              {meetingData[0]?.taskLogId !==
                                                lead?.taskLogId &&
                                              lead?.status !== "Done" ? (
                                                <del style={{ color: "red" }}>
                                                  <p>
                                                    <span>
                                                      {lead?.staff?.name}
                                                    </span>{" "}
                                                    <strong>
                                                      {lead?.status.toLowerCase()}
                                                    </strong>{" "}
                                                    a meeting on{" "}
                                                    {getDate(lead.meetingDate)},{" "}
                                                    {getTime(lead.meetingTime)}
                                                  </p>
                                                </del>
                                              ) : (
                                                <p style={{ color: "green" }}>
                                                  <span>
                                                    {lead?.staff?.name}
                                                  </span>{" "}
                                                  <strong>
                                                    {lead?.status.toLowerCase()}
                                                  </strong>{" "}
                                                  a meeting on{" "}
                                                  {getDate(lead.meetingDate)},{" "}
                                                  {getTime(lead.meetingTime)}
                                                </p>
                                              )}
                                              <span
                                                className="badge-day"
                                                style={{
                                                  fontSize: "x-small",
                                                  margin: "0",
                                                  maxWidth: "8rem",
                                                }}
                                              >
                                                {getDate(lead?.createdAt)},
                                                {getTime(lead?.createdAt)}
                                              </span>
                                            </div>
                                          </div>
                                          {/* {index === 0 && */}
                                          <div className="calls-action">
                                            <div className="dropdown call-drop">
                                              {lead?.status == "Done" ? (
                                                <Link
                                                  to="#"
                                                  aria-expanded="false"
                                                >
                                                  <img
                                                    src="/assets/img/meeting-done.jpg"
                                                    alt="img"
                                                    style={{
                                                      width: "38px",
                                                      height: "40px",
                                                    }}
                                                  />
                                                </Link>
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <p>{lead?.lastCallSummary}</p>
                                        <div className="upcoming-info">
                                          <div className="row">
                                            <div className="col-sm-4">
                                              <p>Meeting Type</p>
                                              <div className="dropdown">
                                                <Link
                                                  to="#"
                                                  className="dropdown-toggle"
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded="false"
                                                >
                                                  <i className="ti ti-clock-edit me-1" />
                                                  {lead?.meetingType.toUpperCase()}
                                                  <i className="ti ti-chevron-down ms-1" />
                                                </Link>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                  <Link
                                                    className="dropdown-item"
                                                    to="#"
                                                  >
                                                    offline
                                                  </Link>
                                                  <Link
                                                    className="dropdown-item"
                                                    to="#"
                                                  >
                                                    online
                                                  </Link>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="col-sm-4">
                                              <p>
                                                {lead?.meetingType === "offline"
                                                  ? "Address"
                                                  : "URL"}
                                              </p>

                                              <div className="dropdown">
                                                <Link
                                                  to={
                                                    lead?.meetingType ===
                                                    "offline"
                                                      ? "#"
                                                      : lead?.meetingVenue
                                                  }
                                                  className="dropdown-toggle"
                                                  aria-expanded="false"
                                                >
                                                  <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                                  {lead?.meetingVenue}
                                                </Link>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {lead?.comment && (
                                          <div className="reply-box">
                                            <p>{lead?.comment}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </>
                                )}
                                {lead.type == "statusUpdate" && (
                                  <>
                                    <span className="activity-icon bg-pink">
                                      <i className="ti ti-analyze" />
                                    </span>
                                    <div className="activity-info">
                                      <h6>
                                        Task status updated to{" "}
                                        {lead?.status.toLowerCase()}
                                      </h6>
                                      <p>{lead?.createdAtTime}</p>
                                    </div>
                                  </>
                                )}
                                {lead.type == "assignUpdate" && (
                                  <>
                                    <span className="activity-icon bg-tertiary">
                                      <i className="ti ti-timeline-event-exclamation" />
                                    </span>
                                    <div className="activity-info">
                                      <h6>
                                        Task has been successfully assigned to
                                        <span className="avatar-xs">
                                          <img
                                            src={lead?.assignedToImgUrl}
                                            alt="img"
                                          />
                                        </span>
                                        {lead?.assignedToName}
                                      </h6>
                                      <p>{lead?.createdAtTime}</p>
                                      {lead?.comment && (
                                        <div className="reply-box">
                                          <p>{lead?.comment}</p>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                                {lead.type == "fileUpdate" && (
                                  <>
                                    <div
                                      className="files-activity"
                                      style={{ width: "100%" }}
                                    >
                                      <div className="files-wrap">
                                        <div className="row align-items-center">
                                          <div className="col-md-8">
                                            <div className="file-info">
                                              <div className="file-user">
                                                <div
                                                  style={{ display: "flex" }}
                                                >
                                                  <img
                                                    src={
                                                      lead?.staff?.profilePicUrl
                                                    }
                                                    alt="img"
                                                  />
                                                </div>
                                                <div
                                                  style={{ display: "grid" }}
                                                >
                                                  <p>
                                                    {lead?.staff?.name} uploaded
                                                    file
                                                  </p>
                                                  <p
                                                    style={{
                                                      fontSize: "x-small",
                                                      margin: "0",
                                                      maxWidth: "8rem",
                                                    }}
                                                  >
                                                    {getDate(
                                                      lead?.taskDocument
                                                        ?.createdAt
                                                    )}
                                                    ,
                                                    {getTime(
                                                      lead?.taskDocument
                                                        ?.createdAt
                                                    )}
                                                  </p>
                                                </div>
                                              </div>
                                              <h4>
                                                {lead?.taskDocument?.fileName}
                                              </h4>
                                              <p>
                                                {lead?.taskDocument?.comment}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="col-md-4 text-md-end">
                                            <ul className="file-action">
                                              <li>
                                                <Link
                                                  className="badge badge-tag badge-danger-light"
                                                  to={
                                                    lead?.taskDocument
                                                      ?.attachmentUrl
                                                  }
                                                >
                                                  <span>
                                                    {
                                                      lead?.taskDocument
                                                        ?.fileType
                                                    }
                                                  </span>
                                                  <Link
                                                    className="badge badge-tag badge-danger-light"
                                                    to={
                                                      lead?.taskDocument
                                                        ?.attachmentUrl
                                                    }
                                                  >
                                                    {/* <span>{lead?.taskDocument?.fileType}</span> */}

                                                    {lead?.taskDocument
                                                      ?.fileType == "image" && (
                                                      <div className="note-download">
                                                        <div className="note-info">
                                                          <span className="note-icon">
                                                            <img
                                                              src={
                                                                lead
                                                                  ?.taskDocument
                                                                  ?.attachmentUrl
                                                              }
                                                              alt="Preview"
                                                              style={{
                                                                width: "300px",
                                                                height: "auto",
                                                              }}
                                                            />
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}
                                                    {lead?.taskDocument
                                                      ?.fileType == "jpg" && (
                                                      <div className="note-download">
                                                        <div className="note-info">
                                                          <span className="note-icon">
                                                            <img
                                                              src={
                                                                lead
                                                                  ?.taskDocument
                                                                  ?.attachmentUrl
                                                              }
                                                              alt="Preview"
                                                              style={{
                                                                width: "300px",
                                                                height: "auto",
                                                              }}
                                                            />
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}
                                                    {lead?.taskDocument
                                                      ?.fileType == "png" && (
                                                      <div className="note-download">
                                                        <div className="note-info">
                                                          <span className="note-icon">
                                                            <img
                                                              src={
                                                                lead
                                                                  ?.taskDocument
                                                                  ?.attachmentUrl
                                                              }
                                                              alt="Preview"
                                                              style={{
                                                                width: "300px",
                                                                height: "auto",
                                                              }}
                                                            />
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}

                                                    {lead?.taskDocument
                                                      ?.fileType == "pdf" && (
                                                      <div className="note-download">
                                                        <div className="note-info">
                                                          <span className="note-icon">
                                                            <img
                                                              src="/assets/img/pdf-icon.png"
                                                              alt="Preview"
                                                              style={{
                                                                width: "80px",
                                                                height: "80px",
                                                              }}
                                                            />
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}

                                                    {/* {lead?.taskDocument?.fileType === 'video' && lead?.taskDocument?.link && (
                                                                                                        <div className="note-download">
                                                                                                            <div className="note-info">
                                                                                                                <span className="note-icon">
                                                                                                                    <video width="100%" height="100px" controls>
                                                                                                                        <source src={lead?.taskDocument?.link} type="video/mp4" />
                                                                                                                        Your browser does not support the video tag.
                                                                                                                    </video>
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )} */}

                                                    {lead?.taskDocument
                                                      ?.fileType === "video" &&
                                                      lead?.taskDocument
                                                        ?.link && (
                                                        <div className="note-download">
                                                          <div className="note-info">
                                                            <span className="note-icon">
                                                              {lead?.taskDocument?.link.includes(
                                                                "youtube.com"
                                                              ) ||
                                                              lead?.taskDocument?.link.includes(
                                                                "youtu.be"
                                                              ) ? (
                                                                // YouTube video
                                                                <iframe
                                                                  width="100%"
                                                                  height="100px"
                                                                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                                                    lead
                                                                      .taskDocument
                                                                      .link
                                                                  )}`}
                                                                  title="YouTube video player"
                                                                  frameBorder="0"
                                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                  allowFullScreen
                                                                ></iframe>
                                                              ) : (
                                                                // Non-YouTube video
                                                                <video
                                                                  width="100%"
                                                                  height="100px"
                                                                  controls
                                                                >
                                                                  <source
                                                                    src={
                                                                      lead
                                                                        .taskDocument
                                                                        .link
                                                                    }
                                                                    type="video/mp4"
                                                                  />
                                                                  Your browser
                                                                  does not
                                                                  support the
                                                                  video tag.
                                                                </video>
                                                              )}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      )}

                                                    {lead?.taskDocument
                                                      ?.fileType === "zip" && (
                                                      <div className="note-download">
                                                        <div className="note-info">
                                                          <span className="note-icon">
                                                            <img
                                                              src="/assets/img/zip-icon.png"
                                                              alt="Preview"
                                                              style={{
                                                                width: "80px",
                                                                height: "80px",
                                                              }}
                                                            />
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}

                                                    {lead?.taskDocument
                                                      ?.fileType === "csv" && (
                                                      <div className="note-download">
                                                        <div className="note-info">
                                                          <span className="note-icon">
                                                            <img
                                                              src="/assets/img/excel-icon.png"
                                                              alt="Preview"
                                                              style={{
                                                                width: "80px",
                                                                height: "80px",
                                                              }}
                                                            />
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </Link>
                                                  <i className="ti ti-arrow-down" />
                                                </Link>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {lead.type == "newTask" && (
                                  <>
                                    {/* <span className="activity-icon bg-tertiary">
                                                                        <i className="ti ti-timeline-event-exclamation" />
                                                                    </span> */}
                                    <div className="activity-info">
                                      <h6>
                                        <span className="avatar-xs">
                                          <img
                                            src={lead?.staff?.profilePicUrl}
                                            alt="img"
                                          />
                                        </span>
                                        {lead?.staff?.name} created New Task and
                                        assigned to
                                        <span className="avatar-xs">
                                          <img
                                            src={lead?.assignedToImgUrl}
                                            alt="img"
                                          />
                                        </span>{" "}
                                        {lead?.assignedToName}
                                      </h6>
                                      <p>{lead?.createdAtTime}</p>
                                    </div>
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* /Activities */}
                  {/* Meeting */}
                  <div className="tab-pane fade" id="task-meeting">
                    <div className="view-header">
                      <h4>Meeting</h4>
                      <ul>
                        <li>
                          <div className="form-sort">
                            <i className="ti ti-sort-ascending-2" />
                            <Select
                              className="select"
                              options={ascendingandDecending}
                              classNamePrefix="react-select"
                              placeholder="Ascending"
                            />
                          </div>
                        </li>
                        {(meetingData[0]?.status == "Done" ||
                          meetingData[0]?.status == "" ||
                          meetingData.length === 0) && (
                          <li>
                            <Link
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#create_task_meeting"
                              className="com-add"
                            >
                              <i className="ti ti-circle-plus me-1" />
                              Add New
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="notes-activity">
                      {meetingData.length == 0 && <Empty description={false} />}
                      {meetingData.map((data, index) => (
                        <div className="calls-box" key={data?.taskLogId}>
                          <div className="caller-info">
                            <div className="calls-user">
                              <img src={data?.staff?.profilePicUrl} alt="img" />
                              <div style={{ display: "grid" }}>
                                {index > 0 ? (
                                  <del style={{ color: "red" }}>
                                    <p>
                                      <span>{data?.staff?.name}</span>{" "}
                                      <strong>
                                        {data?.status.toLowerCase()}
                                      </strong>{" "}
                                      a meeting on {getDate(data.meetingDate)},{" "}
                                      {getTime(data.meetingTime)}
                                    </p>
                                  </del>
                                ) : (
                                  <p style={{ color: "green" }}>
                                    <span>{data?.staff?.name}</span>{" "}
                                    <strong>
                                      {data?.status.toLowerCase()}
                                    </strong>{" "}
                                    a meeting on {getDate(data.meetingDate)},{" "}
                                    {getTime(data.meetingTime)}
                                  </p>
                                )}
                                <span
                                  className="badge-day"
                                  style={{
                                    fontSize: "x-small",
                                    margin: "0",
                                    maxWidth: "8rem",
                                  }}
                                >
                                  {getDate(data?.createdAt)},
                                  {getTime(data?.createdAt)}
                                </span>
                              </div>
                            </div>
                            {index === 0 && (
                              <div className="calls-action">
                                <div className="dropdown call-drop">
                                  {data?.status == "Done" ? (
                                    <Link
                                      to="#"
                                      // className="dropdown-toggle bg-success"
                                      aria-expanded="false"
                                    >
                                      {/* <i className="ti ti-square-check" /> */}
                                      <img
                                        src="/assets/img/meeting-done.jpg"
                                        alt="img"
                                        style={{
                                          width: "38px",
                                          height: "40px",
                                        }}
                                      />
                                    </Link>
                                  ) : (
                                    <OverlayTrigger
                                      placement="bottom"
                                      overlay={
                                        <Tooltip id="mark-meeting-tooltip">
                                          Mark Done
                                        </Tooltip>
                                      }
                                    >
                                      <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#create_task_meeting_comment"
                                        className="dropdown-toggle bg-pending"
                                        aria-expanded="false"
                                        onClick={() => {
                                          setTaskLogId(data?.taskLogId);
                                        }}
                                      >
                                        <i className="ti ti-square-check" />
                                        {/* Mark Done */}
                                      </Link>
                                    </OverlayTrigger>
                                  )}
                                </div>
                                {data?.status !== "Done" && (
                                  <div className="dropdown call-drop">
                                    {
                                      <OverlayTrigger
                                        placement="bottom"
                                        overlay={
                                          <Tooltip id="rescheduled-meeting-tooltip">
                                            Re-scheduled Meeting
                                          </Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          data-bs-toggle="modal"
                                          data-bs-target="#create_task_meeting_rescheduled"
                                          className="dropdown-toggle"
                                          aria-expanded="false"
                                          onClick={() => {
                                            setTaskLogId(data?.taskLogId);
                                          }}
                                        >
                                          <i className="ti ti-calendar-month" />
                                          {/* Re-scheduled */}
                                        </Link>
                                      </OverlayTrigger>
                                    }
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <p>{data?.lastCallSummary}</p>
                          <div className="upcoming-info">
                            <div className="row">
                              <div className="col-sm-4">
                                <p>Meeting Type</p>
                                <div className="dropdown">
                                  <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-clock-edit me-1" />
                                    {data?.meetingType.toUpperCase()}
                                    <i className="ti ti-chevron-down ms-1" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to="#">
                                      offline
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      online
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-4">
                                <p>
                                  {data?.meetingType === "offline"
                                    ? "Address"
                                    : "URL"}
                                </p>

                                <div className="dropdown">
                                  <Link
                                    to={
                                      data?.meetingType === "offline"
                                        ? "#"
                                        : data?.meetingVenue
                                    }
                                    className="dropdown-toggle"
                                    aria-expanded="false"
                                  >
                                    <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                    {data?.meetingVenue}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          {data?.comment && (
                            <div className="reply-box">
                              <p>{data?.comment}</p>
                            </div>
                          )}
                          {/* <div style={{ marginTop: '1rem' }}>
                                                    <AddMeetingComment followUpId={data.taskLogId} fetchtaskLogData={fetchtaskLogData} />
                                                </div> */}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* /Meeting */}
                  {/* Calls */}
                  <div className="tab-pane fade" id="task-calls">
                    <div className="view-header">
                      <h4>Calls</h4>
                      {(callData[0]?.status == "Done" ||
                        callData[0]?.status == "" ||
                        callData.length === 0) && (
                        <ul>
                          <li>
                            <Link
                              to="#"
                              data-bs-toggle="modal"
                              data-bs-target="#create_task_call"
                              className="com-add"
                            >
                              <i className="ti ti-circle-plus me-1" />
                              Add New
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                    <div className="calls-activity">
                      {callData.length == 0 && <Empty description={false} />}
                      {callData.map((data, index) => (
                        <div className="calls-box" key={data.taskLogId}>
                          <div className="caller-info">
                            <div className="calls-user">
                              <img src={data?.staff?.profilePicUrl} alt="img" />
                              <div style={{ display: "grid" }}>
                                {index > 0 ? (
                                  <p>
                                    <del style={{ color: "red" }}>
                                      <span>{data?.staff?.name}</span>{" "}
                                      <strong>
                                        {" "}
                                        {data?.status.toLowerCase()}{" "}
                                      </strong>
                                      a call on {getDate(data.callBackDate)},{" "}
                                      {getTime(data.callBackTime)}{" "}
                                    </del>
                                  </p>
                                ) : (
                                  <p style={{ color: "green" }}>
                                    <span>{data?.staff?.name}</span>{" "}
                                    <strong>
                                      {" "}
                                      {data?.status.toLowerCase()}{" "}
                                    </strong>
                                    a call on {getDate(data.callBackDate)},{" "}
                                    {getTime(data.callBackTime)}
                                  </p>
                                )}

                                <span
                                  className="badge-day"
                                  style={{
                                    fontSize: "x-small",
                                    margin: "0",
                                    maxWidth: "8rem",
                                  }}
                                >
                                  {getDate(data?.createdAt)},
                                  {getTime(data?.createdAt)}
                                </span>
                              </div>
                            </div>
                            {index === 0 && (
                              <div className="calls-action">
                                <div className="dropdown call-drop">
                                  {data?.status == "Done" ? (
                                    <Link
                                      to="#"
                                      // className="dropdown-toggle bg-success"
                                      aria-expanded="false"
                                    >
                                      {/* <i className="ti ti-square-check" /> */}
                                      <img
                                        src="/assets/img/call-done.jpg"
                                        alt="img"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                      />
                                    </Link>
                                  ) : (
                                    <OverlayTrigger
                                      placement="bottom"
                                      overlay={
                                        <Tooltip id="mark-done-tooltip ">
                                          Mark Done
                                        </Tooltip>
                                      }
                                    >
                                      <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#create_task_call_comment"
                                        className="dropdown-toggle bg-pending"
                                        aria-expanded="false"
                                        onClick={() => {
                                          setTaskLogId(data?.taskLogId);
                                        }}
                                      >
                                        <i className="ti ti-square-check" />
                                        {/* Mark Done */}
                                      </Link>
                                    </OverlayTrigger>
                                  )}
                                </div>
                                {data.status !== "Done" && (
                                  <div className="dropdown call-drop">
                                    {
                                      <OverlayTrigger
                                        placement="bottom"
                                        overlay={
                                          <Tooltip id="rescheduled-call-tooltip">
                                            Re-scheduled call
                                          </Tooltip>
                                        }
                                      >
                                        <Link
                                          to="#"
                                          data-bs-toggle="modal"
                                          data-bs-target="#create_task_call_rescheduled"
                                          className="dropdown-toggle"
                                          aria-expanded="false"
                                          onClick={() => {
                                            setTaskLogId(data?.taskLogId);
                                          }}
                                        >
                                          <i className="ti ti-calendar-month" />
                                          {/* Re-scheduled */}
                                        </Link>
                                      </OverlayTrigger>
                                    }
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <p>
                            {data.lastCallSummary} <br />
                          </p>
                          {data?.comment && (
                            <div
                              className="reply-box"
                              style={{
                                backgroundColor: "#F9F9FC",
                                borderRadius: "5px",
                                margin: "0 0 15px",
                                padding: "15px",
                              }}
                            >
                              <p>{data?.comment}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* /Calls */}
                  {/* Comment */}
                  <div className="tab-pane fade" id="task-comment">
                    <div className="view-header">
                      <h4>Comment</h4>
                      <ul>
                        <li>
                          <div className="form-sort">
                            <i className="ti ti-sort-ascending-2" />
                            <Select
                              className="select"
                              options={ascendingandDecending}
                              classNamePrefix="react-select"
                              placeholder="Ascending"
                            />
                          </div>
                        </li>
                        <li>
                          <Link
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#create_task_comment"
                            className="com-add"
                          >
                            <i className="ti ti-circle-plus me-1" />
                            Add New
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="notes-activity">
                      {commentData.length == 0 && <Empty description={false} />}
                      {commentData.map((data) => (
                        <div className="calls-box" key={data.taskLogId}>
                          <div className="caller-info">
                            <div className="calls-user">
                              <img src={data?.staff?.profilePicUrl} alt="img" />
                              <div style={{ display: "grid" }}>
                                <p>
                                  <span>{data?.staff?.name}</span>
                                </p>
                                <span
                                  className="badge-day"
                                  style={{
                                    fontSize: "x-small",
                                    margin: "0",
                                    maxWidth: "8rem",
                                  }}
                                >
                                  {getDate(data?.createdAt)},
                                  {getTime(data?.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="calls-action">
                              <div className="dropdown action-drop">
                                <Link
                                  to="#"
                                  className="dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <i className="ti ti-dots-vertical" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-right">
                                  <Link className="dropdown-item" to="#">
                                    <i className="ti ti-edit text-blue" />
                                    Edit
                                  </Link>
                                  <Link className="dropdown-item" to="#">
                                    <i className="ti ti-trash text-danger" />
                                    Delete
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p>{data?.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* /Comment */}

                  {/* Files */}
                  <div className="tab-pane fade" id="task-files">
                    <div className="view-header">
                      <h4>Files</h4>
                    </div>
                    <div className="files-activity">
                      <div className="files-wrap">
                        <div className="row align-items-center">
                          <div className="col-md-8">
                            <div className="file-info">
                              <h4>Manage Documents</h4>
                              <p>
                                Send customizable quotes, proposals and
                                contracts to close deals faster.
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 text-md-end">
                            <ul className="file-action">
                              <li>
                                <Link
                                  to="#"
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#create_task_file"

                                >
                                  Create Document
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {fileData.map((file) => (
                        <div className="files-wrap" key={file.taskLogId}>
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="file-info">
                                <div className="file-user">
                                  <div style={{ display: "flex" }}>
                                    <img
                                      src={file?.staff?.profilePicUrl}
                                      alt="img"
                                    />
                                  </div>
                                  <div style={{ display: "grid" }}>
                                    <p>{file?.staff?.name} uploaded file</p>
                                    <p
                                      style={{
                                        fontSize: "x-small",
                                        margin: "0",
                                        maxWidth: "8rem",
                                      }}
                                    >
                                      {getDate(file?.taskDocument?.createdAt)},
                                      {getTime(file?.taskDocument?.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <h4>{file?.taskDocument?.fileName}</h4>
                                <p>{file?.taskDocument?.comment}</p>
                                <p>{/* {file?.taskDocument?.createdAt} */}</p>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <ul className="file-action">
                                <li>
                                  <Link
                                    className="badge badge-tag badge-danger-light"
                                    to={
                                      file?.taskDocument?.fileType === "video"
                                        ? file?.taskDocument?.link
                                        : file?.taskDocument?.attachmentUrl
                                    }
                                  >
                                    <span>{file?.taskDocument?.fileType}</span>
                                    {file?.taskDocument?.fileType ==
                                      "image" && (
                                      <div className="note-download">
                                        <div className="note-info">
                                          <span className="note-icon">
                                            <img
                                              src={
                                                file?.taskDocument
                                                  ?.attachmentUrl
                                              }
                                              alt="Preview"
                                              style={{
                                                width: "300px",
                                                height: "auto",
                                              }}
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {file?.taskDocument?.fileType == "jpg" && (
                                      <div className="note-download">
                                        <div className="note-info">
                                          <span className="note-icon">
                                            <img
                                              src={
                                                file?.taskDocument
                                                  ?.attachmentUrl
                                              }
                                              alt="Preview"
                                              style={{
                                                width: "300px",
                                                height: "auto",
                                              }}
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                    {file?.taskDocument?.fileType == "png" && (
                                      <div className="note-download">
                                        <div className="note-info">
                                          <span className="note-icon">
                                            <img
                                              src={
                                                file?.taskDocument
                                                  ?.attachmentUrl
                                              }
                                              alt="Preview"
                                              style={{
                                                width: "300px",
                                                height: "auto",
                                              }}
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {file?.taskDocument?.fileType == "pdf" && (
                                      <div className="note-download">
                                        <div className="note-info">
                                          <span className="note-icon">
                                            <img
                                              src="/assets/img/pdf-icon.png"
                                              alt="Preview"
                                              style={{
                                                width: "100px",
                                                height: "100px",
                                              }}
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {/* {file?.taskDocument?.fileType === 'video' && file?.taskDocument?.link && (
                                                                        <div className="note-download">
                                                                            <div className="note-info">
                                                                                <span className="note-icon">
                                                                                    <video width="100%" height="100px" controls>
                                                                                        <source src={file?.taskDocument?.link} type="video/mp4" />
                                                                                        Your browser does not support the video tag.
                                                                                    </video>

                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )} */}

                                    {file?.taskDocument?.fileType === "video" &&
                                      file?.taskDocument?.link && (
                                        <div className="note-download">
                                          <div className="note-info">
                                            <span className="note-icon">
                                              {file.taskDocument.link.includes(
                                                "youtube.com"
                                              ) ||
                                              file.taskDocument.link.includes(
                                                "youtu.be"
                                              ) ? (
                                                // YouTube video
                                                <iframe
                                                  width="100%"
                                                  height="100px"
                                                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                                    file.taskDocument.link
                                                  )}`}
                                                  title="YouTube video player"
                                                  frameBorder="0"
                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                  allowFullScreen
                                                ></iframe>
                                              ) : (
                                                // Non-YouTube video
                                                <video
                                                  width="100%"
                                                  height="100px"
                                                  controls
                                                >
                                                  <source
                                                    src={file.taskDocument.link}
                                                    type="video/mp4"
                                                  />
                                                  Your browser does not support
                                                  the video tag.
                                                </video>
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      )}

                                    {file?.taskDocument?.fileType === "zip" && (
                                      <div className="note-download">
                                        <div className="note-info">
                                          <span className="note-icon">
                                            <img
                                              src="/assets/img/zip-icon.png"
                                              alt="Preview"
                                              style={{
                                                width: "100px",
                                                height: "100px",
                                              }}
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {file?.taskDocument?.fileType === "csv" && (
                                      <div className="note-download">
                                        <div className="note-info">
                                          <span className="note-icon">
                                            <img
                                              src="/assets/img/excel-icon.png"
                                              alt="Preview"
                                              style={{
                                                width: "100px",
                                                height: "100px",
                                              }}
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </Link>
                                </li>
                                <li>
                                  <div className="dropdown action-drop">
                                    <Link
                                      to="#"
                                      className="dropdown-toggle"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <i className="ti ti-dots-vertical" />
                                    </Link>
                                    <div className="dropdown-menu dropdown-menu-right">
                                      <Link className="dropdown-item" to="#">
                                        <i className="ti ti-edit text-blue" />
                                        Edit
                                      </Link>
                                      <Link className="dropdown-item" to="#">
                                        <i className="ti ti-trash text-danger" />
                                        Delete
                                      </Link>
                                      <Link className="dropdown-item" to="#">
                                        <i className="ti ti-download text-info" />
                                        Download
                                      </Link>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* /Files */}
                </div>
              </div>
              {/* /Tab Content */}
            </div>
            {/* /Contact Details */}
            {/* Contact Sidebar */}
            <div className="col-xl-3 theiaStickySidebar">
              <div className="stickybar">
                <div className="contact-sidebar">
                  <div className="con-sidebar-title">
                    <h6>Task Details</h6>
                  </div>
                  <ul className="other-info">
                    <li>
                      <span className="other-title">Task Title</span>
                      <span>{data?.taskTitle}</span>
                    </li>
                    <li>
                      <span className="other-title">Description</span>
                      <span>{data?.description}</span>
                    </li>
                  </ul>

                  <div className="con-sidebar-title">
                    <h6>Created By</h6>
                  </div>
                  <ul className=" other-info">
                    <li>
                      <span>
                        <img
                          src={data?.createdByImgUrl}
                          alt="img"
                          style={{
                            objectFit: "cover",
                            height: "32px",
                            width: "32px",
                            borderRadius: "50%",
                          }}
                        />
                      </span>
                      <div
                        style={{
                          position: "relative",
                          top: " 0.5rem",
                          paddingLeft: "0.3rem",
                        }}
                      >
                        <h6>{data?.createdBy}</h6>
                      </div>
                    </li>
                    <li>
                      <span className="other-title">Created Date</span>
                      <span>
                        {getDate(data?.createdAt)}, {getTime(data?.createdAt)}
                      </span>
                    </li>
                  </ul>
                  <h6>Assign To</h6>
                  <ul
                    className=" other-info"
                    data-bs-toggle="modal"
                    data-bs-target="#task_assigned_to"
                    style={{ cursor: "pointer" }}
                  >
                    <li>
                      <span>
                        <img
                          src={data?.assignedToImg}
                          alt="img"
                          style={{
                            objectFit: "cover",
                            height: "32px",
                            width: "32px",
                            borderRadius: "50%",
                          }}
                        />
                      </span>
                      <div
                        style={{
                          position: "relative",
                          top: " 0.5rem",
                          paddingLeft: "0.3rem",
                        }}
                      >
                        <h6>{data?.assignedTo}</h6>
                      </div>
                    </li>
                    {/* <li>
                                            <span className="other-title">Created Date</span>
                                            <span>{getDate(data?.createdAt)}, {getTime(data?.createdAt)}</span>
                                        </li> */}
                  </ul>

                  {/* <div className="con-sidebar-title">
                                        <h6>Company</h6>
                                        <Link to="#" className="com-add add-popups">
                                            <i className="ti ti-circle-plus me-1" />
                                            Add New
                                        </Link>
                                    </div> */}
                  {/* <div className="con-sidebar-title">
                                        <h6>Lead Details</h6>
                                    </div>
                                    <ul className="other-info">
                                        <li>
                                            <span className="other-title">Lead Name</span>
                                            <span>{data?.leadName}</span>
                                        </li>
                                        <li>
                                            <span className="other-title">Lead Email</span>
                                            <span>{data?.lead?.leadEmail}</span>
                                        </li>
                                        <li>
                                            <span className="other-title">Lead Mobile</span>
                                            <span>{data?.lead?.leadMobile1}</span>
                                        </li>
                                        <li>
                                            <span className="other-title">Created Date</span>
                                            <span>{getDate(data?.lead?.createdAt)}, {getTime(data?.lead?.createdAt)}</span>
                                        </li>
                                    </ul> */}

                  {/* <div className="con-sidebar-title">
                                        <h6>Assign To</h6>
                                    </div>
                                    <ul className="company-info com-info">
                                        <li>
                                            <span>
                                                <img
                                                    src={data?.assignedToImg}
                                                    alt="img"
                                                    style={{ objectFit: 'cover', height: '32px', width: '32px', borderRadius: '50%' }}
                                                />
                                            </span>
                                            <div>
                                                <h6>{data?.assignedTo}</h6>
                                            </div>
                                        </li>
                                    </ul> */}

                  {/* <h6>Social Profile</h6>
                                    <ul className="social-info">
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-youtube" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-facebook-f" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-instagram" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-whatsapp" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-pinterest" />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="fa-brands fa-linkedin" />
                                            </Link>
                                        </li>
                                    </ul> */}
                  {/* <h6>Attachment</h6>
                                    <ul className="set-info">
                                        <li>
                                            <Link to={data?.attachmentUrl}>
                                                <i className="ti ti-share-2" />
                                                {data?.attachment ? data?.attachment : 'No Attachment'}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <i className="ti ti-star" />
                                                Add to Favourite
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="#"
                                                data-bs-toggle="modal"
                                                data-bs-target="#delete_contact"
                                            >
                                                <i className="ti ti-trash-x" />
                                                Delete Company
                                            </Link>
                                        </li>
                                    </ul> */}
                </div>
              </div>
            </div>
            {/* /Contact Sidebar */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Not Use */}

      <div>
        {/* Delete Company */}
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
                  <h3>Remove Company?</h3>
                  <p className="del-info">
                    Company ”NovaWaveLLC” from your Account
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
        {/* /Delete Company */}
        {/* Add Note */}
        <div
          className="modal custom-modal fade modal-padding"
          id="add_notes"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Notes</h5>
                <button
                  type="button"
                  className="btn-close position-static"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body p-0">
                <form>
                  <div className="form-wrap">
                    <label className="col-form-label">
                      Title <span className="text-danger"> *</span>
                    </label>
                    <input className="form-control" type="text" />
                  </div>
                  <div className="form-wrap">
                    <label className="col-form-label">
                      Note <span className="text-danger"> *</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      defaultValue={""}
                    />
                  </div>
                  <div className="form-wrap">
                    <label className="col-form-label">
                      Attachment <span className="text-danger"> *</span>
                    </label>
                    <div className="drag-attach">
                      <input type="file" />
                      <div className="img-upload">
                        <i className="ti ti-file-broken" />
                        Upload File
                      </div>
                    </div>
                  </div>
                  <div className="form-wrap">
                    <label className="col-form-label">Uploaded Files</label>
                    <div className="upload-file">
                      <h6>Projectneonals teyys.xls</h6>
                      <p>4.25 MB</p>
                      <div className="progress">
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: "25%" }}
                          aria-valuenow={25}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      <p className="black-text">45%</p>
                    </div>
                    <div className="upload-file upload-list">
                      <div>
                        <h6>tes.txt</h6>
                        <p>4.25 MB</p>
                      </div>
                      <Link to="#" className="text-danger">
                        <i className="ti ti-trash-x" />
                      </Link>
                    </div>
                  </div>
                  <div className="col-lg-12 text-end modal-btn">
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
        {/* /Add Note */}
        {/* Create Call Log */}
        <div
          className="modal custom-modal fade modal-padding"
          id="create_call"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Call Log</h5>
                <button
                  type="button"
                  className="btn-close position-static"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body p-0">
                <form>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Status <span className="text-danger"> *</span>
                        </label>
                        <Select
                          className="select"
                          options={statusList}
                          classNamePrefix="react-select"
                          placeholder="Ascending"
                        />
                      </div>
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Follow Up Date <span className="text-danger"> *</span>
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
                            minDate={new Date()}
                          />
                        </div>
                      </div>
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Note <span className="text-danger"> *</span>
                        </label>
                        <textarea
                          className="form-control"
                          rows={4}
                          placeholder="Add text"
                          defaultValue={""}
                        />
                      </div>
                      {/* <div className="form-wrap">
                                            <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" /> Create a followup task
                                            </label>
                                        </div> */}
                      <div className="text-end modal-btn">
                        <Link
                          to="#"
                          className="btn btn-light"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </Link>
                        <Link
                          className="btn btn-primary"
                          to="#"
                          data-bs-dismiss="modal"
                        >
                          Confirm
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Create Call Log */}
        {/* Add File */}
        <div
          className="modal custom-modal fade custom-modal-two modal-padding"
          id="new_file"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New File</h5>
                <button
                  type="button"
                  className="btn-close position-static"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body p-0">
                <div className="add-info-fieldset">
                  <div className="add-details-wizard">
                    <ul className="progress-bar-wizard">
                      <li className="active">
                        <span>
                          <i className="ti ti-file" />
                        </span>
                        <div className="multi-step-info">
                          <h6>Basic Info</h6>
                        </div>
                      </li>
                      <li>
                        <span>
                          <i className="ti ti-circle-plus" />
                        </span>
                        <div className="multi-step-info">
                          <h6>Add Recipient</h6>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <fieldset id="first-field-file">
                    <form>
                      <div className="contact-input-set">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Choose Deal{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <select className="select">
                                <option>Select</option>
                                <option>Collins</option>
                                <option>Wisozk</option>
                                <option>Walter</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Document Type{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <select className="select">
                                <option>Select</option>
                                <option>Contract</option>
                                <option>Proposal</option>
                                <option>Quote</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Owner <span className="text-danger">*</span>
                              </label>
                              <select className="select">
                                <option>Select</option>
                                <option>Admin</option>
                                <option>Jackson Daniel</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Title <span className="text-danger"> *</span>
                              </label>
                              <input className="form-control" type="text" />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Locale <span className="text-danger">*</span>
                              </label>
                              <select className="select">
                                <option>Select</option>
                                <option>en</option>
                                <option>es</option>
                                <option>ru</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="signature-wrap">
                              <h4>Signature</h4>
                              <ul className="nav sign-item">
                                <li className="nav-item">
                                  <span
                                    className=" mb-0"
                                    data-bs-toggle="tab"
                                    data-bs-target="#nosign"
                                  >
                                    <input
                                      type="radio"
                                      className="status-radio"
                                      id="sign1"
                                      name="email"
                                    />
                                    <label htmlFor="sign1">
                                      <span className="sign-title">
                                        No Signature
                                      </span>
                                      This document does not require a signature
                                      before acceptance.
                                    </label>
                                  </span>
                                </li>
                                <li className="nav-item">
                                  <span
                                    className="active mb-0"
                                    data-bs-toggle="tab"
                                    data-bs-target="#use-esign"
                                  >
                                    <input
                                      type="radio"
                                      className="status-radio"
                                      id="sign2"
                                      name="email"
                                      defaultChecked={true}
                                    />
                                    <label htmlFor="sign2">
                                      <span className="sign-title">
                                        Use e-signature
                                      </span>
                                      This document require e-signature before
                                      acceptance.
                                    </label>
                                  </span>
                                </li>
                              </ul>
                              <div className="tab-content">
                                <div
                                  className="tab-pane show active"
                                  id="use-esign"
                                >
                                  <div className="input-block mb-0">
                                    <label className="col-form-label">
                                      Document Signers{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                  <div className="sign-content">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="form-wrap">
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter Name"
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="d-flex align-items-center">
                                          <div className="float-none form-wrap me-3 w-100">
                                            <input
                                              className="form-control"
                                              type="text"
                                              placeholder="Email Address"
                                            />
                                          </div>
                                          <div className="input-btn form-wrap">
                                            <Link to="#" className="add-sign">
                                              <i className="ti ti-circle-plus" />
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="input-block mb-3">
                              <label className="col-form-label">
                                Content <span className="text-danger"> *</span>
                              </label>
                              <textarea
                                className="form-control"
                                rows={3}
                                placeholder="Add Content"
                                defaultValue={""}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12 text-end form-wizard-button modal-btn">
                            <button className="btn btn-light" type="reset">
                              Reset
                            </button>
                            <button
                              className="btn btn-primary wizard-next-btn"
                              type="button"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </fieldset>
                  <fieldset>
                    <form>
                      <div className="contact-input-set">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="signature-wrap">
                              <h4 className="mb-2">
                                Send the document to following signers
                              </h4>
                              <p>
                                In order to send the document to the signers
                              </p>
                              <div className="input-block mb-0">
                                <label className="col-form-label">
                                  Recipients (Additional recipients)
                                </label>
                              </div>
                              <div className="sign-content">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="form-wrap">
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Enter Name"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="d-flex align-items-center">
                                      <div className="float-none form-wrap me-3 w-100">
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Email Address"
                                        />
                                      </div>
                                      <div className="input-btn form-wrap">
                                        <Link to="#" className="add-sign">
                                          <i className="ti ti-circle-plus" />
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Message Subject{" "}
                                <span className="text-danger"> *</span>
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                placeholder="Enter Subject"
                              />
                            </div>
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Message Text{" "}
                                <span className="text-danger"> *</span>
                              </label>
                              <textarea
                                className="form-control"
                                rows={3}
                                placeholder="Your document is ready"
                                defaultValue={""}
                              />
                            </div>
                            <button className="btn btn-light mb-3">
                              Send Now
                            </button>
                            <div className="send-success">
                              <p>
                                <i className="ti ti-circle-check" /> Document
                                sent successfully to the selected recipients
                              </p>
                            </div>
                          </div>
                          <div className="col-lg-12 text-end form-wizard-button modal-btn">
                            <button className="btn btn-light" type="reset">
                              Cancel
                            </button>
                            <button
                              className="btn btn-primary"
                              type="button"
                              data-bs-dismiss="modal"
                            >
                              Save &amp; Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Add File */}
        {/* /Add Call Comment */}
        {/* /Add Call Comment */}
      </div>
      {/* Not Use */}

      <AddCallComment
        fetchTaskLogData={fetchTaskLogData}
        taskLogId={taskLogId}
      />

      <RescheduleCall fetchTaskLogData={fetchTaskLogData} taskDetails={data} />

      <RescheduleMeeting
        fetchTaskLogData={fetchTaskLogData}
        taskDetails={data}
      />

      <AddMeetingComment
        fetchTaskLogData={fetchTaskLogData}
        taskLogId={taskLogId}
      />

      {/* Not Use */}
      <div>
        {/* Connect Account */}
        <div
          className="modal custom-modal fade"
          id="create_email"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Connect Account</h5>
                <button
                  type="button"
                  className="btn-close position-static"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body p-0">
                <div className="form-wrap">
                  <label className="col-form-label">
                    Account type <span className="text-danger"> *</span>
                  </label>
                  <select className="select">
                    <option>Gmail</option>
                    <option>Outlook</option>
                    <option>Imap</option>
                  </select>
                </div>
                <div className="form-wrap">
                  <h5 className="form-title">Sync emails from</h5>
                  <div className="sync-radio">
                    <div className="radio-item">
                      <input
                        type="radio"
                        className="status-radio"
                        id="test1"
                        name="radio-group"
                        defaultChecked={true}
                      />
                      <label htmlFor="test1">Now</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        className="status-radio"
                        id="test2"
                        name="radio-group"
                      />
                      <label htmlFor="test2">1 Month Ago</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        className="status-radio"
                        id="test3"
                        name="radio-group"
                      />
                      <label htmlFor="test3">3 Month Ago</label>
                    </div>
                    <div className="radio-item">
                      <input
                        type="radio"
                        className="status-radio"
                        id="test4"
                        name="radio-group"
                      />
                      <label htmlFor="test4">6 Month Ago</label>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 text-end modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary"
                    data-bs-target="#success_mail"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                  >
                    Connect Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Connect Account */}
        {/* Success Company */}
        <div
          className="modal custom-modal fade"
          id="success_mail"
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
                    <i className="ti ti-mail-opened" />
                  </div>
                  <h3>Email Connected Successfully!!!</h3>
                  <p>
                    Email Account is configured with “example@example.com”. Now
                    you can access email.
                  </p>
                  <div className="col-lg-12 text-center modal-btn">
                    <Link to="#" className="btn btn-primary">
                      Go to email
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Success Company */}
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
        {/* Add Compose */}
        <div className="modal custom-modal fade" id="add_compose" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Compose</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body p-0">
                <form action="#">
                  <div className="form-wrap">
                    <input
                      type="email"
                      placeholder="To"
                      className="form-control"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <input
                          type="email"
                          placeholder="Cc"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-wrap">
                        <input
                          type="email"
                          placeholder="Bcc"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-wrap">
                    <input
                      type="text"
                      placeholder="Subject"
                      className="form-control"
                    />
                  </div>
                  <div className="form-wrap">
                    <DefaultEditor className="summernote" />
                  </div>
                  <div className="form-wrap">
                    <div className="text-center">
                      <button className="btn btn-primary me-1">
                        <span>Send</span>
                        <i className="fa-solid fa-paper-plane ms-1" />
                      </button>
                      <button className="btn btn-primary me-1" type="button">
                        <span>Draft</span>{" "}
                        <i className="fa-regular fa-floppy-disk ms-1" />
                      </button>
                      <button className="btn btn-primary me-1" type="button">
                        <span>Delete</span>{" "}
                        <i className="fa-regular fa-trash-can ms-1" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Compose */}
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
                onClick={() =>
                  dispatch(setActivityTogglePopupTwo(!activityToggleTwo))
                }
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
                                      <input
                                        type="file"
                                        className="input-img"
                                      />
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
                                  Last Name{" "}
                                  <span className="text-danger">*</span>
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
                                  Job Title{" "}
                                  <span className="text-danger">*</span>
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
                                  options={companyName}
                                  classNamePrefix="react-select"
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
                                <label className="col-form-label">
                                  Phone 2
                                </label>
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
                                  <label className="col-form-label">
                                    Deals
                                  </label>
                                  <Link to="#" className="label-add add-popups">
                                    <i className="ti ti-square-rounded-plus" />
                                    Add New
                                  </Link>
                                </div>

                                <Select
                                  className="select"
                                  options={dealsopen}
                                  classNamePrefix="react-select"
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
                                    selected={selectedDate1}
                                    onChange={handleDateChange1}
                                    dateFormat="dd-MM-yyyy"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Reviews{" "}
                                </label>
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
                                  options={activities}
                                  classNamePrefix="react-select"
                                  placeholder="Phone Calls"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Industry{" "}
                                  <span className="text-danger">*</span>
                                </label>

                                <Select
                                  className="select"
                                  options={industries}
                                  classNamePrefix="react-select"
                                  placeholder="Banking"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Currency{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Language{" "}
                                  <span className="text-danger">*</span>
                                </label>

                                <Select
                                  className="select"
                                  options={languageOptions}
                                  classNamePrefix="react-select"
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
                                <label className="col-form-label">
                                  Country
                                </label>

                                <Select
                                  className="select"
                                  options={countries}
                                  placeholder="USA"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap mb-0">
                                <label className="col-form-label">
                                  Zipcode{" "}
                                </label>
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
                                <label className="col-form-label">
                                  Facebook
                                </label>
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
                                <label className="col-form-label">
                                  Twitter
                                </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap mb-wrap">
                                <label className="col-form-label">
                                  Whatsapp
                                </label>
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
                                    <label htmlFor="edit-private">
                                      Private
                                    </label>
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
        {/* Add Company */}
        <div className="toggle-popup2">
          <div className="sidebar-layout">
            <div className="sidebar-header">
              <h4>Add Company</h4>
              <Link to="#" className="sidebar-close2 toggle-btn">
                <i className="ti ti-x" />
              </Link>
            </div>
            <div className="toggle-body">
              <div className="pro-create">
                <form action="#">
                  <div className="accordion-lists" id="list-accord">
                    {/* Basic Info */}
                    <div className="user-accordion-item">
                      <Link
                        to="#"
                        className="accordion-wrap"
                        data-bs-toggle="collapse"
                        data-bs-target="#add-basic"
                      >
                        <span>
                          <i className="ti ti-user-plus" />
                        </span>
                        Basic Info
                      </Link>
                      <div
                        className="accordion-collapse collapse show"
                        id="add-basic"
                        data-bs-parent="#list-accord"
                      >
                        <div className="content-collapse">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="profile-pic-upload">
                                <div className="profile-pic">
                                  <span>
                                    <i className="ti ti-photo" />
                                  </span>
                                </div>
                                <div className="upload-content">
                                  <div className="upload-btn">
                                    <input type="file" />
                                    <span>
                                      <i className="ti ti-file-broken" />
                                      Upload File
                                    </span>
                                  </div>
                                  <p>JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Company Name
                                </label>
                                <input type="text" className="form-control" />
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
                                      id="mail"
                                      className="check"
                                      defaultChecked={true}
                                    />
                                    <label
                                      htmlFor="mail"
                                      className="checktoggle"
                                    />
                                  </div>
                                </div>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Phone 1 <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Phone 2
                                </label>
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
                                <label className="col-form-label">
                                  Website <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Rating{" "}
                                </label>
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
                              <div className="form-wrap img-select">
                                <label className="col-form-label">Owner</label>
                                <select className="select2">
                                  <option>Jerald</option>
                                  <option>Guillory</option>
                                  <option>Jami</option>
                                  <option>Theresa</option>
                                  <option>Espinosa</option>
                                </select>
                                <span className="select-box-img avatar">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-14.jpg"
                                    alt=""
                                  />
                                </span>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Tags </label>
                                <input
                                  className="input-tags form-control"
                                  type="text"
                                  data-role="tagsinput"
                                  name="Label"
                                  defaultValue="Tag1"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Deals</label>
                                <select className="select2">
                                  <option>Choose</option>
                                  <option>Collins</option>
                                  <option>Konopelski</option>
                                  <option>Adams</option>
                                  <option>Schumm</option>
                                  <option>Wisozk</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Source <span className="text-danger">*</span>
                                </label>
                                <select className="select2">
                                  <option>Choose</option>
                                  <option>Phone Calls</option>
                                  <option>Social Media</option>
                                  <option>Referral Sites</option>
                                  <option>Web Analytics</option>
                                  <option>Previous Purchases</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Industry{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select className="select">
                                  <option>Choose</option>
                                  <option>Retail Industry</option>
                                  <option>Banking</option>
                                  <option>Hotels</option>
                                  <option>Financial Services</option>
                                  <option>Insurance</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Contact <span className="text-danger">*</span>
                                </label>
                                <select className="select2">
                                  <option>Choose</option>
                                  <option>John</option>
                                  <option>Guillory</option>
                                  <option>Jami</option>
                                  <option>Theresa</option>
                                  <option>Espinosa</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Currency{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Language{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <select className="select">
                                  <option>Choose</option>
                                  <option>English</option>
                                  <option>Arabic</option>
                                  <option>Chinese</option>
                                  <option>Hindi</option>
                                </select>
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
                        data-bs-target="#add-address"
                      >
                        <span>
                          <i className="ti ti-map-pin-cog" />
                        </span>
                        Address Info
                      </Link>
                      <div
                        className="accordion-collapse collapse"
                        id="add-address"
                        data-bs-parent="#list-accord"
                      >
                        <div className="content-collapse">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Street Address{" "}
                                </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">City </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  State / Province{" "}
                                </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap mb-wrap">
                                <label className="col-form-label">
                                  Country
                                </label>
                                <select className="select">
                                  <option>Choose</option>
                                  <option>India</option>
                                  <option>USA</option>
                                  <option>France</option>
                                  <option>UK</option>
                                  <option>UAE</option>
                                </select>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap mb-0">
                                <label className="col-form-label">
                                  Zipcode{" "}
                                </label>
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
                        data-bs-target="#add-social"
                      >
                        <span>
                          <i className="ti ti-social" />
                        </span>
                        Social Profile
                      </Link>
                      <div
                        className="accordion-collapse collapse"
                        id="add-social"
                        data-bs-parent="#list-accord"
                      >
                        <div className="content-collapse">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Facebook
                                </label>
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
                                <label className="col-form-label">
                                  Twitter
                                </label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap mb-wrap">
                                <label className="col-form-label">
                                  Whatsapp
                                </label>
                                <input type="text" className="form-control" />
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
                        data-bs-target="#add-access"
                      >
                        <span>
                          <i className="ti ti-accessible" />
                        </span>
                        Access
                      </Link>
                      <div
                        className="accordion-collapse collapse"
                        id="add-access"
                        data-bs-parent="#list-accord"
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
                                      id="add-public"
                                      name="visible"
                                    />
                                    <label htmlFor="add-public">Public</label>
                                  </div>
                                  <div className="radio-btn">
                                    <input
                                      type="radio"
                                      className="status-radio"
                                      id="add-private"
                                      name="visible"
                                    />
                                    <label htmlFor="add-private">Private</label>
                                  </div>
                                  <div
                                    className="radio-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#access_view"
                                  >
                                    <input
                                      type="radio"
                                      className="status-radio"
                                      id="add-people"
                                      name="visible"
                                    />
                                    <label htmlFor="add-people">
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
                                      id="add-active"
                                      name="status"
                                      defaultChecked={true}
                                    />
                                    <label htmlFor="add-active">Active</label>
                                  </div>
                                  <div className="radio-btn">
                                    <input
                                      type="radio"
                                      className="status-radio"
                                      id="add-inactive"
                                      name="status"
                                    />
                                    <label htmlFor="add-inactive">
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
                    <Link to="#" className="btn btn-light sidebar-close2">
                      Cancel
                    </Link>
                    <Link
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#create_contact"
                      className="btn btn-primary"
                    >
                      Create
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add Company */}
        {/* Add New Deals */}
        <div
          className={
            activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
          }
        >
          <div className="sidebar-layout">
            <div className="sidebar-header">
              <h4>Add New Deals</h4>
              <Link
                to="#"
                className="sidebar-close toggle-btn"
                onClick={() => setActivityToggle(!activityToggle)}
              >
                <i className="ti ti-x" />
              </Link>
            </div>
            <div className="toggle-body">
              <div className="pro-create">
                <form>
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
                        <label className="col-form-label">
                          Pipeine <span className="text-danger">*</span>
                        </label>

                        <Select
                          className="select"
                          options={salestypelist}
                          classNamePrefix="react-select"
                          placeholder="Choose"
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
                          classNamePrefix="react-select"
                          placeholder="Choose"
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
                          className="select"
                          options={optionssymbol}
                          classNamePrefix="react-select"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Period <span className="text-danger">*</span>
                        </label>
                        <input className="form-control" type="text" />
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
                        <input
                          className="input-tags form-control"
                          type="text"
                          data-role="tagsinput"
                          name="Label"
                          defaultValue="Jack, Darlee Robertson"
                        />
                      </div>
                      <div className="form-wrap">
                        <label className="col-form-label">
                          Project <span className="text-danger">*</span>
                        </label>
                        <input
                          className="input-tags form-control"
                          type="text"
                          data-role="tagsinput"
                          name="Label"
                          defaultValue="Divine dran"
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
                            selected={selectedDate2}
                            onChange={handleDateChange2}
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
                        <input
                          className="input-tags form-control"
                          type="text"
                          data-role="tagsinput"
                          name="Label"
                          defaultValue="James"
                        />
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
                            selected={selectedDate4}
                            onChange={handleDateChange4}
                            dateFormat="dd-MM-yyyy"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
                        <label className="col-form-label">
                          Source <span className="text-danger">*</span>
                        </label>

                        <Select
                          className="select"
                          options={socialMedia}
                          classNamePrefix="react-select"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-block mb-3">
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
                      <div className="input-block mb-3">
                        <label className="col-form-label">
                          Priority <span className="text-danger">*</span>
                        </label>

                        <Select
                          className="select"
                          options={priorityList}
                          classNamePrefix="react-select"
                          placeholder="Select"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="input-block mb-3">
                        <label className="col-form-label">
                          Description <span className="text-danger">*</span>
                        </label>
                        <div className="summernote" />
                      </div>
                    </div>
                  </div>
                  <div className="submit-button text-end">
                    <Link to="#" className="btn btn-light sidebar-close">
                      Cancel
                    </Link>
                    <Link to="#" className="btn btn-primary">
                      Create
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add New Deals */}
      </div>
      {/* Not Use */}

      <CreateCall taskDetails={data} fetchTaskDetails={fetchTaskLogData} />

      <CreateMeeting taskDetails={data} fetchTaskDetails={fetchTaskLogData} />

      <CreateComment taskDetails={data} fetchTaskDetails={fetchTaskLogData} />

      <AddTaskDocuments
        fetchLeadFollowupData={fetchTaskLogData}
        taskDetails={data}
      />

      <TaskStatus taskRecord={data} fetchTaskData={fetchTaskDetails} />

      <AssignedTo
        taskRecord={data}
        fetchTaskData={handleRefresh}
        staffOptions={[]}
      />
    </>
  );
};

export default TaskDetailsPage;
