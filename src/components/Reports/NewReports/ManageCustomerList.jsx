import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { all_routes } from '../../../pages/Router/all_routes';
import DataTable from '../../Table/DataTable'


const ManageCustomerList = ({
    data,
    togglePopupTwo,
    fetchCustomerData,
    leadForOpitons,
    manageColumns,
    pageSize,
    totalPages,
    onCustomerDetails,
    // setCustomerInfo
}) => {
    const route = all_routes;

    const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
        return
    };

    const handleFetchData = (page) => {
        fetchCustomerData(page);
    }

    const columns = [
        {
            title: "Customer Id",
            dataIndex: "customerId",
            key: "customerId"
        },
        {
            title: "Customer Name",
            dataIndex: "customerName",
            key: "customerId",
            render: (text, record, index) => (
                <div className="table-avatar d-flex align-items-center" key={index}>
                    {record.customerPic ?
                        <Link to={`/sales/leads-details/${record?.convertedLeadId}`} className="avatar">
                            <img
                                className="avatar-img"
                                src={record?.customerPicUrl}
                            />
                        </Link>
                        :
                        <Link className="company-img">
                            <span className="menu-list-icon ">
                                <i className="ti ti-user" />
                            </span>
                        </Link>
                    }
                    <Link
                        to={`/sales/leads-details/${record?.convertedLeadId}`}
                        className="profile-split d-flex flex-column"
                    >
                        {record.customerName} <span>Id: {record.customerId}</span>
                    </Link>
                </div>
            ),
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => {
                return moment(text).format("DD MMM YYYY, hh:mm a")
            },
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source"
        },
        {
            title: "Email",
            dataIndex: "customerEmail",
            key: "id"
        },
        {
            title: "Mobile",
            dataIndex: "customerMobile1",
            key: "id"
        },
        {
            title: "City",
            dataIndex: "leadCity",
            render: (text, record) => <div>
                {record?.leadCity}
            </div>
        },
        {
            title: "Assigned By",
            dataIndex: "owner",
            key: "customerId",
            render: (text, record, index) => (
                <div className="table-avatar d-flex align-items-center" key={index}>
                    {record.ownerImg ?
                        <Link to={route.customerDetails} className="avatar">
                            <img
                                className="avatar-img"
                                src={record?.ownerImg}
                            // alt={text}
                            />
                        </Link>
                        :
                        <i className="ti ti-user" />
                    }
                    <Link
                        to={route.customerDetails}
                        className="profile-split d-flex flex-column"
                    >
                        {record.owner}
                    </Link>
                </div>
            ),
        },
        {
            title: "Assigned To",
            dataIndex: "assignedStaff",
            key: "customerId",
            render: (text, record, index) => (
                <div className="table-avatar d-flex align-items-center" key={index}>
                    {record.assignedStaffImg ?
                        <Link to={route.customerDetails} className="avatar">
                            <img
                                className="avatar-img"
                                src={record?.assignedStaffImgUrl}
                            // alt={text}
                            />
                        </Link>
                        :
                        <i className="ti ti-user" />
                    }
                    <Link
                        to={route.customerDetails}
                        className="profile-split d-flex flex-column"
                    >
                        {record.assignedStaff}
                    </Link>
                </div>
            ),
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
            title: "Services",
            key: "id",
            render: (text, record) => {
                let services = record?.services;

                // Check if services is a string, then parse it
                if (typeof services === "string") {
                    try {
                        services = JSON.parse(services);
                    } catch (error) {
                        console.error("Error parsing services:", error);
                        services = []; // Default to empty array if JSON parsing fails
                    }
                }

                // Ensure it's an array before mapping
                if (!Array.isArray(services)) {
                    services = [];
                }

                return (
                    <ul>
                        {services.map((val, index) => (
                            <li key={index} style={{ marginTop: '2px' }}>
                                <p className="badge badge-tag badge-secondary">{val}</p>
                            </li>
                        ))}
                    </ul>
                );
            },
        },
        {
            title: "Total Appointment Done",
            dataIndex: "id",
            render: (text, record) => {
                return <div> {record?.totalAppointment ? record?.totalAppointment : 0} </div>
            },
            align: 'center'
        },
        {
            title: "Appointment Date",
            dataIndex: "id",
            render: (text, record) => {
                const meetingDate = record?.convertedFrom?.FollowUp?.[0]?.meetingDate || "";
                const meetingTime = record?.convertedFrom?.FollowUp?.[0]?.meetingTime || "";
                return <div>{meetingDate}{" "}{meetingTime}</div>;
            }
        },
        {
            title: "Appointment Status",
            dataIndex: "id",
            render: (text, record) => {
                return (
                    record?.convertedFrom?.FollowUp?.[0]?.status ?
                        <div className='badge bg-outline-dark text-dark'>
                            {record?.convertedFrom?.FollowUp?.[0]?.status ?
                                record?.convertedFrom?.FollowUp?.[0]?.status :
                                ''}
                        </div>
                        :
                        "")

            }
        },
        {
            title: "Total Invoice",
            dataIndex: "id",
            render: (text, record) => {
                return <div> {record?.totalIvoice ? record?.totalIvoice : 0} </div>
            }
        },
        {
            title: "Total Amount",
            dataIndex: "totalAmount",
            render: (text, record, index) => (
                <div>
                    {record?.totalAmount ? "₹" + record?.totalAmount : "₹0"}
                </div>
            ),
        },
        {
            title: "Total Paid",
            dataIndex: "totalPaid",
            render: (text, record, index) => (
                <div>
                    {record?.totalPaid ? "₹" + record?.totalPaid : "₹0"}
                </div>
            ),
        },
        {
            title: "Total Due",
            dataIndex: "totalDue",
            render: (text, record, index) => (
                <div>
                    {record?.totalDue ? "₹" + record?.totalDue : "₹0"}
                </div>
            ),
        },

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

export default ManageCustomerList