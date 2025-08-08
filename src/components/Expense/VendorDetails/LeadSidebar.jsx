import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css';

const LeadSidebar = ({ data, leadFollowupData, setEditCompany, setCompanyDetails, leadForOpitons }) => {


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



    console.log('data =>', data)



    return (
        <>
            <div className="col-xl-3 theiaStickySidebar">
                <div className='stickybar'>
                    <div className="contact-sidebar">
                        {/* <h6>Lead Information</h6>
                        <ul className="other-info">
                            <li>
                                <span className="other-title">Created on</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{getDate(data?.createdAt)},{getTime(data?.createdAt)}</span>
                                </span>
                            </li>
                            <li>
                                <span className="other-title">Created By</span>
                                <span>
                                    <img
                                        src={data?.ownerImgUrl}
                                        className="avatar-xs"
                                        alt="img"
                                    />{" "}
                                    {data?.owner}
                                </span>
                            </li>
                            <li>
                                <span className="other-title">Source</span>
                                <span>{data?.source}</span>
                            </li>
                        </ul> */}
                        <div className="con-sidebar-title">
                            <h6>Contacts</h6>
                            <Link
                                to="#"
                                className="com-add"
                                data-bs-toggle="modal"
                                data-bs-target="#update_lead_new_details"
                            >
                                <i className="ti ti-circle-plus me-1" />
                                New Contact
                            </Link>
                        </div>
                        <ul className="basic-info">
                            <li>
                                <span>
                                    <i className="ti ti-mail" />
                                </span>
                                <p>{data?.leadEmail}</p>
                            </li>
                            <li>
                                <span>
                                    <i className="ti ti-phone" />
                                </span>
                                <p>{data?.leadMobile1}</p>
                            </li>
                            {data?.leadMobile2 &&
                                <li>
                                    <span>
                                        <i className="ti ti-phone" />
                                    </span>
                                    <p>{data?.leadMobile2}</p>
                                </li>
                            }
                            {data?.leadMobile3 && <li>
                                <span>
                                    <i className="ti ti-phone" />
                                </span>
                                <p>{data?.leadMobile3}</p>
                            </li>}
                            <li>
                                <span>
                                    <i className="ti ti-building" />
                                </span>
                                <p>{data?.country}{","}{data?.state?.name}{","}{data?.city?.name}</p>
                            </li>
                        </ul>

                        {/* <div className="con-sidebar-title">
                            <h6>Company</h6>
                        </div>
                        <ul className="basic-info">
                            <li>
                                <span>
                                    <i className="ti ti-tower" />
                                </span>
                                <p>{data?.company?.companyName || ''}</p>
                            </li>
                            <li>
                                <span>
                                    <i className="ti ti-mail" />
                                </span>
                                <p>{data?.company?.companyEmail || ''}</p>
                            </li>
                            <li>
                                <span>
                                    <i className="ti ti-phone" />
                                </span>
                                <p>{data?.company?.companyMobile1 || ''}</p>
                            </li>

                        </ul> */}
                        <h6>Company Info</h6>
                        <ul className="other-info">
                            <li>
                                <span className="other-title">Name</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{data?.company?.companyName || 'N/A'}</span>
                                </span>
                            </li>
                            <li>
                                <span className="other-title">PAN</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{data?.company?.panNo || 'N/A'}</span>
                                </span>
                            </li>
                            <li>
                                <span className="other-title">GST</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{data?.company?.gstNo || 'N/A'}</span>
                                </span>
                            </li>
                            <li>
                                <span className="other-title">Web</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{data?.company?.website || 'N/A'}</span>
                                </span>
                            </li>
                            <li>
                                <span className="other-title">Industry</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{data?.company?.Category?.name || 'N/A'}</span>
                                </span>
                            </li>
                            <li>
                                <span className="other-title">Address</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{data?.company?.address || 'N/A'}</span>
                                </span>
                            </li>
                            <li>
                                <span className="other-title">City</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{data?.company?.city?.name || 'N/A'}</span>
                                </span>
                            </li>
                            <li>
                                <span className="other-title">State</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{data?.company?.state?.name || 'N/A'}</span>
                                </span>
                            </li>
                            <li>
                                <span className="other-title">Pincode</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{data?.company?.pincode || 'N/A'}</span>
                                </span>
                            </li>                          
                            <li>
                                <span className="other-title">Country</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span>{data?.company?.country?.name || 'N/A'}</span>
                                </span>
                            </li>
                           
                        </ul>
                        {/* <div className="con-sidebar-title">
                            <h6>Requirement</h6>
                        </div>
                        <ul className="tag-info">

                            {data?.leadFor.map((val, index) => {
                                const matchedOption = leadForOpitons.find(option => option.value === val);
                                return (
                                    <li key={index}>
                                        <p className="badge badge-tag badge-secondary">
                                            {matchedOption ? matchedOption.label : val}
                                        </p>
                                    </li>
                                );
                            })}

                        </ul>
                        <div className="con-sidebar-title">
                            <h6>Service</h6>
                        </div>
                        <ul className="tag-info">

                            {data?.leadFor.map((val, index) => {
                                return (
                                    <li key={index}>
                                        <p className="badge badge-tag badge-secondary">
                                            {data?.Service?.name}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul> */}
                        <div className="con-sidebar-title">
                            <h6>Remark</h6>
                        </div>
                        <ul className="basic-info" >
                            <li>
                                <p >{data?.description}</p>
                            </li>
                        </ul>

                        {leadFollowupData.length > 0 &&
                            <ul className="other-info">
                                <li>
                                    <span className="other-title">Last Modified</span>
                                    <span>{leadFollowupData[0]?.createdAtDate}, {leadFollowupData[0]?.createdAtTime}</span>
                                </li>
                                <li>
                                    <span className="other-title">Modified By</span>
                                    <span>
                                        <img
                                            src={leadFollowupData[0]?.staff?.profilePicUrl}
                                            className="avatar-xs"
                                            alt="img"
                                        />{" "}
                                        {leadFollowupData[0]?.staff?.name}
                                    </span>
                                </li>
                            </ul>
                        }

                    </div>
                </div>
            </div>



        </>
    )
}

export default LeadSidebar