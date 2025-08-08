import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TagsInput } from "react-tag-input-component";


const AddLeadOtherDetails = ({ fetchLeadFollowupData, leadDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [tagValue, setTagValue] = useState([]);

    // console.log(typeof (leadDetails?.tags))

    const initialForm = {
        leadId: leadDetails?.leadId,
        leadMobile1: '',
        leadMobile2: '',
        leadMobile3: '',
    }
    const [formData, setFormData] = useState(initialForm);

    // console.log('attachmentFile =>', attachmentFile)
    // console.log('formData =>', formData)
    // console.log('leadDetails =>', leadDetails)

    const handleInputChange = (event) => {
        const { name, value } = event.target

        const sanitizedValue = value.replace(/\D/g, '');

        setFormData((prevForm) => ({
            ...prevForm,
            [name]: sanitizedValue
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            formData.leadId = leadDetails.leadId
            formData.tags = JSON.stringify(tagValue)
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
                throw new Error(resData.message || 'Failed to add lead updated');
            }
            fetchLeadFollowupData()
            setFormData(initialForm)
            toast.success('Lead updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }

    }

    useEffect(() => {

        if (leadDetails?.leadId) {
            setFormData((prevData) => ({
                leadMobile1: leadDetails?.leadMobile1,
                leadMobile2: leadDetails?.leadMobile2,
                leadMobile3: leadDetails?.leadMobile3
            }))
        }

    }, [leadDetails])

    return (
        <div
            className="modal custom-modal fade modal-padding"
            id="update_lead_new_details"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Lead </h5>
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
                                            Lead Mobile 1  <span className="text-danger"></span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name='leadMobile1'
                                            maxLength={10}
                                            value={formData.leadMobile1}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Lead Mobile 2  <span className="text-danger"></span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name='leadMobile2'
                                            maxLength={10}
                                            value={formData.leadMobile2}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Lead Mobile 3 <span className="text-danger"></span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name='leadMobile3'
                                            maxLength={10}
                                            value={formData.leadMobile3}
                                            onChange={handleInputChange}
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
    )
}

export default AddLeadOtherDetails