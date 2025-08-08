import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import PageHeader from "../../components/Layouts/PageHeader"
import { Empty } from "antd";
import axios from "axios";
import ManageLeadList from "../../components/Sales/ManageLeadList";
import AddLead from "../../components/Sales/AddLead";
import ContentLoader from "../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../components/Layouts/ErrorLoader/Index";
import EditLead from "../../components/Sales/EditLead";
import EditCompany from "../../components/Sales/EditCompany";
import Filter from '../../components/Sales/Filter'
import LeadPipeline from "../../components/Sales/LeadPipeline";
import AddAppointment from "../../components/Appointment/AddAppointment";
import ManageAppointmentList from "../../components/Appointment/ManageAppointmentList";
import SearchSection from "../../components/Appointment/SearchSection";
import { toast } from "react-toastify";
import { label } from "yet-another-react-lightbox";


const AppointmentPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [addLead, setAddLead] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [leadDetails, setLeadDetails] = useState(null);
    const [editCompany, setEditCompany] = useState(false);
    const [companyDetails, setCompanyDetails] = useState(null);
    const [filterSlider, setFilterSlider] = useState(false);
    const [stageOptions, setStageOptions] = useState([]);
    const [manageColumns, setManageColumns] = useState({
        "Client": true,
        "Treatment": true,
        "Category": true,
        "Counselor": true,
        "Date": true,
        "Message": true,
        "Assigned To": true,
        "Created Date": true,
        "Status": true,
        "Action": true,
    });
    const [totalPages, setTotalPages] = useState(0);
    // const [pageSize, setPageSize] = useState(2);
    const pageSize = 500

    // const employeeId = localStorage.getItem('staffId') || '';
    const staffType = localStorage.getItem('type') || '';

    const initialFilter = {
        from: "",
        to: "",
        search: "",
    }
    const [filterByObj, setFilterByObj] = useState(initialFilter);

    const togglePopup = () => {
        setAddLead(prev => !prev);
    };

    function leadDetailsHandler(data) {
        setLeadDetails(data)
    }


    const fetchAppointmentData = async (page) => {
        try {
            const { from, to, search } = filterByObj;

            let url = `${apiUrl}/appointment/appointment-list?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}&search=${search}`

            if (staffType == '0') {
                url = `${apiUrl}/appointment/appointment-list?staffType=${0}&page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}&search=${search}`
            }

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });

            const formattedData = response.data.data.map((item) => ({
                ...item,
                key: item.id,
            }));

            setData(formattedData);
            setTotalPages(response.data.totalCount)
            setIsLoading(false)

        } catch (error) {
            setError(error)
            setIsLoading(false)

        }
    };

    function handleRefreshPage() {
        setFilterByObj(initialFilter)
        fetchAppointmentData()
    }

    useEffect(() => {
        fetchAppointmentData();
    }, [])


    return <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        {/* Page Header */}
                        <PageHeader title="Appointment List" count={totalPages} pageRefresh={handleRefreshPage} />
                        {/* /Page Header */}
                        <div className="card main-card">
                            <div className="card-body">
                                {/* Search */}
                                <SearchSection
                                    togglePopup={togglePopup}
                                    onManageColumns={setManageColumns}
                                    manageColumns={manageColumns}
                                    fetchLeadData={fetchAppointmentData}
                                    filterByObj={filterByObj}
                                    setFilterByObj={setFilterByObj}
                                    setFilterSlider={setFilterSlider}
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
                                    <ManageAppointmentList
                                        data={data}
                                        onLeadDetails={leadDetailsHandler}
                                        togglePopup={togglePopup}
                                        fetchAppointmentData={fetchAppointmentData}
                                        setEditCompany={setEditCompany}
                                        setCompanyDetails={setCompanyDetails}
                                        manageColumns={manageColumns}
                                        pageSize={pageSize}
                                        totalPages={totalPages}
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
        {/* /Page Wrapper */}
        {/* Add Lead */}
        {!leadDetails &&
            <AddAppointment
                addLead={addLead}
                togglePopup={togglePopup}
                handleRefreshPage={handleRefreshPage}
            />
        }
        {/* /Add Lead */}
        {/* {  Edit Company} */}
        {/* <div className="form-sorts dropdown">
            <Filter
                filterSlider={filterSlider}
                setFilterSlider={setFilterSlider}
                sourceOptions={sourceOptions}
                industryOptions={industryOptions}
                countryOptions={countryOptions}
                setFilterByObj={setFilterByObj}
                fetchLeadData={fetchLeadData}

            />
        </div> */}

    </>
}


export default AppointmentPage