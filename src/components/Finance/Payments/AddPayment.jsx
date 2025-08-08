import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css';
import axios from "axios";
import { toast } from "react-toastify";
import { invoiceStatus, paymentOptions } from "../../../selectOption/selectOption";
import { data } from "jquery";

const AddPayment = ({ setActivityToggle, activityToggle, handleRefresh, customerDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [customerOptions, setCustomerOptions] = useState([]);
    const initialForm = {
        customerId: null,
        customerEmail: '',
        customerMobile: '',
        customerAddress: '',
        Item: [
            {
                itemNo: '',
                itemName: '',
                quantity: '',
                price: '',
                discount: '',
                total: ''
            }
        ],
        subTotal: '',
        taxRate: '',
        taxAmount: '',
        total: '',
        amountPaid: '',
        amountDue: '',
        dueDate: '',
        paymentMethod: '',
        status: '',
        notes: ''
    }
    const [formData, setFormData] = useState(initialForm);
    const [selectedCustomer, setSelectedCustomer] = useState({});

    console.log("selectedCustomer =>", selectedCustomer)

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
    }

    const handleInputChange1 = (index, value, fieldName) => {
        setFormData((prevData) => {
            const updatedItems = [...prevData.Item];
            updatedItems[index] = { ...updatedItems[index], [fieldName]: value };
            return { ...prevData, Item: updatedItems };
        });
    };

    const handleAddItem = () => {
        setFormData((prevData) => ({
            ...prevData,
            Item: [...prevData.Item, initialForm.Item[0]]
        }))
    }
    const handleRemoveItem = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            Item: prevData.Item.filter((_, i) => i !== index) // Exclude the item at the given index
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Create a copy of formData to avoid mutating the original object
            let dataToSend = {
                ...formData,
                Item: JSON.stringify(formData.Item), // Stringify the Item array
            };

            if (customerDetails?.convertedLeadId) {
                dataToSend.leadId = customerDetails.convertedLeadId;
            }

            // console.log("dataToSend =>", dataToSend);

            const response = await fetch(`${apiUrl}/customer/add-invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify JSON content
                    Authorization: `Bearer ${Token}`,
                },
                body: JSON.stringify(dataToSend), // Send the form data as JSON
            });

            const resData = await response.json();

            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add invoice');
            }

            // Reset the form and provide feedback
            handleRefresh()
            setFormData(initialForm);
            setActivityToggle(false);
            toast.success('Invoice added successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    };


    const fetchCustomerData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/customer/customer-list`, {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            });
            const formattedData = response.data.data.map((item) => ({
                label: item.customerName,
                value: item.customerId,
                data: item
            }));
            setCustomerOptions(formattedData);

        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchCustomerData()
    }, [])

    useEffect(() => {
        if (selectedCustomer.customerId) {
            setFormData((prevData) => ({
                ...prevData,
                customerEmail: selectedCustomer.customerEmail,
                customerMobile: selectedCustomer.customerMobile1,
                customerAddress: selectedCustomer.leadCity
            }))
        }
    }, [selectedCustomer?.customerId])


    useEffect(() => {
        if (formData?.Item?.length > 0) {
            const subTotal = formData.Item.reduce((total, item) => total + (item.total || 0), 0);

            setFormData((prevData) => ({
                ...prevData,
                subTotal,
            }));
        }
    }, [formData?.Item]);

    useEffect(() => {
        if (customerDetails?.customerId) {

            setFormData((prevData) => ({
                ...prevData,
                customerId: customerDetails.customerId,
                customerEmail: customerDetails.customerEmail,
                customerMobile: customerDetails.customerMobile1,
                
            }))

        }
    }, [customerDetails?.customerId])


    // console.log("customerDetails =>", customerDetails)

    return (
        <div
            className={
                activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
            }
        >
            <div className="sidebar-layout">
                <div className="sidebar-header">
                    <h4>Add New Invoice</h4>
                    <Link
                        to="#"
                        className="sidebar-close toggle-btn"
                        onClick={() => setActivityToggle(!activityToggle)}
                    >
                        <i className="ti ti-x" />
                    </Link>
                </div>
                <div className="toggle-body">
                    <div className="toggle-height">
                        <form onSubmit={handleSubmit}>
                            <div className="pro-create">
                                <div className="row">

                                    <div className={`form-wrap ${customerDetails?.customerId ? "pe-none" : ""}`} >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <label className="col-form-label">Client / Customer</label>
                                        </div>
                                        <Select
                                            className="select"
                                            placeholder="Choose"
                                            classNamePrefix="react-select"
                                            required
                                            value={customerOptions.find(option => option.value === formData.customerId)}
                                            onChange={(event) => {
                                                let { value, data } = event
                                                handleInputChange({ target: { name: 'customerId', value } })
                                                setSelectedCustomer(data)

                                            }}
                                            options={customerOptions}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Mobile<span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="number"
                                                name="customerMobile"
                                                value={formData.customerMobile}
                                                onChange={(event) => {
                                                    let { value } = event.target
                                                    if (value.length <= 10) {
                                                        handleInputChange({ target: { name: 'customerMobile', value } });
                                                    } else {
                                                        toast.error("Mobile number should not be more than 10 digits");
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Email<span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="email"
                                                name="customerEmail"
                                                value={formData.customerEmail}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Address<span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="address"
                                                name="customerAddress"
                                                value={formData.customerAddress}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Due Date<span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                type="date"
                                                name="dueDate"
                                                min={new Date().toISOString().split("T")[0]}
                                                value={formData.dueDate}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Payment Method<span className="text-danger"> *</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                required
                                                value={paymentOptions.find(option => option.value === formData.paymentMethod)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'paymentMethod', value } })
                                                }}
                                                options={paymentOptions}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Status<span className="text-danger"> *</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                required
                                                value={invoiceStatus.find(option => option.value === formData.status)}
                                                onChange={(event) => {
                                                    let { value } = event
                                                    handleInputChange({ target: { name: 'status', value } })

                                                }}
                                                options={invoiceStatus}
                                            />
                                        </div>
                                    </div>

                                    {formData.Item.map((item, index) => {
                                        return (
                                            <div className="table-responsive" key={item.id || index}>
                                                <table className="table table-view">
                                                    <thead>
                                                        <tr>
                                                            <th>Item No</th>
                                                            <th>Item Name</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>Discount(%)</th>
                                                            <th>Total</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <div className="input-table">
                                                                    <input
                                                                        type="number"
                                                                        value={item.itemNo}
                                                                        onChange={(e) => handleInputChange1(index, e.target.value, 'itemNo')}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="input-table input-table-description">
                                                                    <input
                                                                        type="text"
                                                                        value={item.itemName}
                                                                        onChange={(e) => handleInputChange1(index, e.target.value, 'itemName')}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="input-table">
                                                                    <input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => handleInputChange1(index, e.target.value, 'quantity')}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="input-table">
                                                                    <input
                                                                        type="number"
                                                                        value={item.price}
                                                                        onChange={(e) => handleInputChange1(index, e.target.value, 'price')}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="input-table">
                                                                    <input
                                                                        type="number"
                                                                        placeholder="In %"
                                                                        value={item.discount}
                                                                        onChange={(e) => handleInputChange1(index, e.target.value, 'discount')}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="input-table">
                                                                    <input
                                                                        disabled
                                                                        type="number"
                                                                        value={item.total = item.quantity * item.price - (item.quantity * item.price * item.discount / 100)}
                                                                        onChange={(e) => {
                                                                            handleInputChange1(index, e.target.value, 'total')
                                                                        }
                                                                        }
                                                                    />
                                                                </div>
                                                            </td>
                                                            {index > 0 && (
                                                                <td>
                                                                    <Link
                                                                        to="#"
                                                                        className="btn btn-success-light"
                                                                        onClick={() => handleRemoveItem(index)}
                                                                    >
                                                                        <i className="ti ti-minus" />
                                                                    </Link>
                                                                </td>
                                                            )}
                                                            <td>
                                                                <Link
                                                                    to="#"
                                                                    className="btn btn-success-light"
                                                                    onClick={() => handleAddItem(index)}
                                                                >
                                                                    <i className="ti ti-plus" />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    })}

                                    <div className="subtotal-div mb-3">
                                        <ul className="mb-3">
                                            <li>
                                                <h5>Subtotal</h5>
                                                <h6>
                                                    <input
                                                        type="number"
                                                        disabled
                                                        className="form-control"
                                                        placeholder="₹0.00"
                                                        name="subTotal"
                                                        value={formData.subTotal}
                                                        onChange={handleInputChange}
                                                    />
                                                </h6>

                                            </li>
                                            <li>
                                                <h5>Tax Rate (%)</h5>
                                                <h6>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="₹0.00"
                                                        name="taxRate"
                                                        value={formData.taxRate}
                                                        onChange={handleInputChange}
                                                    />
                                                </h6>
                                            </li>
                                            <li>
                                                <h5>Tax Amount</h5>
                                                <h6>
                                                    <input
                                                        type="number"
                                                        disabled
                                                        className="form-control"
                                                        placeholder="₹0.00"
                                                        name="taxAmount"
                                                        value={formData.taxAmount = (formData.subTotal * formData.taxRate) / 100}
                                                        onChange={handleInputChange}
                                                    />
                                                </h6>
                                            </li>
                                            <li>
                                                <h5>Total</h5>
                                                <h6>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="₹0.00"
                                                        name="total"
                                                        value={formData.total = formData.subTotal + formData.taxAmount}
                                                        onChange={handleInputChange}
                                                    />
                                                </h6>
                                            </li>
                                            <li>
                                                <h5>Amount Paid</h5>
                                                <h6>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="₹0.00"
                                                        name="amountPaid"
                                                        value={formData.amountPaid}
                                                        onChange={handleInputChange}
                                                    />
                                                </h6>
                                            </li>
                                            <li>
                                                <h5>Amount Due</h5>
                                                <h6>
                                                    <input
                                                        type="number"
                                                        disabled
                                                        className="form-control"
                                                        placeholder="₹0.00"
                                                        name="amountDue"
                                                        value={formData.amountDue = formData.total - formData.amountPaid}
                                                        onChange={handleInputChange}
                                                    />
                                                </h6>
                                            </li>
                                        </ul>
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Notes<span className="text-danger"> *</span>
                                            </label>
                                            <textarea
                                                className="form-control"
                                                rows={5}
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {/* <div className="row">
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Signature Name
                                            </label>
                                            <input type="text" className="form-control" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="col-form-label">
                                                Signature Image
                                            </label>
                                            <div className="upload-signature">
                                                <input type="file" />
                                                <Link to="#">Upload Signature</Link>
                                            </div>
                                        </div>
                                    </div> */}
                                    </div>

                                    {/* 
                                </div>
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Terms &amp; Conditions
                                            <span className="text-danger"> *</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows={5}
                                            defaultValue={""}
                                        />
                                    </div>
                                </div> */}
                                </div>
                            </div>
                            <div className="submit-button text-end">
                                <Link to="#" className="btn btn-light sidebar-close">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Save Invoice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AddPayment