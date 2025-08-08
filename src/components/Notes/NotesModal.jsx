import React, { useState } from "react";
import { Eye, Star, Trash2 } from "react-feather/dist";
import { Link } from "react-router-dom";
import Select from "react-select";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import axios from "axios";
import { format } from "date-fns";

const NotesModal = ({handelRefresh,refresh}) => {
  const [dueDate, setDueDate] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const staffId = JSON.parse(localStorage.getItem("staffId"));

  const optionsChoose = [
    { value: "Choose", label: "Choose" },
    { value: "Recent1", label: "Recent1" },
    { value: "Recent2", label: "Recent2" },
  ];

  const categoryOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Onhold", label: "Onhold" },
    { value: "Inprogress", label: "Inprogress" },
    { value: "Done", label: "Done" },

  ];
  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];
  const statusOptions = [
    { value: "Open", label: "Open" },
    { value: "Hold", label: "Hold" },
    { value: "Close", label: "Close" },
  ];
  const optionsSelect = [
    { value: "Open", label: "Open" },
    { value: "Hold", label: "Hold" },
    { value: "Close", label: "Close" },
  ];

  const optionsOnHold = [{ value: "Onhold", label: "Onhold" }];

  const optionsPriority = [
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

//   // note Add
//   const initialForm = {
//     title: "",
//     assignedTo: "",
//     tags: "",
//     priority: "",
//     status: "",
//     date: "",
//     description: "",
//     staffId: JSON.parse(localStorage.getItem("staffId")),
//   };
//   const [formData, setFormData] = useState(initialForm);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormData((prevForm) => ({
//       ...prevForm,
//       [name]: value,
//     }));
//   };

//   const addNote = async (e) => {
//     e.preventDefault();
//     setSubmitLoading(true);
//     try {
//       const res = await axios.post(`${apiUrl}/master/add-note`, formData, {
//         headers: {
//           Authorization: `Bearer ${Token}`,
//         },
//       });
//       toast.success("Note added successfully!");
//       setFormData(initialForm);
//       const modalElement = document.getElementById("note-units");
//       const modal = window.bootstrap.Modal.getInstance(modalElement); // Bootstrap 5
//       if (modal) {
//         modal.hide();
//       }
//       handelRefresh();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Something went wrong");
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   // Edit Note
//   const editNote = async (e, noteId) => {
//   e.preventDefault();
//   setSubmitLoading(true);
//   try {
//     const res = await axios.put(`${apiUrl}/master/edit-note/${noteId}`, formData, {
//       headers: {
//         Authorization: `Bearer ${Token}`,
//       },
//     });
//     toast.success("Note updated successfully!");
//     setFormData(initialForm);
//     const modalElement = document.getElementById("note-units");
//     const modal = window.bootstrap.Modal.getInstance(modalElement); // Bootstrap 5
//     if (modal) {
//       modal.hide();
//     }
//     handelRefresh();
//   } catch (error) {
//     toast.error(error.response?.data?.message || "Something went wrong");
//   } finally {
//     setSubmitLoading(false);
//   }
// };


  return (
    <div>
      
    </div>
    // <div>
    //   {/* Add Note */}
    //   <div className="modal custom-modal fade" id="note-units" role="dialog">
    //     <div className="modal-dialog modal-dialog-centered">
    //       <div className="modal-content">
    //         {/* <div className="page-wrapper-new p-0">
    //           <div className="content"> */}
    //             <div className="modal-header">
    //               <h5 className="modal-title">Add Notes</h5>
    //               <div className="d-flex align-items-center mod-toggle">
    //                 <button
    //                   className="btn-close"
    //                   data-bs-dismiss="modal"
    //                   aria-label="Close"
    //                 >
    //                   <i className="ti ti-x" />
    //                 </button>
    //               </div>
    //             </div>
    //             <div className="modal-body custom-modal-body">
    //               <form onSubmit={addNote}>
    //                 <div className="row">
    //                   <div className="col-12">
    //                     <div className="mb-3">
    //                       <label className="form-label">Notes Title</label>
    //                       <input
    //                         type="text"
    //                         className="form-control"
    //                         name="title"
    //                         value={formData.title}
    //                         onChange={handleInputChange}
    //                       />
    //                     </div>
    //                   </div>
    //                   <div className="col-12">
    //                     <div className="mb-3">
    //                       <label className="form-label">Assignee</label>
    //                       {/* <Select
    //                         className="select"
    //                         options={optionsChoose}
    //                         placeholder="Choose"
    //                         classNamePrefix="react-select"
    //                       /> */}
    //                       <input
    //                         type="text"
    //                         className="form-control"
    //                         name="assignedTo"
    //                         value={formData.assignedTo}
    //                         onChange={handleInputChange}
    //                       />
    //                     </div>
    //                   </div>
    //                   <div className="col-6">
    //                     <div className="mb-3">
    //                       <label className="form-label">Tags</label>
    //                       <Select
    //                         className="select"
    //                         options={categoryOptions}
    //                         placeholder="Select"
    //                         classNamePrefix="react-select"
    //                         value={
    //                           categoryOptions.find(
    //                             (option) => option.value === formData.tags
    //                           ) || null
    //                         }
    //                         onChange={(selectedOption) =>
    //                           setFormData((prev) => ({
    //                             ...prev,
    //                             tags: selectedOption.value,
    //                           }))
    //                         }
    //                       />
    //                     </div>
    //                   </div>
    //                   <div className="col-6">
    //                     <div className="mb-3">
    //                       <label className="form-label">Priority</label>
    //                       <Select
    //                         className="select"
    //                         options={priorityOptions}
    //                         placeholder="Select"
    //                         classNamePrefix="react-select"
    //                         value={
    //                           priorityOptions.find(
    //                             (option) => option.value === formData.priority
    //                           ) || null
    //                         }
    //                         onChange={(selectedOption) =>
    //                           setFormData((prev) => ({
    //                             ...prev,
    //                             priority: selectedOption.value,
    //                           }))
    //                         }
    //                       />
    //                     </div>
    //                   </div>
    //                   {/* <div className="col-6">
    //                     <div className="input-blocks todo-calendar">
    //                       <label className="form-label">Due Date</label>
    //                       <div className="input-groupicon calender-input">
    //                         <input
    //                           type="text"
    //                           className="form-control  date-range bookingrange"
    //                           placeholder="Select"
    //                           defaultValue="13 Aug 1992"
    //                         />
    //                       </div>
    //                     </div>
    //                   </div> */}
    //                   <div className="col-6">
    //                     <div className="form-wrap">
    //                       <label className="form-label">Due Date</label>
    //                       <div className="form-wrap icon-form">
    //                         {/* <span className="form-icon" style={{color:"unset"}}>
    //                           <i
    //                         data-feather="calendar"
    //                         className="feather-calendar"
                            
    //                       />
    //                         </span> */}
    //                         <DatePicker
    //                           selected={
    //                             formData.date ? new Date(formData.date) : null
    //                           }
    //                           onChange={(date) =>
    //                             setFormData((prev) => ({
    //                               ...prev,
    //                               date: format(date, "dd MMM yyyy"), // e.g. "25 Jul 2023"
    //                             }))
    //                           }
    //                           className="form-control"
    //                           dateFormat="dd/MM/yyyy"
    //                           placeholderText="Select date"
    //                           minDate={new Date()}
    //                           showPopperArrow={false}
    //                         />
    //                       </div>
    //                     </div>
    //                   </div>
    //                   <div className="col-6">
    //                     <div className="mb-3">
    //                       <label className="form-label">Status</label>
    //                       <Select
    //                         className="select"
    //                         options={statusOptions}
    //                         placeholder="Select"
    //                         classNamePrefix="react-select"
    //                         value={
    //                           statusOptions.find(
    //                             (option) => option.value === formData.status
    //                           ) || null
    //                         }
    //                         onChange={(selectedOption) =>
    //                           setFormData((prev) => ({
    //                             ...prev,
    //                             status: selectedOption.value,
    //                           }))
    //                         }
    //                       />
    //                     </div>
    //                   </div>
    //                   <div className="col-lg-12">
    //                     <div className="mb-3 summer-description-box notes-summernote">
    //                       <label className="form-label">Descriptions</label>
    //                       <textarea
    //                         id="description"
    //                         className="form-control"
    //                         maxLength="200"
    //                         rows="4"
    //                         placeholder="Enter description (max 60 characters)"
    //                         name="description"
    //                         value={formData.description}
    //                         onChange={handleInputChange}
    //                       ></textarea>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 <div className="modal-footer-btn">
    //                   <button
    //                     type="button"
    //                     className="btn btn-cancel me-2"
    //                     data-bs-dismiss="modal"
    //                   >
    //                     Cancel
    //                   </button>
    //                   <button
    //                     type="submit"
    //                     className="btn btn-submit"
    //                     disabled={submitLoading}
    //                   >
    //                     {submitLoading ? "Submitting..." : "Submit"}
    //                   </button>
    //                 </div>
    //               </form>
    //             </div>
    //           {/* </div>
    //         </div> */}
    //       </div>
    //     </div>
    //   </div>
    //   {/* /Add Note */}
    //   {/* Edit Note */}
    //     <div className="modal custom-modal fade" id="edit-note-units" role="dialog">
    //     <div className="modal-dialog modal-dialog-centered">
    //       <div className="modal-content">
    //         {/* <div className="page-wrapper-new p-0">
    //           <div className="content"> */}
    //             <div className="modal-header">
    //               <h5 className="modal-title">Edit Notes</h5>
    //               <div className="d-flex align-items-center mod-toggle">
    //                 <button
    //                   className="btn-close"
    //                   data-bs-dismiss="modal"
    //                   aria-label="Close"
    //                 >
    //                   <i className="ti ti-x" />
    //                 </button>
    //               </div>
    //             </div>
    //             <div className="modal-body custom-modal-body">
    //               <form onSubmit={editNote}>
    //                 <div className="row">
    //                   <div className="col-12">
    //                     <div className="mb-3">
    //                       <label className="form-label">Notes Title</label>
    //                       <input
    //                         type="text"
    //                         className="form-control"
    //                         name="title"
    //                         value={formData.title}
    //                         onChange={handleInputChange}
    //                       />
    //                     </div>
    //                   </div>
    //                   <div className="col-12">
    //                     <div className="mb-3">
    //                       <label className="form-label">Assignee</label>
    //                       {/* <Select
    //                         className="select"
    //                         options={optionsChoose}
    //                         placeholder="Choose"
    //                         classNamePrefix="react-select"
    //                       /> */}
    //                       <input
    //                         type="text"
    //                         className="form-control"
    //                         name="assignedTo"
    //                         value={formData.assignedTo}
    //                         onChange={handleInputChange}
    //                       />
    //                     </div>
    //                   </div>
    //                   <div className="col-6">
    //                     <div className="mb-3">
    //                       <label className="form-label">Tags</label>
    //                       <Select
    //                         className="select"
    //                         options={categoryOptions}
    //                         placeholder="Select"
    //                         classNamePrefix="react-select"
    //                         value={
    //                           categoryOptions.find(
    //                             (option) => option.value === formData.tags
    //                           ) || null
    //                         }
    //                         onChange={(selectedOption) =>
    //                           setFormData((prev) => ({
    //                             ...prev,
    //                             tags: selectedOption.value,
    //                           }))
    //                         }
    //                       />
    //                     </div>
    //                   </div>
    //                   <div className="col-6">
    //                     <div className="mb-3">
    //                       <label className="form-label">Priority</label>
    //                       <Select
    //                         className="select"
    //                         options={priorityOptions}
    //                         placeholder="Select"
    //                         classNamePrefix="react-select"
    //                         value={
    //                           priorityOptions.find(
    //                             (option) => option.value === formData.priority
    //                           ) || null
    //                         }
    //                         onChange={(selectedOption) =>
    //                           setFormData((prev) => ({
    //                             ...prev,
    //                             priority: selectedOption.value,
    //                           }))
    //                         }
    //                       />
    //                     </div>
    //                   </div>
    //                   {/* <div className="col-6">
    //                     <div className="input-blocks todo-calendar">
    //                       <label className="form-label">Due Date</label>
    //                       <div className="input-groupicon calender-input">
    //                         <input
    //                           type="text"
    //                           className="form-control  date-range bookingrange"
    //                           placeholder="Select"
    //                           defaultValue="13 Aug 1992"
    //                         />
    //                       </div>
    //                     </div>
    //                   </div> */}
    //                   <div className="col-6">
    //                     <div className="form-wrap">
    //                       <label className="form-label">Due Date</label>
    //                       <div className="form-wrap icon-form">
    //                         {/* <span className="form-icon" style={{color:"unset"}}>
    //                           <i
    //                         data-feather="calendar"
    //                         className="feather-calendar"
                            
    //                       />
    //                         </span> */}
    //                         <DatePicker
    //                           selected={
    //                             formData.date ? new Date(formData.date) : null
    //                           }
    //                           onChange={(date) =>
    //                             setFormData((prev) => ({
    //                               ...prev,
    //                               date: format(date, "dd MMM yyyy"), // e.g. "25 Jul 2023"
    //                             }))
    //                           }
    //                           className="form-control"
    //                           dateFormat="dd/MM/yyyy"
    //                           placeholderText="Select date"
    //                           minDate={new Date()}
    //                           showPopperArrow={false}
    //                         />
    //                       </div>
    //                     </div>
    //                   </div>
    //                   <div className="col-6">
    //                     <div className="mb-3">
    //                       <label className="form-label">Status</label>
    //                       <Select
    //                         className="select"
    //                         options={statusOptions}
    //                         placeholder="Select"
    //                         classNamePrefix="react-select"
    //                         value={
    //                           statusOptions.find(
    //                             (option) => option.value === formData.status
    //                           ) || null
    //                         }
    //                         onChange={(selectedOption) =>
    //                           setFormData((prev) => ({
    //                             ...prev,
    //                             status: selectedOption.value,
    //                           }))
    //                         }
    //                       />
    //                     </div>
    //                   </div>
    //                   <div className="col-lg-12">
    //                     <div className="mb-3 summer-description-box notes-summernote">
    //                       <label className="form-label">Descriptions</label>
    //                       <textarea
    //                         id="description"
    //                         className="form-control"
    //                         maxLength="200"
    //                         rows="4"
    //                         placeholder="Enter description (max 60 characters)"
    //                         name="description"
    //                         value={formData.description}
    //                         onChange={handleInputChange}
    //                       ></textarea>
    //                     </div>
    //                   </div>
    //                 </div>
    //                 <div className="modal-footer-btn">
    //                   <button
    //                     type="button"
    //                     className="btn btn-cancel me-2"
    //                     data-bs-dismiss="modal"
    //                   >
    //                     Cancel
    //                   </button>
    //                   <button
    //                     type="submit"
    //                     className="btn btn-submit"
    //                     disabled={submitLoading}
    //                   >
    //                     {submitLoading ? "Submitting..." : "Submit"}
    //                   </button>
    //                 </div>
    //               </form>
    //             </div>
    //           {/* </div>
    //         </div> */}
    //       </div>
    //     </div>
    //   </div>
    //   {/* /Edit Note */}

    // </div>
  );
};

export default NotesModal;
