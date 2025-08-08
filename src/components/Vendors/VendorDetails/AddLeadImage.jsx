import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    fileTypeSelect
} from "../../../selectOption/selectOption";
import Select from "react-select";

const AddLeadImage = ({ fetchLeadFollowupData, leadDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [attachmentFile, setAttachementFile] = useState(null);
    const initialForm = {
        leadId: leadDetails?.leadId,
        attachment: null
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
                        attachment: attachmentFile
                    }))
                } else {
                    toast.error('File size exceeds 1MB');
                }
            }
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
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

            const response = await fetch(`${apiUrl}/lead/upload-lead-image`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add file');
            }
            fetchLeadFollowupData()
            setFormData(initialForm)
            toast.success('File added successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }

    }

    return (
        <div
            className="modal custom-modal fade modal-padding"
            id="create_lead_file"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create New File</h5>
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
                                        <label className="col-form-label">File Type</label>
                                        <div className="select-priority">
                                            {/* <span className="select-icon">
                                                <i className="ti ti-square-rounded-filled" />
                                            </span> */}
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={fileTypeSelect.find(option => option.value === formData.type)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'type', value } })
                                                }}
                                                options={fileTypeSelect}
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            File Name <span className="text-danger"> *</span>
                                        </label>
                                        <input
                                            name="name"
                                            className="form-control"
                                            rows={1}
                                            placeholder="Add title"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Document Type{" "}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <select className="select">
                                                <option>Select</option>
                                                <option>Contract</option>
                                                <option>Proposal</option>
                                                <option>Quote</option>
                                            </select>
                                        </div>
                                    </div> */}
                                    {/* <div className='row'>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Document Type <span className="text-danger"> *</span>
                                                </label>
                                                <input
                                                    name="type"
                                                    className="form-control"
                                                    placeholder="pdf, xls, doc, figma, zip"
                                                    value={formData.type}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Language <span className="text-danger"> *</span>
                                                </label>
                                                <input
                                                    name="language"
                                                    className="form-control"
                                                    placeholder="Add text"
                                                    value={formData.language}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Comment <span className="text-danger"> *</span>
                                        </label>
                                        <textarea
                                            name='comment'
                                            className="form-control"
                                            rows={1}
                                            placeholder="Add text"
                                            value={formData.comment}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {formData.type === 'video' && <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                or Video Url <span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                name="link"
                                                className="form-control"
                                                placeholder="Url"
                                                value={formData.link}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>}

                                    {formData.type !== 'video' && <div className="form-wrap">
                                        <label className="col-form-label">
                                            Upload File <span className="text-danger">*</span>
                                        </label>
                                        <div className="drag-attach">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            <div className="img-upload">
                                                <i className="ti ti-file-broken" />
                                                {attachmentFile ? attachmentFile.name : 'Upload File'}
                                            </div>
                                        </div>
                                        {attachmentFile &&
                                            <button
                                                className="btn btn-light"
                                                type="button"
                                                onClick={() => { setAttachementFile(null) }}
                                            >
                                                Remove
                                            </button>}
                                    </div>}

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

export default AddLeadImage