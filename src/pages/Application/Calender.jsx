import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DatePicker from "react-datepicker";
import Select, { components } from "react-select";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { set } from "date-fns";
import axios from "axios";

const Calendar = () => {
  //   const [startDate, setStartDate] = useState(null);
  //   const [endDate, setEndDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [eventInvite, setEventInvite] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const fileInputRef = useRef();

  const //   [startDate, setDate] = useState(new Date()),
    [showCategory, setshowCategory] = useState(false),
    [showmodel, setshowmodel] = useState(false),
    [showEvents, setshowEvents] = useState(false),
    [show, setshow] = useState(false),
    [iseditdelete, setiseditdelete] = useState(false),
    [addneweventobj, setaddneweventobj] = useState(null),
    [isnewevent, setisnewevent] = useState(false),
    [event_title, setevent_title] = useState(""),
    [category_color, setcategory_color] = useState(""),
    [calenderevent, setcalenderevent] = useState(""),
    [weekendsVisible, setweekendsVisible] = useState(true),
    [currentEvents, setscurrentEvents] = useState([]),
    defaultEvents = [
      {
        title: "Event Name 4",
        start: Date.now() + 148000000,
        className: "bg-purple",
      },
      {
        title: "Test Event 1",
        start: Date.now(),
        end: Date.now(),
        className: "bg-success",
      },
      {
        title: "Test Event 2",
        start: Date.now() + 168000000,
        className: "bg-info",
      },
      {
        title: "Test Event 3",
        start: Date.now() + 338000000,
        className: "bg-primary",
      },
    ];
  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));
  }, []);


  const handleDateSelect = (selectInfo) => {
    setisnewevent(true);
    setaddneweventobj(selectInfo);
  };


  const options1 = [
    { value: "Success", label: "Success" },
    { value: "Danger", label: "Danger" },
    { value: "Info", label: "Info" },
    { value: "Primary", label: "Primary" },
    { value: "Warning", label: "Warning" },
    { value: "Inverse", label: "Inverse" },
  ];
  const categoryOptions = [
    { value: "Category1", label: "Category1" },
    { value: "Category2", label: "Category2" },
  ];

  const inviteOptions = [
    { label: "Employee", value: "employee" },
    { label: "Client", value: "client" },
  ];



  const defaultValue = options1[0];

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  // get staff data
  const [staffOptions, setStaffOptions] = useState([]);
  const fetchStaffData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/staff/staff-list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      const rawData = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      const formattedData = rawData.map((item) => ({
        label: item.name,
        value: item.staffId,
      }));

      setStaffOptions(formattedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(
        error?.response?.data?.message || "Error fetching staff list"
      );
    }
  };

  //   get Client data
  const [clientOptions, setClientOptions] = useState([]);

  const fatchClientData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/customer/customer-list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      const rawData = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      const formattedData = rawData.map((item) => ({
        label: item?.customerName,
        value: item?.customerId,
      }));
      setClientOptions(formattedData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchStaffData();
    fatchClientData();
  }, []);

  // Custom Option to show checkbox in dropdown
  const CheckboxOption = (props) => {
    return (
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => {}}
          className="form-check-input me-2"
        />
        <label>{props.label}</label>
      </components.Option>
    );
  };

  // add event api post
  const initialForm = {
    title: "",
    category: "",
    // date: "",
    time: "",
    // envite: "",
    description: "",
    // banner: "",
    // inviteEmployee: "",
    // inviteClient: "",
    link: "",
    staffId: JSON.parse(localStorage.getItem("staffId")),
  };

  const [formData, setFormData] = useState(initialForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setBannerFile(file);
    }
  };
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  //   const handelSubmitEvent = async (e) => {
  //     e.preventDefault();

  //     const form = new FormData();
  //     form.append("title", formData.title);
  //     form.append("category", formData.category);
  //     // form.append("date", startDate?.toISOString().split("T")[0] || "");
  //     form.append("time", formData.time);
  //     form.append("envite", eventInvite);
  //     form.append("description", formData.description);
  //     form.append("link", formData.link);

  //     if (eventInvite === "employee") {
  //       selectedStaff.forEach((id) => form.append("inviteEmployee[]", id));
  //     }

  //     if (eventInvite === "client") {
  //       form.append("inviteClient", selectedClient);
  //     }

  //     if (bannerFile) {
  //       form.append("banner", bannerFile);
  //     }

  //     if (startDate) {
  //   form.append("date", startDate.toISOString().split("T")[0]);
  // } else {
  //   toast.error("Please select a date range");
  //   return;
  // }

  //     try {
  //       const res = await axios.post(`${apiUrl}/product/add-event`, formData, {
  //         headers: { Authorization: `Bearer ${Token}` },
  //       });
  //       toast.success(res.data.message);
  //     } catch (error) {
  //       toast.error(error.response?.data?.message || "Something went wrong");
  //     }
  //   };
  const handelSubmitEvent = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    // Validate required fields if needed
    if (!formData.title || !formData.category || !startDate || !formData.time) {
      toast.error("Please fill in all required fields.");
      setIsSubmitLoading(false);
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("category", formData.category);
    form.append("time", formData.time);
    form.append("invite", eventInvite);
    form.append("description", formData.description);
    form.append("link", formData.link);

    // Add the banner image if uploaded
    if (bannerFile) {
      form.append("banner", bannerFile);
    }

   if (startDate && endDate) {
  const formattedStart = startDate.toISOString().split("T")[0];
  const formattedEnd = endDate.toISOString().split("T")[0];

  form.append("date", formattedStart);     // ✅ Start date
  form.append("endDate", formattedEnd);    // ✅ End date
} else {
  toast.error("Please select a complete date range");
  setIsSubmitLoading(false);
  return;
}

    // Handle invite type
    if (eventInvite === "employee" && selectedStaff.length > 0) {
      form.append("inviteEmployee", selectedStaff.join(","));
    }

    if (eventInvite === "client" && selectedClient.length > 0) {
      form.append("inviteClient", selectedClient.join(","));
    }

    if (formData.staffId) {
      form.append("staffId", Number(formData.staffId));
    }

    try {
      const res = await axios.post(`${apiUrl}/product/add-event`, form, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData(initialForm);
      setBannerFile(null);
      setImage(null);
      setSelectedStaff([]);
      setSelectedClient([]);
      setEventInvite(null);
      setDateRange([null, null]);
      fileInputRef.current.value = "";

      const modalElement = document.getElementById("add_event");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      toast.success(res.data.message || "Event added successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  //   get Event
  const [allCalenderData, setAllCalenderData] = useState([]);

  const getEvents = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/dashboard/upcoming-all-followups`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
    //   setAllCalenderData(res.data.data);
      console.log("allData", res.data.data);

    const eventList = res.data.data.events?.map((item) => ({
      id: `event-${item.id}`,
    //   title: item.title || 'No Title',
      title: `${item.title || "No Event"} — ${formatTime(item.time)}`,
    
      start: item.date,
    //   start: `${item.date}T${item.time}`,
    //   end: item.endDate,
      backgroundColor: '#FDA700',
      borderColor: '#3b82f6',
    })) || [];
     

    const taskList = res.data.data.tasks?.map((item) => ({
      id: `task-${item.taskId}`,
      title: item.taskTitle || 'No Task',
      start: item.startDate,
      backgroundColor: '#FC0027',
      borderColor: '#22c55e',
    })) || [];
    

     const callList = res.data.data.calls?.map((item) => ({
      id: `call-${item.id}`,
      title: `${item.status || "No Status "} - ${item.callBackTime}`,
      start: item.callBackDate,
      backgroundColor: '#5CB85C' ,
      borderColor: '#22c55e', 
    })) || [];

    // console.log("callList", callList);

    const appointmentList = res.data.data.appointments?.map((item) => ({
      id: `appointment-${item.id}`,
      title: `${item.status || ' '} - ${formatTime(item.meetingTime)}`,
      start: item.meetingDate, 
      backgroundColor: '#1ECBE2', 
    })) || [];


     // Merge all 4
    setAllCalenderData([
      ...eventList,
      ...taskList,
      ...callList,
      ...appointmentList
    ]);
  
    } catch (error) {
      toast.error(error.res?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    getEvents();
  }, []);

    // Custom formatTime function (24h to 12h format)
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

   // Custom renderer for event content
  const renderEventContent = (eventInfo) => {
    const [title, time] = eventInfo.event.title.split(" — ");
    return (
      <div style={{ padding: "2px 4px" }}>
        <div style={{ fontWeight: "bold", fontSize: "13px" }}>{`${title}${time ? ` - ${time}` : ""}`}</div>
        {/* <div style={{ fontSize: "12px", color: "#fff" }}>{time}</div> */}
      </div>
    );
  };

//   console.log("event", allCalenderData?.events?.map((item) => item.time));
//   console.log("tasks", allCalenderData?.tasks?.map((item) => item.taskTitle));
//   console.log("calls", allCalenderData?.calls?.map((item) => item.status));
//   console.log("appointments", allCalenderData?.appointments?.map((item) => item.type));

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="row align-items-center w-100">
              <div className="col-lg-10 col-sm-12">
                <h3 className="page-title">Calendar</h3>
              </div>
              <div className="col-lg-2 col-sm-12 d-flex justify-content-end p-0">
                <Link
                  to="#"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add_event"
                >
                  Create Event
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <h4 className="card-title">Drag &amp; Drop Event</h4>
              <div id="calendar-events" className="mb-3">
                <div className="calendar-events" data-class="bg-info">
                  <i className="fas fa-circle text-info" /> My Meetings
                </div>
                <div className="calendar-events" data-class="bg-success">
                  <i className="fas fa-circle text-success" /> My Calls
                </div>
                <div className="calendar-events" data-class="bg-danger">
                  <i className="fas fa-circle text-danger" /> My Task
                </div>
                <div className="calendar-events" data-class="bg-warning">
                  <i className="fas fa-circle text-warning" /> My Events
                </div>
              </div>
              <div className="checkbox  mb-3">
                <input id="drop-remove" className="me-1" type="checkbox" />
                <label htmlFor="drop-remove">Remove after drop</label>
              </div>
              <Link
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#add_new_event"
                className="btn mb-3 btn-primary btn-block w-100"
              >
                <i className="fas fa-plus" /> Add Category
              </Link>
            </div>
            <div className="col-lg-9 col-md-8">
              <div className="card bg-white">
                <div className="card-body">
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={weekendsVisible}
                    events={allCalenderData}
                    eventContent={renderEventContent}
                    // initialEvents={allCalenderData} // alternatively, use the `events` setting to fetch from a feed
                    select={handleDateSelect}
                    // eventClick={(clickInfo) => handleEventClick(clickInfo)}
                    eventClick={handleEventClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Event Modal */}
      <div id="add_event" className="modal custom-modal fade" role="dialog" >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Event</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">x</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handelSubmitEvent}>
                <div className="form-group mb-3">
                  <label>
                    Event Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>
                    Event Category <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <Select
                      className="select"
                      options={categoryOptions}
                      value={categoryOptions.find(
                        (opt) => opt.value === formData.category
                      )}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          category: selected?.value || "",
                        })
                      }
                      placeholder="Select"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>
                    Event Date <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <DatePicker
                      selected={startDate}
                      //   onChange={(dates) => {
                      //     const [start, end] = dates;
                      //     setStartDate(start);
                      //     setEndDate(end);
                      //   }}
                      onChange={(update) => setDateRange(update)}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      placeholderText="Select date range"
                      className="form-control"
                      dateFormat="dd-MM-yyyy"
                      minDate={new Date()}
                    />
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>
                    Event Time <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>
                    Event Invite <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <Select
                      className="select"
                      options={inviteOptions}
                      value={inviteOptions.find((i) => i.value === eventInvite)}
                      onChange={(selected) => {
                        setEventInvite(selected.value || null);
                        setSelectedStaff([]);
                        setSelectedClient(null);
                      }}
                      placeholder="Select"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
                {/* Show only if 'employee' is selected */}
                {eventInvite === "employee" && (
                  <div className="form-group mb-3">
                    <label>
                      Employees <span className="text-danger">*</span>
                    </label>
                    <div className="cal-icon">
                      <Select
                        isMulti
                        options={staffOptions}
                        components={{ Option: CheckboxOption }}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        onChange={(selected) =>
                          setSelectedStaff(selected.map((s) => s.value))
                        }
                        value={staffOptions.filter((s) =>
                          selectedStaff.includes(s.value)
                        )}
                        className="select"
                        classNamePrefix="react-select"
                        placeholder="Select Employees"
                      />
                    </div>
                  </div>
                )}
                {/* Show only if 'client' is selected */}
                {eventInvite === "client" && (
                  <div className="form-group mb-3">
                    <label>
                      Clients <span className="text-danger">*</span>
                    </label>
                    <div className="cal-icon">
                      <Select
                        isMulti
                        options={clientOptions}
                        components={{ Option: CheckboxOption }}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        onChange={(selected) =>
                          setSelectedClient(selected.map((s) => s.value))
                        }
                        value={clientOptions.filter(
                          (s) =>
                            Array.isArray(selectedClient) &&
                            selectedClient.includes(s.value)
                        )}
                        className="select"
                        classNamePrefix="react-select"
                        placeholder="Select Clients"
                      />
                    </div>
                  </div>
                )}

                <div className="form-group mb-3">
                  <label>
                    Event Banner <span className="text-danger">*</span>
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
                    </div>

                    <div className="profile-upload-content">
                      <label className="profile-upload-btn">
                        <i className="ti ti-file-broken" /> Upload File
                        <input
                          type="file"
                          className="input-img"
                          onChange={handleMainImageChange}
                          accept="image/*"
                          ref={fileInputRef}
                        />
                      </label>
                      {/* <p>JPG, GIF or PNG. Max size of 800K</p> */}
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>
                    Link <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <input
                      type="text"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>
                    Description <span className="text-danger">*</span>
                  </label>
                  <div className="cal-icon">
                    <textarea
                      name="description"
                      rows="4"
                      className="form-control"
                      placeholder="Enter event details or notes..."
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                <div className="submit-section" type="submit">
                  <button
                    type="submit"
                    className="btn btn-primary submit-btn "
                    disabled={isSubmitLoading}
                  >
                    {isSubmitLoading ? "Submiting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Event Modal */}
      {/* Add Event2 Modal */}
      <div className="modal custom-modal fade none-border" id="my_event">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Event</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true"
              ></button>
            </div>
            <div className="modal-body" />
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-success save-event submit-btn"
              >
                Create event
              </button>
              <button
                type="button"
                className="btn btn-danger delete-event submit-btn"
                data-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Event2 Modal */}
      {/* Add Category Modal */}
      <div className="modal custom-modal fade" id="add_new_event">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Add Category</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-hidden="true"
              >
                <span aria-hidden="true">x</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label className="col-form-label">Category Name</label>
                  <input
                    className="form-control form-white"
                    placeholder="Enter name"
                    type="text"
                    name="category-name"
                  />
                </div>
                <div className="form-group mb-0  mt-3">
                  <label className="col-form-label">
                    Choose Category Color
                  </label>
                  <Select
                    className="form-white"
                    defaultValue={defaultValue}
                    options={options1}
                    placeholder="Success"
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="submit-section">
                  <button
                    type="button"
                    className="btn btn-primary save-category submit-btn"
                    data-dismiss="modal"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Category Modal */}
      {/*Event Show Modal */}
      {/* {showModal && selectedEvent && (
        <>
          <div
            className="modal fade show"
            tabIndex="-1"
            style={{ display: "block" }}
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{zIndex: "10000"}}>
                <div className="modal-header">
                  <h5 className="modal-title">Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Title:</strong> {selectedEvent.title}
                  </p>
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(selectedEvent.start).toLocaleDateString("en-GB")}
                  </p>
                  {selectedEvent.end && (
                    <p>
                      <strong>End:</strong>{" "}
                      {new Date(selectedEvent.end).toLocaleString("en-GB")}
                    </p>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )} */}
      {showModal && selectedEvent && (
  <>
    <div
      className="modal fade show"
      tabIndex="-1"
      style={{ display: "block" }}
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content" style={{ zIndex: "10000" }}>
          <div className="modal-header">
            <h5 className="modal-title">Details</h5>
            {/* <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button> */}
                <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              >
                <span aria-hidden="true">x</span>
              </button>
          </div>

          <div className="modal-body">
            {/* Split title and time safely */}
            {(() => {
              let title = selectedEvent.title;
              let time = "";

              if (title.includes(" — ")) {
                [title, time] = title.split(" — ");
              } else if (title.includes(" - ")) {
                [title, time] = title.split(" - ");
              }

              return (
                <>
                  <p>
                    <strong>Title:</strong> {title}
                  </p>
                  {time && (
                    <p>
                      <strong>Time:</strong> {time}
                    </p>
                  )}
                </>
              );
            })()}

            {/* Start Date */}
            <p>
              <strong>Start:</strong>{" "}
              {new Date(selectedEvent.start).toLocaleDateString("en-GB")}
            </p>

            {/* End Date (optional) */}
            {selectedEvent.end && (
              <p>
                <strong>End:</strong>{" "}
                {new Date(selectedEvent.end).toLocaleDateString("en-GB")}
              </p>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-primary" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Backdrop */}
    <div className="modal-backdrop fade show"></div>
  </>
)}

      {/*Event Show Modal */}
    </>
  );
};

export default Calendar;
