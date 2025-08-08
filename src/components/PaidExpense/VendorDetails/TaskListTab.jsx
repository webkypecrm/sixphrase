import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DataTable from "../../components/Table/DataTable";
import TaskStatus from './TaskStatus';
import TaskPriority from './TaskPriority';
import AssignedTo from './AssignedTo';
import DeleteData from '../DeleteData/DeleteData';
import { toast } from 'react-toastify';
import axios from 'axios';
const defaultImg = "/assets/img/authentication/staff_default.jpeg";

const TaskListTab = ({
    data,
    setData,
    setActivityToggleTwo,
    activityToggleTwo,
    fetchTaskData,
    staffOptions,
    manageColumns,
    pageSize,
    totalPages,
    onTaskDetails
}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const dataSource = data;
    const [stars, setStars] = useState({});
    const [taskRecord, setTaskRecord] = useState({});
    const [taskId, setTaskId] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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

    const handleDelete = async () => {
        if (taskId) {
            try {
                await axios.delete(`${apiUrl}/task/delete-task/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                })
                fetchTaskData()
                toast.success('Task deleted successfully!')
                setTaskId(null)
            } catch (error) {
                toast.error(error.message)
            }
        }
    }

    const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleFetchData = (page) => {
        fetchTaskData(page);
    }

    const columns = [
        {
            title: () => {
                return <div
                    data-bs-toggle="modal"
                    data-bs-target="#multiple_assigned_to"
                    style={{ cursor: 'pointer' }}
                >
                    {selectedRowKeys.length > 0 ? "🔂" : ''}
                </div>
            },
            dataIndex: "",
            render: (text, record, index) => (
                <div
                    className={`set-star rating-select ${stars[index] ? "filled" : ""}`}
                    onClick={() => handleStarToggle(index)}
                >
                    <i className="fa fa-star"></i>
                </div>
            ),
        },
        {
            title: "Task ID",
            dataIndex: "taskId",
            key: "taskId",
            render: (text, record, index) => (<div style={{ textAlign: 'center' }}>
                <Link to={`/task/task-details/${record.taskId}`}
                    style={{ cursor: 'pointer', textAlign: 'center' }}
                    className="table-avatar d-flex align-items-center"
                // onClick={() => setActivityToggleTwo(!activityToggle)}
                >
                    {/* <span className="company-img menu-list-icon ">
                        <i className="ti ti-id" />
                    </span> */}
                    {text}
                </Link>
            </div>
            ),
        },
        {
            title: "Title",
            dataIndex: "taskTitle",
            key: "taskId",
            render: (text, record, index) => (
                <Link
                    to={`/task/task-details/${record.taskId}`}
                    style={{ cursor: 'pointer' }}
                    className="table-avatar d-flex align-items-center"
                // onClick={() => setActivityToggleTwo(!activityToggle)}
                >

                    <Link to={`/task/task-details/${record.taskId}`}
                        className="profile-split d-flex flex-column">
                        {text.slice(0, 40)}
                    </Link>
                </Link>

            ),
        },
        {
            title: "Type",
            dataIndex: "taskType",
            key: "taskId",
            render: (text) => {
                return <ul
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActivityToggleTwo(!activityToggle)}
                >
                    <li>{text}</li>
                </ul>
            }
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "taskId",
            render: (text) => {
                return <ul
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActivityToggleTwo(!activityToggle)}
                >
                    <li>{text}</li>
                </ul>
            }
        },
        {
            title: "Category",
            dataIndex: "taskCategoryName",
            key: "taskId",
            render: (text) => {
                return <ul
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActivityToggleTwo(!activityToggle)}
                >
                    <li>{text}</li>
                </ul>
            }
        },
        {
            title: "Sub Category",
            dataIndex: "taskSubCategoryName",
            key: "taskId",
            render: (text) => {
                return <ul
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActivityToggleTwo(!activityToggle)}
                >
                    <li>{text}</li>
                </ul>
            }
        },

        {
            title: "Assigned By",
            dataIndex: "createdBy",
            key: "taskId",
            render: (text, record) => (
                <h2 className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActivityToggleTwo(!activityToggle)}
                >
                    {record?.createdByImgUrl ?
                        <Link to="#" className="avatar">
                            <img
                                className="avatar-img"
                                src={record?.createdByImgUrl || defaultImg}
                                alt="User Image"
                            />
                        </Link> :
                        <Link to="#" className="avatar">
                            <span className="company-img menu-list-icon bg-violet ">
                                <i className="ti ti-user" />
                            </span>
                        </Link>
                    }

                    <Link to="#" className="profile-split d-flex flex-column">
                        {text}
                    </Link>
                </h2>
            ),
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: (dataIndex) => {
                return <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActivityToggleTwo(!activityToggle)}
                >
                    <span>{dataIndex.slice(0, 12)}</span>
                    <p>{dataIndex.slice(12)}</p>
                </div>
            }
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: (text, record, index) => (
                <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => setActivityToggleTwo(!activityToggle)}
                >
                    {text}
                </div>
            ),
        },
        {
            title: "Assigned To",
            dataIndex: "assignedTo",
            key: "taskId",
            render: (text, record) => (
                <h2 className="table-avatar d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#task_assigned_to"
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setTaskRecord(record) }}
                >
                    <Link to="#" className="avatar">
                        <img
                            className="avatar-img"
                            src={record.assignedToImg}
                            alt="User Image"
                        />
                    </Link>
                    <Link to="#" className="profile-split d-flex flex-column">
                        {record.assignedTo}
                    </Link>
                </h2>
            ),
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "taskId",
            render: (text) => {
                return <ul>
                    {text.map((val, index) => <li key={index} >
                        <p className="badge badge-tag badge-purple-light">
                            {val}
                        </p>
                    </li>)}
                </ul>
            }
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            key: "taskId",
            render: (text) => {
                return moment(text).format("DD MMM YYYY, hh:mm a")
            }
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "taskId",
            render: (text, record) => (
                <div
                    data-bs-toggle="modal"
                    data-bs-target="#task_priority_update"
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setTaskRecord(record) }}
                >
                    {text === "medium" && (
                        <span className="badge badge-tag badge-warning-light">
                            {text}
                        </span>
                    )}
                    {text === "low" && (
                        <span className="badge badge-tag badge-purple-light">
                            {text}
                        </span>
                    )}
                    {text === "high" && (
                        <span className="badge badge-tag badge-danger-light">
                            {text}
                        </span>
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
                    style={{ cursor: 'pointer' }}
                    onClick={() => { setTaskRecord(record) }}
                >
                    {text === "resolved" && (
                        <span className="badge badge-pill badge-status bg-success">
                            {text}
                        </span>
                    )}
                    {text === "open" && (
                        <span className="badge badge-pill badge-status bg-info">
                            {text}
                        </span>
                    )}
                    {text === "pending" && (
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
            title: "Attachment",
            dataIndex: "attachmentUrl",
            key: "taskId",
            render: (text) => (
                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                    {
                        text ?
                            <Link to={text} className="ti ti-files"></Link> :
                            <Link to={text} className='ti ti-line-dotted'></Link>

                    }
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (text, record, index) => (
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
                            onClick={() => {
                                setActivityToggleTwo(true),
                                    onTaskDetails(record)
                            }
                            }
                        >
                            <i className="ti ti-edit text-blue"></i> Update
                        </Link>
                        <Link
                            className="dropdown-item"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_contact"
                            onClick={() => setTaskId(record.taskId)}
                        >
                            <i className="ti ti-trash text-danger" />{" "}
                            Delete
                        </Link>
                    </div>
                </div>
            ),
        },
    ];

    const modifiedColumns = columns.filter((column, index) => {
        if (index == 0) {
            return column
        }

        for (const ele in manageColumns) {
            if (column.title == ele && manageColumns[ele] == true) {
                return column
            }
        }
    })

    return (
        <>
            <div className="task-wrapper">
                <Link
                    to="#"
                    className="task-accordion"
                    data-bs-toggle="collapse"
                    data-bs-target="#recent"
                >
                    <h4>
                        Recent<span>{data.length}</span>
                    </h4>
                </Link>

                <div
                    className="tasks-activity tasks collapse show"
                    id="recent"
                >
                    <ul>
                        <div className="table-responsive custom-table">
                            <DataTable
                                dataSource={data}
                                columns={modifiedColumns}
                                onSelectionChange={handleSelectedRowKeysChange}
                                pageSize={pageSize}
                                totalPages={totalPages}
                                onFetchRecord={handleFetchData}
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
            <TaskStatus
                taskRecord={taskRecord}
                fetchTaskData={fetchTaskData}
            />

            <TaskPriority
                taskRecord={taskRecord}
                fetchTaskData={fetchTaskData}
            />

            <AssignedTo
                taskRecord={taskRecord}
                fetchTaskData={fetchTaskData}
                staffOptions={staffOptions}
            />

            <DeleteData title="Task" onDeleteHandler={handleDelete} />

        </>
    )
}

export default TaskListTab