import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Select from "react-select";
import {
    statusList,
} from "../../../selectOption/selectOption";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';



const CreateCall = ({ fetchTaskDetails, taskDetails }) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const initialForm = {
        taskId: taskDetails?.taskId,
        callBackDate: new Date(),
        callBackTime: new Date(),
        lastCallSummary: '',
        status: 'Scheduled', //Scheduled, Re-scheduled, Done
        remindeMe: '', // not use yet
        callBack: '', //not use here
    }
    const [formData, setFormData] = useState(initialForm);
    // const [selectedDate1, setSelectedDate1] = useState(new Date());
    // const [selectedTime1, setSelectedTime1] = useState(null);
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

    console.log('formData in Call  =>', formData)
    console.log('taskDetails  =>', taskDetails)

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.taskId = taskDetails.taskId
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/task/call-update`, {
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
            fetchTaskDetails()
            toast.success('Call updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    return (
        <div
            className="modal custom-modal fade modal-padding"
            id="create_task_call"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create Call Log</h5>
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
                                            Status <span className="text-danger"> *</span>
                                        </label>
                                        <Select
                                            className="select"
                                            classNamePrefix="react-select"                                         
                                            onChange={(event) => {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    status: event.value
                                                }))
                                            }}
                                            options={statusList}
                                        />
                                    </div>
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

export default CreateCall