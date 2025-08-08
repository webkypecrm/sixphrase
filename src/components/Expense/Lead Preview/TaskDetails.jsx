import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TaskStatus from '../../Task/TaskStatus';
import { Empty } from 'antd';
import ActivityList from './ActivityList';
import TaskComment from './TaskComent';
import TaskLogList from './TaskLogList';

const TaskDetails = ({
    taskToggle,
    setTaskToggle,
    data,
    fetchTaskData
}) => {
    const taskLog = data?.taskLog ? data.taskLog : [];
    // console.log('data =>', data)


    return (
        <>
            <div
                className={
                    taskToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
                }
            >
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Task Details</h4>
                        <div className="submit-button text-end"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem"
                            }}>
                            <button
                                type='button'
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#task-comment"
                                style={{ cursor: 'pointer' }}
                            >
                                Add Comment
                            </button>
                            <Link
                                to="#"
                                className="sidebar-close toggle-btn"
                                onClick={() => setTaskToggle(!taskToggle)}
                            >
                                <i className="ti ti-x" />
                            </Link>
                        </div>

                    </div>

                    <div className="row">
                        {taskLog.length === 0 ? <Empty description={false} /> :
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-body">
                                        <ul className="timeline">
                                            {taskLog.map((item) => <TaskLogList
                                                key={item.id}
                                                data={item}
                                            />)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="toggle-body">
                        <form className="toggle-height" >
                            <div className="pro-create">
                                <ul className="row" style={{
                                    font: "normal",
                                    fontVariant: 'all-small-caps',
                                    fontSize: "1.5rem",
                                    color: "darkslategrey",
                                    position: "relative",
                                    left: "20px",
                                    width: '90%',
                                    marginBottom: '20px'
                                }}>
                                    <li className='task-details-li'> <strong>{"⍟"} Title : </strong> {data.taskTitle} </li>
                                    <li className='task-details-li'> <strong>{"⍟"} Type : </strong> {data.taskType} </li>
                                    <li className='task-details-li'> <strong>{"⍟"} Start Date : </strong>{data.startDate}  </li>
                                    <li className='task-details-li'> <strong>{"⍟"} End Date : </strong>{data.endDate}  </li>
                                    <li className='task-details-li'> <strong>{"⍟"} Assigned To: </strong>{data.assignedTo}  </li>
                                    <li className='task-details-li'> <strong>{"⍟"} Description: </strong>{data.description} </li>
                                    <li className='task-details-li'> <strong>{"⍟"} Lead Name : </strong>{data.leadName}  </li>
                                    <li className='task-details-li'> <strong>{"⍟"} Priority : </strong>
                                        <div
                                            data-bs-toggle="modal"
                                            data-bs-target="#task_priority_update"
                                            style={{ cursor: 'pointer' }}
                                        >
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
                                    <li className='task-details-li'> <strong>{"⍟"} Task Category: </strong>{data.taskCategoryName}  </li>
                                    <li className='task-details-li'> <strong>{"⍟"} Task Sub Category: </strong>{data.taskSubCategoryName}  </li>
                                    <li className='task-details-li'> <strong>{"⍟"} Status : </strong>
                                        <div
                                            data-bs-toggle="modal"
                                            data-bs-target="#task_stage_update"
                                            style={{ cursor: 'pointer' }}

                                        >
                                            {data.status === "resolved" && (
                                                <span className="badge badge-pill badge-status bg-success"  >
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
                                </ul>
                            </div>
                        </form>
                    </div>
                </div >
            </div >

            <TaskStatus
                taskRecord={data}
                fetchTaskData={fetchTaskData}
            />

            <TaskComment
                taskRecord={data}
                fetchTaskData={fetchTaskData}
            />

        </>
    )
}

export default TaskDetails