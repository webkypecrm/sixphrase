import React from 'react'
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import ImageWithBasePath from '../../ImageWithBasePath';

const TaskList = ({ data, onTaskToggle }) => {

    console.log('data in TaskList  =>', data)

    function getDate(value) {
        const isoDateString = value;
        const date = new Date(isoDateString);
        // Format date into "DD MMM YYYY"
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }

    function getTime(value) {
        const isoDateString = value;
        const date = new Date(isoDateString);
        // Get time (hours and minutes)
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        return formattedTime
    }

    function handleToggle() {
        onTaskToggle(data)
    }

    return (<>
        <div
            className="tasks-activity tasks collapse show"
        >
            <ul>
                <li className="task-wrap  success">
                    <Link to={`/task/task-details/${data.taskId}`} className="task-info">
                        <span className="task-icon">
                            <i className="ti ti-grip-vertical" />
                        </span>                      
                        <div className="set-star rating-select">
                            <i className="fa fa-star" />
                        </div>
                        <p>                            
                            {data?.taskTitle}
                        </p>
                        <span className="badge badge-pill badge-status bg-blue">
                            <i className="ti ti-subtask" />
                            Task
                        </span>
                        {
                            data?.status == 'open' &&
                            <span className="badge badge-tag bg-info">
                                {data?.status}
                            </span>
                        }
                        {
                            data?.status == 'pending' &&
                            <span className="badge badge-tag bg-pending">
                                {data?.status}
                            </span>
                        }
                        {
                            data?.status == 'resolved' &&
                            <span className="badge badge-tag bg-success">
                                {data?.status}
                            </span>
                        }
                        {
                            data?.status == 'closed' &&
                            <span className="badge badge-tag bg-danger">
                                {data?.status}
                            </span>
                        }
                    </Link>
                    <div className="task-actions">
                        <ul>
                            <li className="task-time">
                                {data?.tags.map((tag) =>
                                    <span key={tag} className="badge badge-tag badge-success-light"
                                        style={{ marginRight: '5px' }}>
                                        {tag}
                                    </span>)}
                            </li>
                            <li className="task-date">
                                <i className="ti ti-calendar-exclamation" />
                                {getDate(data?.createdAt)}
                            </li>
                            <li className="task-owner">
                                <div className="task-user">
                                    <img
                                        src={data?.assignedToImg}
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
                                                setActivityTogglePopupTwo(!activityToggleTwo)
                                            }
                                        >
                                            <i className="ti ti-edit text-blue" />{" "}
                                            Edit
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


        {/* <li className="activity-wrap" onClick={handleToggle}>
            <div>
                <div>
                    <div className="badge-day">
                        <i className="ti ti-calendar-check" />
                        {getDate(data.createdAt)}
                    </div>
                    <Tag color="blue" style={{ marginLeft: '10px' }}>
                        Task
                    </Tag>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="activity-icon bg-orange">
                        <i className="ti ti-list-check" />
                    </span>
                    <div className="activity-info">
                        <ul style={{
                            display: "grid",
                            gridTemplateColumns: "auto auto auto",
                            columnGap: "40px",
                            rowGap: "10px",
                        }}>
                            <li>
                                <strong>Title: </strong> {data.taskTitle}
                            </li>
                            <li style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                gap: "10px",
                            }}>
                                <strong>Priority:</strong> <div>
                                    {data.priority === "medium" && (
                                        <span className="badge badge-tag badge-warning-light">
                                            {data.priority}
                                        </span>
                                    )}
                                    {data.priority === "low" && (
                                        <span className="badge badge-tag badge-purple-light">
                                            {data.priority}
                                        </span>
                                    )}
                                    {data.priority === "highy" && (
                                        <span className="badge badge-tag badge-danger-light">
                                            {data.priority}
                                        </span>
                                    )}
                                </div>

                            </li>
                            <li style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                gap: "10px",
                            }}>
                                <strong> Status:</strong>  <div>
                                    {data.status === "resolved" && (
                                        <span className="badge badge-pill badge-status bg-success">
                                            {data.status}
                                        </span>
                                    )}
                                    {data.status === "open" && (
                                        <span className="badge badge-pill badge-status bg-info">
                                            {data.status}
                                        </span>
                                    )}
                                    {data.status === "pending" && (
                                        <span className="badge badge-pill badge-status bg-warning">
                                            {data.status}
                                        </span>
                                    )}
                                    {data.status === "closed" && (
                                        <span className="badge badge-pill badge-status bg-danger">
                                            {data.status}
                                        </span>
                                    )}
                                </div>
                            </li>
                            <li>
                                <strong>Start Date: </strong>
                                {data.startDate}
                            </li>
                            <li>
                                <strong>End Date: </strong>
                                {data.startDate}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </li > */}

    </>
    )
}

export default TaskList

// to={`/sales/leads-details/${data.taskId}`}