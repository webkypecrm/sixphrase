import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Select from "react-select";
import { toast } from 'react-toastify'
import axios from 'axios';
import { appointmentStatus } from '../../selectOption/selectOption';

const AddAppointment = ({ togglePopup, addLead, handleRefreshPage, customerOptions }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const initialForm = {
        name: "",
        appointmentDate: "",
        appointmentTime: "",
        categoryId: null,
        counselorName: "",
        treatment: "",
        assignedTo: null,
        message: "",
        status: "Schedule",
    }
    const [formData, setFormData] = useState(initialForm);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [leadOptions, setLeadOptions] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
   

    // console.log("formData =>", formData);

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
            let formDataToSend = { ...formData };

            const response = await fetch(`${apiUrl}/appointment/appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Token}`
                },
                body: JSON.stringify(formDataToSend)
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add appointment');
            }
            togglePopup()
            handleRefreshPage()
            setFormData(initialForm)
            toast.success('Appointment added successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    const fetchCategoryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/category-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setCategoryOptions(formattedData);

        } catch (error) {
            setError(error)

        }
    };

    const fetchLeadData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/lead/lead-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.leadName,
                value: item.leadId
            }));
            setLeadOptions(formattedData);

        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    };

    const fetchStaffData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/staff/staff-dropdown`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.staffId
            }));
            setStaffOptions(formattedData);

        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchCategoryData();
        fetchLeadData();
        fetchStaffData();
    }, [])


    return (
        <>
            <div className={`toggle-popup ${addLead ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Schedule Appointment</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={togglePopup}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Name"} <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='name'
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Appointment Date"} <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name='appointmentDate'
                                                min={new Date().toISOString().split("T")[0]}
                                                required
                                                value={formData.appointmentDate}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Time"} <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                name='appointmentTime'
                                                required
                                                value={formData.appointmentTime}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Category <span className="text-danger"></span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={categoryOptions.find(option => option.value === formData.categoryId)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'categoryId', value } })
                                                }}
                                                options={categoryOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Lead Name <span className="text-danger"></span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={leadOptions.find(option => option.value === formData.leadId)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'leadId', value } })
                                                }}
                                                options={leadOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Counselor Name"}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='counselorName'
                                                value={formData.counselorName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Treatment"}
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='treatment'
                                                value={formData.treatment}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Assigned To <span className="text-danger"></span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={staffOptions.find(option => option.value === formData.assignedTo)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'assignedTo', value } })
                                                }}
                                                options={staffOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Status <span className="text-danger"></span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={appointmentStatus.find(option => option.value === formData.status)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'status', value } })

                                                }}
                                                options={appointmentStatus}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Message"}
                                            </label>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                rows={1}
                                                name='message'
                                                value={formData.message}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className='dotted-line'>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" className="btn btn-light sidebar-close" onClick={togglePopup}>
                                        Cancel
                                    </Link>
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddAppointment