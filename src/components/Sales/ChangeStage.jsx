import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import axios from 'axios';
import { label } from 'yet-another-react-lightbox';


const ChangeStage = ({ leadForAssign, fetchLeadData, followUpStage }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [stageOptions, setStageOptions] = useState([]);
    const [selectedStage, setSelectedStage] = useState(null);
    const [reasonOptions, setReasonOptions] = useState([]);

    // console.log('leadForAssign =>', leadForAssign)
    // console.log('fetchLeadData =>', fetchLeadData)

    const initialForm = {
        leadId: '',
        stageId: '',
        reasonId: null,
    }
    const [formData, setFormData] = useState(initialForm);
    // console.log('formData', formData)

    const fetchReasonData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/master/reasons-list`);
            const formattedData = response.data.data.map((item) => ({
                value: item.id,
                label: item.name,
                key: item.id, // Ensure that key is unique for each record
            }));
            setReasonOptions(formattedData);
        } catch (error) {
            setError(error)
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            formData.leadId = leadForAssign?.leadId

            if (selectedStage || selectedStage !== 'null') {
                const isPresent = selectedStage.filter(ele => ele?.stage?.id === formData?.stageId)
                // console.log('present =>', isPresent)
                if (isPresent.length > 0) {
                    setFormData(initialForm)

                    toast.error('This stage has already been selected.');
                    return
                }
            }

            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/lead/update-lead-stage`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to update');
            }
            setFormData((prev) => ({ ...initialForm }))
            fetchLeadData()
            toast.success('Stage updated successfully!');
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        const fetchStageData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/master/stage-list`);
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setStageOptions(() => [...formattedData]);
            } catch (error) {
                toast.error(error.message)
            }
        };

        const fetchStageHistory = async () => {
            try {
                const response = await axios.get(`${apiUrl}/lead/lead-status-history?leadId=${leadForAssign.leadId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${Token}`
                        }
                    }
                );
                const formattedData = response.data.data
                if (formattedData.length > 0) {
                    setSelectedStage(() => [...formattedData]);
                }


            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        };

        if (leadForAssign?.leadId) {
            fetchStageData()
            fetchStageHistory()
        }

    }, [leadForAssign?.leadId])

    useEffect(() => {
        if (formData?.stageId == 7) {
            fetchReasonData()
        } else {
            setFormData((prevData) => ({
                ...prevData,
                reasonId: null
            }))
        }
    }, [formData?.stageId])

    console.log("formData =>", formData)

    return (<>
        {/* Assign To */}
        <div
            className="modal custom-modal fade modal-padding"
            id="stage_update"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Stage Update</h5>
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
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Stage <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            onChange={(event) => {
                                                setFormData((prevData) => ({
                                                    ...prevData,
                                                    stageId: event.value
                                                }))
                                            }}
                                            options={stageOptions}
                                        />
                                    </div>
                                </div>
                                {formData?.stageId == 7 &&
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                Reasons <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="react-select"
                                                className="select"
                                                value={reasonOptions?.find(option => option.value == formData?.reasonId) || null}
                                                onChange={(event) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        reasonId: event.value
                                                    }))
                                                }}
                                                options={reasonOptions}
                                            />
                                        </div>
                                    </div>
                                }

                                <div className="text-end modal-btn">
                                    <Link
                                        to="#"
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </Link>
                                    <button
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
            </div>
        </div>
        {/* Assign To */}
    </>
    )
}

export default ChangeStage