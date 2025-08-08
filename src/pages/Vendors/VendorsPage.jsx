import { useState, useEffect, Suspense, lazy, useContext } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import PageHeader from "../../components/Layouts/PageHeader"
import { Empty } from "antd";
import axios from "axios";
import SearchSection from "../../components/Vendors/SearchSection";
const ManageLeadList = lazy(() => import("../../components/Vendors/ManageLeadList"));
import AddLead from "../../components/Vendors/AddLead";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import EditLead from "../../components/Vendors/EditLead";
import Filter from '../../components/Vendors/Filter'
import LeadPipeline from "../../components/Vendors/LeadPipeline";
import './LeadPage.css';
import { SearchContext } from '../../context/SearchProvider';

const VendorsPage = () => {
    const { searchTerms } = useContext(SearchContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [addLead, setAddLead] = useState(false);
    const [data, setData] = useState([]);
    const [industryOptions, setIndustryOptions] = useState([]);
    const [sourceOptions, setSourceOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [leadForOpitons, setLeadForOpitons] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([])
    const [leadDetails, setLeadDetails] = useState(null);
    const [filterSlider, setFilterSlider] = useState(false);
    const [stageOptions, setStageOptions] = useState([]);
    const [vendorCategoryOptions, setVendorCategoryOptions] = useState([]);
    const [manageColumns, setManageColumns] = useState({
        "Vendor Id": true,
        "Category": true,
        "Sub Category": true,
        "Contact Name": true,
        "Contact Email": true,
        "Contact Mobile": true,
        "Vendor Name": true,
        "Vendor Email": true,
        "Vendor Mobile1": true,
        "Vendor Mobile2": false,
        "Vendor Mobile3": false,
        // "Company Name": true,
        // "Assigned By": true,
        // "Assigned To": true,
        // "Updates": true,
        "Created Date": true,
        // "Stage": true,
        "Action": true,
    });
    const initialCounts = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
    }
    const [getStageId, setGetStageId] = useState(null);
    const [totalPages, setTotalPages] = useState("0");
    // const [pageSize, setPageSize] = useState(50);
    const pageSize = 50;
    const [totalStageDataCount, setTotalStageDataCount] = useState(initialCounts);
    const [result, setResult] = useState(0);
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
        categoryId: null,
        serviceId: null
    }
    const [filterByObj, setFilterByObj] = useState(initialFilter);
    const togglePopup = () => {
        setAddLead(prev => !prev);
    };
    function leadDetailsHandler(data) {
        setLeadDetails(data)
    }

    const safeJSONParse = (str, defaultValue = []) => {
        try {
            return JSON.parse(str);
        } catch (e) {
            return defaultValue;
        }
    };
    const fetchStageData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/stage-list`);
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id,
                order: item.order
            }));
            setStageOptions(() => [...formattedData]);
        } catch (error) {
            console.log(error)
            // toast.error(error.message)
        }
    };
    const fetchLeadData = async (page) => {
        try {
            // console.log(num);
            // num++
            let { from, to, industry, source, country, state, city, stage, leadOwner, assignedTo, leadFor, search, categoryId } = filterByObj;

            let url = `${apiUrl}/vendor/vendor-list?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from} &industry=${industry}&source=${source}&country=${country}&state=${state}&city=${city}&stage=${stage}&leadOwner=${leadOwner}&assignedTo=${assignedTo}&leadFor=${leadFor}&search=${search}&categoryId=${categoryId}`

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });

            const formattedData = response.data.data.map((item) => ({
                ...item,
                key: item.leadId,
                tags: safeJSONParse(item?.tags, []), // Safely parse tags
                leadFor: safeJSONParse(item?.leadFor, []), // Safely parse leadFor
            }));

            setTotalStageDataCount(() => ({
                ...initialCounts,
                ...response.data.totalStageDataCount
            }));
            setData(formattedData);
            setTotalPages(response.data.totalCount);
            setResult(response.data.totalResult);
            // setIsLoading(false)

        } catch (error) {
            console.log(error)
            // setIsLoading(false)
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
            console.log(error)

        }
    };
    const fetchVendorCategoryData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/vendor-category-list`);
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setVendorCategoryOptions(formattedData);
        } catch (error) {
            setError(error)
        }
    };
    const fetchIndustryData = async () => {
        try {
            setIndustryOptions([]);

        } catch (error) {
            console.log(error)

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
            console.log(error)

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
    const fetchServiceData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/service-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id,
                key: item.id
            }));
            setServiceOptions(formattedData);
        } catch (error) {
            toast.error(error)
        }
    };

    function handleRefreshPage() {
        window.location.reload()
    }


    useEffect(() => {
        fetchLeadData()
        fetchSourceData()
        fetchIndustryData()
        fetchCountryData()
        fetchStageData()
        fetchCategoryData()
        fetchLeadForData()
        fetchServiceData()
        fetchVendorCategoryData()
    }, [])

    useEffect(() => {
        if (searchTerms !== "" && searchTerms !== undefined) {
            setFilterByObj(() => ({
                ...initialFilter,
                search: String(searchTerms)
            }))
        }
    }, [searchTerms])

    return <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        {/* Page Header */}
                        <PageHeader title="Total Vendors" count={totalPages} pageRefresh={handleRefreshPage} />
                        {/* /Page Header */}
                        {/* <LeadPipeline
                            stageOptions={stageOptions}
                            handleStatusChange={handleStatusChange}
                            totalStageDataCount={totalStageDataCount}
                            getStageId={getStageId}
                            result={result}
                        /> */}
                        <div className="card main-card">
                            <div className="card-body">
                                {/* Search */}
                                <SearchSection
                                    togglePopup={togglePopup}
                                    onManageColumns={setManageColumns}
                                    manageColumns={manageColumns}
                                    fetchLeadData={fetchLeadData}
                                    filterByObj={filterByObj}
                                    setFilterByObj={setFilterByObj}
                                    setFilterSlider={setFilterSlider}
                                    data={data}
                                    leadForOpitons={leadForOpitons}
                                />
                                {/* /Search */}
                                <Suspense fallback={data.length > 0 ? <ContentLoader /> : <Empty />}>
                                    <ManageLeadList
                                        data={data}
                                        onLeadDetails={leadDetailsHandler}
                                        togglePopup={togglePopup}
                                        fetchLeadData={fetchLeadData}
                                        leadForOpitons={leadForOpitons}
                                        serviceOptions={serviceOptions}
                                        manageColumns={manageColumns}
                                        pageSize={pageSize}
                                        totalPages={result}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Lead */}
        {!leadDetails &&
            <AddLead
                addLead={addLead}
                togglePopup={togglePopup}
                vendorCategoryOptions={vendorCategoryOptions}
                industryOptions={industryOptions}
                countryOptions={countryOptions}
                categoryOptions={categoryOptions}
                fetchLeadData={fetchLeadData}
            />
        }
        {/* /Add Lead */}
        {/* /Edit Lead */}
        {leadDetails &&
            <EditLead
                addLead={addLead}
                togglePopup={togglePopup}
                sourceOptions={sourceOptions}
                industryOptions={industryOptions}
                countryOptions={countryOptions}
                categoryOptions={categoryOptions}
                leadDetails={leadDetails}
                onLeadDetails={leadDetailsHandler}
                fetchLeadData={fetchLeadData}
                setLeadDetails={setLeadDetails}
            />
        }
        <div className="form-sorts dropdown">
            {filterSlider &&
                <Filter
                    filterSlider={filterSlider}
                    setFilterSlider={setFilterSlider}
                    sourceOptions={sourceOptions}
                    industryOptions={industryOptions}
                    countryOptions={countryOptions}
                    categoryOptions={categoryOptions}
                    serviceOptions={serviceOptions}
                    leadForOpitons={leadForOpitons}
                    setFilterByObj={setFilterByObj}
                    fetchLeadData={fetchLeadData}
                />
            }
        </div>
    </>
}


export default VendorsPage