import React,{Fragment,useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import axios from "axios";
import { all_routes } from "../../Router/all_routes";
import DataTable from "../../../components/Table/DataTable";
import PageHeader from "../../../components/Layouts/PageHeader";
import ContentLoader from "../../../components/Layouts/ContentLoader/Index";
import ErrorLoader from "../../../components/Layouts/ErrorLoader/Index";
import { toast } from "react-toastify";
import { Empty } from "antd";

const route = all_routes;

const ProductOEM = () => {
     const [data, setData] = useState([]);
          const [isLoading, setIsLoading] = useState(true);
          const [error, setError] = useState(null);
          const apiUrl = import.meta.env.VITE_API_URL;
          const Token = localStorage.getItem("token") || "";
          const initialForm = {
            name: "",
          };
          const [formData, setFormData] = useState(initialForm);
          const [productCategoryDetails, setProductCategoryDetails] = useState({});
          const [totalPages, setTotalPages] = useState(0);
          const pageSize = 500;
        
        
          const handleInputChange = (event) => {
            const { name, value } = event.target;
            setFormData((prevForm) => ({
              ...prevForm,
              [name]: value,
            }));
          };
        
          const fetchData = async () => {
            try {
              const response = await axios.get(
                `${apiUrl}/product/getProductOEM-list`,
                {
                  headers: {
                    Authorization: `Bearer ${Token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              const formattedData = response.data.data.map((item) => ({
                ...item,
                key: item.id, // Ensure that key is unique for each record
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
            fetchData();
          }, []);
        
        
          const handleAdd = async (e) => {
            e.preventDefault();
            try {
              const response = await axios.post(
                `${apiUrl}/product/addProductOEM`,
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
              toast.success("Product OEM added successfully!");
            } catch (error) {
              toast.error(error.message || "Something went wrong");
            }
          };
        
        
        const handleEdit = async (event) => {
            event.preventDefault();
            try {
                const response = await axios.put(
                    `${apiUrl}/product/updateProductOEM/${productCategoryDetails.id}`,
                    {
                        name: formData.name
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${Token}`
                        }
                    }
                );
        
                setFormData(initialForm);
                fetchData();
                toast.success('Product OEM edited successfully!');
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message || 'Something went wrong';
                toast.error(errorMessage);
            }
        };
        
  
    
    
    
    
    
    
    
    
    
    
          const handleDelete = async (e) => {
            e.preventDefault();
            try {
             const response = await axios.delete(
                `${apiUrl}/product/deleteProductOEM/${productCategoryDetails.id}`,
                {   
                  headers: {
                    Authorization: `Bearer ${Token}`,
                  },
                }
              );
        
              setProductCategoryDetails({});
              fetchData();
              toast.success("Product OEM deleted successfully!");
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
              title: "Product OEM Name",
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
                        setProductCategoryDetails(record);
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
                      onClick={() => setProductCategoryDetails(record)}
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
              <div className="page-wrapper">
                <div className="content">
                  <div className="row">
                    <div className="col-md-12">
                      {/* Page Header */}
                      <PageHeader title="Product OEM" count={totalPages} />
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
                                    placeholder="Search Product Brand"
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
                                        Add New Product OEM
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
              <div className="modal custom-modal fade" id="add_source" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Add New Product OEM</h5>
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
                            Product OEM Name <span className="text-danger">*</span>
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
                          Note: You can add multiple product at once by separating them
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
              <div className="modal custom-modal fade" id="edit_source" role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Product OEM</h5>
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
                            Product OEM Name <span className="text-danger">*</span>
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
              {/* Delete Source */}
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
                          <h3>Remove Product OEM?</h3>
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
              {/* /Delete Source */}
            </Fragment>
  )
}

export default ProductOEM