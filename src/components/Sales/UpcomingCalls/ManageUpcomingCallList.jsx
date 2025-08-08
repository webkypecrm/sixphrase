import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import DataTable from '../../Table/DataTable';

const ManageUpcomingCallList = ({ data, pageSize, totalPages, leadForOpitons }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);


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
            title: "LID",
            dataIndex: "leadId",
            key: "leadId",
            render: (text, record) => {
                return <Link to={`/sales/leads-details/${record?.leadId}`}
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
            title: "Call Scheduled on",
            dataIndex: "callDateTime",
            key: "id",
            sorter: (a, b) =>
                new Date(a.callDateTime) - new Date(b.callDateTime),
            // render: (text) => {
            //     return moment(text).format("DD MMM YYYY, hh:mm a")
            // },
            render: (text, record) => {
                return <Link to={`/sales/leads-details/${record?.leadId}`}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{getDate(record?.callDateTime)}{" "}{getTime(record?.callDateTime)}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Created on",
            key: "id",
            sorter: (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt),
            // render: (text) => {
            //     return moment(text).format("DD MMM YYYY, hh:mm a")
            // },
            render: (text, record) => {
                return <Link to={`/sales/leads-details/${record?.leadId}`}
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
                return <Link to={`/sales/leads-details/${record?.leadId}`}
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
                return <Link to={`/sales/leads-details/${record?.leadId}`}
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
            title: "Assigned To",
            // dataIndex: "leadId",
            key: "leadId",
            render: (text, record) => {
                return <Link to={`/sales/leads-details/${record?.Staff?.name}`}
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
        {
            title: "Last Comment",
            dataIndex: "leadId",
            key: "leadId",
            render: (text, record) => {
                return (
                    <Link to={`/sales/leads-details/${record?.leadId}`} className="table-avatar d-flex align-items-center">
                        {/* <span className="company-img menu-list-icon "> */}
                        <span className="company-img menu-list-icon" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <span>{record?.FollowUp?.length || 1}</span>
                            <i className="fa-regular fa-message fa-sm"></i>
                        </span>
                        <ul>
                            <li>{record?.lastCallSummary.slice(0, 12) || record?.lastCallSummary.slice(0, 15)}{"..."}</li>
                        </ul>
                    </Link>
                );
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: 'id',
            render: (text, record) => (
                <Link>
                    <span className="badge bg-outline-dark text-dark" >
                        {record?.status}
                    </span>
                </Link>
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
        </>
    )
}


export default ManageUpcomingCallList