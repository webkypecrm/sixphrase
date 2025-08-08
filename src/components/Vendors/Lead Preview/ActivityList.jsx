import React from 'react'
import { Link } from 'react-router-dom'

import CallList from './CallList'
import MeetingList from './MeetingList'
import CommentList from './CommentList'
import StageList from './StageList'
import AssignList from './AssignList'
import FileList from './FileList'
import AppointmentList from './AppointmentList'
// import AppointmentList from './AppointmentList'

const ActivityList = ({ data, index }) => {

    let callIndex;
    if (data.type === 'callUpdate' && index === 0) {
        callIndex = 0
    }


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
        // Get time (hours and minutes)
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        return formattedTime
    }

   

    return (
        // className="timeline-inverted"
        <li style={{ listStyle: 'none' }}>

            <div className="timeline-panel">

                {data.type === 'callUpdate' &&
                    <CallList
                        key={data.id}
                        data={data}
                    />
                }
                {data.type === 'meetingUpdate' &&
                    <MeetingList
                        key={data.id}
                        data={data}
                    />
                }
                {data.type === 'leadComment' &&
                    <CommentList
                        key={data.id}
                        data={data}
                    />
                }
                {data.type === 'stageUpdate' &&
                    <StageList
                        key={data.id}
                        data={data}
                    />
                }
                {data.type === 'assignUpdate' &&
                    <AssignList
                        key={data.id}
                        data={data}
                    />
                }
                {data.type === 'fileUpdate' &&
                    <FileList
                        key={data.id}
                        file={data}
                    />
                }
                {
                    data.type == 'newLead' &&
                    <ul>
                        <li className="activity-wrap">

                            <div className="activity-info">
                                <h6>
                                    <span className="avatar-xs">
                                        <img
                                            src={data?.attachment}
                                            alt="img"
                                            style={{ width: '23px', height: '23px' }}
                                        />
                                    </span>
                                    {data?.contactType} added New Lead

                                </h6>
                                <div className="badge-day" style={{
                                    fontSize: "x-small",
                                    margin: "",
                                    maxWidth: "9rem"
                                }}>
                                    <i className="ti ti-calendar-check" />
                                    {getDate(data.createdAt)}, {getTime(data.createdAt)}
                                </div>
                            </div>
                        </li>
                    </ul>
                }
                {
                    data.type == 'proposalUpdate' &&
                    <>
                        <div className="files-activity" style={{ width: "100%" }}>
                            <div className="activity-info">
                                <div className="notes-activity">
                                    <div className="calls-box">
                                        <div className="caller-info">
                                            <div className="calls-user">
                                                <img
                                                    src={data?.staff?.profilePicUrl}
                                                    alt="img"
                                                />
                                                <div>
                                                    <h6>{data?.staff?.name} uploaded a proposal update</h6>
                                                    <p>{getDate(data?.createdAt)}, {getTime(data?.createdAt)}</p>
                                                </div>
                                            </div>

                                        </div>
                                        <h5>{data?.proposal?.title}</h5>
                                        <p>
                                            {data?.proposal?.comment}
                                        </p>
                                        <ul>
                                            <li>
                                                <div className="note-download">
                                                    <div className="note-info">
                                                        <span className="note-icon bg-secondary-success">
                                                            <i className="ti ti-file-spreadsheet" />
                                                        </span>
                                                        <div>
                                                            <h6>{data?.proposal?.other}</h6>
                                                        </div>
                                                    </div>
                                                    <Link to={data?.proposal?.attachment1Url}>
                                                        <i className="ti ti-arrow-down" />
                                                    </Link>
                                                </div>
                                            </li>
                                        </ul>
                                        {data?.proposal?.proposalComment.map((comment) =>
                                            <div className="reply-box" style={{ display: 'grid' }}>
                                                <p> STATUS : {comment?.status.toUpperCase()}</p>
                                                <p >
                                                    {comment?.comment}
                                                </p>
                                            </div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {
                    data.type == 'appointment' &&
                    <AppointmentList
                        lead={data}
                    />
                }
            </div>
        </li>
    )
}

export default ActivityList