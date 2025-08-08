import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { all_routes } from "../../Router/all_routes";
import DataTable from "../../../components/Table/DataTable";
import PageHeader from "../../../components/Layouts/PageHeader";
import ContentLoader from "../../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../../components/Layouts/ErrorLoader/Index";
import { toast } from "react-toastify";
import { Empty } from "antd";

const SupportSubCate = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialForm = {
    name: "",
    supportCategoryId: null,
  };
  const [formData, setFormData] = useState(initialForm);

  const [supportCategoryOptions, setSupportCategoryOptions] = useState([]);
  const [subCategory, setSubCategory] = useState({});
  const [totalPages, setTotalPages] = useState(0);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const pageSize = 500;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  //   get category
  const fetchCategoryData = async () => {
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
        label: item.name,
        value: item.id,
      }));
      setSupportCategoryOptions(formattedData);
    } catch (error) {
      setError(error);
    }
  };

  //   get sub category
  const fetchSubCategoryData = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/master/support-sub-category-list`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const formattedData = response.data.data.map((item) => ({
        ...item,
        key: item.id,
        status: "active",
      }));
      setData(formattedData);
      setTotalPages(response.data.totalCount);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategoryData();
    fetchCategoryData();
  }, []);

  //   add sub category
  const handleAdd = async (event) => {
    event.preventDefault();

    const { name, supportCategoryId } = formData;

    if (!name?.trim() || !supportCategoryId) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      name: name.trim(),
      supportCategoryId,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/master/add-support-sub-category`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      toast.success(
        response.data?.message || "SupportCRM sub category added successfully!"
      );
      setFormData(initialForm);
      fetchSubCategoryData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  //   edit sub category
  const handleEdit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/master/edit-support-sub-category`,
        {
          id: formData.id,
          name: formData.name,
          supportCategoryId: formData.supportCategoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setFormData(initialForm);
      fetchSubCategoryData();
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  //   delete sub category
const handleDelete = async (event) => {
  event.preventDefault();
  try {
    const response = await axios.delete(
      `${apiUrl}/master/delete-support-sub-category/${subCategory.id}`,
      {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      }
    );

    fetchSubCategoryData();
    toast.success(response.data?.message || "SupportCRM category deleted successfully!");
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};

  const handleReset = () => {
    if (formData !== initialForm) {
      setFormData(initialForm);
    }
  };

  const columns = [
    {
      title: "SupportCRM Category",
      dataIndex: "productCategory",
      key: "productCategory",
      render: (text, record) => (
        <div>{record?.supportCategoryName || "N/A"}</div>
      ),
      width: "237px",
    },
    {
      title: "SupportCRM Sub Category",
      dataIndex: "name",
      key: "name",
      width: "237px",
    },

    {
      title: "Status",
      dataIndex: "status",
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
                setSubCategory(record);
                setFormData((prevData) => ({
                  ...prevData,
                  supportCategoryId: record.supportCategoryId,
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
              onClick={() => {
                setSubCategory(record);
              }}
            >
              <i className="ti ti-trash text-danger" /> Delete
            </Link>
          </div>
        </div>
      ),
    },
  ];
  return (
    <Fragment>
      <div>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                {/* Page Header */}
                <PageHeader
                  title="SupportCRM Sub Category"
                  count={totalPages}
                />
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
                              placeholder="Search Sub Category"
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
                                  Add Sub Category
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
        {/* /Page Wrapper */}
        {/* Add sub category */}
        <div className="modal custom-modal fade" id="add_source" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New SupportCRM Sub Category</h5>
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
                      SupportCRM Category <span className="text-danger">*</span>
                    </label>
                    <Select
                      classNamePrefix="react-select"
                      className="select"
                      value={supportCategoryOptions.find(
                        (ele) => formData.supportCategoryId === ele.value
                      )}
                      onChange={(event) => {
                        let { value } = event;
                        handleInputChange({
                          target: { name: "supportCategoryId", value },
                        });
                      }}
                      options={supportCategoryOptions}
                    />
                  </div>
                  <div className="form-wrap">
                    <label className="col-form-label">
                      SupportCRM Sub Category{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      //   placeholder="Eg: Lead management,Project management"
                      value={formData.name}
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <p style={{ fontSize: "small", color: "#7695FF" }}>
                    Note: You can add multiple roles at once by separating them
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
        {/* /Add sub category */}
        {/* Edit sub category */}
        <div className="modal custom-modal fade" id="edit_source" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Roles</h5>
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
                      SupportCRM Category <span className="text-danger">*</span>
                    </label>
                    <Select
                      classNamePrefix="react-select"
                      className="select"
                      value={supportCategoryOptions.find(
                        (ele) => formData.supportCategoryId === ele.value
                      )}
                      onChange={(selectedOption) => {
                        setFormData((prev) => ({
                          ...prev,
                          supportCategoryId: selectedOption?.value || null,
                        }));
                      }}
                      options={supportCategoryOptions}
                    />
                  </div>

                  <div className="form-wrap">
                    <label className="col-form-label">
                      Sub Category Name <span className="text-danger">*</span>
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
        {/* /Edit sub category */}
        {/* Delete sub category */}
        <div
          className="modal custom-modal fade"
          id="delete_source"
          role="dialog"
        >
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
                    <h3>Remove SupportCRM Sub Category?</h3>
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
        {/* /Delete sub category */}
      </div>
    </Fragment>
  );
};

export default SupportSubCate;
