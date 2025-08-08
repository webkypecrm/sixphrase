import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../Table/DataTable';

const ManageAttendanceLog = ({ data, pageSize, totalPages }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);


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

        return date.toLocaleString("en-IN", options);
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
            title: 'Staff Name',
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
                        {record?.Staff?.name}
                        <span>id : {record?.Staff?.staffId}</span>
                    </Link>
                </Link>
            ),
            sorter: (a, b) => a.Staff.name.localeCompare(b.Staff.name),
        },
        {
            title: "Date",
            key: "id",
            align: "center",
            // sorter: (a, b) =>
            //     a.source.length - b.source.length,
            render: (text, record) => {
                return <Link to={`/sales/leads-details/${record?.leadId}`}
                    // className="table-avatar d-flex align-items-center"
                    className="table-avatar d-flex align-items-center justify-content-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{getDate(record?.loginDateTime)}</li>
                    </ul>
                </Link >
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
                        <li>{convertToIndianFormat(record?.loginDateTime)}</li>
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
        //             }
        //         },
        // {
        //     title: "Status",
        //     dataIndex: "status",
        //     key: 'id',
        //     render: (text, record) => (
        //         <Link>
        //             <span className="badge bg-outline-dark text-dark" >
        //                 {record?.status}
        //             </span>
        //         </Link>
        //     ),
        //     // sorter: (a, b) =>
        //     //     a.status - b.status,
        // },
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
        </>
    )
}


export default ManageAttendanceLog