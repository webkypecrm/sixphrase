import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import axios from 'axios';


const MultipleAssignTo = ({ selectedRowKeys, fetchLeadData, setSelectedRowKeys }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [staffOptions, setStaffOptions] = useState([]);

    const initialForm = {
        leadsId: '',
        staffId: '',
    }
    const [formData, setFormData] = useState(initialForm);
    // console.log('staffOptions', staffOptions)?
    // console.log('formData', formData)


    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.leadsId = JSON.stringify(selectedRowKeys)
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/lead/assign-many-lead`, {
                method: 'POST',
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
            setSelectedRowKeys([])
            fetchLeadData()
            toast.success('Updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/staff/staff-list`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.staffId
                }));
                setStaffOptions(() => [...formattedData]);

            } catch (error) {
                toast.error(error);
            }
        };

        if (selectedRowKeys.length > 0) {
            fetchStaffData()
        }

    }, [selectedRowKeys])

    return (<>
        {/* Assign To */}
        <div
            className="modal custom-modal fade modal-padding"
            id="multiple_assigned_to"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"> Assign Many Lead To</h5>
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
                                            Staff <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            // value={staffOptions.find(option => option.value === formData.staffId)}
                                            onChange={(event) => {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    staffId: event.value
                                                }))
                                            }}
                                            options={staffOptions}
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
        {/* Assign To */}
    </>
    )
}

export default MultipleAssignTo