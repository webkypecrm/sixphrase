import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { all_routes } from '../../pages/Router/all_routes';
import ImageWithBasePath from '../ImageWithBasePath';
import axios from "axios";
import { getDate, getTime } from "../../selectOption/selectFunction";

const RecentCalls = () => {
    const route = all_routes;
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [leadData, setLeadData] = useState([]);
    // const [leadForOpitons, setLeadForOpitons] = useState([]);

    // const initialFilter = {
    //     from: "",
    //     to: ""
    // }
    // const [filterByObj, setFilterByObj] = useState(initialFilter);


    const fetchLeadData = async () => {
        try {
            let url = `${apiUrl}/dashboard/upcoming_calls?page=${1}&pageSize=${5}`
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
            const formattedData = response.data.data.map((item) => ({
                ...item,
                key: item.leadId,
            }));
            setLeadData(formattedData);
        } catch (error) {
            console.log(error)
        }
    };

    const handleRedirect = () => {
        navigate(route.upcomingCalls, { state: { stage: 2 } })
    };


    useEffect(() => {
        fetchLeadData();
    }, [])

    return (<div className="card">
        <div className="card-body">
            <div className="statistic-header">
                <h4>
                    <i className="ti ti-grip-vertical me-1" />
                    Upcoming Calls
                </h4>

            </div>
            <div className="table-responsive custom-table">
                <table className="table dataTable no-footer" style={{ width: "100%" }}>
                    <thead className="thead-light">
                        <tr>
                            <th>Lead Name</th>
                            <th>Phone</th>
                            <th>Call Date & Time</th>
                            <th>Remark</th>

                        </tr>
                    </thead>
                    <tbody>
                        {leadData.map((lead, index) => (
                            <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                                <td>
                                    <Link to={`/sales/leads-details/${lead?.leadId}`}>
                                        {lead?.lead?.leadName}
                                    </Link>
                                </td>
                                <td>{lead?.lead?.leadMobile1}</td>
                                <td>
                                    <span className="badge bg-outline-dark text-dark">
                                        {getDate(lead?.callDateTime)}{" "}{getTime(lead?.callDateTime)}
                                    </span>
                                </td>
                                <td>
                                    <span>
                                        {lead?.lastCallSummary?.slice(0, 30) + "..."}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <button type='button' className="badge border border-dark text-dark" onClick={handleRedirect}  >
            View All
        </button>
    </div>
    )
}

export default RecentCalls