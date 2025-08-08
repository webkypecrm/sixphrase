import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Select from "react-select";
import { ascendingandDecending } from "../../selectOption/selectOption";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../Router/all_routes";
import "react-datepicker/dist/react-datepicker.css";
import { Empty } from "antd";
import CreateCall from "../../components/Ticket/TicketDetails/CreateCall";
import CreateMeeting from "../../components/Ticket/TicketDetails/CreateMeeting";
import CreateComment from "../../components/Ticket/TicketDetails/CreateComment";
import AddCallComment from "../../components/Ticket/TicketDetails/AddCallComment";
import AddMeetingComment from "../../components/Ticket/TicketDetails/AddMeetingComment";
import RescheduleCall from "../../components/Ticket/TicketDetails/RescheduleCall";
import RescheduleMeeting from "../../components/Ticket/TicketDetails/RescheduleMeeting";
import TaskStatus from "../../components/Task/TaskStatus";
import AddTaskDocuments from "../../components/Task/TaskDetails/AddTaskDocuments";
import TaskTimer from "../../components/Task/TaskDetails/TaskTimer";
import AssignedTo from "../../components/Task/AssignedTo";
import dayjs from "dayjs";

const TicketPreview = ({
  id,
  ticketData,
  taskLogData,
  groupActivityByDate,
  callData,
  meetingData,
  commentData,
  fileData,
  fetchTaskLogData,
}) => {
  // console.log("IDDD",id)
  const route = all_routes;
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const [data, setData] = useState(null);
  const [taskLogId, setTaskLogId] = useState("");

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
    hours = hours ? hours : 12;

    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
  }

  function handleRefresh() {
    fetchTaskLogData();
    fetchTaskDetails();
  }

  const getYouTubeVideoId = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const fetchTaskDetails = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/get-support-ticket/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      console.log("DATAAAA", response.data.data);
      setData((prev) => ({
        ...response.data.data,
      }));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);

  // time formet
  const getTimeDifference = (dateString) => {
    const createdAt = new Date(dateString);
    const now = new Date();

    const diffMs = now - createdAt;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const remainingHours = diffHours % 24;
    const remainingMinutes = diffMinutes % 60;

    return `${diffDays} Days ${remainingHours} Hours ${remainingMinutes} Min`;
  };
  return (
    <Fragment>
      {/* Page Wrapper */}

      <div className="row">
        {/*Ticket Activities */}
        <div className="col-xl-12">
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
                <Link to="#" data-bs-toggle="tab" data-bs-target="#task-calls">
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
              <li>
                <Link to="#" data-bs-toggle="tab" data-bs-target="#task-files">
                  <i className="ti ti-file" />
                  Files
                </Link>
              </li>
            </ul>
          </div>
          {/* Tab Content */}
          <div className="contact-tab-view">
            <div className="tab-content pt-0">
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
                        {groupActivityByDate[`${date}`].map((lead, index) => (
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
                                          {callData[0]?.supportTicketLog !==
                                            lead?.supportTicketLog &&
                                          lead?.status !== "Done" ? (
                                            <p>
                                              <del style={{ color: "red" }}>
                                                <span>{lead?.staff?.name}</span>{" "}
                                                <strong>
                                                  {" "}
                                                  {lead?.status.toLowerCase()}{" "}
                                                </strong>
                                                a call on{" "}
                                                {getDate(lead.callBackDate)},{" "}
                                                {getTime(lead.callBackTime)}{" "}
                                              </del>
                                            </p>
                                          ) : (
                                            <p style={{ color: "green" }}>
                                              <span>{lead?.staff?.name}</span>{" "}
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
                                            <Link to="#" aria-expanded="false">
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
                            {lead.type == "ticketComment" && (
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
                                          {meetingData[0]?.supportTicketLog !==
                                            lead?.supportTicketLog &&
                                          lead?.status !== "Done" ? (
                                            <del style={{ color: "red" }}>
                                              <p>
                                                <span>{lead?.staff?.name}</span>{" "}
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
                                              <span>{lead?.staff?.name}</span>{" "}
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
                                            <Link to="#" aria-expanded="false">
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
                                              {/* <i className="ti ti-chevron-down ms-1" /> */}
                                            </Link>
                                            {/* <div className="dropdown-menu dropdown-menu-right">
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
                                                </div> */}
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
                                                lead?.meetingType === "offline"
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
                                  {/* {lead?.comment && (
                                        <div className="reply-box">
                                          <p>{lead?.comment}</p>
                                        </div>
                                      )} */}
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
                                            <div style={{ display: "flex" }}>
                                              <img
                                                src={lead?.staff?.profilePicUrl}
                                                alt="img"
                                              />
                                            </div>
                                            <div style={{ display: "grid" }}>
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
                                                  lead?.supportTicketDocument
                                                    ?.createdAt
                                                )}
                                                ,
                                                {getTime(
                                                  lead?.supportTicketDocument
                                                    ?.createdAt
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                          <h4>
                                            {
                                              lead?.supportTicketDocument
                                                ?.fileName
                                            }
                                          </h4>
                                          <p>
                                            {
                                              lead?.supportTicketDocument
                                                ?.comment
                                            }
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-md-4 text-md-end">
                                        <ul className="file-action">
                                          <li>
                                            <Link
                                              className="badge badge-tag badge-danger-light"
                                              to={
                                                lead?.supportTicketDocument
                                                  ?.attachmentUrl
                                              }
                                            >
                                              <span>
                                                {
                                                  lead?.supportTicketDocument
                                                    ?.fileType
                                                }
                                              </span>
                                              <Link
                                                className="badge badge-tag badge-danger-light"
                                                to={
                                                  lead?.supportTicketDocument
                                                    ?.attachmentUrl
                                                }
                                              >
                                                {/* <span>{lead?.taskDocument?.fileType}</span> */}

                                                {lead?.supportTicketDocument
                                                  ?.fileType == "image" && (
                                                  <div className="note-download">
                                                    <div className="note-info">
                                                      <span className="note-icon">
                                                        <img
                                                          src={
                                                            lead
                                                              ?.supportTicketDocument
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
                                                {lead?.supportTicketDocument
                                                  ?.fileType == "jpg" && (
                                                  <div className="note-download">
                                                    <div className="note-info">
                                                      <span className="note-icon">
                                                        <img
                                                          src={
                                                            lead
                                                              ?.supportTicketDocument
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
                                                {lead?.supportTicketDocument
                                                  ?.fileType == "png" && (
                                                  <div className="note-download">
                                                    <div className="note-info">
                                                      <span className="note-icon">
                                                        <img
                                                          src={
                                                            lead
                                                              ?.supportTicketDocument
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

                                                {lead?.supportTicketDocument
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

                                                {lead?.supportTicketDocument
                                                  ?.fileType === "video" &&
                                                  lead?.supportTicketDocument
                                                    ?.link && (
                                                    <div className="note-download">
                                                      <div className="note-info">
                                                        <span className="note-icon">
                                                          {lead?.supportTicketDocument?.link.includes(
                                                            "youtube.com"
                                                          ) ||
                                                          lead?.supportTicketDocument?.link.includes(
                                                            "youtu.be"
                                                          ) ? (
                                                            // YouTube video
                                                            <iframe
                                                              width="100%"
                                                              height="100px"
                                                              src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                                                lead
                                                                  .supportTicketDocument
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
                                                                    .supportTicketDocument
                                                                    .link
                                                                }
                                                                type="video/mp4"
                                                              />
                                                              Your browser does
                                                              not support the
                                                              video tag.
                                                            </video>
                                                          )}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )}

                                                {lead?.supportTicketDocument
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

                                                {lead?.supportTicketDocument
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
                          data-bs-target="#create_ticket_call"
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
                                <strong> {data?.status.toLowerCase()} </strong>a
                                call on {getDate(data.callBackDate)},{" "}
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
                                    data-bs-target="#create_ticket_call_comment"
                                    className="dropdown-toggle bg-pending"
                                    aria-expanded="false"
                                    onClick={() => {
                                      setTaskLogId(data?.supportTicketLog);
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
                                      data-bs-target="#create_ticket_call_rescheduled"
                                      className="dropdown-toggle"
                                      aria-expanded="false"
                                      onClick={() => {
                                        setTaskLogId(data?.supportTicketLog);
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
                          data-bs-target="#create_ticket_meeting"
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
                                  <strong>{data?.status.toLowerCase()}</strong>{" "}
                                  a meeting on {getDate(data.meetingDate)},{" "}
                                  {getTime(data.meetingTime)}
                                </p>
                              </del>
                            ) : (
                              <p style={{ color: "green" }}>
                                <span>{data?.staff?.name}</span>{" "}
                                <strong>{data?.status.toLowerCase()}</strong> a
                                meeting on {getDate(data.meetingDate)},{" "}
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
                                    data-bs-target="#create_ticket_meeting_comment"
                                    className="dropdown-toggle bg-pending"
                                    aria-expanded="false"
                                    onClick={() => {
                                      setTaskLogId(data?.supportTicketLog);
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
                                      data-bs-target="#create_ticket_meeting_rescheduled"
                                      className="dropdown-toggle"
                                      aria-expanded="false"
                                      onClick={() => {
                                        setTaskLogId(data?.supportTicketLog);
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
                                {/* <i className="ti ti-chevron-down ms-1" /> */}
                              </Link>
                              {/* <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to="#">
                                      offline
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                      online
                                    </Link>
                                  </div> */}
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
                    </div>
                  ))}
                </div>
              </div>
              {/* /Meeting */}

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
                        data-bs-target="#create_ticket_comment"
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
                        {/* <div className="calls-action">
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
                            </div> */}
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
                            Send customizable quotes, proposals and contracts to
                            close deals faster.
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
                              data-bs-target="#create_ticket_file"
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
                                  {getDate(file?.createdAt)},
                                  {getTime(file?.createdAt)}
                                </p>
                              </div>
                            </div>
                            <h4>{file?.supportTicketDocument?.fileName}</h4>
                            <p>{file?.supportTicketDocument?.comment}</p>
                            <p>{/* {file?.taskDocument?.createdAt} */}</p>
                          </div>
                        </div>
                        <div className="col-md-4 text-md-end">
                          <ul className="file-action">
                            <li>
                              <Link
                                className="badge badge-tag badge-danger-light"
                                to={
                                  file?.supportTicketDocument?.fileType ===
                                  "video"
                                    ? file?.supportTicketDocument?.link
                                    : file?.supportTicketDocument?.attachmentUrl
                                }
                              >
                                <span>
                                  {file?.supportTicketDocument?.fileType}
                                </span>
                                {file?.supportTicketDocument?.fileType ==
                                  "image" && (
                                  <div className="note-download">
                                    <div className="note-info">
                                      <span className="note-icon">
                                        <img
                                          src={
                                            file?.supportTicketDocument
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
                                {file?.supportTicketDocument?.fileType ==
                                  "jpg" && (
                                  <div className="note-download">
                                    <div className="note-info">
                                      <span className="note-icon">
                                        <img
                                          src={
                                            file?.supportTicketDocument
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
                                {file?.supportTicketDocument?.fileType ==
                                  "png" && (
                                  <div className="note-download">
                                    <div className="note-info">
                                      <span className="note-icon">
                                        <img
                                          src={
                                            file?.supportTicketDocument
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

                                {file?.supportTicketDocument?.fileType ==
                                  "pdf" && (
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

                                {file?.supportTicketDocument?.fileType ===
                                  "video" &&
                                  file?.supportTicketDocument?.link && (
                                    <div className="note-download">
                                      <div className="note-info">
                                        <span className="note-icon">
                                          {file.supportTicketDocument.link.includes(
                                            "youtube.com"
                                          ) ||
                                          file.supportTicketDocument.link.includes(
                                            "youtu.be"
                                          ) ? (
                                            // YouTube video
                                            <iframe
                                              width="100%"
                                              height="100px"
                                              src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                                file.supportTicketDocument.link
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
                                                  file.supportTicketDocument
                                                    .link
                                                }
                                                type="video/mp4"
                                              />
                                              Your browser does not support the
                                              video tag.
                                            </video>
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                {file?.supportTicketDocument?.fileType ===
                                  "zip" && (
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

                                {file?.supportTicketDocument?.fileType ===
                                  "csv" && (
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
                                  {/* <Link className="dropdown-item" to="#">
                                        <i className="ti ti-edit text-blue" />
                                        Edit
                                      </Link> */}
                                  {/* <Link className="dropdown-item" to="#">
                                        <i className="ti ti-trash text-danger" />
                                        Delete
                                      </Link> */}
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
        {/*Ticket Activities */}
      </div>

      {/* /Page Wrapper */}

      {/* call */}
      <CreateCall
        taskDetails={ticketData}
        fetchTaskDetails={fetchTaskLogData}
      />
      <RescheduleCall
        fetchTaskLogData={fetchTaskLogData}
        taskDetails={ticketData}
      />
      <AddCallComment
        fetchTaskLogData={fetchTaskLogData}
        taskLogId={taskLogId}
      />
      {/*call  */}

      {/* meeting */}
      <CreateMeeting
        taskDetails={ticketData}
        fetchTaskDetails={fetchTaskLogData}
      />
      <RescheduleMeeting
        fetchTaskLogData={fetchTaskLogData}
        taskDetails={ticketData}
      />
      <AddMeetingComment
        fetchTaskLogData={fetchTaskLogData}
        taskLogId={taskLogId}
      />
      {/* meeting */}

      {/*Comment*/}
      <CreateComment
        taskDetails={ticketData}
        fetchTaskDetails={fetchTaskLogData}
      />
      {/*Comment*/}

      {/* Files */}
      <AddTaskDocuments
        fetchLeadFollowupData={fetchTaskLogData}
        taskDetails={ticketData}
      />
      {/* Files */}

      <TaskStatus taskRecord={data} fetchTaskData={fetchTaskDetails} />

      <AssignedTo
        taskRecord={data}
        fetchTaskData={handleRefresh}
        staffOptions={[]}
      />
    </Fragment>
  );
};

export default TicketPreview;
