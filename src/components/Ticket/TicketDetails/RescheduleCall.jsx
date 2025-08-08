import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';



const RescheduleCall = ({ fetchTaskLogData, taskDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const initialForm = {
        // taskId: taskDetails?.id,
        supportTicketId: taskDetails?.id,
        callBackDate: new Date(),
        callBackTime: new Date(),
        lastCallSummary: '',
        status: 'Re-scheduled', //Scheduled, Re-scheduled, Done
        remindeMe: true, // not use yet
        callBack: true, //not use here
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

    // console.log('formData in Call  =>', formData)
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.supportTicketId = taskDetails?.id
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/product/update-call-rescheduled`, {
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
           
            setFormData((prev) => ({ ...initialForm }))
            fetchTaskLogData()
            toast.success('Call updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    return (
        <div
            className="modal custom-modal fade modal-padding"
            id="create_ticket_call_rescheduled"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Re-scheduled Calll </h5>
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
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Remark <span className="text-danger"> *</span>
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