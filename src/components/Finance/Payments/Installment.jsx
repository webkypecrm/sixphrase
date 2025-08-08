import React, { useState, useEffect } from 'react';
import Input from '../../UI/Input';
import { toast } from 'react-toastify';

const Installment = ({ data, handleRefresh }) => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL;
    // const today = new Date().toISOString().split('T')[0];
    const initialForm = {
        addAmount: "",
        message: "",
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
            const modalElement = document.getElementById("installment_payment"); // Replace with your modal's ID
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
                ...data
            }))
        }
    }, [data])

    return (
        <>
            <div className="modal-header">
                <h5 className="modal-title">Installment Amount ({data?.Customer?.customerName})</h5>
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
                                label="Add Amount"
                                type="number"
                                isMandatory
                                name="addAmount"
                                value={formData.addAmount}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <Input
                                label="Message"
                                type="text"
                                name="notes"
                                value={formData.notes}
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

export default Installment