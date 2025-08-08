import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import DateRangePicker from 'react-bootstrap-daterangepicker'
import ManageColumns from '../UI/ManageColumns';


const SearchSection = ({
    togglePopup,
    onManageColumns,
    manageColumns,
    filterByObj,
    setFilterByObj,
    fetchLeadData,
    setFilterSlider
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
    const [manageColumnsSlider, setManageColumnsSlider] = useState(false);

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
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() ), // Default to "Last 7 Days"
        timePicker: false,
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
            fetchLeadData()
        }
        fetchLeadData()
    }, [filterByObj])

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
                            placeholder="Search Appointment"
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
                            <li>
                                <div className="form-sorts dropdown">
                                    <Link
                                        onClick={() => { setFilterSlider(prev => !prev) }}
                                    >
                                        <i className="ti ti-filter-share" />
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    className="btn btn-primary add-popup"
                                    onClick={() => togglePopup(false)}
                                >
                                    <i className="ti ti-square-rounded-plus" />
                                    Schedule
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchSection