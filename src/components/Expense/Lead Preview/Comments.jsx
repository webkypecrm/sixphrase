import { data } from 'jquery';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import CommentList from './CommentList';
import { Empty } from 'antd';

const Comments = ({ leadFollowupData, fetchLeadFollowupData, leadDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const data = leadFollowupData.filter((item) => item.type == 'leadComment')
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
            fetchLeadFollowupData()
            toast.success('Comment updated successfully!');
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Something went wrong');
        }
    }

    const handleReset = () => {
        setFormData(() => ({
            ...initialForm
        }))
    }

    return (
        <>
            <div className="tab-pane fade" id="comments">
                <div className="view-header">
                    <h4>Comments</h4>
                    <ul>
                        <li>
                            <Link
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#add_comments"
                                className="com-add"
                            >
                                <i className="ti ti-circle-plus me-1" />
                                Add New
                            </Link>
                        </li>
                    </ul>
                </div>
                {data.length === 0 ? <Empty description={false} /> :
                    <div className="contact-activity">
                        {data.map((item) =>
                            <CommentList
                                key={item.id}
                                data={item}
                            />
                        )}
                    </div>
                }
            </div>

            {/* Add File */}
            <div
                className="modal custom-modal fade custom-modal-two modal-padding"
                id="add_comments"
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
            </div>
            {/* /Add File */}
        </>
    )
}

export default Comments