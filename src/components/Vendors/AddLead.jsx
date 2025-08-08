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

const AddLead = ({ togglePopup, addLead, sourceOptions, categoryOptions, countryOptions, fetchLeadData, vendorCategoryOptions }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const initialForm = {
        vendorName: '',
        vendorEmail: '',
        vendorMobile1: '',
        vendorMobile2: '',
        vendorMobile3: '',
        bankDetails: '',
        description: '',
        supportCommunication: '',
        documentation: '',
        qualityStandard: '',
        packagingDelivery: '',
        companyId: null,
        vendorCategoryId: null,
        vendorSubCategoryId: null,
        contactName: '',
        contactEmail: '',
        contactMobile1: '',
        contactMobile2: '',
        contactMobile3: '',
        website: '',
        gstNo: '',
        address: '',
        cityId: null,
        stateId: null,
        countryId: null,
        pincode: '',
        vendorImg: null,

    }
    const [formData, setFormData] = useState(initialForm);
    const [newContents, setNewContents] = useState([0]);
    const [isLoading, setIsLoading] = useState(false);
    const [addCompany, setAddCompany] = useState(false);
    const [haveCompany, setHaveCompany] = useState(false);
    // const [companyOptions, setCompanyOptions] = useState([]);
    const [vendorSubCategoryOptions, setVendorSubCategoryOptions] = useState([]);

    const [vendorImgFile, setvendorImgFile] = useState(null);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    const mobileArr = ['contactMobile1', 'contactMobile2', 'contactMobile3']

    // console.log("formData =>", formData);

    const addNewContent = () => {
        setNewContents([...newContents, newContents.length]);
    };

    const addCompanyPopup = () => {
        setAddCompany(!addCompany);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target

        const validFields = ["supportCommunication", "documentation", "qualityStandard", "packagingDelivery"];

        if (validFields.includes(name)) {
            const numericValue = Number(value); // Convert value to number

            if (isNaN(numericValue) || numericValue < 0 || numericValue > 5) {
                toast.error("Please enter a value between 0 and 5");
                return;
            }
        }

        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }))

    }

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const vendorImgFile = files[0];
            if (vendorImgFile.type.startsWith("image/")) {
                if (vendorImgFile.size <= 1024 * 1024) {
                    setvendorImgFile(vendorImgFile)
                    setFormData((prevData) => ({
                        ...prevData,
                        vendorImg: vendorImgFile
                    }))
                } else {
                    toast.error('File size exceeds 800k');
                }
            }
        }
    }

    // const fetchVendorCompanyData = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}/vendor/vendor-company-list`, {
    //             headers: {
    //                 Authorization: `Bearer ${Token}`
    //             }
    //         });
    //         const formattedData = response.data.data.map((item) => ({
    //             label: item.companyName,
    //             value: item.companyId
    //         }));
    //         setCompanyOptions(formattedData);

    //     } catch (error) {
    //         toast.error(error.message)
    //     }
    // };

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            setIsLoading(true)
            const updatedFormData = {
                ...formData,
            };

            const formDataToSend = new FormData();
            for (const key in updatedFormData) {
                if (updatedFormData[key] !== null) {
                    formDataToSend.append(key, updatedFormData[key])
                }
            }

            const response = await fetch(`${apiUrl}/vendor/add-vendor`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add vendor');
            }
            togglePopup()
            fetchLeadData()
            setFormData(initialForm)
            toast.success('Vendor added successfully!');
            setIsLoading(false)
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const fetchVendorSubCategoryData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/master/vendor-sub-category-list-by-vendor-category/${formData.vendorCategoryId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setVendorSubCategoryOptions(formattedData);
            } catch (error) {
                toast.error(error)
            }
        };


        const fetchStaffDropdownData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/staff/staff-dropdown`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setVendorSubCategoryOptions(formattedData);
            } catch (error) {
                toast.error(error)
            }
        };

        if (formData?.vendorCategoryId) {
            fetchVendorSubCategoryData()
        }

    }, [formData.vendorCategoryId])

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
        if (formData?.countryId) {
            fetchStateData()
        }
        if (formData?.stateId)
            fetchCityData()
    }, [formData?.countryId, formData?.stateId])

    // useEffect(() => {
    //     fetchVendorCompanyData()
    // }, [])

    console.log("formData =>", formData)

    return (
        <>
            <div className={`toggle-popup ${addLead ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Add New Vendor</h4>
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

                                    <div className="col-md-12">
                                        <div className="profile-pic-upload">
                                            <div className="profile-pic">
                                                {vendorImgFile ?
                                                    <div>
                                                        <img
                                                            src={URL.createObjectURL(vendorImgFile)}
                                                            alt="Image selected"
                                                        />
                                                    </div> :
                                                    <span>
                                                        <i className="ti ti-photo" />
                                                    </span>
                                                }
                                            </div>
                                            <div className="upload-content">
                                                <div className="upload-btn"  >
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                    />
                                                    <span >
                                                        <i className="ti ti-file-broken" />
                                                        Upload Logo
                                                    </span>
                                                </div>
                                                <p>JPG, GIF or PNG. Max size of 1 MB</p>
                                                {vendorImgFile &&
                                                    <button
                                                        className="btn btn-light"
                                                        type="button"
                                                        onClick={() => { setvendorImgFile(null) }}
                                                    >
                                                        Remove
                                                    </button>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Vendor Category <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                required
                                                value={vendorCategoryOptions.find(option => option.value === formData.vendorCategoryId) || null}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'vendorCategoryId', value } })
                                                }}
                                                options={vendorCategoryOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Vendor Sub Category <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                required
                                                value={vendorSubCategoryOptions.find(option => option.value === formData.vendorSubCategoryId) || null}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'vendorSubCategoryId', value } })
                                                }}
                                                options={vendorSubCategoryOptions}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Name (Contact Person)"} <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='contactName'
                                                required
                                                value={formData.contactName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center" >
                                                <label className="col-form-label">
                                                    {"Email (Contact Email)"}   <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                            <input
                                                name="contactEmail"
                                                type="email"
                                                required
                                                className="form-control"
                                                value={formData.contactEmail}
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
                                                                maxLength="14"
                                                                minLength="10"
                                                                required
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

<div className='dotted-line'>
</div>

                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Vendor Name
                                            </label> <span className="text-danger">*</span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='vendorName'
                                                required
                                                value={formData.vendorName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    Vendor Email <span className="text-danger">*</span>
                                                </label>
                                                <div className="status-toggle small-toggle-btn d-flex align-items-center">
                                                    <span className="me-2 label-text">
                                                        Email Opt Out
                                                    </span>
                                                    <input
                                                        type="checkbox"
                                                        id="user"
                                                        className="check"
                                                        defaultChecked={true}
                                                    />
                                                    <label
                                                        htmlFor="user"
                                                        className="checktoggle"
                                                    />
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='vendorEmail'
                                                value={formData.vendorEmail}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center" >
                                                <label className="col-form-label">
                                                    {"Vendor Mobile"}   <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                            <input
                                                name="vendorMobile1"
                                                type="number"
                                                required
                                                className="form-control"
                                                value={formData.vendorMobile1}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>


                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                GST Number
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='gstNo'

                                                value={formData.gstNo}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Website
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='website'

                                                value={formData.website}
                                                onChange={handleInputChange}
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
                                                value={countryOptions.find(option => option.value === formData.countryId) || null}
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
                                                State <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={stateOptions.find(option => option.value === formData.stateId) || null}
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
                                                City <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={cityOptions.find(option => option.value === formData.cityId) || null}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'cityId', value } })
                                                }}
                                                options={cityOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Street Address <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='address'
                                                required
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Pincode <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name='pincode'
                                                required
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>





                                    <div className='dotted-line'>
                                    </div>

                                   

                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Bank Details"} <span className="text-danger">*</span>
                                            </label>
                                            {" "}<span >500 words only</span>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                name='bankDetails'
                                                rows={3}
                                                required
                                                maxLength={500}
                                                value={formData.bankDetails}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Remarks"} <span className="text-danger">*</span>
                                            </label>
                                            {" "}<span >500 words only</span>
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

                                    <div className="col-md-3">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Quality Standard"}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder='Rate out of 5'
                                                name='qualityStandard'
                                                required
                                                value={formData.qualityStandard}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Packaging & Delivery"}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name='packagingDelivery'
                                                placeholder='Rate out of 5'
                                                required
                                                value={formData.packagingDelivery}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Documentation"}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name='documentation'
                                                placeholder='Rate out of 5'
                                                required
                                                min="0"
                                                max="5"
                                                value={formData.documentation}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Support & Comm."}
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name='supportCommunication'
                                                placeholder='Rate out of 5'
                                                required
                                                value={formData.supportCommunication}
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

            {/* <AddNewCompany
                addCompany={addCompany}
                addCompanyPopup={addCompanyPopup}
                sourceOptions={sourceOptions}
                industryOptions={categoryOptions}
                countryOptions={countryOptions}
                handleRefreshCompanyData={fetchVendorCompanyData}
            /> */}

        </>
    )
}

export default AddLead