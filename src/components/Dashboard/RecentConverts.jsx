import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../../pages/Router/all_routes';
import ImageWithBasePath from '../ImageWithBasePath';
import axios from "axios";
import { getDate, getTime } from '../../selectOption/selectFunction';

const RecentConverts = ({ leadForOptions }) => {
    const route = all_routes;
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [customerData, setCustomerData] = useState([]);
    const [leadForOpitons, setLeadForOpitons] = useState([]);

    const safeJSONParse = (str, defaultValue = []) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return defaultValue;
        }
    };


    const fetchCustomerData = async (page) => {
        try {
            let url = `${apiUrl}/customer/customer-list?page=${page ? page : 1}&pageSize=${5}`
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
            const formattedData = response.data.data.map((item) => ({
                ...item,
                key: item.leadId,
                leadFor: safeJSONParse(item?.leadFor, [])
            }));
            setCustomerData(formattedData);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, [])

    return (
        <Link className="card" to={route.customers}>
            <div className="card-body">
                <div className="statistic-header">
                    <h4>
                        <i className="ti ti-grip-vertical me-1" />
                        Sales Conversions
                    </h4>
                    {/* <div className="dropdown statistic-dropdown">
                        <div className="card-select">
                            <ul>
                                <li>
                                    <Link
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        to="#"
                                    >
                                        <i className="ti ti-calendar-check me-2" />
                                        Last 30 days
                                    </Link>
                                    <div className="dropdown-menu dropdown-menu-end">
                                        <Link
                                            to="#"
                                            className="dropdown-item"
                                        >
                                            Last 15 days
                                        </Link>
                                        <Link
                                            to="#"
                                            className="dropdown-item"
                                        >
                                            Last 30 days
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div> */}
                </div>
                <div className="table-responsive custom-table">
                    <table className="table dataTable no-footer" style={{ width: "100%" }}>
                        <thead className="thead-light">
                            <tr>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>Converted Date</th>
                                <th>Lead For</th>
                                <th>Source</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customerData.map((lead, index) => (
                                <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                                    <td>{lead.customerName}</td>
                                    <td>{lead.customerMobile1}</td>
                                    <td>
                                        <span>
                                            {getDate(lead?.createdAt)}{" "}{getTime(lead?.createdAt)}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge bg-outline-dark text-dark">
                                            {
                                                leadForOptions.find(option => option.value == lead?.leadFor)?.label || "N/A"
                                            }
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-pill bg-${lead.status === "Not Contacted" ? "pending" : "warning"}`}>
                                            {lead?.source}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Link>
    )
}

export default RecentConverts