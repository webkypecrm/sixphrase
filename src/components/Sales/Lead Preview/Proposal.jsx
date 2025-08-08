import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import Select from "react-select";
import { ascendingandDecending } from '../../../selectOption/selectOption';
import { Empty } from "antd";
import AddProposal from '../LeadDetails/AddProposal';
import AddProposalComment from '../LeadDetails/AddProposalComment';


const Proposal = ({ leadFollowupData, fetchLeadFollowupData, leadDetails }) => {
    const proposalData = leadFollowupData.filter((item) => item.type == 'proposalUpdate')
    const [followUpId, setFollowUp] = useState('');

    const leadDetail = proposalData[0]

    // console.log("proposalData =>", proposalData);
    // console.log("leadFollowupData =>", leadFollowupData);
    // console.log("leadDetails =>", leadDetails);

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

    return (
        <>
            <div className="tab-pane fade" id="proposal">
                <div className="view-header">
                    <h4>Proposal</h4>
                    <ul>
                        <li>
                            <div className="form-sort">
                                <i className="ti ti-sort-ascending-2" />
                                <Select
                                    className="select"
                                    options={ascendingandDecending}
                                    classNamePrefix="react-select"
                                    placeholder="Ascending"
                                />
                            </div>
                        </li>
                        <li>
                            <Link
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#create_lead_proposal"
                                className="com-add"
                            >
                                <i className="ti ti-circle-plus me-1" />
                                Add New
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="notes-activity">
                    {proposalData.length === 0 && <Empty description={false} />}
                    {proposalData.map((proposal) => <div className="calls-box" key={proposal?.id}>
                        <div className="caller-info">
                            <div className="calls-user">
                                <img
                                    src={proposal?.staff?.profilePicUrl}
                                    alt="img"
                                />
                                <div>
                                    <h6>{proposal?.staff?.name} uploaded a proposal update</h6>
                                    <p>{getDate(proposal?.createdAt)}, {getTime(proposal?.createdAt)}</p>
                                </div>
                            </div>
                            <div className="calls-action">
                                <div className="dropdown action-drop">
                                    <Link
                                        to="#"
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className="ti ti-dots-vertical" />
                                    </Link>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                            <i className="ti ti-edit text-blue" />
                                            Edit
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                            <i className="ti ti-trash text-danger" />
                                            Delete
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h5>{proposal?.proposal?.title}</h5>
                        <p>
                            {proposal?.proposal?.comment}
                        </p>
                        <ul>
                            <li>
                                <div className="note-download">
                                    <div className="note-info">
                                        <span className="note-icon bg-secondary-success">
                                            <i className="ti ti-file-spreadsheet" />
                                        </span>
                                        <div>
                                            <h6>{proposal?.proposal?.other}</h6>
                                        </div>
                                    </div>
                                    <Link to={proposal?.proposal?.attachment1Url}>
                                        <i className="ti ti-arrow-down" />
                                    </Link>
                                </div>
                            </li>

                        </ul>
                        <div className="notes-editor">
                            <div className="note-edit-wrap">
                                <div className="summernote">
                                    Write a new comment, send your team notification
                                    by typing @ followed by their name
                                </div>
                                <div className="text-end note-btns">
                                    <Link to="#" className="btn btn-light add-cancel">
                                        Cancel
                                    </Link>
                                    <Link to="#" className="btn btn-primary">
                                        Save
                                    </Link>
                                </div>
                            </div>
                            <div className="text-end">
                                <Link to="#"
                                    className="add-comment"
                                    data-bs-toggle="modal"
                                    data-bs-target="#create_proposal_comment"
                                    onClick={() => {
                                        setFollowUp(proposal?.id)
                                    }}
                                >
                                    <i className="ti ti-square-plus me-1" />
                                    Add Comment & Changes on this proposal
                                </Link>
                            </div>
                        </div>
                        {proposal?.proposal?.proposalComment.map((comment) =>
                            <div className="reply-box" style={{ display: 'grid' }}>
                                <p> Status : {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}</p>
                                <p >
                                    {comment?.comment}
                                </p>
                            </div>)}
                    </div>)}
                </div>
            </div>

            <AddProposal fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={leadDetails} />

            <AddProposalComment fetchLeadFollowupData={fetchLeadFollowupData} followUpId={followUpId} />

        </>



    )
}

export default Proposal