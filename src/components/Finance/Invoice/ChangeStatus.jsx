import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import axios from 'axios';
import { invoiceStatus } from '../../../selectOption/selectOption';


const ChangeStatus = ({ invoiceData, handleRefresh }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';

    // console.log('leadForAssign =>', leadForAssign)
    // console.log('fetchLeadData =>', fetchLeadData)


    const initialForm = {
        invoiceId: null,
        status: '',
    }
    const [formData, setFormData] = useState(initialForm);
    // console.log('formData', formData)
    // console.log('invoiceData', invoiceData)

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const updatedFormData = {
                ...formData,
                invoiceId: invoiceData?.id
            }

            const formDataToSend = new FormData();
            for (const key in updatedFormData) {
                if (updatedFormData[key] !== null) {
                    formDataToSend.append(key, updatedFormData[key])
                }
            }
            const response = await fetch(`${apiUrl}/customer/update-invoice-status`, {
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
            setFormData(() => ({
                ...initialForm
            }))
            handleRefresh()
            toast.success('Status updated successfully!');
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Something went wrong');
        }
    }

    function handleReset() {
        setFormData(() => ({
            ...initialForm
        }))
    }

    useEffect(() => {
        if (invoiceData?.id) {
            setFormData(() => ({
                invoiceId: Number(invoiceData?.id),
                status: "",
            }))
        }
    }, [invoiceData?.id])


    return (<>
        {/* Assign To */}
        <div
            className="modal custom-modal fade modal-padding"
            id="invoice_status_update"
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
                            onClick={handleReset}
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
                                            onChange={(event) => {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    status: event.value
                                                }))
                                            }}
                                            options={invoiceStatus}
                                        />
                                    </div>
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

export default ChangeStatus