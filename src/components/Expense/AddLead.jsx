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
        expenseDate: '',
        vendorVendorId: null,
        vendorCategoryId: null,
        vendorSubCategoryId: null,
        bankDetails: '',
        payableAmount: '',
        gst: '',
        totalPayable: '',
        uploadBills: '', // PDF file
        staffId: null,
        // paidAmount: '',
        // gstAmount: '',
        // gstPaid: true,
        // tdsDeducted: '', // 2% | 3% | 5% | 10% | 20%
        // tdsAmount: '',
        // fromAccount: '', // ICICI/INDUS/PHONEPE/CASH/CREDIT
        // paymentMode: '',
        // transactionId: '',
        // remark: '',
        // uploadProof: '',
    };
    const [formData, setFormData] = useState(initialForm);
    const [newContents, setNewContents] = useState([0]);
    const [isLoading, setIsLoading] = useState(false);
    const [addCompany, setAddCompany] = useState(false);
    const [uploadBillsFile, setUploadBillsFile] = useState(null);
    const [vendorSubCategoryOptions, setVendorSubCategoryOptions] = useState([]);
    const [vendorDetails, setVendorDetails] = useState({});
    const [vendorOptions, setVendorOptions] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const uploadBillsFiles = files[0];
            if (uploadBillsFiles.type.startsWith("image/") || uploadBillsFiles.type.startsWith("application/pdf")) {
                if (uploadBillsFiles.size <= 1024 * 1024) {
                    setUploadBillsFile(uploadBillsFiles)
                    setFormData((prevData) => ({
                        ...prevData,
                        uploadBills: uploadBillsFiles
                    }))
                } else {
                    toast.error('File size exceeds 800k');
                }
            }
        }
    }

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

            const response = await fetch(`${apiUrl}/expense/add-expense`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add expense');
            }
            togglePopup()
            fetchLeadData()
            setFormData(initialForm)
            toast.success('Expense added successfully!');
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
                toast.error(error.message || "Error fetching vendor sub-categories");
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
                    value: item.staffId
                }));
                setStaffOptions(formattedData);
            } catch (error) {
                toast.error(error.message || "Error fetching staff dropdown");
            }
        };

        // console.log('formData.vendorCategoryId =>', formData.vendorCategoryId)

        if (formData?.vendorCategoryId == '2') {
            fetchStaffDropdownData();
            setFormData((prevData) => ({
                ...prevData,
                vendorSubCategoryId: null,
                vendorVendorId: null,
                bankDetails: '',
            }))
        } else {
            fetchVendorSubCategoryData();
            setFormData((prevData) => ({
                ...prevData,
                staff: null,
            }))

        }
    }, [formData.vendorCategoryId, Token]); // Ensure correct dependencies


    useEffect(() => {
        if (formData?.vendorVendorId) {
            setFormData((prevData) => ({
                ...prevData,
                bankDetails: vendorDetails?.bankDetails,
            }))
        }

    }, [formData.vendorVendorId, vendorDetails])

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/vendor/vendor-list?vendorSubCategoryId=${formData.vendorSubCategoryId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.vendorName,
                    value: item.vendorId,
                    data: item
                }));
                setVendorOptions(formattedData);
            } catch (error) {
                console.log(error)
            }
        };

        if (formData?.vendorSubCategoryId) {
            fetchVendorData()
        }

    }, [formData.vendorSubCategoryId])

    useEffect(() => {
        if (formData?.payableAmount) {
            const gstValue = Number(formData.gst) || 0; // Ensure valid number
            const totalPayableAmount = Number(formData.payableAmount) + (Number(formData.payableAmount) * gstValue) / 100;
            setFormData((prevData) => ({
                ...prevData,
                totalPayable: totalPayableAmount
            }));
        }
    }, [formData.payableAmount, formData.gst]); // ✅ Added formData.gst in dependencies

    console.log("formData =>", formData)

    // console.log('uploadBillsFile =>', uploadBillsFile)
    // console.log('vendorOptions =>', vendorOptions)

    return (
        <>
            <div className={`toggle-popup ${addLead ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Add New Expense</h4>
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
                                                {"Expense Date"} <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name='expenseDate'
                                                required
                                                value={formData.expenseDate}
                                                onChange={handleInputChange}
                                            />
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
                                    {formData?.vendorCategoryId == "2" &&
                                        <div className="col-md-12">
                                            <div className="form-wrap">
                                                <label className="col-form-label">
                                                    Vendor Sub Category <span className="text-danger">*</span>
                                                </label>
                                                <Select
                                                    classNamePrefix="react-select"
                                                    className="select"
                                                    required
                                                    value={staffOptions.find(option => option.value == formData?.staffId) || null}
                                                    onChange={(event) => {
                                                        let { value } = event
                                                        handleInputChange({ target: { name: 'staffId', value } })
                                                    }}
                                                    options={staffOptions}
                                                />
                                            </div>
                                        </div>
                                    }
                                    {formData?.vendorCategoryId != "2" &&
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
                                    }
                                    {formData?.vendorCategoryId != "2" &&
                                        <>
                                            <div className="col-md-6">
                                                <div className="form-wrap">
                                                    <label className="col-form-label">
                                                        Vendor Name <span className="text-danger">*</span>
                                                    </label>
                                                    <Select
                                                        classNamePrefix="react-select"
                                                        className="select"
                                                        required
                                                        value={vendorOptions.find(option => option.value === formData.vendorVendorId) || null}
                                                        onChange={(event) => {
                                                            let { value, data } = event;
                                                            console.log("event =>", event)
                                                            handleInputChange({ target: { name: 'vendorVendorId', value } })
                                                            setVendorDetails(() => ({
                                                                ...data
                                                            }))
                                                        }}
                                                        options={vendorOptions}
                                                    />
                                                </div>
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
                                                        disabled
                                                        maxLength={500}
                                                        value={formData.bankDetails}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    }




                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Payable Amount"} <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name='payableAmount'
                                                required
                                                value={formData.payableAmount}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center" >
                                                <label className="col-form-label">
                                                    {"Taxes (GST)"}   
                                                </label>
                                            </div>
                                            <input
                                                name="gst"
                                                type="number"
                                                placeholder='In %'
                                                className="form-control"
                                                value={formData.gst}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center" >
                                                <label className="col-form-label">
                                                    {"Total Payable"}   <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                            <input
                                                name="totalPayable"
                                                type="number"
                                                required
                                                className="form-control"
                                                value={formData.totalPayable}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className='dotted-line'>
                                    </div>
                                    {/* <div className="col-md-12">
                                        <div className="profile-pic-upload">
                                            <div className="profile-pic">
                                                {uploadBillsFile ?
                                                    <div className="img-upload">
                                                        <i className="ti ti-file-broken" />
                                                        {uploadBillsFile ? uploadBillsFile.name : 'Upload File'}
                                                    </div>
                                                    :
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
                                                        Upload Bills / Invoice
                                                    </span>
                                                </div>
                                                <p>JPG, GIF, PNG. of PDF. Max size of 1 MB</p>
                                                {uploadBillsFile &&
                                                    <button
                                                        className="btn btn-light"
                                                        type="button"
                                                        onClick={() => { setUploadBillsFile(null) }}
                                                    >
                                                        Remove
                                                    </button>}
                                            </div>
                                        </div>
                                    </div>                                     */}
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Upload Bills / Invoice <span className="text-danger">*</span>
                                        </label>
                                        <div className="drag-attach">
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            <div className="img-upload">
                                                <i className="ti ti-file-broken" />
                                                {uploadBillsFile ? uploadBillsFile.name : 'Upload File'}
                                            </div>
                                        </div>
                                        {uploadBillsFile &&
                                            <button
                                                className="btn btn-light"
                                                type="button"
                                                onClick={() => { setUploadBillsFile(null) }}
                                            >
                                                Remove
                                            </button>}
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