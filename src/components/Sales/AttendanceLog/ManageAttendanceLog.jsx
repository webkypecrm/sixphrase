import React, { useState } from 'react';
import Select from "react-select";
import { Link } from 'react-router-dom';
import DataTable from '../../Table/DataTable';
import axios from "axios";
import { Flip, ToastContainer } from "react-toastify";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { all_routes } from "../../../pages/Router/all_routes.jsx";


const ManageAttendanceLog = ({ data, pageSize, totalPages, fetchUpcomintAppointmentData }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';

    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedFlag, setSelectedFlag] = useState('');
    const [remark, setRemark] = useState('');
    const [loading, setLoading] = useState(false);
    const [attendanceId, setAttendanceId] = useState(null);
    const [selectedRemark, setSelectedRemark] = useState('');

    const route = all_routes;


    
    const handleBadgeClick = (record) => {
        const rowId = record.id;
        setAttendanceId(rowId);
    };

    const handleSave = async () => {
        if (!selectedStatus) {
            ToastContainer('Please select a status.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/staff/attendance-status/${attendanceId}?status=${selectedStatus.label}&remark=${remark}`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });


            if (response.data.status === 'success') {
                const modalElement = document.getElementById('add_new_event');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                // if (modalInstance) {
                    modalInstance.hide();
                // }
                fetchUpcomintAppointmentData()

                ToastContainer('Attendance status updated successfully!');
                if (onSuccess) {
                    onSuccess(); // You can refresh list or close modal
                }
            }
        } catch (error) {
            console.error(error);
            ToastContainer('Something went wrong while updating attendance.');
        } finally {
            setLoading(false);
        }
    };


    const handleSaveFlag = async () => {
        if (!selectedFlag) {
            ToastContainer('Please select a status.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/staff/attendance-flag/${attendanceId}?timeFlag=${selectedFlag.label}`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });


            if (response.data.status === 'success') {
                const modalElement = document.getElementById('add_new_event');
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }

                fetchUpcomintAppointmentData()
                ToastContainer('Attendance status updated successfully!');
                if (onSuccess) {
                    onSuccess(); // You can refresh list or close modal
                }
            }
        } catch (error) {
            console.error(error);
            ToastContainer('Something went wrong while updating attendance.');
        } finally {
            setLoading(false);
        }
    };



    function getDate(value) {
        const isoDateString = value;
        const date = new Date(isoDateString);
        // Format date into "DD MMM YYYY"
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }

    function convertToIST(utcTimestamp) {
        const utcDate = new Date(utcTimestamp);

        // Convert to IST (UTC +5:30)
        const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));

        // Format time in 12-hour format with AM/PM
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            // second: 'numeric',
            hour12: true,
            timeZone: 'Asia/Kolkata'
        };

        return istDate.toLocaleString('en-IN', options)
    }

    // Example Usage
    // console.log(convertToIST("2025-03-05T07:15:31.556Z"));

    function convertToIndianFormat(utcTimestamp) {
        const date = new Date(utcTimestamp);

        // Convert to IST (Indian Standard Time)
        const options = {
            timeZone: "Asia/Kolkata",
            // day: "2-digit", 
            // month: "2-digit", 
            // year: "numeric", 
            hour: "2-digit",
            minute: "2-digit",
            // second: "2-digit", 
            hour12: true
        };

        // return date.toLocaleString("en-IN", options);

        // Format the time and convert AM/PM to uppercase
        const formattedTime = date.toLocaleString("en-IN", options);
        return formattedTime.replace(/am|pm/, (match) => match.toUpperCase());

    }

    // Example Usage
    const utcDate = "2025-03-05T13:31:08.770Z";
    console.log(convertToIndianFormat(utcDate));



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

    // function getTime(value) {
    //     const [hours, minutes] = value.split(":").map(Number); // Split and convert to numbers
    //     const ampm = hours >= 12 ? "pm" : "am";
    //     const formattedHours = hours % 12 || 12; // Convert to 12-hour format (0 → 12)

    //     return `${formattedHours}:${String(minutes).padStart(2, "0")} ${ampm}`;
    // }


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
            title: 'EID',
            key: 'staffId',
            align: "center",
            render: (text, record) => (
                <Link to="#"
                    // className="table-avatar d-flex align-items-center"
                    className="table-avatar d-flex align-items-center justify-content-center"
                >
                    <Link
                        to="#"
                        className="profile-split d-flex flex-column"
                    >
                        {record?.Staff?.staffId}
                        {/* <span>id : {record?.Staff?.staffId}</span> */}
                    </Link>
                </Link>
            ),
            sorter: (a, b) => a.Staff.name.localeCompare(b.Staff.name),
        },

        {
            title: 'Staff Name',
            key: 'staffId',
            align: "center",
            render: (text, record) => (
                <Link to="#"
                    // className="table-avatar d-flex align-items-center"
                    className="table-avatar d-flex align-items-center justify-content-center"
                >
                    <Link
                        to={`${route.staffmanage}/${record?.Staff?.staffId}`}
                        className="profile-split d-flex flex-column"
                    >
                        {record?.Staff?.name}
                        {/* <span>id : {record?.Staff?.staffId}</span> */}
                    </Link>
                </Link>
            ),
            sorter: (a, b) => a.Staff.name.localeCompare(b.Staff.name),
        },

        {
            title: " Login Date",
            key: "id",
            align: "center",
            // sorter: (a, b) =>
            //     a.source.length - b.source.length,
            sorter: (a, b) => {
                // Ensure loginDateTime exists before sorting
                const dateA = a.loginDateTime ? new Date(a.loginDateTime) : new Date(0);
                const dateB = b.loginDateTime ? new Date(b.loginDateTime) : new Date(0);
                return dateA - dateB;
            },
            render: (text, record) => {
                return <Link to={`/sales/leads-details/${record?.leadId}`}
                    // className="table-avatar d-flex align-items-center"
                    className="table-avatar d-flex align-items-center justify-content-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{record?.loginDate}</li>
                    </ul>
                </Link >



            }

        },

        // {
        //     title: "Login Day",
        //     dataIndex: "status",
        //     key: 'id',
        //     render: (text, record) => (
        //         <Link>
        //             <span className="badge bg-outline-dark text-dark" >
        //                 {/* {record?.status} */}
        //                 Monday
        //             </span>
        //         </Link>
        //     ),
        //     // sorter: (a, b) =>
        //     //     a.status - b.status,
        // },

        {
            title: "Login Day",
            dataIndex: "loginDateTime",
            key: "loginDay",
            render: (text, record) => {
                // Use dayjs to get weekday from loginDateTime (assumed to be ISO string or Date)
                const dayOfWeek = record?.createdAt
                    ? dayjs(record.createdAt).format('dddd')
                    : 'N/A';
        
                return (
                    <Link>
                        <span className="badge bg-outline-dark text-dark">
                            {dayOfWeek}
                        </span>
                    </Link>
                );
            }
        },
        {
            title: "Login Time",
            dataIndex: "loginDateTime",
            key: "id",
            align: "center",
            // sorter: (a, b) =>
            //     a.source.length - b.source.length,
            render: (text, record) => {
                return <Link
                    //  to={`/sales/leads-details/${record?.leadId}`}
                    // className="table-avatar d-flex align-items-center"
                    className="table-avatar d-flex align-items-center justify-content-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{record?.loginTime}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "logout Time",
            dataIndex: "logoutDateTime",
            key: "id",
            align: 'center',
            // sorter: (a, b) =>
            //     a.source.length - b.source.length,
            render: (text, record) => {
                return <Link
                    // to={`/sales/leads-details/${record?.leadId}`}
                    // className="table-avatar d-flex align-items-center"
                    className="table-avatar d-flex align-items-center justify-content-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{record?.logoutDateTime ? convertToIndianFormat(record?.logoutDateTime) : ''}</li>
                    </ul>
                </Link >
            }
        },

        // {
        //             title: "Assign To",
        //             dataIndex: "assignedTo",
        //             key: "assignedTo",
        //             render: (text, record) => {
        //                 return <div
        //                     className="table-avatar d-flex align-items-center"
        //                     // data-bs-toggle="modal"
        //                     // data-bs-target="#assigned_to"
        //                     // style={{ courser: 'pointer' }}
        //                     // onClick={() => { setLeadForAssign(record) }}
        //                 >
        //                     <p style={{ marginLeft: '2px' }} >
        //                         {record.staff.name}
        //                     </p>
        //                 </div>
        //             a
        //         },


        {
            title: "Location",
            dataIndex: "status",
            key: 'id',
            render: (text, record) => (
                <Link>
                    <span className="badge bg-outline-dark text-dark " >
                        {/* {record?.status} */}
                        India
                    </span>
                </Link>
            ),
            // sorter: (a, b) =>
            //     a.status - b.status,
        },

        {
            title: "IP Address",
            dataIndex: "ipAddress",
            key: 'id',
            render: (text, record) => (
                <Link>
                    <span className="badge bg-outline-dark text-dark" >
                        {record?.ipAddress}
                        {/* 122.22.22.333 */}
                    </span>
                </Link>
            ),
            // sorter: (a, b) =>
            //     a.status - b.status,
        },

        {
            title: "From",
            dataIndex: "status",
            key: 'id',
            render: (text, record) => {
                const ipAddress1 = record?.ipAddress;
                const ipAddress2 = "103.172.252.176";

                const condition = (ipAddress1 === ipAddress2) ? "WFO" : "WFH";
                // const badgeClass = condition === "WFO" ? "badge bg-success text-light" : "badge bg-outline-dark text-dark";
                const badgeClass = condition === "WFO" 
                ? "badge bg-success text-light"  // Green for WFO
                : "badge bg-primary text-light"; 

                return (
                    <Link>
                        <span className={badgeClass}>
                            {record.workPlace}
                        </span>
                    </Link>
                );
            },
            // sorter: (a, b) =>
            //     a.status - b.status,
        },

        {
            title: "Status",
            dataIndex: "status",
            key: 'id',
            render: (text, record) => (
                <Link
                    data-bs-toggle="modal"
                    data-bs-target="#add_new_event"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent default link behavior
                        handleBadgeClick(record);
                    }}>
                    {record?.status === 'Present' &&
                        <span className="badge bg-outline-dark text-dark bg-success m-1 " >
                            {record?.status}
                            {/* P */}
                        </span>
                    }
                    {record?.status === 'Absent' &&
                        <span className="badge bg-outline-dark text-dark bg-danger m-1 " >
                            {record?.status}
                            {/* A */}
                        </span>
                    }
                    {record?.status === 'Leave' &&
                        <span className="badge bg-outline-dark text-dark bg-warning m-1 " >
                            {record?.status}
                            {/* L */}
                        </span>
                    }
                    {record?.status !== 'Leave' && record?.status !== 'Present' && record?.status !== 'Absent' && (
                        <span className="badge bg-outline-dark text-dark bg-success m-1">
                            Present
                        </span>
                    )}

                    <Link
                        data-bs-toggle="modal"
                        data-bs-target="#view_remark_modal"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRemark(record?.remark);
                        }}
                    >
                        <i className="ti ti-eye"></i> {/* Eye Icon */}
                    </Link>
                    {/* <span> <i className='ti ti-eye '></i></span> */}
                </Link>


            ),
            // sorter: (a, b) =>
            //     a.status - b.status,
        },

        // {
        //     title: "Flag",
        //     dataIndex: "status",
        //     key: 'id',
        //     render: (text, record) => (  
        //         <Link>
        //             <span className="badge bg-outline-dark text-dark" >
        //                 {/* {record?.status} */}
        //                 On Time
        //             </span>
        //         </Link>
        //     ),
        //     // sorter: (a, b) =>
        //     //     a.status - b.status,
        // },

        {
            title: "Flag",
            dataIndex: "status",
            key: 'id',
            render: (text, record) => {
                const loginTime = record?.loginDateTime ? new Date(record.loginDateTime) : null;
        
                // Define the time thresholds
                const onTimeThreshold = new Date();
                onTimeThreshold.setHours(10, 30, 59); // 10:30:59 AM
        
                const lateThreshold = new Date();
                lateThreshold.setHours(14, 0, 0); // 2:00 PM
        
                // Determine the flag based on login time
                let flag = "Absent"; // Default to "Absent"
                let badgeClass = "badge ";
                let customStyle = { color: "white", backgroundColor: "red",};
        
                if (loginTime) {
                    if (loginTime <= onTimeThreshold) {
                        flag = "On Time";
                        badgeClass = "badge "; 
                        customStyle = { color: "white", backgroundColor: "green", };
                    } else if (loginTime > onTimeThreshold && loginTime < lateThreshold) {
                        flag = "Late";
                        badgeClass = "badge ";
                        customStyle = { color: "white", backgroundColor: "blue", };
                    } else if (loginTime >= lateThreshold) {
                        flag = "Half Day";
                        badgeClass = "badge "; 
                        customStyle = { color: "white", backgroundColor: "red",};
                    }
                }
        
                return (
                    <Link
                        data-bs-toggle="modal"
                        data-bs-target="#add_new_flag"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent default link behavior
                            handleBadgeClick(record);
                        }}
                    >
                        <span style={customStyle} className={badgeClass}>
                            {record.timeFlag} {/* Dynamically displaying the flag */}
                        </span>
                    </Link>
                );
            },
        },




        // {
        //     title: "Leave",
        //     dataIndex: "status",
        //     key: 'id',
        //     render: (text, record) => (
        //         <Link>

        //             <span className="badge bg-outline-dark text-dark " >
        //                 {/* {record?.status} */}
        //                 NA

        //             </span>
        //         </Link>

        //     ),
            // sorter: (a, b) =>
            //     a.status - b.status,
        // },
    ];


    const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleFetchData = (page) => {
        // fetchLeadData(page);
    }


    const options = [
        { value: 'success', label: 'Present' },
        { value: 'info', label: 'Absent' },
        { value: 'warning', label: 'Leave' }
    ]
    const flgOptions = [
        { label: 'On Time', value: 'On Time' },
        { label: 'Late', value: 'Late' },
        { label: 'Half Day', value: 'Half Day' },
        { label: 'Absent', value: 'Absent' }
    ]


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


            {/* modal for present, Absent, Leave */}
            <div className="modal custom-modal fade" id="add_new_event">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Update Status</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-hidden="true"
                            >
                                <span aria-hidden="true">x</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group mb-3">
                                    <label className="col-form-label">Change Status</label>
                                    <Select
                                        className="form-white"
                                        options={options}
                                        placeholder="Select..."
                                        classNamePrefix="react-select"
                                        value={selectedStatus}
                                        onChange={(selectedOption) => setSelectedStatus(selectedOption)}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="col-form-label">HR Remark</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter remark"
                                        rows="3"
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="submit-section">
                                    <button
                                        type="button"
                                        className="btn btn-primary save-category submit-btn"
                                        data-dismiss="modal"
                                        onClick={handleSave}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for View Remark */}
            <div className="modal custom-modal fade" id="view_remark_modal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">View HR Remark</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-hidden="true"
                            >
                                <span aria-hidden="true">x</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group mb-3">
                                <label className="col-form-label">Remark</label>
                                <div className="form-control" style={{ minHeight: '100px' }}>
                                    {selectedRemark || "No Remark Available"}
                                </div>
                            </div>
                            <div className="submit-section">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Modal for Update Status (Without Remark) */}
            <div className="modal custom-modal fade" id="add_new_flag">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Update Flag</h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-hidden="true"
                            >
                                <span aria-hidden="true">x</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group mb-3">
                                    <label className="col-form-label">Change Flag</label>
                                    <Select
                                        className="form-white"
                                        options={flgOptions}
                                        placeholder="Select..."
                                        classNamePrefix="react-select"
                                        value={selectedFlag}
                                        onChange={(selectedOption) => setSelectedFlag(selectedOption)}
                                    />
                                </div>

                                <div className="submit-section">
                                    <button
                                        type="button"
                                        className="btn btn-primary save-category submit-btn"
                                        data-bs-dismiss="modal"
                                        onClick={handleSaveFlag}
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}


export default ManageAttendanceLog