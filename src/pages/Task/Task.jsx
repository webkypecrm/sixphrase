import React, { useState } from "react";
import { Link } from "react-router-dom";
import { taskData } from "../../data/taskData";
import ImageWithBasePath from "../../components/ImageWithBasePath";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     setActivityTogglePopup,
//     setActivityTogglePopupTwo,
// } from "../../../core/data/redux/commonSlice";
import {
  activeList,
  initialSettings,
  options1,
  priorityList,
} from "../../selectOption/selectOption";
import Select from "react-select";
import DatePicker from "react-datepicker";
import DateRangePicker from "react-bootstrap-daterangepicker";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
// import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import { all_routes } from "../Router/all_routes";
import DefaultEditor from "react-simple-wysiwyg";
import { TagsInput } from "react-tag-input-component";
import DataTable from "../../components/Table/DataTable";
import "react-datepicker/dist/react-datepicker.css";
import PageHeader from "../../components/Layouts/PageHeader";
import CampaignStatus from "../../components/Layouts/CampaignStatus/Index";

const Task = () => {
  const [tagValue, setTagValue] = useState(["Collab"]);
  const [activityToggle, setActivityToggle] = useState(false);
  const [activityToggleTwo, setActivityToggleTwo] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const route = all_routes;

  const dataSource = taskData;

  const [stars, setStars] = useState({});

  const initializeStarsState = () => {
    const starsState = {};
    taskData.forEach((item, index) => {
      starsState[index] = false;
    });
    setStars(starsState);
  };

  React.useEffect(() => {
    initializeStarsState();
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };

  const meetingMode = [
    { value: "Choose", label: "Choose" },
    { value: "Calls", label: "Calls" },
    { value: "Email", label: "Email" },
    { value: "Meeting", label: "Meeting" },
  ];

  const columns = [
    // {
    //     title: "",
    //     dataIndex: "",
    //     render: (text, record, index) => (
    //         <div
    //             className={`set-star rating-select ${stars[index] ? "filled" : ""}`}
    //             onClick={() => handleStarToggle(index)}
    //         >
    //             <i className="fa fa-star"></i>
    //         </div>
    //     ),
    // },
    {
      title: "Task ID",
      dataIndex: "taskId",
      key: "taskId",
      render: (text, record, index) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setActivityToggleTwo(!activityToggle)}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record, index) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setActivityToggleTwo(!activityToggle)}
        >
          {/* {text} */}
        </div>
      ),
    },
    {
      title: "Category",
      // dataIndex: "category",
      // key: "category",
      render: () => {
        return (
          <ul
            style={{ cursor: "pointer" }}
            onClick={() => setActivityToggleTwo(!activityToggle)}
          >
            <li> Payment</li>
            <li> Payment Collection</li>
          </ul>
        );
      },
    },
    {
      title: "Type",
      // dataIndex: "type",
      // key: "taskId",
      render: () => {
        return (
          <ul
            style={{ cursor: "pointer" }}
            onClick={() => setActivityToggleTwo(!activityToggle)}
          >
            <li>Lead</li>
            <li>Gajendra </li>
          </ul>
        );
      },
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy",
      key: "assignedBy",
      render: (text, record) => (
        <h2
          className="table-avatar d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => setActivityToggleTwo(!activityToggle)}
        >
          <Link to="#" className="avatar">
            <ImageWithBasePath
              className="avatar-img"
              src={record.assignedByAvatar}
              alt="User Image"
            />
          </Link>
          <Link to="#" className="profile-split d-flex flex-column">
            {record.assignedBy}
            <span>CEO</span>
          </Link>
        </h2>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (dataIndex) => {
        return (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setActivityToggleTwo(!activityToggle)}
          >
            <span>{dataIndex.slice(0, 12)}</span>
            <p>{dataIndex.slice(12)}</p>
          </div>
        );
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text, record, index) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setActivityToggleTwo(!activityToggle)}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (text, record) => (
        <h2 className="table-avatar d-flex align-items-center">
          <Link to="#" className="avatar">
            <ImageWithBasePath
              className="avatar-img"
              src={record.assignedToAvatar}
              alt="User Image"
            />
          </Link>
          <Link to="#" className="profile-split d-flex flex-column">
            {record.assignedTo} <span>{record.role} </span>
          </Link>
        </h2>
      ),
    },
    {
      title: "Last Reply",
      dataIndex: "lastReply",
      key: "lastReply",
      render: (text, record, index) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setActivityToggleTwo(!activityToggle)}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (text) => (
        <div>
          {text === "Medium" && (
            <span className="badge badge-tag badge-warning-light">{text}</span>
          )}
          {text === "Low" && (
            <span className="badge badge-tag badge-purple-light">{text}</span>
          )}
          {text === "High" && (
            <span className="badge badge-tag badge-danger-light">{text}</span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div>
          {text === "Resolved" && (
            <span className="badge badge-pill badge-status bg-success">
              {text}
            </span>
          )}
          {text === "Closed" && (
            <span className="badge badge-pill badge-status bg-info">
              {text}
            </span>
          )}
          {text === "Pending" && (
            <span className="badge badge-pill badge-status bg-warning">
              {text}
            </span>
          )}
          {text === "Open" && (
            <span className="badge badge-pill badge-status bg-danger">
              {text}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v"></i>
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item edit-popup"
              to="#"
              onClick={() => setActivityToggleTwo(!activityToggleTwo)}
            >
              <i className="ti ti-edit text-blue"></i> Update
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_activity"
            >
              <i className="ti ti-trash text-danger" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <PageHeader title="Task" count="123" />
              {/* /Page Header */}

              {/* Campaign Status */}
              <CampaignStatus />
              {/* /Campaign Status */}

              <div className="card main-card">
                <div className="card-body">
                  {/* Search */}
                  <div className="search-section">
                    <div className="row">
                      <div
                        className="col-md-5 col-sm-4"
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "baseline",
                          gap: "20px",
                        }}
                      >
                        <div className="sortby-list">
                          <ul>
                            <li>
                              <div className="sort-dropdown drop-down task-drops">
                                <Link
                                  to="#"
                                  className="dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                >
                                  All Tasks{" "}
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-start">
                                  <ul>
                                    <li>
                                      <Link to={route.tasks}>
                                        <i className="ti ti-dots-vertical" />
                                        All Tasks
                                      </Link>
                                    </li>
                                    <li>
                                      <Link to={route.tasksImportant}>
                                        <i className="ti ti-dots-vertical" />
                                        Important
                                      </Link>
                                    </li>
                                    <li>
                                      <Link to={route.tasksCompleted}>
                                        <i className="ti ti-dots-vertical" />
                                        Completed
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div className="form-wrap icon-form">
                          <span className="form-icon">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Task"
                          />
                        </div>
                      </div>
                      <div className="col-md-7 col-sm-8">
                        <div className="export-list text-sm-end">
                          <ul>
                            <li className="all-read">
                              <label className="checkboxs">
                                <input type="checkbox" />
                                <span className="checkmarks" />
                                Mark all as read
                              </label>
                            </li>

                            <li>
                              <div className=" icon-form">
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
                                  {/* Filter */}
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
                                            to={route.contactList}
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
                              <Link
                                to="#"
                                className="btn btn-primary add-popup"
                                onClick={() =>
                                  setActivityToggle((prev) => !prev)
                                }
                              >
                                <i className="ti ti-square-rounded-plus" />
                                Add New Taskk
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Search */}

                  {/* Recent Task List */}
                  <div className="task-wrapper">
                    <Link
                      to="#"
                      className="task-accordion"
                      data-bs-toggle="collapse"
                      data-bs-target="#recent"
                    >
                      <h4>
                        Recent<span>24</span>
                      </h4>
                    </Link>

                    <div
                      className="tasks-activity tasks collapse show"
                      id="recent"
                    >
                      <ul>
                        <div className="table-responsive custom-table">
                          <DataTable
                            columns={columns}
                            dataSource={dataSource}
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
                      </ul>
                    </div>
                  </div>
                  {/* /Recent Task List */}
                  {/* Task List */}
                  <div className="task-wrapper">
                    <Link
                      to="#"
                      className="task-accordion"
                      data-bs-toggle="collapse"
                      data-bs-target="#yesterday"
                    >
                      <h4>Yesterday</h4>
                    </Link>

                    <div
                      className="tasks-activity tasks collapse show"
                      id="yesterday"
                    >
                      <ul>
                        <div className="table-responsive custom-table">
                          <DataTable
                            columns={columns}
                            dataSource={dataSource}
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
                      </ul>
                    </div>
                  </div>
                  {/* /Task List */}
                  {/* Task List */}
                  <div className="task-wrapper">
                    <Link
                      to="#"
                      className="task-accordion"
                      data-bs-toggle="collapse"
                      data-bs-target="#date-01"
                    >
                      <h4>23 Oct 2023</h4>
                    </Link>
                    <div
                      className="tasks-activity tasks collapse show"
                      id="date-01"
                    >
                      <ul>
                        <li className="task-wrap warning">
                          <div className="task-info">
                            <span className="task-icon">
                              <i className="ti ti-grip-vertical" />
                            </span>
                            <div className="task-checkbox">
                              <label className="checkboxs">
                                <input type="checkbox" />
                                <span className="checkmarks" />
                              </label>
                            </div>
                            <div className="set-star rating-select">
                              <i className="fa fa-star" />
                            </div>
                            <p>Design description banner &amp; landing page</p>
                            <span className="badge activity-badge bg-blue">
                              <i className="ti ti-subtask" /> Task
                            </span>
                            <span className="badge badge-tag bg-warning">
                              Inprogress
                            </span>
                          </div>
                          <div className="task-actions">
                            <ul>
                              <li className="task-time">
                                <span className="badge badge-tag badge-success-light">
                                  Collab
                                </span>
                                <span className="badge badge-tag badge-warning-light">
                                  Rated
                                </span>
                              </li>
                              <li className="task-date">
                                <i className="ti ti-calendar-exclamation" />
                                23 Oct 2023
                              </li>
                              <li className="task-owner">
                                <div className="task-user">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-14.jpg"
                                    alt="img"
                                  />
                                </div>
                                <div className="dropdown table-action">
                                  <Link
                                    to="#"
                                    className="action-icon "
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="fa fa-ellipsis-v" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link
                                      className="dropdown-item edit-popup"
                                      to="#"
                                      onClick={() =>
                                        setActivityToggleTwo(!activityToggleTwo)
                                      }
                                    >
                                      <i className="ti ti-edit text-blue" />{" "}
                                      Update
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete_activity"
                                    >
                                      <i className="ti ti-trash text-danger" />{" "}
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </li>
                        <li className="task-wrap  success">
                          <div className="task-info">
                            <span className="task-icon">
                              <i className="ti ti-grip-vertical" />
                            </span>
                            <div className="task-checkbox">
                              <label className="checkboxs">
                                <input type="checkbox" />
                                <span className="checkmarks" />
                              </label>
                            </div>
                            <div className="set-star rating-select">
                              <i className="fa fa-star" />
                            </div>
                            <p>
                              <del>
                                Make sure all the padding should be 24px
                              </del>
                            </p>
                            <span className="badge badge-pill badge-status bg-green">
                              <i className="ti ti-phone" />
                              Calls
                            </span>
                            <span className="badge badge-tag bg-success">
                              Completed
                            </span>
                          </div>
                          <div className="task-actions">
                            <ul>
                              <li className="task-time">
                                <span className="badge badge-tag badge-purple-light">
                                  Promotion
                                </span>
                              </li>
                              <li className="task-date">
                                <i className="ti ti-calendar-exclamation" />
                                23 Oct 2023
                              </li>
                              <li className="task-owner">
                                <div className="task-user">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-14.jpg"
                                    alt="img"
                                  />
                                </div>
                                <div className="dropdown table-action">
                                  <Link
                                    to="#"
                                    className="action-icon "
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="fa fa-ellipsis-v" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link
                                      className="dropdown-item edit-popup"
                                      to="#"
                                      onClick={() =>
                                        setActivityToggleTwo(!activityToggleTwo)
                                      }
                                    >
                                      <i className="ti ti-edit text-blue" />{" "}
                                      Update
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete_activity"
                                    >
                                      <i className="ti ti-trash text-danger" />{" "}
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /Task List */}
                  {/* Task List */}
                  <div className="task-wrapper">
                    <Link
                      to="#"
                      className="task-accordion"
                      data-bs-toggle="collapse"
                      data-bs-target="#date-02"
                    >
                      <h4>22 Oct 2023</h4>
                    </Link>
                    <div
                      className="tasks-activity tasks collapse show"
                      id="date-02"
                    >
                      <ul>
                        <li className="task-wrap  success">
                          <div className="task-info">
                            <span className="task-icon">
                              <i className="ti ti-grip-vertical" />
                            </span>
                            <div className="task-checkbox">
                              <label className="checkboxs">
                                <input type="checkbox" />
                                <span className="checkmarks" />
                              </label>
                            </div>
                            <div className="set-star rating-select">
                              <i className="fa fa-star" />
                            </div>
                            <p>
                              <del>Use border radius as 5px or 10 px</del>
                            </p>
                            <span className="badge badge-pill badge-status bg-purple">
                              <i className="ti ti-user-share" />
                              Meeting
                            </span>
                            <span className="badge badge-tag bg-success">
                              Completed
                            </span>
                          </div>
                          <div className="task-actions">
                            <ul>
                              <li className="task-time">
                                <span className="badge badge-tag badge-danger-light">
                                  Rejected
                                </span>
                                <span className="badge badge-tag badge-success-light">
                                  Collab
                                </span>
                              </li>
                              <li className="task-date">
                                <i className="ti ti-calendar-exclamation" />
                                22 Oct 2023
                              </li>
                              <li className="task-owner">
                                <div className="task-user">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-14.jpg"
                                    alt="img"
                                  />
                                </div>
                                <div className="dropdown table-action">
                                  <Link
                                    to="#"
                                    className="action-icon "
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="fa fa-ellipsis-v" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-right">
                                    <Link
                                      className="dropdown-item edit-popup"
                                      to="#"
                                      onClick={() =>
                                        setActivityToggleTwo(!activityToggleTwo)
                                      }
                                    >
                                      <i className="ti ti-edit text-blue" />{" "}
                                      Update
                                    </Link>
                                    <Link
                                      className="dropdown-item"
                                      to="#"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete_activity"
                                    >
                                      <i className="ti ti-trash text-danger" />{" "}
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* /Task List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Add New Task */}
      <div
        className={
          activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout">
          <div className="sidebar-header">
            <h4>Add New Task</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setActivityToggle(!activityToggle)}
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
                      <div
                        className="radio-wrap"
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          gap: "20px",
                        }}
                      >
                        <label className="col-form-label">Task Type :</label>
                        <div className="d-flex flex-wrap">
                          <div className="radio-btn">
                            <input
                              type="radio"
                              className="status-radio"
                              id="lead"
                              name="leave"
                              defaultChecked
                            />
                            <label htmlFor="lead">Lead</label>
                          </div>
                          <div className="radio-btn">
                            <input
                              type="radio"
                              className="status-radio"
                              id="company"
                              name="leave"
                            />
                            <label htmlFor="company">Company</label>
                          </div>
                          <div className="radio-btn">
                            <input
                              type="radio"
                              className="status-radio"
                              id="order"
                              name="leave"
                            />
                            <label htmlFor="order">Order</label>
                          </div>
                          <div className="radio-btn">
                            <input
                              type="radio"
                              className="status-radio"
                              id="project"
                              name="leave"
                            />
                            <label htmlFor="project">Project</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">Select Lead</label>

                      <Select
                        options={[
                          { value: "Choose", label: "Choose" },
                          {
                            value: "LID:0001",
                            label: "LID:0001 | GAJENDRA | 8130352808 | Webkype",
                          },
                        ]}
                        className="select2"
                        placeholder="Choose"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="col-form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <div className="form-wrap icon-form">
                      <Select
                        options={meetingMode}
                        className="select2"
                        placeholder="Choose"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="col-form-label">
                      Sub Category <span className="text-danger">*</span>
                    </label>
                    <div className="form-wrap icon-form">
                      <Select
                        options={[{ value: "Choose", label: "Choose" }]}
                        className="select2"
                        placeholder="Choose"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>

                    {/* <div className="form-wrap">
                                            <label className="col-form-label">
                                                Responsible Persons{" "}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <SelectWithImage2 />
                                        </div> */}
                  </div>

                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">Priority</label>
                      <div className="select-priority">
                        <span className="select-icon">
                          <i className="ti ti-square-rounded-filled" />
                        </span>

                        <Select
                          options={priorityList}
                          className="select2"
                          placeholder="Choose"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Assign To (Responsible Persons)
                      </label>
                      <Select
                        options={[{ value: "Choose", label: "Choose" }]}
                        className="select2"
                        placeholder="Choose"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="col-form-label">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <div className="form-wrap icon-form">
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
                  <div className="col-md-6">
                    <label className="col-form-label">
                      Due Date <span className="text-danger">*</span>
                    </label>
                    <div className="form-wrap icon-form">
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

                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">Status</label>

                      <Select
                        options={activeList}
                        className="select"
                        placeholder="Active"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="radio-wrap form-wrap">
                      <label className="col-form-label">Visibility</label>
                      <div className="d-flex flex-wrap">
                        <div className="radio-btn">
                          <input
                            type="radio"
                            className="status-radio"
                            id="public"
                            name="visible"
                          />
                          <label htmlFor="public">Public</label>
                        </div>
                        <div className="radio-btn">
                          <input
                            type="radio"
                            className="status-radio"
                            id="private"
                            name="visible"
                          />
                          <label htmlFor="private">Private</label>
                        </div>
                      </div>
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

                  {/* <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Tags <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="input-tags form-control"
                                                type="text"
                                                data-role="tagsinput"
                                                name="Label"
                                                defaultValue="Promotion, Collab"
                                            />
                                        </div>
                                    </div> */}

                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Tags <span className="text-danger">*</span>
                      </label>

                      <TagsInput
                        className="input-tags form-control"
                        value={tagValue}
                        onChange={setTagValue}
                      />
                    </div>
                  </div>

                  <div className="form-wrap">
                    <label className="col-form-label">
                      Attachment <span className="text-danger">*</span>
                    </label>
                    <div className="drag-attach">
                      <input type="file" />
                      <div className="img-upload">
                        <i className="ti ti-file-broken" />
                        Upload File
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="submit-button text-end">
                <Link
                  to="#"
                  className="btn btn-light sidebar-close"
                  onClick={() => {
                    setActivityToggle(!activityToggle);
                  }}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitLoading}
                >
                  {isSubmitLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Create
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add New Task */}

      {/* Edit Company */}
      <div
        className={
          activityToggleTwo ? "toggle-popup1 sidebar-popup" : "toggle-popup1"
        }
      >
        <div className="sidebar-layout">
          <div className="sidebar-header">
            <h4>Edit Company</h4>
            <Link
              to="#"
              className="sidebar-close1 toggle-btn"
              onClick={() => setActivityToggleTwo(!activityToggleTwo)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <form action="#" className="toggle-height">
              <div className="pro-create">
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
                      Task Details
                    </Link>
                    <div
                      className="accordion-collapse collapse show"
                      id="edit-basic"
                      data-bs-parent="#list-accords"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="tab-pane active show">
                            <div className="contact-activity">
                              <ul>
                                <li className="activity-wrap">
                                  <div className="activity-info">
                                    <h6>Support for theme</h6>
                                    <p>#4987</p>
                                  </div>
                                </li>
                                <li className="activity-wrap">
                                  <div className="activity-info">
                                    <h6>Payment</h6>
                                    <p>Payment Collection</p>
                                  </div>
                                </li>
                                <li className="activity-wrap">
                                  <div className="activity-info">
                                    <h6>Lead</h6>
                                    <p>Gajendra</p>
                                  </div>
                                </li>
                              </ul>
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
                      Update Task
                    </Link>
                    <div
                      className="accordion-collapse collapse"
                      id="edit-address"
                      data-bs-parent="#list-accords"
                    >
                      <div className="content-collapse">
                        <div className="row">
                          <div className="col-md-6">
                            <label className="col-form-label">
                              Start Date <span className="text-danger">*</span>
                            </label>
                            <div className="form-wrap icon-form">
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
                          <div className="col-md-6">
                            <label className="col-form-label">
                              Due Date <span className="text-danger">*</span>
                            </label>
                            <div className="form-wrap icon-form">
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
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">Priority</label>
                              <div className="select-priority">
                                <span className="select-icon">
                                  <i className="ti ti-square-rounded-filled" />
                                </span>

                                <Select
                                  options={priorityList}
                                  className="select2"
                                  placeholder="Choose"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Assign To (Responsible Persons)
                              </label>
                              <Select
                                options={[{ value: "Choose", label: "Choose" }]}
                                className="select2"
                                placeholder="Choose"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
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
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
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
                          <div className="col-lg-12">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Comments <span className="text-danger">*</span>
                              </label>
                              <DefaultEditor className="summernote" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Address Info */}
                  {/* History */}
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
                      History
                    </Link>
                    <div
                      className="accordion-collapse collapse"
                      id="edit-social"
                      data-bs-parent="#list-accords"
                    >
                      <div className="tab-pane active show">
                        <div className="contact-activity">
                          <div className="badge-day">
                            <i className="ti ti-calendar-check" />
                            29 Aug 2023
                          </div>
                          <ul>
                            <li className="activity-wrap">
                              <span className="activity-icon bg-pending">
                                <i className="ti ti-mail-code" />
                              </span>
                              <div className="activity-info">
                                <h6>You sent 1 Message to the contact.</h6>
                                <p>10:25 pm</p>
                              </div>
                            </li>
                            <li className="activity-wrap">
                              <span className="activity-icon bg-secondary-success">
                                <i className="ti ti-phone" />
                              </span>
                              <div className="activity-info">
                                <h6>
                                  Denwar responded to your appointment schedule
                                  question by call at 09:30pm.
                                </h6>
                                <p>09:25 pm</p>
                              </div>
                            </li>
                            <li className="activity-wrap">
                              <span className="activity-icon bg-orange">
                                <i className="ti ti-notes" />
                              </span>
                              <div className="activity-info">
                                <h6>Notes added by Antony</h6>
                                <p>
                                  Please accept my apologies for the
                                  inconvenience caused. It would be much
                                  appreciated if it's possible to reschedule to
                                  6:00 PM, or any other day that week.
                                </p>
                                <p>10.00 pm</p>
                              </div>
                            </li>
                          </ul>
                          <div className="badge-day">
                            <i className="ti ti-calendar-check" />
                            28 Feb 2024
                          </div>
                          <ul>
                            <li className="activity-wrap">
                              <span className="activity-icon bg-info">
                                <i className="ti ti-user-pin" />
                              </span>
                              <div className="activity-info">
                                <h6>
                                  Meeting With{" "}
                                  <span className="avatar-xs">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-19.jpg"
                                      alt="img"
                                    />
                                  </span>{" "}
                                  Abraham
                                </h6>
                                <p>Schedueled on 05:00 pm</p>
                              </div>
                            </li>
                            <li className="activity-wrap">
                              <span className="activity-icon bg-secondary-success">
                                <i className="ti ti-phone" />
                              </span>
                              <div className="activity-info">
                                <h6>
                                  Drain responded to your appointment schedule
                                  question.
                                </h6>
                                <p>09:25 pm</p>
                              </div>
                            </li>
                          </ul>
                          <div className="badge-day">
                            <i className="ti ti-calendar-check" />
                            Upcoming Activity
                          </div>
                          <ul>
                            <li className="activity-wrap">
                              <span className="activity-icon bg-info">
                                <i className="ti ti-user-pin" />
                              </span>
                              <div className="activity-info">
                                <h6>Product Meeting</h6>
                                <p>
                                  A product team meeting is a gathering of the
                                  cross-functional product team — ideally
                                  including team members from product,
                                  engineering, marketing, and customer support.
                                </p>
                                <p>25 Jul 2023, 05:00 pm</p>
                                <div className="upcoming-info">
                                  <div className="row">
                                    <div className="col-sm-4">
                                      <p>Reminder</p>
                                      <div className="dropdown">
                                        <Link
                                          to="#"
                                          className="dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="ti ti-clock-edit me-1" />
                                          Reminder
                                          <i className="ti ti-chevron-down ms-1" />
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            Remainder
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            1 hr
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            10 hr
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-4">
                                      <p>Task Priority</p>
                                      <div className="dropdown">
                                        <Link
                                          to="#"
                                          className="dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                          High
                                          <i className="ti ti-chevron-down ms-1" />
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                            High
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                            Low
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-sm-4">
                                      <p>Assigned to</p>
                                      <div className="dropdown">
                                        <Link
                                          to="#"
                                          className="dropdown-toggle"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <ImageWithBasePath
                                            src="assets/img/profiles/avatar-19.jpg"
                                            alt="img"
                                            className="avatar-xs"
                                          />
                                          John
                                          <i className="ti ti-chevron-down ms-1" />
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            <ImageWithBasePath
                                              src="assets/img/profiles/avatar-19.jpg"
                                              alt="img"
                                              className="avatar-xs"
                                            />
                                            John
                                          </Link>
                                          <Link
                                            className="dropdown-item"
                                            to="#"
                                          >
                                            <ImageWithBasePath
                                              src="assets/img/profiles/avatar-19.jpg"
                                              alt="img"
                                              className="avatar-xs"
                                            />
                                            Peter
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* History*/}
                </div>
              </div>
              <div className="submit-button text-end">
                <Link to="#" className="btn btn-light sidebar-close1">
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
      {/* /Edit Company */}

      {/* Delete Task */}
      <div
        className="modal custom-modal fade"
        id="delete_activity"
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
                <h3>Remove Task?</h3>
                <p className="del-info">
                  Are you sure you want to remove task you selected.
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
      {/* /Delete ActivTaskity */}
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
                  <button type="submit" className="btn btn-danger">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add New View */}
    </>
  );
};

export default Task;
