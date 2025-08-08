import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Select from "react-select";
import {
    statusList,
} from "../../../selectOption/selectOption";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { event } from 'jquery';
import CallList from './CallList';
import { Empty } from 'antd';
import AddCallComment from '../VendorDetails/AddCallComment';
import RescheduleCall from '../VendorDetails/RescheduleCall';



const Call = ({ leadFollowupData, fetchLeadFollowupData, leadDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const data = leadFollowupData.filter((item) => item.type == 'callUpdate')
    const initialForm = {
        leadId: leadDetails.leadId,
        callBackDate: new Date().toISOString().split("T")[0],
        callBackTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
        lastCallSummary: '',
        status: 'Scheduled', //Scheduled, Re-scheduled, Done
        remindeMe: '', // not use yet
        callBack: '', //not use here
    }
    const [formData, setFormData] = useState(initialForm);
    const [followUpId, setFollowUp] = useState('');
    const leadDetail = data[0]


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
            const response = await fetch(`${apiUrl}/lead/call-update`, {
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
            toast.success('Call updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    // console.log('formData in Call  =>', formData)
    return (<>
        <div className="tab-pane fade" id="calls">
            <div className="view-header">
                <h4>Calls</h4>
                {(leadFollowupData[0]?.status == 'Done' || leadFollowupData[0]?.status == '' || leadFollowupData[0]?.length === 0) &&
                    <ul>
                        <li>
                            <Link
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#create_call"
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
                <div className="calls-activity">
                    <div className="contact-activity">
                        {data.map((item, index) => (
                            <CallList
                                key={item.id}
                                data={item}
                                index={index}
                                fetchLeadFollowupData={fetchLeadFollowupData}
                                setFollowUp={setFollowUp}
                            />
                        ))}
                    </div>
                </div>
            }
        </div>
        {/* Create Call Log */}
        <div
            className="modal custom-modal fade modal-padding"
            id="create_call"
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
                                        <label className="col-form-label">Date <span className="text-danger">*</span></label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="callBackDate"
                                            min={new Date().toISOString().split("T")[0]}
                                            required
                                            value={formData?.callBackDate}
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
                                            Status <span className="text-danger"> *</span>
                                        </label>
                                        <Select
                                            className="select"
                                            classNamePrefix="react-select"
                                            value={statusList.find(option => option.value === formData?.status) || ''}
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
        {/* Create Call Log */}

        <AddCallComment fetchLeadFollowupData={fetchLeadFollowupData} followUpId={followUpId} />
        <RescheduleCall fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={leadDetail} callData={leadDetail} />

    </>
    )
}

export default Call