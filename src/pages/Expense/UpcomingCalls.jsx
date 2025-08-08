import React, { Suspense, useState, lazy, useEffect } from 'react';
import PageHeader from '../../components/Layouts/PageHeader';
import ContentLoader from '../../components/Layouts/ContentLoader/Index';
const ManageUpcomingCallList = lazy(() => import("../../components/Sales/UpcomingCalls/ManageUpcomingCallList"));
import { Empty } from 'antd';
import axios from "axios";
import SearchSection from '../../components/Sales/UpcomingCalls/SearchSection';

const UpcomingCalls = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [result, setResult] = useState(0);
    const pageSize = 10;
    const initialFilter = {
        from: "",
        to: "",
        source: [],
        industry: [],
        country: [],
        state: [],
        city: [],
        stage: [],
        company: [],
        leadOwner: [],
        assignedTo: [],
        leadFor: [],
        search: "",
    }
    const [filterByObj, setFilterByObj] = useState(initialFilter);
    const [leadForOpitons, setLeadForOpitons] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);

    function handleRefreshPage() {
        window.location.reload()
    }
    const safeJSONParse = (str, defaultValue = []) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return defaultValue;
        }
    };


    const fetchUpcomintCallData = async (page) => {
        try {
            let { from, to, industry, source, country, state, city, stage, leadOwner, assignedTo, leadFor, search } = filterByObj;

            let url = `${apiUrl}/dashboard/upcoming_calls?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
                &industry=${industry}&source=${source}&country=${country}&state=${state}&city=${city}&stage=${stage}&leadOwner=${leadOwner}&assignedTo=${assignedTo}&leadFor=${leadFor}&search=${search}`

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });

            const formattedData = response.data.data.map((item) => ({
                ...item,
                key: item.leadId,
                leadFor: safeJSONParse(item?.lead?.leadFor, []), // Safely parse leadFor
            }));

            setData(formattedData);
            setTotalPages(formattedData.length);
            setResult(formattedData.length);

        } catch (error) {
            console.log(error)
        }
    };

    const fetchLeadForData = async () => {
        try {
            const response = await fetch(`${apiUrl}/master/lead-for-list`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
            });
            const resData = await response.json();
            const formattedData = resData.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setLeadForOpitons(formattedData);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUpcomintCallData();
        fetchLeadForData();
    }, [])

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/staff/staff-list`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.staffId
                }));
                setStaffOptions(() => [...formattedData]);

            } catch (error) {
                console.log(error)
            }
        };

        fetchStaffData()
    }, [])



    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        {/* Page Header */}
                        <PageHeader title="Upcoming Calls" count={totalPages} pageRefresh={handleRefreshPage} />

                        {/* /Page Header */}

                        <div className="card main-card">
                            <div className="card-body">

                                {/* Search */}
                                <SearchSection
                                    fetchUpcomintCallData={fetchUpcomintCallData}
                                    filterByObj={filterByObj}
                                    setFilterByObj={setFilterByObj}
                                    staffOptions={staffOptions}
                                />
                                {/* /Search */}

                                {/* <span className="badge border border-dark text-dark">
                                    search counts: {result}
                                </span> */}

                                <Suspense fallback={data.length > 0 ? <ContentLoader /> : <Empty />}>
                                    <ManageUpcomingCallList
                                        data={data}
                                        // onLeadDetails={leadDetailsHandler}
                                        // togglePopup={togglePopup}
                                        // fetchLeadData={fetchLeadData}
                                        leadForOpitons={leadForOpitons}
                                        // manageColumns={manageColumns}
                                        pageSize={pageSize}
                                        totalPages={result}
                                    />
                                </Suspense>

                                {/* <ManageUpcomingAppointmentList /> */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpcomingCalls