import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const AppointmentList = ({ lead, appointmentData = [] }) => {
    const [counselorOptions, setCounselorOptions] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';

    function getDate(value) {
        const isoDateString = value;
        const date = new Date(isoDateString);
        // Format date into "DD MMM YYYY"
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }

    function getTime(value) {
        const isoDateString = value;
        const date = new Date(isoDateString);

        // Get hours, minutes, and determine AM/PM
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';

        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'

        const formattedTime = `${hours}:${minutes} ${ampm}`;
        return formattedTime;
    }

    function formatTimeToAmPm(time) {
        // Split the input time into hours and minutes
        const [hours, minutes] = time.split(":").map(Number);

        // Determine AM or PM
        const amPm = hours >= 12 ? "PM" : "AM";

        // Convert hours to 12-hour format
        const formattedHours = hours % 12 || 12;

        // Return the formatted time
        return `${formattedHours}:${minutes?.toString().padStart(2, "0")} ${amPm}`;
    }

    const fetchCounselorData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/appointment/counselor-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.staffId
            }));
            setCounselorOptions(formattedData);

        } catch (error) {
            console.log(error)

        }
    };

    useEffect(() => {
        fetchCounselorData()
    }, [])

    return (
        <div className="notes-activity" >
            <div className="calls-box" >
                <div className="caller-info">
                    <div className="calls-user">
                        <img
                            src={lead?.staff?.profilePicUrl}
                            alt="img"
                        />
                        <div style={{ display: 'grid' }}>
                            <div style={{ display: 'flex', alignContent: 'center', gap: "10px" }}>
                                <p style={{ color: 'green' }}>
                                    <span>{lead?.staff?.name}</span> <strong>{lead?.status.toLowerCase()}</strong> a meeting on {getDate(lead.meetingDate)}, {formatTimeToAmPm(lead.meetingTime)}
                                </p>
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={<Tooltip id="mark-meeting-tooltip">Remind me</Tooltip>}
                                  
                                >
                                    <div className="status-toggle small-toggle-btn"
                                      style ={{marginTop:'5px'}}
                                    >
                                        <input
                                            type="checkbox"
                                            id="user1"
                                            className="check"
                                            defaultChecked={true}
                                        />
                                        <label htmlFor="user1" className="checktoggle" />
                                    </div>
                                </OverlayTrigger>
                            </div>

                            {/* } */}
                            <span className="badge-day" style={{ fontSize: 'x-small', margin: '0', maxWidth: '8rem' }}>{getDate(lead?.createdAt)},{getTime(lead?.createdAt)}</span>

                        </div>
                    </div>
                    {/* {index === 0 && */}
                    <div className="calls-action">
                        <div className="dropdown call-drop">
                            {lead?.status == 'Done' ?
                                <Link
                                    to="#"
                                    aria-expanded="false"
                                >
                                    <img
                                        src="/assets/img/meeting-done.jpg"
                                        alt="img"
                                        style={{ width: '38px', height: '40px' }}
                                    />
                                </Link>
                                :
                                ''
                            }
                        </div>
                    </div>
                </div>
                <p>
                    {lead?.lastCallSummary}
                </p>
                <div className="upcoming-info">
                    <div className="row">
                        <div className="col-sm-4">
                            <p>Requirement</p>
                            <div className="dropdown">
                                <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {lead?.LeadFor?.name.toUpperCase()}
                                </Link>

                            </div>
                        </div>
                        <div className="col-sm-4">
                            <p>Service</p>
                            <div className="dropdown">
                                <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    aria-expanded="false"
                                >
                                    {/* {console.log("lead =>", lead)}
                                    {console.log("counselorOptions =>", counselorOptions)} */}
                                    <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                    {/* {counselorOptions.find(option => option.value == lead.meetingVenue)?.label || 'Select Counsellor'} */}
                                    {lead?.Service?.name || 'Select Counsellor'}
                                </Link>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <p>Meeting Link</p>

                            <div className="dropdown">
                                <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    aria-expanded="false"
                                >
                                    <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                    {lead?.lastCallSummary}
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
                {
                    lead?.comment &&
                    <div className="reply-box">
                        <p>
                            {lead?.comment}
                        </p>
                    </div>
                }
            </div>
        </div>
    )
}

export default AppointmentList