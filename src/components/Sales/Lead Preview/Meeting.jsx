import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Select from "react-select";
import {
    statusList,
} from "../../../selectOption/selectOption";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import MeetingList from './MeetingList';
import { Empty } from 'antd';
import RescheduleMeeting from '../LeadDetails/RescheduleMeeting';
import AddMeetingComment from '../LeadDetails/AddMeetingComment';



const Meeting = ({ leadFollowupData, fetchLeadFollowupData, leadDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const data = leadFollowupData.filter((item) => item.type == 'meetingUpdate')
    const initialForm = {
        meetingDate: new Date(),
        meetingTime: new Date(),
        meetingType: 'online',
        status: '', //Scheduled, Re-scheduled, Done
        lastCallSummary: '',
        remindeMe: '', // not use yet
        meetingVenue: '', //not use here
    }
    const [formData, setFormData] = useState(initialForm);
    const [followUpId, setFollowUp] = useState('');


    const leadDetail = data[0]

    const handleDateChange1 = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            meetingDate: date
        }))
    };
    const handleTimeChange1 = (time) => {
        setFormData((prevData) => ({
            ...prevData,
            meetingTime: time
        }))
    };

    function handleChangeType(event) {
        setFormData((prevData) => ({
            ...prevData,
            meetingType: event.target.name
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.leadId = leadDetails.leadId
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/lead/meeting-update`, {
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
            fetchLeadFollowupData()
            toast.success('Meeting updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    return (<>
        <div className="tab-pane fade" id="notes">
            <div className="view-header">
                <h4>Meeting</h4>
                {(leadFollowupData[0]?.status == 'Done' || leadFollowupData[0]?.status == '' || leadFollowupData[0]?.length === 0) &&
                    <ul>
                        <li>
                            <Link
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#add_notes"
                                className="com-add"
                            >
                                <i className="ti ti-circle-plus me-1" />
                                Add New
                            </Link>
                        </li>
                    </ul>
                }
            </div>
            {data.length === 0 ? <Empty description={false} /> :
                <div className="contact-activity">
                    {data.map((item, index) =>
                        <MeetingList
                            key={item.id}
                            data={item}
                            index={index}
                            setFollowUp={setFollowUp}
                        />
                    )}
                </div>
            }
        </div>
        {/* Add Meeting */}
        <div
            className="modal custom-modal fade modal-padding"
            id="add_notes"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Meeting</h5>
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
                                                selected={formData.meetingDate}
                                                onChange={(date) => handleDateChange1(date)}
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
                                                selected={formData.meetingTime}
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
                                            value={statusList.find(option => formData.status == option)}
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
                                            placeholder="Add text"
                                            onChange={(event) => {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    lastCallSummary: event.target.value
                                                }))
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <div className="radio-wrap radio-wrap inline-radio-button">
                                            <label className="col-form-label">Meeting Type:</label>
                                            <div className="d-flex flex-wrap">
                                                <div className="radio-btn">
                                                    <input
                                                        type="radio"
                                                        className="status-radio"
                                                        id="meetingOnline"
                                                        name="online"
                                                        value='online'
                                                        checked={formData.meetingType == 'online'}
                                                        onChange={handleChangeType}
                                                    />
                                                    <label htmlFor="meetingOnline">Online</label>
                                                </div>
                                                <div className="radio-btn">
                                                    <input
                                                        type="radio"
                                                        className="status-radio"
                                                        id="meetingOffline"
                                                        name="offline"
                                                        value='offline'
                                                        checked={formData.meetingType == 'offline'}
                                                        onChange={handleChangeType}
                                                    />
                                                    <label htmlFor="meetingOffline">Offline</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {formData.meetingType === 'online' ?
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Link <span className="text-danger"> *</span>
                                                </label>
                                                <input
                                                    className="form-control"
                                                    name="link"
                                                    onChange={(event) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            meetingVenue: event.target.value
                                                        }))
                                                    }}
                                                />
                                            </div> :
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Address <span className="text-danger"> *</span>
                                                </label>
                                                <input
                                                    className="form-control"
                                                    name="address"
                                                    onChange={(event) => {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            meetingVenue: event.target.value
                                                        }))
                                                    }}
                                                />
                                            </div>
                                        }

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
        {/* Add Meeting */}


        <RescheduleMeeting fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={leadDetail} />

        <AddMeetingComment fetchLeadFollowupData={fetchLeadFollowupData} followUpId={followUpId} />

    </>
    )
}

export default Meeting