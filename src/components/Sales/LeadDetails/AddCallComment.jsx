import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddCallComment = ({ fetchLeadFollowupData, followUpId }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [comment, setComment] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const data = {
                comment,
                id: followUpId
            }
            const response = await fetch(`${apiUrl}/lead/update-call-comment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Token}`
                },
                body: JSON.stringify(data)
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to update');
            }
            setComment('')
            fetchLeadFollowupData()
            toast.success('Comment updated successfully!');
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Something went wrong');
        }
    }

    return (
        <div
            className="modal custom-modal fade modal-padding"
            id="create_call_comment"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered" >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Are you sure, this call is done?</h5>
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
                                            Write call outcome <span className="text-danger"> *</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={1}
                                            placeholder="Add text"
                                            value={comment}
                                            onChange={(event) => {
                                                setComment(event.target.value)
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
                                            type="submit"
                                            className="btn btn-primary"
                                            data-bs-dismiss="modal"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCallComment