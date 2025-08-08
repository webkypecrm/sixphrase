import React, { useState, useEffect } from "react";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../Router/all_routes";
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import ManageInvoiceList from "../../components/Finance/Invoice/ManageInvoiceList";
import AddInvoice from "../../components/Finance/Invoice/AddInvoice";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../components/Layouts/ErrorLoader/Index";
import { Empty } from "antd";
import Payment from "../../components/Customer/Payment";


const InvoiceTab = ({ leadData }) => {
    const [activityToggle, setActivityToggle] = useState(false)
    const route = all_routes;
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [data, setData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalDue, setTotalDue] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);

    // console.log("leadData =>", leadData)

    const pageSize = 10;

    const fetchInvoiceData = async (page, customerId) => {
        try {
            const response = await axios.get(`${apiUrl}/customer/invoice-list?page=${page ? page : 1}&pageSize=${pageSize}&customerId=${customerId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${Token}`,
                    }
                })

            console.log("response =>", response)

            setTotalAmount(response?.data?.totalAmount)
            setTotalDue(response.data.totalDue)
            setTotalPaid(response.data.totalPaid)

            const formattedData = response.data.data.map((item) => ({
                ...item,
                key: item.id,
            }));
            setIsLoading(false)
            setData(formattedData);
        } catch (error) {
            console.log(error)
            setError(error.message);
        }
    }

    function handleRefresh() {
        fetchInvoiceData(1, leadData.Customer[0].customerId)
    }

    useEffect(() => {
        if (leadData?.Customer[0]?.customerId) {
            fetchInvoiceData(1, leadData.Customer[0].customerId)
        }
    }, [leadData])

    // console.log("totalAmount =>", totalAmount)
    // console.log("totalDue =>", totalDue)
    // console.log("totalPaid =>", totalPaid)

    return (
        <>
            {/* Page Wrapper */}

            <div className="row">
                <div className="col-md-12">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col-8">
                                <h4 className="page-title">
                                    Invoice List<span className="count-title">{data?.length}</span>
                                </h4>
                            </div>
                            <div className="col-4 text-end">
                                <Link
                                    to="#"
                                    className="btn btn-primary add-popup"
                                    onClick={() =>
                                        setActivityToggle(prev => !prev)
                                    }
                                >
                                    <i className="ti ti-square-rounded-plus" /> Add New
                                    Invoice
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="card main-card">
                        <div className="card-body">

                            {/* <div className="row" style={{
                                display: "flex",
                                justifyContent: "start",
                                alignItems: "center"
                            }}>
                                <div className="col-xl-4 col-lg-8">
                                    <div className="campaign-box bg-warning-light" style={{ justifyContent: 'flex-start' }}>
                                        <div className="campaign-img">
                                            <span>
                                                <i className="ti ti-send" />
                                            </span>
                                        </div>
                                        <div>
                                            <h6>Total Amount</h6>
                                            <h2>{totalAmount}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-lg-8">
                                    <div className="campaign-box bg-danger-light" style={{ justifyContent: 'flex-start' }}>
                                        <div className="campaign-img">
                                            <span>
                                                <i className="ti ti-brand-campaignmonitor" />
                                            </span>
                                        </div>
                                        <div>
                                            <div>
                                                <h6>Total Due</h6>
                                                <h2>{totalDue}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4 col-lg-8">
                                    <div className="campaign-box bg-success-light" style={{ justifyContent: 'flex-start' }}>
                                        <div className="campaign-img">
                                            <span>
                                                <i className="ti ti-brand-pocket" />
                                            </span>
                                        </div>
                                        <div>
                                            <h6>Total Paid</h6>
                                            <h2>{totalPaid}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            {isLoading &&
                                <ContentLoader />
                            }
                            {error &&
                                <ErrorLoader title={error.name} message={error.message} />
                            }
                            {data.length > 0 && !error &&
                                <ManageInvoiceList
                                    data={data}
                                    handleRefresh={handleRefresh}
                                />
                            }
                            {
                                data.length === 0 && !isLoading && !error && <Empty />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <AddInvoice
                activityToggle={activityToggle}
                setActivityToggle={setActivityToggle}
                handleRefresh={handleRefresh}
                customerDetails={leadData?.Customer[0]}
            />

            {/* <Payment
                customerDetails={leadData?.Customer[0]}
                // handleRefresh={fetchLeadDetails}
                fetchLeadDetails={fetchLeadDetails}
                addPayment={addPayment}
                setAddPayment={setAddPayment}
                setCustomerDetails={() => { console.log("setCustomerDetails") }}
            /> */}
{/* 
            <Payment
                customerDetails={leadData?.Customer[0]}
                // handleRefresh={fetchLeadDetails}
                fetchLeadDetails={() => { console.log("fetchLeadDetails") }}
                addPayment={addPayment}
                setAddPayment={setAddPayment}
                setCustomerDetails={() => { console.log("setCustomerDetails") }}
            /> */}

        </>
    );
};

export default InvoiceTab;
