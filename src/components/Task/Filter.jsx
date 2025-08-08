import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { all_routes } from '../../pages/Router/all_routes'
import Select, { components } from "react-select";
import { toast } from 'react-toastify'
import axios from 'axios';



const Filter = ({
    filterSlider,
    setFilterSlider,
    sourceOptions,
    industryOptions,
    countryOptions,
    setFilterByObj,
    fetchTaskData,
}) => {
    const [companyOptions, setCompanyOptions] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [stageOptions, setStageOptions] = useState([]);
    const [filterByIndusty, setFilterByIndusty] = useState([]);
    const [filterBySource, setFilterBySource] = useState([]);
    const [filterByCountry, setFilterByCountry] = useState([]);
    const [filterByCompany, setFilterByCompany] = useState([]);
    const [filterByLeadOwner, setFilterByLeadOwner] = useState([]);
    const [filterByStage, setFilterByStage] = useState([]);
    const [clickFilter, setClickFilter] = useState(false);



    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const route = all_routes


    const handleFilter = () => {

        setFilterByObj((prev) => ({
            ...prev,
            "industry": filterByIndusty,
            "source": filterBySource,
            "country": filterByCountry,
            "leadOwner": filterByLeadOwner,
            "stage": filterByStage,
        }))

        setFilterSlider(prev => !prev)
        setClickFilter(true)
        // Reset 
        setFilterByIndusty([]);
        setFilterBySource([]);
        setFilterByCountry([]);
        setFilterByLeadOwner([]);
        setFilterByCompany([]);
        setFilterByStage([]);
    }

    const handleReset = () => {
        setFilterByIndusty([]);
        setFilterBySource([]);
        setFilterByCountry([]);
        setFilterByLeadOwner([]);
        setFilterByCompany([]);
        setFilterByStage([]);
    }


    useEffect(() => {

        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/lead/company-list`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.companyName,
                    value: item.companyId
                }));
                setCompanyOptions(formattedData);

            } catch (error) {
                toast.error(error.message)
            }
        };

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

        const fetchStageData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/master/stage-list`);
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setStageOptions(() => [...formattedData]);
            } catch (error) {
                toast.error(error.message)
            }
        };


        fetchCompanyData()
        fetchStaffData()
        fetchStageData()

    }, [])

    useEffect(() => {
        if (clickFilter) {
            fetchTaskData()
            setClickFilter(false)
        }

    }, [clickFilter])


    return (
        <>
            <div className={`toggle-popup ${filterSlider ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
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
                                <div className="col-md-6">
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

                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Industry <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            isMulti
                                            classNamePrefix="react-select"
                                            className="basic-multi-select"
                                            value={industryOptions.filter(option => filterByIndusty.includes(option.value))}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                setFilterByIndusty(values)
                                            }}
                                            options={industryOptions}
                                            components={{ Option: CheckboxOption }} // Use custom checkbox component
                                            closeMenuOnSelect={false} // Keep menu open after selecting
                                            hideSelectedOptions={false} // Show selected options in dropdown
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Country <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            isMulti
                                            classNamePrefix="react-select"
                                            className="basic-multi-select"
                                            value={countryOptions.filter(option => filterByCountry.includes(option.value))}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                setFilterByCountry(values)
                                            }}
                                            options={countryOptions}
                                            components={{ Option: CheckboxOption }} // Use custom checkbox component
                                            closeMenuOnSelect={false} // Keep menu open after selecting
                                            hideSelectedOptions={false} // Show selected options in dropdown
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Lead Owner <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            isMulti
                                            classNamePrefix="react-select"
                                            className="basic-multi-select"
                                            value={staffOptions.filter(option => filterByLeadOwner.includes(option.value))}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                setFilterByLeadOwner(values)
                                            }}
                                            options={staffOptions}
                                            components={{ Option: CheckboxOption }} // Use custom checkbox component
                                            closeMenuOnSelect={false} // Keep menu open after selecting
                                            hideSelectedOptions={false} // Show selected options in dropdown
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Stage <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            isMulti
                                            classNamePrefix="react-select"
                                            className="basic-multi-select"
                                            value={stageOptions.filter(option => filterByStage.includes(option.value))}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                setFilterByStage(values)
                                            }}
                                            options={stageOptions}
                                            components={{ Option: CheckboxOption }} // Use custom checkbox component
                                            closeMenuOnSelect={false} // Keep menu open after selecting
                                            hideSelectedOptions={false} // Show selected options in dropdown
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Company <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            isMulti
                                            classNamePrefix="react-select"
                                            className="basic-multi-select"
                                            value={companyOptions.filter(option => filterByCompany.includes(option.value))}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                setFilterByCompany(values)
                                            }}
                                            options={companyOptions}
                                            components={{ Option: CheckboxOption }} // Use custom checkbox component
                                            closeMenuOnSelect={false} // Keep menu open after selecting
                                            hideSelectedOptions={false} // Show selected options in dropdown
                                        />
                                    </div>
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



