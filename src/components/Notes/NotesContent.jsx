import React, { useEffect, useRef, useState } from "react";
import { Filter } from "react-feather";
import { Link, useSearchParams } from "react-router-dom";
import Select from "react-select";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import { PlusCircle, Sliders } from "react-feather";
import { toast } from "react-toastify";
import axios from "axios";
import { use } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";

const NotesContent = ({ refresh, onRefresh }) => {
  const [notesData, setNotesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchApi, setSearchApi] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [trashData, setTrashData] = useState([]);
  const [importantData, setImportantData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [noteById, setNoteById] = useState(null);

  const totalPage = totalPages;

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const staffId = JSON.parse(localStorage.getItem("staffId"));

  const handelSearchInputApi = (e) => {
    setSearchApi(e.target.value);
  };

  const optionsBulk = [
    { value: "bulkActions", label: "Bulk Actions" },
    { value: "deleteMarked", label: "Delete Marked" },
    { value: "unmarkAll", label: "Unmark All" },
    { value: "markAll", label: "Mark All" },
  ];

  // const optionsRecent = [
  //   { value: "recent", label: "Recent" },
  //   { value: "lastModified", label: "Last Modified" },
  //   { value: "lastModifiedByMe", label: "Last Modified by me" },
  // ];

  const options = [
    { value: "sortByDate", label: "Sort by Date" },
    { value: "Ascending", label: "Ascending" },
    { value: "Descending", label: "Descending" },
    { value: "Recently Viewed", label: "Recently Viewed" },
    { value: "Recently Added", label: "Recently Added" },
    { value: "Creation Date", label: "Creation Date" },
  ];

  // const optionsChoose = [
  //   { value: "Choose", label: "Choose" },
  //   { value: "Recent1", label: "Recent1" },
  //   { value: "Recent2", label: "Recent2" },
  // ];

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
  // const optionsSelect = [
  //   { value: "Open", label: "Open" },
  //   { value: "Hold", label: "Hold" },
  //   { value: "Close", label: "Close" },
  // ];

  // const optionsOnHold = [{ value: "Onhold", label: "Onhold" }];

  // const optionsPriority = [
  //   { value: "High", label: "High" },
  //   { value: "Medium", label: "Medium" },
  //   { value: "Low", label: "Low" },
  // ];

  const settings = {
    dots: false,
    autoplay: false,
    slidesToShow: 3,
    margin: 24,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const priority = searchParams.get("priority");
  const tags = searchParams.get("tags");

  // Get Nots Api
  const getNotes = async () => {
    try {
      let url = `${apiUrl}/master/note-list?saveTrash=`;
      if (priority) url += `&priority=${priority}`;
      if (tags) url += `&tags=${tags}`;
      if (!search) url += `&search=${searchApi}`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      setNotesData(res.data.data);
      setTotalPages(res.data.totalPages);
      console.log("Data", res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    getNotes();
  }, [refresh, search, priority, tags]);

  // send Notes in trash Api
  const sendTrash = async (id) => {
    try {
      const res = await axios.put(
        `${apiUrl}/master/save-trash/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      toast.success(res.data.message);
      onRefresh();
      getNotes();
      getImportant();
      getTrash();

      // ✅ Close modal (very important)
      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("delete-note-units")
      );
      if (modal) modal.hide();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Get trash
  const getTrash = async () => {
    try {
      const res = await axios.get(`${apiUrl}/master/note-list?saveTrash=true`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      setTrashData(res.data.data);
      refresh;
      console.log("trashData", res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    getTrash();
  }, []);

  // delete permanent
  const deletePermanent = async (id) => {
    try {
      const res = await axios.delete(`${apiUrl}/master/delete-note/${id}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      toast.success(res.data.message);
      getTrash();
      getNotes();
      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("delete-note-permanent")
      );
      if (modal) modal.hide();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Add important
  const addImportant = async (id) => {
    try {
      const res = await axios.put(
        `${apiUrl}/master/mark-important/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      toast.success(res.data.message);
      getNotes();
      getImportant();
      getTrash();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // get important
  const getImportant = async () => {
    try {

      let URL = `${apiUrl}/master/note-list?isImportant=true`
      if (priority) URL += `&priority=${priority}`;
      if (tags) URL += `&tags=${tags}`;
      if (search) URL += `&search=${searchApi}`;


      const res = await axios.get(
        URL,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      // const res = await axios.get(
      //   `${apiUrl}/master/note-list?isImportant=true`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${Token}`,
      //     },
      //   }
      // );

      // Remove trashed notes from important list
      const filtered = res.data.data.filter((note) => !note.saveTrash);
      setImportantData(filtered);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    getImportant();
  }, []);
  console.log("importantData", importantData);

  // note Add
  const initialForm = {
    title: "",
    assignedTo: "",
    tags: "",
    priority: "",
    status: "",
    date: "",
    description: "",
    staffId: JSON.parse(localStorage.getItem("staffId")),
  };
  const [formData, setFormData] = useState(initialForm);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const addNote = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/master/add-note`, formData, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      toast.success("Note added successfully!");
      setFormData(initialForm);
      const modalElement = document.getElementById("note-units");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      getNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Note Get By id
  const getNoteById = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}/master/note-list-Byid/${id}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      setNoteById(res.data.data);
      console.log("idNote", res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };
  console.log("notbyid", noteById);

  useEffect(() => {
    if (selectedNoteId) {
      getNoteById(selectedNoteId);
    }
  }, [selectedNoteId]);

  useEffect(() => {
    if (noteById) {
      setFormData({
        title: noteById.title || "",
        assignedTo: noteById.assignedTo || "",
        tags: noteById.tags || "",
        priority: noteById.priority || "",
        status: noteById.status || "",
        date: noteById.date || "",
        description: noteById.description || "",
        staffId: noteById.staffId || staffId,
      });
    }
  }, [noteById]);

  // Edit Note
  const editNote = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    if (!selectedNoteId) return toast.error("Invalid note ID");
    setSubmitLoading(true);
    try {
      const res = await axios.put(
        `${apiUrl}/master/edit-note/${selectedNoteId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      toast.success("Note updated successfully!");
      setFormData(initialForm);
      const modalElement = document.getElementById("edit-note-units");
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
      getNotes();
      getImportant();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <div className="section-bulk-wrap">
        <div className="bulk-action-type">
          <div className="form-sort select-bluk ">
            <Select
              className="select"
              options={optionsBulk}
              defaultValue={optionsBulk[0]}
              classNamePrefix="react-select"
            />
          </div>
          <Link to="#" className="btn btn-added">
            Apply
          </Link>
          <div className="search-set">
            <div className="search-input">
              <Link
                to={`/application/notes?search=${searchApi}`}
                className="btn btn-searchset"
              >
                <i data-feather="search" className="feather-search" />
              </Link>
              <div id="DataTables_Table_0_filter" className="dataTables_filter">
                <label>
                  {" "}
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search"
                    onChange={handelSearchInputApi}
                    value={searchApi}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="form-sort">
          <Filter className="feather-filter" />

          <Select
            className="select"
            options={optionsRecent}
            defaultValue={optionsRecent[0]}
            classNamePrefix="react-select"
          />
        </div> */}
        <div
          className="form-sort select"
          // style={{position:"relative" ,width:"142px",height:"40px"}}
        >
          <Sliders className="info-img" />
          <Select
            className="select"
            options={options}
            placeholder="Sort"
            classNamePrefix="react-select"
          />
        </div>
      </div>
      <div className="tab-content" id="v-pills-tabContent">
        <div
          className="tab-pane fade active show"
          id="v-pills-profile"
          role="tabpanel"
          aria-labelledby="v-pills-profile-tab"
        >
          {/* <div className="section-notes-slider">
            <div className="row">
              <div className="notes-content">
                <div className="notes-header">
                  <h3>Important Notes </h3>
                </div>
                <div className="notes-close">
                  <Link to="#">
                    <i className="fas fa-times" /> Close{" "}
                  </Link>
                </div>
              </div>
              <div className="col-md-12" id="notes-important">
                <Slider {...settings} className="notes-slider owl-carousel ">
                  <div className="notes-card">
                    <div className="notes-card-body">
                      <p className="badged">
                        <i className="fas fa-circle" /> Low
                      </p>
                      <Link
                        to="#"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-v" />
                      </Link>
                      <div className="dropdown-menu notes-menu dropdown-menu-end">
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#edit-note-units"
                        >
                          <span>
                            <i data-feather="edit" />
                          </span>
                          Edit
                        </Link>
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#delete-note-units"
                        >
                          <span>
                            <i data-feather="trash-2" />
                          </span>
                          Delete
                        </Link>
                        <Link to="#" className="dropdown-item">
                          <span>
                            <i data-feather="star" />
                          </span>
                          Not Important
                        </Link>
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#view-note-units"
                        >
                          <span>
                            <i data-feather="eye" />
                          </span>
                          View
                        </Link>
                      </div>
                    </div>
                    <div className="notes-slider-content">
                      <h4>
                        <Link to="#">Plan a trip to another country</Link>
                      </h4>
                      <p>
                        Space, the final frontier. These are the voyages of the
                        Starship Enterprise.
                      </p>
                    </div>
                    <div className="notes-slider-widget">
                      <div className="notes-logo">
                        <Link to="#">
                          <span>
                            <ImageWithBasePath
                              src="./assets/img/profiles/avatar-01.jpg"
                              alt="Profile"
                              className="img-fluid"
                            />
                          </span>
                        </Link>
                        <div className="d-flex">
                          <span className="low-square">
                            <i className="fas fa-square" />
                          </span>
                          <p> Personal</p>
                        </div>
                      </div>
                      <div className="notes-star-delete">
                        <Link to="#">
                          <span>
                            <i className="fas fa-star" />
                          </span>
                        </Link>
                        <Link to="#">
                          <span>
                            <i data-feather="trash-2" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="notes-card medium">
                    <div className="notes-card-body">
                      <p className="badged medium">
                        <i className="fas fa-circle" /> Medium
                      </p>
                      <Link
                        to="#"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-v" />
                      </Link>
                      <div className="dropdown-menu notes-menu dropdown-menu-end">
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#edit-note-units"
                        >
                          <span>
                            <i data-feather="edit" />
                          </span>
                          Edit
                        </Link>
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#delete-note-units"
                        >
                          <span>
                            <i data-feather="trash-2" />
                          </span>
                          Delete
                        </Link>
                        <Link to="#" className="dropdown-item">
                          <span>
                            <i data-feather="star" />
                          </span>
                          Not Important
                        </Link>
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#view-note-units"
                        >
                          <span>
                            <i data-feather="eye" />
                          </span>
                          View
                        </Link>
                      </div>
                    </div>
                    <div className="notes-slider-content">
                      <h4>
                        <Link to="#">Improve touch typing</Link>
                      </h4>
                      <p>
                        Well, the way they make shows is, they make one show.
                      </p>
                    </div>
                    <div className="notes-slider-widget">
                      <div className="notes-logo">
                        <Link to="#">
                          <span>
                            <ImageWithBasePath
                              src="./assets/img/profiles/avatar-02.jpg"
                              alt="Profile"
                              className="img-fluid"
                            />
                          </span>
                        </Link>
                        <div className="d-flex">
                          <span className="medium-square">
                            <i className="fas fa-square" />
                          </span>
                          <p className="medium"> Work</p>
                        </div>
                      </div>
                      <div className="notes-star-delete">
                        <Link to="#">
                          <span>
                            <i className="fas fa-star" />
                          </span>
                        </Link>
                        <Link to="#">
                          <span>
                            <i data-feather="trash-2" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="notes-card high">
                    <div className="notes-card-body">
                      <p className="badged high">
                        <i className="fas fa-circle" /> High
                      </p>
                      <Link
                        to="#"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-v" />
                      </Link>
                      <div className="dropdown-menu notes-menu dropdown-menu-end">
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#edit-note-units"
                        >
                          <span>
                            <i data-feather="edit" />
                          </span>
                          Edit
                        </Link>
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#delete-note-units"
                        >
                          <span>
                            <i data-feather="trash-2" />
                          </span>
                          Delete
                        </Link>
                        <Link to="#" className="dropdown-item">
                          <span>
                            <i data-feather="star" />
                          </span>
                          Not Important
                        </Link>
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#view-note-units"
                        >
                          <span>
                            <i data-feather="eye" />
                          </span>
                          View
                        </Link>
                      </div>
                    </div>
                    <div className="notes-slider-content">
                      <h4>
                        <Link to="#">Learn calligraphy</Link>
                      </h4>
                      <p>
                        Calligraphy, the art of beautiful handwriting. The term
                        may derive from the Greek words.{" "}
                      </p>
                    </div>
                    <div className="notes-slider-widget">
                      <div className="notes-logo">
                        <Link to="#">
                          <span>
                            <ImageWithBasePath
                              src="./assets/img/profiles/avatar-03.jpg"
                              alt="Profile"
                              className="img-fluid"
                            />
                          </span>
                        </Link>
                        <div className="d-flex">
                          <span className="high-square">
                            <i className="fas fa-square" />
                          </span>
                          <p className="high"> Social</p>
                        </div>
                      </div>
                      <div className="notes-star-delete">
                        <Link to="#">
                          <span>
                            <i className="fas fa-star" />
                          </span>
                        </Link>
                        <Link to="#">
                          <span>
                            <i data-feather="trash-2" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="notes-card medium">
                    <div className="notes-card-body">
                      <p className="badged medium">
                        <i className="fas fa-circle" /> Medium
                      </p>
                      <Link
                        to="#"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-v" />
                      </Link>
                      <div className="dropdown-menu notes-menu dropdown-menu-end">
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#edit-note-units"
                        >
                          <span>
                            <i data-feather="edit" />
                          </span>
                          Edit
                        </Link>
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#delete-note-units"
                        >
                          <span>
                            <i data-feather="trash-2" />
                          </span>
                          Delete
                        </Link>
                        <Link to="#" className="dropdown-item">
                          <span>
                            <i data-feather="star" />
                          </span>
                          Not Important
                        </Link>
                        <Link
                          to="#"
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#view-note-units"
                        >
                          <span>
                            <i data-feather="eye" />
                          </span>
                          View
                        </Link>
                      </div>
                    </div>
                    <div className="notes-slider-content">
                      <h4>
                        <Link to="#">Improve touch typing</Link>
                      </h4>
                      <p>
                        Well, the way they make shows is, they make one show.
                      </p>
                    </div>
                    <div className="notes-slider-widget">
                      <div className="notes-logo">
                        <Link to="#">
                          <span>
                            <ImageWithBasePath
                              src="./assets/img/profiles/avatar-03.jpg"
                              alt="Profile"
                              className="img-fluid"
                            />
                          </span>
                        </Link>
                        <div className="d-flex">
                          <span className="medium-square">
                            <i className="fas fa-square" />
                          </span>
                          <p className="medium"> Work</p>
                        </div>
                      </div>
                      <div className="notes-star-delete">
                        <Link to="#">
                          <span>
                            <i className="fas fa-star" />
                          </span>
                        </Link>
                        <Link to="#">
                          <span>
                            <i data-feather="trash-2" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Slider>
              </div>
            </div>
          </div> */}
          {/* {nots data} */}
          <div className="section-card-body" id="notes-trash">
            {notesData.length > 0 ? (
              <div className="row">
                {notesData.map((item, index) => (
                  <div className="col-md-4 d-flex" key={index}>
                    <div className="notes-card notes-card-details w-100">
                      <div className="notes-card-body">
                        {item.priority && (
                          <p
                            className={
                              item.priority === "High"
                                ? "badged high"
                                : item.priority === "Medium"
                                ? "badged medium"
                                : "badged low"
                            }
                          >
                            <i className="fas fa-circle" /> {item.priority}
                          </p>
                        )}
                        <Link
                          to="#"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fas fa-ellipsis-v" />
                        </Link>
                        <div className="dropdown-menu notes-menu dropdown-menu-end">
                          <Link
                            to="#"
                            className="dropdown-item"
                            data-bs-toggle="modal"
                            data-bs-target="#edit-note-units"
                            onClick={() => setSelectedNoteId(item.id)}
                          >
                            <span>
                              <i data-feather="edit" />
                            </span>
                            Edit
                          </Link>
                          <Link
                            to="#"
                            className="dropdown-item"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-note-units"
                            onClick={() => setSelectedNoteId(item.id)}
                          >
                            <span>
                              <i data-feather="trash-2" />
                            </span>
                            Send in Trash
                          </Link>
                          {/* <Link to="#" className="dropdown-item">
                            <span>
                              <i data-feather="star" />
                            </span>
                            Not Important
                          </Link> */}
                          <Link
                            to="#"
                            className="dropdown-item"
                            data-bs-toggle="modal"
                            data-bs-target="#view-note-units"
                            onClick={() => setSelectedNoteId(item.id)}
                          >
                            <span>
                              <i data-feather="eye" />
                            </span>
                            View
                          </Link>
                        </div>
                      </div>
                      <div className="notes-wrap-content">
                        <h4>
                          <Link to="#">{item.title}</Link>
                        </h4>
                        <p className="wrap-cal">
                          <i
                            data-feather="calendar"
                            className="feather-calendar"
                          />{" "}
                          {item.date}
                        </p>
                        <p>{item.description}</p>
                      </div>
                      <div className="notes-slider-widget notes-widget-profile">
                        {/* <div className="notes-logo">
                          <Link to="#">
                            <span>
                              <ImageWithBasePath
                                src="./assets/img/users/user-26.jpg"
                                alt="Profile"
                                className="img-fluid"
                              />
                            </span>
                          </Link>
                          <div className="d-flex">
                            <span className="medium-square">
                              <i className="fas fa-square" />
                            </span>
                            <p className="medium"> Work</p>
                            
                          </div>
                        </div> */}
                        {/* <div className="notes-slider-widget"> */}
                        <div className="notes-logo">
                          <Link to="#">
                            <span>
                              <ImageWithBasePath
                                src="./assets/img/profiles/avatar-02.jpg"
                                alt="Profile"
                                className="img-fluid"
                              />
                            </span>
                          </Link>
                          <div className="d-flex nots-tag">
                            <p
                              className={
                                item.tags === "Pending"
                                  ? "personal"
                                  : item.tags === "Onhold"
                                  ? "social"
                                  : item.tags === "Inprogress"
                                  ? "public"
                                  : item.tags === "Done"
                                  ? "work"
                                  : ""
                              }
                            >
                              {" "}
                              {item.tags}
                            </p>
                          </div>
                        </div>
                        <div className="notes-star-delete ms-2">
                          <Link to="#" onClick={() => addImportant(item.id)}>
                            <span>
                              <i className="fas fa-star" />
                            </span>
                          </Link>
                        </div>
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No Nots</p>
            )}
          </div>
          {/* {nots data} */}
        </div>
        {/* View Note */}
        {/* {notesData.map((item, index) => ( */}
        <div className="modal custom-modal fade" id="view-note-units">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              {/* <div className="page-wrapper-new p-0">
                  <div className="content"> */}
              <div className="modal-header">
                <div className="modal-title">
                  <h4>Notes</h4>
                  <p>{noteById?.tags}</p>
                </div>
                <div className=" mod-toggle d-flex align-items-center">
                  {/* <Link to="#">
                          <span>
                            <i data-feather="trash-2" />
                          </span>
                        </Link>
                        <Link to="#" className="me-2">
                          <span>
                            <i data-feather="star" />
                          </span>
                        </Link> */}
                  <button
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <i className="ti ti-x" />
                  </button>
                </div>
              </div>
              <div className="modal-body custom-modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="edit-head-view">
                      <h6>{noteById?.title}</h6>
                      <p>{noteById?.description}</p>
                      {/* <p className="badged high">
                              <i className="fas fa-circle" /> {noteById?.priority}
                            </p> */}
                      <p
                        className={
                          noteById?.priority === "High"
                            ? "badged high"
                            : noteById?.priority === "Medium"
                            ? "badged medium"
                            : "badged low"
                        }
                      >
                        <i className="fas fa-circle" /> {noteById?.priority}
                      </p>
                    </div>
                    <div className="modal-footer-btn edit-footer-menu">
                      <Link
                        to="#"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Close
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* </div>
                </div> */}
            </div>
          </div>
        </div>
        {/* ))} */}
        {/* /View Note */}
        {/* important */}
        <div
          className="tab-pane fade"
          id="v-pills-messages"
          role="tabpanel"
          aria-labelledby="v-pills-messages-tab"
        >
          <div className="section-card-body pt-0" id="notes-trash2">
            {importantData.length > 0 ? (
              <div className="row">
                {importantData.map((item, index) => (
                  <div className="col-md-4 d-flex" key={index}>
                    <div className="notes-card notes-card-details w-100">
                      <div className="notes-card-body">
                        {item.priority && (
                          <p
                            className={
                              item.priority === "High"
                                ? "badged high"
                                : item.priority === "Medium"
                                ? "badged medium"
                                : "badged low"
                            }
                          >
                            <i className="fas fa-circle" /> {item.priority}
                          </p>
                        )}
                        <Link
                          to="#"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fas fa-ellipsis-v" />
                        </Link>
                        <div className="dropdown-menu notes-menu dropdown-menu-end">
                          <Link
                            to="#"
                            className="dropdown-item"
                            data-bs-toggle="modal"
                            data-bs-target="#edit-note-units"
                            onClick={() => setSelectedNoteId(item.id)}
                          >
                            <span>
                              <i data-feather="edit" />
                            </span>
                            Edit
                          </Link>
                          <Link
                            to="#"
                            className="dropdown-item"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-note-units"
                            onClick={() => setSelectedNoteId(item.id)}
                          >
                            <span>
                              <i data-feather="trash-2" />
                            </span>
                            Send in trash
                          </Link>
                          {/* <Link to="#" className="dropdown-item">
                        <span>
                          <i data-feather="star" />
                        </span>
                        Not Important
                      </Link> */}
                          <Link
                            to="#"
                            className="dropdown-item"
                            data-bs-toggle="modal"
                            data-bs-target="#view-note-units"
                          >
                            <span>
                              <i data-feather="eye" />
                            </span>
                            View
                          </Link>
                        </div>
                      </div>
                      <div className="notes-wrap-content">
                        <h4>
                          <Link to="#">{item.title}</Link>
                        </h4>
                        <p className="wrap-cal">
                          <i
                            data-feather="calendar"
                            className="feather-calendar"
                          />{" "}
                          {item.date}
                        </p>
                        <p>{item.description}</p>
                      </div>
                      <div className="notes-slider-widget notes-widget-profile">
                        <div className="notes-logo">
                          <Link to="#">
                            <span>
                              <ImageWithBasePath
                                src="./assets/img/users/user-26.jpg"
                                alt="Profile"
                                className="img-fluid"
                              />
                            </span>
                          </Link>
                          <div className="d-flex nots-tag">
                            <p
                              className={
                                item.tags === "Pending"
                                  ? "personal"
                                  : item.tags === "Onhold"
                                  ? "social"
                                  : item.tags === "Inprogress"
                                  ? "public"
                                  : item.tags === "Done"
                                  ? "work"
                                  : ""
                              }
                            >
                              {" "}
                              {item.tags}
                            </p>
                          </div>
                        </div>
                        {/* <div className="notes-star-delete">
                      <Link to="#">
                        <span>
                          <i data-feather="star" />
                        </span>
                      </Link>
                      <Link to="#">
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                      </Link>
                    </div> */}
                      </div>
                    </div>
                  </div>
                ))}
                {/* <div className="col-md-4 d-flex">
                <div className="notes-card notes-card-details w-100">
                  <div className="notes-card-body">
                    <p className="badged high">
                      <i className="fas fa-circle" /> High
                    </p>
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu notes-menu dropdown-menu-end">
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-note-units"
                      >
                        <span>
                          <i data-feather="edit" />
                        </span>
                        Edit
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-note-units"
                      >
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                        Delete
                      </Link>
                      <Link to="#" className="dropdown-item">
                        <span>
                          <i data-feather="star" />
                        </span>
                        Not Important
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#view-note-units"
                      >
                        <span>
                          <i data-feather="eye" />
                        </span>
                        View
                      </Link>
                    </div>
                  </div>
                  <div className="notes-wrap-content">
                    <h4>
                      <Link to="#">Download Server Logs</Link>
                    </h4>
                    <p className="wrap-cal">
                      <i data-feather="calendar" className="feather-calendar" />{" "}
                      27 Jul 2023
                    </p>
                    <p>
                      Server log is a text document that contains a record of
                      all activity.
                    </p>
                  </div>
                  <div className="notes-slider-widget notes-widget-profile">
                    <div className="notes-logo">
                      <Link to="#">
                        <span>
                          <ImageWithBasePath
                            src="./assets/img/users/user-27.jpg"
                            alt="Profile"
                            className="img-fluid"
                          />
                        </span>
                      </Link>
                      <div className="d-flex">
                        <span className="high-square">
                          <i className="fas fa-square" />
                        </span>
                        <p className="high"> Social</p>
                      </div>
                    </div>
                    <div className="notes-star-delete">
                      <Link to="#">
                        <span>
                          <i data-feather="star" />
                        </span>
                      </Link>
                      <Link to="#">
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div> */}
                {/* <div className="col-md-4 d-flex">
                <div className="notes-card notes-card-details w-100">
                  <div className="notes-card-body">
                    <p className="badged low">
                      <i className="fas fa-circle" /> Low
                    </p>
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu notes-menu dropdown-menu-end">
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-note-units"
                      >
                        <span>
                          <i data-feather="edit" />
                        </span>
                        Edit
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-note-units"
                      >
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                        Delete
                      </Link>
                      <Link to="#" className="dropdown-item">
                        <span>
                          <i data-feather="star" />
                        </span>
                        Not Important
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#view-note-units"
                      >
                        <span>
                          <i data-feather="eye" />
                        </span>
                        View
                      </Link>
                    </div>
                  </div>
                  <div className="notes-wrap-content">
                    <h4>
                      <Link to="#">Team meet at Starbucks</Link>
                    </h4>
                    <p className="wrap-cal">
                      <i data-feather="calendar" className="feather-calendar" />{" "}
                      13 Aug 2023
                    </p>
                    <p>
                      Meeting all teamets at Starbucks for identifying them all.
                    </p>
                  </div>
                  <div className="notes-slider-widget notes-widget-profile">
                    <div className="notes-logo">
                      <Link to="#">
                        <span>
                          <ImageWithBasePath
                            src="./assets/img/users/user-28.jpg"
                            alt="Profile"
                            className="img-fluid"
                          />
                        </span>
                      </Link>
                      <div className="d-flex">
                        <span className="low-square">
                          <i className="fas fa-square" />
                        </span>
                        <p className="low"> Personal</p>
                      </div>
                    </div>
                    <div className="notes-star-delete">
                      <Link to="#">
                        <span>
                          <i data-feather="star" />
                        </span>
                      </Link>
                      <Link to="#">
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div> */}
                {/* <div className="col-md-4 d-flex">
                <div className="notes-card notes-card-details w-100">
                  <div className="notes-card-body">
                    <p className="badged high">
                      <i className="fas fa-circle" /> High
                    </p>
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu notes-menu dropdown-menu-end">
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-note-units"
                      >
                        <span>
                          <i data-feather="edit" />
                        </span>
                        Edit
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-note-units"
                      >
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                        Delete
                      </Link>
                      <Link to="#" className="dropdown-item">
                        <span>
                          <i data-feather="star" />
                        </span>
                        Not Important
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#view-note-units"
                      >
                        <span>
                          <i data-feather="eye" />
                        </span>
                        View
                      </Link>
                    </div>
                  </div>
                  <div className="notes-wrap-content">
                    <h4>
                      <Link to="#">Create a compost pile</Link>
                    </h4>
                    <p className="wrap-cal">
                      <i data-feather="calendar" className="feather-calendar" />{" "}
                      23 Aug 2023
                    </p>
                    <p>
                      Compost pile refers to fruit and vegetable scraps, used
                      tea, coffee grounds etc..
                    </p>
                  </div>
                  <div className="notes-slider-widget notes-widget-profile">
                    <div className="notes-logo">
                      <Link to="#">
                        <span>
                          <ImageWithBasePath
                            src="./assets/img/users/user-29.jpg"
                            alt="Profile"
                            className="img-fluid"
                          />
                        </span>
                      </Link>
                      <div className="d-flex">
                        <span className="high-square">
                          <i className="fas fa-square" />
                        </span>
                        <p className="high"> Social</p>
                      </div>
                    </div>
                    <div className="notes-star-delete">
                      <Link to="#">
                        <span>
                          <i data-feather="star" />
                        </span>
                      </Link>
                      <Link to="#">
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div> */}
                {/* <div className="col-md-4 d-flex">
                <div className="notes-card notes-card-details w-100">
                  <div className="notes-card-body">
                    <p className="badged low">
                      <i className="fas fa-circle" /> Low
                    </p>
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu notes-menu dropdown-menu-end">
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-note-units"
                      >
                        <span>
                          <i data-feather="edit" />
                        </span>
                        Edit
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-note-units"
                      >
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                        Delete
                      </Link>
                      <Link to="#" className="dropdown-item">
                        <span>
                          <i data-feather="star" />
                        </span>
                        Not Important
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#view-note-units"
                      >
                        <span>
                          <i data-feather="eye" />
                        </span>
                        View
                      </Link>
                    </div>
                  </div>
                  <div className="notes-wrap-content">
                    <h4>
                      <Link to="#">Take a hike at a local park</Link>
                    </h4>
                    <p className="wrap-cal">
                      <i data-feather="calendar" className="feather-calendar" />{" "}
                      04 Sep 2023
                    </p>
                    <p>
                      Hiking involves a long energetic walk in a natural
                      environment.
                    </p>
                  </div>
                  <div className="notes-slider-widget notes-widget-profile">
                    <div className="notes-logo">
                      <Link to="#">
                        <span>
                          <ImageWithBasePath
                            src="./assets/img/users/user-30.jpg"
                            alt="Profile"
                            className="img-fluid"
                          />
                        </span>
                      </Link>
                      <div className="d-flex">
                        <span className="low-square">
                          <i className="fas fa-square" />
                        </span>
                        <p className="low"> Personal</p>
                      </div>
                    </div>
                    <div className="notes-star-delete">
                      <Link to="#">
                        <span>
                          <i data-feather="star" />
                        </span>
                      </Link>
                      <Link to="#">
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div> */}
                {/* <div className="col-md-4 d-flex">
                <div className="notes-card notes-card-details w-100">
                  <div className="notes-card-body">
                    <p className="badged medium">
                      <i className="fas fa-circle" /> Medium
                    </p>
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu notes-menu dropdown-menu-end">
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-note-units"
                      >
                        <span>
                          <i data-feather="edit" />
                        </span>
                        Edit
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-note-units"
                      >
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                        Delete
                      </Link>
                      <Link to="#" className="dropdown-item">
                        <span>
                          <i data-feather="star" />
                        </span>
                        Not Important
                      </Link>
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#view-note-units"
                      >
                        <span>
                          <i data-feather="eye" />
                        </span>
                        View
                      </Link>
                    </div>
                  </div>
                  <div className="notes-wrap-content">
                    <h4>
                      <Link to="#">Research a topic interested</Link>
                    </h4>
                    <p className="wrap-cal">
                      <i data-feather="calendar" className="feather-calendar" />{" "}
                      17 Sep 2023
                    </p>
                    <p>
                      Research a topic interested by listen actively and
                      attentively.
                    </p>
                  </div>
                  <div className="notes-slider-widget notes-widget-profile">
                    <div className="notes-logo">
                      <Link to="#">
                        <span>
                          <ImageWithBasePath
                            src="./assets/img/users/user-31.jpg"
                            alt="Profile"
                            className="img-fluid"
                          />
                        </span>
                      </Link>
                      <div className="d-flex">
                        <span className="medium-square">
                          <i className="fas fa-square" />
                        </span>
                        <p className="medium"> Work</p>
                      </div>
                    </div>
                    <div className="notes-star-delete">
                      <Link to="#">
                        <span>
                          <i data-feather="star" />
                        </span>
                      </Link>
                      <Link to="#">
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div> */}
              </div>
            ) : (
              <p>No data found</p>
            )}
          </div>
        </div>
        {/* important */}
        {/* Trash Data*/}
        <div
          className="tab-pane fade"
          id="v-pills-settings"
          role="tabpanel"
          aria-labelledby="v-pills-settings-tab"
        >
          <div className="row">
            {/* <div className="col-12 d-flex align-items-center justify-content-end">
              <Link to="#" className="btn btn-cancel notes-trash-btn">
                <span>
                  {" "}
                  <i data-feather="trash-2" className="feather-trash-2" />
                </span>
                Restore all
              </Link>
            </div> */}
          </div>

          <div className="section-card-body pt-0" id="notes-trash3">
            {trashData.length > 0 ? (
              <div className="row">
                {trashData.map((item, index) => (
                  <div className="col-md-4 d-flex" key={index}>
                    <div className="notes-card notes-card-details w-100">
                      <div className="notes-card-body">
                        {item.priority && (
                          <p
                            className={
                              item.priority === "High"
                                ? "badged high"
                                : item.priority === "Medium"
                                ? "badged medium"
                                : "badged low"
                            }
                          >
                            <i className="fas fa-circle" /> {item.priority}
                          </p>
                        )}
                        <Link
                          to="#"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fas fa-ellipsis-v" />
                        </Link>
                        <div className="dropdown-menu notes-menu dropdown-menu-end">
                          <Link
                            to="#"
                            className="dropdown-item"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-note-permanent"
                            onClick={() => setSelectedNoteId(item.id)}
                          >
                            <span>
                              <i data-feather="edit" />
                            </span>
                            Permanent Delete
                          </Link>
                          <Link to="#" className="dropdown-item">
                            <span>
                              <i data-feather="trash-2" />
                            </span>
                            Restore Task
                          </Link>
                        </div>
                      </div>
                      <div className="notes-wrap-content">
                        <h4>
                          <Link to="#">{item.title}</Link>
                        </h4>
                        <p className="wrap-cal">
                          <i
                            data-feather="calendar"
                            className="feather-calendar"
                          />{" "}
                          {item.date}
                        </p>
                        <p>{item.description}</p>
                      </div>
                      <div className="notes-slider-widget notes-widget-profile">
                        <div className="notes-logo">
                          <Link to="#">
                            <span>
                              <ImageWithBasePath
                                src="./assets/img/users/user-31.jpg"
                                alt="Profile"
                                className="img-fluid"
                              />
                            </span>
                          </Link>
                          <div className="d-flex nots-tag">
                            <p
                              className={
                                item.tags === "Pending"
                                  ? "personal"
                                  : item.tags === "Onhold"
                                  ? "social"
                                  : item.tags === "Inprogress"
                                  ? "public"
                                  : item.tags === "Done"
                                  ? "work"
                                  : ""
                              }
                            >
                              {" "}
                              {item.tags}
                            </p>
                          </div>
                        </div>
                        <div className="notes-star-delete">
                          <Link to="#">
                            <span>
                              <i className="fas fa-star" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* <div className="col-md-4 d-flex">
                <div className="notes-card notes-card-details w-100">
                  <div className="notes-card-body">
                    <p className="badged high">
                      <i className="fas fa-circle" /> High
                    </p>
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu notes-menu dropdown-menu-end">
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-note-units"
                      >
                        <span>
                          <i data-feather="edit" />
                        </span>
                        Permanent Delete
                      </Link>
                      <Link to="#" className="dropdown-item">
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                        Restore Task
                      </Link>
                    </div>
                  </div>
                  <div className="notes-wrap-content">
                    <h4>
                      <Link to="#">Download Server Logs</Link>
                    </h4>
                    <p className="wrap-cal">
                      <i data-feather="calendar" className="feather-calendar" />{" "}
                      27 Jul 2023
                    </p>
                    <p>
                      Server log is a text document that contains a record of
                      all activity.
                    </p>
                  </div>
                  <div className="notes-slider-widget notes-widget-profile">
                    <div className="notes-logo">
                      <Link to="#">
                        <span>
                          <ImageWithBasePath
                            src="./assets/img/users/user-29.jpg"
                            alt="Profile"
                            className="img-fluid"
                          />
                        </span>
                      </Link>
                      <div className="d-flex">
                        <span className="high-square">
                          <i className="fas fa-square" />
                        </span>
                        <p className="high"> Social</p>
                      </div>
                    </div>
                    <div className="notes-star-delete">
                      <Link to="#">
                        <span>
                          <i data-feather="star" />
                        </span>
                      </Link>
                      <Link to="#">
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 d-flex">
                <div className="notes-card notes-card-details w-100">
                  <div className="notes-card-body">
                    <p className="badged low">
                      <i className="fas fa-circle" /> Low
                    </p>
                    <Link
                      to="#"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu notes-menu dropdown-menu-end">
                      <Link
                        to="#"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#delete-note-units"
                      >
                        <span>
                          <i data-feather="edit" />
                        </span>
                        Permanent Delete
                      </Link>
                      <Link to="#" className="dropdown-item">
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                        Restore Task
                      </Link>
                    </div>
                  </div>
                  <div className="notes-wrap-content">
                    <h4>
                      <Link to="#">Team meet at Starbucks</Link>
                    </h4>
                    <p className="wrap-cal">
                      <i data-feather="calendar" className="feather-calendar" />{" "}
                      13 Aug 2023
                    </p>
                    <p>
                      Meeting all teamets at Starbucks for identifying them all.
                    </p>
                  </div>
                  <div className="notes-slider-widget notes-widget-profile">
                    <div className="notes-logo">
                      <Link to="#">
                        <span>
                          <ImageWithBasePath
                            src="./assets/img/users/user-30.jpg"
                            alt="Profile"
                            className="img-fluid"
                          />
                        </span>
                      </Link>
                      <div className="d-flex">
                        <span className="low-square">
                          <i className="fas fa-square" />
                        </span>
                        <p className="low"> Personal</p>
                      </div>
                    </div>
                    <div className="notes-star-delete">
                      <Link to="#">
                        <span>
                          <i data-feather="star" />
                        </span>
                      </Link>
                      <Link to="#">
                        <span>
                          <i data-feather="trash-2" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div> */}
              </div>
            ) : (
              <p>No Data</p>
            )}
          </div>
        </div>
        {/* Trash Data */}
      </div>
      {/* Send  Note in Trash modal*/}
      <div className="modal fade" id="delete-note-units">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="delete-popup">
                  {/* <div className="delete-image text-center mx-auto">
                          <ImageWithBasePath
                            src="/assets/img/icons/close-circle.png"
                            alt="Img"
                            className="img-fluid"
                          />
                        </div> */}
                  <div className="delete-heads">
                    <h4>Are You Sure?</h4>
                    <p>
                      Do you really want to send this item in trash, This
                      process cannot be undone.
                    </p>
                  </div>
                  <div className="modal-footer-btn delete-footer mt-3">
                    <Link
                      to="#"
                      className="btn btn-cancel me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      className="btn btn-submit"
                      onClick={() => sendTrash(selectedNoteId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Send  Note in Trash modal*/}
      {/* Permanent Delete Note modal*/}
      <div className="modal fade" id="delete-note-permanent">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="delete-popup">
                  {/* <div className="delete-image text-center mx-auto">
                          <ImageWithBasePath
                            src="/assets/img/icons/close-circle.png"
                            alt="Img"
                            className="img-fluid"
                          />
                        </div> */}
                  <div className="delete-heads">
                    <h4>Are You Sure?</h4>
                    <p>
                      Do you really want to permanently delete this nots, This
                      process cannot be undone.
                    </p>
                  </div>
                  <div className="modal-footer-btn delete-footer mt-3">
                    <Link
                      to="#"
                      className="btn btn-cancel me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      className="btn btn-submit"
                      onClick={() => deletePermanent(selectedNoteId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Permanent Delete Note modal*/}

      {/* Add Note */}
      <div className="modal custom-modal fade" id="note-units" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* <div className="page-wrapper-new p-0">
                    <div className="content"> */}
            <div className="modal-header">
              <h5 className="modal-title">Add Notes</h5>
              <div className="d-flex align-items-center mod-toggle">
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
            </div>
            <div className="modal-body custom-modal-body">
              <form onSubmit={addNote}>
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Notes Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Assignee</label>
                      {/* <Select
                                  className="select"
                                  options={optionsChoose}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                /> */}
                      <input
                        type="text"
                        className="form-control"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Tags</label>
                      <Select
                        className="select"
                        options={categoryOptions}
                        placeholder="Select"
                        classNamePrefix="react-select"
                        value={
                          categoryOptions.find(
                            (option) => option.value === formData.tags
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: selectedOption.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Priority</label>
                      <Select
                        className="select"
                        options={priorityOptions}
                        placeholder="Select"
                        classNamePrefix="react-select"
                        value={
                          priorityOptions.find(
                            (option) => option.value === formData.priority
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) => ({
                            ...prev,
                            priority: selectedOption.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  {/* <div className="col-6">
                              <div className="input-blocks todo-calendar">
                                <label className="form-label">Due Date</label>
                                <div className="input-groupicon calender-input">
                                  <input
                                    type="text"
                                    className="form-control  date-range bookingrange"
                                    placeholder="Select"
                                    defaultValue="13 Aug 1992"
                                  />
                                </div>
                              </div>
                            </div> */}
                  <div className="col-6">
                    <div className="form-wrap">
                      <label className="form-label">Due Date</label>
                      <div className="form-wrap icon-form">
                        {/* <span className="form-icon" style={{color:"unset"}}>
                                    <i
                                  data-feather="calendar"
                                  className="feather-calendar"
                                  
                                />
                                  </span> */}
                        <DatePicker
                          selected={
                            formData.date ? new Date(formData.date) : null
                          }
                          onChange={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              date: format(date, "dd MMM yyyy"), // e.g. "25 Jul 2023"
                            }))
                          }
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select date"
                          minDate={new Date()}
                          showPopperArrow={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <Select
                        className="select"
                        options={statusOptions}
                        placeholder="Select"
                        classNamePrefix="react-select"
                        value={
                          statusOptions.find(
                            (option) => option.value === formData.status
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: selectedOption.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3 summer-description-box notes-summernote">
                      <label className="form-label">Descriptions</label>
                      <textarea
                        id="description"
                        className="form-control"
                        maxLength="200"
                        rows="4"
                        placeholder="Enter description (max 60 characters)"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer-btn">
                  <button
                    type="button"
                    className="btn btn-cancel me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-submit"
                    disabled={submitLoading}
                  >
                    {submitLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
            {/* </div>
                  </div> */}
          </div>
        </div>
      </div>
      {/* /Add Note */}
      {/* Edit Note */}
      <div
        className="modal custom-modal fade"
        id="edit-note-units"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* <div className="page-wrapper-new p-0">
                    <div className="content"> */}
            <div className="modal-header">
              <h5 className="modal-title">Edit Notes</h5>
              <div className="d-flex align-items-center mod-toggle">
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
            </div>
            <div className="modal-body custom-modal-body">
              <form onSubmit={editNote}>
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Notes Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Assignee</label>
                      {/* <Select
                                  className="select"
                                  options={optionsChoose}
                                  placeholder="Choose"
                                  classNamePrefix="react-select"
                                /> */}
                      <input
                        type="text"
                        className="form-control"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Tags</label>
                      <Select
                        className="select"
                        options={categoryOptions}
                        placeholder="Select"
                        classNamePrefix="react-select"
                        value={
                          categoryOptions.find(
                            (option) => option.value === formData.tags
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: selectedOption.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Priority</label>
                      <Select
                        className="select"
                        options={priorityOptions}
                        placeholder="Select"
                        classNamePrefix="react-select"
                        value={
                          priorityOptions.find(
                            (option) => option.value === formData.priority
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) => ({
                            ...prev,
                            priority: selectedOption.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  {/* <div className="col-6">
                              <div className="input-blocks todo-calendar">
                                <label className="form-label">Due Date</label>
                                <div className="input-groupicon calender-input">
                                  <input
                                    type="text"
                                    className="form-control  date-range bookingrange"
                                    placeholder="Select"
                                    defaultValue="13 Aug 1992"
                                  />
                                </div>
                              </div>
                            </div> */}
                  <div className="col-6">
                    <div className="form-wrap">
                      <label className="form-label">Due Date</label>
                      <div className="form-wrap icon-form">
                        {/* <span className="form-icon" style={{color:"unset"}}>
                                    <i
                                  data-feather="calendar"
                                  className="feather-calendar"
                                  
                                />
                                  </span> */}
                        <DatePicker
                          selected={
                            formData.date ? new Date(formData.date) : null
                          }
                          onChange={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              date: format(date, "dd MMM yyyy"), // e.g. "25 Jul 2023"
                            }))
                          }
                          className="form-control"
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select date"
                          minDate={new Date()}
                          showPopperArrow={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <Select
                        className="select"
                        options={statusOptions}
                        placeholder="Select"
                        classNamePrefix="react-select"
                        value={
                          statusOptions.find(
                            (option) => option.value === formData.status
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: selectedOption.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3 summer-description-box notes-summernote">
                      <label className="form-label">Descriptions</label>
                      <textarea
                        id="description"
                        className="form-control"
                        maxLength="200"
                        rows="4"
                        placeholder="Enter description (max 60 characters)"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer-btn">
                  <button
                    type="button"
                    className="btn btn-cancel me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-submit"
                    disabled={submitLoading}
                  >
                    {submitLoading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
            {/* </div>
                  </div> */}
          </div>
        </div>
      </div>
      {/* /Edit Note */}

      {/* pagination */}
      {/* <div className="row custom-pagination">
        <div className="col-md-12">
          <div className="paginations d-flex justify-content-end">
            <span>
              <i className="fas fa-chevron-left" />
            </span>
            <ul className="d-flex align-items-center page-wrap">
              <li>
                <Link to="#" className="active">
                  1
                </Link>
              </li>
              <li>
                <Link to="#">2</Link>
              </li>
              <li>
                <Link to="#">3</Link>
              </li>
              <li>
                <Link to="#">4</Link>
              </li>
            </ul>
            <span>
              <i className="fas fa-chevron-right" />
            </span>
          </div>
        </div>
      </div> */}
      <div className="row custom-pagination">
        <div className="col-md-12">
          <div className="paginations d-flex justify-content-end">
            <span
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              style={{ cursor: currentPage > 1 ? "pointer" : "not-allowed" }}
            >
              <i className="fas fa-chevron-left" />
            </span>

            <ul className="d-flex align-items-center page-wrap">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <li key={pageNum}>
                    <Link
                      to="#"
                      onClick={() => setCurrentPage(pageNum)}
                      className={currentPage === pageNum ? "active" : ""}
                    >
                      {pageNum}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <span
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              style={{
                cursor: currentPage < totalPages ? "pointer" : "not-allowed",
              }}
            >
              <i className="fas fa-chevron-right" />
            </span>
          </div>
        </div>
      </div>
      {/* pagination */}
    </>
  );
};

export default NotesContent;
