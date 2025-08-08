import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Select from "react-select";
import { TagsInput } from "react-tag-input-component";
import { toast } from 'react-toastify'
import axios from 'axios';
import LeadFor from '../Sales/LeadFor';
import Dropdown from '../UI/Dropdown';

const EditCustomer = ({
    togglePopupTwo,
    editCompany,
    sourceOptions,
    categoryOptions,
    countryOptions,
    fetchCustomerData,
    customerDetails,
    setCustomerDetails,
    leadForOpitons
}) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const mobileArr = ['customerMobile1', 'customerMobile2', 'customerMobile3']

    const initialForm = {
        customerId: customerDetails?.customerId ,
        leadName: customerDetails?.customerName,
        customerEmail: customerDetails?.customerEmail,
        customerMobile1: customerDetails?.customerMobile1,
        customerMobile2: customerDetails?.customerMobile2,
        customerMobile3: customerDetails?.customerMobile3,
        value: customerDetails?.value,
        tags: customerDetails?.tags,
        companyId: customerDetails?.companyId,
        countryId: customerDetails?.countryId,
        stateId: customerDetails?.stateId,
        cityId: customerDetails?.cityId,
        sourceId: customerDetails?.sourceId,
        customerFor: customerDetails?.leadFor,
        categoryId: customerDetails?.categoryId || 1,
        description: customerDetails?.description,
        assignTo: customerDetails?.assignedStaffId,
        leadCity: customerDetails?.leadCity

    }
    const [formData, setFormData] = useState(initialForm);
    const [tagValue, setTagValue] = useState(['Collab']);
    const [newContents, setNewContents] = useState([0]);
    // const [stateOptions, setStateOptions] = useState([])
    // const [cityOptions, setCityOptions] = useState([])

    const addNewContent = () => {
        setNewContents([...newContents, newContents.length]);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const leadForArr = [formData.leadFor]
            const updatedFormData = {
                ...formData,
                leadFor: JSON.stringify(leadForArr),
                tags: JSON.stringify(tagValue)
            }
            const formDataToSend = new FormData();
            for (const key in updatedFormData) {
                if (updatedFormData[key] !== null) {
                    formDataToSend.append(key, updatedFormData[key])
                }
            }
            const response = await fetch(`${apiUrl}/customer/edit-customer`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to Edit Customer');
            }
            togglePopupTwo()
            fetchCustomerData()
            setCustomerDetails(null)
            toast.success('Customer edited successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        if (customerDetails?.customerId) {
            setFormData(() => ({
                customerId: customerDetails.customerId,
                customerName: customerDetails.customerName,
                customerEmail: customerDetails.customerEmail,
                customerMobile1: customerDetails.customerMobile1,
                customerMobile2: customerDetails.customerMobile2,
                customerMobile3: customerDetails.customerMobile3,
                value: customerDetails.value,
                tags: customerDetails.tags,
                companyId: customerDetails.companyId,
                countryId: customerDetails.countryId,
                stateId: customerDetails.stateId,
                cityId: customerDetails.cityId,
                sourceId: customerDetails.sourceId,
                leadFor: customerDetails?.leadFor[0] || '',
                categoryId: customerDetails.categoryId,
                description: customerDetails.description,
                assignTo: customerDetails.assignedStaffId
            }))
        }
    }, [customerDetails])

    // console.log("customerDetails =>", customerDetails);

    return (
        <>
            <div className={`toggle-popup ${editCompany ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Edit Customer</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => {
                                togglePopupTwo()
                                setCustomerDetails(null)
                            }}
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
                                                value={sourceOptions.find(option => option.value === formData.sourceId)}
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
                                                name='customerName'
                                                required
                                                value={formData.customerName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {"Email (Contact Email)"}   <span className="text-danger"></span>
                                                </label>
                                            </div>
                                            <input
                                                name="customerEmail"
                                                type="email"
                                                className="form-control"
                                                value={formData.customerEmail}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Category
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={categoryOptions.find(option => option.value ===formData.categoryId)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'categoryId', value } })

                                                }}
                                                options={categoryOptions}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <LeadFor
                                            setFormData={setFormData}
                                            formData={formData}
                                        />
                                    </div> */}

                                    <div className="col-md-6">
                                        <Dropdown
                                            label="Lead For"
                                            name="leadFor"
                                            value={formData?.leadFor}
                                            isMandatory
                                            onChange={handleInputChange}
                                            options={leadForOpitons}
                                        />
                                    </div>


                                    {newContents.map((index) => (
                                        <div className="col-md-6" key={index} >
                                            <div className="add-product-new">
                                                <div className="row align-items-end">
                                                    <div className="col-md-12">
                                                        <div className="form-wrap mb-2">
                                                            <label className="col-form-label">
                                                                {"Mobile (Contact Number)"} <span className="text-danger"></span>
                                                            </label>
                                                            <input
                                                                name={mobileArr[index]}
                                                                type="number"
                                                                className="form-control"
                                                                value={formData[mobileArr[index]]}
                                                                maxLength="12"
                                                                minLength="10"
                                                                required
                                                                onChange={(event) => {
                                                                    let { value } = event.target
                                                                    if (value.length <= 10) {
                                                                        handleInputChange({ target: { name: mobileArr[index], value } });
                                                                    } else {
                                                                        toast.error("Mobile number should not be more than 10 digits");
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
                                    <div className="col-md-6">
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
                                    {/* <div className="col-md-4">
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
                                    */}

                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                City <span className="text-danger"></span>
                                            </label>
                                            <input
                                                className="form-control"
                                                name="leadCity"
                                                type='text'
                                                value={formData?.leadCity}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Remark"} <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                name='description'
                                                value={formData.description}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className='dotted-line'>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Tags <span className="text-danger"></span>
                                            </label>

                                            <TagsInput
                                                className="input-tags form-control"
                                                value={tagValue}
                                                onChange={setTagValue}
                                            />
                                        </div>
                                    </div> */}
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" className="btn btn-light sidebar-close" onClick={togglePopupTwo}>
                                        Cancel
                                    </Link>
                                    <button type="submit" className="btn btn-primary">
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default EditCustomer