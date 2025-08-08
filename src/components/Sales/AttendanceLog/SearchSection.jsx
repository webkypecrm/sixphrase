import React, { useContext, useEffect, useState } from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import Dropdown from '../../UI/Dropdown';
import { AuthContext } from '../../../context/AuthProvider';


const SearchSection = ({
    filterByObj,
    setFilterByObj,
    fetchUpcomintAppointmentData,
    staffOptions
}) => {
    const { staffData } = useContext(AuthContext);

    const handleInputChange = (event) => {
        const { name, value } = event.target

        // setFilterByLeadFor(() => ([value]))

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
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()), // Ends after 3 days
        ranges: {
            "Last 30 Days": [
                new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30),
                today,
            ],
            "Last 7 Days": [
                new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
                today,
            ],
            "Last 3 Days": [
                new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2), // 3 days before today
                today,
            ],
            "This Month": [
                new Date(today.getFullYear(), today.getMonth(), 1), // First day of current month
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
            Today: [today, today], // Set today as the default range
            Yesterday: [yesterday, yesterday], // Set yesterday as the default range
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

    return (
        <div className="search-section ">
            <div className="row">
                <div className="col-md-5 col-sm-4" style={{ width: '100%' }}>
                    <div className="form-wrap icon-form">
                        <ul style={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            gap: "20px"
                        }}>
                            <li style={{width:"26%"}}>
                                <div className=" icon-form ">
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

                            {staffData?.staffId === 1 &&
                                <li style={{ width: '214px' }}>
                                    <div className=" icon-form">
                                        <Dropdown
                                            name="assignedTo"
                                            placeholder={'Select Employee'}
                                            value={filterByObj?.assignedTo}
                                            onChange={handleInputChange}
                                            options={staffOptions}
                                        />
                                    </div>
                                </li>
                            }

{staffData?.staffId === 1 &&
                                <li style={{ width: '214px' }}>
                                    <div className=" icon-form">
                                        <Dropdown
                                            name="status"
                                            placeholder={'Status'}
                                            value={filterByObj?.status}
                                            onChange={handleInputChange}
                                            options={[
                                                { label: 'Select Status', value: '' },
                                                { label: 'Present', value: 'Present' },
                                                { label: 'Absent', value: 'Absent' },
                                                { label: 'Leave', value: 'Leave' }
                                              ]}
                                        />
                                    </div>
                                </li>
                            }

{staffData?.staffId === 1 &&
                                <li style={{ width: '214px' }}>
                                    <div className=" icon-form">
                                        <Dropdown
                                            name="workPlace"
                                            placeholder={'Work Place'}
                                            value={filterByObj?.workPlace}
                                            onChange={handleInputChange}
                                            options={
                                                [
                                                    { label: 'Select From', value: '' },
                                                    { label: 'WFH', value: 'WFH' },
                                                    { label: 'WFO', value: 'WFO' }
                                                  ]
                                            }
                                        />
                                    </div>
                                </li>
                            }

{staffData?.staffId === 1 &&
                                <li style={{ width: '214px' }}>
                                    <div className=" icon-form">
                                        <Dropdown
                                            name="timeFlag"
                                            placeholder={'Job Flag'}
                                            value={filterByObj?.timeFlag}
                                            onChange={handleInputChange}
                                            options={[
                                                { label: 'Select Flag', value: '' },
                                                { label: 'On Time', value: 'On Time' },
                                                { label: 'Late', value: 'Late' },
                                                { label: 'Half Day', value: 'Half Day' },
                                                { label: 'Absent', value: 'Absent' }
                                            ]}
                                        />
                                    </div>
                                </li>
                            }

                            


                        </ul>
                    </div>
                </div>
                <div className="col-md-7 col-sm-8" style={{ width: '80%' }}>
                    <div className="export-list text-sm-end">

                    </div>
                </div>
            </div>
        </div>
    )
}   

export default SearchSection