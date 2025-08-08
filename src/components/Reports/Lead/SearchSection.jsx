import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import * as XLSX from "xlsx";
// import { AuthContext } from '../../../context/AuthProvider';
import axios from "axios";

const SearchSection = ({
    manageColumns,
    data,
    filterByObj
}) => {
    // const { staffData } = useContext(AuthContext)
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const staffType = localStorage.getItem('type');

    const handleLeadExport = async () => {
        try {
            let { from, to, industry, source, country, state, city, stage, leadOwner, assignedTo, leadFor, search, staffId, leadForId } = filterByObj;
            let url = `${apiUrl}/lead/export-lead-reports?&to=${to}&from=${from}&staffId=${staffId}&leadForId=${leadForId}&source=${source}&country=${country}&state=${state}&city=${city}&stage=${stage}&leadOwner=${leadOwner}&assignedTo=${assignedTo}&leadFor=${leadFor}&search=${search}`

            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }
            );
            const fileUrl = response.data.data.fileURL
            if (fileUrl) {
                window.open(fileUrl, "_blank");
            } else {
                console.error("File URL is missing");
            }
        } catch (error) {
            console.log(error)
        }
    }

    // const safeJSONParse = (str, defaultValue = []) => {
    //     try {
    //         return JSON.parse(str);
    //     } catch (e) {
    //         return defaultValue;
    //     }
    // };

    // const exportExcel = () => {
    //     const tableData = data?.map((item) => ({
    //         "Lead Id": manageColumns["Lead Id"] ? item.leadId || "N/A" : null,
    //         "Source": manageColumns["Source"] ? item.source || "N/A" : null,
    //         "Lead Name": manageColumns["Lead Name"] ? item.leadName || "N/A" : null,
    //         "Lead For": manageColumns["Lead For"] ? safeJSONParse(item?.leadFor, []) || "N/A" : null,
    //         "Country": manageColumns["Country"] ? item.country || "N/A" : null,
    //         "City": manageColumns["City"] ? item.leadCity || "N/A" : null,
    //         "Assign To": manageColumns["Assign To"] ? item.assignedTo || "N/A" : null,
    //         "Created Date": manageColumns["Created Date"] ? item.createdAt || "N/A" : null,
    //         "Stage": manageColumns["Stage"] ? item.stage || "N/A" : null,
    //     }));

    //     const ws = XLSX.utils.json_to_sheet(tableData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "Lead Report");
    //     XLSX.writeFile(wb, "lead-report.xlsx");
    // };

    return (
        <div className="search-section">
            <div className="row">

                <div className="col-md-7 col-sm-8" style={{ width: '80%' }}>
                    <div className="export-list text-sm-end">
                        <ul>

                            {staffType == 1 &&
                                <li>
                                    <div className="export-dropdwon " style={{ height: '2.3rem' }}>
                                        <Link
                                            to="#"
                                            className="dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="ti ti-package-export" />
                                        </Link>
                                        <div className="dropdown-menu  dropdown-menu-end" style={{ width: '13rem' }}>
                                            <ul>
                                                <li>
                                                    <Link to="#"
                                                        onClick={handleLeadExport}
                                                    >
                                                        <i className="ti ti-file-type-xls text-green" />
                                                        Export  Data{" "}
                                                    </Link>
                                                </li>
                                                {/* <li>
                                                    <Link to="#"
                                                        onClick={handleLeadExport}
                                                    >
                                                        <i className="ti ti-file-type-xls text-green" />
                                                        Export All Data{" "}
                                                    </Link>
                                                </li> */}

                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchSection