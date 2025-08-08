import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import DateRangePicker from 'react-bootstrap-daterangepicker'
// import ManageColumns from './ManageColumns';
import * as XLSX from "xlsx";
import axios from 'axios';
// import { AuthContext } from '../../context/AuthProvider';


const SearchSection = ({
    data,
    togglePopup,
    onManageColumns,
    manageColumns,
    filterByObj,
    setFilterByObj,
    fetchCustomerData,
    setFilterSlider
}) => {
    // const { staffData } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
    const [manageColumnsSlider, setManageColumnsSlider] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const staffType = localStorage.getItem('type') || '';


    const handleManageColumns = (name) => {
        onManageColumns((prev) => ({
            ...prev,
            [name]: !prev[name]
        }))
    }

    const handleApply = (event, picker) => {
        const start = picker.startDate.format('YYYY-MM-DD HH:mm:ss.SSS');
        const end = picker.endDate.format('YYYY-MM-DD HH:mm:ss.SSS');

        setFilterByObj((...prev) => ({
            ...prev,
            from: start ? start : "",
            to: end
        }))
    }

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const initialSettings = {
        endDate: today, // Set current date as the endDate
        ranges: {
            "Last 30 Days": [
                new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
                today,
            ],
            "Last 7 Days": [
                new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
                today,
            ],
            "Last Month": [
                new Date(today.getFullYear(), today.getMonth() - 1, 1), // First day of last month
                new Date(today.getFullYear(), today.getMonth(), 0), // Last day of last month
            ],
            "This Month": [
                new Date(today.getFullYear(), today.getMonth(), 1), // First day of current month
                today,
            ],
            Today: [today, today], // Set today as the default range
            Yesterday: [yesterday, yesterday], // Set yesterday as the default range
        },
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7), // Default to "Last 7 Days"
        timePicker: false,
    };

    const handleCustomerExport = async () => {
        try {
            const { from, to, sourceId, staffId, serviceId, leadForId, search } = filterByObj;
            let url = `${apiUrl}/customer/export-customer-reports-data?to=${to}&from=${from}&sourceId=${sourceId}&staffId=${staffId}&leadForId=${leadForId}&serviceId=${serviceId}&search=${search}`

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


    // useEffect(() => {
    //     setFilterByObj({
    //         ...filterByObj,
    //         search: debouncedTerm,
    //     });
    // }, [debouncedTerm]);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);

        // Cleanup previous timeout
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]); // Runs when searchTerm changes


    // useEffect(() => {
    //     if (filterByObj.from) {
    //         fetchCustomerData()
    //     }
    //     fetchCustomerData()
    // }, [filterByObj])

    // useEffect(() => {
    //     // console.log('searchTerms =>', searchTerms)
    //     // if (searchTerms !== '') {
    //     //     console.log('searchTerms inside =>', searchTerms)
    //     //     setSearchTerm(searchTerms)
    //     // }
    //     setSearchTerm(searchTerms)

    // }, [searchTerms])

    return (
        <div className="search-section">
            <div className="row">
                {/* <div className="col-md-5 col-sm-4" style={{ width: '20%' }}>
                    <div className="form-wrap icon-form">
                        <span className="form-icon">
                            <i className="ti ti-search" />
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search By Name, Mobile & Email"
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                        />
                    </div>
                </div> */}
                <div className="col-md-7 col-sm-8" style={{ width: '80%' }}>
                    <div className="export-list text-sm-end">
                        <ul>
                            {/* <li>
                                <div className=" icon-form">
                                    <span className="form-icon">
                                        <i className="ti ti-calendar" />
                                    </span>
                                    <DateRangePicker
                                        initialSettings={initialSettings}

                                        onApply={handleApply}
                                    >
                                        <input
                                            className="form-control bookingrange"
                                            type="text"
                                        />
                                    </DateRangePicker>
                                </div>
                            </li> */}
                            {/* <li>
                                <div className="manage-dropdwon">
                                    <Link
                                        to="#"
                                        className="btn btn-purple-light"
                                        onClick={() => { setManageColumnsSlider(true) }}
                                    >
                                        <i className="ti ti-columns-3" />
                                    </Link>

                                    <ManageColumns
                                        handleManageColumns={handleManageColumns}
                                        manageColumns={manageColumns}
                                        manageColumnsSlider={manageColumnsSlider}
                                        setManageColumnsSlider={setManageColumnsSlider}
                                    />
                                </div>
                            </li> */}
                            {staffType == '1' &&
                                <li>
                                    <div className="export-dropdwon ">
                                        <Link
                                            to="#"
                                            className="dropdown-toggle"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="ti ti-package-export" />
                                        </Link>
                                        <div className="dropdown-menu  dropdown-menu-end">
                                            <ul>
                                                {/* <li>
                                                    <Link to="#"
                                                        onClick={exportExcel}
                                                    >
                                                        <i className="ti ti-file-type-xls text-green" />
                                                        Export as Current Data{" "}
                                                    </Link>
                                                </li> */}
                                                <li>
                                                    <Link to="#"
                                                        onClick={handleCustomerExport}
                                                    >
                                                        <i className="ti ti-file-type-xls text-green" />
                                                        Export Data{" "}
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            }
                            {/* <li>
                                <div className="form-sorts dropdown">
                                    <Link
                                        onClick={() => { setFilterSlider(prev => !prev) }}
                                    >
                                        <i className="ti ti-filter-share" />
                                    </Link>
                                </div>
                            </li> */}
                            {/* <li>
                                <div className="view-icons">
                                    <Link to="/sales/leads" className="active">
                                        <i className="ti ti-list-tree" />
                                    </Link>
                                    <Link to="/sales/leads-kanban">
                                        <i className="ti ti-grid-dots" />
                                    </Link>
                                </div>
                            </li> */}
                            {/* <li>
                                <Link
                                    to="#"
                                    className="btn btn-primary add-popup"
                                    onClick={() => togglePopup(false)}
                                >
                                    <i className="ti ti-square-rounded-plus" />
                                    Add Customer
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchSection