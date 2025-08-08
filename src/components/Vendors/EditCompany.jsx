import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import axios from 'axios';

const EditCompany = ({
    editCompany,
    setEditCompany,
    industryOptions,
    countryOptions,
    companyDetails,
    setCompanyDetails,
    fetchLeadData
}) => {
    const companyImgUrl = companyDetails.companyImg
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const initialForm = {
        companyId: companyDetails.companyId,
        companyName: companyDetails.companyName,
        companyEmail: companyDetails.companyEmail,
        companyMobile1: companyDetails.companyMobile1,
        companyMobile2: companyDetails.companyMobile2,
        companyMobile3: companyDetails.companyMobile3,
        website: companyDetails.website,
        gstNo: companyDetails.gstNo,
        panNo: companyDetails.panNo,
        industryId: companyDetails.industryId,
        address: companyDetails.address,
        cityId: companyDetails.cityId,
        stateId: companyDetails.stateId,
        countryId: companyDetails.countryId,
        pincode: companyDetails.pincode,
        facebook: companyDetails.facebook,
        skype: companyDetails.skype,
        linkedin: companyDetails.linkedin,
        twitter: companyDetails.twitter,
        instagram: companyDetails.instagram,
        whatsapp: companyDetails.whatsapp,
        visibility: companyDetails.visibility,
        status: companyDetails.status,
        companyImg: null
    }
    const [formData, setFormData] = useState(initialForm);
    const [companyImgFile, setcompanyImgFile] = useState(null)
    const [newContents, setNewContents] = useState([0]);
    const [stateOptions, setStateOptions] = useState([])
    const [cityOptions, setCityOptions] = useState([])
    const mobileArr = ['companyMobile1', 'companyMobile2', 'companyMobile3']
    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData((prevForm) => ({
            ...prevForm,
            [name]: value
        }))
    }
    const addNewContent = () => {
        setNewContents([...newContents, newContents.length]);
    };
    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const companyImgFile = files[0];
            if (companyImgFile.type.startsWith("image/")) {
                if (companyImgFile.size <= 800 * 1024) {
                    setcompanyImgFile(companyImgFile)
                    setFormData((prevData) => ({
                        ...prevData,
                        companyImg: companyImgFile
                    }))
                } else {
                    toast.error('File size exceeds 800k');
                }
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key])
                }
            }
            const response = await fetch(`${apiUrl}/lead/edit-company`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${Token}`
                },
                body: formDataToSend
            })
            const resData = await response.json();
            if (!response.ok) {
                throw new Error(resData.message || 'Failed to add company');
            }
            setEditCompany((prev) => !prev)
            fetchLeadData()
            setCompanyDetails(null)
            setcompanyImgFile(null)
            toast.success('Company edited successfully!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        }
    }

    useEffect(() => {
        const fetchStateData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/employee/state-list/${formData.countryId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setStateOptions(formattedData);

            } catch (error) {
                toast.error(error)
            }
        };

        const fetchCityData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/employee/city-list/${formData.stateId}`, {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
                const formattedData = response.data.data.map((item) => ({
                    label: item.name,
                    value: item.id
                }));
                setCityOptions(formattedData);

            } catch (error) {
                toast.error(error)
            }
        };

        if (formData.countryId) {
            fetchStateData()
        }
        if (formData.stateId)
            fetchCityData()
    }, [formData.countryId, formData.stateId])


    return (
        <div className={`toggle-popup2 ${editCompany ? "sidebar-popup" : ""}`}>
            <div className="sidebar-layout">
                <div className="sidebar-header">
                    <h4>Edit Company</h4>
                    <Link
                        to="#"
                        className="sidebar-close toggle-btn"
                        onClick={() => {
                            setEditCompany((prev) => !prev)
                            setCompanyDetails(null)
                        }}
                    >
                        <i className="ti ti-x" />
                    </Link>
                </div>
                <div className="toggle-body">
                    <form onSubmit={handleSubmit} >
                        <div className="pro-create">
                            <div className="accordion-lists" id="list-accord">
                                {/* Basic Info */}
                                <div className="user-accordion-item">
                                    <Link
                                        to="#"
                                        className="accordion-wrap"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#basic"
                                    >
                                        <span>
                                            <i className="ti ti-user-plus" />
                                        </span>
                                        Basic Info
                                    </Link>
                                    <div
                                        className="accordion-collapse collapse show"
                                        id="basic"
                                        data-bs-parent="#list-accord"
                                    >
                                        <div className="content-collapse">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="profile-pic-upload">
                                                        <div className="profile-pic">
                                                            {companyImgFile ?
                                                                <div>
                                                                    <img
                                                                        src={URL.createObjectURL(companyImgFile)}
                                                                        alt="Image selected"
                                                                    />
                                                                </div> :
                                                                <div>
                                                                    <img
                                                                        src={companyImgUrl}

                                                                    />
                                                                </div>
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
                                                            <p>JPG, GIF or PNG. Max size of 800K</p>
                                                            {companyImgFile &&
                                                                <button
                                                                    className="btn btn-light"
                                                                    type="button"
                                                                    onClick={() => { setcompanyImgFile(null) }}
                                                                >
                                                                    Remove
                                                                </button>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Company Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='companyName'
                                                            required
                                                            value={formData.companyName}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <label className="col-form-label">
                                                                Company Email <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="status-toggle small-toggle-btn d-flex align-items-center">
                                                                <span className="me-2 label-text">
                                                                    Email Opt Out
                                                                </span>
                                                                <input
                                                                    type="checkbox"
                                                                    id="user"
                                                                    className="check"
                                                                    defaultChecked={true}
                                                                />
                                                                <label
                                                                    htmlFor="user"
                                                                    className="checktoggle"
                                                                />
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='companyEmail'
                                                            value={formData.companyEmail}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                {newContents.map((index) => (
                                                    <div className="col-md-6" key={index} >
                                                        <div className="add-product-new">
                                                            <div className="row align-items-end">
                                                                <div className="col-md-12">
                                                                    <div className="form-wrap mb-2">
                                                                        <label className="col-form-label">
                                                                            Company Mobile <span className="text-danger">*</span>
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            value={formData[mobileArr[index]]}
                                                                            onChange={(event) => {
                                                                                let { value } = event.target
                                                                                handleInputChange({ target: { name: mobileArr[index], value } })
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <Link
                                                                onClick={addNewContent}
                                                                to="#"
                                                                className="add-new add-new-phone mb-3 d-block"
                                                            >
                                                                <i className="ti ti-square-rounded-plus me-2" />
                                                                Add New
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            GST Number <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='gstNo'
                                                            required
                                                            value={formData.gstNo}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            PAN Number <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='panNo'
                                                            required
                                                            value={formData.panNo}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Website <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='website'
                                                            required
                                                            value={formData.website}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Industry <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            className="select"
                                                            value={industryOptions.find(option => option.value === formData.industryId)}
                                                            onChange={(event) => {
                                                                let { value } = event
                                                                handleInputChange({ target: { name: 'industryId', value } })

                                                            }}
                                                            options={industryOptions}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Basic Info */}
                                {/* Address Info */}
                                <div className="user-accordion-item">
                                    <Link
                                        to="#"
                                        className="accordion-wrap collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#address"
                                    >
                                        <span>
                                            <i className="ti ti-map-pin-cog" />
                                        </span>
                                        Address Info
                                    </Link>
                                    <div
                                        className="accordion-collapse collapse"
                                        id="address"
                                        data-bs-parent="#list-accord"
                                    >
                                        <div className="content-collapse">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Country <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            className="select"
                                                            value={countryOptions.find(option => option.value === formData.countryId)}
                                                            onChange={(event) => {
                                                                let { value } = event
                                                                handleInputChange({ target: { name: 'countryId', value } })

                                                            }}
                                                            options={countryOptions}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            State <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            className="select"
                                                            value={stateOptions.find(option => option.value === formData.stateId)}
                                                            onChange={(event) => {
                                                                let { value } = event
                                                                handleInputChange({ target: { name: 'stateId', value } })

                                                            }}
                                                            options={stateOptions}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            City <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            classNamePrefix="react-select"
                                                            className="select"
                                                            value={cityOptions.find(option => option.value === formData.cityId)}
                                                            onChange={(event) => {
                                                                let { value } = event
                                                                handleInputChange({ target: { name: 'cityId', value } })
                                                            }}
                                                            options={cityOptions}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Street Address <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='address'
                                                            required
                                                            value={formData.address}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Pincode <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='pincode'
                                                            required
                                                            value={formData.pincode}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Address Info */}
                                {/* Social Profile */}
                                <div className="user-accordion-item">
                                    <Link
                                        to="#"
                                        className="accordion-wrap collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#social"
                                    >
                                        <span>
                                            <i className="ti ti-social" />
                                        </span>
                                        Social Profile
                                    </Link>
                                    <div
                                        className="accordion-collapse collapse"
                                        id="social"
                                        data-bs-parent="#list-accord"
                                    >
                                        <div className="content-collapse">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Facebook
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='facebook'
                                                            value={formData.facebook}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Skype
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='skype'
                                                            value={formData.skype}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Linkedin
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='linkedin'
                                                            value={formData.linkedin}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Twitter
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='twitter'
                                                            value={formData.twitter}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Whatsapp
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='whatsapp'
                                                            value={formData.whatsapp}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Instagram
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name='instagram'
                                                            value={formData.instagram}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* /Social Profile */}
                                {/* Access */}
                                <div className="user-accordion-item">
                                    <Link
                                        to="#"
                                        className="accordion-wrap collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#access"
                                    >
                                        <span>
                                            <i className="ti ti-accessible" />
                                        </span>
                                        Access
                                    </Link>
                                    <div
                                        className="accordion-collapse collapse"
                                        id="access"
                                        data-bs-parent="#list-accord"
                                    >
                                        <div className="content-collapse">
                                            <div className="row">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="radio-wrap form-wrap">
                                                            <label className="col-form-label">Visibility</label>
                                                            <div className="d-flex flex-wrap">
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="public3"
                                                                        name="visibility"
                                                                        value="public"
                                                                        checked={formData.visibility == 'public'}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="public3">Public</label>
                                                                </div>
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="private3"
                                                                        name="visibility"
                                                                        value="private"
                                                                        checked={formData.visibility == 'private'}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="private3">Private</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="radio-wrap form-wrap">
                                                            <label className="col-form-label">Status</label>
                                                            <div className="d-flex flex-wrap">
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="active3"
                                                                        name="status"
                                                                        value="active"
                                                                        checked={formData.status == 'active'}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="active3">Active</label>
                                                                </div>
                                                                <div className="radio-btn">
                                                                    <input
                                                                        type="radio"
                                                                        className="status-radio"
                                                                        id="inactive3"
                                                                        name="status"
                                                                        value="inactive"
                                                                        checked={formData.status == 'inactive'}
                                                                        onChange={handleInputChange}
                                                                    />
                                                                    <label htmlFor="inactive3">Inactive</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* /Access */}
                            </div>
                        </div>
                        <div className="submit-button text-end">
                            <Link to="#" className="btn btn-light sidebar-close" onClick={() => setEditCompany((prev) => !prev)}>
                                Cancel
                            </Link>
                            <button type="submit" className="btn btn-primary">
                                Edit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditCompany