import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../Router/all_routes";
import DataTable from "../../../components/Table/DataTable";
import PageHeader from "../../../components/Layouts/PageHeader";
import ContentLoader from "../../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../../components/Layouts/ErrorLoader/Index";
import { toast } from "react-toastify";
import { Empty } from "antd";

const Grade = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const initialForm = {
    name: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [gradeData, setGradeData] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [gradeToggle, setGradeToggle] = useState(false);
  const [gradeId, setGradeId] = useState("");

  const pageSize = 500;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // get grade
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/master/grade-list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      });
      const formattedData = response.data.data.map((item) => ({
        ...item,
        key: item.id, // Ensure that key is unique for each record
        status: "active",
      }));
      setData(formattedData);
      setTotalPages(response.data.totalCount);
      setIsLoading(false);
      setGradeId(response.data.data[0].id);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  // console.log("AllDATA", formData);

  //   Add grade
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/master/add-grade`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFormData(initialForm);
      fetchData();
      toast.success("Grade added successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  //   Edit grade
  const handleEdit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/master/edit-grade`,
        {
          id: formData.id,
          name: formData.name,
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setFormData(initialForm);
      fetchData();
      toast.success("Grade edited successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  // edit value
  const handleEditValue = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/master/edit-grade`,
        {
          id: formData.id,
          Bonas: formData.Bonas || "",
          hra: formData.hra || "",
          basic: formData.basic || "",
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      console.log("response from view",response)

      // setFormData(initialForm);
      setGradeToggle(false)
      fetchData();
      toast.success("Grade edited successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  console.log("formData..",formData)

  // delete grade
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${apiUrl}/master/delete-grade/${gradeData.id}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setGradeData({});
      fetchData();
      toast.success("Grade deleted successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
    }
  };

  const handleReset = () => {
    if (formData !== initialForm) {
      setFormData(initialForm);
    }
  };
  const columns = [
    {
      title: "Grade Name",
      dataIndex: "name",
      // sorter: (a, b) =>
      //     a.title.length - b.title.length,
      key: "name",
      width: "237px",
    },
    {
      title: "Status",
      dataIndex: "status",
      // sorter: (a, b) =>
      //     a.status.length - b.status.length,
      key: "status",
      width: "109px",
      render: (status) => (
        <span
          className={`${
            status == "active"
              ? "badge badge-pill badge-status bg-success"
              : status == "inactive"
              ? "badge badge-pill badge-status bg-danger"
              : ""
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "90px",
      render: (rext, record) => (
        <div className="dropdown table-action">
          <Link
            to="#"
            className="action-icon "
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit_source"
              onClick={() => {
                // setGradeData(record);
                setFormData((prevData) => ({
                  ...prevData,
                  name: record.name,
                  id: record.id,
                }));
              }}
            >
              <i className="ti ti-edit text-blue" /> Edit
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_source"
              onClick={() => setGradeData(record)}
            >
              <i className="ti ti-trash text-danger" /> Delete
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              onClick={() => {
                setGradeToggle(true), setGradeData(record);
                 setFormData((prevData) => ({
                  ...prevData,
                  // name: record.name,
                  id: record.id,
                  hra: record.hra,
                  basic: record.basic,
                  Bonas: record.Bonas
                }));
              }}
            >
              <i className=" ti ti-eye text-blue me-2"></i> View
            </Link>
          </div>
        </div>
      ),
    },
  ];


  return (
    <Fragment>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <PageHeader title="Grade" count={totalPages} />
              {/* /Page Header */}
              <div className="card main-card">
                <div className="card-body">
                  {/* Search */}
                  <div className="search-section">
                    <div className="row">
                      <div className="col-md-5 col-sm-4">
                        <div className="form-wrap icon-form">
                          <span className="form-icon">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Grade"
                          />
                        </div>
                      </div>
                      <div className="col-md-7 col-sm-8">
                        <div className="export-list text-sm-end">
                          <ul>
                            <li>
                              <Link
                                to="#"
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#add_source"
                              >
                                <i className="ti ti-square-rounded-plus" />
                                Add New Grade
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Search */}
                  {/* Contact List */}
                  {isLoading && <ContentLoader />}
                  {error && (
                    <ErrorLoader title={error.name} message={error.message} />
                  )}
                  {data.length > 0 && (
                    <>
                      <div className="table-responsive custom-table">
                        <DataTable
                          dataSource={data}
                          columns={columns}
                          totalPages={totalPages}
                          pageSize={pageSize}
                        />
                      </div>
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="datatable-length" />
                        </div>
                        <div className="col-md-6">
                          <div className="datatable-paginate" />
                        </div>
                      </div>
                    </>
                  )}
                  {data.length === 0 && <Empty />}
                  {/* /Contact List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add */}
      <div className="modal custom-modal fade" id="add_source" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Grade</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleReset}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAdd}>
                <div className="form-wrap">
                  <label className="col-form-label">
                    Grade Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    // placeholder="Eg: Customer Support,Sales"
                    value={formData.name}
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <p style={{ fontSize: "small", color: "#7695FF" }}>
                  Note: You can add multiple grade at once by separating them
                  with commas (,)
                </p>
                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                    onClick={handleReset}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Add */}
      {/* Edit */}
      <div className="modal custom-modal fade" id="edit_source" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Grade</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleReset}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEdit}>
                <div className="form-wrap">
                  <label className="col-form-label">
                    Grade Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    required
                    onChange={handleInputChange}
                  />
                </div>

                <div className="modal-btn text-end">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                    onClick={handleReset}
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Edit */}
      {/* Delete */}
      <div className="modal custom-modal fade" id="delete_source" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="success-message text-center">
                  <div className="success-popup-icon">
                    <i className="ti ti-trash-x" />
                  </div>
                  <h3>Remove Grade?</h3>
                  <p className="del-info">
                    Are you sure you want to remove it.
                  </p>
                  <div className="col-lg-12 text-center modal-btn">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-danger"
                      onClick={handleDelete}
                      data-bs-dismiss="modal"
                    >
                      Yes, Delete it
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete */}

      {/* View */}
      <div
        className={gradeToggle ? "toggle-popup sidebar-popup" : "toggle-popup"}
      >
        <div className="sidebar-layout" style={{ maxWidth: "50%" }}>
          <div className="sidebar-header">
            {/* <h4>Grade A</h4> */}
            <h4>{gradeData.name}</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setGradeToggle(false)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <form onSubmit={handleEditValue}>
              <div className="row" style={{ height: "50px" }}>
                <div className="col-md-6">
                  <div className="setting-title mt-2">
                    <p>HRA :</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-wrap">
                    <div className="">
                      <input
                        type="text"
                        className="form-control"
                        name="hra"
                        value={formData.hra}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row" style={{ height: "50px" }}>
                <div className="col-md-6">
                  <div className="setting-title mt-2">
                    <p>Basic :</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-wrap">
                    <div className="">
                      <input
                        type="text"
                        className="form-control"
                        name="basic"
                        value={formData.basic}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row" style={{ height: "50px" }}>
                <div className="col-md-6">
                  <div className="setting-title mt-2">
                    <p>Bonas :</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-wrap">
                    <div className="">
                      <input
                        type="text"
                        className="form-control"
                        name="Bonas"
                        value={formData.Bonas}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="submit-button text-end mt-3">
                <Link
                  to="#"
                  className="btn btn-light sidebar-close me-2"
                  onClick={() => setGradeToggle(false)}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* View */}
    </Fragment>
  );
};

export default Grade;
