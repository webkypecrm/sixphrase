import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css';
import PageHeader from "../../components/Layouts/PageHeader";
import CampaignStatus from "../../components/Layouts/CampaignStatus/Index";
import AddTask from "../../components/Task/AddTask";
import { toast } from "react-toastify";
import axios from "axios";
import ManageTaskList from "../../components/Task/ManageTaskList";
import EditTask from "../../components/Task/EditTask";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../components/Layouts/ErrorLoader/Index";
import SearchSelection from "../../components/Task/SearchSelection";
import Filter from "../../components/Task/Filter";
import { Empty } from "antd";

import PieChartComponent from "../../components/Task/PieChartComponent";

const TaskPage = () => {

    const [activityToggle, setActivityToggle] = useState(false);
    const [activityToggleTwo, setActivityToggleTwo] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [taskCategoryOptions, setTaskCategoryOptions] = useState([]);
    const [taskSubCategoryOptions, setTaskSubCategoryOptions] = useState([]);
    const [leadOptions, setLeadOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [filterSlider, setFilterSlider] = useState(false);
    const [taskDetails, setTaskDetails] = useState(null);
    const [manageColumns, setManageColumns] = useState({
        "Task ID": true,
        "Title": true,
        "Type": true,
        "Description": false,
        "Category": true,
        "Sub Category": true,
        "Assigned By": true,
        "Start Date": true,
        "End Date": true,
        "Assigned To": true,
        "Priority": true,
        "Tags": false,
        "Created Date": false,
        "Status": true,
        "Attachment": true,
        "Action": true,
    });
    const initialFilter = {
        from: "",
        to: "",
        source: [],
        industry: [],
        country: [],
        stage: [],
        company: [],
        leadOwner: [],
        search: "",
    }
    const [filterByObj, setFilterByObj] = useState(initialFilter);
    const [totalPages, setTotalPages] = useState(0);
    // const [pageSize, setPageSize] = useState(2);
    const pageSize = 500

    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const staffType = localStorage.getItem('type') || '';


    function taskDetailsHandler(data) {
        setTaskDetails(data)
    }

    const fetchTaskData = async (page) => {
        try {
            const { from, to, industry, source, country, stage, company, leadOwner, search } = filterByObj;
            console.log({ from, to, industry, source, country, stage, company, leadOwner, search })


            let url = `${apiUrl}/task/task-list?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
                &industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&leadOwner=${leadOwner}&search=${search}`

            if (staffType == "0") {
                url = `${apiUrl}/task/task-list?staffType=0&page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
                &industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&leadOwner=${leadOwner}&search=${search}`
            }

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
            const formattedData = response.data.data.map((item) => ({
                ...item,
                key: item.taskId,
                tags: JSON.parse(item.tags)
            }));

            setData(formattedData);
            setIsLoading(false)

        } catch (error) {
            setError(error)
            setIsLoading(false)

        }
    };

    const fetchTaskCategoryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/task-category-list`);
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setTaskCategoryOptions(formattedData);
            setIsLoading(false)
        } catch (error) {
            toast.error(error)
            setIsLoading(false)
        }
    };

    const fetchTaskSubCategoryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/task-sub-category-list`);
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setTaskSubCategoryOptions(formattedData);
            setIsLoading(false)
        } catch (error) {
            toast.error(error)
            setIsLoading(false)
        }
    };

    const fetchLeadData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/lead/leadDropdown`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
            const formattedData = response.data.data.map((item) => ({
                label: `leadId:${item.leadId} | ${item.leadName} | ${item.leadMobile1} |
                 ${item?.company?.companyName ? item.company.companyName : ''}`,
                value: item.leadId
            }));

            setLeadOptions(formattedData);
            setIsLoading(false)

        } catch (error) {
            setError(error)
            setIsLoading(false)
        }
    };

    const fetchCustomerData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/customer/customerDropdown`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
            const formattedData = response.data.data.map((item) => ({
                label: `customerId:${item.customerId} | ${item.customerName} | ${item.customerMobile1} |
                 ${item?.company?.companyName ? item.company.companyName : ''}`,
                value: item.convertedLeadId
            }));

            setCustomerOptions(formattedData);
            setIsLoading(false)

        } catch (error) {
            setError(error)
            setIsLoading(false)
        }
    };

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
            toast.error(error);
        }
    };

    useEffect(() => {
        fetchTaskData();
        fetchTaskCategoryData();
        fetchTaskSubCategoryData();
        fetchLeadData();
        fetchStaffData();
        fetchCustomerData();
    }, [])

    return (
        <>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-md-12">
                            {/* Page Header */}
                            <PageHeader title="Task" count={data.length} />
                            {/* /Page Header */}
                            {/* Campaign Status */}
                            {/* <CampaignStatus /> */}
                            {/* /Campaign Status */}

                            <PieChartComponent data={data} taskCategoryOptions={taskCategoryOptions} />

                            <div className="card main-card">
                                <div className="card-body">
                                    {/* Search */}
                                    <SearchSelection
                                        setActivityToggle={setActivityToggle}
                                        onManageColumns={setManageColumns}
                                        manageColumns={manageColumns}
                                        filterByObj={filterByObj}
                                        setFilterSlider={setFilterSlider}
                                        setFilterByObj={setFilterByObj}
                                        fetchTaskData={fetchTaskData}
                                    />
                                    {/* /Search */}
                                    {isLoading &&
                                        <ContentLoader />
                                    }
                                    {error &&
                                        <ErrorLoader title={error.name} message={error.message} />
                                    }
                                    {data.length > 0 && !error &&
                                        <ManageTaskList
                                            data={data}
                                            setData={setData}
                                            setActivityToggleTwo={setActivityToggleTwo}
                                            fetchTaskData={fetchTaskData}
                                            staffOptions={staffOptions}
                                            manageColumns={manageColumns}
                                            pageSize={pageSize}
                                            totalPages={totalPages}
                                            onTaskDetails={taskDetailsHandler}
                                        />
                                    }
                                    {
                                        data.length === 0 && !isLoading && !error && <Empty />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Page Wrapper */}
            {/* Add New Task */}
            {!taskDetails &&
                <AddTask
                    activityToggle={activityToggle}
                    setActivityToggle={setActivityToggle}
                    activityToggleTwo={activityToggleTwo}
                    taskCategoryOptions={taskCategoryOptions}
                    taskSubCategoryOptions={taskSubCategoryOptions}
                    leadOptions={leadOptions}
                    customerOptions={customerOptions}
                    staffOptions={staffOptions}
                    setStaffOptions={setStaffOptions}
                    fetchTaskData={fetchTaskData}
                />
            }
            {/* /Add New Task */}
            {taskDetails &&
                <EditTask
                    activityToggle={activityToggle}
                    setActivityToggle={setActivityToggle}
                    activityToggleTwo={activityToggleTwo}
                    taskCategoryOptions={taskCategoryOptions}
                    taskSubCategoryOptions={taskSubCategoryOptions}
                    leadOptions={leadOptions}
                    staffOptions={staffOptions}
                    setStaffOptions={setStaffOptions}
                    taskDetails={taskDetails}
                />
            }
            <div className="form-sorts dropdown">
                <Filter
                    filterSlider={filterSlider}
                    setFilterSlider={setFilterSlider}
                    sourceOptions={[]}
                    industryOptions={[]}
                    countryOptions={[]}
                    setFilterByObj={setFilterByObj}
                    fetchTaskData={fetchTaskData}
                />
            </div>

        </>
    );
};

export default TaskPage;
