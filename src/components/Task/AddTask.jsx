import React, { useEffect, useState } from "react";
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

const AddTask = ({
  activityToggle,
  setActivityToggle,
  taskCategoryOptions,
  leadOptions,
  customerOptions,
  staffOptions,
  fetchTaskData,
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const initialForm = {
    taskType: "lead",
    taskTitle: "",
    priority: "",
    assignedTo: "",
    startDate: "",
    endDate: "",
    description: "",
    tags: "",
    leadId: null,
    taskCategoryId: null,
    taskSubCategoryId: null,
    status: "open",
    visibility: "public",
    attachment: null,
  };
  const [formData, setFormData] = useState(initialForm);
  const [tagValue, setTagValue] = useState(["Collab"]);
  const [taskSubCategoryOptions, setTaskSubCategoryOptions] = useState([]);
  const [attachmentFile, setAttachementFile] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // console.log('attachmentFile =>', attachmentFile)

  const handleDateChange = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      startDate: formattedDate,
    }));
  };

  const handleDateChange1 = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      endDate: formattedDate,
    }));
  };

  const handleFileChange = (event) => {
    console.log("event =>", event);
    const files = event.target.files;

    if (files.length > 0) {
      const attachmentFile = files[0];
      if (
        attachmentFile.type.startsWith("application/") ||
        attachmentFile.type.startsWith("text/csv") ||
        attachmentFile.type.startsWith("image")
      ) {
        if (attachmentFile.size <= 1024 * 1024) {
          console.log("files =>", files);

          setAttachementFile(attachmentFile);
          setFormData((prevData) => ({
            ...prevData,
            attachment: attachmentFile,
          }));
        } else {
          toast.error("File size exceeds 1MB");
        }
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      formData.tags = JSON.stringify(tagValue);

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await fetch(`${apiUrl}/task/add-task`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
        body: formDataToSend,
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Failed to add task");
      }
      setActivityToggle(!activityToggle);
      fetchTaskData();
      setFormData(initialForm);
      toast.success("Task added successfully!");
      setLoading(false);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchTaskSubCategoryData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/master/task-sub-category-list-by-task-category/${formData.taskCategoryId}`
        );
        const formattedData = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setTaskSubCategoryOptions(formattedData);
      } catch (error) {
        // console.log(error)
        toast.error(error.message);
      }
    };
    if (formData.taskCategoryId) {
      fetchTaskSubCategoryData();
    }
  }, [formData.taskCategoryId]);

  // console.log('formData =>', formData)

  return (
    <div
      className={activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"}
    >
      <div className="sidebar-layout">
        <div className="sidebar-header">
          <h4>Add New Task</h4>
          <Link
            to="#"
            className="sidebar-close toggle-btn"
            onClick={() => setActivityToggle(!activityToggle)}
          >
            <i className="ti ti-x" />
          </Link>
        </div>
        <div className="toggle-body">
          <form className="toggle-height" onSubmit={handleSubmit}>
            <div className="pro-create">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-wrap">
                    <div
                      className="radio-wrap"
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        gap: "20px",
                      }}
                    >
                      <label className="col-form-label">Task Type :</label>
                      <div className="d-flex flex-wrap">
                        <div className="radio-btn">
                          <input
                            type="radio"
                            className="status-radio"
                            id="task-lead"
                            name="taskType"
                            value="lead"
                            checked={formData.taskType === "lead"}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="task-lead">Lead</label>
                        </div>
                        {/* <div className="radio-btn">
                          <input
                            type="radio"
                            className="status-radio"
                            id="task-company"
                            name="taskType"
                            value="company"
                            onChange={handleInputChange}
                          />
                          <label htmlFor="task-company">Company</label>
                        </div> */}
                        {/* <div className="radio-btn">
                          <input
                            type="radio"
                            className="status-radio"
                            id="task-order"
                            name="taskType"
                            value="order"
                            onChange={handleInputChange}
                          />
                          <label htmlFor="task-order">Order</label>
                        </div> */}
                        {/* <div className="radio-btn">
                          <input
                            type="radio"
                            className="status-radio"
                            id="task-project"
                            name="taskType"
                            value="project"
                            onChange={handleInputChange}
                          />
                          <label htmlFor="task-project">Project</label>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                {formData?.taskType === "lead" && (
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">Select Lead</label>
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        value={leadOptions.find(
                          (option) => option.value === formData.leadId
                        )}
                        onChange={(event) => {
                          let { value } = event;
                          handleInputChange({
                            target: { name: "leadId", value },
                          });
                        }}
                        options={leadOptions}
                      />
                    </div>
                  </div>
                )}

                {/* {formData?.taskType === "project" && (
                  <div className="col-md-12">
                    <div className="form-wrap">
                      <label className="col-form-label">Select Customer</label>
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        value={customerOptions.find(
                          (option) => option.value === formData.leadId
                        )}
                        onChange={(event) => {
                          let { value } = event;
                          handleInputChange({
                            target: { name: "leadId", value },
                          });
                        }}
                        options={customerOptions}
                      />
                    </div>
                  </div>
                )} */}

                <div className="col-md-12">
                  <div className="form-wrap">
                    <label className="col-form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      name="taskTitle"
                      type="text"
                      className="form-control"
                      required
                      value={formData.taskTitle}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-wrap">
                    <label className="col-form-label">
                      Start Date <span className="text-danger"> *</span>
                    </label>
                    <div className="icon-form">
                      <span className="form-icon">
                        <i className="ti ti-calendar-check" />
                      </span>
                      <DatePicker
                        className="form-control datetimepicker deals-details"
                        selected={formData.startDate}
                        onChange={(date) => handleDateChange(date)}
                        dateFormat="dd-MM-yyyy"
                        minDate={new Date()}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-wrap">
                    <label className="col-form-label">
                      End Date <span className="text-danger"> *</span>
                    </label>
                    <div className="icon-form">
                      <span className="form-icon">
                        <i className="ti ti-calendar-check" />
                      </span>
                      <DatePicker
                        className="form-control datetimepicker deals-details"
                        selected={formData.endDate}
                        onChange={(date) => handleDateChange1(date)}
                        dateFormat="dd-MM-yyyy"
                        minDate={formData.startDate}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-wrap">
                    <label className="col-form-label">Priority</label>
                    <div className="select-priority">
                      <span className="select-icon">
                        <i className="ti ti-square-rounded-filled" />
                      </span>
                      <Select
                        classNamePrefix="react-select"
                        className="select"
                        value={priorityList.find(
                          (option) => option.value === formData.priority
                        )}
                        onChange={(event) => {
                          let { value } = event;
                          handleInputChange({
                            target: { name: "priority", value },
                          });
                        }}
                        options={priorityList}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="col-form-label">
                    Task Category <span className="text-danger">*</span>
                  </label>
                  <div className="form-wrap icon-form">
                    <Select
                      classNamePrefix="react-select"
                      className="select"
                      value={taskCategoryOptions.find(
                        (option) => option.value === formData.taskCategoryId
                      )}
                      onChange={(event) => {
                        let { value } = event;
                        handleInputChange({
                          target: { name: "taskCategoryId", value },
                        });
                      }}
                      options={taskCategoryOptions}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="col-form-label">
                    Task Sub Category <span className="text-danger">*</span>
                  </label>
                  <div className="form-wrap icon-form">
                    <Select
                      classNamePrefix="react-select"
                      className="select"
                      value={taskSubCategoryOptions.find(
                        (option) => option.value === formData.taskSubCategoryId
                      )}
                      onChange={(event) => {
                        let { value } = event;
                        handleInputChange({
                          target: { name: "taskSubCategoryId", value },
                        });
                      }}
                      options={taskSubCategoryOptions}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-wrap">
                    <label className="col-form-label">Assign To</label>
                    <Select
                      classNamePrefix="react-select"
                      className="select"
                      value={staffOptions.find(
                        (option) => option.value === formData.assignedTo
                      )}
                      onChange={(event) => {
                        let { value } = event;
                        handleInputChange({
                          target: { name: "assignedTo", value },
                        });
                      }}
                      options={staffOptions}
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="form-wrap">
                    <label className="col-form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <span>(500 words only)</span>
                    <textarea
                      className="form-control"
                      type="text"
                      name="description"
                      maxLength={500}
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                    {/* <DefaultEditor
                                            className="summernote"
                                        /> */}
                  </div>
                </div>

                <div className="form-wrap">
                  <label className="col-form-label">
                    Attachment <span className="text-danger">*</span>
                  </label>
                  <div className="drag-attach">
                    <input type="file" onChange={handleFileChange} />
                    <div className="img-upload">
                      <i className="ti ti-file-broken" />
                      {attachmentFile ? attachmentFile.name : "Upload File"}
                    </div>
                  </div>
                  {attachmentFile && (
                    <button
                      className="btn btn-light"
                      type="button"
                      onClick={() => {
                        setAttachementFile(null);
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="col-md-4">
                  <div className="form-wrap">
                    <label className="col-form-label">
                      Tags <span className="text-danger">*</span>
                    </label>
                    <TagsInput
                      className="input-tags form-control"
                      value={tagValue}
                      onChange={setTagValue}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-wrap">
                    <label className="col-form-label">Status</label>
                    <Select
                      classNamePrefix="react-select"
                      className="select"
                      value={statusOption.find(
                        (option) => option.value === formData.status
                      )}
                      onChange={(event) => {
                        let { value } = event;
                        handleInputChange({
                          target: { name: "status", value },
                        });
                      }}
                      options={statusOption}
                    />
                  </div>
                </div>

                {/* <div className="col-md-4">
                                    <div className="radio-wrap form-wrap">
                                        <label className="col-form-label">
                                            Status
                                        </label>
                                        
                                        <div className="d-flex flex-wrap">
                                            <div className="radio-btn">
                                                <input
                                                    type="radio"
                                                    className="status-radio"
                                                    id="task_open"
                                                    name="open"
                                                    value='open'
                                                    defaultChecked
                                                    onChange={handleInputChange}
                                                />
                                                <label htmlFor="task_open">Open</label>
                                            </div>
                                            <div className="radio-btn">
                                                <input
                                                    type="radio"
                                                    className="status-radio"
                                                    id="task_inactive"
                                                    name="status"
                                                    value="inactive"
                                                    onChange={handleInputChange}
                                                />
                                                <label htmlFor="task_inactive">Inactive</label>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}

                <div className="col-md-4">
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
                          defaultChecked
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
                          onChange={handleInputChange}
                        />
                        <label htmlFor="task-private">Private</label>
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
  );
};

export default AddTask;
