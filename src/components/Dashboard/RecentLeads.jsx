import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '../../pages/Router/all_routes';
import ImageWithBasePath from '../ImageWithBasePath';
import axios from "axios";

const RecentLeads = ({leadForOptions}) => {
    const route = all_routes;
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [leadData, setLeadData] = useState([]);


    // const initialFilter = {
    //     from: "",
    //     to: ""
    // }
    // const [filterByObj, setFilterByObj] = useState(initialFilter);

    const safeJSONParse = (str, defaultValue = []) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return defaultValue;
        }
    };

    const fetchLeadData = async (page) => {
        try {
            let url = `${apiUrl}/lead/lead-list?page=${page ? page : 1}&pageSize=${5}`
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
            setLeadData(formattedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchLeadData();
    }, [])

    return (
        <Link className="card" to={route.leads}>
            <div className="card-body">
                <div className="statistic-header">
                    <h4>
                        <i className="ti ti-grip-vertical me-1" />
                        Recently Created Leads
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
                                <th>Lead Name</th>
                                <th>Phone</th>
                                <th>Lead For</th>
                                <th>Source</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leadData.map((lead, index) => (
                                <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                                    <td>{lead.leadName}</td>
                                    <td>{lead.leadMobile1}</td>
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

export default RecentLeads