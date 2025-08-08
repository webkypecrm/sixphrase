import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import Select from "react-select";
import { lastModified, recent } from "../../selectOption/selectOption";
// import TodoModal from "../../core/modals/todoModal";
import axios from "axios";
import { toast } from "react-toastify";
import { use } from "react";
import AddTask from "../../components/Task/AddTask";

const Todo = () => {
  const [taskData, setTaskData] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [count, setCount] = useState(0);
  const [activityToggle, setActivityToggle] = useState(false);
  const [taskCategoryOptions, setTaskCategoryOptions] = useState([]);
  const [taskSubCategoryOptions, setTaskSubCategoryOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);
  const [leadOptions, setLeadOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [taskDetails, setTaskDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [taskId, setTaskId] = useState(null);
  const [searchData, setSearchData] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const navigate = useNavigate();

  const navigateClose = () => {
    navigate(`/application/todo?status=closed`);
  };

  const navigateHome = () => {
    navigate(`/application/todo`);
  };

  const priorityColorMap = {
    low: "#FDA700",
    medium: "#4A00E5",
    high: "#FF0000",
  };
  const statusColorMap = {
    pending: "#FDA700",
    open: "#288EC7",
    closed: "#A02F7A",
  };

  const getDateLabel = (dateStr) => {
    const taskDate = moment(dateStr).startOf("day");
    const today = moment().startOf("day");
    const diff = taskDate.diff(today, "days");

    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";
    return taskDate.format("DD MMM YYYY");
  };

  // get Task
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const priority = searchParams.get("priority");
  const status = searchParams.get("status");

  console.log("status", searchData);
  const getAllTask = async () => {
    try {
      let url = `${apiUrl}/task/task-list?page=1&pageSize=50`;
      if (!search) url += `&search=${searchData}`;
      if (priority) url += `&priority=${priority}`;
      if (status) url += `&status=${status}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      const data = res?.data?.data || [];
      setTaskData(res?.data?.data);
      setCount(res?.data?.TotalCount);
      console.log("allTask", res.data);
      // Group by date
      const grouped = data.reduce((acc, task) => {
        const label = getDateLabel(task.startDate);
        if (!acc[label]) acc[label] = [];
        acc[label].push(task);
        return acc;
      }, {});
      setGroupedTasks(grouped);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getAllTask();
  }, [status, searchData, priority]);

  // const options = [
  //   { value: "bulk-actions", label: "Bulk Actions" },
  //   { value: "delete-marked", label: "Delete Marked" },
  //   { value: "unmark-all", label: "Unmark All" },
  //   { value: "mark-all", label: "Mark All" },
  // ];

  // Task Category
  const fetchTaskCategoryData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/task-category-list`);
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setTaskCategoryOptions(formattedData);
      setIsLoading(false);
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
    }
  };

  const fetchTaskSubCategoryData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/master/task-sub-category-list`
      );
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setTaskSubCategoryOptions(formattedData);
      setIsLoading(false);
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
    }
  };

  const fetchLeadData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/lead/leadDropdown`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      const formattedData = response.data.data.map((item) => ({
        label: `leadId:${item.leadId} | ${item.leadName} | ${item.leadMobile1} |
                   ${
                     item?.company?.companyName ? item.company.companyName : ""
                   }`,
        value: item.leadId,
      }));

      setLeadOptions(formattedData);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/customer/customerDropdown`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      const formattedData = response.data.data.map((item) => ({
        label: `customerId:${item.customerId} | ${item.customerName} | ${
          item.customerMobile1
        } |
                   ${
                     item?.company?.companyName ? item.company.companyName : ""
                   }`,
        value: item.convertedLeadId,
      }));

      setCustomerOptions(formattedData);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  const fetchStaffData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/staff/staff-list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      const formattedData = response.data.data.map((item) => ({
        label: item.name,
        value: item.staffId,
      }));
      setStaffOptions(() => [...formattedData]);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    // fetchTaskData();
    fetchTaskCategoryData();
    fetchTaskSubCategoryData();
    fetchLeadData();
    fetchStaffData();
    fetchCustomerData();
  }, []);

  // delete Task
  const handleDelete = async () => {
    if (taskId) {
      try {
        await axios.delete(`${apiUrl}/task/delete-task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        getAllTask();
        toast.success("Task deleted successfully!");
        // setTaskId(null)
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <Fragment>
      <div className="page-wrapper notes-page-wrapper">
        <div className="content">
          <div className="page-header page-add-notes">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4>Todo</h4>
                <h6>Manage your tasks</h6>
              </div>
              <Link id="toggle_btn2" className="notes-tog" to="#">
                <i className="fas fa-chevron-left" />
              </Link>
            </div>
            <div className="d-flex flex-sm-row flex-column align-items-sm-center align-items-start">
              {/* <div className="input-block add-lists todo-inbox-check">
                <label className="checkboxs">
                  <input type="checkbox" defaultChecked={true} />
                  <span className="checkmarks" />
                  Mark all as Complete
                </label>
              </div> */}
              <div className="form-sort me-2 mb-sm-0 mb-3">
                <i data-feather="sliders" className="info-img" />

                <Select
                  className="select"
                  classNamePrefix="react-select"
                  options={lastModified}
                  placeholder="Sort by Date"
                />
              </div>
              <div className="page-btn">
                <Link
                  to="#"
                  className="btn btn-added"
                  // data-bs-toggle="modal"
                  // data-bs-target="#note-units"
                  onClick={() => setActivityToggle((prev) => !prev)}
                >
                  <i className="feather feather-plus-circle me-2" /> Add Task{" "}
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-3 col-md-12 sidebars-right theiaStickySidebar section-bulk-widget">
              <div className="stickybar">
                <div className="notes-dash">
                  <div className="notes-top-head">
                    <h5>
                      {" "}
                      <i
                        data-feather="file-text"
                        className="feather-file-text"
                      />{" "}
                      Todo List
                    </h5>
                  </div>
                  <div className="notes-top-head-submenu">
                    <div
                      className="nav flex-column nav-pills todo-inbox"
                      id="v-pills-tab"
                      role="tablist"
                      aria-orientation="vertical"
                    >
                      <button
                        className={`nav-link todo-tab todo-inbox ${
                          activeTab === "inbox" ? "active" : ""
                        }`}
                        id="v-pills-profile-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#v-pills-profile"
                        type="button"
                        role="tab"
                        aria-controls="v-pills-profile"
                        aria-selected="true"
                        onClick={() => {
                          setActiveTab("inbox");
                          navigateHome();
                        }}
                      >
                        {" "}
                        <i data-feather="inbox" className="feather-inbox" />
                        Inbox <span className="ms-2">{count}</span>
                      </button>
                      <button
                        className={`nav-link todo-tab todo-inbox ${
                          activeTab === "done" ? "active" : ""
                        }`}
                        type="button"
                        role="tab"
                        onClick={() => {
                          setActiveTab("done");
                          navigateClose();
                        }}
                      >
                        {" "}
                        <i
                          data-feather="check-circle"
                          className="feather-check-circle"
                        />
                        Done
                      </button>
                      {/* <button
                      className="nav-link todo-tab-btn todo-inbox"
                      id="v-pills-messages-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-messages"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-messages"
                      aria-selected="false"
                    >
                      {" "}
                      <i data-feather="star" className="feather-star" />{" "}
                      Important
                    </button> */}
                      {/* <button
                      className="nav-link todo-tab todo-inbox mb-0"
                      id="v-pills-settings-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-settings"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-settings"
                      aria-selected="false"
                    >
                      {" "}
                      <i data-feather="trash-2" className="feather-trash-2" />
                      Trash
                    </button> */}
                    </div>
                  </div>
                  <div className="content-submenu-tag">
                    <h6>Status</h6>
                    <ul className="tags-list">
                      <li className="personal">
                        <Link to={`/application/todo?status=open`}>
                          <span>
                            <i className="fas fa-square" />
                          </span>
                          Open
                        </Link>
                      </li>
                      <li className="social">
                        <Link to={`/application/todo?status=pending`}>
                          <span>
                            <i className="fas fa-square" />
                          </span>
                          Pending
                        </Link>
                      </li>
                      <li className="public">
                        <Link to={`/application/todo?status=closed`}>
                          <span>
                            <i className="fas fa-square" />
                          </span>
                          Close
                        </Link>
                      </li>
                      {/* <li className="work">
                      <Link to="#">
                        <span>
                          <i className="fas fa-square" />
                        </span>
                        Done
                      </Link>
                    </li> */}
                    </ul>
                    <h6>Priority</h6>
                    <ul className="priority-list">
                      <li className="medium">
                        <Link to={`/application/todo?priority=medium`}>
                          <span>
                            <i className="fas fa-square" />
                          </span>
                          Medium
                        </Link>
                      </li>
                      <li className="high">
                        <Link to={`/application/todo?priority=high`}>
                          <span>
                            <i className="fas fa-square" />
                          </span>
                          High
                        </Link>
                      </li>
                      <li className="low">
                        <Link to={`/application/todo?priority=low`}>
                          <span>
                            <i className="fas fa-square" />
                          </span>
                          Low
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9 budget-role-notes">
              <div className="section-bulk-wrap">
                <div className="bulk-action-type">
                  {/* <div className="form-sort select-bluk">
                  <Select
                    options={options}
                    className="select"
                     classNamePrefix="react-select"
                  />
                </div>
                <Link to="" className="btn btn-added ">
                  Apply
                </Link> */}
                  <div className="search-set">
                    <div className="search-input">
                      <Link to="" className="btn btn-searchset">
                        <i data-feather="search" className="feather-search" />
                      </Link>
                      <div
                        id="DataTables_Table_0_filter"
                        className="dataTables_filter"
                      >
                        <label>
                          {" "}
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search"
                            onChange={(e) => setSearchData(e.target.value)}
                            value={searchData}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-sort">
                  <i data-feather="filter" className="feather-filter" />
                  <Select
                    className="select"
                    classNamePrefix="react-select"
                    options={recent}
                    placeholder="Recent"
                  />
                </div>
              </div>

              <div className="tab-content" id="v-pills-tabContent">
                <div
                  className="tab-pane fade active show"
                  id="v-pills-profile"
                  role="tabpanel"
                  aria-labelledby="v-pills-profile-tab"
                >
                  <div className="sections-notes-slider">
                    <div className="row">
                      <div className="col-lg-12">
                        <div
                          className="accordion-card-one accordion todo-accordion"
                          id="accordionExample"
                        >
                          {Object.entries(groupedTasks)
                            .sort((a, b) => {
                              const parseDate = (label) => {
                                if (label === "Today") return moment();
                                if (label === "Tomorrow")
                                  return moment().add(1, "day");
                                if (label === "Yesterday")
                                  return moment().subtract(1, "day");
                                return moment(label, "DD MMM YYYY");
                              };

                              return parseDate(b[0]).diff(parseDate(a[0]));
                            })
                            .map(([dateLabel, tasks], index) => (
                              <div className="accordion-item" key={index}>
                                <div
                                  className="accordion-header"
                                  id={`heading${index}`}
                                >
                                  <div
                                    className="accordion-button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse${index}`}
                                    aria-controls={`collapse${index}`}
                                  >
                                    <div
                                      className="notes-content todo-today-content"
                                      style={{
                                        backgroundColor:
                                          dateLabel === "Today"
                                            ? "#FFF9DB"
                                            : "transparent",
                                      }}
                                    >
                                      <div className="notes-header todo-today-header">
                                        <span>
                                          <i
                                            data-feather="calendar"
                                            className="feather-calendar"
                                          />
                                        </span>
                                        <h3>{dateLabel}</h3>
                                        <h6>{tasks.length}</h6>
                                      </div>
                                    </div>
                                    {/* <div className="todo-drop-down">
                <Link to="#">
                  <span>
                    <i className="fas fa-chevron-down" />
                  </span>
                </Link>
              </div> */}
                                  </div>
                                </div>

                                <div
                                  id={`collapse${index}`}
                                  className="accordion-collapse collapse show"
                                  aria-labelledby={`heading${index}`}
                                  data-bs-parent="#accordionExample"
                                >
                                  <div className="accordion-body">
                                    <div className="todo-widget">
                                      {tasks.map((task) => (
                                        <div
                                          className="todo-wrapper-list"
                                          key={task.id}
                                        >
                                          <div className="input-block add-lists todo-inbox-check todo-inbox-check-list">
                                            <div className="todo-wrapper-list-content">
                                              <Link
                                                to={`/task/task-details/${task.taskId}`}
                                              >
                                                <h4>{task.taskTitle}</h4>
                                              </Link>

                                              <p>{task.taskCategoryName}</p>
                                            </div>
                                          </div>
                                          <div className="notes-card-body d-flex align-items-center">
                                            {/* <p className="badge bg-outline-danger badge-lg me-2 mb-0"> */}
                                            <p
                                              className="badge badge-lg me-2 mb-0"
                                              style={{
                                                border: `1px solid ${
                                                  priorityColorMap[
                                                    task.priority
                                                      ?.toLowerCase()
                                                      .trim()
                                                  ] || "#6c757d"
                                                }`,
                                                color:
                                                  priorityColorMap[
                                                    task.priority
                                                      ?.toLowerCase()
                                                      .trim()
                                                  ] || "#6c757d",
                                                backgroundColor: "transparent",
                                              }}
                                            >
                                              <i className="fas fa-circle" />{" "}
                                              {task.priority}
                                            </p>

                                            {/* <p className="badge bg-outline-secondary badge-lg me-2 mb-0"> */}
                                            <p
                                              className="badge badge-lg me-2 mb-0"
                                              style={{
                                                border: `1px solid ${
                                                  statusColorMap[
                                                    task.status
                                                      ?.toLowerCase()
                                                      .trim()
                                                  ] || "#6c757d"
                                                }`,
                                                color:
                                                  statusColorMap[
                                                    task.status
                                                      ?.toLowerCase()
                                                      .trim()
                                                  ] || "#6c757d",
                                                backgroundColor: "transparent",
                                              }}
                                            >
                                              {task.status}
                                            </p>
                                          </div>
                                          <div className="todo-profile d-flex align-items-center">
                                            <img
                                              src={task.createdByImgUrl}
                                              alt="Img"
                                              className="img-fluid"
                                            />
                                            <img
                                              src={task.assignedToImg}
                                              alt="Img"
                                              className="img-fluid"
                                            />
                                          </div>
                                          <div className=" todo-profile d-flex align-items-center">
                                            <Link
                                              to="#"
                                              data-bs-toggle="dropdown"
                                              aria-expanded="false"
                                            >
                                              <i className="fas fa-ellipsis-v" />
                                            </Link>
                                            <div className="dropdown-menu notes-menu dropdown-menu-end">
                                              {/* <Link
                                                to="#"
                                                className="dropdown-item"
                                                data-bs-toggle="modal"
                                                data-bs-target="#delete_task"
                                              >
                                                <span>
                                                  <i data-feather="edit" />
                                                </span>
                                                Edit
                                              </Link> */}
                                              <Link
                                                to="#"
                                                className="dropdown-item"
                                                data-bs-toggle="modal"
                                                data-bs-target="#delete_task"
                                                onClick={() =>
                                                  setTaskId(task.taskId)
                                                }
                                              >
                                                <span>
                                                  <i data-feather="trash-2" />
                                                </span>
                                                Delete
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="tab-pane fade "
                  id="v-pills-home"
                  role="tabpanel"
                  aria-labelledby="v-pills-home-tab"
                >
                  <div className="sections-notes-slider">
                    <div className="row">
                      <div className="todo-widget">
                        <div className="todo-wrapper-list">
                          <div className="input-block add-lists todo-inbox-check todo-inbox-check-list">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                            <div className="todo-wrapper-list-content">
                              <h4>Team meet at Starbucks</h4>
                              <p>Identify the implementation team</p>
                            </div>
                          </div>
                          <div className="notes-card-body d-flex align-items-center">
                            <p className="badge bg-outline-danger badge-lg me-2 mb-0">
                              <i className="fas fa-circle" /> High
                            </p>
                            <p className="badge bg-outline-info badge-lg me-2 mb-0">
                              {" "}
                              Pending
                            </p>
                          </div>
                          <div className=" todo-profile d-flex align-items-center">
                            <ImageWithBasePath
                              src="./assets/img/users/user-03.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                            <Link
                              to="#"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v" />
                            </Link>
                            <div className="dropdown-menu notes-menu dropdown-menu-end">
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#edit-note-units"
                              >
                                <span>
                                  <i data-feather="edit" />
                                </span>
                                Edit
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-note-units"
                              >
                                <span>
                                  <i data-feather="trash-2" />
                                </span>
                                Delete
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i data-feather="star" />
                                </span>
                                Not Important
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#view-note-units"
                              >
                                <span>
                                  <i data-feather="eye" />
                                </span>
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="todo-wrapper-list">
                          <div className="input-block add-lists todo-inbox-check todo-inbox-check-list">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                            <div className="todo-wrapper-list-content">
                              <h4>Meet Lisa to discuss project details</h4>
                              <p>Discuss about additional features</p>
                            </div>
                          </div>
                          <div className="notes-card-body d-flex align-items-center">
                            <p className="badge bg-outline-secondary badge-lg me-2 mb-0">
                              <i className="fas fa-circle" /> Medium
                            </p>
                            <p className="badge bg-outline-warning badge-lg me-2 mb-0">
                              {" "}
                              InProgress
                            </p>
                          </div>
                          <div className=" todo-profile d-flex align-items-center">
                            <ImageWithBasePath
                              src="./assets/img/users/user-04.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                            <Link
                              to="#"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v" />
                            </Link>
                            <div className="dropdown-menu notes-menu dropdown-menu-end">
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#edit-note-units"
                              >
                                <span>
                                  <i data-feather="edit" />
                                </span>
                                Edit
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-note-units"
                              >
                                <span>
                                  <i data-feather="trash-2" />
                                </span>
                                Delete
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i data-feather="star" />
                                </span>
                                Not Important
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#view-note-units"
                              >
                                <span>
                                  <i data-feather="eye" />
                                </span>
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="todo-wrapper-list">
                          <div className="input-block add-lists todo-inbox-check todo-inbox-check-list">
                            <label className="checkboxs active">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                            <div className="todo-wrapper-list-content todo-strike-content">
                              <h4>Download Complete</h4>
                              <p>
                                Install console machines and prerequiste
                                softwares
                              </p>
                            </div>
                          </div>
                          <div className="notes-card-body d-flex align-items-center">
                            <p className="badge bg-outline-warning badge-lg me-2 mb-0">
                              <i className="fas fa-circle" /> Low
                            </p>
                            <p className="badge bg-outline-success badge-lg me-2 mb-0">
                              {" "}
                              Completed
                            </p>
                          </div>
                          <div className=" todo-profile d-flex align-items-center">
                            <ImageWithBasePath
                              src="./assets/img/users/user-05.jpg"
                              alt="Img"
                              className="img-fluid me-0"
                            />
                            <Link to="#" className="inbox-call-profile">
                              Calls
                            </Link>
                            <Link
                              to="#"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v" />
                            </Link>
                            <div className="dropdown-menu notes-menu dropdown-menu-end">
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#edit-note-units"
                              >
                                <span>
                                  <i data-feather="edit" />
                                </span>
                                Edit
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-note-units"
                              >
                                <span>
                                  <i data-feather="trash-2" />
                                </span>
                                Delete
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i data-feather="star" />
                                </span>
                                Not Important
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#view-note-units"
                              >
                                <span>
                                  <i data-feather="eye" />
                                </span>
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="v-pills-messages"
                  role="tabpanel"
                  aria-labelledby="v-pills-messages-tab"
                >
                  <div className="sections-notes-slider">
                    <div className="row">
                      <div className="todo-widget">
                        <div className="todo-wrapper-list">
                          <div className="input-block add-lists todo-inbox-check todo-inbox-check-list">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                            <div className="todo-wrapper-list-content">
                              <h4>Team meet at Starbucks</h4>
                              <p>Identify the implementation team</p>
                            </div>
                          </div>
                          <div className="notes-card-body d-flex align-items-center">
                            <p className="badge bg-outline-danger badge-lg me-2 mb-0">
                              <i className="fas fa-circle" /> High
                            </p>
                            <p className="badge bg-outline-info badge-lg me-2 mb-0">
                              {" "}
                              Pending
                            </p>
                          </div>
                          <div className=" todo-profile d-flex align-items-center">
                            <Link to="#" className="todo-star">
                              <span>
                                <i className="fas fa-star me-3" />
                              </span>
                            </Link>
                            <ImageWithBasePath
                              src="./assets/img/users/user-05.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                            <Link
                              to="#"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v" />
                            </Link>
                            <div className="dropdown-menu notes-menu dropdown-menu-end">
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#edit-note-units"
                              >
                                <span>
                                  <i data-feather="edit" />
                                </span>
                                Edit
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-note-units"
                              >
                                <span>
                                  <i data-feather="trash-2" />
                                </span>
                                Delete
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i data-feather="star" />
                                </span>
                                Not Important
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#view-note-units"
                              >
                                <span>
                                  <i data-feather="eye" />
                                </span>
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="todo-wrapper-list">
                          <div className="input-block add-lists todo-inbox-check todo-inbox-check-list">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                            <div className="todo-wrapper-list-content">
                              <h4>Meet Lisa to discuss project details</h4>
                              <p>Discuss about additional features</p>
                            </div>
                          </div>
                          <div className="notes-card-body d-flex align-items-center">
                            <p className="badge bg-outline-secondary badge-lg me-2 mb-0">
                              <i className="fas fa-circle" /> Medium
                            </p>
                            <p className="badge bg-outline-warning badge-lg me-2 mb-0">
                              {" "}
                              InProgress
                            </p>
                          </div>
                          <div className=" todo-profile d-flex align-items-center">
                            <ImageWithBasePath
                              src="./assets/img/users/user-06.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                            <Link
                              to="#"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v" />
                            </Link>
                            <div className="dropdown-menu notes-menu dropdown-menu-end">
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#edit-note-units"
                              >
                                <span>
                                  <i data-feather="edit" />
                                </span>
                                Edit
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-note-units"
                              >
                                <span>
                                  <i data-feather="trash-2" />
                                </span>
                                Delete
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i data-feather="star" />
                                </span>
                                Not Important
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#view-note-units"
                              >
                                <span>
                                  <i data-feather="eye" />
                                </span>
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="todo-wrapper-list">
                          <div className="input-block add-lists todo-inbox-check todo-inbox-check-list">
                            <label className="checkboxs active">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                            <div className="todo-wrapper-list-content todo-strike-content">
                              <h4>Download Complete</h4>
                              <p>
                                Install console machines and prerequiste
                                softwares
                              </p>
                            </div>
                          </div>
                          <div className="notes-card-body d-flex align-items-center">
                            <p className="badge bg-outline-warning badge-lg me-2 mb-0">
                              <i className="fas fa-circle" /> Low
                            </p>
                            <p className="badge bg-outline-success badge-lg me-2 mb-0">
                              {" "}
                              Completed
                            </p>
                          </div>
                          <div className=" todo-profile d-flex align-items-center">
                            <ImageWithBasePath
                              src="./assets/img/users/user-07.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                            <Link
                              to="#"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v" />
                            </Link>
                            <div className="dropdown-menu notes-menu dropdown-menu-end">
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#edit-note-units"
                              >
                                <span>
                                  <i data-feather="edit" />
                                </span>
                                Edit
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#delete-note-units"
                              >
                                <span>
                                  <i data-feather="trash-2" />
                                </span>
                                Delete
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i data-feather="star" />
                                </span>
                                Not Important
                              </Link>
                              <Link
                                to="#"
                                className="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#view-note-units"
                              >
                                <span>
                                  <i data-feather="eye" />
                                </span>
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="v-pills-settings"
                  role="tabpanel"
                  aria-labelledby="v-pills-settings-tab"
                >
                  <div className="sections-notes-slider">
                    <div className="row">
                      <div className="todo-widget">
                        <div className="todo-wrapper-list">
                          <div className="input-block add-lists todo-inbox-check todo-inbox-check-list">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                            <div className="todo-wrapper-list-content">
                              <h4>Team meet at Starbucks</h4>
                              <p>Identify the implementation team</p>
                            </div>
                          </div>
                          <div className="notes-card-body d-flex align-items-center">
                            <p className="badge bg-outline-danger badge-lg me-2 mb-0">
                              <i className="fas fa-circle" /> High
                            </p>
                            <p className="badge bg-outline-info badge-lg me-2 mb-0">
                              {" "}
                              Pending
                            </p>
                          </div>
                          <div className=" todo-profile d-flex align-items-center">
                            <ImageWithBasePath
                              src="./assets/img/users/user-08.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                            <Link
                              to="#"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v" />
                            </Link>
                            <div className="dropdown-menu notes-menu dropdown-menu-end">
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i data-feather="edit" />
                                </span>
                                Permanent Delete
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i data-feather="trash-2" />
                                </span>
                                Restore Task
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="todo-wrapper-list">
                          <div className="input-block add-lists todo-inbox-check todo-inbox-check-list">
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                            </label>
                            <div className="todo-wrapper-list-content">
                              <h4>Meet Lisa to discuss project details</h4>
                              <p>Discuss about additional features</p>
                            </div>
                          </div>
                          <div className="notes-card-body d-flex align-items-center">
                            <p className="badge bg-outline-secondary badge-lg me-2 mb-0">
                              <i className="fas fa-circle" /> Medium
                            </p>
                            <p className="badge bg-outline-warning badge-lg me-2 mb-0">
                              {" "}
                              InProgress
                            </p>
                          </div>
                          <div className=" todo-profile d-flex align-items-center">
                            <ImageWithBasePath
                              src="./assets/img/users/user-09.jpg"
                              alt="Img"
                              className="img-fluid"
                            />
                            <Link
                              to="#"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v" />
                            </Link>
                            <div className="dropdown-menu notes-menu dropdown-menu-end">
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i data-feather="edit" />
                                </span>
                                Permanent Delete
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i data-feather="trash-2" />
                                </span>
                                Restore Task
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row custom-pagination">
                <div className="col-md-12">
                  <div className="paginations d-flex justify-content-end">
                    <span>
                      <i className="fas fa-chevron-left" />
                    </span>
                    <ul className="d-flex align-items-center page-wrap">
                      <li>
                        <Link to="#" className="active">
                          1
                        </Link>
                      </li>
                      <li>
                        <Link to="#">2</Link>
                      </li>
                      <li>
                        <Link to="#">3</Link>
                      </li>
                      <li>
                        <Link to="#">4</Link>
                      </li>
                    </ul>
                    <span>
                      <i className="fas fa-chevron-right" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <TodoModal /> */}
      </div>
      {/* add task */}
      {!taskDetails && (
        <AddTask
          activityToggle={activityToggle}
          setActivityToggle={setActivityToggle}
          // activityToggleTwo={activityToggleTwo}
          taskCategoryOptions={taskCategoryOptions}
          // taskSubCategoryOptions={taskSubCategoryOptions}
          leadOptions={leadOptions}
          customerOptions={customerOptions}
          staffOptions={staffOptions}
          setStaffOptions={setStaffOptions}
          fetchTaskData={getAllTask}
        />
      )}
      {/* add task */}
      {/* edit task */}
      {taskDetails && (
        <EditTask
          activityToggle={activityToggle}
          setActivityToggle={setActivityToggle}
          taskCategoryOptions={taskCategoryOptions}
          taskSubCategoryOptions={taskSubCategoryOptions}
          leadOptions={leadOptions}
          staffOptions={staffOptions}
          setStaffOptions={setStaffOptions}
          taskDetails={taskDetails}
        />
      )}
      {/* edit task */}
      {/* delete task */}
      <div className="modal custom-modal fade" id="delete_task" role="dialog">
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
                <p className="del-info">Are you sure you want to remove it.</p>
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
                    onClick={handleDelete}
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
      {/* delete task */}
    </Fragment>
  );
};

export default Todo;
