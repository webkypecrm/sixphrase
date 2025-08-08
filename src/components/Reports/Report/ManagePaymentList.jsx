import React, { useState } from 'react';
import DataTable from '../../Table/DataTable';
import { Link } from 'react-router-dom';
import { all_routes } from '../../../pages/Router/all_routes';
// import Payment from '../../Customer/Payment';


const ManagePaymentList = ({ data, handleRefresh, pageSize, totalPages, fetchPaymentData, sourceOptions }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const route = all_routes;
    // const [invoiceData, setInvoiceDate] = useState({});
    // const [addPayment, setAddPayment] = useState(false);

    // console.log('data =>', data)

    function getDate(value) {
        const isoDateString = value;
        const date = new Date(isoDateString);
        // Format date into "DD MMM YYYY"
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }


    const columns = [
        {
            title: "Customer Id",
            key: "id",
            // sorter: (a, b) => a.Customer?.customerId.localeCompare(b.Customer?.customerName),
            render: (text, record) => (
                <h2 className="table-avatar d-flex align-items-center">
                    <Link
                        to={`/sales/leads-details/${record?.Customer?.convertedLeadId}`}
                        className="profile-split d-flex flex-column"
                    >
                        {record?.Customer?.customerId}
                    </Link>
                </h2>
            ),
        },
        {
            title: "Customer",
            key: "id",
            sorter: (a, b) => a.Customer?.customerName.localeCompare(b.Customer?.customerName),
            render: (text, record) => (
                <h2 className="table-avatar d-flex align-items-center">
                    <Link
                        to={`/sales/leads-details/${record?.Customer?.convertedLeadId}`}
                        className="profile-split d-flex flex-column"
                    >
                        {record?.Customer?.customerName}
                    </Link>
                </h2>
            ),
        },
        {
            title: "Customer Created Date",
            key: "id",
            sorter: (a, b) => a.Customer?.createdAt.localeCompare(b.Customer?.createdAt),
            render: (text, record) => (
                <h2 className="table-avatar d-flex align-items-center">
                    <Link
                        to={`/sales/leads-details/${record?.Customer?.convertedLeadId}`}
                        className="profile-split d-flex flex-column"
                    >
                        {getDate(record?.Customer?.createdAt)}
                    </Link>
                </h2>
            ),
        },
        {
            title: "Service",
            key: "id",
            render: (text, record) => {
                return (
                    <ul>
                        <li>
                            <p className="badge badge-tag badge-secondary">
                                {record?.Service?.name || ""}
                            </p>
                        </li>
                    </ul>
                );
            }
        },
        {
            title: "Source",
            key: "id",
            render: (text, record) => (
                <h2 className="table-avatar d-flex align-items-center">
                    <Link
                        to={`/sales/leads-details/${record?.Customer?.convertedLeadId}`}
                        className="profile-split d-flex flex-column"
                    >
                        {record?.Customer?.sourceId ? sourceOptions.find(option => option.value === record?.Customer?.sourceId).label : ''}
                    </Link>

                </h2>
            ),
        },
        {
            title: "Total Amount",
            dataIndex: "total",
            key: "total",
            render: (text, record) => (
                <p className="table-avatar d-flex align-items-center">
                    {Number(record?.totalAmount)}
                </p>
            ),
        },
        {
            title: "Paid Amount",
            dataIndex: "amountPaid",
            render: (text, record) => (
                <p className="table-avatar d-flex align-items-center">
                    {Number(record?.amountPaid) || 0}
                </p>
            ),
            key: "paidAmount",
        },
        {
            title: "Due Amount",
            dataIndex: "amountDue",
            render: (text, record) => (
                <p className="table-avatar d-flex align-items-center">
                    {Number(record?.amountDue) || 0}
                </p>
            ),
            key: "amount",
        },
        // {
        //     title: "Appointment Counts",
        //     dataIndex: "appointments",
        //     render: (text, record) => (
        //         <p className="table-avatar d-flex align-items-center">
        //             {Number(record?.appointments) || 0}
        //         </p>
        //     ),
        //     key: "amount",
        // },
        // {
        //     title: "Invoice Count",
        //     dataIndex: "invoiceCount",
        //     render: (text, record) => (
        //         <p className="table-avatar d-flex align-items-center">
        //             {Number(record?.invoiceCount) || 0}
        //         </p>
        //     ),
        //     key: "amount",
        // },
        // {
        //     title: "Invoice Requested",
        //     dataIndex: "invoiceRequested",
        //     render: (text, record) => (
        //         <p className="table-avatar d-flex align-items-center">
        //             {Number(record?.invoiceRequest) || 0}
        //         </p>
        //     ),
        //     key: "amount",
        // },
        // {
        //     title: "Invoice Paid",
        //     dataIndex: "invoicePaid",
        //     render: (text, record) => (
        //         <p className="table-avatar d-flex align-items-center">
        //             {Number(record?.invoicePaid) || 0}
        //         </p>
        //     ),
        //     key: "amount",
        // },
        // {
        //     title: "Invoice Due",
        //     dataIndex: "invoiceDue",
        //     render: (text, record) => (
        //         <p className="table-avatar d-flex align-items-center">
        //             {Number(record?.invoiceDue) || 0}
        //         </p>
        //     ),
        //     key: "amount",
        // },
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
            title: "Assigned To",
            dataIndex: "assignedStaff",
            key: "id",
            render: (text, record) => (
                <p className="table-avatar d-flex align-items-center">
                    {record?.Customer?.assignedStaff}
                </p>
            ),
        },
    ];

    const handleFetchData = (page) => {
        fetchPaymentData(page);
    }

    return (
        <>
            <div className="table-responsive custom-table">
                <DataTable
                    dataSource={data}
                    columns={columns}
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

            {/* <Payment
                customerDetails={data?.Customer ? data?.Customer[0] : {}}
                // handleRefresh={fetchLeadDetails}
                fetchLeadDetails={() => { console.log("fetchLeadDetails") }}
                addPayment={addPayment}
                setAddPayment={setAddPayment}
                setCustomerDetails={() => { console.log("setCustomerDetails") }}
            /> */}


        </>
    )
}

export default ManagePaymentList