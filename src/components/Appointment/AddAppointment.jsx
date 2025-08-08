import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Select from "react-select";
import { toast } from 'react-toastify'
import axios from 'axios';
import { appointmentStatus } from '../../selectOption/selectOption';
import { getCurrentDate, getCurrentTime } from '../../selectOption/selectFunction';
import AddLead from '../Sales/AddLead';

const AddAppointment = ({ togglePopup, addLead, handleRefreshPage, leadForOpitons }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const staffId = localStorage.getItem('staffId') || '';
    const initialForm = {
        leadId: null,
        name: "",
        appointmentDate: getCurrentDate(),
        appointmentTime: getCurrentTime(),
        categoryId: 1,
        counselorName: "",
        counselorId: null,
        treatment: "",
        message: "",
        status: "Schedule",
        leadForId: ""
    }
    const [formData, setFormData] = useState(initialForm);
    const [categoryOptions, setCategoryOptions] = useState([]);
    // const [leadOptions, setLeadOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    // const [leadForOpitons, setLeadForOpitons] = useState([]);
    // const [leadDetails, setLeadDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [addLead2, setAddLead2] = useState(false);
    const [leadOptions, setLeadOptions] = useState([]);
    const [sourceOptions, setSourceOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);

    // console.log("formData =>", formData);

    const togglePopup2 = () => {
        setAddLead2((prev) => !prev)
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "appointmentDate") {
            const today = new Date().toISOString().split("T")[0];
            if (value < today) {
                toast.error("Please select a future date.");
                return;
            }
        }

        if (name === "appointmentTime") {
            const today = new Date().toISOString().split("T")[0];
            const selectedDate = formData.appointmentDate;
            const now = new Date();
            const selectedDateTime = new Date(`${selectedDate}T${value}`);

            if (selectedDate === today && selectedDateTime < now) {
                toast.error("Please select a future time.");
                return;
            }
        }

        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleReset = () => {
        setFormData(() => ({
            ...initialForm
        }))
    }

    const handleCustomerSelected = (data) => {
        setFormData((prevData) => ({
            ...prevData,
            // customerId: data?.customerId,
            leadId: data?.leadId,
            name: data?.leadName
        }))
        // setLeadDetails(() => ({
        //     ...data
        // }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.leadForId === null) {
            toast.error("Lead For is required")
            return
        }

        try {
            setIsLoading(true);

            const formDataToSend = {
                ...formData,
                // leadId: leadDetails?.leadId
            };

            const response = await fetch(`${apiUrl}/appointment/appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Token}`
                },
                body: JSON.stringify(formDataToSend)
            });

            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add appointment');
            }

            // fetchLeadDetails();
            // fetchLeadFollowupData();
            // fetchStageHistoryData();
            handleReset()
            handleRefreshPage()
            togglePopup()
            toast.success('Appointment added successfully!');
            setIsLoading(false)
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
            setIsLoading(false)
        }
    };

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

    // const fetchCustomerData = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}/customer/customerDropdown`, {
    //             headers: {
    //                 Authorization: `Bearer ${Token}`
    //             }
    //         });
    //         const formattedData = response.data.data.map((item) => ({
    //             label: item.customerName,
    //             value: item.customerId,
    //             data: item
    //         }));
    //         setCustomerOptions(formattedData);

    //     } catch (error) {
    //         console.log(error)
    //         toast.error(error.message);
    //     }
    // };

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

    // const fetchLeadForData = async () => {
    //     try {
    //         const response = await fetch(`${apiUrl}/master/lead-for-list`, {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: `Bearer ${Token}`
    //             },
    //         });
    //         const resData = await response.json();
    //         const formattedData = resData.data.map((item) => ({
    //             label: item.name,
    //             value: item.id
    //         }));
    //         setLeadForOpitons(formattedData);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const fetchCountryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/employee/country-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setCountryOptions(formattedData);

        } catch (error) {
            console.log(error)

        }
    };

    const fetchLeadData = async () => {
        try {
            const leadFor = formData?.leadForId

            const response = await axios.get(`${apiUrl}/lead/leadDropdown?leadFor=${leadFor}`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.leadName,
                value: item.leadId,
                data: item
            }));
            setLeadOptions(formattedData);

        } catch (error) {
            console.log(error)
            toast.error(error.message);
        }
    };

    const fetchSourceData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/source-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setSourceOptions(formattedData);

        } catch (error) {
            console.log(error)

        }
    };

    useEffect(() => {
        // fetchLeadData();
        fetchCategoryData();
        fetchStaffData();
        // fetchCustomerData();
        // fetchLeadForData();
        fetchSourceData();
        fetchCountryData();
    }, [])

    useEffect(() => {
        if (staffId !== '') {
            setFormData((prevData) => ({
                ...prevData,
                counselorId: Number(staffId)
            }))
        }
    }, [staffId])

    useEffect(() => {
        if (formData?.leadForId !== "") {
            fetchLeadData()
        }
    }, [formData?.leadForId])


    console.log("formData =>", formData)
    return (
        <>
            <div className={`toggle-popup ${addLead ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Add New Appointment</h4>
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
                                            <label className="col-form-label">Lead For<span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={leadForOpitons.find(option => option.value === formData.leadForId) || null}
                                                onChange={(selectedOption) => handleDropdownChange('leadForId', selectedOption.value)}
                                                options={leadForOpitons}
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
                                    <div className="col-md-8">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Lead Name <span className="text-danger"></span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={leadOptions.find(option => option.value === formData.leadId) || null}
                                                onChange={(event) => {
                                                    let { data } = event;
                                                    handleCustomerSelected(data)
                                                }}
                                                options={leadOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                            </label>
                                            <ul style={{ marginTop: '0.5rem' }}>
                                                <li>
                                                    <Link
                                                        to="#"
                                                        className="com-add"
                                                        onClick={() => togglePopup2(false)}
                                                        style={{ color: 'blue' }}
                                                    >
                                                        <i className="ti ti-square-rounded-plus" />
                                                        Add New Lead
                                                    </Link>
                                                </li>
                                            </ul>
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
                                                value={categoryOptions.find(option => option.value === formData.categoryId) || null}
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
                                                Counselor Name <span className="text-danger"></span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={staffOptions.find(option => option.value === formData.counselorId) || null}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'counselorId', value } })
                                                }}
                                                options={staffOptions}
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
                                                Status <span className="text-danger"></span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={appointmentStatus.find(option => option.value === formData.status) || null}
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
                                                rows={2}
                                                name='message'
                                                value={formData.message}
                                                maxLength={200}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className='dotted-line'>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" className="btn btn-light sidebar-close"
                                        onClick={() => {
                                            togglePopup()
                                            handleReset()
                                        }}>
                                        Cancel
                                    </Link>
                                    {
                                        isLoading ?
                                            <button type="submit" disabled className="btn btn-primary">
                                                Sending...
                                            </button>
                                            :
                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <AddLead
                addLead={addLead2}
                togglePopup={togglePopup2}
                sourceOptions={sourceOptions}
                countryOptions={countryOptions}
                categoryOptions={categoryOptions}
                fetchLeadData={fetchLeadData}
            />

        </>
    )
}

export default AddAppointment