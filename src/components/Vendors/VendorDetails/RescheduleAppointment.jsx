import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { toast } from 'react-toastify';
import axios from 'axios';
import { appointmentStatus } from '../../../selectOption/selectOption';
import { getCurrentDate, getCurrentTime } from '../../../selectOption/selectFunction';

const RescheduleAppointment = ({ fetchLeadDetails, leadDetails, counselorOptions, fetchLeadFollowupData, fetchStageHistoryData, appointmentData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';

    const initialForm = {
        name: "",
        appointmentDate: getCurrentDate(),
        appointmentTime: getCurrentTime(),
        leadForId: null,
        serviceId: null,
        categoryId: 1,
        counselorId: null,
        treatment: "",
        assignedTo: null,
        message: "",
        status: "Reschedule",
    };
    const [formData, setFormData] = useState(initialForm);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [leadForOpitons, setLeadForOpitons] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([])

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formDataToSend = {
                ...formData,
                leadId: leadDetails?.leadId
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

            fetchLeadDetails();
            fetchLeadFollowupData();
            fetchStageHistoryData();
            handleRefresh();
            toast.success('Appointment updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    const fetchCategoryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/category-list`, {
                headers: { Authorization: `Bearer ${Token}` }
            });

            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setCategoryOptions(formattedData);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    function handleRefresh() {
        setFormData(() => ({
            ...initialForm,
            name: leadDetails?.leadName,
            leadId: leadDetails?.leadId,
            leadForId: leadDetails?.leadForId,
            serviceId: leadDetails?.serviceId,
        }))
    }

    const fetchLeadForData = async () => {
        try {
            const response = await fetch(`${apiUrl}/master/lead-for-list`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
            });
            const resData = await response.json();
            const formattedData = resData.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setLeadForOpitons(formattedData);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCategoryData();
        fetchLeadForData();
    }, []);

    useEffect(() => {
        if (leadDetails?.leadId) {
            setFormData((prevData) => ({
                ...prevData,
                name: leadDetails?.leadName,
                // appointmentDate: leadDetails?.meetingDate,  // No need for optional chaining again
                // appointmentTime: leadDetails?.meetingTime,
                // leadId: leadDetails?.leadId,
                // leadForId: leadDetails?.leadForId,
                // serviceId: leadDetails?.serviceId
            }));
        }
    }, [leadDetails]);

    useEffect(() => {

        if (appointmentData?.[0]) {
            setFormData((prevData) => ({
                ...prevData,
                appointmentDate: appointmentData[0].meetingDate,  // No need for optional chaining again
                appointmentTime: appointmentData[0].meetingTime,
                categoryId: appointmentData[0].meetingType === 'New' ? 1 : 2,
                counselorId: Number(appointmentData[0].meetingVenue),
                treatment: appointmentData[0].lastCallSummary,
                assignedTo: appointmentData[0].assignedTo,
                leadForId: appointmentData[0].leadForId,
                serviceId: appointmentData[0].serviceId
            }))
        }
    }, [appointmentData])

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/master/service-list-by-lead-for/${formData.leadForId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setServiceOptions(formattedData);
            } catch (error) {
                toast.error(error)
            }
        };
        if (formData?.leadForId) {
            fetchServiceData()
        }

    }, [formData.leadForId])

    // console.log("formData =>", formData)
    // console.log("appointmentData =>", appointmentData)
    // console.log("leadDetails =>", leadDetails)

    return (
        <div className="modal custom-modal fade modal-padding" id="reschedule_appointment" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Reschedule Meeting</h5>
                        <button type="button" className="btn-close position-static" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            required
                                            disabled
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Requirement</label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={leadForOpitons.find(option => option.value === formData.leadForId) || null}
                                            onChange={(selectedOption) => handleDropdownChange('leadForId', selectedOption.value)}
                                            options={leadForOpitons}
                                        // isDisabled={true}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Service <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={serviceOptions.find(option => option.value === formData.serviceId) || null}
                                            onChange={(selectedOption) => handleDropdownChange('serviceId', selectedOption.value)}
                                            options={serviceOptions}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Meeting Date <span className="text-danger">*</span></label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="appointmentDate"
                                            min={new Date().toISOString().split("T")[0]}
                                            required
                                            value={formData.appointmentDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Meeting Time <span className="text-danger">*</span></label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            name="appointmentTime"
                                            required
                                            value={formData.appointmentTime}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                {/* <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Category</label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={categoryOptions.find(option => option.value === formData.categoryId)}
                                            onChange={(selectedOption) => handleDropdownChange('categoryId', selectedOption.value)}
                                            options={categoryOptions}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Counselor Name</label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={counselorOptions.find(option => option.value === formData.counselorId) || null}
                                            onChange={(selectedOption) => handleDropdownChange('counselorId', selectedOption.value)}
                                            options={counselorOptions}
                                        />
                                    </div>
                                </div> */}
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            {"Meeting Link"}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name='treatment'
                                            maxLength={250}
                                            value={formData.treatment}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6" >
                                    <div className="form-wrap">
                                        <label className="col-form-label">Status <span className="text-danger">*</span></label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            required
                                            value={appointmentStatus.find(option => option.value === formData.status)}
                                            onChange={(selectedOption) => handleDropdownChange('status', selectedOption.value)}
                                            options={appointmentStatus}
                                        // isDisabled
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Message/Meeting Address</label> <span>(500 words only)</span>
                                        <textarea
                                            className="form-control"
                                            rows={2}
                                            name="message"
                                            maxLength={500}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 text-end modal-btn">
                                    <Link
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                        onClick={handleRefresh}
                                    >Cancel</Link>
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                        data-bs-dismiss="modal"
                                    // onClick={handleRefresh}
                                    >Confirm</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RescheduleAppointment;
