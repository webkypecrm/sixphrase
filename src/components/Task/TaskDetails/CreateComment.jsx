import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';

const CreateComment = ({ fetchTaskDetails, taskDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const initialForm = {
        comment: ''
    }
    const [formData, setFormData] = useState(initialForm);

    // console.log('formData in Comment  =>', formData);

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.taskId = taskDetails.taskId
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/task/comment-update`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to update comment');
            }
            setFormData((prev) => ({ ...initialForm }))
            fetchTaskDetails()
            toast.success('Comment updated successfully!');
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Something went wrong');
        }
    }

    return (< div
        className="modal custom-modal fade custom-modal-two modal-padding"
        id="create_task_comment"
        role="dialog"
    >
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Create New Comments</h5>
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
                            <div className="col-md-12">
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div >
    )
}

export default CreateComment