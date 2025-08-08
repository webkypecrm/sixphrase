import React, { useState } from 'react'
import { Tag } from 'antd';
import { Link } from 'react-router-dom';
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import CreateCall from '../VendorDetails/CreateCall';
import RescheduleCall from '../VendorDetails/RescheduleCall';
import AddCallComment from '../VendorDetails/AddCallComment';


const CallList = ({ data, index, fetchLeadFollowupData, setFollowUp }) => {
    // console.log('index =>', index)
  

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

    // console.log('data In CallList=>', data)

    return (<>
        <div className="calls-box" key={data.id}>
            <div className="caller-info">
                <div className="calls-user">
                    <img
                        src={data?.staff?.profilePicUrl}
                        alt="img"
                    />
                    <div style={{ display: 'grid' }}>
                        {index > 0 ?
                            <p>
                                <del style={{ color: 'red' }}><span>{data?.staff?.name}</span> <strong> {data?.status.toLowerCase()} </strong>
                                    a call on {getDate(data.callBackDate)}, {formatTimeToAmPm(data.callBackTime)} </del>
                            </p>
                            :
                            <p style={{ color: 'green' }}>
                                <span>{data?.staff?.name}</span> <strong> {data?.status.toLowerCase()} </strong>
                                a call on {getDate(data.callBackDate)}, {formatTimeToAmPm(data.callBackTime)}
                            </p>
                        }
                        <span className="badge-day" style={{ fontSize: 'x-small', margin: '0', maxWidth: '8rem' }}>{getDate(data?.createdAt)},{formatTimeToAmPm(data?.createdAt)}</span>
                    </div>
                </div>
                {index === 0 &&
                    <div className="calls-action">
                        <div className="dropdown call-drop">
                            {data?.status == 'Done' ?
                                <Link
                                    to="#"
                                    // className="dropdown-toggle bg-success"
                                    aria-expanded="false"
                                >
                                    {/* <i className="ti ti-square-check" /> */}
                                    <img
                                        src="/assets/img/call-done.jpg"
                                        alt="img"
                                        style={{ width: '50px', height: '50px' }}
                                    />

                                </Link>
                                :
                                // <OverlayTrigger
                                //     placement="bottom"
                                //     overlay={<Tooltip id="mark-done-tooltip ">
                                //         Mark Done
                                //     </Tooltip>}
                                // >
                                <Link
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#create_call_comment"
                                    className="dropdown-toggle bg-pending"
                                    aria-expanded="false"
                                    onClick={() => {
                                        setFollowUp(data?.id)
                                    }}
                                >
                                    <i className="ti ti-square-check" />
                                    {/* Mark Done */}
                                </Link>
                                // </OverlayTrigger>

                            }
                        </div>
                        {data.status !== 'Done' &&
                            <div className="dropdown call-drop">
                                {
                                    // <OverlayTrigger
                                    //     placement="bottom"
                                    //     overlay={<Tooltip id="rescheduled-call-tooltip">Re-scheduled call</Tooltip>}
                                    // >
                                    <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#create_call_rescheduled"
                                        className="dropdown-toggle"
                                        aria-expanded="false"
                                        onClick={() => {
                                            setFollowUp(data?.id)
                                        }}
                                    >
                                        <i className="ti ti-calendar-month" />
                                        {/* Re-scheduled */}
                                    </Link>
                                    // </OverlayTrigger>

                                }
                            </div>
                        }

                    </div>
                }

            </div>
            <p>
                {data.lastCallSummary} <br />
            </p>
            {data?.comment &&
                <div className="reply-box"
                    style={{
                        backgroundColor: '#F9F9FC',
                        borderRadius: "5px",
                        margin: "0 0 15px",
                        padding: "15px"
                    }}>
                    <p>
                        {data?.comment}
                    </p>
                </div>
            }
        </div>

       
        
    </>)
}

export default CallList