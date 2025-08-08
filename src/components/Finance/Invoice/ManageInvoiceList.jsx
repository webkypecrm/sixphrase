import React, { useState } from 'react';
import DataTable from '../../Table/DataTable';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../pages/Router/all_routes';
import { contactData } from "../../../data/contactData";
import Modal from '../../UI/Modal';
import AddPayment from './AddPayment';
import Installment from './Installment';
import Payment from '../../Customer/Payment';
import ChangeStatus from './ChangeStatus';


const ManageInvoiceList = ({ data, handleRefresh }) => {
    const [addPayment, setAddPayment] = useState(false);
    const [invoiceData, setInvoiceData] = useState(false);

    // console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa =>", data[0])

    function getDate(value) {
        const isoDateString = value;
        const date = new Date(isoDateString);
        // Format date into "DD MMM YYYY"
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }

    // console.log("invoiceData =>", invoiceData)

    const columns = [
        {
            title: "InvoiceID",
            dataIndex: "id",
            key: "id",
            render: (text, record) => (
                <h2 className="table-avatar d-flex align-items-center">
                    <Link
                        to={`/invoice-details/${record?.id}`}
                        className="profile-split d-flex flex-column"
                    >
                        {record?.id}
                    </Link>
                </h2>
            ),
        },
        {
            title: "Customer",
            key: "id",
            sorter: true,
            render: (text, record) => (
                <h2 className="table-avatar d-flex align-items-center">
                    <Link
                        to={`/invoice-details/${record.id}`}
                        className="profile-split d-flex flex-column"
                    >
                        {record?.Customer?.customerName}
                    </Link>
                </h2>
            ),
        },
        {
            title: "Created Date",
            dataIndex: "createdAt",
            key: "id",
            render: (text, record) => (
                <p className="table-avatar d-flex align-items-center">
                    {getDate(record?.createdAt)}
                </p>
            ),
        },
        {
            title: "Amount",
            dataIndex: "total",
            key: "total",
            render: (text, record) => (
                <p className="table-avatar d-flex align-items-center">
                    {Number(record?.total)}
                </p>
            ),

        },
        {
            title: "Service Name",
            key: "id",
            render: (text, record) => (
                <div>
                    {record?.LeadService?.Service?.name}
                </div>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "customerId",
            render: (text, record, index) => (
                <div key={index}
                    className="table-avatar d-flex align-items-center"
                    onClick={() => { setInvoiceData(record) }}
                    data-bs-toggle="modal"
                    data-bs-target="#invoice_status_update"
                    style={{ courser: 'pointer' }}
                >
                    {text === "Paid" && (
                        <span className="badge badge-pill badge-status bg-success">
                            {text}
                        </span>
                    )}
                    {text === "Overdue" && (
                        <span className="badge badge-pill badge-status bg-danger">
                            {text}
                        </span>
                    )}
                    {record?.status === "Requested" && (
                        <span className="badge badge-pill badge-status bg-secondary">
                            {record?.status}
                        </span>
                    )}
                </div>),
            sorter: (a, b) => a.owner.length - b.owner.length,
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
                        {/* <Link
                            className="dropdown-item edit-popup"
                            to="#"
                            onClick={() => {
                                setAddPayment(true)
                            }}
                        >
                            {" "}
                            <i className="ti ti-edit text-blue" /> Add Payment
                        </Link> */}
                        <Link className="dropdown-item" to={`/invoice-details/${record?.id}`}>
                            <i className="ti ti-clipboard-copy text-violet" /> View Invoice
                        </Link>
                    </div>
                </div>
            ),
        },
    ];


    return (
        <>
            <div className="table-responsive custom-table">
                <DataTable dataSource={data} columns={columns} disableSelection={true} />
            </div>
            <div className="row align-items-center">
                <div className="col-md-6">
                    <div className="datatable-length" />
                </div>
                <div className="col-md-6">
                    <div className="datatable-paginate" />
                </div>
            </div>

            {/* <Modal id="payment_invoices" >
                <AddPayment data={invoiceData} handleRefresh={handleRefresh} />
            </Modal> */}

            {/* <Modal id="installment_payment">
                <Installment data={invoiceData} handleRefresh={handleRefresh} />
            </Modal> */}


            {/* <Payment
                // customerDetails={Array.isArray(data[0]?.Customer) ? data[0].Customer[0] || {} : {}}
                customerDetails={data[0]?.Customer}
                fetchLeadDetails={() => { console.log('fetchLeadDetails') }}
                addPayment={addPayment}
                setAddPayment={setAddPayment}
                setCustomerDetails={() => { console.log('setCustomerDetails') }}
            /> */}

            <ChangeStatus
                invoiceData={invoiceData}
                handleRefresh={handleRefresh}
            />


        </>
    )
}

export default ManageInvoiceList