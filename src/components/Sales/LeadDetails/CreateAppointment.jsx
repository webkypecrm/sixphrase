import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { toast } from 'react-toastify';
import axios from 'axios';
import { appointmentStatus } from '../../../selectOption/selectOption';
import { getCurrentDate, getCurrentTime } from '../../../selectOption/selectFunction';


const CreateAppointment = ({ fetchLeadDetails, leadDetails, counselorOptions, fetchLeadFollowupData, fetchStageHistoryData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const staffId = localStorage.getItem('staffId') || null;

    const initialForm = {
        name: "",
        appointmentDate: getCurrentDate(),
        appointmentTime: getCurrentTime(),
        categoryId: 1,
        leadForId: null,
        serviceId: null,
        counselorId: null,
        treatment: "",
        assignedTo: null,
        message: "",
        status: "Schedule",
    };
    const [formData, setFormData] = useState(initialForm);
    // const [categoryOptions, setCategoryOptions] = useState([]);
    const [leadForOpitons, setLeadForOpitons] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([])

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "appointmentDate") {
            const today = new Date().toISOString().split("T")[0];
            if (value < today) {
                toast.error("Please select a future date.");
                return;
            }
        }

        if (name === "appointmentTime") {
            const today = new Date().toISOString().split("T")[0];
            const selectedDate = formData.appointmentDate;
            const now = new Date();
            const selectedDateTime = new Date(`${selectedDate}T${value}`);

            if (selectedDate === today && selectedDateTime < now) {
                toast.error("Please select a future time.");
                return;
            }
        }

        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleDropdownChange = (name, value) => {
        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleReset = () => {
        let leadFor = null;
        try {
            leadFor = leadDetails?.leadFor ? JSON.parse(leadDetails.leadFor) : null;
        } catch (error) {
            console.error("Invalid JSON in leadFor:", error);
        }

        setFormData(() => ({
            ...initialForm,
            name: leadDetails?.leadName,
            leadId: leadDetails?.leadId,
            leadForId: leadFor
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.leadForId === null) {
            toast.error("Lead For is required")
            return
        }

        try {
            // console.log("formData in Appointment =>", formData);
            const formDataToSend = {
                ...formData,
                leadId: leadDetails?.leadId
            };

            const response = await fetch(`${apiUrl}/appointment/appointment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Token}`
                },
                body: JSON.stringify(formDataToSend)
            });

            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add appointment');
            }

            fetchLeadDetails();
            fetchLeadFollowupData();
            fetchStageHistoryData();
            handleReset()
            toast.success('Appointment added successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    };

    // const fetchCategoryData = async () => {
    //     try {
    //         const response = await axios.get(`${apiUrl}/master/category-list`, {
    //             headers: { Authorization: `Bearer ${Token}` }
    //         });

    //         const formattedData = response.data.data.map((item) => ({
    //             label: item.name,
    //             value: item.id
    //         }));
    //         setCategoryOptions(formattedData);
    //     } catch (error) {
    //         console.error("Error fetching categories:", error);
    //     }
    // };

    const fetchLeadForData = async () => {
        try {
            const response = await fetch(`${apiUrl}/master/lead-for-list`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
            });
            const resData = await response.json();
            const formattedData = resData.data.map((item) => ({
                label: item.name,
                value: item.id
            }));
            setLeadForOpitons(formattedData);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // fetchCategoryData();
        fetchLeadForData();
    }, []);

    useEffect(() => {
        if (leadDetails?.leadId) {
            let leadFor = null;
            try {
                leadFor = leadDetails?.leadFor ? JSON.parse(leadDetails.leadFor) : null;
            } catch (error) {
                console.error("Invalid JSON in leadFor:", error);
            }

            setFormData((prevData) => ({
                ...prevData,
                name: leadDetails?.leadName,
                leadId: leadDetails?.leadId,
                leadForId: leadFor,
                serviceId: leadDetails?.serviceId
            }));
        }
    }, [leadDetails]);

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/master/service-list-by-lead-for/${formData.leadForId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setServiceOptions(formattedData);
            } catch (error) {
                toast.error(error)
            }
        };
        if (formData?.leadForId) {
            fetchServiceData()
        }

    }, [formData.leadForId])


    useEffect(() => {
        if (staffId !== null) {
            setFormData((prev) => ({
                ...prev,
                counselorId: Number(staffId)
            }))
        }

    }, [staffId])

    // console.log("leadForOpitons =>", leadForOpitons)

    return (
        <div className="modal custom-modal fade modal-padding" id="create_appointment" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Meeting</h5>
                        <button type="button" className="btn-close position-static" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body p-0">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            required
                                            disabled={true}
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Requirement <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={leadForOpitons.find(option => option.value === formData.leadForId) || null}
                                            onChange={(selectedOption) => handleDropdownChange('leadForId', selectedOption.value)}
                                            options={leadForOpitons}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Service <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={serviceOptions.find(option => option.value === formData.serviceId) || null}
                                            onChange={(selectedOption) => handleDropdownChange('serviceId', selectedOption.value)}
                                            options={serviceOptions}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Meeting Date <span className="text-danger">*</span></label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="appointmentDate"
                                            min={new Date().toISOString().split("T")[0]}
                                            required
                                            value={formData.appointmentDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Meeting Time <span className="text-danger">*</span></label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            name="appointmentTime"
                                            required
                                            value={formData.appointmentTime}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                {/* <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Category</label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={categoryOptions.find(option => option.value === formData.categoryId)}
                                            onChange={(selectedOption) => handleDropdownChange('categoryId', selectedOption.value)}
                                            options={categoryOptions}
                                        />
                                    </div>
                                </div> */}
                                {/* <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Counselor Name</label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={counselorOptions.find(option => option.value === formData.counselorId) || null}
                                            onChange={(selectedOption) => handleDropdownChange('counselorId', selectedOption.value)}
                                            options={counselorOptions}
                                        />
                                    </div>
                                </div> */}
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">
                                            {"Meeting Link"}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name='treatment'
                                            maxLength={250}
                                            value={formData.treatment}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Status </label>
                                        <Select
                                            classNamePrefix="react-select"
                                            className="select"
                                            value={appointmentStatus.find(option => option.value === formData.status) || null}
                                            onChange={(selectedOption) => handleDropdownChange('status', selectedOption.value)}
                                            options={appointmentStatus}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-wrap">
                                        <label className="col-form-label">Message/Meeting Address</label> <span>(500 words only)</span>
                                        <textarea
                                            className="form-control"
                                            rows={2}
                                            name="message"
                                            value={formData.message}
                                            maxLength={500}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 text-end modal-btn">
                                    <Link to="#"
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                        onClick={handleReset}
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
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
    );
};

