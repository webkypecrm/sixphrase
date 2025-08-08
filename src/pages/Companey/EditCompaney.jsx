import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

const EditCompaney = ({
  companeyDetails,
  activityToggleTwo,
  setActivityToggleTwo,
  isSubmitLoading,
  setIsSubmitLoading,
  companyData,
  fatchCompaneyData,
}) => {
  console.log("companeyDetails", companeyDetails);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    companyID: "",
    companyName: "",
    companyType: "",
    companyGST: "",
    companyPAN: "",
    website: "",
    address: "",
    logo: null,
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (companeyDetails) {
      setFormData({
        companyID: companeyDetails.companyID || "",
        companyName: companeyDetails.companyName || "",
        companyType: companeyDetails.companyType || "",
        companyGST: companeyDetails.companyGST || "",
        companyPAN: companeyDetails.companyPAN || "",
        website: companeyDetails.website || "",
        address: companeyDetails.address || "",
      });

      if (companeyDetails.logo) {
        setImage(companeyDetails.logo);
      }
    }
  }, [companeyDetails]);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      companyType: selectedOption.value,
    });
  };

  // image
  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  // update companey
  const handelUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const submitData = new FormData();

    // Append all fields except logo
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "logo") {
        submitData.append(key, value);
      }
    });

    // Handle logo field
    if (imageFile) {
      submitData.append("logo", imageFile);
    }

    try {
      const res = await axios.put(
        `${apiUrl}/product/update-company/${companeyDetails.id}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      fatchCompaneyData();
      setActivityToggleTwo(false);
      toast.success("Company updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="sidebar-layout">
        <div className="sidebar-header">
          <h4>Edit Company</h4>
          <Link
            to="#"
            className="sidebar-close toggle-btn"
            onClick={() => setActivityToggleTwo(!activityToggleTwo)}
          >
            <i className="ti ti-x" />
          </Link>
        </div>
        <div className="toggle-body">
          <form onSubmit={handelUpdate} className="toggle-height">
            <div className="pro-create">
              <div className="accordion-lists" id="list-accord">
                <div className="user-accordion-item">
                  <div
                    className="accordion-collapse collapse show"
                    id="basic"
                    data-bs-parent="#list-accord"
                  >
                    <div
                      className="content-collapse"
                      style={{ borderTop: "none" }}
                    >
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Company ID <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="companyID"
                              value={formData.companyID}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Company Name{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="companyName"
                              onChange={handleInputChange}
                              value={formData.companyName}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Company Type{" "}
                            </label>
                            <Select
                              className="select"
                              options={companyData}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              name="companyType"
                              value={companyData.find(
                                (option) =>
                                  option.value === formData.companyType
                              )}
                              onChange={handleSelectChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Company GST{" "}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="companyGST"
                              onChange={handleInputChange}
                              value={formData.companyGST}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Company PAN
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="companyPAN"
                              onChange={handleInputChange}
                              value={formData.companyPAN}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">Website</label>
                            <input
                              type="text"
                              className="form-control"
                              name="website"
                              onChange={handleInputChange}
                              value={formData.website}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              onChange={handleInputChange}
                              value={formData.address}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-wrap">
                            <label className="col-form-label">
                              Company Logo
                            </label>
                            <div className="profile-upload">
                              <div className="profile-upload-img">
                                {!image && (
                                  <span>
                                    <i className="ti ti-photo" />
                                  </span>
                                )}
                                {image && (
                                  <img
                                    src={image}
                                    alt="Preview"
                                    style={{
                                      borderRadius: "5px",
                                      width: "110px",
                                      height: "110px",
                                      maxWidth: "101px",
                                    }}
                                  />
                                )}
                                <button
                                  type="button"
                                  className="profile-remove"
                                  onClick={() => setImage(null)}
                                >
                                  <i className="ti ti-x" />
                                </button>
                              </div>
                              <div className="profile-upload-content">
                                <label className="profile-upload-btn">
                                  <i className="ti ti-file-broken" /> Upload
                                  Logo
                                  <input
                                    type="file"
                                    className="input-img"
                                    onChange={handleMainImageChange}
                                    accept="image/*"
                                  />
                                </label>
                                <p>JPG, GIF or PNG. Max size of 800K</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="submit-button text-end">
              <Link
                to="#"
                className="btn btn-light sidebar-close"
                onClick={() => setActivityToggleTwo(!activityToggleTwo)}
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
                    Updateing...
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default EditCompaney;
