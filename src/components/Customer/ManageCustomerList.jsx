import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import DataTable from "../../components/Table/DataTable"
import moment from 'moment';
import DeleteData from '../DeleteData/DeleteData';
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { all_routes } from '../../pages/Router/all_routes';
import { render } from '@testing-library/react';
import AddInvoice from '../Finance/Invoice/AddInvoice';
import AddPayment from '../Finance/Invoice/AddPayment';
import Installment from '../Finance/Invoice/Installment';
import Modal from '../UI/Modal';
import Payment from './Payment';


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
    const [leadId, setLeadId] = useState(null)
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [addInvoice, setAddInvoice] = useState(false);
    const [addPayment, setAddPayment] = useState(false);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [invoiceData, setInvoiceDate] = useState({});

    const route = all_routes;

    // console.log("customerDetails in Manage Customer List=>", customerDetails)

    const handleDelete = async () => {
        if (leadId) {
            try {
                await axios.delete(`${apiUrl}/customer/delete-customer/${leadId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                })
                fetchCustomerData()
                toast.success('Customer deleted successfully!')
                setLeadId(null)
            } catch (error) {
                toast.error(error.message)
            }
        }
    }
    const handleClone = async (leadId) => {
        try {
            if (leadId) {
                try {
                    await axios.get(`${apiUrl}/customer/clone-customer/${leadId}`, {
                        headers: {
                            Authorization: `Bearer ${Token}`
                        }
                    })
                    fetchCustomerData()
                    toast.success('Customer cloned successfully!')
                } catch (error) {
                    toast.error(error.message)
                }
            }
        } catch (error) {

        }
    }
    const handleSelectedRowKeysChange = (newSelectedRowKeys) => {
        return
    };

    const handleFetchData = (page) => {
        fetchCustomerData(page);
    }

    const columns = [
        {
            title: "",
            dataIndex: "",
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
            title: "Customer Email",
            dataIndex: "customerEmail",
            key: "customerId",
            // sorter: (a, b) => a.email.length - b.email.length,
        },
        {
            title: "Customer Mobile1",
            dataIndex: "customerMobile1",
            key: "customerMobile1",
            sorter: (a, b) => a.customerMobile1 - b.customerMobile1,
        },
        {
            title: "Customer Mobile2",
            dataIndex: "customerMobile2",
            key: "customerMobile2",
            // sorter: (a, b) => a.phone.length - b.phone.length,
        },
        {
            title: "Customer Mobile3",
            dataIndex: "customerMobile3",
            key: "customerMobile3",
            // sorter: (a, b) => a.phone.length - b.phone.length,
        },
        {
            title: "Country",
            dataIndex: "country",
            // sorter: (a, b) =>
            //     a.location.length - b.location.length,
        },
        // {
        //     title: "State",
        //     dataIndex: "state",
        //     render: (text, record) => <div>
        //         {record?.state?.name}
        //     </div>,
        //     // sorter: (a, b) =>
        //     //     a.location.length - b.location.length,
        // },
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
            // sorter: (a, b) => a.owner.length - b.owner.length,
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
            // sorter: (a, b) => a.owner.length - b.owner.length,
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            // sorter: (a, b) =>
            //     a.company_name.length - b.company_name.length,

        },
        {
            title: "Source",
            dataIndex: "source",
            key: "source",
            // sorter: (a, b) =>
            //     a.company_name.length - b.company_name.length,

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
            title: "Rating",
            dataIndex: "rating",
            render: (text, record, index) => (
                <div className="set-star" key={index}>
                    <i className="fa fa-star filled me-2" />
                    {text}
                </div>
            ),
            sorter: (a, b) => a.rating.length - b.rating.length,
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
        {
            title: "Action",
            dataIndex: "action",
            key: "customerId",
            render: (index, record) => (
                <div className="dropdown table-action" key={index}>
                    <Link
                        to="#"
                        className="action-icon"
                        data-bs-toggle="dropdown"
                        aria-expanded="true"
                    >
                        <i className="fa fa-ellipsis-v"></i>
                    </Link>
                    <div
                        className="dropdown-menu dropdown-menu-right"
                        style={{
                            position: "absolute",
                            inset: "0px auto auto 0px",
                            margin: "0px",
                            transform: "translate3d(-99.3333px, 35.3333px, 0px)",
                        }}
                        data-popper-placement="bottom-start"
                    >
                        <Link
                            className="dropdown-item edit-popup"
                            onClick={() => {
                                togglePopupTwo();
                                setCustomerInfo(record);
                            }
                            }
                        >
                            <i className="ti ti-edit text-blue"></i> Edit
                        </Link>

                        <Link
                            className="dropdown-item"
                            onClick={() => {
                                setAddPayment(true)
                                setCustomerDetails(record)
                            }}
                        >
                            <i className="ti ti-checks text-green" /> Payment
                        </Link>
                        <Link
                            className="dropdown-item edit-popup"
                            to="#"
                            onClick={() => {
                                setAddInvoice(!addInvoice)
                                setCustomerDetails(() => ({
                                    ...record,
                                }))
                            }}
                        >
                            <i className="ti ti-plus text-blue"></i> Generate Invoice
                        </Link>
                        {/* <Link className="dropdown-item" to={`/invoice-details/${record.id}`}>
                            <i className="ti ti-clipboard-copy text-violet" /> View Invoice
                        </Link> */}
                        {/* <Link
                            className="dropdown-item"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#installment_payment"
                            onClick={() => { setInvoiceDate(record) }}
                        >
                            <i className="ti ti-file" /> Installment
                        </Link> */}
                        {/* <Link
                            className="dropdown-item"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_contact"
                        >
                            <i className="ti ti-trash text-danger"></i> Delete
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

    // console.log('data in LeadList =>', data)

    return (
        <>
            <div className="table-responsive custom-table">
                <DataTable
                    dataSource={data}
                    columns={modifiedColumns}
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
            <DeleteData title="Customer" onDeleteHandler={handleDelete} />

            <AddInvoice
                activityToggle={addInvoice}
                setActivityToggle={setAddInvoice}
                handleRefresh={() => <Navigate to={route.invoice} />}
                customerDetails={customerDetails}
            />

            {customerDetails?.customerId &&
                <Payment
                    data={invoiceData}
                    customerDetails={customerDetails}
                    handleRefresh={onCustomerDetails}
                    addPayment={addPayment}
                    setAddPayment={setAddPayment}
                    setCustomerDetails={setCustomerDetails}
                    fetchLeadDetails={()=>{console.log("fetchLeadDetails")}}
                />
            }

            {/* <Modal id="installment_payment">
                <Installment data={invoiceData} handleRefresh={onCustomerDetails} />
            </Modal> */}

            {data?.length > 0 && (
                <span className="badge border border-dark text-dark">
                    20/Page
                </span>
            )}


        </>
    )
}

export default ManageCustomerList