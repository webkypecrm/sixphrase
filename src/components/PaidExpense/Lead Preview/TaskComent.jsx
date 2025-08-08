import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


const TaskComment = ({ taskRecord, fetchTaskData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    // console.log('taskRecord =>', taskRecord)

    const initialForm = {
        taskId: '',
        comment: '',
        status: '',
    }
    const [formData, setFormData] = useState(initialForm);

    // console.log('formData =>', formData)

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.taskId = +taskRecord.taskId;
            formData.status = taskRecord.status;
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/task/add-task-log`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add');
            }
            setFormData((prev) => ({ ...initialForm }))
            fetchTaskData()
            toast.success('Add successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    return (<>
        {/* Assign To */}
        <div
            className="modal custom-modal fade modal-padding"
            id="task-comment"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Comment</h5>
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

                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        Comment <span className="text-danger"> *</span>
                                    </label>
                                    <input
                                        className="form-control"
                                        placeholder="Add text"
                                        onChange={(event) => {
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                comment: event.target.value
                                            }))
                                        }}
                                    />
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

export default TaskComment