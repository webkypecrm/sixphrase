import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import axios from 'axios';


const UpdateFacebookToken = ({ fetchData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';

    const initialForm = {
        facebookToken: ''
    }
    const [formData, setFormData] = useState(initialForm);

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
            // formData.leadId = leadForAssign?.leadId
            const formDataToSend = JSON.stringify(formData);
            // for (const key in formData) {
            //     if (formData[key] !== null) {
            //         formDataToSend.append(key, formData[key])
            //     }
            // }
            const response = await fetch(`${apiUrl}/campaign/add-facebook-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specify content type
                    authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to update');
            }
            setFormData(() => ({
                facebookToken: ""
            }))
            fetchData()
            toast.success('Updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }


    return (<>
        {/* <div className="modal-dialog modal-dialog-centered"> */}
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Update Facebook Token</h5>
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
                                    Write here facebook token<span className="text-danger"></span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name='facebookToken'
                                    value={formData.facebookToken}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="text-end modal-btn">
                            <Link
                                to="#"
                                className="btn btn-light"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    setFormData(() => ({
                                        facebookToken: ""
                                    }))
                                }}
                            >
                                Cancel
                            </Link>
                            <button
                                type='submit'
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                            >
                                Confirm
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
        {/* </div> */}

    </>
    )
}

export default UpdateFacebookToken