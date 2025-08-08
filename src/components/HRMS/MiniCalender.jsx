import React, { useState, useEffect, Fragment } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


import Select from "react-select";
import { Link } from "react-router-dom";

const MiniCalender = () => {
      const [startDate, setDate] = useState(new Date()),
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
  
  
      const addEvent = () => {
          setshowEvents(true);
      };
      const categoryHandler = () => {
          setshowCategory(true);
      };
  
      const handleClose = () => {
          setisnewevent(false);
          setiseditdelete(false);
          setshow(false);
          setshowCategory(false);
          setshowEvents(false);
          setshowmodel(false);
      };
  
      const handleEventClick = (clickInfo) => {
          setiseditdelete(false);
          setevent_title(clickInfo.event.title);
          setcalenderevent(clickInfo.event);
      };
  
      const handleDateSelect = (selectInfo) => {
          setisnewevent(true);
          setaddneweventobj(selectInfo);
      };
  
  
      const onupdateModalClose = () => {
          setiseditdelete(false);
          setevent_title("");
      };
  
  
  
      const handleClick = () => {
          setshow(true);
      };
  
      const options1 = [
          { value: "Success", label: "Success" },
          { value: "Danger", label: "Danger" },
          { value: "Info", label: "Info" },
          { value: "Primary", label: "Primary" },
          { value: "Warning", label: "Warning" },
          { value: "Inverse", label: "Inverse" },
      ];
  
      const defaultValue = options1[0];

  return (
    <Fragment>
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
                                           <i className="fas fa-circle text-info" /> My Event One
                                       </div>
                                       <div className="calendar-events" data-class="bg-success">
                                           <i className="fas fa-circle text-success" /> My Event Two
                                       </div>
                                       <div className="calendar-events" data-class="bg-danger">
                                           <i className="fas fa-circle text-danger" /> My Event Three
                                       </div>
                                       <div className="calendar-events" data-class="bg-warning">
                                           <i className="fas fa-circle text-warning" /> My Event Four
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
                                               initialEvents={defaultEvents} // alternatively, use the `events` setting to fetch from a feed
                                               select={handleDateSelect}
                                               eventClick={(clickInfo) => handleEventClick(clickInfo)}
                                           />
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
                   {/* Add Event Modal */}
                   <div id="add_event" className="modal custom-modal fade" role="dialog">
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
                                   <form>
                                       <div className="form-group">
                                           <label>
                                               Event Name <span className="text-danger">*</span>
                                           </label>
                                           <input className="form-control" type="text" />
                                       </div>
                                       <div className="form-group">
                                           <label>
                                               Event Date <span className="text-danger">*</span>
                                           </label>
                                           <div className="cal-icon">
                                               <input className="form-control " type="text" />
                                           </div>
                                       </div>
                                       <div className="submit-section">
                                           <button className="btn btn-primary submit-btn" onClick={() => addEvent()}>Submit</button>
                                       </div>
                                   </form>
                               </div>
                           </div>
                       </div>
                   </div>
                   {/* /Add Event Modal */}
                   {/* Add Event Modal */}
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
                   {/* /Add Event Modal */}
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
                                           <input className="form-control form-white" placeholder="Enter name" type="text" name="category-name" />
                                       </div>
                                       <div className="form-group mb-0  mt-3">
                                           <label className="col-form-label">Choose Category Color</label>
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

    </Fragment>
  )
}

export default MiniCalender