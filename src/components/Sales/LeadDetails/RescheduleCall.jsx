import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { getCurrentDate, getCurrentTime } from '../../../selectOption/selectFunction';



const RescheduleCall = ({ fetchLeadFollowupData, leadDetails, callData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const initialForm = {
        leadId: leadDetails?.leadId,
        callBackDate: getCurrentDate(),
        callBackTime: getCurrentTime(),
        lastCallSummary: '',
        status: 'Re-scheduled', //Scheduled, Re-scheduled, Done
        remindeMe: '', // not use yet
        callBack: '', //not use here
    }
    const [formData, setFormData] = useState(initialForm);

    const handleDateChange1 = (date) => {
        // setSelectedDate1(date);
        setFormData((prevData) => ({
            ...prevData,
            callBackDate: date
        }))

    };
    const handleTimeChange1 = (time) => {
        // setSelectedTime1(time);
        setFormData((prevData) => ({
            ...prevData,
            callBackTime: time
        }))
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "callBackDate") {
            const today = new Date().toISOString().split("T")[0];
            if (value < today) {
                toast.error("Please select a future date.");
                return;
            }
        }

        if (name === "callBackTime") {
            const today = new Date().toISOString().split("T")[0];
            const selectedDate = formData.callBackDate;
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

    // console.log('formData in Call  =>', formData)
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.leadId = leadDetails?.leadId
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/lead/update-call-rescheduled`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to update call');
            }
            // togglePopup()
            // fetchLeadData()
            setFormData((prev) => ({ ...initialForm }))
            fetchLeadFollowupData()
            toast.success('Call updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    const now = new Date();

    const getMinTime = () => {
        const selectedDate = formData.callBackDate ? new Date(formData.callBackDate) : now;
        const today = new Date().setHours(0, 0, 0, 0);
        const selectedDay = selectedDate.setHours(0, 0, 0, 0);

        return selectedDay === today ? now : new Date().setHours(0, 0, 0, 0);
    };

    useEffect(() => {
        if (leadDetails?.leadId) {
            setFormData((prevData) => ({
                ...prevData,
                leadId: leadDetails?.leadId
            }));
        }
    }, [leadDetails]);

    useEffect(() => {

        if (callData?.[0]) {
            setFormData((prevData) => ({
                ...prevData,
                callBackDate: callData[0]?.callBackDate,
                callBackTime: callData[0]?.callBackTime,
            }));
        }

    }, [callData])

    return (
        <div
            className="modal custom-modal fade modal-padding"
            id="create_call_rescheduled"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Re-scheduled Call </h5>
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
                                {/* <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Date <span className="text-danger"> *</span>
                                        </label>
                                        <div className="icon-form">
                                            <span className="form-icon">
                                                <i className="ti ti-calendar-check" />
                                            </span>
                                            <DatePicker
                                                className="form-control datetimepicker deals-details"
                                                selected={formData.callBackDate}
                                                onChange={handleDateChange1}
                                                dateFormat="dd-MM-yyyy"
                                                minDate={new Date()}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Time <span className="text-danger"> *</span>
                                        </label>
                                        <div className="icon-form">
                                            <span className="form-icon">
                                                <i className="ti ti-calendar-check" />
                                            </span>
                                            <DatePicker
                                                className="form-control datetimepicker deals-details"
                                                selected={formData.callBackTime}
                                                onChange={(time) => handleTimeChange1(time)}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={15} // Time intervals (15 minutes)
                                                timeCaption="Time"
                                                dateFormat="h:mm aa" // AM/PM format 
                                                minTime={getMinTime()}
                                                maxTime={new Date().setHours(23, 59, 59, 999)} // End of the day                                                
                                            />
                                        </div>
                                    </div>
                                </div> */}
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Date <span className="text-danger">*</span></label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="callBackDate"
                                            min={new Date().toISOString().split("T")[0]}
                                            required
                                            value={formData.callBackDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Time <span className="text-danger">*</span></label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            name="callBackTime"
                                            required
                                            value={formData.callBackTime}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Remark
                                        </label>
                                        <input
                                            className="form-control"
                                            name="lastCallSummary"
                                            placeholder="Add text"
                                            onChange={(event) => {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    lastCallSummary: event.target.value
                                                }))
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
                                            className="btn btn-primary"
                                            data-bs-dismiss="modal"
                                        >
                                            Confirm
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

export default RescheduleCall