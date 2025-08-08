import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import DataTable from "../../components/Table/DataTable";
import TaskStatus from "../../components/Task/TaskStatus";
import TaskPriority from "../../components/Task/TaskPriority";
import AssignedTo from "../../components/Task/AssignedTo";
import DeleteData from "../../components/DeleteData/DeleteData";
import { toast } from "react-toastify";
import axios from "axios";
import { Slider } from "antd";
import ImageCarousel from "./ImageCarousel";
import { all_routes } from "../Router/all_routes";
import dayjs from "dayjs";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import TicketPreview from "./TicketPreview";
const defaultImg = "/assets/img/authentication/staff_default.jpeg";
import { Table } from "antd";

const ManageTicketList = ({
  data,
  setData,
  setActivityToggleTwo,
  activityToggleTwo,
  fetchTaskData,
  staffOptions,
  manageColumns,
  pageSize,
  totalPages,
  onTaskDetails,
  ticketdata,
  getticketData,
  getAllTicketData,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const dataSource = data;
  const [stars, setStars] = useState({});
  const [ticketRecord, setTicketRecord] = useState({});
  // const [taskId, setTaskId] = useState("");
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [activityToggle, setActivityToggle] = useState(false);
  const [id, setId] = useState("");
  const [assign, setAssign] = useState(null);
  const [taskLogData, setTaskLogData] = useState([]);
  const [groupActivityByDate, setGroupActivityByDate] = useState({});
  const [callData, setCallData] = useState([]);
  const [meetingData, setMeetingData] = useState([]);
  const [commentData, setCommentData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [status, setStatus] = useState(null);
  const [ticketData, setTicketData] = useState({});
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedTicketId, setSelectedTicketId] = useState([]);



  console.log("selectedTicketId", selectedTicketId);



//   const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
//   if (newSelectedRowKeys.length > 0) {
//     setSelectedTicketId(newSelectedRowKeys[0]); // ✅ only first selected row's id
//   } else {
//     setSelectedTicketId(null);
//   }
// };

  console.log("selectID", selectedRowIds);

  const initializeStarsState = () => {
    const starsState = {};
    data.forEach((item, index) => {
      starsState[index] = false;
    });
    setStars(starsState);
  };

  React.useEffect(() => {
    initializeStarsState();
  }, []);

  // const handleDelete = async () => {
  //   if (taskId) {
  //     try {
  //       await axios.delete(`${apiUrl}/task/delete-task/${taskId}`, {
  //         headers: {
  //           Authorization: `Bearer ${Token}`,
  //         },
  //       });
  //       fetchTaskData();
  //       toast.success("Task deleted successfully!");
  //       setTaskId(null);
  //     } catch (error) {
  //       toast.error(error.message);
  //     }
  //   }
  // };

  // const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };

  const handleFetchData = (page) => {
    getAllTicketData(page);
  };
  function getDate(value) {
    const isoDateString = value;
    const date = new Date(isoDateString);
    // Format date into "DD MMM YYYY"
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  }
  function getTime(value) {
    const [hours, minutes] = value.split(":").map(Number); // Split and convert to numbers
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format (0 → 12)

    return `${formattedHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
  }
  const route = all_routes;
  const columns = [
    
    {
      title: "TID",
      dataIndex: "taskId",
      key: "taskId",
      render: (text, record, index) => (
        <div>
          <ul>
            <li>
              <strong>TID : {record?.id}</strong>
            </li>
            <li>{dayjs(record?.createdAt).format("DD MMM YYYY | hh:mm A")}</li>
            {/* <li>
              <strong>Priority : </strong> {record?.priority}
            </li> */}
          </ul>
          {/* </Link> */}
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "taskTitle",
      key: "taskId",
      render: (text, record, index) => (
        <ul>
          <li style={{ height: "17px" }}>
            <Link
              to={`${route.ticketDetails}/${record?.id}`}
              className="table-avatar d-flex align-items-center leade-name-hover"
            >
              <ul>
                <li>
                  <span style={{ fontWeight: "900" }}>
                    {record?.Customer?.customerName}
                  </span>
                </li>
              </ul>
            </Link>
          </li>
          <li>{record.Customer?.company?.companyName}</li>
          <li>{record?.Customer?.customerMobile1}</li>
          <li>{record?.Customer?.customerEmail}</li>
        </ul>
      ),
    },
    {
      title: "Job/Project",
      dataIndex: "taskType",
      key: "taskId",
      render: (text, record) => {
        return (
          <ul>
            <li>
              <span>{record?.project}</span>
            </li>
          </ul>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text, record) => {
        return (
          <ul>
            <li>
              <span>{record?.supportCategory?.name}</span>
            </li>
          </ul>
        );
      },
    },
    {
      title: "Sub Category",
      dataIndex: "SubCategory",
      key: "SubCategory",
      render: (text, record) => {
        return (
          <ul>
            <li>
              <span>{record?.supportSubCategory?.name}</span>
            </li>
          </ul>
        );
      },
    },
    // {
    //   title: "Details",
    //   dataIndex: "taskSubCategoryName",
    //   key: "taskId",
    //   render: (text, record) => {
    //     return (
    //       <ul>
    //         <li>
    //           <span>{record?.details}</span>
    //         </li>
    //       </ul>
    //     );
    //   },
    // },
    {
      title: "Details",
      dataIndex: "taskSubCategoryName",
      key: "taskId",
      render: (text, record, index) => {
        const fullText = record?.details || "";
        const words = fullText.trim().split(/\s+/); // handles extra spaces
        const shouldTruncate = words.length > 5;
        const truncatedText = shouldTruncate
          ? words.slice(0, 5).join(" ") + "..."
          : fullText;

        const tooltipId = `tooltip-details-${index}`;

        return (
          <ul>
            <li>
              <span
                data-tooltip-id={shouldTruncate ? tooltipId : undefined}
                data-tooltip-content={shouldTruncate ? fullText : undefined}
                style={{ cursor: "pointer" }}
              >
                {truncatedText}
              </span>
              {shouldTruncate && (
                <Tooltip
                  id={tooltipId}
                  place="top"
                  style={{
                    maxWidth: "320px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    position: "absolute",
                    zIndex: 9999,
                    fontSize: "13px",
                  }}
                />
              )}
            </li>
          </ul>
        );
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (text, record) => (
        <ul>
          <li>
            <span>{record?.createdBy}</span>
          </li>
        </ul>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "taskId",
      render: (text, record, index) => (
        <ul>
          <li
            data-bs-toggle="modal"
            data-bs-target="#singel_assigned_to"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setTicketRecord(record);
            }}
          >
            <span>
              {record?.staff?.name || (
                <i
                  className="ti ti-square-rounded-plus compney-icon-addBranch me-2"
                  data-tooltip-id={`tooltip-${index}`}
                  data-tooltip-content="Assign Ticket"
                />
              )}
            </span>
          </li>
        </ul>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (text, record) => (
        <div>
          {text === "Normal" && (
            <span className="badge badge-tag badge-warning-light">{text}</span>
          )}
          {text === "Urgent" && (
            <span className="badge badge-tag badge-purple-light">{text}</span>
          )}
          {text === "Very Urgent" && (
            <span className="badge badge-tag badge-danger-light">{text}</span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <div
          data-bs-toggle="modal"
          data-bs-target="#task_stage_update"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setTicketRecord(record);
          }}
        >
          {text === "open" && (
            <span className="badge badge-pill badge-status bg-info">
              {text}
            </span>
          )}
          {text === "Progress" && (
            <span className="badge badge-pill badge-status bg-warning">
              {text}
            </span>
          )}
          {text === "closed" && (
            <span className="badge badge-pill badge-status bg-danger">
              {text}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "View Files",
      dataIndex: "attachmentUrl",
      key: "taskId",
      render: (text, record) => <ImageCarousel record={record} />,
    },
    {
      title: "Action",
      render: (text, record, index) => (
        <div className="social-links d-flex align-items-center" key={index}>
          <li>
            <Link
              to="#"
              onClick={() => {
                setActivityToggle((prev) => !prev), setId(record.id);
              }}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="View Ticket"
              // }}
            >
              <i className=" ti ti-eye me-2"></i>
            </Link>
          </li>
          {/* <li>
                <Link
                  className=""
                  to="#"
                  onClick={() => handleEditClick(record.id)}
                  data-tooltip-id={`tooltip-${index}`}
                  data-tooltip-content="Edit Product"
                >
                  <i className="ti ti-edit me-2" />
                </Link>
              </li> */}
          <li>
            <Link
              className=""
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_contact"
              onClick={() => setId(record.id)}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Delete Ticket"
            >
              <i className="ti ti-trash text-danger me-2" />
            </Link>
          </li>
          {/* <li>
                <div className="status-toggle">
                  <input type="checkbox" id="disable" className="check" />
                  <label htmlFor="disable" className="checktoggle" />
                </div>
              </li> */}
          <Tooltip id={`tooltip-${index}`} place="top" />
        </div>
      ),
    },
  ];







  const modifiedColumns = columns.filter((column, index) => {
    if (index == 0) {
      return column;
    }

    for (const ele in manageColumns) {
      if (column.title == ele && manageColumns[ele] == true) {
        return column;
      }
    }
  });

  // update status
  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "Progress", label: "Progress" },
    { value: "closed", label: "Closed" },
  ];

  // get ticket Data by id
  const getticketDataId = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/get-support-ticket/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      setTicketData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };
  useEffect(() => {
    if (id) {
      getticketDataId();
    }
  }, [id]);

  //get log data
  const fetchTaskLogData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/get-support-ticket-log/${ticketData?.id}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      console.log("dataaaaa =>", response.data.data);
      setTaskLogData((prev) => [...response.data.data]);
      const groupedData = response.data.data.reduce((acc, item) => {
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
        (item) => item.type == "ticketComment"
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
  useEffect(() => {
    if (ticketData?.id) {
      fetchTaskLogData();
    }
  }, [ticketData?.id]);

  // add status
  const addStatus = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/product/update-ticket-status/${ticketRecord.id}`,
        {
          status: status.value,
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      getticketData();
      fetchTaskLogData();
      toast.success("Ticket status updated successfully");
    } catch (error) {
      console.error("Error fetching customers", error);
      toast.error("Error update ticket status");
    }
  };

  // asign to singel
  const addAsign = async (e) => {
    e.preventDefault();
    if (!assign || !assign.value) {
      alert("Please select a staff member to assign.");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}/product/assignto-ticket/${ticketRecord.id}`,
        {
          staffId: Number(assign.value),
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      getticketData();
      fetchTaskLogData();
      toast.success("Ticket assigned successfully");
    } catch (error) {
      console.error("Error assigning ticket", error);
      toast.error("Error assigning ticket");
    }
  };
  // asign in bulk
  const addAsignBulk = async (e) => {
    e.preventDefault();
    if (!assign || !assign.value) {
      alert("Please select a staff member to assign.");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}/product/bulk-assignto-ticket`,
        {
          ticketIds:selectedTicketId,
          staffId: Number(assign.value),
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      getticketData();
      fetchTaskLogData();
      toast.success("Ticket assigned successfully");
    } catch (error) {
      console.error("Error assigning ticket", error);
      toast.error("Error assigning ticket");
    }
  };

  // Delete ticket
  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/product/delete-ticket/${id}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      getticketData();
      toast.success("Ticket deleted successfully");
    } catch (error) {
      console.error("Error deleting ticket", error);
      toast.error("Error deleting ticket");
    }
  };

  return (
    <Fragment>
      <div className="task-wrapper">
        <div className="tasks-activity tasks collapse show" id="recent">
          <ul>
            <div className="table-responsive custom-table">
              {/* <DataTable
                dataSource={ticketdata}
                columns={modifiedColumns}
                onSelectionChange={handleSelectedRowKeysChange}
                pageSize={pageSize}
                totalPages={totalPages}
                onFetchRecord={handleFetchData}
              /> */}
              <Table
                                columns={modifiedColumns}
                                dataSource={ticketdata}
                                rowKey={(record) => record.id}
                                rowSelection={{
                                  type: "checkbox",
                                  selectedRowKeys,
                                  onChange: (keys, selectedRows) => {
                                    setSelectedRowKeys(keys);
              
                                    // IDs collect karke alag state me store karo
                                    const ids = selectedRows.map((row) => row.id);
                                    setSelectedTicketId(ids);
                                  },
                                }}
                                pageSize={pageSize}
                totalPages={totalPages}
                onFetchRecord={handleFetchData}
                scroll={{ x: "max-content" }}
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
      {/* delete Ticket */}
      <DeleteData title="Ticket" onDeleteHandler={handleDelete} />

      {/* Task Status */}
      <div
        className="modal custom-modal fade modal-padding"
        id="task_stage_update"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Task Status</h5>
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
              <form onSubmit={addStatus}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Status <span className="text-danger">*</span>
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        value={status}
                        onChange={(selected) => setStatus(selected)}
                        options={statusOptions}
                        placeholder="Select status"
                      />
                    </div>
                  </div>
                  <div className="text-end modal-btn">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button className="btn btn-primary" data-bs-dismiss="modal">
                      Confirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* singel assigh */}
      <div
        className="modal custom-modal fade modal-padding"
        id="singel_assigned_to"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Assign Ticket To</h5>
              <button
                id="closeAssignModalBtn"
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-0">
              <form onSubmit={addAsign}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Staff <span className="text-danger">*</span>
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        value={assign}
                        onChange={(selected) => setAssign(selected)}
                        options={staffOptions}
                        placeholder="Select Staff"
                      />
                    </div>
                  </div>
                  <div className="text-end modal-btn mt-3">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      f
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* bulk assigh */}
      <div
        className="modal custom-modal fade modal-padding"
        id="multiple_assigned_to"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Assign Ticket To</h5>
              <button
                id="closeAssignModalBtn"
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-0">
              <form onSubmit={addAsignBulk}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Staff <span className="text-danger">*</span>
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        value={assign}
                        onChange={(selected) => setAssign(selected)}
                        options={staffOptions}
                        placeholder="Select Staff"
                      />
                    </div>
                  </div>
                  <div className="text-end modal-btn mt-3">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      f
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* preview */}
      <div
        className={
          activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout" style={{ maxWidth: "55%" }}>
          <div className="sidebar-header">
            <h4>Ticket Preview</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setActivityToggle(!activityToggle)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <TicketPreview
              ticketData={ticketData}
              taskLogData={taskLogData}
              groupActivityByDate={groupActivityByDate}
              callData={callData}
              meetingData={meetingData}
              commentData={commentData}
              fileData={fileData}
              fetchTaskLogData={fetchTaskLogData}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ManageTicketList;
