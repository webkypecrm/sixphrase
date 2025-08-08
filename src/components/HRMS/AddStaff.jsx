import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddStaff = ({
  adduser,
  togglePopup,
  departmentOptions,
  groupOptions,
  workShiftOptions,
  jobTypeOptions,
  handleRefreshData,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const initialForm = {
    name: "",
    fatherName: "",
    email: "",
    userCompanyId: null,
    companyBranchId: null,
    mobile: "",
    gender: "",
    departmentId: null,
    roleId: null,
    jobTypeId: null,
    workShiftId: null,
    password: "",
    confirmPassword: "",
    groupId: null,
    gradeId: null,
    panNo: "",
    aadharNo: "",
    bankName: "",
    bankAccountNo: "",
    bankIFSC: "",
    pfAccountNo: "",
    status: "active",
    teamManager: "no",
    profilePic: null,
    Permissions: "",
    address: "",
    emergencyContact: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [passwords, setPasswords] = useState([false, false]);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
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
          toast.error("File size exceeds 5MB");
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

  // const handlePermissionChange = (event) => {
  //   const { value, checked } = event.target;

  //   if (checked) {
  //     // Add permission if checked
  //     setPermissions([...permissions, value]);
  //   } else {
  //     // Remove permission if unchecked
  //     setPermissions(permissions.filter((perm) => perm !== value));
  //   }
  // };

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
    setIsSubmitLoading(true);
    console.log("Loading started");
    if (formData.confirmPassword === formData.password) {
      handleInputChange({ target: { name: "confirmPassword", value: "" } });
      delete formData.confirmPassword;
      try {
        const updatedFormData = {
          ...formData,
          Permissions: permissions.length ? JSON.stringify(permissions) : "[]",
        };

        const formDataToSend = new FormData();
        for (const key in updatedFormData) {
          if (updatedFormData[key] !== null) {
            formDataToSend.append(key, updatedFormData[key]);
          }
        }
        const response = await fetch(`${apiUrl}/staff/add-staff`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Token}`,
          },
          body: formDataToSend,
        });
        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.message || "Failed to add staff");
        }
        togglePopup();
        handleRefreshData();
        setFormData(initialForm);
        toast.success("Staff added successfully!");
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setIsSubmitLoading(false);
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
        // console.log(error)
        toast.error(error.message);
      }
    };
    if (formData.departmentId) {
      fetchRoleData();
    }
  }, [formData.departmentId]);

  console.log("permissions =>", permissions);
  console.log("formData =>", formData);

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
      companyBranchId: null, // Reset branch when company changes
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
    if (companeyId) {
      getBranchData(companeyId);
    }
  }, [companeyId]);

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
          <h4>Add New Staff</h4>
          <Link
            to="#"
            className="sidebar-close toggle-btn"
            onClick={togglePopup}
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
                              <span>
                                <i className="ti ti-photo" />
                              </span>
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
                            onChange={(event) => {
                              let { value } = event.target;
                              if (value.length <= 10) {
                                handleInputChange({
                                  target: { name: "mobile", value },
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
                      <div className="col-md-4">
                        <div className="form-wrap">
                          <label className="col-form-label">
                            Gender <span className="text-danger">*</span>
                          </label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            defaultValue={formData.gender}
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
                          <label className="col-form-label">Job Type</label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            value={roleOptions.find(
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
                            value={roleOptions.find(
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
                          <label className="col-form-label">Group</label>
                          <Select
                            classNamePrefix="react-select"
                            className="select"
                            value={roleOptions.find(
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
                              required
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
                              required
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

                      {/* <div
                        className="col-md-12"
                        style={{ marginBottom: "20px" }}
                      >
                        <div className="radio-wrap">
                          <label className="col-form-label">Permissions</label>
                          <div
                            className="d-flex flex-wrap"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
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
                                // defaultChecked={true}
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
                                defaultChecked={true}
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
                                defaultChecked={true}
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
                                onChange={() => {
                                  handleInputChange({
                                    target: {
                                      name: "status",
                                      value: "inactive",
                                    },
                                  });
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
                  onClick={togglePopup}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitLoading}
                >
                  {isSubmitLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Create
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
