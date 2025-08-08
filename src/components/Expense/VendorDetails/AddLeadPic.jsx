import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


const AddLeadPic = ({ fetchLeadFollowupData, leadDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [attachmentFile, setAttachementFile] = useState(null);
    const initialForm = {
        leadId: leadDetails?.leadId,
        leadPic: null
    }
    const [formData, setFormData] = useState(initialForm);

    // console.log('attachmentFile =>', attachmentFile)
    // console.log('formData =>', formData)
    // console.log('leadDetails =>', leadDetails)

    const handleFileChange = (event) => {
        // console.log('event =>', event)
        const files = event.target.files;

        if (files.length > 0) {
            const attachmentFile = files[0];
            if (attachmentFile.type.startsWith("image")) {
                if (attachmentFile.size <= 1024 * 1024) {

                    console.log('files =>', files)

                    setAttachementFile(attachmentFile)
                    setFormData((prevData) => ({
                        ...prevData,
                        leadPic: attachmentFile
                    }))
                } else {
                    toast.error('File size exceeds 1MB');
                }
            }
        }
    }

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

            const response = await fetch(`${apiUrl}/lead/update-lead-other-details`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add lead image');
            }
            fetchLeadFollowupData()
            setFormData(initialForm)
            setAttachementFile(null)
            toast.success('Lead Image added successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }

    }

    return (
        <div
            className="modal custom-modal fade modal-padding"
            id="add-lead-image"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Upload Lead Image</h5>
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
                                    <div className="profile-pic-upload">
                                        <div className="profile-pic">
                                            {attachmentFile ?
                                                <div>
                                                    <img
                                                        src={URL.createObjectURL(attachmentFile)}
                                                        alt="Image selected"
                                                    />
                                                </div> :
                                                <span>
                                                    <i className="ti ti-photo" />
                                                </span>
                                            }
                                        </div>
                                        <div className="upload-content">
                                            <div className="upload-btn"  >
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                />
                                                <span >
                                                    <i className="ti ti-file-broken" />
                                                    Upload File
                                                </span>
                                            </div>
                                            <p>JPG, GIF or PNG. Max size of 800K</p>
                                            {attachmentFile &&
                                                <button
                                                    className="btn btn-light"
                                                    type="button"
                                                    onClick={() => { setAttachementFile(null) }}
                                                >
                                                    Remove
                                                </button>}
                                        </div>

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
    )
}

export default AddLeadPic