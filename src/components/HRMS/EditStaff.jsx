import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import axios from "axios";

const EditStaff = ({
  staffDetails,
  setStaffDetails,
  adduser,
  togglePopup,
  departmentOptions,
  groupOptions,
  workShiftOptions,
  jobTypeOptions,
  handleRefreshData,
  address,
  emergencyContact,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const profilePicUrl = staffDetails.profilePic;

  const initialForm = {
    staffId: staffDetails.staffId,
    name: staffDetails.name,
    userCompanyId: staffDetails.userCompanyId,
    companyBranchId: staffDetails.companyBranchId,
    email: staffDetails.email,
    mobile: staffDetails.mobile,
    gender: staffDetails.gender,
    departmentId: staffDetails.departmentId,
    roleId: staffDetails.roleId,
    jobTypeId: staffDetails.jobTypeId,
    workShiftId: staffDetails.workShiftId,
    password: staffDetails.passwordCopy,
    confirmPassword: staffDetails.passwordCopy,
    groupId: staffDetails.groupId,
    status: staffDetails.status,
    teamManager: staffDetails.teamManager,
    profilePic: null,
    address: staffDetails.address,
    emergencyContact: staffDetails.emergencyContact,
    panNo: staffDetails.panNo,
    aadharNo: staffDetails.aadharNo,
    fatherName: staffDetails.fatherName,
    bankName: staffDetails.bankName,
    bankAccountNo: staffDetails.bankAccountNo,
    bankIFSC: staffDetails.bankIFSC,
    pfAccountNo: staffDetails.pfAccountNo,
    gradeId: staffDetails.gradeId,
  };

  const [formData, setFormData] = useState(initialForm);
  const [passwords, setPasswords] = useState([false, false]);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [companeyOptions, setCompanyOptions] = useState([]);
  const [companeyId, setCompaneyId] = useState("");
  const [branchOptions, setBranchOptions] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const profilePicFile = files[0];
      if (profilePicFile.type.startsWith("image/")) {
        if (profilePicFile.size <= 5 * 1024 * 1024) {
          setProfilePicFile(profilePicFile);
          setFormData((prevData) => ({
            ...prevData,
            profilePic: profilePicFile,
          }));
        } else {
          toast.error("File size exceeds 5 MB");
        }
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  //   const handlePermissionChange = (event) => {
  //     const { value, checked } = event.target;

  //     if (checked) {
  //       // Add permission if checked
  //       setPermissions([...permissions, value]);
  //     } else {
  //       // Remove permission if unchecked
  //       setPermissions(permissions.filter((perm) => perm !== value));
  //     }
  //   };

  const togglePassword = (index) => {
    const updatedPasswords = [...passwords];
    updatedPasswords[index] = !updatedPasswords[index];
    setPasswords(updatedPasswords);
  };

  const genderOptions = [
    { value: "", label: "Choose" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.confirmPassword === formData.password) {
      handleInputChange({ target: { name: "confirmPassword", value: "" } });
      const dataToSend = { ...formData };
      delete dataToSend.confirmPassword;

      try {
        const updatedForm = {
          ...dataToSend,
          Permissions: permissions.length ? JSON.stringify(permissions) : "[]",
        };

        const formDataToSend = new FormData();
        for (const key in updatedForm) {
          if (updatedForm[key] !== null) {
            formDataToSend.append(key, updatedForm[key]);
          }
        }

        const response = await axios.put(
          `${apiUrl}/staff/edit-staff`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${Token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        togglePopup();
        handleRefreshData();
        toast.success("Staff edit successfully!");
        setStaffDetails(null);
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } else {
      toast.error("Password does not match");
    }
  };

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/master/role-list-by-department/${formData.departmentId}`
        );
        const formattedData = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setRoleOptions(formattedData);
      } catch (error) {
        toast.error(error.message);
      }
    };
    if (formData.departmentId) {
      fetchRoleData();
    }
  }, [formData.departmentId]);

  useEffect(() => {
    if (staffDetails?.staffId) {
      let permissionArr = [];

      if (Array.isArray(staffDetails.Permissions)) {
        permissionArr = staffDetails.Permissions; // Already an array, no parsing needed
      } else if (typeof staffDetails.Permissions === "string") {
        try {
          permissionArr = JSON.parse(staffDetails.Permissions);
        } catch (error) {
          console.error("Error parsing permissions:", error);
        }
      }

      setPermissions(permissionArr);
    }
  }, [staffDetails?.staffId]);
  // console.log('formData =>', formData)

  // Get Companey
  const getCompaneyData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/product/get-comany-list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      const formattedOptions = res.data.data.map((company) => ({
        label: company.companyName,
        value: company.id,
      }));

      setCompanyOptions(formattedOptions);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getCompaneyData();
  }, []);

  // Get Branch
  const getBranchData = async (companyId) => {
    try {
      const res = await axios.get(
        `${apiUrl}/product/company-branch-list-byid/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      console.log("branchOptions", res.data.data);
      const formattedOptions = res.data.data.map((branch) => ({
        label: branch.name,
        value: branch.id,
      }));
      setBranchOptions(formattedOptions);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Example: Company dropdown onChange handler
  const handleCompanyChange = (selectedOption) => {
    const selectedCompanyId = selectedOption?.value;

    setFormData((prev) => ({
      ...prev,
      userCompanyId: selectedCompanyId,
      companyBranchId: null, // reset branch
    }));

    if (selectedCompanyId) {
      getBranchData(selectedCompanyId);
    }
  };

  const handleBranchChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      companyBranchId: selectedOption?.value,
    }));
  };

  // Call getBranchData when companeyId changes
  useEffect(() => {
    if (formData.userCompanyId) {
      getBranchData(formData.userCompanyId);
    }
  }, [formData.userCompanyId]);

   // get grade
    const getGradeData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/master/grade-list`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        const formattedOptions = res.data.data.map((grade) => ({
          label: grade.name,
          value: grade.id,
        }));
        setGradeOptions(formattedOptions);
      } catch (error) {
        toast.error(error.message);
      }
    };
  
    useEffect(() => {
      getGradeData();
    }, []);

  return (
    <div className={`toggle-popup ${adduser ? "sidebar-popup" : ""}`}>
      <div className="sidebar-layout">
        <div className="sidebar-header">
          <h4>Edit Staff</h4>
          <Link
            to="#"
            className="sidebar-close toggle-btn"
            onClick={() => {
              togglePopup();
              setStaffDetails(null);
            }}
          >
            <i className="ti ti-x" />
          </Link>
        </div>
        <div className="toggle-body">
          <div className="pro-create">
            <form onSubmit={handleSubmit}>
              <div className="accordion-lists" id="list-accord">
                {/* Basic Info */}
                <div className="manage-user-modal">
                  <div className="manage-user-modals">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="profile-pic-upload">
                          <div className="profile-pic">
                            {profilePicFile ? (
                              <div>
                                <img
                                  src={URL.createObjectURL(profilePicFile)}
                                  alt="Image selected"
                                />
                              </div>
                            ) : (
                              <div>
                                <img src={profilePicUrl} alt="Image selected" />
                              </div>
                            )}
                          </div>
                          <div className="upload-content">
                            <div className="upload-btn">
                              <input type="file" onChange={handleFileChange} />
                              <span>
                                <i className="ti ti-file-broken" />
                                Upload File
                              </span>
                            </div>
                            <p>JPG, GIF or PNG. Max size of 5 MB</p>
                            {profilePicFile && (
                              <button
                                className="btn btn-light"
                                type="button"
                                onClick={() => {
                                  setProfilePicFile(null);
                                }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Name <span className="text-danger">*</span>
                          </label>
                          <input
                            name="name"
                            type="text"
                            className="form-control"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Company <span className="text-danger">*</span>
                          </label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            value={companeyOptions.find(
                              (option) =>
                                option.value === formData.userCompanyId
                            )}
                            onChange={handleCompanyChange}
                            options={companeyOptions}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Branch <span className="text-danger">*</span>
                          </label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            value={branchOptions.find(
                              (option) =>
                                option.value === formData.companyBranchId
                            )}
                            onChange={handleBranchChange}
                            options={branchOptions}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-wrap">
                          <div className="d-flex justify-content-between align-items-center">
                            <label className="col-form-label">
                              Email <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input
                            name="email"
                            type="email"
                            className="form-control"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>





<div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Father Name<span className="text-danger">*</span>
                          </label>
                          <input
                            name="fatherName"
                            type="text"
                            className="form-control"
                            required
                            value={formData.fatherName}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>









                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Mobile <span className="text-danger">*</span>
                          </label>
                          <input
                            name="mobile"
                            type="number"
                            className="form-control"
                            required
                            value={formData.mobile}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Gender <span className="text-danger">*</span>
                          </label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            value={genderOptions.find(
                              (option) => option.value === formData.gender
                            )}
                            onChange={(event) => {
                              let { value } = event;
                              handleInputChange({
                                target: { name: "gender", value },
                              });
                            }}
                            options={genderOptions}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Department <span className="text-danger">*</span>
                          </label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            value={departmentOptions.find(
                              (option) => option.value === formData.departmentId
                            )}
                            onChange={(event) => {
                              let { value } = event;
                              handleInputChange({
                                target: { name: "departmentId", value },
                              });
                              setFormData((prevData) => ({
                                ...prevData,
                                roleId: null,
                              }));
                            }}
                            options={departmentOptions}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Role <span className="text-danger">*</span>
                          </label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            value={roleOptions.find(
                              (option) => option.value === formData.roleId
                            )}
                            onChange={(event) => {
                              let { value } = event;
                              handleInputChange({
                                target: { name: "roleId", value },
                              });
                            }}
                            options={roleOptions}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">Group</label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            value={groupOptions.find(
                              (option) => option.value === formData.groupId
                            )}
                            onChange={(event) => {
                              let { value } = event;
                              handleInputChange({
                                target: { name: "groupId", value },
                              });
                            }}
                            options={groupOptions}
                          />
                        </div>
                      </div>


                       {/* ----------------------------------------------      */}
                                            <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">Grade</label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            value={roleOptions.find(
                              (option) => option.value === formData.gradeId
                            )}
                            onChange={(event) => {
                              let { value } = event;
                              handleInputChange({
                                target: { name: "gradeId", value },
                              });
                            }}
                            options={gradeOptions}
                          />
                        </div>
                      </div>
                                            <div className="col-md-4">
                                              <div className="form-wrap">
                                                <label className="col-form-label">
                                                  PAN <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                  name="panNo"
                                                  type="text"
                                                  className="form-control"
                                                  required
                                                  value={formData.panNo}
                                                  onChange={handleInputChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-wrap">
                                                <label className="col-form-label">
                                                  Aadhar No <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                  name="aadharNo"
                                                  type="number"
                                                  className="form-control"
                                                  required
                                                  value={formData.aadharNo}
                                                  onChange={handleInputChange}
                                                  onKeyDown={(e) => {
                                                        if (
                                                          ["e", "E", "+", "."].includes(e.key)
                                                        ) {
                                                          e.preventDefault();
                                                        }
                                                      }}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-wrap">
                                                <label className="col-form-label">
                                                  PF Account No <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                  name="pfAccountNo"
                                                  type="number"
                                                  className="form-control"
                                                  required
                                                  value={formData.pfAccountNo}
                                                  onChange={handleInputChange}
                                                  onKeyDown={(e) => {
                                                        if (
                                                          ["e", "E", "+", "-", "."].includes(e.key)
                                                        ) {
                                                          e.preventDefault();
                                                        }
                                                      }}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-wrap">
                                                <label className="col-form-label">
                                                  Bank Name<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                  name="bankName"
                                                  type="text"
                                                  className="form-control"
                                                  required
                                                  value={formData.bankName}
                                                  onChange={handleInputChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-wrap">
                                                <label className="col-form-label">
                                                  Account No<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                  name="bankAccountNo"
                                                  type="number"
                                                  className="form-control"
                                                  required
                                                  value={formData.bankAccountNo}
                                                  onChange={handleInputChange}
                                                  onKeyDown={(e) => {
                                                        if (
                                                          ["e", "E", "+", "-", "."].includes(e.key)
                                                        ) {
                                                          e.preventDefault();
                                                        }
                                                      }}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              <div className="form-wrap">
                                                <label className="col-form-label">
                                                  IFSC<span className="text-danger">*</span>
                                                </label>
                                                <input
                                                  name="bankIFSC"
                                                  type="text"
                                                  className="form-control"
                                                  required
                                                  value={formData.bankIFSC}
                                                  onChange={handleInputChange}
                                                />
                                              </div>
                                            </div>
                      
















                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">Job Type</label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            defaultValue={formData.jobType}
                            value={jobTypeOptions.find(
                              (option) => option.value === formData.jobTypeId
                            )}
                            onChange={(event) => {
                              let { value } = event;
                              handleInputChange({
                                target: { name: "jobTypeId", value },
                              });
                            }}
                            options={jobTypeOptions}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">Work Shift</label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            value={workShiftOptions.find(
                              (option) => option.value === formData.workShiftId
                            )}
                            onChange={(event) => {
                              let { value } = event;
                              handleInputChange({
                                target: { name: "workShiftId", value },
                              });
                            }}
                            options={workShiftOptions}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Password <span className="text-danger">*</span>
                          </label>
                          <div className="icon-form-end">
                            <span
                              className="form-icon"
                              onClick={() => togglePassword(0)}
                            >
                              <i
                                className={
                                  passwords[0] ? "ti ti-eye" : "ti ti-eye-off"
                                }
                              ></i>
                            </span>
                            <input
                              type={passwords[0] ? "text" : "password"}
                              className="form-control"
                              name="password"
                              // required
                              minLength={6}
                              value={formData.password}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Confirm Password{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="icon-form-end">
                            <span
                              className="form-icon"
                              onClick={() => togglePassword(1)}
                            >
                              <i
                                className={
                                  passwords[1] ? "ti ti-eye" : "ti ti-eye-off"
                                }
                              ></i>
                            </span>
                            <input
                              type={passwords[1] ? "text" : "password"}
                              className="form-control"
                              name="confirmPassword"
                              // required
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Address{" "}
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <div className="icon-form-end">
                            <input
                              type={"text"}
                              className="form-control"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Emergency Contact{" "}
                            {/* <span className="text-danger">*</span> */}
                          </label>
                          <div className="icon-form-end">
                            <input
                              name="emergencyContact"
                              type="number"
                              className="form-control"
                              value={formData.emergencyContact}
                              onChange={(event) => {
                                let { value } = event.target;
                                if (value.length <= 10) {
                                  handleInputChange({
                                    target: { name: "emergencyContact", value },
                                  });
                                } else {
                                  toast.error(
                                    "Mobile number should not be more than 10 digits"
                                  );
                                }
                              }}
                              // onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>

                      {/* <div className="col-md-12" style={{ marginBottom: '20px' }} >
                                            <div className="radio-wrap" >
                                                <label className="col-form-label">Permissions</label>
                                                <div className="d-flex flex-wrap" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div className="checkbox-btn">
                                                        <input
                                                            type="checkbox"
                                                            className="status-radio"
                                                            id="staff_dashboard"
                                                            value="Dashboard"
                                                            checked={permissions.includes("Dashboard")}
                                                            onChange={handlePermissionChange}
                                                        />
                                                        <label htmlFor="staff_dashboard">Dashboard</label>
                                                    </div>

                                                    <div className="checkbox-btn">
                                                        <input
                                                            type="checkbox"
                                                            className="status-radio"
                                                            id="staff_lead"
                                                            value="Lead"
                                                            checked={permissions.includes("Lead")}
                                                            onChange={handlePermissionChange}
                                                        />
                                                        <label htmlFor="staff_lead">Lead</label>
                                                    </div>

                                                    <div className="checkbox-btn">
                                                        <input
                                                            type="checkbox"
                                                            className="status-radio"
                                                            id="staff_customer"
                                                            value="Customer"
                                                            checked={permissions.includes("Customer")}
                                                            onChange={handlePermissionChange}
                                                        />
                                                        <label htmlFor="staff_customer">Customer</label>
                                                    </div>
                                                    <div className="checkbox-btn">
                                                        <input
                                                            type="checkbox"
                                                            className="status-radio"
                                                            id="staff_finance"
                                                            value="Finance"
                                                            checked={permissions.includes("Finance")}
                                                            onChange={handlePermissionChange}
                                                        />
                                                        <label htmlFor="staff_finance">Reports</label>
                                                    </div>
                                                    <div className="checkbox-btn">
                                                        <input
                                                            type="checkbox"
                                                            className="status-radio"
                                                            id="staff_setup"
                                                            value="Setup"
                                                            checked={permissions.includes("Setup")}
                                                            onChange={handlePermissionChange}
                                                        />
                                                        <label htmlFor="staff_setup">Setup</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                      <div className="col-md-6">
                        <div className="radio-wrap">
                          <label className="col-form-label">Team Manager</label>
                          <div className="d-flex flex-wrap">
                            <div className="radio-btn">
                              <input
                                type="radio"
                                className="status-radio"
                                id="team-manager-yes"
                                name="teamManager"
                                value="yes"
                                checked={formData.teamManager === "yes"}
                                onChange={() =>
                                  handleInputChange({
                                    target: {
                                      name: "teamManager",
                                      value: "yes",
                                    },
                                  })
                                }
                              />
                              <label htmlFor="team-manager-yes">Yes</label>
                            </div>
                            <div className="radio-btn">
                              <input
                                type="radio"
                                className="status-radio"
                                id="team-manager-no"
                                name="teamManager"
                                value="no"
                                checked={formData.teamManager === "no"}
                                onChange={() =>
                                  handleInputChange({
                                    target: {
                                      name: "teamManager",
                                      value: "no",
                                    },
                                  })
                                }
                              />
                              <label htmlFor="team-manager-no">No</label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="radio-wrap">
                          <label className="col-form-label">Status</label>
                          <div className="d-flex flex-wrap">
                            <div className="radio-btn">
                              <input
                                type="radio"
                                className="status-radio"
                                id="active"
                                name="status"
                                value="active"
                                checked={formData.status === "active"}
                                onChange={() => {
                                  handleInputChange({
                                    target: { name: "status", value: "active" },
                                  });
                                }}
                              />
                              <label htmlFor="active">Active</label>
                            </div>
                            <div className="radio-btn">
                              <input
                                type="radio"
                                className="status-radio"
                                id="inactive"
                                name="status"
                                value="inactive"
                                checked={formData.status == "inactive"}
                                onChange={() => {
                                  let data = {
                                    target: {
                                      name: "status",
                                      value: "inactive",
                                    },
                                  };
                                  handleInputChange(data);
                                }}
                              />
                              <label htmlFor="inactive">Inactive</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Basic Info */}
              </div>
              <div className="submit-button text-end mt-3">
                <Link
                  to="#"
                  className="btn btn-light sidebar-close"
                  onClick={() => {
                    togglePopup();
                    setStaffDetails(null);
                  }}
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStaff;
