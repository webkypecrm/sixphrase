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
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Department <span className="text-danger">*</span>
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
                                            Role <span className="text-danger">*</span>
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

                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Group  <span className="text-danger">*</span>
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

                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Job Type <span className="text-danger">*</span>
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

                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Work Shift <span className="text-danger">*</span>
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

                                {/* <div className="col-md-12">
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
                                </div> */}

                            </div>
                            {/* <div
                                className="accordion"
                                id="accordionExample"
                            >
                                <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                        <Link
                                            to="#"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-expanded="true"
                                            aria-controls="collapseTwo"
                                        >
                                            Country
                                        </Link>
                                    </div>
                                    <div
                                        className="filter-set-contents accordion-collapse collapse show"
                                        id="collapseTwo"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="filter-content-list">
                                            <div className="form-wrap icon-form">
                                                <span className="form-icon">
                                                    <i className="ti ti-search" />
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search Country"
                                                />
                                            </div>
                                            <ul>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                defaultChecked
                                                            />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>India</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>USA</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>France</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>United Kingdom</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>UAE</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Italy</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Japan</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Germany</h5>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                        <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#owner"
                                            aria-expanded="false"
                                            aria-controls="owner"
                                        >
                                            Owner
                                        </Link>
                                    </div>
                                    <div
                                        className="filter-set-contents accordion-collapse collapse"
                                        id="owner"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="filter-content-list">
                                            <div className="form-wrap icon-form">
                                                <span className="form-icon">
                                                    <i className="ti ti-search" />
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search Owner"
                                                />
                                            </div>
                                            <ul>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                defaultChecked
                                                            />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Hendry</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Guillory</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Jami</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Theresa</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Espinosa</h5>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                        <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#Status"
                                            aria-expanded="false"
                                            aria-controls="Status"
                                        >
                                            Status
                                        </Link>
                                    </div>
                                    <div
                                        className="filter-set-contents accordion-collapse collapse"
                                        id="Status"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="filter-content-list">
                                            <ul>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                defaultChecked
                                                            />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Active</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Inactive</h5>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                        <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-expanded="false"
                                            aria-controls="collapseOne"
                                        >
                                            Rating
                                        </Link>
                                    </div>
                                    <div
                                        className="filter-set-contents accordion-collapse collapse"
                                        id="collapseOne"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="filter-content-list">
                                            <ul>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                defaultChecked
                                                            />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="rating">
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star filled" />
                                                        <span>5.0</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="rating">
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star" />
                                                        <span>4.0</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="rating">
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star" />
                                                        <i className="fa fa-star" />
                                                        <span>3.0</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="rating">
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star" />
                                                        <i className="fa fa-star" />
                                                        <i className="fa fa-star" />
                                                        <span>2.0</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="rating">
                                                        <i className="fa fa-star filled" />
                                                        <i className="fa fa-star" />
                                                        <i className="fa fa-star" />
                                                        <i className="fa fa-star" />
                                                        <i className="fa fa-star" />
                                                        <span>1.0</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-set-content">
                                    <div className="filter-set-content-head">
                                        <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseThree"
                                            aria-expanded="false"
                                            aria-controls="collapseThree"
                                        >
                                            Tags
                                        </Link>
                                    </div>
                                    <div
                                        className="filter-set-contents accordion-collapse collapse"
                                        id="collapseThree"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="filter-content-list">
                                            <ul>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input
                                                                type="checkbox"
                                                                defaultChecked
                                                            />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Promotion</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Rated</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Rejected</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Collab</h5>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="filter-checks">
                                                        <label className="checkboxs">
                                                            <input type="checkbox" />
                                                            <span className="checkmarks" />
                                                        </label>
                                                    </div>
                                                    <div className="collapse-inside-text">
                                                        <h5>Calls</h5>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
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



