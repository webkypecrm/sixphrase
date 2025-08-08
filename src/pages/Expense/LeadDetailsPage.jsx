import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import LeadSidebar from "../../components/Sales/LeadDetails/LeadSidebar";
import LeadActivities from "../../components/Sales/LeadDetails/LeadActivities";
import CreateServices from "../../components/Sales/LeadDetails/CreateServices";
import CreateAppointment from "../../components/Sales/LeadDetails/CreateAppointment";
import ChangeAppointmentStatus from "../../components/Sales/ChangeAppointmentStatus";
import AddAppointmentComment from "../../components/Sales/LeadDetails/AddAppointmentComment";
import EditServices from "../../components/Sales/LeadDetails/EditServices";
import RescheduleAppointment from "../../components/Sales/LeadDetails/RescheduleAppointment";
import EditLead from "../../components/Sales/EditLead";
const defaultImg = "/assets/img/authentication/staff_default.jpeg";
// import AddNewContact from "../../components/Sales/LeadDetails/AddNewContact";

// const stageColors = [
//     "bg-primary",  // Stage 1
//     "bg-success",  // Stage 2
//     "bg-warning",  // Stage 3
//     "bg-danger",   // Stage 4
//     "bg-info",     // Stage 5
//     "bg-secondary" // Stage 6
// ];

// const stageColors = {
//     1: "#FFF7D8",
//     2: "bg-info-transparent",
//     3: "bg-info-transparent",
//     4: "bg-success-transparent",
//     5: "bg-success-transparent",
//     6: "bg-danger"
// };


