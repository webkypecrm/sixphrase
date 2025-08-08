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
import { fromAccountOptions, paymentModeOptions, tdsOptions } from '../../selectOption/selectOption';

const AddLead = ({ togglePopup, addLead, expenseOptions, fetchLeadData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const initialForm = {
        // expenseDate: '',
        // vendorVendorId: null,
        // vendorCategoryId: null,
        // vendorSubCategoryId: null,
        // bankDetails: '',
        // payableAmount: '',
        // gst: '',
        // totalPayable: '',
        // uploadBills: '', // PDF file

        expenseExpenseId: null,
        paidAmount: '',
        gstAmount: '',
        gstPaid: true,
        tdsDeducted: '', // 2% | 3% | 5% | 10% | 20%
        tdsAmount: '',
        fromAccount: '', // ICICI/INDUS/PHONEPE/CASH/CREDIT
        paymentMode: '',
        transactionId: '',
        remark: '',
        uploadProof: '',
    };
    const [formData, setFormData] = useState(initialForm);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadBillsFile, setUploadBillsFile] = useState(null);
    const [vendorDetails, setVendorDetails] = useState({});

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const uploadBillsFiles = files[0];
            if (uploadBillsFiles.type.startsWith("image/") || uploadBillsFiles.type.startsWith("application/pdf")) {
                if (uploadBillsFiles.size <= 1024 * 1024) {
                    setUploadBillsFile(uploadBillsFiles)
                    setFormData((prevData) => ({
                        ...prevData,
                        uploadProof: uploadBillsFiles
                    }))
                } else {
                    toast.error('File size exceeds 800k');
                }
            }
        }
    }

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

            const response = await fetch(`${apiUrl}/expense/paid-expense`, {
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
        if (formData?.expenseExpenseId && vendorDetails?.totalPayable) {
            const gstAmount = (Number(vendorDetails.totalPayable) * Number(vendorDetails.gst || 0)) / 100;

            setFormData((prevData) => ({
                ...prevData,
                gstAmount: gstAmount,
            }))
        }

    }, [formData.expenseExpenseId, vendorDetails?.gst, vendorDetails?.totalPayable])

    useEffect(() => {
        if (formData?.tdsDeducted && vendorDetails?.totalPayable) {
            const tdsAmount = (Number(vendorDetails.totalPayable) * Number(formData.tdsDeducted || 0)) / 100;

            setFormData((prevData) => ({
                ...prevData,
                tdsAmount,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                tdsAmount: "",
            }));
        }
    }, [formData?.tdsDeducted, vendorDetails?.totalPayable]);

    // console.log("formData =>", formData)
    // console.log('uploadBillsFile =>', uploadBillsFile)
    // console.log('vendorDetails =>', vendorDetails)

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
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Expenses List <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                required
                                                value={expenseOptions.find(option => option.value === formData.expenseExpenseId) || null}
                                                onChange={(event) => {
                                                    let { value, data } = event;
                                                    // console.log("event =>", event)
                                                    handleInputChange({ target: { name: 'expenseExpenseId', value } })
                                                    setVendorDetails(() => ({
                                                        ...data
                                                    }))
                                                }}
                                                options={expenseOptions}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"Paid Amount"} <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name='paidAmount'
                                                required
                                                value={formData.paidAmount}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {"GST Amount"} <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name='gstAmount'
                                                required
                                                disabled
                                                value={formData.gstAmount}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>


                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                TDS Deducted <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                required
                                                value={tdsOptions.find(option => option.value === formData.tdsDeducted) || null}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'tdsDeducted', value } })
                                                }}
                                                options={tdsOptions}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center" >
                                                <label className="col-form-label">
                                                    {"TDS Amount"}   <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                            <input
                                                name="tdsAmount"
                                                type="number"
                                                required

                                                className="form-control"
                                                value={formData.tdsAmount}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center" >
                                                <label className="col-form-label">
                                                    {"Transaction Id"}   <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                            <input
                                                name="transactionId"
                                                type="text"
                                                required
                                                className="form-control"
                                                value={formData.transactionId}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Payment Mode <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                required
                                                value={paymentModeOptions.find(option => option.value === formData.paymentMode) || null}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'paymentMode', value } })
                                                }}
                                                options={paymentModeOptions}
                                            />
                                        </div>
                                    </div>
                                    <div className='dotted-line'>
                                    </div>
                                    <div className='col-md-7'>
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Upload Proof <span className="text-danger">*</span>
                                            </label>
                                            <div className="drag-attach">
                                                <input
                                                    type="file"
                                                    style={{ width: 'auto' }}
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
                                    </div>
                                    <div className="col-md-5">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                From Account <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                required
                                                value={fromAccountOptions.find(option => option.value === formData.fromAccount) || null}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'fromAccount', value } })
                                                }}
                                                options={fromAccountOptions}
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