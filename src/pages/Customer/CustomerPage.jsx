import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import PageHeader from "../../components/Layouts/PageHeader"
import { Empty } from "antd";
import axios from "axios";
import CampaignStatus from "../../components/Layouts/CampaignStatus/Index"
import ManageLeadList from "../../components/Sales/ManageLeadList";
import AddLead from "../../components/Sales/AddLead";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../components/Layouts/ErrorLoader/Index";
import EditLead from "../../components/Sales/EditLead";
import EditCompany from "../../components/Sales/EditCompany";

import ManageCustomerList from "../../components/Customer/ManageCustomerList";
import SearchSection from "../../components/Customer/SearchSection";
import EditCustomer from "../../components/Customer/EditCustomer";
// import Filter from "./Filter";
import Filter from "../Customer/Filter";


const CustomerPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [addLead, setAddCustomer] = useState(false);
    const [editCustomer, setEditCustomer] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sourceOptions, setSourceOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [customerInfo, setCustomerInfo] = useState({});
    const [companyDetails, setCompanyDetails] = useState(null);
    const [filterSlider, setFilterSlider] = useState(false);
    const [stageOptions, setStageOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [leadForOpitons, setLeadForOpitons] = useState([]);
    const [manageColumns, setManageColumns] = useState({
        "Customer Name": true,
        "Customer Email": true,
        "Customer Mobile1": true,
        "Customer Mobile2": false,
        "Customer Mobile3": false,
        "Country": true,
        "State": true,
        "City": true,
        "Source": true,
        "Requirement": true,
        "Service": true,
        "Industry": true,
        "Created By": true,
        "Assigned To": true,
        "Created Date": true,
        "Total Estimate Cost": true,
        "Total Amount": true,
        "Total Paid": true,
        "Total Due": true,
        "Stage": true,
        "Contact": true,
        "Action": true,
    });
    const [totalPages, setTotalPages] = useState(0);
    // const [pageSize, setPageSize] = useState(2);
    const pageSize = 20

    // const employeeId = localStorage.getItem('staffId') || '';
    const staffType = localStorage.getItem('type') || '';

    const initialFilter = {
        from: "",
        to: "",
        source: [],
        industry: [],
        country: [],
        stage: [],
        leadFor: [],
        company: [],
        customerOwner: [],
        search: "",
    }
    const [filterByObj, setFilterByObj] = useState(initialFilter);


    const togglePopup = () => {
        setAddCustomer(prev => !prev);
    };
    const togglePopupTwo = () => {
        setEditCustomer(prev => !prev);
    };

    function customerDetailsHandler(data) {
        // console.log("data in customer details=>", data)
        setCustomerInfo(() => ({
            ...data
        }))
    }

    function handleRefresh() {
        fetchCustomerData()
    }

    const safeJSONParse = (str, defaultValue = []) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return defaultValue;
        }
    };
    // console.log('filterByObj =>', filterByObj, num++)

    const fetchStageData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/stage-list`);
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setStageOptions(() => [...formattedData]);
        } catch (error) {
            toast.error(error.message)
        }
    };
    const fetchCustomerData = async (page) => {
        try {
            const { from, to, industry, source, country, stage, company, customerOwner, leadFor, search } = filterByObj;

            let url = `${apiUrl}/customer/customer-list?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}&industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&customerOwner=${customerOwner}&leadFor=${leadFor}&search=${search}`

            if (staffType == '0') {
                url = `${apiUrl}/customer/customer-list?staffType=${0}&page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}
                &industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&customerOwner=${customerOwner}&leadFor=${leadFor}&search=${search}`
            }

            // console.log('search =>', search)
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });

            const formattedData = response.data.data.map((item) => ({
                ...item,
                key: item.customerId,
                leadFor: safeJSONParse(item.leadFor, [])
            }));

            setData(formattedData);
            setTotalPages(response.data.totalCount)
            setIsLoading(false)

        } catch (error) {
            setError(error)
            setIsLoading(false)

        }
    };
    const fetchSourceData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/source-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setSourceOptions(formattedData);

        } catch (error) {
            setError(error)

        }
    };
    const fetchCountryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/employee/country-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setCountryOptions(formattedData);

        } catch (error) {
            setError(error)

        }
    };
    const fetchCategoryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/category-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setCategoryOptions(formattedData);

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
        fetchCustomerData()
        fetchSourceData()
        fetchCountryData()
        fetchStageData()
        fetchCategoryData()
        fetchLeadForData()
    }, [])

    // console.log(' data =>', data)

    console.log("filterByObj =>", filterByObj)

    return <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        {/* Page Header */}
                        <PageHeader title="Total Sales Customer" count={totalPages} />
                        {/* /Page Header */}
                        <div className="card main-card">
                            <div className="card-body">
                                {/* Search */}
                                <SearchSection
                                    togglePopup={togglePopup}
                                    onManageColumns={setManageColumns}
                                    manageColumns={manageColumns}
                                    fetchCustomerData={fetchCustomerData}
                                    filterByObj={filterByObj}
                                    setFilterByObj={setFilterByObj}
                                    setFilterSlider={setFilterSlider}
                                    data={data}
                                />
                                {/* /Search */}

                                {/* Manage Users List */}
                                {isLoading &&
                                    <ContentLoader />
                                }
                                {error &&
                                    <ErrorLoader title={error.name} message={error.message} />
                                }
                                {data.length > 0 && !error &&
                                    <ManageCustomerList
                                        data={data}
                                        onCustomerDetails={handleRefresh}
                                        togglePopup={togglePopup}
                                        togglePopupTwo={togglePopupTwo}
                                        fetchCustomerData={fetchCustomerData}
                                        manageColumns={manageColumns}
                                        pageSize={pageSize}
                                        totalPages={totalPages}
                                        customerDetailsHandler={customerDetailsHandler}
                                        setCustomerInfo={setCustomerInfo}
                                        leadForOpitons={leadForOpitons}
                                    />
                                }
                                {
                                    data.length === 0 && !isLoading && !error && <Empty />
                                }
                                {/* /Manage Users List */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {customerInfo &&
            <EditCustomer
                editCompany={editCustomer}
                togglePopupTwo={togglePopupTwo}
                sourceOptions={sourceOptions}
                countryOptions={countryOptions}
                categoryOptions={categoryOptions}
                leadForOpitons={leadForOpitons}
                fetchCustomerData={handleRefresh}
                customerDetails={customerInfo}
                setCustomerDetails={setCustomerInfo}
            />
        }
        <div className="form-sorts dropdown">
            {filterSlider &&
                <Filter
                    filterSlider={filterSlider}
                    setFilterSlider={setFilterSlider}
                    sourceOptions={sourceOptions}
                    countryOptions={countryOptions}
                    leadForOpitons={leadForOpitons}
                    setFilterByObj={setFilterByObj}
                    fetchLeadData={fetchCustomerData}
                />
            }
        </div>
    </>
}


export default CustomerPage