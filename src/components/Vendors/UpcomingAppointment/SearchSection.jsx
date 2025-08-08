import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import DateRangePicker from 'react-bootstrap-daterangepicker'
import Dropdown from '../../UI/Dropdown';
import { AuthContext } from '../../../context/AuthProvider';


const SearchSection = ({
    togglePopup,
    filterByObj,
    setFilterByObj,
    fetchUpcomintAppointmentData,
    staffOptions
}) => {
    const { staffData } = useContext(AuthContext);

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFilterByObj((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
    }

    const handleApply = (event, picker) => {
        const start = picker.startDate.format('YYYY-MM-DD HH:mm:ss.SSS');
        const end = picker.endDate.format('YYYY-MM-DD HH:mm:ss.SSS');

        console.log("start =>", start)
        console.log("end =>", end)

        setFilterByObj((prev) => ({
            ...prev,
            from: start ? start : "",
            to: end
        }));
    }

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const initialSettings = {
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6), // Ends after 7 days
        ranges: {
            "Last 30 Days": [
                new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
                today,
            ],
            "Next 3 Days": [
                today,
                new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), // Covers 3 days
            ],
            "Next 7 Days": [
                today,
                new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6), // Covers 7 days
            ],
            "Next 30 Days": [
                today,
                new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30),
            ],
            Today: [today, today], // Set today as the default range
            // Yesterday: [yesterday, yesterday], // Set yesterday as the default range
        },
        startDate: today, // Default to today
        timePicker: false,
    };

    useEffect(() => {
        if (filterByObj.from) {
            fetchUpcomintAppointmentData()
        }
        fetchUpcomintAppointmentData()
    }, [filterByObj])

    useEffect(() => {
        const formatDate = (date) => {
            return date.toISOString().replace("T", " ").slice(0, -1);
        };

        const today = new Date();
        const startDate = formatDate(today);
        const endDate = formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6));

        setFilterByObj((prev) => ({
            ...prev,
            from: startDate,
            to: endDate,
        }));
    }, []);

    return (
        <div className="search-section">
            <div className="row">
                <div className="col-md-8 col-sm-4" style={{ width: '80%' }}>
                    <div className="form-wrap icon-form">
                        <ul style={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            gap: "20px"
                        }}>
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
                            {staffData?.staffType === 1 &&
                                <li style={{ width: '214px' }}>
                                    <div className=" icon-form">
                                        <Dropdown
                                            name="assignedTo"
                                            value={filterByObj?.assignedTo}
                                            onChange={handleInputChange}
                                            options={staffOptions}
                                        />
                                    </div>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
                <div className="col-md-2 col-sm-4" style={{ marginLeft: '1.5rem' }} >
                    <div className="export-list text-sm-end" >
                        <ul style={{ marginTop: '12px' }}>
                            <li>
                                <Link
                                    to="#"
                                    className="btn btn-primary add-popup"
                                    onClick={() => togglePopup(false)}
                                >
                                    <i className="ti ti-square-rounded-plus" />
                                    Add New
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