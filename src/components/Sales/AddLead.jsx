import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Select from "react-select";
import { TagsInput } from "react-tag-input-component";
import { toast } from 'react-toastify'
import axios from 'axios';
import TagSelect from '../UI/TagSelect';
import LeadFor from './LeadFor';
import Dropdown from '../UI/Dropdown';
import AddNewCompany from './AddNewCompany'

const AddLead = ({ togglePopup, addLead, sourceOptions, categoryOptions, countryOptions, fetchLeadData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const initialForm = {
        leadName: '',
        leadEmail: '',
        leadMobile1: '',
        leadMobile2: '',
        leadMobile3: '',
        leadFor: null,
        description: '',
        value: 0,
        tags: '',
        leadCity: '',
        countryId: 101,
        cityId: null,
        stateId: null,
        industryId: null,
        serviceId: null,
        sourceId: null,
        categoryId: 1,
        companyId: null,
        status: 'active',
        visibility: 'public'
    }
    const [formData, setFormData] = useState(initialForm);
    // const [tagValue, setTagValue] = useState(['Collab']);
    const [newContents, setNewContents] = useState([0]);
    const [leadForOption, setLeadForOption] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [stateOptions, setStateOptions] = useState([])
    const [cityOptions, setCityOptions] = useState([])
    const [serviceOptions, setServiceOptions] = useState([])
    const [addCompany, setAddCompany] = useState(false);
    const [haveCompany, setHaveCompany] = useState(false);
    const [companyOptions, setCompanyOptions] = useState([]);
    // const [wordCount, setWordCount] = useState(0);
    // const maxWords = 500;

    const mobileArr = ['leadMobile1', 'leadMobile2', 'leadMobile3']

    // console.log("formData =>", formData);

    const addNewContent = () => {
        setNewContents([...newContents, newContents.length]);
    };

    const addCompanyPopup = () => {
        setAddCompany(!addCompany);
    };


    const fetchLeadForData = async () => {
        try {
            const response = await fetch(`${apiUrl}/master/lead-for-list`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
            });
            const resData = await response.json();
            const formattedData = resData.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setLeadForOption(formattedData);
        } catch (error) {
            console.log(error)
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target

        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }))

    }

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

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setIsLoading(true)
            const updatedFormData = {
                ...formData,
                // tags: JSON.stringify(tagValue),
                value: formData.value || 0,
                leadFor: JSON.stringify([formData.leadFor]),
            };

            const formDataToSend = new FormData();
            for (const key in updatedFormData) {
                if (updatedFormData[key] !== null) {
                    formDataToSend.append(key, updatedFormData[key])
                }
            }

            const response = await fetch(`${apiUrl}/lead/add-lead`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add lead');
            }
            togglePopup()
            fetchLeadData()
            setFormData(initialForm)
            toast.success('Lead added successfully!');
            setIsLoading(false)
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLeadForData()
    }, [])


    useEffect(() => {
        const fetchStateData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/employee/state-list/${formData.countryId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setStateOptions(formattedData);
            } catch (error) {
                toast.error(error)
            }
        };
        const fetchCityData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/employee/city-list/${formData.stateId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setCityOptions(formattedData);
            } catch (error) {
                toast.error(error)
            }
        };
        if (formData.countryId) {
            fetchStateData()
        }
        if (formData.stateId)
            fetchCityData()
    }, [formData.countryId, formData.stateId])

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/master/service-list-by-lead-for/${formData.leadFor}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setServiceOptions(formattedData);
            } catch (error) {
                toast.error(error)
            }
        };
        if (formData?.leadFor) {
            fetchServiceData()
        }

    }, [formData.leadFor])

    useEffect(() => {
        fetchCompanyData()
    }, [])

    // console.log("formData =>", formData)

    return (
        <>
            <div className={`toggle-popup ${addLead ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Add New Lead </h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={togglePopup}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Source <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                required
                                                value={sourceOptions.find(option => option.value === formData.sourceId) || null}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'sourceId', value } })
                                                }}
                                                options={sourceOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Name (Contact Person)"} <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='leadName'
                                                required
                                                value={formData.leadName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center" >
                                                <label className="col-form-label">
                                                    {"Email (Contact Email)"}   <span className="text-danger"></span>
                                                </label>
                                            </div>
                                            <input
                                                name="leadEmail"
                                                type="email"
                                                className="form-control"
                                                value={formData.leadEmail}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    {newContents.map((index) => (
                                        <div className="col-md-6" key={index} >
                                            <div className="add-product-new">
                                                <div className="row align-items-end">
                                                    <div className="col-md-12">
                                                        <div className="form-wrap mb-2">
                                                            <label className="col-form-label">
                                                                {"Mobile (Contact Number)"} <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                name={mobileArr[index]}
                                                                type="number"
                                                                className="form-control"
                                                                value={formData[mobileArr[index]]}
                                                                maxLength="12"
                                                                minLength="10"
                                                                //  required
                                                                onChange={(event) => {
                                                                    let { value } = event.target
                                                                    if (value.length <= 14) {
                                                                        handleInputChange({ target: { name: mobileArr[index], value } });
                                                                    } else {
                                                                        toast.error("Mobile number should not be more than 14 digits");
                                                                    }

                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                index === 0 && newContents.length < 3 &&
                                                <div className="col-md-6">
                                                    <Link
                                                        onClick={addNewContent}
                                                        to="#"
                                                        className="add-new add-new-phone mb-3 d-block"
                                                    >
                                                        <i className="ti ti-square-rounded-plus me-2" />
                                                        Add New Mobile
                                                    </Link>
                                                </div>
                                            }

                                            {(index === 1 || index === 2) &&
                                                <div className="col-md-6">
                                                    <Link
                                                        onClick={() => {
                                                            setNewContents((prev) => {
                                                                return [...prev.slice(0, index), ...prev.slice(index + 1)]
                                                            }),
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    [mobileArr[index]]: ''
                                                                }))
                                                        }}
                                                        to="#"
                                                        className="add-new add-new-phone mb-3 d-block"
                                                    >
                                                        <i className="ti ti-square-rounded-minus me-2" />
                                                        Remove Mobile
                                                    </Link>
                                                </div>
                                            }
                                        </div>
                                    ))}
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Industry <span className="text-danger"></span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={categoryOptions.find(option => option.value === formData.categoryId)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'categoryId', value } })

                                                }}
                                                options={categoryOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <Dropdown
                                            label="Requirement"
                                            name="leadFor"
                                            value={formData?.leadFor}
                                            isMandatory
                                            onChange={handleInputChange}
                                            options={leadForOption}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Service <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                required
                                                value={serviceOptions.find(option => option.value === formData.serviceId)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'serviceId', value } })
                                                }}
                                                options={serviceOptions}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Country <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={countryOptions.find(option => option.value === formData.countryId)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'countryId', value } })
                                                }}
                                                options={countryOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                State <span className="text-danger"></span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={stateOptions.find(option => option.value === formData.stateId)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'stateId', value } })

                                                }}
                                                options={stateOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                City <span className="text-danger"></span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={cityOptions.find(option => option.value === formData.cityId)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'cityId', value } })
                                                }}
                                                options={cityOptions}
                                            />
                                        </div>
                                    </div>

                                    <div className='dotted-line'>

                                    </div>

                                    <div className="col-md-12">
                                        <div className="radio-wrap form-wrap">
                                            <div className="d-flex flex-wrap">
                                                <div className="radio-btn">
                                                    <input
                                                        type="checkbox"
                                                        className="status-radio"
                                                        id="lead_have_company"
                                                        name="lead_have_company"
                                                        onChange={() => { setHaveCompany((prev) => !prev) }}
                                                    />
                                                    <label htmlFor="lead_have_company">Have a company?</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {haveCompany &&
                                        <div className="col-md-12">
                                            <div className="form-wrap">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <label className="col-form-label">
                                                        Select Company Name<span className="text-danger"></span>
                                                    </label>
                                                    <Link
                                                        to="#"
                                                        className="add-new add-new-company add-popups"
                                                        onClick={addCompanyPopup}
                                                    >
                                                        <i className="ti ti-square-rounded-plus me-2" />
                                                        or Add New Company
                                                    </Link>
                                                </div>
                                                <Select
                                                    classNamePrefix="react-select"
                                                    className="select"
                                                    value={companyOptions.find(option => option.value === formData.companyId)}
                                                    onChange={(event) => {
                                                        let { value } = event
                                                        handleInputChange({ target: { name: 'companyId', value } })
                                                    }}
                                                    options={companyOptions}
                                                />
                                            </div>
                                        </div>
                                    }

                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Remark"} <span className="text-danger">*</span>
                                                {/* (<span className='text-info'>{wordCount}</span>) */}
                                            </label>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                name='description'
                                                required
                                                maxLength={500}
                                                value={formData.description}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className='dotted-line'>
                                    </div>

                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" className="btn btn-light sidebar-close" onClick={togglePopup}>
                                        Cancel
                                    </Link>
                                    {isLoading ?
                                        <button type="submit" disabled className="btn btn-primary">
                                            Saving...
                                        </button>
                                        :
                                        <button type="submit" className="btn btn-primary">
                                            Create
                                        </button>
                                    }

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            <AddNewCompany
                addCompany={addCompany}
                addCompanyPopup={addCompanyPopup}
                sourceOptions={sourceOptions}
                industryOptions={categoryOptions}
                countryOptions={countryOptions}
                handleRefreshCompanyData={fetchCompanyData}
            />

        </>
    )
}

export default AddLead