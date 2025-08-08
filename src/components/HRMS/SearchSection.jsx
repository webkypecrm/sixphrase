import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import DateRangePicker from "react-bootstrap-daterangepicker";
import { all_routes } from "../../pages/Router/all_routes";
import ManageColumns from "./ManageColumns";
import * as XLSX from "xlsx";

const SearchSection = ({
    togglePopup,
    onManageColumns,
    manageColumns,
    setFilterSlider,
    filterByObj,
    setFilterByObj,
    fetchData,
    data,
    staffData

}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
    const [manageColumnsSlider, setManageColumnsSlider] = useState(false);
    const route = all_routes;
    const type = localStorage.getItem("type");

    // console.log('manageColumnsSlider =>', manageColumnsSlider);

    const handleManageColumns = (name) => {
        onManageColumns((prev) => ({
            ...prev,
            [name]: !prev[name]
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

    const handleApply = (event, picker) => {
        const start = picker.startDate.format('YYYY-MM-DD HH:mm:ss.SSS');
        const end = picker.endDate.format('YYYY-MM-DD HH:mm:ss.SSS');

        setFilterByObj((...prev) => ({
            ...prev,
            from: start ? start : "",
            to: end
        }))
    }

    const exportExcel = () => {
        const tableData = data?.map((item) => ({
            "Name": manageColumns["Name"] ? item.name || "N/A" : null,
            "Mobile": manageColumns["Mobile"] ? item.mobile || "N/A" : null,
            "Email": manageColumns["Email"] ? item.email || "N/A" : null,
            "Department": manageColumns["Department"] ? item.department?.name || "N/A" : null,
            "Role": manageColumns["Role"] ? item.role?.name || "N/A" : null,
            "Emergency Contact": manageColumns["Emergency Contact"] ? item.role?.name || "N/A" : null,
            "Address": manageColumns["Address"] ? item.role?.name || "N/A" : null,
            "Group": manageColumns["Group"] ? item.group.name || "N/A" : null,
            "Job Type": manageColumns["Job Type"] ? item.jobType.name || "N/A" : null,
            "Work Shift": manageColumns["Work Shift"] ? item.workShift.name || "N/A" : null,
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
            fetchData()
        }
        fetchData()
    }, [filterByObj])

    return <div className="search-section">
        <div className="row">
            <div className="col-md-5 col-sm-4" style={{ marginTop: "2px" }}>

                <div className="form-wrap icon-form">
                    <span className="form-icon">
                        <i className="ti ti-search" />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Staff"
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="col-md-7 col-sm-8">
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
                        {type == '1' &&
                            <li>
                                <Link
                                    to="#"
                                    className="btn btn-primary add-popup"
                                    onClick={() => togglePopup(false)}
                                >
                                    <i className="ti ti-square-rounded-plus" />
                                    Add Staff
                                </Link>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </div>
    </div>
}

export default SearchSection