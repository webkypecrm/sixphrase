import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Activities from './Activities';
import Meeting from './Meeting';
import Comment from './Comments';
import Call from './Call';
import Proposal from './Proposal';
import axios from 'axios';
import Task from './Task';
import File from './File';
import Appointment from './Appointment';


const LeadPreview = ({ leadPreview, setLeadPreview, leadDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [leadFollowupData, setLeadFollowupData] = useState([]);
    const [taskTab, setTaskTab] = useState(false);

    // console.log('leadFollowData =>', leadFollowupData)

    const fetchLeadFollowupData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/lead/lead-followup/${leadDetails.leadId}`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            setLeadFollowupData((prev) => [...response.data.data]);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        if (leadDetails?.leadId) {
            fetchLeadFollowupData(leadDetails)
        }
    }, [leadDetails?.leadId])

    // console.log("leadDetails =>", leadDetails)


    return (
        <>
            <div className={`toggle-popup ${leadPreview ? "sidebar-popup" : ""}`}
            >
                <div className={`${taskTab ? "sidebar-layout-extend" : "sidebar-layout"}`}>
                    <div className={`${taskTab ? "sidebar-header-extend" : "sidebar-header"}`}>
                        <h4>Lead Preview</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => {
                                setLeadPreview(prev => !prev)

                            }}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="col-xl-12">
                        <div className="contact-tab-wrap">
                            <ul className="contact-nav nav">
                                <li>
                                    <Link
                                        to="#"
                                        data-bs-toggle="tab"
                                        data-bs-target="#activities"
                                        className="active"
                                    >
                                        <i className="ti ti-eye" />
                                        Activities
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" data-bs-toggle="tab" data-bs-target="#calls"
                                        onClick={() => {
                                            setTaskTab(false)
                                        }}>
                                        <i className="ti ti-phone" />
                                        Calls
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" data-bs-toggle="tab" data-bs-target="#lead-appointments"
                                        onClick={() => {
                                            setTaskTab(false)
                                        }}>
                                        <i className="ti ti-notes" />
                                        Meeting
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" data-bs-toggle="tab" data-bs-target="#comments"
                                        onClick={() => {
                                            setTaskTab(false)
                                        }}>
                                        <i className="ti ti-file" />
                                        Comment
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" data-bs-toggle="tab" data-bs-target="#files"
                                        onClick={() => {
                                            setTaskTab(false)
                                        }}>
                                        <i className="ti ti-mail-check" />
                                         Files
                                    </Link>
                                </li>
                                
                            </ul>
                        </div>
                        {/* Tab Content */}
                        <div className="contact-tab-view">
                            <div className="tab-content pt-0">
                                {/* Activities */}
                                <Activities leadFollowupData={leadFollowupData} />
                                {/* /Activities */}
                                {/* Calls */}
                                <Call
                                    leadFollowupData={leadFollowupData}
                                    fetchLeadFollowupData={fetchLeadFollowupData}
                                    leadDetails={leadDetails} />
                                {/* /Calls */}
                                {/* Meeting */}
                                {/* <Meeting
                                    leadFollowupData={leadFollowupData}
                                    fetchLeadFollowupData={fetchLeadFollowupData}
                                    leadDetails={leadDetails}
                                /> */}
                                {/* /Meeting */}
                                {/* Meeting */}

                                <Appointment
                                    leadFollowupData={leadFollowupData}
                                    fetchLeadFollowupData={fetchLeadFollowupData}
                                    leadDetails={leadDetails}
                                />


                                {/* /Meeting */}
                                {/* Comments */}
                                <Comment
                                    leadFollowupData={leadFollowupData}
                                    fetchLeadFollowupData={fetchLeadFollowupData}
                                    leadDetails={leadDetails}
                                />
                                {/* /Comments */}
                                {/* Proposal */}
                                {/* <Proposal
                                    leadFollowupData={leadFollowupData}
                                    fetchLeadFollowupData={fetchLeadFollowupData}
                                    leadDetails={leadDetails}
                                /> */}
                                {/* Proposal */}
                                {/* File */}
                                <File
                                    leadFollowupData={leadFollowupData}
                                    fetchLeadFollowupData={fetchLeadFollowupData}
                                    leadDetails={leadDetails}
                                />
                                {/* File */}
                                {/* <Task
                                    leadFollowupData={leadFollowupData}
                                    fetchLeadFollowupData={fetchLeadFollowupData}
                                    leadDetails={leadDetails}
                                /> */}
                            </div>
                        </div>
                        {/* /Tab Content */}
                    </div>

                </div>
            </div>
        </>
    )
}

export default LeadPreview




