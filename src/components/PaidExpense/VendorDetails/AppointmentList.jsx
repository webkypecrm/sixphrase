import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Empty } from "antd";
import axios from "axios";
import ContentLoader from "../../Layouts/ContentLoader/Index";
import ErrorLoader from "../../Layouts/ErrorLoader/Index";

import ManageAppointmentList from "../../Appointment/ManageAppointmentList";
// import PageHeader from "../../Layouts/PageHeader";
// import SearchSection from "../../../components/Appointment/SearchSection";


const AppointmentList = ({ leadData }) => {
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
        "Details": true,
        "Treatment": true,
        "Category": true,
        "Counselor": true,
        "Appointment Date": true,
        "Message": true,
        "Assigned To": true,
        "Created Date": true,
        "Status": true,
        "Action": true,
    });
    const [totalPages, setTotalPages] = useState(0);
    // const [pageSize, setPageSize] = useState(2);
    const pageSize = 500
    const [counselorOptions, setCounselorOptions] = useState([]);

    // const employeeId = localStorage.getItem('staffId') || '';
    const staffType = localStorage.getItem('type') || '';


    // console.log("data in appointment List =>", data)
    // console.log("lead data =>", leadData)

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

    const fetchCounselorData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/appointment/counselor-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.staffId
            }));
            setCounselorOptions(formattedData);

        } catch (error) {
            console.log(error)

        }
    };

    const fetchAppointmentData = async (page, leadId) => {
        try {
            const { from, to, search } = filterByObj;

            let url = `${apiUrl}/appointment/appointment-list?page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}&search=${search}&leadId=${leadId}`

            // if (staffType == '0') {
            //     url = `${apiUrl}/appointment/appointment-list?staffType=${0}&page=${page ? page : 1}&pageSize=${pageSize}&to=${to}&from=${from}&search=${search}`
            // }

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
        // setFilterByObj(initialFilter)
        fetchAppointmentData(1, leadData.leadId)
    }

    useEffect(() => {
        if (leadData?.leadId) {
            fetchAppointmentData(1, leadData.leadId)
            fetchCounselorData()
        }
    }, [leadData])

    // console.log("leadData =>", leadData)

    return (
        <div className="row">
            {/* <div className="col-md-12"> */}
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-4">
                            <h4 className="page-title">
                                Appointments<span className="count-title">{totalPages}</span>
                            </h4>
                        </div>
                    </div>
                </div>
                {/* /Page Header */}
                {/* <div className="tab-pane fade" id="lead-appointment"> */}
                <div className="view-header" style={{ borderBottom: 'none' }}>
                    <ul>
                        <li>
                            <Link
                                to="#"
                                data-bs-toggle="modal"
                                data-bs-target="#create_appointment"
                                className="com-add"
                            >
                                <i className="ti ti-circle-plus me-1" />
                                Add New
                            </Link>
                        </li>
                    </ul>
                </div>

            </div>

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
                    leadData={leadData}
                    handleRefresh={handleRefreshPage}
                    counselorOptions={counselorOptions}
                />
            }
            {
                data.length === 0 && !isLoading && !error && <Empty />
            }
            {/* /Manage Users List */}


            {/* </div> */}
        </div>)


}


export default AppointmentList