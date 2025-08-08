import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    convertToAmPm
} from "../../../selectOption/selectFunction";
import { Empty } from 'antd';
import axios from 'axios';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import CreateAppointment from '../VendorDetails/CreateAppointment';
import AddAppointmentComment from '../VendorDetails/AddAppointmentComment';
import RescheduleAppointment from '../VendorDetails/RescheduleAppointment';



const Appointment = ({ leadFollowupData, fetchLeadFollowupData, leadDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [counselorOptions, setCounselorOptions] = useState([]);
    const [appointmentData, setAppointmentData] = useState([]);
    const [followUpId, setFollowUp] = useState('');


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
        if (Array.isArray(leadFollowupData)) {
            const data = leadFollowupData.filter((item) => item.type == 'appointment')
            setAppointmentData(() => ([...data]))
        }

        fetchCounselorData()
    }, [leadFollowupData])


    // console.log("appointmentData =>", appointmentData)


    return (<>
        <div className="tab-pane fade" id="lead-appointments">
            <div className="view-header">
                <h4>Meeting</h4>
                <ul>
                    {(appointmentData[0]?.status == 'Done' || appointmentData[0]?.status == 'Visited' || appointmentData[0]?.status == 'Cancelled' || appointmentData[0]?.status == '' || appointmentData?.length === 0) &&
                        <li>
                            <Link
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#create_appointment"
                                className="com-add"
                            >
                                <i className="ti ti-circle-plus me-1" />
                                Add New
                            </Link>
                        </li>
                    }
                </ul>
            </div>
            <div className="notes-activity" >
                {appointmentData?.length == 0 && <Empty description={false} />}
                {appointmentData?.map((data, index) => <div className="calls-box" key={data?.id}>
                    {/* {console.log('data in AppoitmentData =>', data)} */}
                    <div className="caller-info">
                        <div className="calls-user">
                            <img
                                src={data?.staff?.profilePicUrl}
                                alt="img"
                            />
                            <div style={{ display: 'grid' }}>
                                {index > 0 ?
                                    <del style={{ color: 'red' }}><p>
                                        <span>{data?.staff?.name}</span> <strong>{data?.status.toLowerCase()}</strong> a meeting on {getDate(data?.meetingDate)}, {convertToAmPm(data.meetingTime)}
                                    </p>
                                    </del>
                                    :
                                    <>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <p style={{ color: 'green' }}>
                                                <span>{data?.staff?.name}</span> <strong>{data?.status.toLowerCase()}</strong> a meeting on {getDate(data?.meetingDate)}, {convertToAmPm(data?.meetingTime)}
                                            </p>
                                            <OverlayTrigger
                                                placement="bottom"
                                                overlay={<Tooltip id="mark-meeting-tooltip">Remind me</Tooltip>}
                                            >
                                                <div className="status-toggle small-toggle-btn">
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

                                    </>
                                }
                                <span className="badge-day" style={{ fontSize: 'x-small', margin: '0', maxWidth: '8rem' }}>{getDate(data?.createdAt)},{getTime(data?.createdAt)}</span>
                            </div>
                        </div>
                        {index === 0 &&
                            <div className="calls-action">
                                <div className="dropdown call-drop">
                                    {(data?.status == 'Done') ?
                                        (<Link
                                            to="#"
                                            aria-expanded="false"
                                        >
                                            <img
                                                src="/assets/img/meeting-done.jpg"
                                                alt="img"
                                                style={{ width: '38px', height: '40px' }}
                                            />

                                        </Link>)
                                        :
                                        (
                                            (data?.status !== 'Cancelled' &&
                                                (<OverlayTrigger
                                                    placement="bottom"
                                                    overlay={<Tooltip id="mark-meeting-tooltip">Mark Done</Tooltip>}
                                                >
                                                    <Link
                                                        to="#"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#create_appointment_comment"
                                                        className="dropdown-toggle bg-pending"
                                                        aria-expanded="false"
                                                        onClick={() => {
                                                            setFollowUp(data?.id)
                                                        }}
                                                    >
                                                        <i className="ti ti-square-check" />

                                                    </Link>
                                                </OverlayTrigger>)
                                            )
                                        )
                                    }
                                </div>
                                {data?.status !== 'Done' && data?.status !== 'Cancelled' &&
                                    <div className="dropdown call-drop">
                                        {
                                            <OverlayTrigger
                                                placement="bottom"
                                                overlay={<Tooltip id="rescheduled-meeting-tooltip">Re-scheduled Meeting</Tooltip>}
                                            >
                                                <Link
                                                    to="#"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#reschedule_appointment"
                                                    className="dropdown-toggle"
                                                    aria-expanded="false"
                                                    onClick={() => {
                                                        setFollowUp(data?.id)
                                                    }}
                                                >
                                                    <i className="ti ti-calendar-month" />
                                                </Link>
                                            </OverlayTrigger>

                                        }
                                    </div>
                                }

                            </div>
                        }

                    </div>
                    <p>
                        {data?.lastCallSummary}
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
                                        {data?.LeadFor?.name.toUpperCase() || ''}
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
                                        {/* {console.log("counselorOptions =>", counselorOptions)} */}
                                        <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                        {/* {counselorOptions.find(option => option.value == data.meetingVenue)?.label || 'Select Counsellor'} */}
                                        {data?.Service?.name || ''}
                                    </Link>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <p>Meeting Link</p>
                                <div className="dropdown">
                                    <a
                                        href={`${data?.lastCallSummary}`}

                                        className="dropdown-toggle"
                                        aria-expanded="false"
                                    >
                                        <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                        {data?.lastCallSummary}
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                    {
                        data?.comment &&
                        <div className="reply-box">
                            <p>
                                {data?.comment}
                            </p>
                        </div>
                    }
                </div>
                )}
            </div>
        </div>


        <CreateAppointment
            leadDetails={leadDetails}
            fetchLeadDetails={() => { return }}
            fetchLeadFollowupData={fetchLeadFollowupData}
            counselorOptions={counselorOptions}
            fetchStageHistoryData={() => { return }}
        />

        <RescheduleAppointment
            leadDetails={leadDetails}
            fetchLeadDetails={() => { return }}
            fetchLeadFollowupData={fetchLeadFollowupData}
            counselorOptions={counselorOptions}
            fetchStageHistoryData={() => { return }}
            appointmentData={appointmentData}
        />

        <AddAppointmentComment fetchLeadFollowupData={fetchLeadFollowupData} followUpId={followUpId} />

    </>
    )
}

export default Appointment