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
    setCustomerInfo
}) => {
    // const [leadId, setLeadId] = useState(null)
    // const apiUrl = import.meta.env.VITE_API_URL;
    // const Token = localStorage.getItem('token') || '';
    // const [addInvoice, setAddInvoice] = useState(false);
    // const [addPayment, setAddPayment] = useState(false);
    // const [customerDetails, setCustomerDetails] = useState(null);
    // const [invoiceData, setInvoiceDate] = useState({});

    const route = all_routes;

    // console.log("customerDetails in Manage Customer List=>", customerDetails)


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
            key: "customerId",
            // render: (text, record, index) => (
            //     <div
            //         className={`set-star rating-select ${stars[index] ? "filled" : ""}`}
            //         onClick={() => handleStarToggle(index)}
            //         key={index}
            //     >
            //         {/* <i className="fa fa-star"></i> */}
            //     </div>
            // ),
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
                            // alt={text}
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
            title: "Source",
            dataIndex: "source",
            key: "source",
            // sorter: (a, b) =>
            //     a.company_name.length - b.company_name.length,

        },
        {
            title: "Country",
            dataIndex: "country",
            // sorter: (a, b) =>
            //     a.location.length - b.location.length,
        },
        {
            title: "City",
            dataIndex: "leadCity",
            render: (text, record) => <div>
                {record?.leadCity}
            </div>,
            // sorter: (a, b) =>
            //     a.location.length - b.location.length,
        },
        {
            title: "Owner",
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
            // sorter: (a, b) => a.owner.length - b.owner.length,
        },
        {
            title: "Assigned Staff",
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
            // sorter: (a, b) => a.owner.length - b.owner.length,
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
            title: "Created Date",
            dataIndex: "createdAt",
            key: "createdAt",
            // sorter: (a, b) =>
            //     a.company_name.length - b.company_name.length,
            render: (text) => {
                return moment(text).format("DD MMM YYYY, hh:mm a")
            },
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
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
        {
            title: "Status",
            dataIndex: "status",
            key: "customerId",
            render: (text, index) => (
                <div key={index}>
                    {text === "active" && (
                        <span className="badge badge-pill badge-status bg-success">{text}</span>
                    )}
                    {text === "inactive" && (
                        <span className="badge badge-pill badge-status bg-danger">{text}</span>
                    )}
                </div>),
            sorter: (a, b) => a.owner.length - b.owner.length,

        },

    ];

    // const modifiedColumns = columns.filter((column, index) => {
    //     if (index == 0) {
    //         return column
    //     }

    //     for (const ele in manageColumns) {
    //         if (column.title == ele && manageColumns[ele] == true) {
    //             return column
    //         }
    //     }
    // })

    // console.log('data in LeadList =>', data)

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
            {/* <DeleteData title="Customer" onDeleteHandler={handleDelete} />

            <AddInvoice
                activityToggle={addInvoice}
                setActivityToggle={setAddInvoice}
                handleRefresh={() => <Navigate to={route.invoice} />}
                customerDetails={customerDetails}
            /> */}

            {/* {customerDetails?.customerId &&
                <Payment
                    data={invoiceData}
                    customerDetails={customerDetails}
                    handleRefresh={onCustomerDetails}
                    addPayment={addPayment}
                    setAddPayment={setAddPayment}
                    setCustomerDetails={setCustomerDetails}
                    fetchLeadDetails={()=>{console.log("fetchLeadDetails")}}
                />
            } */}

            {/* <Modal id="installment_payment">
                <Installment data={invoiceData} handleRefresh={onCustomerDetails} />
            </Modal> */}

            {data?.length > 0 && (
                <span className="badge border border-dark text-dark">
                    50/Page
                </span>
            )}


        </>
    )
}

export default ManageCustomerList