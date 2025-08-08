import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import { toast } from 'react-toastify';
import { paymentOptions } from '../../../selectOption/selectOption';
import Select from 'react-select';

const AddPayment = ({ data, handleRefresh }) => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    // const today = new Date().toISOString().split('T')[0];
    const initialForm = {
        total: "",
        amountDue: "",
        amountPaid: "",
    }
    const [formData, setFormData] = useState(initialForm);

    // console.log("formData =>", formData);

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.InvoiceItem = JSON.stringify(formData.InvoiceItem);
            let formDataToSend = { ...formData };
            // delete formDataToSend.InvoiceItem;
            delete formDataToSend.Customer;
            const response = await fetch(`${apiUrl}/customer/update-invoice`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', // Specify content type
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formDataToSend)
            });
            const resData = await response.json();
            // Check for response errors
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add followup');
            }
            handleRefresh()
            setFormData(initialForm);

            // Programmatically close the modal on component mount
            const modalElement = document.getElementById("payment_invoices"); // Replace with your modal's ID
            const modalInstance = bootstrap.Modal.getInstance(modalElement);

            if (modalInstance) {
                modalInstance.hide(); // Programmatically hides the modal
            }

            toast.success(resData.message);
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
    }

    useEffect(() => {
        if (data.id) {
            setFormData((prevData) => ({
                ...prevData,
                total: Number(data?.estimateCost)
            }))
        }
    }, [data])

    // console.log("data =>", data)

    return (
        <>
            <div className="modal-header">
                <h5 className="modal-title">Create Payment ({data?.Customer?.customerName})</h5>
                <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                >
                    <i className="ti ti-x" />
                </button>
            </div>
            <div className="modal-body p-0">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <Input
                                label="Total Amount including Tax"
                                type="number"
                                isMandatory
                                name="total"
                                value={formData.total}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6">
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
                        <div className="col-md-6">
                            <Input
                                label="Received Amount"
                                type="number"
                                isMandatory
                                name="amountPaid"
                                value={formData.amountPaid}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-12">
                            <Input
                                label="Due Amount"
                                type="number"
                                isMandatory
                                name="amountDue"
                                value={formData.amountDue}
                                onChange={handleInputChange}
                            />

                        </div>
                    </div>
                    <div className="form-wrap">
                        {/* <DefaultEditor className="summernote" /> */}
                    </div>
                    <div className="form-wrap" style={{ float: 'right' }}>
                        <div className="text-center">
                            <button className="btn btn-primary me-1">
                                <span>Save</span>
                                <i className="fa-solid fa-floppy-disk ms-1" />
                            </button>

                            <button
                                className="btn btn-primary me-1"
                                type="button"
                                data-bs-dismiss="modal"
                                aria-label="Close"

                            >
                                <span>Cancel</span>{" "}
                                <i className="fa-regular fa-trash-can ms-1" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AddPayment