export default CreateAppointment;


// import { toast } from 'react-toastify'
// import axios from 'axios';
// import { appointmentStatus } from '../../../selectOption/selectOption';
// import { getCurrentDate, getCurrentTime } from '../../../selectOption/selectFunction';


// let num = 0
// const CreateAppointment = ({ fetchLeadDetails, leadDetails, counselorOptions, fetchLeadFollowupData }) => {
//     const apiUrl = import.meta.env.VITE_API_URL;
//     const Token = localStorage.getItem('token') || '';
//     const initialForm = {
//         name: "",
//         appointmentDate: getCurrentDate(),
//         appointmentTime: getCurrentTime(),
//         categoryId: null,
//         counselorName: "",
//         counselorId: null,
//         treatment: "",
//         assignedTo: null,
//         message: "",
//         status: "",
//     }
//     const [formData, setFormData] = useState(initialForm);
//     const [categoryOptions, setCategoryOptions] = useState([]);

//     const handleInputChange = (event) => {
//         const { name, value } = event.target
//         setFormData((prevForm) => ({
//             ...prevForm,
//             [name]: value
//         }))
//     }

//     const handleDropdownChange = (name, value) => {
//         setFormData((prevForm) => ({
//             ...prevForm,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault()
//         try {
//             // formData.leadId = leadDetails.leadId;


//             let formDataToSend = {
//                 ...formData,
//                 leadId: leadDetails?.leadId
//             };

//             const response = await fetch(`${apiUrl}/appointment/appointment`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${Token}`
//                 },
//                 body: JSON.stringify(formDataToSend)
//             })
//             const resData = await response.json();
//             if (!response.ok) {
//                 throw new Error(resData.message || 'Failed to add appointment');
//             }


//             fetchLeadDetails()
//             fetchLeadFollowupData()
//             toast.success('Appointment added successfully!');
//         } catch (error) {
//             toast.error(error.message || 'Something went wrong');
//         }
//     }


//     const fetchCategoryData = async () => {
//         try {
//             const response = await axios.get(`${apiUrl}/master/category-list`, {
//                 headers: {
//                     Authorization: `Bearer ${Token}`
//                 }
//             });
//             const formattedData = response.data.data.map((item) => ({
//                 label: item.name,
//                 value: item.id
//             }));
//             setCategoryOptions(formattedData);

//         } catch (error) {
//             setError(error)

//         }
//     };


//     // const fetchCounselorData = async () => {
//     //     try {
//     //         const response = await axios.get(`${apiUrl}/appointment/counselor-list`, {
//     //             headers: {
//     //                 Authorization: `Bearer ${Token}`
//     //             }
//     //         });
//     //         const formattedData = response.data.data.map((item) => ({
//     //             label: item.name,
//     //             value: item.staffId
//     //         }));
//     //         setCounselorOptions(formattedData);

//     //     } catch (error) {
//     //         setError(error)

//     //     }
//     // };

//     // console.log("staffOptions =>", staffOptions)

//     useEffect(() => {
//         fetchCategoryData()
//         // fetchCounselorData()
//     }, [])

//     useEffect(() => {
//         if (leadDetails?.leadId) {
//             setFormData((prevData) => ({
//                 ...prevData,
//                 name: leadDetails?.leadName,
//                 leadId: leadDetails?.leadId
//             }))
//         }

//     }, [leadDetails])

//     console.log("leadDetails =>", leadDetails);
//     console.log("formData =>", formData);


//     console.log("num =>", num);
//     num++
//     return (
//         <div
//             className="modal custom-modal fade modal-padding"
//             id="create_appointment"
//             role="dialog"
//         >
//             <div className="modal-dialog modal-dialog-centered">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title">Add New Appointment</h5>
//                         <button
//                             type="button"
//                             className="btn-close position-static"
//                             data-bs-dismiss="modal"
//                             aria-label="Close"
//                         >
//                             <span aria-hidden="true">×</span>
//                         </button>
//                     </div>
//                     <div className="modal-body p-0">
//                         <form onSubmit={handleSubmit}>
//                             <div className="row">
//                                 <div className="col-md-12">
//                                     <div className="form-wrap">
//                                         <label className="col-form-label">
//                                             {"Name"} <span className="text-danger">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name='name'
//                                             required
//                                             value={formData.name}
//                                             onChange={handleInputChange}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div className="form-wrap">
//                                         <label className="col-form-label">
//                                             {"Date"} <span className="text-danger">*</span>
//                                         </label>
//                                         <input
//                                             type="date"
//                                             className="form-control"
//                                             name='appointmentDate'
//                                             min={new Date().toISOString().split("T")[0]}
//                                             required
//                                             value={formData.appointmentDate}
//                                             onChange={handleInputChange}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div className="form-wrap">
//                                         <label className="col-form-label">
//                                             {"Time"} <span className="text-danger">*</span>
//                                         </label>
//                                         <input
//                                             type="time"
//                                             className="form-control"
//                                             name='appointmentTime'
//                                             required
//                                             value={formData.appointmentTime}
//                                             onChange={handleInputChange}
//                                             min={new Date().toISOString().slice(11, 16)} // Set min time dynamically
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div className="form-wrap">
//                                         <label className="col-form-label">
//                                             Category <span className="text-danger"></span>
//                                         </label>
//                                         <Select
//                                             classNamePrefix="react-select"
//                                             className="select"
//                                             value={categoryOptions.find(option => option.value === formData.categoryId)}
//                                             // onChange={(event) => {
//                                             //     let { value } = event
//                                             //     handleInputChange({ target: { name: 'categoryId', value } })
//                                             // }}
//                                             onChange={(selectedOption) => handleDropdownChange('categoryId', selectedOption.value)}
//                                             options={categoryOptions}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div className="form-wrap">
//                                         <label className="col-form-label">
//                                             Counselor Name <span className="text-danger"></span>
//                                         </label>
//                                         <Select
//                                             classNamePrefix="react-select"
//                                             className="select"
//                                             value={counselorOptions.find(option => option.value === formData.counselorId)}
//                                             onChange={(event) => {
//                                                 let { value } = event
//                                                 handleInputChange({ target: { name: 'counselorId', value } })
//                                             }}
//                                             options={counselorOptions}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="col-md-6">
//                                     <div className="form-wrap">
//                                         <label className="col-form-label">
//                                             {"Treatment"}
//                                         </label>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name='treatment'
//                                             value={formData.treatment}
//                                             onChange={handleInputChange}
//                                         />
//                                     </div>
//                                 </div>
//                                 {/* <div className="col-md-6">
//                                     <Dropdown
//                                         label="Assigned To"
//                                         name="assignedTo"
//                                         value={formData.assignedTo}
//                                         onChange={handleInputChange}
//                                         options={staffOptions}
//                                     />
//                                 </div> */}
//                                 <div className="col-md-6">
//                                     <div className="form-wrap">
//                                         <label className="col-form-label">
//                                             Status <span className="text-danger"></span>
//                                         </label>
//                                         <Select
//                                             classNamePrefix="react-select"
//                                             className="select"
//                                             required={true}
//                                             value={appointmentStatus.find(option => option.value === formData.status)}
//                                             onChange={(event) => {
//                                                 let { value } = event
//                                                 handleInputChange({ target: { name: 'status', value } })
//                                             }}
//                                             options={appointmentStatus}
//                                         />
//                                     </div>
//                                 </div>

//                                 <div className="col-md-12">
//                                     <div className="form-wrap">
//                                         <label className="col-form-label">
//                                             {"Message"}
//                                         </label>
//                                         <textarea
//                                             type="text"
//                                             className="form-control"
//                                             rows={2}
//                                             name='message'
//                                             value={formData.message}
//                                             onChange={handleInputChange}
//                                         />
//                                     </div>
//                                 </div>
//                                 {/* <div className='dotted-line'>
//                                 </div> */}

//                                 <div className='col-md-12'>
//                                     <div className="text-end modal-btn">
//                                         <Link
//                                             to="#"
//                                             className="btn btn-light"
//                                             data-bs-dismiss="modal"
//                                         >
//                                             Cancel
//                                         </Link>
//                                         <button
//                                             className="btn btn-primary"
//                                             data-bs-dismiss="modal"
//                                         >
//                                             Confirm
//                                         </button>
//                                     </div>
//                                 </div>

//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CreateAppointment