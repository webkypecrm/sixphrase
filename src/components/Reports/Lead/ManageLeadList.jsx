import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from "../../../components/Table/DataTable"
import moment from 'moment';
import { toast } from "react-toastify";
import axios from "axios";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ManageLeadList = ({
    data,
    onLeadDetails,
    togglePopup,
    fetchLeadData,
    manageColumns,
    pageSize,
    totalPages,
    leadForOptions
}) => {
    const [leadId, setLeadId] = useState(null)
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [leadPreview, setLeadPreview] = useState(false);
    const [leadDetails, setLeadDetails] = useState({});
    const [leadForAssign, setLeadForAssign] = useState({});
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
    const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const handleFetchData = (page) => {
        fetchLeadData(page);
    }

    // console.log("leadForOptions =>", leadForOptions)

    let columns = [
        {
            title: "Lead Id",
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
                        <li>{text}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt),
            render: (text) => {
                return moment(text).format("DD MMM YYYY, hh:mm a")
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
                        <li>{record?.leadName.slice(0, 15)}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Lead For",
            dataIndex: "leadFor",
            key: "leadFor",
            render: (text, record) => {
                return <ul>
                    {record?.leadFor.map((val, index) => {
                        const matchedOption = leadForOptions.find(option => option.value === val);
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
            title: "Country",
            dataIndex: "country",
            key: "country",
            render: (text, record) => {
                return <div className="table-avatar d-flex align-items-center">
                    <span className="company-img menu-list-icon ">
                        <i className="ti ti-flag" />
                    </span>
                    <ul>
                        <li>{record.country}</li>
                    </ul>
                </div>
            }
        },
        {
            title: "City",
            dataIndex: "leadCity",
            key: "leadCity",
            render: (text, record) => {
                return <div className="table-avatar d-flex align-items-center">
                    <span className="company-img menu-list-icon ">
                        <i className="ti ti-flag" />
                    </span>
                    <ul>
                        <li>{record?.leadCity}</li>
                    </ul>
                </div>
            }
        },
        {
            title: "Assign To",
            dataIndex: "assignedTo",
            key: "assignedTo",
            render: (text, record) => {
                return <div
                    className="table-avatar d-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#assigned_to"
                    style={{ courser: 'pointer' }}
                    onClick={() => { setLeadForAssign(record) }}
                >
                    <div className="grid-footer d-flex justify-content-between">
                        <div className="users-group">
                            <ul>
                                <li>
                                    <Link to="#">
                                        {record.staff.profilePic ?
                                            <span className="menu-list-icon ">
                                                <img src={record.staff.profilePic} />
                                            </span>
                                            :
                                            <span className="menu-list-icon ">
                                                <i className="ion-person" />
                                            </span>
                                        }
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link to="#" style={{ marginLeft: '2px' }} >
                        {record.assignedTo}
                    </Link>
                </div>
            }
        },
        {
            title: "Stage",
            dataIndex: "stage",
            key: 'stage',
            render: (text, record) => (
                <Link
                    data-bs-toggle="modal"
                    data-bs-target="#stage_update"
                    style={{ cursor: 'pointer', display: 'grid' }}
                    onClick={() => { setLeadForAssign(record) }}
                >
                    <span className="badge bg-outline-dark text-dark" >
                        {text}
                    </span>
                    {Array.isArray(record?.Customer) && record?.Customer.length > 0 && record?.Customer[0]?.createdAt &&
                        <span className="badge-day" style={{ fontSize: 'x-small', margin: '0', maxWidth: '7rem', }}>
                            {getDate(record?.Customer[0]?.createdAt)},{getTime(record?.Customer[0]?.createdAt)}
                        </span>
                    }

                </Link>
            ),
            sorter: true,
        }
    ];

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

            {data?.length > 0 && (
                <span className="badge border border-dark text-dark">
                    50/Page
                </span>
            )}

        </>
    )
}

export default ManageLeadList