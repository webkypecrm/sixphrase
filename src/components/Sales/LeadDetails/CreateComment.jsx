import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';

const CreateComment = ({ fetchLeadDetails, leadDetails }) => {
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
            formData.leadId = leadDetails.leadId
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/lead/comment-update`, {
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
            handleReset()
            fetchLeadDetails()
            toast.success('Comment updated successfully!');
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Something went wrong');
        }
    }

    const handleReset = () => {
        setFormData(() => ({
            comment: ''
        }))
    }

    return (< div
        className="modal custom-modal fade custom-modal-two modal-padding"
        id="create_comment"
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
                    <form
                        onSubmit={handleSubmit}
                    // onKeyDown={(e) => {
                    //     if (e.key === "Enter") {
                    //         e.preventDefault();
                    //     }
                    // }}
                    >
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        Comment <span className="text-danger"> *</span>
                                    </label>
                                    {" "}<span>(500 words only)</span>
                                    <textarea
                                        className="form-control"
                                        placeholder="Add text"
                                        maxLength={500}
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
                                        onClick={handleReset}
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type='submit'
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