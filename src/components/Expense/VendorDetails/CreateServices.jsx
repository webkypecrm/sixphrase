import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Table from 'quill-table-ui';
import 'quill-table-ui/dist/index.css';
import Dropdown from '../../UI/Dropdown';
import axios from 'axios';

Quill.register({
    'modules/table': Table,
});

const CreateServices = ({ fetchLeadDetails, leadDetails }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const initialForm = {
        services: '',
        estimateCost: '',
        serviceId: null,
        discountAmount: '',
        discountPercentage: '',
        cost: ''
    };
    const [formData, setFormData] = useState(initialForm);
    const [input, setInput] = useState('');
    const [serviceOpitons, setServiceOpitons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [charCount, setCharCount] = useState(0);
    // const maxChars = 500;

    // console.log('formData  =>', formData);

    const handleInput = (value) => {
        // const charLength = value.length;

        // if (charLength <= maxChars) {
        //     setInput(value)
        //     setCharCount(charLength);
        // }

        setInput(value)

    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (input === '') {
            toast.error("Remark should not empty")
            return
        }
        try {
            setIsLoading(true)
            // formData.leadId = leadDetails.leadId
            // formData.services = input

            const updatedFormData = {
                ...formData,
                services: input,
                leadId: leadDetails.leadId
            }

            const formDataToSend = new FormData();
            for (const key in updatedFormData) {
                if (updatedFormData[key] !== null) {
                    formDataToSend.append(key, updatedFormData[key])
                }
            }
            const response = await fetch(`${apiUrl}/lead/services-update`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to update comment');
            }
            setFormData((prev) => ({ ...initialForm }))
            fetchLeadDetails()
            handleReset()
            toast.success('Services updated successfully!');
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            toast.error(error.message || 'Something went wrong');
            setIsLoading(false)
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link', 'image', 'video'],
            ['clean'],
            ['table'], // Add table functionality
        ],
        table: true, // Enable table module
    };

    const fetchServiceData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/service-list-by-lead-for/${0}`,
                {
                    headers: {
                        authorization: 'Bearer ' + Token
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

    function handleReset() {
        setFormData(() => ({
            ...initialForm
        }))
        setInput("")
    };

    useEffect(() => {
        fetchServiceData()
    }, []);

    useEffect(() => {
        const discountAmount = (Number(formData.cost) * Number(formData.discountPercentage)) / 100;
        const estimateCost = (Number(formData.cost) - Number(discountAmount));

        setFormData((prevData) => ({
            ...prevData,
            discountAmount: isNaN(discountAmount) ? "" : discountAmount,
            estimateCost: isNaN(estimateCost) ? "" : estimateCost
        }));
    }, [formData.cost, formData.discountPercentage]);

    // useEffect(() => {
    //     const estimateCost = (Number(formData.cost)  - Number(formData.discountAmount))

    //     setFormData((prevData) => ({
    //         ...prevData,
    //         estimateCost: isNaN(estimateCost) ? "" : estimateCost,
    //     }));
    // }, [formData.cost, formData.discountAmount]);

    return (< div
        className="modal custom-modal fade custom-modal-two modal-padding"
        id="create-services"
        role="dialog"
    >
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Create Services</h5>
                    <button
                        type="button"
                        className="btn-close position-static"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body p-0">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        Services <span className="text-danger"> *</span>
                                    </label>

                                    <div className='col-md-12'>
                                        <Dropdown
                                            // label="Services"
                                            name="serviceId"
                                            value={formData?.serviceId}
                                            onChange={(event) => {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    serviceId: event.target.value
                                                }))
                                            }}
                                            options={serviceOpitons}
                                        />
                                    </div>
                                    <label className="col-form-label">
                                        Remark <span className="text-danger"> *</span>

                                    </label>
                                    <ReactQuill
                                        value={input}
                                        onChange={handleInput}
                                        theme="snow"
                                        style={{ height: '200px' }}
                                    />
                                    {/* <p style={{ color: charCount === maxChars ? "red" : "black" }}>
                                        Character count: {charCount}/{maxChars}
                                    </p> */}

                                    {/* <ReactQuill
                                        value={input}
                                        onChange={setInput}
                                        theme="snow"
                                        modules={modules}
                                    /> */}

                                </div>
                                <div style={{ marginTop: '4rem', display: 'flex' }}>
                                    <div className='col-md-3' style={{ paddingRight: '10px' }}>
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Cost<span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                placeholder="Cost of service"
                                                type='number'
                                                value={formData.cost}
                                                onChange={(event) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        cost: event.target.value
                                                    }))
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-3' style={{ paddingInline: '10px' }}>
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Discount In (%)
                                            </label>
                                            <input
                                                className="form-control"
                                                placeholder="Discount in %"
                                                type='number'
                                                value={formData.discountPercentage}
                                                onChange={(event) => {
                                                    if (formData.cost) {
                                                        setFormData((prevData) => ({
                                                            ...prevData,
                                                            discountPercentage: event.target.value
                                                        }))
                                                    } else {
                                                        toast.error('Cost should not empty')
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-3' style={{ paddingInline: '10px' }}>
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Discount Amount
                                            </label>
                                            <input
                                                className="form-control"
                                                placeholder="Discount amount"
                                                type="number"
                                                value={formData.discountAmount}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className='col-md-3' style={{ paddingLeft: '10px' }}>
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Amount to pay<span className="text-danger"> *</span>
                                            </label>
                                            <input
                                                className="form-control"
                                                placeholder="Amount to pay"
                                                type="number"
                                                value={formData.estimateCost}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-end modal-btn">
                                    <Link
                                        to="#"
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                        onClick={handleReset}
                                    >
                                        Cancel
                                    </Link>
                                    {isLoading
                                        ?
                                        <button
                                            type='submit'
                                            className="btn btn-primary"
                                            data-bs-dismiss="modal"
                                            disabled
                                        >
                                            Saving...
                                        </button>
                                        :
                                        <button
                                            type='submit'
                                            className="btn btn-primary"
                                            data-bs-dismiss="modal"
                                        >
                                            Confirm
                                        </button>
                                    }

                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div >
    )
}

export default CreateServices