const LeadDetailsPage = () => {
    const params = useParams();
    const navigate = useNavigate();
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
    const [leadForOpitons, setLeadForOpitons] = useState([]);
    const [counselorOptions, setCounselorOptions] = useState([]);
    const [open, setOpen] = useState(false);

    // const [fileUrl, setFileUrl] = useState([]);
    // const [videoUrl, setVideoUrl] = useState([]);
    // const [imageUrl, setImageUrl] = useState([]);

    // console.log('stageHistoryOptions ', stageHistoryOptions)
    // console.log('data ', data)

    const openWhatsApp = () => {
        const encodedMessage = encodeURIComponent("Hello!");
        const whatsappURL = `https://wa.me/${data?.leadMobile1}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank'); // Opens in a new tab
    };

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

    function handleOpen() {
        setOpen((prev) => !prev)
    }

    const [leadFollowupData, setLeadFollowupData] = useState([]);
    const [groupActivityByDate, setGroupActivityByDate] = useState({});
    const [callData, setCallData] = useState([]);
    const [meetingData, setMeetingData] = useState([]);
    const [commentData, setCommentData] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [fileData, setFileData] = useState([]);
    const [proposalData, setProposalData] = useState([]);
    const [appointmentData, setAppointmentData] = useState([]);
    const [paymentHistoryData, setpaymentHistoryData] = useState([]);
    const [serviceDetails, setServiceDetails] = useState({});
    const [leadList, setLeadList] = useState([]);
    const [addLead, setAddLead] = useState(false);
    const [sourceOptions, setSourceOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([])
    const [leadDetails, setLeadDetails] = useState(null);

    console.log("leadDetails =>", leadDetails);

    // console.log('callData =>', callData)
    // console.log('meetingData =>', meetingData)
    // console.log('leadFollowData =>', leadFollowupData)
    // console.log('stageHistoryOptions =>', stageHistoryOptions)
    // console.log('commentData =>', commentData)
    // console.log('fileData =>', fileData)
    // console.log('proposalData =>', proposalData)
    // console.log('appointmentData =>', appointmentData)

    function onHandleServices(data) {
        setServiceDetails(() => ({ ...data }))
    }

    function handleRefresh() {
        fetchLeadFollowupData();
        fetchLeadDetails();
        fetchStageHistoryData();
    }


    const handleEmailClick = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const togglePopup = () => {
        setAddLead(prev => !prev);
    };

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

            const appointmentUpdate = response.data.data.filter((item) => item.type == 'appointment')
            setAppointmentData((prev) => [...appointmentUpdate])

            const paymentHistoryUpdate = response.data.data.filter((item) => item.type == 'paymentHistory')
            setpaymentHistoryData((prev) => [...paymentHistoryUpdate])

            const commentUpdate = response.data.data.filter((item) => item.type == 'leadComment')
            setCommentData((prev) => [...commentUpdate])

            const servicesUpdate = response.data.data.filter((item) => item.type == 'leadServices')
            setServicesData((prev) => [...servicesUpdate])

            const fileUpdate = response.data.data.filter((item) => item.type == 'fileUpdate')
            setFileData((prev) => [...fileUpdate])

            const proposalUpdate = response.data.data.filter((item) => item.type == 'proposalUpdate')
            setProposalData((prev) => [...proposalUpdate])


        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };
    const safeJSONParse = (str, defaultValue = []) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return defaultValue;
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
                tags: safeJSONParse(response.data.data.tags, []),
                leadFor: safeJSONParse(response.data.data.leadFor, [])
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
    const fetchLeadForData = async () => {
        try {
            const response = await fetch(`${apiUrl}/master/lead-for-list`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
            });
            const resData = await response.json();
            const formattedData = resData.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setLeadForOpitons(formattedData);
        } catch (error) {
            console.log(error)
        }
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
    const latestStage = stageHistoryOptions.length > 0 ? stageHistoryOptions[stageHistoryOptions.length - 1] : null;

    // console.log("latestStage =>", latestStage)

    const fetchTotalLeadData = async () => {
        try {
            const response = await fetch(`${apiUrl}/lead/get-all-lead-ids`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
            });
            const resData = await response.json();
            setLeadList(resData.data);
        } catch (error) {
            console.log(error)
        }
    }
    const fetchSourceData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/source-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setSourceOptions(formattedData);

        } catch (error) {
            console.log(error)

        }
    };
    const fetchCategoryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/category-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setCategoryOptions(formattedData);

        } catch (error) {
            console.log(error)

        }
    };

    const fetchCountryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/employee/country-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setCountryOptions(formattedData);

        } catch (error) {
            console.log(error)

        }
    };

    const handleNext = () => {
        const index = leadList.findIndex(lead => lead?.leadId === parseInt(leadId));
        if (index !== -1 && index < leadList.length - 1) {
            navigate(`/sales/leads-details/${leadList[index + 1].leadId}`);
        }
    };

    const handlePrevious = () => {
        const index = leadList.findIndex(lead => lead?.leadId === parseInt(leadId));
        if (index > 0) {
            navigate(`/sales/leads-details/${leadList[index - 1].leadId}`);
        }
    };

    // console.log("leadList =>", leadList)

    useEffect(() => {

        if (data?.leadId) {
            fetchLeadFollowupData()
            fetchStageHistoryData()
            fetchStageData()
            fetchLeadForData()
            fetchCounselorData()
            fetchTotalLeadData()
            fetchSourceData()
            fetchCountryData()
            fetchCategoryData()


            // Set interval to fetch data every 60 seconds
            const interval = setInterval(fetchLeadFollowupData, 60000);

            // Cleanup interval on component unmount
            return () => clearInterval(interval);

        }


    }, [data?.leadId])

    useEffect(() => {
        if (leadId) {
            fetchLeadDetails()

            // const interval = setInterval(fetchLeadDetails, 10000);

            // // Cleanup interval on component unmount
            // return () => clearInterval(interval);
        }
    }, [leadId])

    // console.log('data =>', data)

    const getYouTubeVideoId = (url) => {
        const regExp = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    // console.log("data =>", data)


    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-md-12">
                            {/* Page Header */}
                            <PageHeader
                                title={Array.isArray(data?.Customer) && data.Customer.length > 0 ? "Customer Overview" : "Lead Overview"}
                                pageRefresh={() => window.location.reload()}
                            />
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
                                                    Lead
                                                </Link>
                                            </li>
                                            <li>{data?.leadName}</li>
                                            <li>Id: {data?.leadId}</li>

                                        </ul>
                                    </div>

                                    <div className="col-sm-6 text-sm-end">
                                        <div className="contact-pagination">
                                            {/* <p>1 of 40</p> */}
                                            <ul>
                                                <li>
                                                    <button onClick={handlePrevious} disabled={leadList[0]?.leadId === parseInt(leadId)}>
                                                        <i className="ti ti-chevron-left" />
                                                    </button>
                                                </li>
                                                <li>
                                                    <button onClick={handleNext} disabled={leadList[leadList.length - 1]?.leadId === parseInt(leadId)}>
                                                        <i className="ti ti-chevron-right" />
                                                    </button>
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
                                        <h5>{data?.leadName.toUpperCase()} </h5>
                                        <p style={{ marginBottom: "0px", cursor: 'pointer' }}
                                            onClick={() => {
                                                handleEmailClick(data?.leadEmail)
                                            }}
                                        >
                                            <i className="ti ti ti-mail-check me-1" />
                                            {data?.leadEmail}
                                        </p>
                                        <Link style={{ marginBottom: "0px" }} onClick={openWhatsApp}>

                                            <i class="fa-brands fa-whatsapp"></i>
                                            <span style={{ marginLeft: '5px' }}>{data?.leadMobile1}</span>

                                        </Link>
                                        <p style={{ marginBottom: "0px" }}>
                                            <i class="fa-solid fa-building"></i>{"  "}
                                            {data?.company?.companyName || 'Individual'}
                                        </p>
                                        <p style={{ marginBottom: "0px" }}>
                                            <i class="fa-solid fa-clock"></i>{"  "}
                                            {getDate(data?.createdAt)}{" "}{getTime(data?.createdAt)}
                                        </p>


                                        {/* <div className="badge-rate">
                                            <p>
                                                <i className="fa-solid fa-star" /> 5.0
                                            </p>
                                        </div> */}
                                    </div>
                                </div>

                                <div className="contacts-action" style={{ display: 'flex', justifyContent: 'space-around' }}>


                                    <OverlayTrigger
                                        placement="bottom"
                                        overlay={<Tooltip id="assign-to-tooltip">Source</Tooltip>}
                                    >
                                        <Link
                                            to="#"
                                            className="btn btn add-popup"
                                            style={{ border: '1px solid black' }}
                                        >
                                            <div
                                                className="table-avatar d-flex align-items-center"
                                            // data-bs-toggle="modal"
                                            // data-bs-target="#assigned_to"
                                            // style={{ courser: 'pointer' }}

                                            >
                                                <div className="users-group">
                                                    <ul>
                                                        <li>
                                                            <Link to="#">
                                                                {
                                                                    <span className="menu-list-icon ">
                                                                        <i class="fa-solid fa-globe"></i>
                                                                    </span>
                                                                }
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            {data?.source}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Link>
                                    </OverlayTrigger>


                                    <OverlayTrigger
                                        placement="bottom"
                                        overlay={<Tooltip id="assign-to-tooltip">Created By</Tooltip>}
                                    >
                                        <Link
                                            to="#"
                                            className="btn btn add-popup"
                                            style={{ border: '1px solid black' }}
                                        >
                                            <div
                                                className="table-avatar d-flex align-items-center"
                                            >
                                                <div className="users-group">
                                                    <ul>
                                                        <li>
                                                            <Link to="#">
                                                                <span className="menu-list-icon ">
                                                                    <img src={data?.ownerImg || defaultImg} />
                                                                </span>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            {data?.owner?.split(' '[0])}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Link>
                                    </OverlayTrigger>

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
                                                                        <img src={data?.staff?.profilePic || defaultImg} />
                                                                    </span>
                                                                    :
                                                                    <span className="menu-list-icon ">
                                                                        <i className="ion-person" />
                                                                    </span>
                                                                }
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            {data?.assignedTo?.split(' '[0])}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Link>
                                    </OverlayTrigger>

                                    {data?.stage === 'Converted' &&
                                        <Link
                                            to="#"
                                            className="btn btn add-popup  bg-success"
                                            style={{ border: '1px solid black' }}
                                        >
                                            <div
                                                className="table-avatar d-flex align-items-center"


                                            >
                                                <div className="users-group">
                                                    <ul>
                                                        <li>
                                                            {data?.stage}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Link>
                                    }
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
                                                onClick={() => {
                                                    setLeadDetails(data)
                                                    togglePopup()
                                                }}
                                            >
                                                <i className="ti ti-edit text-blue" />
                                                Edit
                                            </Link>
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

                        {Array.isArray(data?.Customer) && (data?.Customer.length === 0 || data?.Customer == 'null') &&
                            <div className="col-md-12">
                                <div className="contact-wrap">
                                    <div className="row"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "start",
                                            alignItems: "center"
                                        }}>
                                        <div className="col-xl-4 col-lg-6">
                                            <div className="campaign-box bg-info-transparent" style={{ justifyContent: 'flex-start' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                    <h6 style={{ fontWeight: "300" }} >Requirement</h6>
                                                    {/* <h2 style={{fontWeight:"300"}}>{data?.Customer[0]?.totalSales || 0}</h2> */}
                                                    <h6 style={{ fontWeight: "300" }}>{data?.LeadFor?.name}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-lg-6">
                                            <div className="campaign-box bg-success-transparent" style={{ justifyContent: 'flex-start' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '22px' }}>
                                                    <h6 style={{ fontWeight: "300" }}>Service</h6>
                                                    {/* <h2>{data?.Customer[0]?.totalAmount || 0}</h2> */}
                                                    <h6 style={{ fontWeight: "300" }}>{data?.Service?.name}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-lg-6">
                                            <div className="campaign-box bg-danger-transparent" style={{ justifyContent: 'flex-start' }}>
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                                        <h6 style={{ fontWeight: "300" }}>Projection</h6>
                                                        <h6 style={{ fontWeight: "300" }}>{data?.Customer[0]?.totalDue || 0}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-xl-2 col-lg-8">
                                        <div className="campaign-box bg-warning-light" style={{ justifyContent: 'flex-start' }}>

                                            <div>
                                                <h6>Total Discount</h6>
                                                <h2>{data?.Customer[0]?.totalDiscount || 0}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xl-2 col-lg-8">
                                        <div className="campaign-box bg-success-light" style={{ justifyContent: 'flex-start' }}>

                                            <div>
                                                <h6>Total Paid</h6>
                                                <h2>{data?.Customer[0]?.totalPaid || 0}</h2>
                                            </div>
                                        </div>
                                    </div> */}
                                    </div>
                                </div>
                            </div>
                        }
                        {/* <div className="col-md-12">
                            <div className="row"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-evenly",
                                    alignItems: "center"
                                }}>
                                <div className="col-xl-2 col-lg-8">
                                    <div className="campaign-box bg-warning-light" style={{ justifyContent: 'flex-start' }}>
                                        <div>
                                            <h6>Total Amount</h6>
                                            <h2>{data?.Customer[0]?.totalAmount || 0}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-8">
                                    <div className="campaign-box bg-warning-light" style={{ justifyContent: 'flex-start' }}>
                                        <div>
                                            <h6>Total Amount</h6>
                                            <h2>{data?.Customer[0]?.totalAmount || 0}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-8">
                                    <div className="campaign-box bg-danger-light" style={{ justifyContent: 'flex-start' }}>
                                        
                                        <div>
                                            <div>
                                                <h6>Total Due</h6>
                                                <h2>{data?.Customer[0]?.totalDue || 0}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-8">
                                    <div className="campaign-box bg-warning-light" style={{ justifyContent: 'flex-start' }}>
                                       
                                        <div>
                                            <h6>Total Amount</h6>
                                            <h2>{data?.Customer[0]?.totalAmount || 0}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-2 col-lg-8">
                                    <div className="campaign-box bg-success-light" style={{ justifyContent: 'flex-start' }}>
                                       
                                        <div>
                                            <h6>Total Paid</h6>
                                            <h2>{data?.Customer[0]?.totalPaid || 0}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* <div className="col-md-12">
                            <div className="contact-wrap">
                                <div className="pipeline-list">
                                    <ul>
                                        {stageOptions.map((stage, index) => (
                                            <li key={stage?.value} data-bs-toggle="modal" data-bs-target="#stage_update" style={{ cursor: 'pointer' }}>
                                                <Link
                                                    to="#"
                                                    className={
                                                        latestStage && latestStage?.stageId === stage?.value
                                                            ? "bg-pending"
                                                            : stageColors[index % stageColors.length] // Assign different colors
                                                    }
                                                >
                                                    {stage?.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div> */}



                        {/* <div className="col-md-12">
                            <div className="contact-wrap">
                                <div className="pipeline-list">
                                    <ul>
                                        {stageOptions.map((stage) => (
                                            <li key={stage?.value} data-bs-toggle="modal" data-bs-target="#stage_update" style={{ cursor: 'pointer' }}>
                                                <Link
                                                    to="#"
                                                    className={
                                                        latestStage && latestStage?.stageId === stage?.value
                                                            ? stageColors[stage?.value] || "bg-default" // Highlight the current stage
                                                            : ""
                                                    }
                                                >
                                                    {stage?.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div> */}
                        {Array.isArray(data?.Customer) && (data?.Customer.length === 0 || data?.Customer == 'null') &&
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
                        }

                        {Array.isArray(data?.Customer) && data?.Customer.length > 0 &&
                            <div className="col-md-12">
                                <div className="contact-wrap">
                                    <div className="row"
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "start",
                                            alignItems: "center"
                                        }}>
                                        <div className="col-xl-2 col-lg-8">
                                            <div className="campaign-box bg-info-transparent" style={{ justifyContent: 'flex-start' }}>
                                                <div>
                                                    <h6 style={{ fontWeight: "300" }} >Total Sales</h6>
                                                    <h6 style={{ fontWeight: "300" }}>{data?.Customer[0]?.totalSales || 0}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-2 col-lg-8">
                                            <div className="campaign-box bg-success-transparent" style={{ justifyContent: 'flex-start' }}>
                                                <div>
                                                    <h6 style={{ fontWeight: "300" }}>Total Amount</h6>
                                                    <h6 style={{ fontWeight: "300" }}>{data?.Customer[0]?.totalAmount || 0}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-2 col-lg-8">
                                            <div className="campaign-box bg-danger-transparent" style={{ justifyContent: 'flex-start' }}>

                                                <div>
                                                    <div>
                                                        <h6 style={{ fontWeight: "300" }}>Total Due</h6>
                                                        <h6 style={{ fontWeight: "300" }}>{data?.Customer[0]?.totalDue || 0}</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-2 col-lg-8">
                                            <div className="campaign-box bg-warning-light" style={{ justifyContent: 'flex-start' }}>

                                                <div>
                                                    <h6 style={{ fontWeight: "300" }}>Total Discount</h6>
                                                    <h6 style={{ fontWeight: "300" }}>{data?.Customer[0]?.totalDiscount || 0}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-2 col-lg-8">
                                            <div className="campaign-box bg-success-light" style={{ justifyContent: 'flex-start' }}>
                                                <div>
                                                    <h6 style={{ fontWeight: "300" }}>Total Paid</h6>
                                                    <h6 style={{ fontWeight: "300" }}>{data?.Customer[0]?.totalPaid || 0}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {/* <div style={{ cursor: "pointer", marginBottom: '0.2rem' }} onClick={handleOpen}>
                            <i class="fa-solid fa-right-to-bracket"></i>
                        </div> */}
                        <div
                            style={{ cursor: "pointer", marginBottom: "0.2rem" }}
                            onClick={handleOpen}
                        >
                            <i
                                className="fa-solid fa-right-to-bracket"
                                style={{
                                    transform: open ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.3s ease-in-out",
                                }}
                            ></i>
                            {"  "}<span>Lead Info</span>
                        </div>
                        {/* Lead Sidebar */}
                        {open &&
                            <LeadSidebar
                                data={data}
                                leadFollowupData={leadFollowupData}
                                setEditCompany={setEditCompany}
                                setCompanyDetails={setCompanyDetails}
                                leadForOpitons={leadForOpitons}
                            />
                        }
                        {/* /Lead Sidebar */}
                        {/* Lead Activities */}
                        {/* <LeadActivities /> */}

                        <LeadActivities
                            data={data}
                            leadFollowupData={leadFollowupData}
                            groupActivityByDate={groupActivityByDate}
                            meetingData={meetingData}
                            callData={callData}
                            commentData={commentData}
                            servicesData={servicesData}
                            fileData={fileData}
                            proposalData={proposalData}
                            setFollowUp={setFollowUp}
                            appointmentData={appointmentData}
                            counselorOptions={counselorOptions}
                            paymentHistoryData={paymentHistoryData}
                            onHandleServices={onHandleServices}
                            open={open}
                            fetchLeadDetails={handleRefresh}
                        />

                        {/* Lead Activities*/}
                    </div>
                </div>
            </div>
            {/* /Page Wrapper */}

            <AddProposal fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={data} />

            <AddDocuments fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={data} />

            <AddLeadPic fetchLeadFollowupData={handleRefresh} leadDetails={data} />

            <AddLeadOtherDetails fetchLeadFollowupData={handleRefresh} leadDetails={data} />

            <AddCallComment fetchLeadFollowupData={fetchLeadFollowupData} followUpId={followUpId} />

            <RescheduleCall fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={data} callData={callData} />

            <RescheduleMeeting fetchLeadFollowupData={fetchLeadFollowupData} leadDetails={data} />

            <RescheduleAppointment leadDetails={data} fetchLeadDetails={fetchLeadDetails} fetchLeadFollowupData={fetchLeadFollowupData} counselorOptions={counselorOptions} fetchStageHistoryData={fetchStageHistoryData} appointmentData={appointmentData} />

            <AddMeetingComment fetchLeadFollowupData={fetchLeadFollowupData} followUpId={followUpId} />

            <AddAppointmentComment fetchLeadFollowupData={handleRefresh} followUpId={followUpId} />

            <AddProposalComment fetchLeadFollowupData={fetchLeadFollowupData} followUpId={followUpId} />

            <CreateCall leadDetails={data} fetchLeadDetails={fetchLeadFollowupData} fetchStageHistoryData={fetchStageHistoryData} />

            <CreateMeeting leadDetails={data} fetchLeadDetails={fetchLeadFollowupData} />

            <CreateAppointment
                leadDetails={data}
                fetchLeadDetails={fetchLeadDetails}
                fetchLeadFollowupData={fetchLeadFollowupData}
                counselorOptions={counselorOptions}
                fetchStageHistoryData={fetchStageHistoryData}
                leadForOpitons={leadForOpitons}
            />

            <CreateComment leadDetails={data} fetchLeadDetails={fetchLeadFollowupData} />

            <CreateServices leadDetails={data} fetchLeadDetails={fetchLeadFollowupData} />

            <EditServices leadDetails={data} fetchLeadDetails={handleRefresh} serviceDetails={serviceDetails} />

            <ChangeStage leadForAssign={data} fetchLeadData={handleRefresh} followUpStage={stageHistoryOptions} />

            {/* <ChangeAppointmentStatus leadForAssign={data} fetchLeadData={handleRefresh} followUpStage={stageHistoryOptions} /> */}

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

            {leadDetails &&
                <EditLead
                    addLead={addLead}
                    togglePopup={togglePopup}
                    sourceOptions={sourceOptions}
                    industryOptions={leadForOpitons}
                    countryOptions={countryOptions}
                    categoryOptions={categoryOptions}
                    leadDetails={leadDetails}
                    onLeadDetails={() => { return }}
                    fetchLeadData={fetchLeadData}
                    setLeadDetails={setLeadDetails}
                />
            }

        </>
    );
};

export default LeadDetailsPage;
