import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import ManageColumns from './ManageColumns';
import * as XLSX from "xlsx";
import axios from 'axios';
import { AuthContext } from '../../context/AuthProvider';


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
    const { staffData } = useContext(AuthContext);

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

            const { from, to, industry, source, country, stage, company, customerOwner, leadFor, search } = filterByObj;

            let url = `${apiUrl}/customer/export-customer?to=${to}&from=${from}&industry=${industry}&source=${source}&country=${country}&stage=${stage}&company=${company}&customerOwner=${customerOwner}&leadFor=${leadFor}&search=${search}`

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

    const exportExcel = () => {
        const tableData = data?.map((item) => ({
            "Customer Name": manageColumns["Customer Name"] ? item.customerName || "N/A" : null,
            "Customer Email": manageColumns["Customer Email"] ? item.customerEmail || "N/A" : null,
            "Customer Mobile1": manageColumns["Customer Mobile1"] ? item.customerMobile1 || "N/A" : null,
            "Customer Mobile2": manageColumns["Customer Mobile2"] ? item.customerMobile2 || "N/A" : null,
            "Customer Mobile3": manageColumns["Customer Mobile3"] ? item.customerMobile3 || "N/A" : null,
            "Lead For": manageColumns["Lead For"] ? item.leadFor || "N/A" : null,
            "Source": manageColumns["Source"] ? item.source || "N/A" : null,
            "Tags": manageColumns["Tags"] ? item.tags || "N/A" : null,
            "Owner": manageColumns["Owner"] ? item.owner || "N/A" : null,
            "Assigned Staff": manageColumns["Assigned Staff"] ? item.assignedStaff || "N/A" : null,
            "Created Date": manageColumns["Created Date"] ? item.createdAt || "N/A" : null,
            "Total Estimate Cost": manageColumns["Total Estimate Cost"] ? item.totalEstimateCost || "N/A" : null,
            "Total Amount": manageColumns["Total Amount"] ? item.totalAmount || "N/A" : null,
            "Total Paid": manageColumns["Total Paid"] ? item.totalPaid || "N/A" : null,
            "Total Due": manageColumns["Total Due"] ? item.totalDue || "N/A" : null,
            // "Total Discount": manageColumns["Total Discount"] ? item.totalDiscount || "N/A" : null,
            // "Total Sales": manageColumns["Total Sales"] ? item.totalSales || "N/A" : null,
            "Estimate Cost": manageColumns["Estimate Cost"] ? item.estimateCost || "N/A" : null,
        }));

        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Staff List");
        XLSX.writeFile(wb, "staff-list.xlsx");
    };


    useEffect(() => {
        setFilterByObj({
            ...filterByObj,
            search: debouncedTerm,
        });
    }, [debouncedTerm]);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500);

        // Cleanup previous timeout
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]); // Runs when searchTerm changes


    useEffect(() => {
        if (filterByObj.from) {
            fetchCustomerData()
        }
        fetchCustomerData()
    }, [filterByObj])

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
                <div className="col-md-5 col-sm-4" style={{ width: '20%' }}>
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
                </div>
                <div className="col-md-7 col-sm-8" style={{ width: '80%' }}>
                    <div className="export-list text-sm-end">
                        <ul>
                            <li>
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
                            </li>
                            <li>
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
                            </li>
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

                            <li>
                                <div className="form-sorts dropdown">
                                    <Link
                                        onClick={() => { setFilterSlider(prev => !prev) }}
                                    >
                                        <i className="ti ti-filter-share" />
                                    </Link>
                                </div>
                            </li>
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