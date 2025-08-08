import React, { useContext, useEffect, useState } from "react";
import ImageWithBasePath from "../../../components/ImageWithBasePath";
import { AuthContext } from "../../../context/AuthProvider";
import CollapseHeader from '../../../components/CollapseHeader/CollapseHeader';


import { Link } from 'react-router-dom';
import Select from "react-select";
import { toast } from 'react-toastify';
import Dropdown from "../../../components/UI/Dropdown";

const Profile = () => {
  const { staffData } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';

  const initialForm = {
    name: '',
    email: '',
    mobile: '',
    gender: '',
    departmentId: null,
    roleId: null,
    jobTypeId: null,
    workShiftId: null,
    password: '',
    confirmPassword: '',
    groupId: null,
    status: 'active',
    profilePic: null,
    Permissions: "",
    address: "",
    emergencyContact: "",
    profilePicUrl: ""
  };
  const [formData, setFormData] = useState(initialForm);
  const [profilePicFile, setProfilePicFile] = useState(null)
  const [leadForOption, setLeadForOption] = useState([]);



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
      setLeadForOption(formattedData);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setFormData(() => ({
      ...staffData
    }));
    setProfilePicFile(staffData?.profilePicUrl)
  }, [staffData?.staffId]);

  useEffect(() => {
    fetchLeadForData()
  }, [])

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            {/* Page Header */}
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-sm-4">
                  <h4 className="page-title">Profile</h4>
                </div>
                <div className="col-sm-8 text-sm-end">
                  <div className="head-icons">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
            </div>
            {/* /Page Header */}

            <div className="row">
              <div className="col-xl-12 col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="settings-form">
                      <form>
                        <div className="settings-sub-header">
                          <h6>Employee Information</h6>
                        </div>
                        <div className="form-wrap">
                          <div className="profile-upload">
                            <div className="profile-upload-img">
                              <div className="profile-pic">
                                <div>
                                  <img
                                    src={formData?.profilePicUrl}
                                    alt="Image selected"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="profile-details">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Name <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.name || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Mobile <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.mobile || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Emergency Contact <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.emergencyContact || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Email <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.email || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Department <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.department?.name || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Role <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.role?.name || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Gender <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.gender || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Group <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.group?.name || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Job Type <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.jobType?.name || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Work Shift <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.workShift?.name || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Status <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.status || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="profile-address">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Address <span className="text-danger">*</span>
                                </label>
                                <input type="text" className="form-control" value={formData?.address || ''} disabled style={{ backgroundColor: '#f1f1f1' }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* /Settings Info */}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
