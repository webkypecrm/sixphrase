import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import Select from "react-select";
import {
    ascendingandDecending,
    companyName,
    languageOptions,
    optionssymbol,
    priorityList,
    salestypelist,
    socialMedia,
    status
} from "../../selectOption/selectOption";
import DatePicker from "react-datepicker";
import { Empty } from "antd";
import { TagsInput } from "react-tag-input-component";
import DefaultEditor from "react-simple-wysiwyg";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { all_routes } from "../Router/all_routes";
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import PageHeader from "../../components/Layouts/PageHeader";
import axios from "axios";
import AddCallComment from "../../components/Sales/LeadDetails/AddCallComment";
import RescheduleCall from "../../components/Sales/LeadDetails/RescheduleCall";
import RescheduleMeeting from "../../components/Sales/LeadDetails/RescheduleMeeting";
import CreateCall from "../../components/Sales/LeadDetails/CreateCall";
import AddMeetingComment from "../../components/Sales/LeadDetails/AddMeetingComment";
import CreateMeeting from "../../components/Sales/LeadDetails/CreateMeeting";
import CreateComment from "../../components/Sales/LeadDetails/CreateComment";
import ChangeStage from "../../components/Sales/ChangeStage";
import AddDocuments from "../../components/Sales/LeadDetails/AddDocuments";
import AddProposal from "../../components/Sales/LeadDetails/AddProposal";
import AddProposalComment from "../../components/Sales/LeadDetails/AddProposalComment";
import EditCompany from "../../components/Sales/EditCompany";
import AssignTo from "../../components/Sales/AssignTo";
import AddLeadPic from "../../components/Sales/LeadDetails/AddLeadPic";
import AddLeadOtherDetails from "../../components/Sales/LeadDetails/AddLeadOtherDetails";
// import AddNewContact from "../../components/Sales/LeadDetails/AddNewContact";


const CustomerDetailsPage = () => {
    const params = useParams();
    const { leadId } = params;
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const route = all_routes;
    const [activityToggle, setActivityToggle] = useState(false)
    const [activityToggleTwo, setActivityToggleTwo] = useState(false)
    const [owner, setOwner] = useState(["Collab"]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [stageHistoryOptions, setStageHistoryOptions] = useState([]);
    const [stageOptions, setStageOptions] = useState([]);
    const [data, setData] = useState(null);
    const [followUpId, setFollowUp] = useState('');
    const [editCompany, setEditCompany] = useState(false);
    const [companyDetails, setCompanyDetails] = useState(null);

    // const [fileUrl, setFileUrl] = useState([]);
    // const [videoUrl, setVideoUrl] = useState([]);
    // const [imageUrl, setImageUrl] = useState([]);

    console.log('stageHistoryOptions ', stageHistoryOptions)
    console.log('stageOptions ', stageOptions)

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

    function fetchLeadData() {

    }

    const [leadFollowupData, setLeadFollowupData] = useState([]);
    const [groupActivityByDate, setGroupActivityByDate] = useState({});
    const [callData, setCallData] = useState([]);
    const [meetingData, setMeetingData] = useState([]);
    const [commentData, setCommentData] = useState([]);
    const [fileData, setFileData] = useState([]);
    const [proposalData, setProposalData] = useState([]);

    console.log('callData =>', callData)
    console.log('meetingData =>', meetingData)
    console.log('leadFollowData =>', leadFollowupData)
    console.log('stageHistoryOptions =>', stageHistoryOptions)
    console.log('commentData =>', commentData)
    console.log('fileData =>', fileData)
    console.log('proposalData =>', proposalData)

    function handleRefresh() {
        fetchLeadFollowupData();
        fetchLeadDetails();
        fetchStageHistoryData();
    }

    const fetchLeadFollowupData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/lead/lead-followup/${data.leadId}`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            // console.log('data =>', response.data.data)
            setLeadFollowupData((prev) => [...response.data.data]);
            const groupedData = response.data.data.reduce((acc, item) => {
                // const date = item.createdAt.split("T")[0]; 
                const date = getDate(item.createdAt);
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(item);
                return acc;
            }, {});
            setGroupActivityByDate((prev) => ({ ...groupedData }))
            const callUpdates = response.data.data.filter((item) => item.type == 'callUpdate')
            setCallData((prev) => [...callUpdates]);

            const meetingUpdate = response.data.data.filter((item) => item.type == 'meetingUpdate')
            setMeetingData((prev) => [...meetingUpdate])

            const commentUpdate = response.data.data.filter((item) => item.type == 'leadComment')
            setCommentData((prev) => [...commentUpdate])

            const fileUpdate = response.data.data.filter((item) => item.type == 'fileUpdate')
            setFileData((prev) => [...fileUpdate])

            const proposalUpdate = response.data.data.filter((item) => item.type == 'proposalUpdate')
            setProposalData((prev) => [...proposalUpdate])
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    const fetchLeadDetails = async () => {
        try {
            const response = await axios.get(`${apiUrl}/lead/lead-details/${leadId}`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }
            );
            setData((prev) => ({
                ...response.data.data,
                tags: JSON.parse(response.data.data.tags)
            }));
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const fetchStageHistoryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/lead/lead-status-history?leadId=${data.leadId}`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }
            );
            const formattedData = response.data.data
            setStageHistoryOptions(() => [...formattedData]);
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    const fetchStageData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/stage-list`);
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setStageOptions(() => [...formattedData]);
        } catch (error) {
            toast.error(error.message)
        }
    };

    const latestStage = stageHistoryOptions.length > 0 ? stageHistoryOptions[stageHistoryOptions.length - 1] : null;

    // console.log("latestStage =>", latestStage)

    useEffect(() => {

        if (data?.leadId) {
            fetchLeadFollowupData()
            fetchStageHistoryData()
            fetchStageData()
        }

    }, [data?.leadId])

    useEffect(() => {

        if (leadId) {
            fetchLeadDetails()
        }
    }, [leadId])

    console.log('data =>', data)

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const [selectedDate1, setSelectedDate1] = useState(new Date());
    const handleDateChange1 = (date) => {
        setSelectedDate1(date);
    };
    const [selectedDate2, setSelectedDate2] = useState(new Date());
    const handleDateChange2 = (date) => {
        setSelectedDate2(date);
    };
    const [selectedDate4, setSelectedDate4] = useState(new Date());
    const handleDateChange4 = (date) => {
        setSelectedDate4(date);
    };
    const stageColor = ['bg-pending'];
    const dealsopen = [
        { value: "choose", label: "Choose" },
        { value: "collins", label: "Collins" },
        { value: "konopelski", label: "Konopelski" },
        { value: "adams", label: "Adams" },
        { value: "schumm", label: "Schumm" },
        { value: "wisozk", label: "Wisozk" },
    ];
    const activities = [
        { value: "choose", label: "Choose" },
        { value: "phoneCalls", label: "Phone Calls" },
        { value: "socialMedia", label: "Social Media" },
        { value: "referralSites", label: "Referral Sites" },
        { value: "webAnalytics", label: "Web Analytics" },
        { value: "previousPurchases", label: "Previous Purchases" },
    ];
    const industries = [
        { value: "choose", label: "Choose" },
        { value: "Retail Industry", label: "Retail Industry" },
        { value: "Banking", label: "Banking" },
        { value: "Hotels", label: "Hotels" },
        { value: "Financial Services", label: "Financial Services" },
        { value: "Insurance", label: "Insurance" },
    ];
    const countries = [
        { value: "Choose", label: "Choose" },
        { value: "India", label: "India" },
        { value: "USA", label: "USA" },
        { value: "France", label: "France" },
        { value: "UAE", label: "UAE" },
    ];

    const getYouTubeVideoId = (url) => {
        const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };


    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-md-12">
                            {/* Page Header */}
                            <PageHeader title="Customer Overview" />
                            {/* /Page Header */}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            {/* Contact User */}
                            <div className="contact-head">
                                <div className="row align-items-center">
                                    <div className="col-sm-6">
                                        <ul className="contact-breadcrumb">
                                            <li>
                                                <Link to={route.leads}>
                                                    <i className="ti ti-arrow-narrow-left" />
                                                    Customer
                                                </Link>
                                            </li>
                                            <li>{data?.leadName}</li>
                                        </ul>
                                    </div>
                                    <div className="col-sm-6 text-sm-end">
                                        <div className="contact-pagination">
                                            <p>1 of 40</p>
                                            <ul>
                                                <li>
                                                    <Link to={route.companyDetails}>
                                                        <i className="ti ti-chevron-left" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={route.companyDetails}>
                                                        <i className="ti ti-chevron-right" />
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="contact-wrap">
                                <div className="contact-profile">
                                    <div
                                        className="avatar company-avatar"
                                        data-bs-toggle="modal"
                                        data-bs-target="#add-lead-image"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {data?.leadPicUrl ?
                                            <img src={data?.leadPicUrl} alt="lead image" />
                                            :
                                            <span className="text-icon">
                                                {data?.leadName[0]}{data?.leadName[data?.leadName?.length - 1]}
                                            </span>
                                        }
                                    </div>
                                    <div className="name-user">
                                        <h5>{data?.leadName.toUpperCase()} {"("}Id: {data?.leadId}{")"}</h5>
                                        <p style={{ marginBottom: "0px" }}>
                                            <i className="ti ti ti-mail-check me-1"/>
                                            {data?.leadEmail}
                                        </p>
                                        <p style={{ marginBottom: "0px" }}>
                                            <i className="ti ti-phone me-1" />
                                            {data?.leadMobile1}
                                        </p>
                                        <p style={{ marginBottom: "0px" }}>
                                            <i className="ti ti-map-pin-pin me-1" />
                                            {data?.country}, {data?.state?.name}, {data?.city?.name}
                                        </p>
                                        {/* <div className="badge-rate">
                                            <p>
                                                <i className="fa-solid fa-star" /> 5.0
                                            </p>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="contacts-action">
                                    <Link to="#" className="btn-icon rating">
                                        <i className="fa-solid fa-star" />
                                    </Link>
                                    <OverlayTrigger
                                        placement="bottom"
                                        overlay={<Tooltip id="assign-to-tooltip">Assign To</Tooltip>}
                                    >
                                        <Link
                                            to="#"
                                            className="btn btn add-popup"
                                            style={{ border: '1px solid black' }}
                                        >
                                            <div
                                                className="table-avatar d-flex align-items-center"
                                                data-bs-toggle="modal"
                                                data-bs-target="#assigned_to"
                                                style={{ courser: 'pointer' }}
                                            >
                                                <div className="users-group">
                                                    <ul>
                                                        <li>
                                                            <Link to="#">
                                                                {data?.staff?.profilePic ?
                                                                    <span className="menu-list-icon ">
                                                                        <img src={data?.staff?.profilePic} />
                                                                    </span>
                                                                    :
                                                                    <span className="menu-list-icon ">
                                                                        <i className="ion-person" />
                                                                    </span>
                                                                }
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            {data?.assignedTo.split(' '[0])}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Link>
                                    </OverlayTrigger>

                                    {/* <div className="badge badge-tag badge-success-light">
                                            assign to
                                        </div> */}

                                    <Link
                                        to="#"
                                        className="btn btn-danger add-popup"
                                        onClick={() =>
                                            setActivityToggle(!activityToggle)
                                        }
                                    >
                                        <i className="ti ti-circle-plus" />
                                        Create Proposal
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#add_compose"
                                    >
                                        <i className="ti ti-mail" />
                                        Send Email
                                    </Link>
                                    <Link to={route.chat} className="btn-icon">
                                        <i className="ti ti-brand-hipchat" />
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn-icon edit-popup"
                                        onClick={() =>
                                            setActivityToggle(!activityToggle)
                                        }
                                    >
                                        <i className="ti ti-edit-circle" />
                                    </Link>
                                    <div className="act-dropdown">
                                        <Link
                                            to="#"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="ti ti-dots-vertical" />
                                        </Link>
                                        <div className="dropdown-menu dropdown-menu-right">
                                            <Link
                                                className="dropdown-item"
                                                to="#"
                                                data-bs-toggle="modal"
                                                data-bs-target="#delete_contact"
                                            >
                                                <i className="ti ti-trash text-danger" />
                                                Delete
                                            </Link>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            {/* /Contact User */}
                        </div>
                        <div className="col-md-12">
                            <div className="contact-wrap">
                                <div className="pipeline-list">
                                    <ul>
                                        {stageOptions.map((stage) => (
                                            <li key={stage?.value} data-bs-toggle="modal" data-bs-target="#stage_update" style={{ cursor: 'pointer' }}>
                                                <Link
                                                    to="#"
                                                    className={
                                                        latestStage && latestStage?.stageId === stage?.value
                                                            ? `bg-pending`
                                                            : ''
                                                    }
                                                >
                                                    {stage?.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-md-12">
                            <div className="contact-wrap">
                                <div className="pipeline-list">
                                    <ul>
                                        {stageHistoryOptions.map((stage, index) => <li key={stage.id}
                                            data-bs-toggle="modal"
                                            data-bs-target="#stage_update"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Link to="#" className={(stageHistoryOptions.length - 1) == index ? `bg-pending` : ``}>
                                                {stage?.stage?.name ? stage?.stage.name : 'New Lead'}
                                            </Link>
                                        </li>)}

                                    </ul>
                                </div>
                            </div>
                        </div> */}
                        {/* Deals Sidebar */}
                        <div className="col-xl-3 theiaStickySidebar">
                            <div className='stickybar'>
                                <div className="contact-sidebar">
                                    <h6>Lead Information</h6>
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
                                            <span className="other-title">Last Modified</span>
                                            <span>{getDate(leadFollowupData[0]?.createdAt)}, {getTime(leadFollowupData[0]?.createdAt)}</span>
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
                                        <li>
                                            <span className="other-title">Value</span>
                                            <span>₹ {data?.value}</span>
                                        </li>
                                        <li>
                                            <span className="other-title">Source</span>
                                            <span>{data?.source}</span>
                                        </li>
                                    </ul>
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


                                    </ul>
                                    <div className="con-sidebar-title">
                                        <h6>Tags</h6>
                                        <Link
                                            to="#"
                                            className="com-add"
                                            data-bs-toggle="modal"
                                            data-bs-target="#update_lead_new_details"
                                        >
                                            <i className="ti ti-circle-plus me-1" />
                                            New Tags
                                        </Link>
                                    </div>

                                    <ul className="tag-info">
                                        {data?.tags.map((tag, index) => <li key={index}>
                                            <Link
                                                to="#"
                                                className="badge badge-tag badge-success-light"
                                            >
                                                {tag}
                                            </Link>

                                        </li>)}
                                    </ul>
                                    {data?.company?.companyId &&
                                        <>
                                            <div className="con-sidebar-title">
                                                <h6>Company</h6>
                                                <Link to="#" className="com-add add-popups"
                                                    onClick={() => {
                                                        setEditCompany(true),
                                                            setCompanyDetails((prev) => ({ ...data?.company }))
                                                    }}

                                                >
                                                    <i className="ti ti-circle-plus me-1" />
                                                    Edit Company
                                                </Link>
                                            </div>
                                            <ul className="company-info com-info">
                                                <li style={{ gap: '10px', alignItems: 'start' }}>
                                                    <div>

                                                        <ul className="basic-info">
                                                            <li style={{ display: 'flex', alignItems: 'center' }}>
                                                                {data?.companyImg ?
                                                                    <img src={data.companyImg}
                                                                        style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px' }} /> :
                                                                    <span className="menu-list-icon ">
                                                                        <i className="ti ti-building-community" />
                                                                    </span>
                                                                }
                                                                <h6 >{data?.companyName.toUpperCase()}</h6>

                                                            </li>

                                                            <li>
                                                                <span>
                                                                    <i className="ti ti-mail" />
                                                                </span>
                                                                <p>{data?.company?.companyEmail}</p>
                                                            </li>
                                                            <li>
                                                                <span>
                                                                    <i className="ti ti-phone" />
                                                                </span>
                                                                <p>{data?.company?.companyMobile1}</p>
                                                            </li>
                                                            <li>
                                                                <span>
                                                                    <i className="ti ti-file" />
                                                                </span>
                                                                <p>{data?.company?.gstNo}</p>
                                                            </li>
                                                            <li>
                                                                <span>
                                                                    <i className="ti ti-credit-card" />
                                                                </span>
                                                                <p>{data?.company?.panNo}</p>
                                                            </li>
                                                            <li>
                                                                <span>
                                                                    <i className="ti ti-link" />
                                                                </span>
                                                                <a href={data?.company?.website} target="_blank" rel="noopener noreferrer">
                                                                    Website
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <span>
                                                                    <i className="ti ti-arrow-right" />
                                                                </span>
                                                                <p> {data?.company?.industry?.name}</p>
                                                            </li>

                                                        </ul>

                                                    </div>
                                                </li>
                                            </ul>
                                            <h6>Social Profile</h6>
                                            <ul className="social-info">
                                                <li>
                                                    <Link to={data?.company?.skype}>
                                                        <i className="fa-brands fa-skype" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={data?.company?.facebook}>
                                                        <i className="fa-brands fa-facebook-f" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={data?.company?.instagram}>
                                                        <i className="fa-brands fa-instagram" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={data?.company?.whatsapp}>
                                                        <i className="fa-brands fa-whatsapp" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={data?.company?.twitter}>
                                                        <i className="fa-brands fa-twitter" />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={data?.company?.linkedin}>
                                                        <i className="fa-brands fa-linkedin" />
                                                    </Link>
                                                </li>
                                            </ul>

                                        </>}
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
                        {/* /Deals Sidebar */}
                        {/* Contact Details */}
                        <div className="col-xl-9">
                            <div className="contact-tab-wrap">
                                <ul className="contact-nav nav">
                                    <li>
                                        <Link
                                            to="#"
                                            data-bs-toggle="tab"
                                            data-bs-target="#activities"
                                            className="active"
                                        >
                                            <i className="ti ti-alarm-minus" />
                                            Activities
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" data-bs-toggle="tab" data-bs-target="#calls">
                                            <i className="ti ti-phone" />
                                            Calls
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" data-bs-toggle="tab" data-bs-target="#lead-meeting">
                                            <i className="ti ti-notes" />
                                            Meeting
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" data-bs-toggle="tab" data-bs-target="#lead-comment">
                                            <i className="ti ti-files" />
                                            Comment
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" data-bs-toggle="tab" data-bs-target="#lead-proposal">
                                            <i className="ti ti-files" />
                                            Proposal
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <Link to="#" data-bs-toggle="tab" data-bs-target="#lead-details-task">
                                            <i className="ti ti-files" />
                                            Task
                                        </Link>
                                    </li> */}
                                    <li>
                                        <Link to="#" data-bs-toggle="tab" data-bs-target="#files">
                                            <i className="ti ti-file" />
                                            Files
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" data-bs-toggle="tab" data-bs-target="#email">
                                            <i className="ti ti-mail-check" />
                                            Email
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Tab Content */}
                            <div className="contact-tab-view">
                                <div className="tab-content pt-0">

                                    {/* <LeadPreview /> */}

                                    {/* Activities */}
                                    <div className="tab-pane active show" id="activities">
                                        <div className="view-header">
                                            <h4>Activities</h4>
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
                                            </ul>
                                        </div>
                                        <div className="contact-activity">

                                            {leadFollowupData.length == 0 &&
                                                <Empty description={false} />

                                            }
                                            {Object.keys(groupActivityByDate).map((date) =>
                                                <div key={date}>
                                                    <div className="badge-day" >
                                                        <i className="ti ti-calendar-check" />
                                                        {date}
                                                    </div>
                                                    <ul>
                                                        {groupActivityByDate[`${date}`].map((lead) => <li className={lead.type == 'fileUpdate' || lead.type == 'meetingUpdate' || lead.type == 'callUpdate' ? "" : "activity-wrap"} key={lead.id} style={{ marginBottom: '1rem' }}>
                                                            {lead.type == 'callUpdate' && <>
                                                                <div className="calls-activity" >
                                                                    <div className="calls-box" >
                                                                        <div className="caller-info">
                                                                            <div className="calls-user">
                                                                                <img
                                                                                    src={lead?.staff?.profilePicUrl}
                                                                                    alt="img"
                                                                                />
                                                                                <div style={{ display: 'grid' }}>
                                                                                    {callData[0]?.id !== lead?.id && lead?.status !== 'Done' ?
                                                                                        <p>
                                                                                            <del style={{ color: 'red' }}><span>{lead?.staff?.name}</span> <strong> {lead?.status.toLowerCase()} </strong>
                                                                                                a call on {getDate(lead.callBackDate)}, {getTime(lead.callBackTime)} </del>
                                                                                        </p>
                                                                                        :
                                                                                        <p style={{ color: 'green' }}>
                                                                                            <span>{lead?.staff?.name}</span> <strong> {lead?.status.toLowerCase()} </strong>
                                                                                            a call on {getDate(lead.callBackDate)}, {getTime(lead.callBackTime)}
                                                                                        </p>
                                                                                    }
                                                                                    <span className="badge-day" style={{ fontSize: 'x-small', margin: '0', maxWidth: '8rem' }}>{getDate(lead?.createdAt)},{getTime(lead?.createdAt)}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="calls-action">
                                                                                <div className="dropdown call-drop">
                                                                                    {lead?.status == 'Done' ?
                                                                                        <Link
                                                                                            to="#"
                                                                                            aria-expanded="false"
                                                                                        >
                                                                                            <img
                                                                                                src="/assets/img/call-done.jpg"
                                                                                                alt="img"
                                                                                                style={{ width: '50px', height: '50px' }}
                                                                                            />

                                                                                        </Link>
                                                                                        :
                                                                                        ''
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <p>
                                                                            {lead.lastCallSummary} <br />
                                                                        </p>
                                                                        {lead?.comment &&
                                                                            <div className="reply-box"
                                                                                style={{
                                                                                    backgroundColor: '#F9F9FC',
                                                                                    borderRadius: "5px",
                                                                                    margin: "0 0 15px",
                                                                                    padding: "15px"
                                                                                }}>
                                                                                <p>
                                                                                    {lead?.comment}
                                                                                </p>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </>
                                                            }
                                                            {
                                                                lead.type == 'leadComment' &&
                                                                <>
                                                                    <span className="activity-icon bg-pending">
                                                                        <i className="ti ti-mail-code" />
                                                                    </span>
                                                                    <div className="activity-info">
                                                                        <h6>  Comment was posted by
                                                                            <span className="avatar-xs">
                                                                                <img
                                                                                    src={lead?.staff?.profilePicUrl}
                                                                                    alt="img"
                                                                                />
                                                                            </span>{" "}
                                                                            {lead?.staff?.name.split(' ')[0]}
                                                                        </h6>
                                                                        <p>{lead?.comment}</p>
                                                                        <p>{lead?.createdAtTime}</p>
                                                                    </div>
                                                                </>
                                                            }
                                                            {
                                                                lead.type == 'meetingUpdate' &&
                                                                <>
                                                                    <div className="notes-activity" >
                                                                        <div className="calls-box" >
                                                                            <div className="caller-info">
                                                                                <div className="calls-user">
                                                                                    <img
                                                                                        src={lead?.staff?.profilePicUrl}
                                                                                        alt="img"
                                                                                    />
                                                                                    <div style={{ display: 'grid' }}>
                                                                                        {meetingData[0]?.id !== lead?.id && lead?.status !== 'Done' ?
                                                                                            <del style={{ color: 'red' }}><p>
                                                                                                <span>{lead?.staff?.name}</span> <strong>{lead?.status.toLowerCase()}</strong> a meeting on {getDate(lead.meetingDate)}, {getTime(lead.meetingTime)}
                                                                                            </p>
                                                                                            </del>
                                                                                            :
                                                                                            <p style={{ color: 'green' }}>
                                                                                                <span>{lead?.staff?.name}</span> <strong>{lead?.status.toLowerCase()}</strong> a meeting on {getDate(lead.meetingDate)}, {getTime(lead.meetingTime)}
                                                                                            </p>
                                                                                        }
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
                                                                                        <p>Meeting Type</p>
                                                                                        <div className="dropdown">
                                                                                            <Link
                                                                                                to="#"
                                                                                                className="dropdown-toggle"
                                                                                                data-bs-toggle="dropdown"
                                                                                                aria-expanded="false"
                                                                                            >
                                                                                                <i className="ti ti-clock-edit me-1" />
                                                                                                {lead?.meetingType.toUpperCase()}
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
                                                                                        <p>{lead?.meetingType === 'offline' ? 'Address' : 'URL'}</p>

                                                                                        <div className="dropdown">
                                                                                            <Link
                                                                                                to={lead?.meetingType === 'offline' ? '#' : lead?.meetingVenue}
                                                                                                className="dropdown-toggle"
                                                                                                aria-expanded="false"
                                                                                            >
                                                                                                <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                                                                                {lead?.meetingVenue}
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
                                                                </>
                                                            }
                                                            {
                                                                lead.type == 'stageUpdate' &&
                                                                <>
                                                                    <span className="activity-icon bg-pink">
                                                                        <i className="ti ti-analyze" />
                                                                    </span>
                                                                    <div className="activity-info">
                                                                        <h6>
                                                                            Lead stage updated to {lead?.contactType.toLowerCase()}
                                                                        </h6>
                                                                        <p>{lead?.createdAtTime}</p>
                                                                    </div>
                                                                </>
                                                            }
                                                            {
                                                                lead.type == 'assignUpdate' &&
                                                                <>
                                                                    <span className="activity-icon bg-tertiary">
                                                                        <i className="ti ti-timeline-event-exclamation" />
                                                                    </span>
                                                                    <div className="activity-info">
                                                                        <h6>
                                                                            Lead has been successfully assigned to
                                                                            <span className="avatar-xs">
                                                                                <img
                                                                                    src={lead?.attachment}
                                                                                    alt="img"
                                                                                />
                                                                            </span>
                                                                            {lead?.contactType}
                                                                        </h6>
                                                                        <p>{lead?.createdAtTime}</p>
                                                                        {
                                                                            lead?.comment &&
                                                                            <div className="reply-box">
                                                                                <p>
                                                                                    {lead?.comment}
                                                                                </p>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </>
                                                            }
                                                            {
                                                                lead.type == 'fileUpdate' &&
                                                                <>
                                                                    <div className="files-activity" style={{ width: "100%" }}>
                                                                        <div className="files-wrap"  >
                                                                            <div className="row align-items-center">
                                                                                <div className="col-md-8">
                                                                                    <div className="file-info">
                                                                                        <div className="file-user" >
                                                                                            <div style={{ display: 'flex' }}>
                                                                                                <img
                                                                                                    src={lead?.staff?.profilePicUrl}
                                                                                                    alt="img"
                                                                                                />
                                                                                            </div>
                                                                                            <div style={{ display: 'grid' }}>
                                                                                                <p>{lead?.staff?.name} uploaded file</p>
                                                                                                <p style={{ fontSize: 'x-small', margin: '0', maxWidth: '8rem' }}>
                                                                                                    {getDate(lead?.leadDocument?.createdAt)},{getTime(lead?.leadDocument?.createdAt)}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <h4>{lead?.leadDocument?.fileName}</h4>
                                                                                        <p>
                                                                                            {lead?.leadDocument?.comment}
                                                                                        </p>

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4 text-md-end">
                                                                                    <ul className="file-action">

                                                                                        <li>
                                                                                            <Link className="badge badge-tag badge-danger-light" to={lead?.leadDocument?.attachmentUrl}>
                                                                                                <span>{lead?.leadDocument?.fileType}</span>
                                                                                                <Link className="badge badge-tag badge-danger-light" to={lead?.leadDocument?.attachmentUrl}>
                                                                                                    {/* <span>{lead?.leadDocument?.fileType}</span> */}

                                                                                                    {lead?.leadDocument?.fileType == 'image' &&
                                                                                                        <div className="note-download">
                                                                                                            <div className="note-info">
                                                                                                                <span className="note-icon">
                                                                                                                    <img src={lead?.leadDocument?.attachmentUrl} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                                                                                                                </span>
                                                                                                            </div>

                                                                                                        </div>
                                                                                                    }
                                                                                                    {lead?.leadDocument?.fileType == 'jpg' &&
                                                                                                        <div className="note-download">
                                                                                                            <div className="note-info">
                                                                                                                <span className="note-icon">
                                                                                                                    <img src={lead?.leadDocument?.attachmentUrl} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    }
                                                                                                    {lead?.leadDocument?.fileType == 'png' &&
                                                                                                        <div className="note-download">
                                                                                                            <div className="note-info">
                                                                                                                <span className="note-icon">
                                                                                                                    <img src={lead?.leadDocument?.attachmentUrl} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                                                                                                                </span>
                                                                                                            </div>

                                                                                                        </div>
                                                                                                    }

                                                                                                    {lead?.leadDocument?.fileType == 'pdf' &&
                                                                                                        <div className="note-download">
                                                                                                            <div className="note-info">
                                                                                                                <span className="note-icon">
                                                                                                                    <img src="/assets/img/pdf-icon.png" alt="Preview" style={{ width: '80px', height: '80px' }} />
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    }


                                                                                                    {/* {lead?.leadDocument?.fileType === 'video' && lead?.leadDocument?.language && (
                                                                                                        <div className="note-download">
                                                                                                            <div className="note-info">
                                                                                                                <span className="note-icon">
                                                                                                                    <video width="100%" height="100px" controls>
                                                                                                                        <source src={lead?.leadDocument?.language} type="video/mp4" />
                                                                                                                        Your browser does not support the video tag.
                                                                                                                    </video>
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )} */}

                                                                                                    {lead?.leadDocument?.fileType === 'video' && lead?.leadDocument?.language && (
                                                                                                        <div className="note-download">
                                                                                                            <div className="note-info">
                                                                                                                <span className="note-icon">
                                                                                                                    {lead?.leadDocument?.language.includes("youtube.com") || lead?.leadDocument?.language.includes("youtu.be") ? (
                                                                                                                        // YouTube video
                                                                                                                        <iframe
                                                                                                                            width="100%"
                                                                                                                            height="100px"
                                                                                                                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(lead.leadDocument.language)}`}
                                                                                                                            title="YouTube video player"
                                                                                                                            frameBorder="0"
                                                                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                                                            allowFullScreen
                                                                                                                        ></iframe>
                                                                                                                    ) : (
                                                                                                                        // Non-YouTube video
                                                                                                                        <video width="100%" height="100px" controls>
                                                                                                                            <source src={lead.leadDocument.language} type="video/mp4" />
                                                                                                                            Your browser does not support the video tag.
                                                                                                                        </video>
                                                                                                                    )}
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}

                                                                                                    {lead?.leadDocument?.fileType === 'zip' && (
                                                                                                        <div className="note-download">
                                                                                                            <div className="note-info">
                                                                                                                <span className="note-icon">
                                                                                                                    <img src="/assets/img/zip-icon.png" alt="Preview" style={{ width: '80px', height: '80px' }} />
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}

                                                                                                    {lead?.leadDocument?.fileType === 'csv' && (
                                                                                                        <div className="note-download">
                                                                                                            <div className="note-info">
                                                                                                                <span className="note-icon">
                                                                                                                    <img src="/assets/img/excel-icon.png" alt="Preview" style={{ width: '80px', height: '80px' }} />
                                                                                                                </span>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )}

                                                                                                </Link>
                                                                                                <i className="ti ti-arrow-down" />
                                                                                            </Link>
                                                                                        </li>

                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            }
                                                            {
                                                                lead.type == 'proposalUpdate' &&
                                                                <>
                                                                    <div className="files-activity" style={{ width: "100%" }}>
                                                                        <div className="activity-info">
                                                                            <div className="notes-activity">
                                                                                <div className="calls-box">
                                                                                    <div className="caller-info">
                                                                                        <div className="calls-user">
                                                                                            <img
                                                                                                src={lead?.staff?.profilePicUrl}
                                                                                                alt="img"
                                                                                            />
                                                                                            <div>
                                                                                                <h6>{lead?.staff?.name} uploaded a proposal update</h6>
                                                                                                <p>{getDate(lead?.createdAt)}, {getTime(lead?.createdAt)}</p>
                                                                                            </div>
                                                                                        </div>

                                                                                    </div>
                                                                                    <h5>{lead?.proposal?.title}</h5>
                                                                                    <p>
                                                                                        {lead?.proposal?.comment}
                                                                                    </p>
                                                                                    <ul>
                                                                                        <li>
                                                                                            <div className="note-download">
                                                                                                <div className="note-info">
                                                                                                    <span className="note-icon bg-secondary-success">
                                                                                                        <i className="ti ti-file-spreadsheet" />
                                                                                                    </span>
                                                                                                    <div>
                                                                                                        <h6>{lead?.proposal?.other}</h6>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <Link to={lead?.proposal?.attachment1Url}>
                                                                                                    <i className="ti ti-arrow-down" />
                                                                                                </Link>
                                                                                            </div>
                                                                                        </li>
                                                                                    </ul>
                                                                                    {lead?.proposal?.proposalComment.map((comment) =>
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
                                                                lead.type == 'newLead' &&
                                                                <>
                                                                    {/* <span className="activity-icon bg-tertiary">
                                                                        <i className="ti ti-timeline-event-exclamation" />
                                                                    </span> */}
                                                                    <div className="activity-info">
                                                                        <h6>
                                                                            <span className="avatar-xs">
                                                                                <img
                                                                                    src={lead?.attachment}
                                                                                    alt="img"
                                                                                />
                                                                            </span>
                                                                            {lead?.contactType} added New Lead

                                                                        </h6>
                                                                        <p>{lead?.createdAtTime}</p>
                                                                    </div>
                                                                </>
                                                            }
                                                        </li>)}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* /Activities */}
                                    {/* Meeting */}
                                    <div className="tab-pane fade" id="lead-meeting">
                                        <div className="view-header">
                                            <h4>Meeting</h4>
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
                                                {(meetingData[0]?.status == 'Done' || meetingData[0]?.status == '' || meetingData.length === 0) &&
                                                    <li>
                                                        <Link
                                                            to="#"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#create_meeting"
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
                                            {meetingData.length == 0 && <Empty description={false} />}
                                            {meetingData.map((data, index) => <div className="calls-box" key={data?.id}>
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
                                                                    <OverlayTrigger
                                                                        placement="bottom"
                                                                        overlay={<Tooltip id="mark-meeting-tooltip">Mark Done</Tooltip>}
                                                                    >
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
                                                                    </OverlayTrigger>

                                                                }
                                                            </div>
                                                            {data?.status !== 'Done' &&
                                                                <div className="dropdown call-drop">
                                                                    {

                                                                        <OverlayTrigger
                                                                            placement="bottom"
                                                                            overlay={<Tooltip id="rescheduled-meeting-tooltip">Re-scheduled Meeting</Tooltip>}
                                                                        >
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
                                                {/* <div style={{ marginTop: '1rem' }}>
                                                    <AddMeetingComment followUpId={data.id} fetchLeadFollowupData={fetchLeadFollowupData} />
                                                </div> */}
                                            </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* /Meeting */}
                                    {/* Calls */}
                                    <div className="tab-pane fade" id="calls">
                                        <div className="view-header">
                                            <h4>Calls</h4>
                                            {(callData[0]?.status == 'Done' || callData[0]?.status == '' || callData.length === 0) &&
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
                                        <div className="calls-activity" >
                                            {callData.length == 0 && <Empty description={false} />}
                                            {callData.map((data, index) => <div className="calls-box" key={data.id}>
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
                                                                        a call on {getDate(data.callBackDate)}, {getTime(data.callBackTime)} </del>
                                                                </p>
                                                                :
                                                                <p style={{ color: 'green' }}>
                                                                    <span>{data?.staff?.name}</span> <strong> {data?.status.toLowerCase()} </strong>
                                                                    a call on {getDate(data.callBackDate)}, {getTime(data.callBackTime)}
                                                                </p>
                                                            }

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
                                                                            src="/assets/img/call-done.jpg"
                                                                            alt="img"
                                                                            style={{ width: '50px', height: '50px' }}
                                                                        />

                                                                    </Link>
                                                                    :
                                                                    <OverlayTrigger
                                                                        placement="bottom"
                                                                        overlay={<Tooltip id="mark-done-tooltip ">
                                                                            Mark Done
                                                                        </Tooltip>}
                                                                    >
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
                                                                    </OverlayTrigger>

                                                                }
                                                            </div>
                                                            {data.status !== 'Done' &&
                                                                <div className="dropdown call-drop">
                                                                    {
                                                                        <OverlayTrigger
                                                                            placement="bottom"
                                                                            overlay={<Tooltip id="rescheduled-call-tooltip">Re-scheduled call</Tooltip>}
                                                                        >
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
                                                                        </OverlayTrigger>

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
                                            )}
                                        </div>
                                    </div>
                                    {/* /Calls */}
                                    {/* Comment */}
                                    <div className="tab-pane fade" id="lead-comment">
                                        <div className="view-header">
                                            <h4>Comment</h4>
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
                                                        data-bs-target="#create_comment"
                                                        className="com-add"
                                                    >
                                                        <i className="ti ti-circle-plus me-1" />
                                                        Add New
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="notes-activity">
                                            {commentData.length == 0 && <Empty description={false} />}
                                            {commentData.map((data) => <div className="calls-box" key={data.id}>
                                                <div className="caller-info">
                                                    <div className="calls-user">
                                                        <img
                                                            src={data?.staff?.profilePicUrl}
                                                            alt="img"
                                                        />
                                                        <div style={{ display: 'grid' }}>
                                                            <p>
                                                                <span>{data?.staff?.name}</span>
                                                            </p>
                                                            <span className="badge-day" style={{ fontSize: 'x-small', margin: '0', maxWidth: '8rem' }}>{getDate(data?.createdAt)},{getTime(data?.createdAt)}</span>
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
                                                <p>
                                                    {data?.comment}
                                                </p>
                                            </div>

                                            )}
                                        </div>
                                    </div>
                                    {/* /Comment */}
                                    {/* Proposal */}
                                    <div className="tab-pane fade" id="lead-proposal">
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
                                                        <p> STATUS : {comment?.status.toUpperCase()}</p>
                                                        <p >
                                                            {comment?.comment}
                                                        </p>
                                                    </div>)}


                                            </div>)}

                                            {/* <div className="calls-box">
                                                <div className="caller-info">
                                                    <div className="calls-user">
                                                        <ImageWithBasePath
                                                            src="assets/img/profiles/avatar-20.jpg"
                                                            alt="img"
                                                        />
                                                        <div>
                                                            <h6>Sharon Roy</h6>
                                                            <p>18 Sep 2023, 09:52 am</p>
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
                                                <h5>Notes added by Antony</h5>
                                                <p>
                                                    A project plan typically contains a list of the
                                                    essential elements of a project, such as stakeholders,
                                                    scope, timelines, estimated cost and communication
                                                    methods. The project manager typically lists the
                                                    information based on the assignment.
                                                </p>
                                                <ul>
                                                    <li>
                                                        <div className="note-download">
                                                            <div className="note-info">
                                                                <span className="note-icon bg-secondary-success">
                                                                    <i className="ti ti-file-text" />
                                                                </span>
                                                                <div>
                                                                    <h6>Andrewpass.txt</h6>
                                                                    <p>365 KB</p>
                                                                </div>
                                                            </div>
                                                            <Link to="#">
                                                                <i className="ti ti-arrow-down" />
                                                            </Link>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <div className="reply-box">
                                                    <p>
                                                        The best way to get a project done faster is to
                                                        start sooner. A goal without a timeline is just a
                                                        dream.The goal you set must be challenging. At the
                                                        same time, it should be realistic and attainable,
                                                        not impossible to reach.
                                                    </p>
                                                    <p>
                                                        Commented by{" "}
                                                        <span className="text-purple">Aeron</span> on 15 Sep
                                                        2023, 11:15 pm
                                                    </p>
                                                    <Link to="#" className="btn">
                                                        <i className="ti ti-arrow-back-up-double" />
                                                        Reply
                                                    </Link>
                                                </div>
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
                                                        <Link to="#" className="add-comment">
                                                            <i className="ti ti-square-plus me-1" />
                                                            Add Comment
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="calls-box">
                                                <div className="caller-info">
                                                    <div className="calls-user">
                                                        <ImageWithBasePath
                                                            src="assets/img/profiles/avatar-21.jpg"
                                                            alt="img"
                                                        />
                                                        <div>
                                                            <h6>Vaughan</h6>
                                                            <p>20 Sep 2023, 10:26 pm</p>
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
                                                <p>
                                                    Projects play a crucial role in the success of
                                                    organizations, and their importance cannot be
                                                    overstated. Whether it's launching a new product,
                                                    improving an existing
                                                </p>
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
                                                        <Link to="#" className="add-comment">
                                                            <i className="ti ti-square-plus me-1" />
                                                            Add Comment
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                    {/* /Proposal */}
                                    {/* Files */}
                                    <div className="tab-pane fade" id="files">
                                        <div className="view-header">
                                            <h4>Files</h4>
                                        </div>
                                        <div className="files-activity">
                                            <div className="files-wrap">
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="file-info">
                                                            <h4>Manage Documents</h4>
                                                            <p>
                                                                Send customizable quotes, proposals and
                                                                contracts to close deals faster.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end">
                                                        <ul className="file-action">
                                                            <li>
                                                                <Link
                                                                    to="#"
                                                                    className="btn btn-primary"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#create_lead_file"
                                                                >
                                                                    Create Document
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            {fileData.map((file) => <div className="files-wrap" key={file.id}>
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="file-info">
                                                            <div className="file-user" >
                                                                <div style={{ display: 'flex' }}>
                                                                    <img
                                                                        src={file?.staff?.profilePicUrl}
                                                                        alt="img"
                                                                    />
                                                                </div>
                                                                <div style={{ display: 'grid' }}>
                                                                    <p>{file?.staff?.name} uploaded file</p>
                                                                    <p style={{ fontSize: 'x-small', margin: '0', maxWidth: '8rem' }}>{getDate(file?.leadDocument?.createdAt)},{getTime(file?.leadDocument?.createdAt)}</p>
                                                                </div>

                                                            </div>
                                                            <h4>{file?.leadDocument?.fileName}</h4>
                                                            <p>
                                                                {file?.leadDocument?.comment}
                                                            </p>
                                                            <p>
                                                                {/* {file?.leadDocument?.createdAt} */}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end">
                                                        <ul className="file-action">
                                                            <li>
                                                                <Link className="badge badge-tag badge-danger-light" to={file?.leadDocument?.fileType === 'video' ? file?.leadDocument?.language : file?.leadDocument?.attachment1Url}>

                                                                    <span>{file?.leadDocument?.fileType}</span>
                                                                    {file?.leadDocument?.fileType == 'image' &&
                                                                        <div className="note-download">
                                                                            <div className="note-info">
                                                                                <span className="note-icon">
                                                                                    <img src={file?.leadDocument?.attachmentUrl} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                                                                                </span>
                                                                            </div>

                                                                        </div>
                                                                    }
                                                                    {file?.leadDocument?.fileType == 'jpg' &&
                                                                        <div className="note-download">
                                                                            <div className="note-info">
                                                                                <span className="note-icon">
                                                                                    <img src={file?.leadDocument?.attachmentUrl} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                    {file?.leadDocument?.fileType == 'png' &&
                                                                        <div className="note-download">
                                                                            <div className="note-info">
                                                                                <span className="note-icon">
                                                                                    <img src={file?.leadDocument?.attachmentUrl} alt="Preview" style={{ width: '300px', height: 'auto' }} />
                                                                                </span>
                                                                            </div>

                                                                        </div>
                                                                    }

                                                                    {file?.leadDocument?.fileType == 'pdf' &&
                                                                        <div className="note-download">
                                                                            <div className="note-info">
                                                                                <span className="note-icon">
                                                                                    <img src="/assets/img/pdf-icon.png" alt="Preview" style={{ width: '100px', height: '100px' }} />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    }


                                                                    {/* {file?.leadDocument?.fileType === 'video' && file?.leadDocument?.language && (
                                                                        <div className="note-download">
                                                                            <div className="note-info">
                                                                                <span className="note-icon">
                                                                                    <video width="100%" height="100px" controls>
                                                                                        <source src={file?.leadDocument?.language} type="video/mp4" />
                                                                                        Your browser does not support the video tag.
                                                                                    </video>

                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )} */}

                                                                    {file?.leadDocument?.fileType === 'video' && file?.leadDocument?.language && (
                                                                        <div className="note-download">
                                                                            <div className="note-info">
                                                                                <span className="note-icon">
                                                                                    {file.leadDocument.language.includes("youtube.com") || file.leadDocument.language.includes("youtu.be") ? (
                                                                                        // YouTube video
                                                                                        <iframe
                                                                                            width="100%"
                                                                                            height="100px"
                                                                                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(file.leadDocument.language)}`}
                                                                                            title="YouTube video player"
                                                                                            frameBorder="0"
                                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                            allowFullScreen
                                                                                        ></iframe>
                                                                                    ) : (
                                                                                        // Non-YouTube video
                                                                                        <video width="100%" height="100px" controls>
                                                                                            <source src={file.leadDocument.language} type="video/mp4" />
                                                                                            Your browser does not support the video tag.
                                                                                        </video>
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}


                                                                    {file?.leadDocument?.fileType === 'zip' && (
                                                                        <div className="note-download">
                                                                            <div className="note-info">
                                                                                <span className="note-icon">
                                                                                    <img src="/assets/img/zip-icon.png" alt="Preview" style={{ width: '100px', height: '100px' }} />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {file?.leadDocument?.fileType === 'csv' && (
                                                                        <div className="note-download">
                                                                            <div className="note-info">
                                                                                <span className="note-icon">
                                                                                    <img src="/assets/img/excel-icon.png" alt="Preview" style={{ width: '100px', height: '100px' }} />
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                </Link>
                                                            </li>
                                                            <li>
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
                                                                        <Link className="dropdown-item" to="#">
                                                                            <i className="ti ti-download text-info" />
                                                                            Download
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            )}

                                            {/* <div className="files-wrap">
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="file-info">
                                                            <h4>Collier-Turner Proposal</h4>
                                                            <p>
                                                                Send customizable quotes, proposals and
                                                                contracts to close deals faster.
                                                            </p>
                                                            <div className="file-user">
                                                                <ImageWithBasePath
                                                                    src="assets/img/profiles/avatar-01.jpg"
                                                                    alt="img"
                                                                />
                                                                <div>
                                                                    <p>
                                                                        <span>Owner</span> Jessica
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end">
                                                        <ul className="file-action">
                                                            <li>
                                                                <span className="badge badge-tag badge-purple-light">
                                                                    Quote
                                                                </span>
                                                            </li>
                                                            <li>
                                                                <span className="badge bg-success priority-badge">
                                                                    Sent
                                                                </span>
                                                            </li>
                                                            <li>
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
                                                                        <Link className="dropdown-item" to="#">
                                                                            <i className="ti ti-download text-info" />
                                                                            Download
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="files-wrap">
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="file-info">
                                                            <h4>Collier-Turner Proposal</h4>
                                                            <p>
                                                                Send customizable quotes, proposals and
                                                                contracts to close deals faster.
                                                            </p>
                                                            <div className="file-user">
                                                                <ImageWithBasePath
                                                                    src="assets/img/profiles/avatar-22.jpg"
                                                                    alt="img"
                                                                />
                                                                <div>
                                                                    <p>
                                                                        <span>Owner</span> Vaughan
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end">
                                                        <ul className="file-action">
                                                            <li>
                                                                <span className="badge badge-tag badge-danger-light">
                                                                    Proposal
                                                                </span>
                                                            </li>
                                                            <li>
                                                                <span className="badge badge-tag bg-pending priority-badge">
                                                                    Draft
                                                                </span>
                                                            </li>
                                                            <li>
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
                                                                        <Link className="dropdown-item" to="#">
                                                                            <i className="ti ti-download text-info" />
                                                                            Download
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                    {/* /Files */}
                                    {/* Email */}
                                    <div className="tab-pane fade" id="email">
                                        <div className="view-header">
                                            <h4>Email</h4>
                                            <ul>
                                                <li>
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={
                                                            <Tooltip id="tooltip-left">
                                                                There are no email accounts configured. Please
                                                                configure your email account in order to
                                                                Send/Create Emails.
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <Link
                                                            to="#"
                                                            className="com-add"
                                                            data-bs-toggle="tooltip"
                                                            data-bs-placement="left"
                                                            data-bs-custom-class="tooltip-dark"
                                                            data-bs-original-title="There are no email accounts configured. Please configure your email account in order to Send/Create Emails"
                                                        >
                                                            <i className="ti ti-circle-plus me-1" />
                                                            Create Email
                                                        </Link>
                                                    </OverlayTrigger>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="files-activity">
                                            <div className="files-wrap">
                                                <div className="row align-items-center">
                                                    <div className="col-md-8">
                                                        <div className="file-info">
                                                            <h4>Manage Emails</h4>
                                                            <p>
                                                                You can send and reply to emails directly via
                                                                this section.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 text-md-end">
                                                        <ul className="file-action">
                                                            <li>
                                                                <Link
                                                                    to="#"
                                                                    className="btn btn-primary"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#create_email"
                                                                >
                                                                    Connect Account
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="files-wrap">
                                                <div className="email-header">
                                                    <div className="row">
                                                        <div className="col top-action-left">
                                                            <div className="float-start d-none d-sm-block">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search Messages"
                                                                    className="form-control search-message"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-auto top-action-right">
                                                            <div className="text-end">
                                                                <button
                                                                    type="button"
                                                                    title="Refresh"
                                                                    data-bs-toggle="tooltip"
                                                                    className="btn btn-white d-none d-md-inline-block me-1"
                                                                >
                                                                    <i className="fa-solid fa-rotate" />
                                                                </button>
                                                                <div className="btn-group">
                                                                    <Link to="#" className="btn btn-white">
                                                                        <i className="fa-solid fa-angle-left" />
                                                                    </Link>
                                                                    <Link to="#" className="btn btn-white">
                                                                        <i className="fa-solid fa-angle-right" />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                            <div className="text-end">
                                                                <span className="text-muted d-none d-md-inline-block">
                                                                    Showing 10 of 112{" "}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="email-content">
                                                    <div className="table-responsive">
                                                        <table className="table table-inbox table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan={6} className="ps-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkbox-all"
                                                                        />
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr
                                                                    className="unread clickable-row"

                                                                >
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkmail"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <span className="mail-important">
                                                                            <i className="fa fa-star starred " />
                                                                        </span>
                                                                    </td>
                                                                    <td className="name">John Doe</td>
                                                                    <td className="subject">
                                                                        Lorem ipsum dolor sit amet, consectetuer
                                                                        adipiscing elit
                                                                    </td>
                                                                    <td>
                                                                        <i className="fa-solid fa-paperclip" />
                                                                    </td>
                                                                    <td className="mail-date">13:14</td>
                                                                </tr>
                                                                <tr
                                                                    className="unread clickable-row"

                                                                >
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkmail"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <span className="mail-important">
                                                                            <i className="fa-regular fa-star" />
                                                                        </span>
                                                                    </td>
                                                                    <td className="name">Envato Account</td>
                                                                    <td className="subject">
                                                                        Important account security update from
                                                                        Envato
                                                                    </td>
                                                                    <td />
                                                                    <td className="mail-date">8:42</td>
                                                                </tr>
                                                                <tr
                                                                    className="clickable-row"

                                                                >
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkmail"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <span className="mail-important">
                                                                            <i className="fa-regular fa-star" />
                                                                        </span>
                                                                    </td>
                                                                    <td className="name">Twitter</td>
                                                                    <td className="subject">
                                                                        HRMS Bootstrap Admin Template
                                                                    </td>
                                                                    <td />
                                                                    <td className="mail-date">30 Nov</td>
                                                                </tr>
                                                                <tr
                                                                    className="unread clickable-row"

                                                                >
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkmail"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <span className="mail-important">
                                                                            <i className="fa-regular fa-star" />
                                                                        </span>
                                                                    </td>
                                                                    <td className="name">Richard Parker</td>
                                                                    <td className="subject">
                                                                        Lorem ipsum dolor sit amet, consectetuer
                                                                        adipiscing elit
                                                                    </td>
                                                                    <td />
                                                                    <td className="mail-date">18 Sep</td>
                                                                </tr>
                                                                <tr
                                                                    className="clickable-row"

                                                                >
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkmail"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <span className="mail-important">
                                                                            <i className="fa-regular fa-star" />
                                                                        </span>
                                                                    </td>
                                                                    <td className="name">John Smith</td>
                                                                    <td className="subject">
                                                                        Lorem ipsum dolor sit amet, consectetuer
                                                                        adipiscing elit
                                                                    </td>
                                                                    <td />
                                                                    <td className="mail-date">21 Aug</td>
                                                                </tr>
                                                                <tr
                                                                    className="clickable-row"

                                                                >
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkmail"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <span className="mail-important">
                                                                            <i className="fa-regular fa-star" />
                                                                        </span>
                                                                    </td>
                                                                    <td className="name">me, Robert Smith (3)</td>
                                                                    <td className="subject">
                                                                        Lorem ipsum dolor sit amet, consectetuer
                                                                        adipiscing elit
                                                                    </td>
                                                                    <td />
                                                                    <td className="mail-date">1 Aug</td>
                                                                </tr>
                                                                <tr
                                                                    className="unread clickable-row"

                                                                >
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkmail"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <span className="mail-important">
                                                                            <i className="fa-regular fa-star" />
                                                                        </span>
                                                                    </td>
                                                                    <td className="name">Codecanyon</td>
                                                                    <td className="subject">
                                                                        Welcome To Codecanyon
                                                                    </td>
                                                                    <td />
                                                                    <td className="mail-date">Jul 13</td>
                                                                </tr>
                                                                <tr
                                                                    className="clickable-row"

                                                                >
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkmail"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <span className="mail-important">
                                                                            <i className="fa-regular fa-star" />
                                                                        </span>
                                                                    </td>
                                                                    <td className="name">Richard Miles</td>
                                                                    <td className="subject">
                                                                        Lorem ipsum dolor sit amet, consectetuer
                                                                        adipiscing elit
                                                                    </td>
                                                                    <td>
                                                                        <i className="fa-solid fa-paperclip" />
                                                                    </td>
                                                                    <td className="mail-date">May 14</td>
                                                                </tr>
                                                                <tr
                                                                    className="unread clickable-row"

                                                                >
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkmail"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <span className="mail-important">
                                                                            <i className="fa-regular fa-star" />
                                                                        </span>
                                                                    </td>
                                                                    <td className="name">John Smith</td>
                                                                    <td className="subject">
                                                                        Lorem ipsum dolor sit amet, consectetuer
                                                                        adipiscing elit
                                                                    </td>
                                                                    <td />
                                                                    <td className="mail-date">11/11/16</td>
                                                                </tr>
                                                                <tr
                                                                    className="clickable-row"

                                                                >
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="checkmail"
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <span className="mail-important">
                                                                            <i className="fa fa-star starred " />
                                                                        </span>
                                                                    </td>
                                                                    <td className="name">Mike Litorus</td>
                                                                    <td className="subject">
                                                                        Lorem ipsum dolor sit amet, consectetuer
                                                                        adipiscing elit
                                                                    </td>
                                                                    <td />
                                                                    <td className="mail-date">10/31/16</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Email */}
                                </div>
                            </div>
                            {/* /Tab Content */}
                        </div>
                        {/* /Contact Details */}
                    </div>
                </div>
            </div>
            {/* /Page Wrapper */}

            {/* Delete Company */}
            <div
                className="modal custom-modal fade"
                id="delete_contact"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 m-0 justify-content-end">
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="success-message text-center">
                                <div className="success-popup-icon">
                                    <i className="ti ti-trash-x" />
                                </div>
                                <h3>Remove Company?</h3>
                                <p className="del-info">
                                    Company ”NovaWaveLLC” from your Account
                                </p>
                                <div className="col-lg-12 text-center modal-btn">
                                    <Link
                                        to="#"
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-danger"
                                        data-bs-dismiss="modal"
                                    >
                                        Yes, Delete it
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Delete Company */}
            {/* Add Note */}
            <div
                className="modal custom-modal fade modal-padding"
                id="add_notes"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Notes</h5>
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
                            <form>
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        Title <span className="text-danger"> *</span>
                                    </label>
                                    <input className="form-control" type="text" />
                                </div>
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        Note <span className="text-danger"> *</span>
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows={4}
                                        defaultValue={""}
                                    />
                                </div>
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        Attachment <span className="text-danger"> *</span>
                                    </label>
                                    <div className="drag-attach">
                                        <input type="file" />
                                        <div className="img-upload">
                                            <i className="ti ti-file-broken" />
                                            Upload File
                                        </div>
                                    </div>
                                </div>
                                <div className="form-wrap">
                                    <label className="col-form-label">Uploaded Files</label>
                                    <div className="upload-file">
                                        <h6>Projectneonals teyys.xls</h6>
                                        <p>4.25 MB</p>
                                        <div className="progress">
                                            <div
                                                className="progress-bar bg-success"
                                                role="progressbar"
                                                style={{ width: "25%" }}
                                                aria-valuenow={25}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            />
                                        </div>
                                        <p className="black-text">45%</p>
                                    </div>
                                    <div className="upload-file upload-list">
                                        <div>
                                            <h6>tes.txt</h6>
                                            <p>4.25 MB</p>
                                        </div>
                                        <Link to="#" className="text-danger">
                                            <i className="ti ti-trash-x" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-lg-12 text-end modal-btn">
                                    <Link
                                        to="#"
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        data-bs-dismiss="modal"
                                    >
                                        Confirm
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Note */}
            {/* Add File */}

            {/* <AddProposal  /> */}

            <AddProposal fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={data} />

            <AddDocuments fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={data} />

            <AddLeadPic fetchLeadFollowupData={handleRefresh} leadDetails={data} />

            <AddLeadOtherDetails fetchLeadFollowupData={handleRefresh} leadDetails={data} />


            {/* <div
                className="modal custom-modal fade custom-modal-two modal-padding"
                id="new_file"
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create New File</h5>
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
                            <div className="add-info-fieldset">
                                <div className="add-details-wizard">
                                    <ul className="progress-bar-wizard">
                                        <li className="active">
                                            <span>
                                                <i className="ti ti-file" />
                                            </span>
                                            <div className="multi-step-info">
                                                <h6>Basic Info</h6>
                                            </div>
                                        </li>
                                        <li>
                                            <span>
                                                <i className="ti ti-circle-plus" />
                                            </span>
                                            <div className="multi-step-info">
                                                <h6>Add Recipient</h6>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <fieldset id="first-field-file">
                                    <form>
                                        <div className="contact-input-set">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Choose Deal <span className="text-danger">*</span>
                                                        </label>
                                                        <select className="select">
                                                            <option>Select</option>
                                                            <option>Collins</option>
                                                            <option>Wisozk</option>
                                                            <option>Walter</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Document Type{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <select className="select">
                                                            <option>Select</option>
                                                            <option>Contract</option>
                                                            <option>Proposal</option>
                                                            <option>Quote</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Owner <span className="text-danger">*</span>
                                                        </label>
                                                        <select className="select">
                                                            <option>Select</option>
                                                            <option>Admin</option>
                                                            <option>Jackson Daniel</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Title <span className="text-danger"> *</span>
                                                        </label>
                                                        <input className="form-control" type="text" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Locale <span className="text-danger">*</span>
                                                        </label>
                                                        <select className="select">
                                                            <option>Select</option>
                                                            <option>en</option>
                                                            <option>es</option>
                                                            <option>ru</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="signature-wrap">
                                                        <h4>Signature</h4>
                                                        <ul className="nav sign-item">
                                                            <li className="nav-item">
                                                                <span
                                                                    className=" mb-0"
                                                                    data-bs-toggle="tab"
                                                                    data-bs-target="#nosign"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="sign1"
                                                                        name="email"
                                                                    />
                                                                    <label htmlFor="sign1">
                                                                        <span className="sign-title">
                                                                            No Signature
                                                                        </span>
                                                                        This document does not require a signature
                                                                        before acceptance.
                                                                    </label>
                                                                </span>
                                                            </li>
                                                            <li className="nav-item">
                                                                <span
                                                                    className="active mb-0"
                                                                    data-bs-toggle="tab"
                                                                    data-bs-target="#use-esign"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="sign2"
                                                                        name="email"
                                                                        defaultChecked={true}
                                                                    />
                                                                    <label htmlFor="sign2">
                                                                        <span className="sign-title">
                                                                            Use e-signature
                                                                        </span>
                                                                        This document require e-signature before
                                                                        acceptance.
                                                                    </label>
                                                                </span>
                                                            </li>
                                                        </ul>
                                                        <div className="tab-content">
                                                            <div
                                                                className="tab-pane show active"
                                                                id="use-esign"
                                                            >
                                                                <div className="input-block mb-0">
                                                                    <label className="col-form-label">
                                                                        Document Signers{" "}
                                                                        <span className="text-danger">*</span>
                                                                    </label>
                                                                </div>
                                                                <div className="sign-content">
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="form-wrap">
                                                                                <input
                                                                                    className="form-control"
                                                                                    type="text"
                                                                                    placeholder="Enter Name"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <div className="d-flex align-items-center">
                                                                                <div className="float-none form-wrap me-3 w-100">
                                                                                    <input
                                                                                        className="form-control"
                                                                                        type="text"
                                                                                        placeholder="Email Address"
                                                                                    />
                                                                                </div>
                                                                                <div className="input-btn form-wrap">
                                                                                    <Link to="#" className="add-sign">
                                                                                        <i className="ti ti-circle-plus" />
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="input-block mb-3">
                                                        <label className="col-form-label">
                                                            Content <span className="text-danger"> *</span>
                                                        </label>
                                                        <textarea
                                                            className="form-control"
                                                            rows={3}
                                                            placeholder="Add Content"
                                                            defaultValue={""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 text-end form-wizard-button modal-btn">
                                                    <button className="btn btn-light" type="reset">
                                                        Reset
                                                    </button>
                                                    <button
                                                        className="btn btn-primary wizard-next-btn"
                                                        type="button"
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </fieldset>
                                <fieldset>
                                    <form>
                                        <div className="contact-input-set">
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="signature-wrap">
                                                        <h4 className="mb-2">
                                                            Send the document to following signers
                                                        </h4>
                                                        <p>In order to send the document to the signers</p>
                                                        <div className="input-block mb-0">
                                                            <label className="col-form-label">
                                                                Recipients (Additional recipients)
                                                            </label>
                                                        </div>
                                                        <div className="sign-content">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="form-wrap">
                                                                        <input
                                                                            className="form-control"
                                                                            type="text"
                                                                            placeholder="Enter Name"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="float-none form-wrap me-3 w-100">
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                placeholder="Email Address"
                                                                            />
                                                                        </div>
                                                                        <div className="input-btn form-wrap">
                                                                            <Link to="#" className="add-sign">
                                                                                <i className="ti ti-circle-plus" />
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Message Subject{" "}
                                                            <span className="text-danger"> *</span>
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="Enter Subject"
                                                        />
                                                    </div>
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Message Text{" "}
                                                            <span className="text-danger"> *</span>
                                                        </label>
                                                        <textarea
                                                            className="form-control"
                                                            rows={3}
                                                            placeholder="Your document is ready"
                                                            defaultValue={""}
                                                        />
                                                    </div>
                                                    <button className="btn btn-light mb-3">
                                                        Send Now
                                                    </button>
                                                    <div className="send-success">
                                                        <p>
                                                            <i className="ti ti-circle-check" /> Document sent
                                                            successfully to the selected recipients
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 text-end form-wizard-button modal-btn">
                                                    <button className="btn btn-light" type="reset">
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="btn btn-primary"
                                                        type="button"
                                                        data-bs-dismiss="modal"
                                                    >
                                                        Save &amp; Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* /Add File */}
            {/* /Add Call Comment */}
            <AddCallComment fetchLeadFollowupData={fetchLeadFollowupData} followUpId={followUpId} />
            {/* /Add Call Comment */}
            <RescheduleCall fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={data} />

            <RescheduleMeeting fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={data} />

            <AddMeetingComment fetchLeadFollowupData={fetchLeadFollowupData} followUpId={followUpId} />

            <AddProposalComment fetchLeadFollowupData={fetchLeadFollowupData} followUpId={followUpId} />



            {/* Connect Account */}
            <div className="modal custom-modal fade" id="create_email" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Connect Account</h5>
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
                            <div className="form-wrap">
                                <label className="col-form-label">
                                    Account type <span className="text-danger"> *</span>
                                </label>
                                <select className="select">
                                    <option>Gmail</option>
                                    <option>Outlook</option>
                                    <option>Imap</option>
                                </select>
                            </div>
                            <div className="form-wrap">
                                <h5 className="form-title">Sync emails from</h5>
                                <div className="sync-radio">
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            className="status-radio"
                                            id="test1"
                                            name="radio-group"
                                            defaultChecked={true}
                                        />
                                        <label htmlFor="test1">Now</label>
                                    </div>
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            className="status-radio"
                                            id="test2"
                                            name="radio-group"
                                        />
                                        <label htmlFor="test2">1 Month Ago</label>
                                    </div>
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            className="status-radio"
                                            id="test3"
                                            name="radio-group"
                                        />
                                        <label htmlFor="test3">3 Month Ago</label>
                                    </div>
                                    <div className="radio-item">
                                        <input
                                            type="radio"
                                            className="status-radio"
                                            id="test4"
                                            name="radio-group"
                                        />
                                        <label htmlFor="test4">6 Month Ago</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 text-end modal-btn">
                                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                                    Cancel
                                </Link>
                                <button
                                    className="btn btn-primary"
                                    data-bs-target="#success_mail"
                                    data-bs-toggle="modal"
                                    data-bs-dismiss="modal"
                                >
                                    Connect Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Connect Account */}
            {/* Success Company */}
            <div className="modal custom-modal fade" id="success_mail" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 m-0 justify-content-end">
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="success-message text-center">
                                <div className="success-popup-icon bg-light-blue">
                                    <i className="ti ti-mail-opened" />
                                </div>
                                <h3>Email Connected Successfully!!!</h3>
                                <p>
                                    Email Account is configured with “example@example.com”. Now you
                                    can access email.
                                </p>
                                <div className="col-lg-12 text-center modal-btn">
                                    <Link to="#" className="btn btn-primary">
                                        Go to email
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Success Company */}
            {/* Access */}
            <div className="modal custom-modal fade" id="access_view" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Access For</h5>
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-wrap icon-form">
                                    <span className="form-icon">
                                        <i className="ti ti-search" />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search"
                                    />
                                </div>
                                <div className="access-wrap">
                                    <ul>
                                        <li className="select-people-checkbox">
                                            <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                                <span className="people-profile">
                                                    <ImageWithBasePath
                                                        src="assets/img/profiles/avatar-19.jpg"
                                                        alt=""
                                                    />
                                                    <Link to="#">Darlee Robertson</Link>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="select-people-checkbox">
                                            <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                                <span className="people-profile">
                                                    <ImageWithBasePath
                                                        src="assets/img/profiles/avatar-20.jpg"
                                                        alt=""
                                                    />
                                                    <Link to="#">Sharon Roy</Link>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="select-people-checkbox">
                                            <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                                <span className="people-profile">
                                                    <ImageWithBasePath
                                                        src="assets/img/profiles/avatar-21.jpg"
                                                        alt=""
                                                    />
                                                    <Link to="#">Vaughan</Link>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="select-people-checkbox">
                                            <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                                <span className="people-profile">
                                                    <ImageWithBasePath
                                                        src="assets/img/profiles/avatar-01.jpg"
                                                        alt=""
                                                    />
                                                    <Link to="#">Jessica</Link>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="select-people-checkbox">
                                            <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                                <span className="people-profile">
                                                    <ImageWithBasePath
                                                        src="assets/img/profiles/avatar-16.jpg"
                                                        alt=""
                                                    />
                                                    <Link to="#">Carol Thomas</Link>
                                                </span>
                                            </label>
                                        </li>
                                        <li className="select-people-checkbox">
                                            <label className="checkboxs">
                                                <input type="checkbox" />
                                                <span className="checkmarks" />
                                                <span className="people-profile">
                                                    <ImageWithBasePath
                                                        src="assets/img/profiles/avatar-22.jpg"
                                                        alt=""
                                                    />
                                                    <Link to="#">Dawn Mercha</Link>
                                                </span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                                <div className="modal-btn text-end">
                                    <Link
                                        to="#"
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        data-bs-dismiss="modal"
                                    >
                                        Confirm
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Access */}
            {/* Add Compose */}
            <div className="modal custom-modal fade" id="add_compose" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Compose</h5>
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body p-0">
                            <form action="#">
                                <div className="form-wrap">
                                    <input
                                        type="email"
                                        placeholder="To"
                                        className="form-control"
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <input
                                                type="email"
                                                placeholder="Cc"
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <input
                                                type="email"
                                                placeholder="Bcc"
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-wrap">
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-wrap">
                                    <DefaultEditor className="summernote" />
                                </div>
                                <div className="form-wrap">
                                    <div className="text-center">
                                        <button className="btn btn-primary me-1">
                                            <span>Send</span>
                                            <i className="fa-solid fa-paper-plane ms-1" />
                                        </button>
                                        <button className="btn btn-primary me-1" type="button">
                                            <span>Draft</span>{" "}
                                            <i className="fa-regular fa-floppy-disk ms-1" />
                                        </button>
                                        <button className="btn btn-primary me-1" type="button">
                                            <span>Delete</span>{" "}
                                            <i className="fa-regular fa-trash-can ms-1" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Compose */}
            {/* Edit Contact */}
            <div
                className={
                    activityToggleTwo ? "toggle-popup1 sidebar-popup" : "toggle-popup1"
                }
            >
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Edit Contact</h4>
                        <Link
                            to="#"
                            className="sidebar-close1 toggle-btn"
                            onClick={() =>
                                dispatch(setActivityTogglePopupTwo(!activityToggleTwo))
                            }
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form>
                                <div className="accordion-lists" id="list-accords">
                                    {/* Basic Info */}
                                    <div className="user-accordion-item">
                                        <Link
                                            to="#"
                                            className="accordion-wrap"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#edit-basic"
                                        >
                                            <span>
                                                <i className="ti ti-user-plus" />
                                            </span>
                                            Basic Info
                                        </Link>
                                        <div
                                            className="accordion-collapse collapse show"
                                            id="edit-basic"
                                            data-bs-parent="#list-accords"
                                        >
                                            <div className="content-collapse">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-wrap">
                                                            <div className="profile-upload">
                                                                <div className="profile-upload-img">
                                                                    <span>
                                                                        <i className="ti ti-photo" />
                                                                    </span>
                                                                    <ImageWithBasePath
                                                                        src="assets/img/profiles/avatar-20.jpg"
                                                                        alt="img"
                                                                        className="preview1"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="profile-remove"
                                                                    >
                                                                        <i className="ti ti-x" />
                                                                    </button>
                                                                </div>
                                                                <div className="profile-upload-content">
                                                                    <label className="profile-upload-btn">
                                                                        <i className="ti ti-file-broken" /> Upload
                                                                        File
                                                                        <input type="file" className="input-img" />
                                                                    </label>
                                                                    <p>JPG, GIF or PNG. Max size of 800K</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                First Name{" "}
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue="Darlee"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Last Name <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue="Robertson"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Job Title <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue="Facility Manager"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Company Name
                                                            </label>

                                                            <Select
                                                                className="select"
                                                                options={companyName}
                                                                classNamePrefix="react-select"
                                                                placeholder="NovaWave LLC"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-wrap">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <label className="col-form-label">
                                                                    Email <span className="text-danger">*</span>
                                                                </label>
                                                                <div className="status-toggle small-toggle-btn d-flex align-items-center">
                                                                    <span className="me-2 label-text">
                                                                        Email Opt Out
                                                                    </span>
                                                                    <input
                                                                        type="checkbox"
                                                                        id="user2"
                                                                        className="check"
                                                                        defaultChecked
                                                                    />
                                                                    <label
                                                                        htmlFor="user2"
                                                                        className="checktoggle"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue="robertson@example.com"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Phone 1 <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue={1234567890}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Phone 2</label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Fax <span className="text-danger">*</span>
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <label className="col-form-label">Deals</label>
                                                                <Link to="#" className="label-add add-popups">
                                                                    <i className="ti ti-square-rounded-plus" />
                                                                    Add New
                                                                </Link>
                                                            </div>

                                                            <Select
                                                                className="select"
                                                                options={dealsopen}
                                                                classNamePrefix="react-select"
                                                                placeholder="NovaWave LLC"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Date of Birth
                                                            </label>
                                                            <div className="icon-form-end">
                                                                <span className="form-icon">
                                                                    <i className="ti ti-calendar-event" />
                                                                </span>
                                                                <DatePicker
                                                                    className="form-control datetimepicker deals-details"
                                                                    selected={selectedDate1}
                                                                    onChange={handleDateChange1}
                                                                    dateFormat="dd-MM-yyyy"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Reviews </label>
                                                            <div className="icon-form-end">
                                                                <span className="form-icon">
                                                                    <i className="ti ti-star" />
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="4.2"
                                                                    defaultValue="4.2"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Owner</label>
                                                            {/* <SelectWithImage /> */}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Tags </label>

                                                            <TagsInput
                                                                // className="input-tags form-control"
                                                                value={owner}
                                                                onChange={setOwner}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Source <span className="text-danger">*</span>
                                                            </label>

                                                            <Select
                                                                className="select"
                                                                options={activities}
                                                                classNamePrefix="react-select"
                                                                placeholder="Phone Calls"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Industry <span className="text-danger">*</span>
                                                            </label>

                                                            <Select
                                                                className="select"
                                                                options={industries}
                                                                classNamePrefix="react-select"
                                                                placeholder="Banking"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Currency <span className="text-danger">*</span>
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Language <span className="text-danger">*</span>
                                                            </label>

                                                            <Select
                                                                className="select"
                                                                options={languageOptions}
                                                                classNamePrefix="react-select"
                                                                placeholder="English"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-wrap mb-0">
                                                            <label className="col-form-label">
                                                                Description{" "}
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <textarea
                                                                className="form-control"
                                                                rows={5}
                                                                defaultValue={""}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Basic Info */}
                                    {/* Address Info */}
                                    <div className="user-accordion-item">
                                        <Link
                                            to="#"
                                            className="accordion-wrap collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#edit-address"
                                        >
                                            <span>
                                                <i className="ti ti-map-pin-cog" />
                                            </span>
                                            Address Info
                                        </Link>
                                        <div
                                            className="accordion-collapse collapse"
                                            id="edit-address"
                                            data-bs-parent="#list-accords"
                                        >
                                            <div className="content-collapse">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Street Address{" "}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue="22, Ave Street"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">City </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue="Denver"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                State / Province{" "}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue="Colorado"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap mb-wrap">
                                                            <label className="col-form-label">Country</label>

                                                            <Select
                                                                className="select"
                                                                options={countries}
                                                                placeholder="USA"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap mb-0">
                                                            <label className="col-form-label">Zipcode </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Address Info */}
                                    {/* Social Profile */}
                                    <div className="user-accordion-item">
                                        <Link
                                            to="#"
                                            className="accordion-wrap collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#edit-social"
                                        >
                                            <span>
                                                <i className="ti ti-social" />
                                            </span>
                                            Social Profile
                                        </Link>
                                        <div
                                            className="accordion-collapse collapse"
                                            id="edit-social"
                                            data-bs-parent="#list-accords"
                                        >
                                            <div className="content-collapse">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Facebook</label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Skype </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Linkedin{" "}
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Twitter</label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap mb-wrap">
                                                            <label className="col-form-label">Whatsapp</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                defaultValue={1234567890}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap mb-0">
                                                            <label className="col-form-label">
                                                                Instagram
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Social Profile */}
                                    {/* Access */}
                                    <div className="user-accordion-item">
                                        <Link
                                            to="#"
                                            className="accordion-wrap collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#edit-access"
                                        >
                                            <span>
                                                <i className="ti ti-accessible" />
                                            </span>
                                            Access
                                        </Link>
                                        <div
                                            className="accordion-collapse collapse"
                                            id="edit-access"
                                            data-bs-parent="#list-accords"
                                        >
                                            <div className="content-collapse">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="radio-wrap form-wrap">
                                                            <label className="col-form-label">
                                                                Visibility
                                                            </label>
                                                            <div className="d-flex flex-wrap">
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="edit-public"
                                                                        name="visible"
                                                                    />
                                                                    <label htmlFor="edit-public">Public</label>
                                                                </div>
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="edit-private"
                                                                        name="visible"
                                                                    />
                                                                    <label htmlFor="edit-private">Private</label>
                                                                </div>
                                                                <div
                                                                    className="radio-btn"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#access_view"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="edit-people"
                                                                        name="visible"
                                                                    />
                                                                    <label htmlFor="edit-people">
                                                                        Select People
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="radio-wrap">
                                                            <label className="col-form-label">Status</label>
                                                            <div className="d-flex flex-wrap">
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="edit-active"
                                                                        name="status"
                                                                        defaultChecked={true}
                                                                    />
                                                                    <label htmlFor="edit-active">Active</label>
                                                                </div>
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="edit-inactive"
                                                                        name="status"
                                                                    />
                                                                    <label htmlFor="edit-inactive">
                                                                        Inactive
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Access */}
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" className="btn btn-light sidebar-close1">
                                        Cancel
                                    </Link>
                                    <Link to="#" className="btn btn-primary">
                                        Save Changes
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Edit Contact */}
            {/* Add Company */}
            <div className="toggle-popup2">
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Add Company</h4>
                        <Link to="#" className="sidebar-close2 toggle-btn">
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form action="#">
                                <div className="accordion-lists" id="list-accord">
                                    {/* Basic Info */}
                                    <div className="user-accordion-item">
                                        <Link
                                            to="#"
                                            className="accordion-wrap"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#add-basic"
                                        >
                                            <span>
                                                <i className="ti ti-user-plus" />
                                            </span>
                                            Basic Info
                                        </Link>
                                        <div
                                            className="accordion-collapse collapse show"
                                            id="add-basic"
                                            data-bs-parent="#list-accord"
                                        >
                                            <div className="content-collapse">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="profile-pic-upload">
                                                            <div className="profile-pic">
                                                                <span>
                                                                    <i className="ti ti-photo" />
                                                                </span>
                                                            </div>
                                                            <div className="upload-content">
                                                                <div className="upload-btn">
                                                                    <input type="file" />
                                                                    <span>
                                                                        <i className="ti ti-file-broken" />
                                                                        Upload File
                                                                    </span>
                                                                </div>
                                                                <p>JPG, GIF or PNG. Max size of 800K</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Company Name
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-wrap">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <label className="col-form-label">
                                                                    Email <span className="text-danger">*</span>
                                                                </label>
                                                                <div className="status-toggle small-toggle-btn d-flex align-items-center">
                                                                    <span className="me-2 label-text">
                                                                        Email Opt Out
                                                                    </span>
                                                                    <input
                                                                        type="checkbox"
                                                                        id="mail"
                                                                        className="check"
                                                                        defaultChecked={true}
                                                                    />
                                                                    <label
                                                                        htmlFor="mail"
                                                                        className="checktoggle"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Phone 1 <span className="text-danger">*</span>
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Phone 2</label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Fax <span className="text-danger">*</span>
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Company Website <span className="text-danger">*</span>
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Rating </label>
                                                            <div className="icon-form-end">
                                                                <span className="form-icon">
                                                                    <i className="ti ti-star" />
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="4.2"
                                                                    defaultValue="4.2"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap img-select">
                                                            <label className="col-form-label">Owner</label>
                                                            <select className="select2">
                                                                <option>Jerald</option>
                                                                <option>Guillory</option>
                                                                <option>Jami</option>
                                                                <option>Theresa</option>
                                                                <option>Espinosa</option>
                                                            </select>
                                                            <span className="select-box-img avatar">
                                                                <ImageWithBasePath
                                                                    src="assets/img/profiles/avatar-14.jpg"
                                                                    alt=""
                                                                />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Tags </label>
                                                            <input
                                                                className="input-tags form-control"
                                                                type="text"
                                                                data-role="tagsinput"
                                                                name="Label"
                                                                defaultValue="Tag1"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Deals</label>
                                                            <select className="select2">
                                                                <option>Choose</option>
                                                                <option>Collins</option>
                                                                <option>Konopelski</option>
                                                                <option>Adams</option>
                                                                <option>Schumm</option>
                                                                <option>Wisozk</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Source <span className="text-danger">*</span>
                                                            </label>
                                                            <select className="select2">
                                                                <option>Choose</option>
                                                                <option>Phone Calls</option>
                                                                <option>Social Media</option>
                                                                <option>Referral Sites</option>
                                                                <option>Web Analytics</option>
                                                                <option>Previous Purchases</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Industry <span className="text-danger">*</span>
                                                            </label>
                                                            <select className="select">
                                                                <option>Choose</option>
                                                                <option>Retail Industry</option>
                                                                <option>Banking</option>
                                                                <option>Hotels</option>
                                                                <option>Financial Services</option>
                                                                <option>Insurance</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Contact <span className="text-danger">*</span>
                                                            </label>
                                                            <select className="select2">
                                                                <option>Choose</option>
                                                                <option>John</option>
                                                                <option>Guillory</option>
                                                                <option>Jami</option>
                                                                <option>Theresa</option>
                                                                <option>Espinosa</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Currency <span className="text-danger">*</span>
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Language <span className="text-danger">*</span>
                                                            </label>
                                                            <select className="select">
                                                                <option>Choose</option>
                                                                <option>English</option>
                                                                <option>Arabic</option>
                                                                <option>Chinese</option>
                                                                <option>Hindi</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="form-wrap mb-0">
                                                            <label className="col-form-label">
                                                                Description{" "}
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <textarea
                                                                className="form-control"
                                                                rows={5}
                                                                defaultValue={""}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Basic Info */}
                                    {/* Address Info */}
                                    <div className="user-accordion-item">
                                        <Link
                                            to="#"
                                            className="accordion-wrap collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#add-address"
                                        >
                                            <span>
                                                <i className="ti ti-map-pin-cog" />
                                            </span>
                                            Address Info
                                        </Link>
                                        <div
                                            className="accordion-collapse collapse"
                                            id="add-address"
                                            data-bs-parent="#list-accord"
                                        >
                                            <div className="content-collapse">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Street Address{" "}
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">City </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                State / Province{" "}
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap mb-wrap">
                                                            <label className="col-form-label">Country</label>
                                                            <select className="select">
                                                                <option>Choose</option>
                                                                <option>India</option>
                                                                <option>USA</option>
                                                                <option>France</option>
                                                                <option>UK</option>
                                                                <option>UAE</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap mb-0">
                                                            <label className="col-form-label">Zipcode </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Address Info */}
                                    {/* Social Profile */}
                                    <div className="user-accordion-item">
                                        <Link
                                            to="#"
                                            className="accordion-wrap collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#add-social"
                                        >
                                            <span>
                                                <i className="ti ti-social" />
                                            </span>
                                            Social Profile
                                        </Link>
                                        <div
                                            className="accordion-collapse collapse"
                                            id="add-social"
                                            data-bs-parent="#list-accord"
                                        >
                                            <div className="content-collapse">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Facebook</label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Skype </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">
                                                                Linkedin{" "}
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap">
                                                            <label className="col-form-label">Twitter</label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap mb-wrap">
                                                            <label className="col-form-label">Whatsapp</label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-wrap mb-0">
                                                            <label className="col-form-label">
                                                                Instagram
                                                            </label>
                                                            <input type="text" className="form-control" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Social Profile */}
                                    {/* Access */}
                                    <div className="user-accordion-item">
                                        <Link
                                            to="#"
                                            className="accordion-wrap collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#add-access"
                                        >
                                            <span>
                                                <i className="ti ti-accessible" />
                                            </span>
                                            Access
                                        </Link>
                                        <div
                                            className="accordion-collapse collapse"
                                            id="add-access"
                                            data-bs-parent="#list-accord"
                                        >
                                            <div className="content-collapse">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="radio-wrap form-wrap">
                                                            <label className="col-form-label">
                                                                Visibility
                                                            </label>
                                                            <div className="d-flex flex-wrap">
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="add-public"
                                                                        name="visible"
                                                                    />
                                                                    <label htmlFor="add-public">Public</label>
                                                                </div>
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="add-private"
                                                                        name="visible"
                                                                    />
                                                                    <label htmlFor="add-private">Private</label>
                                                                </div>
                                                                <div
                                                                    className="radio-btn"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#access_view"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="add-people"
                                                                        name="visible"
                                                                    />
                                                                    <label htmlFor="add-people">
                                                                        Select People
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="radio-wrap">
                                                            <label className="col-form-label">Status</label>
                                                            <div className="d-flex flex-wrap">
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="add-active"
                                                                        name="status"
                                                                        defaultChecked={true}
                                                                    />
                                                                    <label htmlFor="add-active">Active</label>
                                                                </div>
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="add-inactive"
                                                                        name="status"
                                                                    />
                                                                    <label htmlFor="add-inactive">Inactive</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Access */}
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" className="btn btn-light sidebar-close2">
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#create_contact"
                                        className="btn btn-primary"
                                    >
                                        Create
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Company */}
            {/* Add New Deals */}
            <div
                className={
                    activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
                }
            >
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Add New Deals</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => setActivityToggle(!activityToggle)}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Deal Name <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Pipeine <span className="text-danger">*</span>
                                            </label>

                                            <Select
                                                className="select"
                                                options={salestypelist}
                                                classNamePrefix="react-select"
                                                placeholder="Choose"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Status <span className="text-danger">*</span>
                                            </label>

                                            <Select
                                                className="select2"
                                                options={status}
                                                classNamePrefix="react-select"
                                                placeholder="Choose"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Deal Value<span className="text-danger"> *</span>
                                            </label>
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Currency <span className="text-danger">*</span>
                                            </label>

                                            <Select
                                                className="select"
                                                options={optionssymbol}
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Period <span className="text-danger">*</span>
                                            </label>
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Period Value <span className="text-danger">*</span>
                                            </label>
                                            <input className="form-control" type="text" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Contact <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="input-tags form-control"
                                                type="text"
                                                data-role="tagsinput"
                                                name="Label"
                                                defaultValue="Jack, Darlee Robertson"
                                            />
                                        </div>
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Project <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="input-tags form-control"
                                                type="text"
                                                data-role="tagsinput"
                                                name="Label"
                                                defaultValue="Divine dran"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Due Date <span className="text-danger">*</span>
                                            </label>
                                            <div className="icon-form">
                                                <span className="form-icon">
                                                    <i className="ti ti-calendar-check" />
                                                </span>

                                                <DatePicker
                                                    className="form-control datetimepicker deals-details"
                                                    selected={selectedDate}
                                                    onChange={handleDateChange}
                                                    dateFormat="dd-MM-yyyy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Expected Closing Date{" "}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <div className="icon-form">
                                                <span className="form-icon">
                                                    <i className="ti ti-calendar-check" />
                                                </span>
                                                <DatePicker
                                                    className="form-control datetimepicker deals-details"
                                                    selected={selectedDate2}
                                                    onChange={handleDateChange2}
                                                    dateFormat="dd-MM-yyyy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Assignee <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                className="input-tags form-control"
                                                type="text"
                                                data-role="tagsinput"
                                                name="Label"
                                                defaultValue="James"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Follow Up Date <span className="text-danger">*</span>
                                            </label>
                                            <div className="icon-form">
                                                <span className="form-icon">
                                                    <i className="ti ti-calendar-check" />
                                                </span>

                                                <DatePicker
                                                    className="form-control datetimepicker deals-details"
                                                    selected={selectedDate4}
                                                    onChange={handleDateChange4}
                                                    dateFormat="dd-MM-yyyy"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">
                                                Source <span className="text-danger">*</span>
                                            </label>

                                            <Select
                                                className="select"
                                                options={socialMedia}
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">
                                                Tags <span className="text-danger">*</span>
                                            </label>
                                            <TagsInput
                                                // className="input-tags form-control"
                                                value={owner}
                                                onChange={setOwner}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">
                                                Priority <span className="text-danger">*</span>
                                            </label>

                                            <Select
                                                className="select"
                                                options={priorityList}
                                                classNamePrefix="react-select"
                                                placeholder="Select"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="input-block mb-3">
                                            <label className="col-form-label">
                                                Description <span className="text-danger">*</span>
                                            </label>
                                            <div className="summernote" />
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" className="btn btn-light sidebar-close">
                                        Cancel
                                    </Link>
                                    <Link to="#" className="btn btn-primary">
                                        Create
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add New Deals */}
            {/* Notes */}
            <div className="tab-pane fade" id="notes">
                <div className="view-header">
                    <h4>Notes</h4>
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
                                data-bs-target="#add_notes"
                                className="com-add"
                            >
                                <i className="ti ti-circle-plus me-1" />
                                Add New
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="notes-activity">
                    <div className="calls-box">
                        <div className="caller-info">
                            <div className="calls-user">
                                <ImageWithBasePath
                                    src="assets/img/profiles/avatar-19.jpg"
                                    alt="img"
                                />
                                <div>
                                    <h6>Darlee Robertson</h6>
                                    <p>15 Sep 2023, 12:10 pm</p>
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
                        <h5>Notes added by Antony</h5>
                        <p>
                            A project review evaluates the success of an
                            initiative and identifies areas for improvement. It
                            can also evaluate a current project to determine
                            whether it's on the right track. Or, it can determine
                            the success of a completed project.{" "}
                        </p>
                        <ul>
                            <li>
                                <div className="note-download">
                                    <div className="note-info">
                                        <span className="note-icon bg-secondary-success">
                                            <i className="ti ti-file-spreadsheet" />
                                        </span>
                                        <div>
                                            <h6>Project Specs.xls</h6>
                                            <p>365 KB</p>
                                        </div>
                                    </div>
                                    <Link to="#">
                                        <i className="ti ti-arrow-down" />
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="note-download">
                                    <div className="note-info">
                                        <span className="note-icon">
                                            <ImageWithBasePath
                                                src="assets/img/media/media-35.jpg"
                                                alt="img"
                                            />
                                        </span>
                                        <div>
                                            <h6>090224.jpg</h6>
                                            <p>365 KB</p>
                                        </div>
                                    </div>
                                    <Link to="#">
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
                                <Link to="#" className="add-comment">
                                    <i className="ti ti-square-plus me-1" />
                                    Add Comment
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="calls-box">
                        <div className="caller-info">
                            <div className="calls-user">
                                <ImageWithBasePath
                                    src="assets/img/profiles/avatar-20.jpg"
                                    alt="img"
                                />
                                <div>
                                    <h6>Sharon Roy</h6>
                                    <p>18 Sep 2023, 09:52 am</p>
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
                        <h5>Notes added by Antony</h5>
                        <p>
                            A project plan typically contains a list of the
                            essential elements of a project, such as stakeholders,
                            scope, timelines, estimated cost and communication
                            methods. The project manager typically lists the
                            information based on the assignment.
                        </p>
                        <ul>
                            <li>
                                <div className="note-download">
                                    <div className="note-info">
                                        <span className="note-icon bg-secondary-success">
                                            <i className="ti ti-file-text" />
                                        </span>
                                        <div>
                                            <h6>Andrewpass.txt</h6>
                                            <p>365 KB</p>
                                        </div>
                                    </div>
                                    <Link to="#">
                                        <i className="ti ti-arrow-down" />
                                    </Link>
                                </div>
                            </li>
                        </ul>
                        <div className="reply-box">
                            <p>
                                The best way to get a project done faster is to
                                start sooner. A goal without a timeline is just a
                                dream.The goal you set must be challenging. At the
                                same time, it should be realistic and attainable,
                                not impossible to reach.
                            </p>
                            <p>
                                Commented by{" "}
                                <span className="text-purple">Aeron</span> on 15 Sep
                                2023, 11:15 pm
                            </p>
                            <Link to="#" className="btn">
                                <i className="ti ti-arrow-back-up-double" />
                                Reply
                            </Link>
                        </div>
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
                                <Link to="#" className="add-comment">
                                    <i className="ti ti-square-plus me-1" />
                                    Add Comment
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="calls-box">
                        <div className="caller-info">
                            <div className="calls-user">
                                <ImageWithBasePath
                                    src="assets/img/profiles/avatar-21.jpg"
                                    alt="img"
                                />
                                <div>
                                    <h6>Vaughan</h6>
                                    <p>20 Sep 2023, 10:26 pm</p>
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
                        <p>
                            Projects play a crucial role in the success of
                            organizations, and their importance cannot be
                            overstated. Whether it's launching a new product,
                            improving an existing
                        </p>
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
                                <Link to="#" className="add-comment">
                                    <i className="ti ti-square-plus me-1" />
                                    Add Comment
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Notes */}

            <CreateCall leadDetails={data} fetchLeadDetails={fetchLeadFollowupData} />

            <CreateMeeting leadDetails={data} fetchLeadDetails={fetchLeadFollowupData} />

            <CreateComment leadDetails={data} fetchLeadDetails={fetchLeadFollowupData} />

            <ChangeStage leadForAssign={data} fetchLeadData={handleRefresh} followUpStage={stageHistoryOptions} />

            <AssignTo
                leadForAssign={data}
                fetchLeadData={handleRefresh}
            />



            {companyDetails &&
                <EditCompany
                    editCompany={editCompany}
                    setEditCompany={setEditCompany}
                    industryOptions={[]}
                    countryOptions={[]}
                    companyDetails={companyDetails}
                    setCompanyDetails={setCompanyDetails}
                    fetchLeadData={fetchLeadData}
                />
            }

        </>
    );
};

export default CustomerDetailsPage;
