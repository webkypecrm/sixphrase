import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  statusOption,
  activeList,
  initialSettings,
  options1,
  priorityList,
} from "../../selectOption/selectOption";
import DatePicker from "react-datepicker";
import { TagsInput } from "react-tag-input-component";
import { toast } from "react-toastify";
import axios from "axios";

const AddTicket = ({
  activityToggle,
  setActivityToggle,
  taskCategoryOptions,
  leadOptions,
  // customerOptions,
  staffOptions,
  fetchTaskData,
  getticketData,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const initialForm = {
    customerCustomerId: null,
    project: "",
    supportCategoryId: null,
    supportSubCategoryId: null,
    title: "",
    tags: "",
    status: "",
    assignedTo: null,
    priority: "",
    details: "",
    images: [],
    uploadVideo: "",
    videoUrl: "",
    visibility: "public",
  };
  const [formData, setFormData] = useState(initialForm);
  const [tagValue, setTagValue] = useState(["Collab"]);
  const [isLoading, setLoading] = useState(false);
  const [multiImages, setMultiImages] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [ticketDetails, setTicketDetails] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);

  //more photos
  const multiImageRef = useRef(null);

  const handleMultipleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const remainingSlots = 10 - multiImages.length;
    if (remainingSlots <= 0) {
      toast.warn("You can only upload up to 10 images.");
      return;
    }
    if (newFiles.length > remainingSlots) {
      toast.warn(`Only ${remainingSlots} image(s) can be added.`);
    }
    const limitedNewFiles = newFiles.slice(0, remainingSlots);
    setMultiImages((prev) => [...prev, ...limitedNewFiles]);
    e.target.value = null;
  };
  // remove image
  const handleRemoveImage = (indexToRemove) => {
    setMultiImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  //   upload videos
  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
      setVideoFile(file);
    }
  };

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "assignedTo") {
      setFormData({ ...formData, [name]: value ? parseInt(value) : "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name, option) => {
    setFormData((prev) => ({
      ...prev,
      [name]: option?.value || null,
    }));
  };

  const handlePriorityChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      priority: e.target.value,
    }));
  };

  // const handleTicketDetailsChange = (e) => {
  //   const inputText = e.target.value;
  //   const words = inputText.trim().split(/\s+/).filter(Boolean);
  //   if (words.length <= 300) {
  //     setTicketDetails(inputText);
  //   }
  // };

  // status option
  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "Progress", label: "Progress" },
    { value: "closed", label: "Closed" },
  ];
  //project option
  const projectOptions = [{ value: "Null", label: "Null" }];

  // get Category
  const getCategoryData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/master/support-category-list`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const formattedData = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setCategoryOptions(formattedData);
    } catch (error) {
      console.log("error", error);
    }
  };

  // get subcategory
  const getSubCategoryData = async (categoryId) => {
    try {
      const response = await axios.get(
        `${apiUrl}/master/support-sub-category-list-by-task-category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const formattedData = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setSubCategoryOptions(formattedData);
    } catch (error) {
      console.error("Error fetching subcategories", error);
    }
  };

  // get customer
  const getCustomerData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/customer/customer-list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("first", response.data.data);
      const formattedData = response.data.data.map((item) => ({
        value: item.customerId,
        label: item.customerName,
      }));
      setCustomerOptions(formattedData);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  useEffect(() => {
    getCategoryData();
    getCustomerData();
  }, []);

  // Submit Ticket
  const submitTicket = async (e) => {
    e.preventDefault();
    try {
      const ticketFormData = new FormData();
      ticketFormData.append("customerCustomerId", formData.customerCustomerId);
      ticketFormData.append("project", formData.project);
      ticketFormData.append("supportCategoryId", formData.supportCategoryId);
      ticketFormData.append(
        "supportSubCategoryId",
        formData.supportSubCategoryId
      );
      ticketFormData.append("title", formData.title);
      ticketFormData.append("tags", tagValue.join(","));
      ticketFormData.append("status", formData.status);
      ticketFormData.append("priority", formData.priority);
      ticketFormData.append("visibility", formData.visibility);
      ticketFormData.append("details", formData.details);
      ticketFormData.append("videoUrl", formData.videoUrl);

      // ✅ Only append assignedTo if it's selected
      if (formData.assignedTo !== null && formData.assignedTo !== "") {
        ticketFormData.append("assignedTo", parseInt(formData.assignedTo));
      }

      multiImages.forEach((img) => {
        ticketFormData.append("images", img);
      });

      if (videoFile) {
        ticketFormData.append("uploadVideo", videoFile);
      }

      setLoading(true);
      const res = await axios.post(
        `${apiUrl}/product/add-support-ticket`,
        ticketFormData,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Ticket added successfully");
      getticketData();
      setActivityToggle(!activityToggle);
      // ✅ RESET all fields
      setFormData(initialForm);
      setTagValue(["Collab"]);
      setMultiImages([]);
      setVideoPreview(null);
      setVideoFile(null);
    } catch (err) {
      console.error("Ticket submission error:", err);
      toast.error("Error submitting ticket");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Fragment>
      <div
        className={
          activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout">
          <div className="sidebar-header">
            <h4>Add New Ticket</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setActivityToggle(!activityToggle)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <form className="toggle-height" onSubmit={submitTicket}>
              <div className="pro-create">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">Select Customer</label>
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        name="customerCustomerId"
                        options={customerOptions}
                        value={customerOptions.find(
                          (option) =>
                            option.value === formData.customerCustomerId 
                        )}
                        onChange={(option) =>
                          handleSelectChange("customerCustomerId", option)
                        }
                        placeholder="Select Customer"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Select Job/Project
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        name="project"
                        options={projectOptions}
                        value={projectOptions.find(
                          (opt) => opt.value === formData.project
                        )}
                        onChange={(option) =>
                          handleSelectChange("project", option)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="col-form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <div className="form-wrap icon-form">
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        name="supportCategoryId"
                        options={categoryOptions}
                        value={categoryOptions.find(
                          (option) =>
                            option.value === formData.supportCategoryId
                        )}
                        onChange={(option) => {
                          handleSelectChange("supportCategoryId", option);
                          getSubCategoryData(option?.value);
                        }}
                        placeholder="Select Category"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="col-form-label">
                      Sub Category <span className="text-danger">*</span>
                    </label>
                    <div className="form-wrap icon-form">
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        name="supportSubCategoryId"
                        options={subCategoryOptions}
                        value={subCategoryOptions.find(
                          (option) =>
                            option.value === formData.supportSubCategoryId
                        )}
                        onChange={(option) =>
                          handleSelectChange("supportSubCategoryId", option)
                        }
                        placeholder="Select Sub Category"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Ticket Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter Title"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Tags <span className="text-danger">*</span>
                      </label>
                      <TagsInput
                        // className="input-tags form-control"
                        // value={formData.tags.split(",")}
                        // onChange={(value) => setTagValue(value)}
                        className="input-tags form-control"
                        value={tagValue}
                        onChange={setTagValue}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="col-form-label">
                      Status <span className="text-danger">*</span>
                    </label>
                    <div className="form-wrap icon-form">
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        name="status"
                        options={statusOptions}
                        value={statusOptions.find(
                          (opt) => opt.value === formData.status
                        )}
                        onChange={(option) =>
                          handleSelectChange("status", option)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="col-form-label">
                      Assign to <span className="text-danger">*</span>
                    </label>
                    <div className="form-wrap icon-form">
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        name="assignedTo"
                        options={staffOptions}
                        value={staffOptions.find(
                          (opt) => opt.value === formData.assignedTo
                        )}
                        onChange={(option) =>
                          handleSelectChange("assignedTo", option)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap radio-wrap">
                        <label className="col-form-label">Priority :<span className="text-danger">*</span></label>
                        <div className="d-flex flex-wrap">
                          <div className="radio-btn">
                            <input
                              type="radio"
                              className="status-radio"
                              id="task-lead"
                              name="priority"
                              value="Normal"
                              checked={formData.priority === "Normal"}
                              onChange={handlePriorityChange}
                            />
                            <label htmlFor="task-lead">Normal</label>
                          </div>
                          <div className="radio-btn">
                            <input
                              type="radio"
                              className="status-radio"
                              id="task-company"
                              name="priority"
                              value="Urgent"
                              checked={formData.priority === "Urgent"}
                              onChange={handlePriorityChange}
                            />
                            <label htmlFor="task-company">Urgent</label>
                          </div>
                          <div className="radio-btn">
                            <input
                              type="radio"
                              className="status-radio"
                              id="task-order"
                              name="priority"
                              value="Very Urgent"
                              checked={formData.priority === "Very Urgent"}
                              onChange={handlePriorityChange}
                            />
                            <label htmlFor="task-order">Very Urgent</label>
                          </div>
                        </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                  <div className="radio-wrap form-wrap">
                    <label className="col-form-label">Visibility</label>
                    <div className="d-flex flex-wrap">
                      <div className="radio-btn">
                        <input
                          type="radio"
                          className="status-radio"
                          id="task-public"
                          name="visibility"
                          value="public"
                          checked={formData.visibility === "public"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="task-public">Public</label>
                      </div>
                      <div className="radio-btn">
                        <input
                          type="radio"
                          className="status-radio"
                          id="task-private"
                          name="visibility"
                          value="private"
                          checked={formData.visibility === "private"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="task-private">Private</label>
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="col-lg-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Ticket Details <span className="text-danger">*</span>
                      </label>
                      <span>(300 words only)</span>
                      <textarea
                        className="form-control"
                        name="details"
                        rows={4}
                        value={formData.details}
                        // onChange={handleTicketDetailsChange}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Upload More Photos (10 Photos)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        disabled={multiImages.length >= 10}
                        onChange={handleMultipleImagesChange}
                        ref={multiImageRef}
                      />
                      <div className="image-preview mt-2 d-flex flex-wrap">
                        {multiImages.map((img, index) => (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              margin: "5px",
                            }}
                          >
                            <img
                              src={URL.createObjectURL(img)}
                              alt="preview"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "5px",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                              title="Remove"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">Upload Video</label>
                      <div className="profile-upload">
                        <div className="profile-upload-img">
                          {!videoPreview && (
                            <span>
                              <i className="ti ti-video" />
                            </span>
                          )}

                          {videoPreview && (
                            <video
                              controls
                              width="110"
                              height="110"
                              style={{ borderRadius: "5px", maxWidth: "100px",objectFit: "cover" }}
                            >
                              <source src={videoPreview} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}

                          <button
                            type="button"
                            className="profile-remove"
                            onClick={() => {
                              setVideoPreview(null);
                              setVideoFile(null);
                            }}
                          >
                            <i className="ti ti-x" />
                          </button>
                        </div>

                        <div className="profile-upload-content">
                          <label className="profile-upload-btn">
                            <i className="ti ti-file-broken" /> Upload File
                            <input
                              type="file"
                              className="input-img"
                              onChange={handleVideoChange}
                              accept="video/*"
                            />
                          </label>
                          <p>MP4, AVI, MOV. Max size of 50MB</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        Add Video <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="submit-button text-end">
                <Link
                  to="#"
                  className="btn btn-light sidebar-close"
                  onClick={() => {
                    setActivityToggle(!activityToggle);
                  }}
                >
                  Cancel
                </Link>
                {isLoading ? (
                  <button type="button" disabled className="btn btn-primary">
                    Sending...
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default AddTicket;
