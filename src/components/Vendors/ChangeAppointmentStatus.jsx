import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import axios from 'axios';
import { appointmentStatus } from '../../selectOption/selectOption';


const ChangeAppointmentStatus = ({ data, handleRefreshData, leadData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';

    const initialForm = {
        appointmentId: '',
        status: '',
    }
    const [formData, setFormData] = useState(initialForm);

    // console.log('formData =>', formData)
    // console.log('data in change appointment status =>', data)
    // console.log('leadData =>', leadData)

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.appointmentId = data?.id
            delete formData.Category
            delete formData.Staff

            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/appointment/update-appointment-status`, {
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
            // fetchLeadData()
            handleRefreshData()
            toast.success('Status updated successfully!');
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        if (data.id) {
            setFormData((prev) => ({
                ...data
            }))
        }
    }, [data])

    return (<>

        <div
            className="modal custom-modal fade modal-padding"
            id="appointment_status_update"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Status Update</h5>
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
                                            Status <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={appointmentStatus.find(option => option.value === formData.status)}
                                            onChange={(event) => {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    status: event.value
                                                }))
                                            }}
                                            options={appointmentStatus}
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

    </>
    )
}

export default ChangeAppointmentStatus