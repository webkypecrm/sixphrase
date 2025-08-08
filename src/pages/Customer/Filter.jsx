import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../../pages/Router/all_routes'
import Select, { components } from "react-select";
import { toast } from 'react-toastify'
import axios from 'axios';
import Dropdown from '../../components/UI/Dropdown';

const Filter = ({
    filterSlider,
    setFilterSlider,
    sourceOptions,
    countryOptions,
    setFilterByObj,
    fetchLeadData,
    leadForOpitons
}) => {
    const [staffOptions, setStaffOptions] = useState([]);
    const [filterBySource, setFilterBySource] = useState([]);
    const [filterByCountry, setFilterByCountry] = useState([]);
    const [filterByCompany, setFilterByCompany] = useState([]);
    const [filterByLeadOwner, setFilterByLeadOwner] = useState([]);
    const [filterByAssignedTo, setFilterByAssignedTo] = useState([]);
    const [filterByLeadFor, setFilterByLeadFor] = useState([]);
    const [clickFilter, setClickFilter] = useState(false);

    const initialForm = {
        cityId: null,
        stateId: null,
        countryId: null,
        leadFor: null,
    }
    const [filterFormData, setFilterFormData] = useState(initialForm);

    const handleInputChange = (event) => {
        const { name, value } = event.target

        setFilterByLeadFor(() => ([value]))

        setFilterFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
    }

    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const route = all_routes

    const handleFilter = () => {

        const country = filterFormData?.countryId ? [filterFormData.countryId] : []
        const state = filterFormData?.stateId ? [filterFormData.stateId] : []
        const city = filterFormData?.cityId ? [filterFormData.cityId] : []

        setFilterByObj((prev) => ({
            ...prev,
            "source": filterBySource,
            "leadOwner": filterByLeadOwner,
            "customerOwner": filterByAssignedTo,
            "company": filterByCompany,
            "country": country,
            "state": state,
            "city": city,
            "leadFor": filterByLeadFor
        }))

        setFilterSlider(prev => !prev)
        setClickFilter(true)
        // Reset 
        setFilterBySource([]);
        setFilterByCountry([]);
        setFilterByLeadOwner([]);
        setFilterByAssignedTo([]);
        setFilterByCompany([]);
        setFilterByLeadFor([]);
    }

    const handleReset = () => {
        setFilterBySource([]);
        setFilterByCountry([]);
        setFilterByLeadOwner([]);
        setFilterByAssignedTo([])
        setFilterByCompany([]);
        setFilterByLeadFor([]);

        setFilterFormData((prevForm) => ({
            ...prevForm,
            cityId: null,
            stateId: null,
            countryId: null,
            leadFor: null
        }))
    }


    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/staff/staff-list`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.staffId
                }));
                setStaffOptions(() => [...formattedData]);

            } catch (error) {
                toast.error(error);
            }
        };

        fetchStaffData()

    }, [])

    useEffect(() => {
        if (clickFilter) {
            fetchLeadData()
            setClickFilter(false)
        }
    }, [clickFilter])

    // console.log("filterFormData =>", filterFormData);

    return (
        <>
            <div className={`toggle-popup ${filterSlider ? "sidebar-popup" : ""}`} >
                <div className="sidebar-layout" style={{ width: '400px' }} >
                    <div className="sidebar-header">
                        <h4>
                            <i className="ti ti-filter-share" />
                            Filter
                        </h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => {
                                setFilterSlider(prev => !prev)
                            }}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="col-xl-12">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Source <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            isMulti
                                            classNamePrefix="react-select"
                                            className="basic-multi-select"
                                            value={sourceOptions.filter(option => filterBySource.includes(option.value))}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                setFilterBySource(values)
                                            }}
                                            options={sourceOptions}
                                            components={{ Option: CheckboxOption }} // Use custom checkbox component
                                            closeMenuOnSelect={false} // Keep menu open after selecting
                                            hideSelectedOptions={false} // Show selected options in dropdown
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Country <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={countryOptions.find(option => option.value === filterFormData.countryId)}
                                            onChange={(event) => {
                                                let { value } = event
                                                handleInputChange({ target: { name: 'countryId', value } })
                                            }}
                                            options={countryOptions}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Assign To <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            isMulti
                                            classNamePrefix="react-select"
                                            className="basic-multi-select"
                                            value={staffOptions.filter(option => filterByAssignedTo.includes(option.value))}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                setFilterByAssignedTo(values)
                                            }}
                                            options={staffOptions}
                                            components={{ Option: CheckboxOption }} // Use custom checkbox component
                                            closeMenuOnSelect={false} // Keep menu open after selecting
                                            hideSelectedOptions={false} // Show selected options in dropdown
                                        />
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <Dropdown
                                        label="Lead For"
                                        name="leadFor"
                                        value={filterFormData?.leadFor}
                                        onChange={handleInputChange}
                                        options={leadForOpitons}
                                    />
                                </div>
                            </div>

                            <div className="filter-reset-btns">
                                <div className="row">
                                    <div className="col-6">
                                        <Link to="#" className="btn btn-light" onClick={handleReset}>
                                            Reset
                                        </Link>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            to='#'
                                            className="btn btn-primary"
                                            onClick={handleFilter}
                                        >
                                            Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Filter


// Custom Option component to add checkboxes
const CheckboxOption = (props) => {
    return (
        <components.Option {...props}>
            <input
                type="checkbox"
                checked={props.isSelected}
                onChange={() => null} // To prevent React warnings
                style={{ marginRight: 8 }}
            />
            <label>{props.label}</label>
        </components.Option>
    );
};



