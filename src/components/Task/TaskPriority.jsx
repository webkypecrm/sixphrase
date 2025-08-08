import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import {
    priorityList,
} from "../../selectOption/selectOption";

const TaskPriority = ({ taskRecord, fetchTaskData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';

    console.log("taskRecord =>", taskRecord)

    const initialForm = {
        taskId: '',
        priority: '',
    }
    const [formData, setFormData] = useState(initialForm);

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.taskId = +taskRecord.taskId
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/task/update-task-priority`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to update');
            }
            setFormData((prev) => ({ ...initialForm }))
            fetchTaskData()
            toast.success('Updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    return (<>
        {/* Assign To */}
        <div
            className="modal custom-modal fade modal-padding"
            id="task_priority_update"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Task Priority</h5>
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
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Priority <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={priorityList.find(option => option.value === formData.priority)}
                                            onChange={(event) => {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    priority: event.value
                                                }))
                                            }}
                                            options={priorityList}
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
                                    <button
                                        className="btn btn-primary"
                                        data-bs-dismiss="modal"
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
        {/* Assign To */}
    </>
    )
}

export default TaskPriority