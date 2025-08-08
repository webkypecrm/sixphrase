import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentOptions } from '../../selectOption/selectOption';
import Select from 'react-select';
import Input from '../UI/Input';
import { toast } from 'react-toastify';
import { getCurrentDate, getCurrentTime } from '../../selectOption/selectFunction';
import Dropdown from '../UI/Dropdown';
import axios from "axios";

const Payment = ({ customerDetails, addPayment, setAddPayment, setCustomerDetails, fetchLeadDetails }) => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    // const today = new Date().toISOString().split('T')[0];
    const type = localStorage.getItem("type");
    const staffId = localStorage.getItem("id");
    const initialForm = {
        customerId: null,
        totalAmount: "0",
        totalPaid: "0",
        totalDue: "0",
        amountDue: "",
        amountPaid: "",
        paymentDate: getCurrentDate(),
        paymentTime: getCurrentTime(),
        transactionNum: "",
        paymentMethod: "",
        attachment: "",
        leadForId: null,
        serviceId: null,
        remark: "",
        leadServiceId: null,
    }

    const [formPaymentData, setFormPaymentData] = useState(initialForm);
    const [attachmentFile, setAttachmentFile] = useState(null);
    // const [leadForOpitons, setLeadForOpitons] = useState([]);
    // const [serviceOpitons, setServiceOpitons] = useState([]);
    const [serviceOpitons, setServiceOpitons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // console.log("customerDetails customerDetailscustomerDetailscustomerDetails =>", customerDetails)

    const fetchLeadServices = async (leadId) => {
        try {
            const response = await fetch(`${apiUrl}/customer/get-lead-services/${leadId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            const resData = await response.json();
            // const formattedData = resData.data.map((item) => ({
            //     label: `${item?.Service?.name} || ₹${item?.estimateCost}`,
            //     value: item.serviceId,
            //     data: item
            // }));
            const formattedData = resData.data
                .filter((item) => item.estimateCost !== '0' && item.estimateCost !== 0)
                .map((item) => ({
                    label: `${item?.Service?.name} || Amount: ₹${item?.estimateCost} `,
                    value: item.serviceId,
                    data: item
                }));
            setServiceOpitons(formattedData);
        } catch (error) {
            console.log(error)
        }
    }

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const attachmentFiles = files[0];
            if (attachmentFiles.type.startsWith("image/")) {
                if (attachmentFiles.size <= 5 * 1024 * 1024) {
                    setAttachmentFile(attachmentFiles)
                    setFormPaymentData((prevData) => ({
                        ...prevData,
                        attachment: attachmentFiles
                    }))
                } else {
                    toast.error('File size exceeds 5MB');
                }
            }
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            setIsLoading(true);
            const formDataToSend = new FormData();
            for (const key in formPaymentData) {
                if (formPaymentData[key] !== null) {
                    formDataToSend.append(key, formPaymentData[key])
                }
            }
            const response = await fetch(`${apiUrl}/customer/add-payment`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: formDataToSend
            });
            const resData = await response.json();
            // Check for response errors
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add followup');
            }

            fetchLeadDetails()
            fetchLeadServices(customerDetails?.convertedLeadId)
            // const customerId = customerDetails?.customerId
            setFormPaymentData(() => ({
                ...initialForm,
                // customerId: Number(customerId)
            }));
            setAddPayment(false);
            setAttachmentFile(null);
            setCustomerDetails(null);
            toast.success(resData.message);
            setIsLoading(false);
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
            setIsLoading(false)
        }
    }
    const handleInputChange = (event) => {
        const { name, value, } = event.target

        if (name === "totalAmount") {
            const totalDue = Number(value) - Number(formPaymentData?.totalPaid);
            setFormPaymentData((prevForm) => ({
                ...prevForm,
                [name]: value,
                totalDue: totalDue
            }));
        } else {
            setFormPaymentData((prevForm) => ({
                ...prevForm,
                [name]: value
            }));
        }

    }
    // const fetchLeadForData = async () => {
    //     try {
    //         const response = await fetch(`${apiUrl}/master/lead-for-list`, {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             },
    //         });
    //         const resData = await response.json();
    //         const formattedData = resData.data.map((item) => ({
    //             label: item.name,
    //             value: item.id
    //         }));
    //         setLeadForOpitons(formattedData);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    const fetchServiceData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/service-list-by-lead-for/${formPaymentData?.leadForId}`,
                {
                    headers: {
                        authorization: 'Bearer ' + token
                    }
                }
            );
            const formattedData = response.data.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setServiceOpitons(formattedData);
        } catch (error) {
            // console.log(error)
            console.log(error)
        }
    };
    function handleRefresh() {
        setFormPaymentData((prev) => ({
            ...initialForm,
            customerId: prev.customerId, // Keep customerId
            paymentMethod: ""
        }));
        setAttachmentFile(null)
    }
    useEffect(() => {
        if (formPaymentData?.leadForId) {
            fetchServiceData()
        }
    }, [formPaymentData?.leadForId])
    useEffect(() => {
        if (formPaymentData?.serviceId) {
            // console.log('formPaymentData =>', formPaymentData);
            const id = formPaymentData.serviceId
            const selectedService = serviceOpitons.find((option) => option.value == id);
            // console.log("selectedService =>", selectedService)
            const totalAmount = selectedService?.data?.estimateCost || 0; // Fallback to 0 if not found
            const totalDue = Number(totalAmount) - Number(formPaymentData?.totalPaid);
            const leadServiceId = selectedService?.data?.id

            // console.log("totalAmount =>", totalAmount);

            if (formPaymentData.totalAmount !== totalAmount) {
                setFormPaymentData((prev) => ({
                    ...prev,
                    totalAmount: Number(totalAmount),
                    totalDue: Number(totalDue),
                    leadServiceId: Number(leadServiceId)
                }));
            }
        }
    }, [formPaymentData?.serviceId, serviceOpitons]); // Ensure correct dependency list
    useEffect(() => {
        if (customerDetails?.customerId) {
            setFormPaymentData((prevData) => ({
                ...prevData,
                customerId: Number(customerDetails?.customerId),
                paymentMethod: String(customerDetails?.paymentMethod)
            }))

            fetchLeadServices(customerDetails?.convertedLeadId)
        }
    }, [customerDetails?.customerId]);
    useEffect(() => {
        if (addPayment && customerDetails?.customerId) {
            setFormPaymentData((prevData) => ({
                ...prevData,
                customerId: Number(customerDetails?.customerId),
                paymentMethod: String(customerDetails?.paymentMethod)
            }));
        }
    }, [addPayment]);

    // console.log("customerDetails =>", customerDetails);
    // console.log("formPaymentData =>", formPaymentData);

    // console.log("serviceOpitons =>", serviceOpitons);
    // console.log('formPaymentDataformPaymentDataformPaymentDataformPaymentDataformPaymentDataformPaymentData  =>', formPaymentData);

    return (
        <div
            className={
                addPayment ? "toggle-popup sidebar-popup" : "toggle-popup"
            }
        >
            <div className="sidebar-layout">
                <div className="sidebar-header">
                    <h4>Add Payment of {customerDetails?.customerName}</h4>
                    <Link
                        to="#"
                        className="sidebar-close toggle-btn"
                        onClick={() => setAddPayment(false)}
                    >
                        <i className="ti ti-x" />
                    </Link>
                </div>
                <div className="toggle-body">
                    <div className="toggle-height">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <Dropdown
                                        label="Service"
                                        name="serviceId"
                                        isMandatory
                                        value={formPaymentData.serviceId}
                                        onChange={handleInputChange}
                                        options={serviceOpitons}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Input
                                        label="Amount to pay"
                                        name="totalAmount"
                                        disabled
                                        type="text"
                                        value={formPaymentData?.totalAmount}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {/* <div className="col-md-4">
                                    <Input
                                        label="Total Paid"
                                        type="number"
                                        disabled
                                        value={formPaymentData.totalPaid}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Input
                                        label="Total Due"
                                        type="number"
                                        name="totalDue"
                                        disabled
                                        value={formPaymentData.totalDue}
                                    />
                                </div> */}
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Payment Method<span className="text-danger"> *</span>
                                        </label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            required
                                            value={paymentOptions.find(option => option.value === formPaymentData?.paymentMethod) || null}
                                            onChange={(event) => {
                                                let { value } = event
                                                handleInputChange({ target: { name: 'paymentMethod', value } })

                                            }}
                                            options={paymentOptions}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <Input
                                        label="Received Amount"
                                        type="number"
                                        isMandatory
                                        name="amountPaid"
                                        value={formPaymentData.amountPaid}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Input
                                        label="Due Amount"
                                        isDisable={true}
                                        type="text"
                                        disabled
                                        name="amountDue"
                                        value={formPaymentData.amountDue = formPaymentData.totalDue - formPaymentData.amountPaid}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Input
                                        label="Payment Date"
                                        type="Date"
                                        isMandatory
                                        name="paymentDate"
                                        value={formPaymentData.paymentDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Input
                                        label="Payment Time"
                                        type="Time"
                                        isMandatory
                                        name="paymentTime"
                                        value={formPaymentData.paymentTime}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Input
                                        label="Transaction Number"
                                        type="text"
                                        name="transactionNum"
                                        value={formPaymentData.transactionNum}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {/* <div className="col-md-6">
                                    <Dropdown
                                        label="Lead For"
                                        name="leadForId"
                                        isMandatory
                                        value={formPaymentData.leadForId}
                                        onChange={handleInputChange}
                                        options={leadForOpitons}
                                    />
                                </div> */}
                                {/* <div className="col-md-6">
                                    <Dropdown
                                        label="Service"
                                        name="serviceId"
                                        isMandatory
                                        value={formPaymentData.serviceId}
                                        onChange={handleInputChange}
                                        options={serviceOpitons}
                                    />
                                </div> */}
                                <div className="col-md-6">
                                    <Input
                                        label="Remark"
                                        type="text"
                                        isMandatory
                                        name="remark"
                                        value={formPaymentData.remark}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <div className="profile-pic-upload">
                                        <div className="profile-pic">
                                            {attachmentFile ?
                                                <div>
                                                    <img
                                                        src={URL.createObjectURL(attachmentFile)}
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
                                                    Upload File
                                                </span>
                                            </div>
                                            <p>JPG, GIF or PNG. Max size of 5 MB</p>
                                            {attachmentFile &&
                                                <button
                                                    className="btn btn-light"
                                                    type="button"
                                                    onClick={() => { setAttachmentFile(null) }}
                                                >
                                                    Remove
                                                </button>}
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="form-wrap">
                                {/* <DefaultEditor className="summernote" /> */}
                            </div>
                            <div className="form-wrap" style={{ float: 'right' }}>
                                <div className="text-center">
                                    {isLoading
                                        ?
                                        <button
                                            disabled={true}
                                            type='submit'
                                            className="btn btn-primary me-1">
                                            <span>Saving...</span>
                                            <i className="fa-solid fa-floppy-disk ms-1" />
                                        </button>
                                        :
                                        <button
                                            type='submit'
                                            className="btn btn-primary me-1">
                                            <span>Save</span>
                                            <i className="fa-solid fa-floppy-disk ms-1" />
                                        </button>
                                    }

                                    <button
                                        type='button'
                                        className="btn btn-light sidebar-close"
                                        onClick={() => {
                                            setAddPayment(false)
                                            handleRefresh()
                                        }}
                                    >
                                        <span>Cancel</span>{" "}
                                        <i className="fa-regular fa-trash-can ms-1" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Payment