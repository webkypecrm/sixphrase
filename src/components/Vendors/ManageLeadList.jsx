import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from "../../components/Table/DataTable"
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
            title: "Vendor Id",
            dataIndex: "vendorId",
            key: "vendorId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.vendorId}`}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <ul>
                        <li>{text}</li>
                    </ul>
                </Link >
            },
            sorter: (a, b) =>
                a.vendorId - b.vendorId,
        },
        {
            title: "Category",
            key: "vendorId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.vendorId}`}
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
            key: "vendorId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.vendorId}`}
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
        // {
        //     title: "Source",
        //     dataIndex: "source",
        //     key: "source",
        //     sorter: (a, b) =>
        //         a.source.length - b.source.length,
        //     render: (text, record) => {
        //         return <Link to={`/sales/leads-details/${record?.leadId}`}
        //             className="table-avatar d-flex align-items-center"
        //             style={{ cursor: 'pointer' }}
        //         >
        //             <ul>
        //                 <li>{text}</li>
        //             </ul>
        //         </Link >
        //     }
        // },
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
            title: "Contact Person",
            key: "vendorId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.vendorId}`}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    <span className="company-img menu-list-icon ">
                        <i className="ti ti-user-up" />
                    </span>
                    <ul>
                        <li>{record?.contactName.slice(0, 15) || ''}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Contact Email",
            key: "vendorId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.vendorId}`}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    {/* <span className="company-img menu-list-icon ">
                        <i className="ti ti-user-up" />
                    </span> */}
                    <ul>
                        <li>{record?.contactEmail || ''}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Contact Mobile",
            key: "vendorId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.vendorId}`}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    {/* <span className="company-img menu-list-icon ">
                        <i className="ti ti-user-up" />
                    </span> */}
                    <ul>
                        <li>{record?.contactMobile1 || ''}</li>
                    </ul>
                </Link >
            }
        },
        {
            title: "Vendor Name",
            key: "vendorId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.vendorId}`}
                    className="table-avatar d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                >
                    {/* <span className="company-img menu-list-icon ">
                        <i className="ti ti-user-up" />
                    </span> */}
                    <ul>
                        <li>{record?.vendorName.slice(0, 15) || ''}</li>
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
        //             <OverlayTrigger
        //                 placement="right"
        //                 overlay={
        //                     (record?.FollowUp?.[0]?.comment || record?.description) ? (
        //                         <Tooltip id={`${record?.leadId}`}>
        //                             {record?.FollowUp?.[0]?.comment || record?.description}
        //                         </Tooltip>
        //                     ) : <></>
        //                 }
        //             >
        //                 <Link to={`/sales/leads-details/${record?.leadId}`} className="table-avatar d-flex align-items-center">
        //                     {/* <span className="company-img menu-list-icon "> */}
        //                     <span className="company-img menu-list-icon" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        //                         <span>{record?.FollowUp?.length || 1}</span>
        //                         <i className="fa-regular fa-message fa-sm"></i>
        //                     </span>
        //                     <ul>
        //                         <li>{record?.FollowUp?.[0]?.comment.slice(0, 12) || record?.description.slice(0, 15)}{"..."}</li>
        //                     </ul>
        //                 </Link>
        //             </OverlayTrigger>
        //         );
        //     }
        // },
        {
            title: "Vendor Email",
            dataIndex: "vendorId",
            key: "vendorId",
            render: (text, record) => {
                return <Link to={`/sales/vendor-details/${record?.vendorId}`}
                    className="table-avatar d-flex align-items-center">
                    <span className="company-img menu-list-icon " style={{ color: '#e9e9f' }}>
                        <i className="ti ti-mail" />
                    </span>
                    <ul>
                        <li>{record?.vendorEmail}</li>
                    </ul>
                </Link>
            }
        },
        {
            title: "Vendor Mobile",
            key: "vendorId",
            render: (text, record) => {
                return <div className="table-avatar d-flex align-items-center">
                    <span className="company-img menu-list-icon" >
                        <i className="ti ti-phone" />
                    </span>
                    <ul>
                        <li>{record?.vendorMobile1}</li>
                    </ul>
                </div>
            }
        },
        // {
        //     title: "Vendor Mobile2",
        //     key: "vendorId",
        //     render: (text, record) => {
        //         return <div className="table-avatar d-flex align-items-center">
        //             <span className="company-img menu-list-icon">
        //                 <i className="ti ti-phone" />
        //             </span>
        //             <ul>
        //                 <li>{record?.vendorMobile2}</li>
        //             </ul>
        //         </div>
        //     }
        // },
        // {
        //     title: "Vendor Mobile3",
        //     key: "vendorId",
        //     render: (text, record) => {
        //         return <div className="table-avatar d-flex align-items-center">
        //             <span className="company-img menu-list-icon ">
        //                 <i className="ti ti-phone" />
        //             </span>
        //             <ul>
        //                 <li>{record?.vendorMobile3}</li>
        //             </ul>
        //         </div>
        //     }
        // },
        // {
        //     title: "Company Name",
        //     key: "leadId",
        //     render: (text, record) => {
        //         return <ul>
        //             <li>
        //                 <p >
        //                     {record?.VendorCompany?.companyName || 'Individual'}
        //                 </p>
        //             </li>
        //         </ul>
        //     }
        // },
        // {
        //     title: "Industry",
        //     key: "leadId",
        //     render: (text, record) => {
        //         return <ul>
        //             <li>
        //                 <p className="badge badge-tag badge-secondary">
        //                     {record?.Category?.name || ''}
        //                 </p>
        //             </li>
        //         </ul>

        //     }
        // },
        // {
        //     title: "Requirement",
        //     dataIndex: "leadFor",
        //     key: "leadFor",
        //     render: (text, record) => {
        //         return <ul>
        //             {record?.leadFor.map((val, index) => {
        //                 const matchedOption = leadForOpitons.find(option => option.value === val);
        //                 return (
        //                     <li key={index}>
        //                         <p className="badge badge-tag badge-secondary">
        //                             {matchedOption ? matchedOption.label : val}
        //                         </p>
        //                     </li>
        //                 );
        //             })}
        //         </ul>
        //     }
        // },
        // {
        //     title: "Service",
        //     dataIndex: "Service",
        //     key: "service",
        //     render: (text, record) => {
        //         return <ul>
        //             <li>
        //                 <p className="badge badge-tag badge-secondary">
        //                     {record?.Service?.name || ''}
        //                 </p>
        //             </li>
        //         </ul>

        //     }
        // },
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
                        <li>{record?.country?.name || ''}</li>
                    </ul>
                </div>
            }
        },
        {
            title: "State",
            dataIndex: "State",
            key: "id",
            render: (text, record) => {
                return <div className="table-avatar d-flex align-items-center">
                    <span className="company-img menu-list-icon ">
                        <i className="ti ti-flag" />
                    </span>
                    <ul>
                        <li>{record?.state?.name || ''}</li>
                    </ul>
                </div>
            }
        },
        {
            title: "City",
            key: "leadId",
            render: (text, record) => {
                return <div className="table-avatar d-flex align-items-center">
                    <span className="company-img menu-list-icon ">
                        <i className="ti ti-flag" />
                    </span>
                    <ul>
                        <li>{record?.city?.name || ''}</li>
                    </ul>
                </div>
            }
        },
        // {
        //     title: "Category",
        //     dataIndex: "industry",
        //     key: "industry",
        // },
        // {
        //     title: "Tags",
        //     dataIndex: "tags",
        //     key: "tags",
        //     render: (text, record) => {
        //         return <ul>
        //             {text.map((val, index) => <li key={index} >
        //                 <p className="badge badge-tag badge-purple-light">
        //                     {val}
        //                 </p>
        //             </li>)}
        //         </ul>
        //     }
        // },
        // {
        //     title: "Value",
        //     dataIndex: "value",
        //     key: "value",
        //     render: (text) => {
        //         return <span>₹ {text}</span>
        //     }
        // },
        // {
        //     title: "Assigned By",
        //     dataIndex: "owner",
        //     key: "ownerId",
        //     render: (text, record) => {
        //         return <div
        //             className="table-avatar d-flex align-items-center"
        //         >
        //             <div className="grid-footer d-flex justify-content-between">
        //                 <div className="users-group">
        //                     <ul>
        //                         <li>
        //                             <Link to="#">
        //                                 {record?.ownerImg ?
        //                                     <span className="menu-list-icon ">
        //                                         <img src={record?.ownerImg} />
        //                                     </span>
        //                                     :
        //                                     <span className="menu-list-icon ">
        //                                         <i className="ion-person" />
        //                                     </span>
        //                                 }
        //                             </Link>
        //                         </li>
        //                     </ul>
        //                 </div>
        //             </div>
        //             <Link to="#" style={{ marginLeft: '2px' }} >
        //                 {record.owner}
        //             </Link>
        //         </div>
        //     }
        // },
        // {
        //     title: "Assigned To",
        //     dataIndex: "assignedTo",
        //     key: "assignedTo",
        //     render: (text, record) => {
        //         return <div
        //             className="table-avatar d-flex align-items-center"
        //             data-bs-toggle="modal"
        //             data-bs-target="#assigned_to"
        //             style={{ courser: 'pointer' }}
        //             onClick={() => { setLeadForAssign(record) }}
        //         >
        //             <div className="grid-footer d-flex justify-content-between">
        //                 <div className="users-group">
        //                     <ul>
        //                         <li>
        //                             <Link to="#">
        //                                 {record.staff.profilePic ?
        //                                     <span className="menu-list-icon ">
        //                                         <img src={record.staff.profilePic} />
        //                                     </span>
        //                                     :
        //                                     <span className="menu-list-icon ">
        //                                         <i className="ion-person" />
        //                                     </span>
        //                                 }
        //                             </Link>
        //                         </li>
        //                     </ul>
        //                 </div>
        //             </div>
        //             <Link to="#" style={{ marginLeft: '2px' }} >
        //                 {record.assignedTo}
        //             </Link>
        //         </div>
        //     }
        // },
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
                            onClick={() => {
                                togglePopupTwo(true),
                                    onLeadDetails(record)
                            }}
                        >
                            <i className="ti ti-edit text-blue" /> Edit
                        </Link>

                        {/* <Link
                            className="dropdown-item"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_contact"
                            onClick={() => setLeadId(record?.leadId)}
                        >
                            <i className="ti ti-trash text-danger"></i> Delete
                        </Link> */}

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