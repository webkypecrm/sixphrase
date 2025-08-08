import React from 'react'
import { Link } from 'react-router-dom';

const MeetingList = ({ data, index, setFollowUp }) => {

    // console.log('data in meetingList =>', data)

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

    return (<>
        <div className="notes-activity" >
            {data.length == 0 && <Empty description={false} />}
            <div className="calls-box" key={data?.id}>
                <div className="caller-info">
                    <div className="calls-user">
                        <img
                            src={data?.staff?.profilePicUrl}
                            alt="img"
                        />
                        <div style={{ display: 'grid' }}>
                            {index > 0 ?
                                <del style={{ color: 'red' }}><p>
                                    <span>{data?.staff?.name}</span> <strong>{data?.status.toLowerCase()}</strong> a meeting on {getDate(data.meetingDate)}, {getTime(data.meetingTime)}
                                </p>
                                </del>
                                :
                                <p style={{ color: 'green' }}>
                                    <span>{data?.staff?.name}</span> <strong>{data?.status.toLowerCase()}</strong> a meeting on {getDate(data.meetingDate)}, {getTime(data.meetingTime)}
                                </p>}
                            <span className="badge-day" style={{ fontSize: 'x-small', margin: '0', maxWidth: '8rem' }}>{getDate(data?.createdAt)},{getTime(data?.createdAt)}</span>
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
                                            src="/assets/img/meeting-done.jpg"
                                            alt="img"
                                            style={{ width: '38px', height: '40px' }}
                                        />

                                    </Link>
                                    :
                                    // <OverlayTrigger
                                    //     placement="bottom"
                                    //     overlay={<Tooltip id="mark-meeting-tooltip">Mark Done</Tooltip>}
                                    // >
                                    <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#create_meeting_comment"
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
                            {data?.status !== 'Done' &&
                                <div className="dropdown call-drop">
                                    {

                                        // <OverlayTrigger
                                        //     placement="bottom"
                                        //     overlay={<Tooltip id="rescheduled-meeting-tooltip">Re-scheduled Meeting</Tooltip>}
                                        // >
                                        <Link
                                            to="#"
                                            data-bs-toggle="modal"
                                            data-bs-target="#create_meeting_rescheduled"
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
                    {data?.lastCallSummary}
                </p>
                <div className="upcoming-info">
                    <div className="row">
                        <div className="col-sm-4">
                            <p>Meeting Type</p>
                            <div className="dropdown">
                                <Link
                                    to="#"
                                    className="dropdown-toggle"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="ti ti-clock-edit me-1" />
                                    {data?.meetingType.toUpperCase()}
                                    <i className="ti ti-chevron-down ms-1" />
                                </Link>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <Link className="dropdown-item" to="#">
                                        offline
                                    </Link>
                                    <Link className="dropdown-item" to="#">
                                        online
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <p>{data?.meetingType === 'offline' ? 'Address' : 'URL'}</p>

                            <div className="dropdown">
                                <Link
                                    to={data?.meetingType === 'offline' ? '#' : data?.meetingVenue}
                                    className="dropdown-toggle"
                                    aria-expanded="false"
                                >
                                    <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                    {data?.meetingVenue}
                                </Link>
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

        </div>


    </>)
}

export default MeetingList