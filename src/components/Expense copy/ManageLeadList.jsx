import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from "../Table/DataTable"
import moment from 'moment';
import DeleteData from '../DeleteData/DeleteData';
import { toast } from "react-toastify";
import axios from "axios";
import LeadPreview from './Lead Preview/LeadPreview';
import AssignTo from './AssignTo';
import ChangeStage from './ChangeStage';
import MultipleAssignTo from './MultipleAssignTo';
import { OverlayTrigger, Tooltip } from "react-bootstrap";


const ManageLeadList = ({
    data,
    onLeadDetails,
    togglePopup,
    fetchLeadData,
    manageColumns,
    pageSize,
    totalPages,
    leadForOpitons,
    serviceOpitons
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

    // console.log("leadDetails =>", leadDetails)

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


    const togglePopupTwo = () => {
        togglePopup((prev) => !prev);
    };
    const handleDelete = async () => {
        if (leadId) {
            try {
                const response = await axios.delete(`${apiUrl}/lead/delete-lead/${leadId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                })
                fetchLeadData()
                toast.success(response?.data?.message)
                setLeadId(null)
            } catch (error) {
                toast.error(error.message)
            }
        }
    }
    const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const handleFetchData = (page) => {
        fetchLeadData(page);
    }

    let columns = [
        {
            title: () => {
                return <div
                    data-bs-toggle="modal"
                    data-bs-target="#multiple_assigned_to"
                    style={{ cursor: 'pointer' }}
                >
                    {selectedRowKeys.length > 0 ? "🔂" : ''}
                </div>
            },
            dataIndex: "",
        },
        {
            title: "Expense Id",
            dataIndex: "expenseId",
            key: "expenseId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.expenseId}`}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{text}</li>
                    </ul>
                </Link >
            },
            sorter: (a, b) =>
                a.expenseId - b.expenseId,
        },
        {
            title: "Category",
            key: "expenseId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.expenseId}`}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    {/* <span className="company-img menu-list-icon ">
                        <i className="ti ti-user-up" />
                    </span> */}
                    <ul>
                        <li>{record?.VendorCategory?.name || ''}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Sub Category",
            key: "expenseId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.expenseId}`}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    {/* <span className="company-img menu-list-icon ">
                        <i className="ti ti-user-up" />
                    </span> */}
                    <ul>
                        <li>{record?.VendorSubCategory?.name || ''}</li>
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
            title: "Vendor Name",
            key: "expenseId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.expenseId}`}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <span className="company-img menu-list-icon ">
                        <i className="ti ti-user-up" />
                    </span>
                    <ul>
                        <li>{record?.Vendor?.vendorName.slice(0, 15) || ''}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Payable Amount",
            key: "expenseId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.expenseId}`}
                    className="table-avatar d-flex align-items-center">
                    <ul>
                        <li>{record?.payableAmount}</li>
                    </ul>
                </Link>
            }
        },
        {
            title: "GST",
            key: "expenseId",
            render: (text, record) => {
                return <div className="table-avatar d-flex align-items-center">
                    <ul>
                        <li>{record?.gst || 0}</li>
                    </ul>
                </div>
            }
        },
        {
            title: "Total Payable",
            key: "expenseId",
            render: (text, record) => {
                return <div className="table-avatar d-flex align-items-center">
                    <ul>
                        <li>{record?.totalPayable}</li>
                    </ul>
                </div>
            }
        },
        {
            title: "Files",
            key: "vendorId",
            render: (text, record) => {
                return <Link to={`${record?.uploadBillsUrl}`} className="table-avatar d-flex align-items-center">
                    <span className="company-img menu-list-icon ">
                        <i className="ti ti-file" />
                    </span>
                </Link>
            }
        },
        {
            title: "Created By",
            dataIndex: "owner",
            key: "ownerId",
            render: (text, record) => {
                return <div
                    className="table-avatar d-flex align-items-center"
                >
                    <div className="grid-footer d-flex justify-content-between">
                        <div className="users-group">
                            <ul>
                                <li>
                                    <Link to="#">
                                        {record?.ownerImg ?
                                            <span className="menu-list-icon ">
                                                <img src={record?.ownerImg} />
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
                        {record.owner}
                    </Link>
                </div>
            }
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => (
                <div className="dropdown table-action">
                    <Link
                        to="#"
                        className="action-icon "
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="fa fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                        <Link
                            className="dropdown-item"
                            to="#"
                            onClick={() => setLeadId(record?.leadId)}
                        >
                            <i class="ti ti-checks text-green"></i>
                            Payment
                        </Link>
                        <Link
                            className="dropdown-item"
                            to="#"
                            onClick={() => {
                                togglePopupTwo(true),
                                    onLeadDetails(record)
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
                            onClick={() => setLeadId(record?.leadId)}
                        >
                            <i className="ti ti-trash text-danger"></i> Delete
                        </Link>

                        {/* <Link
                            className="dropdown-item"
                            to="#"
                            onClick={() => handleClone(record?.leadId)}
                        >
                            <i className="ti ti-clipboard-copy text-blue-light" /> clone
                        </Link> */}
                    </div>
                </div>
            ),
        },
    ];

    const modifiedColumns = columns.filter((column, index) => {
        if (index == 0) {
            return column
        }
        for (const ele in manageColumns) {
            if (column.title == ele && manageColumns[ele] == true) {
                return column
            }
        }
    })

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
            <DeleteData title="Lead" onDeleteHandler={handleDelete} />

            {/* {leadPreview && */}

            <LeadPreview
                leadPreview={leadPreview}
                setLeadPreview={setLeadPreview}
                leadDetails={leadDetails}
                setLeadDetails={setLeadDetails}
            />
            {/* } */}


            <AssignTo
                leadForAssign={leadForAssign}
                fetchLeadData={fetchLeadData}
            />

            <ChangeStage
                leadForAssign={leadForAssign}
                fetchLeadData={fetchLeadData}
            />

            <MultipleAssignTo
                selectedRowKeys={selectedRowKeys}
                fetchLeadData={fetchLeadData}
                setSelectedRowKeys={setSelectedRowKeys}
            />
            {data?.length > 0 && (
                <span className="badge border border-dark text-dark">
                    50/Page
                </span>
            )}

        </>
    )
}

export default ManageLeadList