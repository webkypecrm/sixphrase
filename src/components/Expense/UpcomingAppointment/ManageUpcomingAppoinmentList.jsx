import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import DataTable from '../../Table/DataTable';
import RescheduleAppointment from '../LeadDetails/RescheduleAppointment';
import axios from "axios";
import AddAppointmentComment from '../LeadDetails/AddAppointmentComment';

const ManageUpcomingAppoinmentList = ({
    data,
    pageSize,
    totalPages,
    leadForOpitons,
    handleRefresh,
    counselorOptions
}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const staffType = localStorage.getItem('type') || '';
    const staffId = localStorage.getItem('staffId') || '';
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [leadDetails, setLeadDetails] = useState(null);
    const [appointmentData, setApppintmentData] = useState([]);
    const [followUpId, setFollowUp] = useState('');


    // console.log("leadDetails =>", leadDetails)

    function getDate(value) {
        const isoDateString = value;
        const date = new Date(isoDateString);
        // Format date into "DD MMM YYYY"
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }

    // function getTime(value) {
    //     const isoDateString = value;
    //     const date = new Date(isoDateString);
    //     // Get hours, minutes, and determine AM/PM
    //     let hours = date.getHours();
    //     const minutes = String(date.getMinutes()).padStart(2, '0');
    //     const ampm = hours >= 12 ? 'pm' : 'am';
    //     // Convert to 12-hour format
    //     hours = hours % 12;
    //     hours = hours ? hours : 12; // the hour '0' should be '12'

    //     const formattedTime = `${hours}:${minutes} ${ampm}`;
    //     return formattedTime;
    // }

    function getTime(value) {
        const [hours, minutes] = value.split(":").map(Number); // Split and convert to numbers
        const ampm = hours >= 12 ? "pm" : "am";
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format (0 → 12)

        return `${formattedHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
    }


    let columns = [
        // {
        //     title: () => {
        //         return <div
        //             data-bs-toggle="modal"
        //             data-bs-target="#multiple_assigned_to"
        //             style={{ cursor: 'pointer' }}
        //         >
        //             {selectedRowKeys.length > 0 ? "🔂" : ''}
        //         </div>
        //     },
        //     dataIndex: "",
        // },
        {
            title: "Lead Id",
            dataIndex: "leadId",
            key: "leadId",
            render: (text, record) => {
                return <Link to={record?.lead?.assignedTo == staffId || staffType == '1' ? `/sales/leads-details/${record?.leadId}` : '#'}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{text}</li>
                    </ul>
                </Link >
            },
            sorter: (a, b) =>
                a.leadId - b.leadId,
        },
        {
            title: "Appointment Date&Time",
            key: "id",
            sorter: (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt),
            // render: (text) => {
            //     return moment(text).format("DD MMM YYYY, hh:mm a")
            // },
            render: (text, record) => {
                return <Link to={record?.lead?.assignedTo == staffId || staffType == '1' ? `/sales/leads-details/${record?.leadId}` : '#'}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{getDate(record?.meetingDate)}{" "}{getTime(record?.meetingTime)}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Created Date&Time",
            key: "id",
            sorter: (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt),
            // render: (text) => {
            //     return moment(text).format("DD MMM YYYY, hh:mm a")
            // },
            render: (text, record) => {
                return <Link to={record?.lead?.assignedTo == staffId || staffType == '1' ? `/sales/leads-details/${record?.leadId}` : '#'}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{getDate(record?.createdAt)}{" "}{getTime(record?.createdAt)}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
            sorter: (a, b) =>
                a.source.length - b.source.length,
            render: (text, record) => {
                return <Link to={record?.lead?.assignedTo == staffId || staffType == '1' ? `/sales/leads-details/${record?.leadId}` : '#'}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{record?.lead?.source?.name}</li>
                    </ul>
                </Link >
            }
        },

        {
            title: "Lead Name",
            dataIndex: "leadId",
            key: "leadId",
            render: (text, record) => {
                return <Link to={record?.lead?.assignedTo == staffId || staffType == '1' ? `/sales/leads-details/${record?.leadId}` : '#'}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <span className="company-img menu-list-icon ">
                        <i className="ti ti-user-up" />
                    </span>
                    <ul>
                        <li>{record?.lead?.leadName.slice(0, 15)}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Assinged To",
            // dataIndex: "leadId",
            key: "leadId",
            render: (text, record) => {
                return <Link to={record?.lead?.assignedTo == staffId || staffType == '1' ? `/sales/leads-details/${record?.leadId}` : '#'}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <span className="company-img menu-list-icon ">
                        <i className="ti ti-user-up" />
                    </span>
                    <ul>
                        <li>{record?.lead?.staff?.name.slice(0, 15)}</li>
                    </ul>
                </Link >
            }
        },
        // {
        //     title: "Last Comment",
        //     dataIndex: "leadId",
        //     key: "leadId",
        //     render: (text, record) => {
        //         return (
        //             <Link to={`/sales/leads-details/${record?.leadId}`} className="table-avatar d-flex align-items-center">
        //                 {/* <span className="company-img menu-list-icon "> */}
        //                 <span className="company-img menu-list-icon" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        //                     <span>{record?.FollowUp?.length || 1}</span>
        //                     <i className="fa-regular fa-message fa-sm"></i>
        //                 </span>
        //                 <ul>
        //                     <li>{record?.comment.slice(0, 12) || record?.comment.slice(0, 15)}{"..."}</li>
        //                 </ul>
        //             </Link>
        //         );
        //     }
        // },
        // {
        //     title: "Lead Email",
        //     dataIndex: "leadId",
        //     key: "leadId",
        //     render: (text, record) => {
        //         return <Link to={`/sales/leads-details/${record?.leadId}`}
        //             className="table-avatar d-flex align-items-center">
        //             <span className="company-img menu-list-icon " style={{ color: '#e9e9f' }}>
        //                 <i className="ti ti-mail" />
        //             </span>
        //             <ul>
        //                 <li>{record?.lead?.leadEmail}</li>
        //             </ul>
        //         </Link>
        //     }
        // },
        {
            title: "Lead Mobile1",
            dataIndex: "mobile1",
            key: "mobile1",
            render: (text, record) => {
                return <div className="table-avatar d-flex align-items-center">
                    <span className="company-img menu-list-icon" >
                        <i className="ti ti-phone" />
                    </span>
                    <ul>
                        <li>{record?.lead?.leadMobile1}</li>
                    </ul>
                </div>
            }
        },
        {
            title: "Lead For",
            dataIndex: "leadFor",
            key: "leadFor",
            render: (text, record) => {
                return <ul>
                    {record?.leadFor.map((val, index) => {
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
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: 'id',
            render: (text, record) => (
                <>
                    <Link>
                        <span
                            className="badge bg-outline-dark text-dark" style={{ cursor: 'none' }}>
                            {record?.status}
                        </span>
                    </Link>
                    {record?.status !== 'Done' && record?.status !== 'Cancelled' && record?.lead?.assignedTo == staffId &&
                        <ul style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <li
                                data-bs-toggle="modal"
                                data-bs-target="#create_appointment_comment"
                                // className="dropdown-toggle bg-pending"
                                aria-expanded="false"
                                onClick={() => {
                                    setFollowUp(record?.id)
                                }}
                                style={{ cursor: 'pointer' }}
                            ><i class="fa-solid fa-square-check"></i></li>
                            <li
                                data-bs-toggle={record?.status === 'Done' ? '' : 'modal'}
                                data-bs-target="#reschedule_appointment"
                                // className="dropdown-toggle"
                                aria-expanded="false"
                                onClick={() => {
                                    setLeadDetails(record?.lead ?? {}); // Ensures fallback to an empty object if lead is undefined
                                    setApppintmentData([record]); // No need for an arrow function
                                }}
                                style={{ cursor: 'pointer' }}
                            ><i class="fa-solid fa-calendar"></i></li>
                        </ul>
                    }

                </>
            ),
            // sorter: (a, b) =>
            //     a.status - b.status,
        },

    ];

    const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleFetchData = (page) => {
        // fetchLeadData(page);
    }


    return (
        <>
            <div className="table-responsive custom-table">
                <DataTable
                    dataSource={data}
                    columns={columns}
                    onSelectionChange={handleSelectedRowKeysChange}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    onFetchRecord={handleFetchData}
                    disableSelection={true}
                />
            </div>
            <div className="row align-items-center">
                <div className="col-md-6">
                    <div className="datatable-length" />
                </div>
                <div className="col-md-6">
                    <div className="datatable-paginate" />
                </div>
            </div>

            <RescheduleAppointment
                leadDetails={leadDetails}
                fetchLeadDetails={handleRefresh}
                fetchLeadFollowupData={handleRefresh}
                counselorOptions={counselorOptions}
                fetchStageHistoryData={() => { return }}
                appointmentData={appointmentData}
            />


            <AddAppointmentComment
                fetchLeadFollowupData={handleRefresh}
                followUpId={followUpId}
            />


        </>
    )
}


export default ManageUpcomingAppoinmentList