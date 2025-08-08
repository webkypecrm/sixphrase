import React, { Fragment, useEffect, useState } from "react";
import { Await, Link } from "react-router-dom";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { all_routes } from "../Router/all_routes";
import Select from "react-select";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
import DataTable from "../../components/Table/DataTable";
import { companiesData } from "../../data/companiesData";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import EditCompaney from "./EditCompaney";

const Companey = () => {
  const [activityToggle, setActivityToggle] = useState(false);
  const [activityToggleTwo, setActivityToggleTwo] = useState(false);
  const [activityToggle3, setActivityToggle3] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [companeyData, getCompaneyData] = useState();
  const [companeyDetails, setCompaneyDetails] = useState({});
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [companeyIdData, setCompaneyIdData] = useState({});
  const [count, setCount] = useState(0);

  const companyData = [
    { value: "", label: "Choose" },
    { value: "Public", label: "Public" },
    { value: "Private", label: "Private" },
    { value: "Partnership", label: "Partnership" },
    { value: "Proprietorship", label: "Proprietorship" },
  ];

  const route = all_routes;

  //--------Companey API-----------
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const initialForm = {
    companyID: "",
    companyName: "",
    companyType: null,
    companyGST: "",
    companyPAN: "",
    website: "",
    address: "",
  };
  const [formData, setFormData] = useState(initialForm);

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

  // Add companey
  const formSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    if (imageFile) {
      submitData.append("logo", imageFile);
    }

    try {
      const res = await axios.post(
        `${apiUrl}/product/add-company`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      fatchCompaneyData();
      setActivityToggle(false);
      toast.success("Companey added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  // GET Companey
  const fatchCompaneyData = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/product/get-company-list-with-branch-info`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      getCompaneyData(res.data.data);
      setCount(res.data.totalCount);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Get companey Data by id
  const fatchDataById = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}/product/get-comany-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      setCompaneyIdData(res?.data?.data?.companyName);
      console.log("byID", res.data.data.companyName);
    } catch (error) {}
  };


  // delete company
  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/product/delete-company/${companeyDetails.id}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      fatchCompaneyData();
      toast.success("Companey deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    fatchCompaneyData();
  }, []);

  // -------Branch API-------
  const initialForm2 = {
    typeHQ: "",
    name: "",
    address: "",
    state: "",
    city: "",
    pinCode: "",
    contactPerson: "",
    contactEmail: "",
    contactNumber: "",
    designation: "",
    website: "",
    // totalStaff: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankAccountIFSC: "",
    bankAddress: "",
  };

  const [branchDataList, setBranchDataList] = useState([{ ...initialForm2 }]);

  const addBranch = () => {
    const last = branchDataList[branchDataList.length - 1];
    const newBranch = { ...initialForm2, state: last.state };
    setBranchDataList([...branchDataList, newBranch]);
  };

  const removeBranch = (index) => {
    const updated = [...branchDataList];
    updated.splice(index, 1);
    setBranchDataList(updated);
  };

  const handleChange = (index, e) => {
    const updated = [...branchDataList];
    updated[index][e.target.name] = e.target.value;
    setBranchDataList(updated);
  };

  // Add Branch
  const handelBranchAddData = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    try {
      const branchRes = await axios.post(
        `${apiUrl}/product/add-company-branch/${companeyDetails.id}`,
        branchDataList,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      fatchCompaneyData();
      setActivityToggle3(!activityToggle3);
      setBranchDataList([{ ...initialForm2 }]);
      toast.success("Branch added successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "name",
      render: (text, record) => (
        <ul>
          <li>
            <div>ID : {record?.companyID}</div>
          </li>
          <li>
            <div className="table-avatar d-flex align-items-center table-padding">
              <Link to="#" className="company-img">
                <img
                  src={record?.logo}
                  alt=""
                  style={{ height: "100%", width: "100%" }}
                />
              </Link>
            </div>
          </li>
        </ul>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Company",
      dataIndex: "name",
      render: (text, record) => (
        <ul>
          <li>
            <div className="table-avatar d-flex align-items-center table-padding">
              <Link
                to="#"
                //  {route.companyDetails}
                className="profile-split"
              >
                {record?.companyName}
              </Link>
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Type :</span>{" "}
              {record?.companyType}
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>GST :</span>{" "}
              {record?.companyGST}
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>PAN :</span>{" "}
              {record?.companyPAN}
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Website</span> :{" "}
              <a
                href={
                  record?.website.startsWith("http")
                    ? record?.website
                    : `${record?.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {record?.website}
              </a>
            </div>
          </li>
        </ul>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Primary Bank",
      dataIndex: "phone",
      render: (text, record) => (
        <ul>
          <li>
            <div className="table-avatar d-flex align-items-center table-padding">
              <Link to="#" className="profile-split">
                {record?.companyName}
              </Link>
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Acc No</span> :{" "}
              {record?.firstBranch?.bankAccountNumber}
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Bank</span> :{" "}
              {record?.firstBranch?.bankAccountName}
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Branch</span> :{" "}
              {record?.firstBranch?.bankAddress}
            </div>
          </li>
        </ul>
      ),
    },

    {
      title: "Branched",
      dataIndex: "email",
      render: (text, record) => (
        <div>
          <span>{record?.branchCount} Branch</span>
        </div>
      ),
    },

    {
      title: "Action",
      render: (text, record, index) => (
        <div className="social-links d-flex align-items-center" key={index}>
          <li>
            <Link
              className=""
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Edit Company"
              to="#"
              onClick={() => {
                setActivityToggleTwo(true);
                setCompaneyDetails(record);
              }}
            >
              <i className="ti ti-edit me-2" />
            </Link>
          </li>
          <li>
            <Link
              className=""
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_company"
              onClick={() => setCompaneyDetails(record)}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Delete Company"
            >
              <i className="ti ti-trash text-danger me-2" />
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className=" add-popup compney-icon-addBranch"
              onClick={() => {
                setCompaneyDetails(record);
                fatchDataById(record.id);
                setActivityToggle3((prev) => !prev);
              }}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Add Branch"
            >
              <i className="ti ti-square-rounded-plus compney-icon-addBranch me-2" />
            </Link>
          </li>
          <li>
            <div className="status-toggle">
              <input
                type="checkbox"
                id={`disable-${index}`}
                className="check"
              />
              <label htmlFor={`disable-${index}`} className="checktoggle" />
            </div>
          </li>
          <Tooltip id={`tooltip-${index}`} place="top" />
        </div>
      ),
    },
    {
      title: "Branch Address",
      dataIndex: "status",
      render: (text, record, index) => {
        const fullAddress = record?.firstBranch?.address || "";
        const words = fullAddress.split(" ");
        const shortAddress =
          words.length > 4 ? words.slice(0, 4).join(" ") + "..." : fullAddress;

        return (
          <ul>
            <li>
              <div>
                <span style={{ fontWeight: "500" }}>Name</span> :{" "}
                {record?.firstBranch?.name}
              </div>
            </li>
            <li data-tooltip-id={`address`} data-tooltip-content={fullAddress} style={{ cursor: "pointer" }}>
              <div>
                <span style={{ fontWeight: "500" }}>Head Office</span> :{" "}
                {shortAddress}
              </div>
            </li>
            <li>
              <div>
                <span style={{ fontWeight: "500" }}>Total Staff</span> :{" "}
                {record?.firstBranch?.totalStaff}
              </div>
            </li>
            <li>
              <div>
                <span style={{ fontWeight: "500" }}>Website</span> :{" "}
                <Link to="#">{record?.firstBranch?.website}</Link>
              </div>
            </li>
            <Tooltip
              id={`address`}
              place="top"
              style={{
                maxWidth: "320px",
                whiteSpace: "normal",
                wordWrap: "break-word",
                position: "absolute",
                zIndex: 9999,
                fontSize: "13px",
              }}
            />
          </ul>
        );
      },
    },
    {
      title: "Contact Person",
      dataIndex: "status",
      render: (text, record) => (
        <ul>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>
                {record?.firstBranch?.contactPerson}
              </span>
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>
                {record?.firstBranch?.contactNumber}
              </span>
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>
                {record?.firstBranch?.designation}
              </span>
            </div>
          </li>
          <li>
            <div>
              {/* <span style={{ fontWeight: "500" }}>Website</span> :{" "} */}
              <Link to="#">gajenn@webkype.com</Link>
            </div>
          </li>
        </ul>
      ),
    },
  ];

  const initialSettings = {
    endDate: new Date("2020-08-11T12:30:00.000Z"),
    ranges: {
      "Last 30 Days": [
        new Date("2020-07-12T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last 7 Days": [
        new Date("2020-08-04T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last Month": [
        new Date("2020-06-30T18:30:00.000Z"),
        new Date("2020-07-31T18:29:59.999Z"),
      ],
      "This Month": [
        new Date("2020-07-31T18:30:00.000Z"),
        new Date("2020-08-31T18:29:59.999Z"),
      ],
      Today: [
        new Date("2020-08-10T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      Yesterday: [
        new Date("2020-08-09T04:57:17.076Z"),
        new Date("2020-08-09T04:57:17.076Z"),
      ],
    },
    startDate: new Date("2020-08-04T04:57:17.076Z"), // Set "Last 7 Days" as default
    timePicker: false,
  };
  return (
    <Fragment>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-4">
                    <h4 className="page-title">
                      Companies<span className="count-title">{count}</span>
                    </h4>
                  </div>
                  <div className="col-8 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}

              {/* Campaign Status */}
              {/* <div className="row">
                <div className="col-xl-3 col-lg-6">
                  <div className="campaign-box bg-danger-light">
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-brand-campaignmonitor" />
                      </span>
                      <p>Campaign</p>
                    </div>
                    <h2>474</h2>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6">
                  <div className="campaign-box bg-warning-light">
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-send" />
                      </span>
                      <p>Sent</p>
                    </div>
                    <h2>454</h2>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6">
                  <div className="campaign-box bg-purple-light">
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-brand-feedly" />
                      </span>
                      <p>Opened</p>
                    </div>
                    <h2>658</h2>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-6">
                  <div className="campaign-box bg-success-light">
                    <div className="campaign-img">
                      <span>
                        <i className="ti ti-brand-pocket" />
                      </span>
                      <p>Completed</p>
                    </div>
                    <h2>747</h2>
                  </div>
                </div>
              </div> */}
              {/* /Campaign Status */}

              <div className="card main-card">
                <div className="card-body">
                  {/* Search */}
                  <div className="search-section">
                    <div className="row">
                      <div
                        className="col-md-5 col-sm-4"
                        style={{ width: "20%" }}
                      >
                        <div className="form-wrap icon-form">
                          <span className="form-icon">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Companies"
                          />
                        </div>
                      </div>
                      <div
                        className="col-md-7 col-sm-8"
                        style={{ width: "80%" }}
                      >
                        <div className="export-list text-sm-end">
                          <ul>
                            <li>
                              <div className=" icon-form">
                                <span className="form-icon">
                                  <i className="ti ti-calendar" />
                                </span>
                                <DateRangePicker
                                  initialSettings={initialSettings}
                                >
                                  <input
                                    className="form-control bookingrange"
                                    type="text"
                                  />
                                </DateRangePicker>
                              </div>
                            </li>

                            <li>
                              <div className="manage-dropdwon">
                                <Link
                                  to="#"
                                  className="btn btn-purple-light"
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="false"
                                >
                                  <i className="ti ti-columns-3" />
                                  {/* Manage Columns */}
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-md-end">
                                  <h4>Want to manage datatables?</h4>
                                  <p>
                                    Please drag and drop your column to reorder
                                    your table and enable see option as you
                                    want.
                                  </p>
                                  <ul>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Name
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-name"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-name"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Phone
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-phone"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-phone"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Email
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-email"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-email"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Location
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-tag"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-tag"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Created Date
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-loc"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-loc"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Last Activity
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-rate"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-rate"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Status
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-owner"
                                          className="check"
                                        />
                                        <label
                                          htmlFor="col-owner"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                    <li>
                                      <p>
                                        <i className="ti ti-grip-vertical" />
                                        Action
                                      </p>
                                      <div className="status-toggle">
                                        <input
                                          type="checkbox"
                                          id="col-contact"
                                          className="check"
                                          defaultChecked={true}
                                        />
                                        <label
                                          htmlFor="col-contact"
                                          className="checktoggle"
                                        />
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </li>

                            <li>
                              <div className="export-dropdwon ">
                                <Link
                                  to="#"
                                  className="dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="ti ti-package-export" />
                                  {/* Export */}
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-end">
                                  <ul>
                                    <li>
                                      <Link to="#">
                                        <i className="ti ti-file-type-pdf text-danger" />
                                        Export as PDF
                                      </Link>
                                    </li>
                                    <li>
                                      <Link to="#">
                                        <i className="ti ti-file-type-xls text-green" />
                                        Export as Excel{" "}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="form-sorts dropdown">
                                <Link
                                  to="#"
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="false"
                                >
                                  <i className="ti ti-filter-share" />
                                  {/* Filter */}
                                </Link>
                                <div className="filter-dropdown-menu dropdown-menu  dropdown-menu-md-end">
                                  <div className="filter-set-view">
                                    <div className="filter-set-head">
                                      <h4>
                                        <i className="ti ti-filter-share" />
                                        Filter
                                      </h4>
                                    </div>

                                    <div
                                      className="accordion"
                                      id="accordionExample"
                                    >
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-expanded="true"
                                            aria-controls="collapseTwo"
                                          >
                                            Country
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse show"
                                          id="collapseTwo"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <div className="form-wrap icon-form">
                                              <span className="form-icon">
                                                <i className="ti ti-search" />
                                              </span>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search Country"
                                              />
                                            </div>
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>India</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>USA</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>France</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>United Kingdom</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>UAE</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Italy</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Japan</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Germany</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#owner"
                                            aria-expanded="false"
                                            aria-controls="owner"
                                          >
                                            Owner
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="owner"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <div className="form-wrap icon-form">
                                              <span className="form-icon">
                                                <i className="ti ti-search" />
                                              </span>
                                              <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search Owner"
                                              />
                                            </div>
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Hendry</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Guillory</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Jami</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Theresa</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Espinosa</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#Status"
                                            aria-expanded="false"
                                            aria-controls="Status"
                                          >
                                            Status
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="Status"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Active</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Inactive</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-expanded="false"
                                            aria-controls="collapseOne"
                                          >
                                            Rating
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="collapseOne"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <span>5.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <span>4.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <span>3.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <span>2.0</span>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="rating">
                                                  <i className="fa fa-star filled" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <i className="fa fa-star" />
                                                  <span>1.0</span>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to="#"
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseThree"
                                            aria-expanded="false"
                                            aria-controls="collapseThree"
                                          >
                                            Tags
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="collapseThree"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <ul>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      defaultChecked
                                                    />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Promotion</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Rated</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Rejected</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Collab</h5>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks" />
                                                  </label>
                                                </div>
                                                <div className="collapse-inside-text">
                                                  <h5>Calls</h5>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="filter-reset-btns">
                                      <div className="row">
                                        <div className="col-6">
                                          <Link
                                            to="#"
                                            className="btn btn-light"
                                          >
                                            Reset
                                          </Link>
                                        </div>
                                        <div className="col-6">
                                          <Link
                                            to={route.contactList}
                                            className="btn btn-primary"
                                          >
                                            Filter
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>

                            {/* <li>
                              <div className="view-icons">
                                <Link to={route.companies} className="active">
                                  <i className="ti ti-list-tree" />
                                </Link>
                                <Link to={route.companiesGrid}>
                                  <i className="ti ti-grid-dots" />
                                </Link>
                              </div>
                            </li> */}
                            <li>
                              <Link
                                to="#"
                                className="btn btn-primary add-popup"
                                onClick={() =>
                                  setActivityToggle(!activityToggle)
                                }
                              >
                                <i className="ti ti-square-rounded-plus" />
                                Add Company
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Search */}

                  {/* Contact List */}
                  <div className="table-responsive custom-table">
                    <DataTable
                      columns={columns}
                      dataSource={companeyData}
                      disableSelection={true}
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
                  {/* /Contact List */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal custom-modal fade"
        id="delete_contact"
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
              <div className="success-message text-center">
                <div className="success-popup-icon">
                  <i className="ti ti-trash-x" />
                </div>
                <h3>Remove Companies?</h3>
                <p className="del-info">
                  Company ”NovaWaveLLC” from your Account.
                </p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.companies} className="btn btn-danger">
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Company */}
      <div
        className={
          activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout">
          <div className="sidebar-header">
            <h4>Add New Company</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setActivityToggle(!activityToggle)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <form onSubmit={formSubmit} className="toggle-height">
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
                                Company ID{" "}
                                <span className="text-danger">*</span>
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
                  onClick={() => setActivityToggle(!activityToggle)}
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
                      Create
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Company */}
      {/* Add Branch */}
      <div
        className={
          activityToggle3 ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout">
          <div className="sidebar-header">
            <h4>Add Branch</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setActivityToggle3(!activityToggle3)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>

          <div className="toggle-body">
            <form onSubmit={handelBranchAddData} className="toggle-height">
              <div className="pro-create">
                <div className="accordion-lists" id="list-accord">
                  {branchDataList.map((branch, index) => (
                    <div className="user-accordion-item" key={index}>
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
                            <div className="col-md-8">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Company Name{" "}
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  // name="typeHQ"
                                  value={companeyIdData}
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Type (HO){" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="typeHQ"
                                  value={branch.typeHQ}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">Name</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  value={branch.name}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Address
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="address"
                                  value={branch.address}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">State</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="state"
                                  value={branch.state}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">City</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="city"
                                  value={branch.city}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Pincode
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="pinCode"
                                  value={branch.pinCode}
                                  onChange={(e) => handleChange(index, e)}
                                  onKeyDown={(e) => {
                                    if (
                                      ["e", "E", "+", "-", "."].includes(e.key)
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Contact Person
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="contactPerson"
                                  value={branch.contactPerson}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Contact Email{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="email"
                                  className="form-control"
                                  name="contactEmail"
                                  value={branch.contactEmail}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Contact Number{" "}
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="contactNumber"
                                  value={branch.contactNumber}
                                  onChange={(e) => handleChange(index, e)}
                                  onKeyDown={(e) => {
                                    if (
                                      ["e", "E", "+", "-", "."].includes(e.key)
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Designation{" "}
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="designation"
                                  value={branch.designation}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Website
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="website"
                                  value={branch.website}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            {/* <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Total Staff{" "}
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="totalStaff"
                                  value={branch.totalStaff}
                                  onChange={(e) => handleChange(index, e)}
                                  onKeyDown={(e) => {
                                    if (
                                      ["e", "E", "+", "-", "."].includes(e.key)
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div> */}

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Bank Name{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="bankAccountName"
                                  value={branch.bankAccountName}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Bank Acc No.{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="bankAccountNumber"
                                  value={branch.bankAccountNumber}
                                  onChange={(e) => handleChange(index, e)}
                                  onKeyDown={(e) => {
                                    if (
                                      ["e", "E", "+", "-", "."].includes(e.key)
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Bank IFSC{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="bankAccountIFSC"
                                  value={branch.bankAccountIFSC}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-wrap">
                                <label className="col-form-label">
                                  Bank Address{" "}
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="bankAddress"
                                  value={branch.bankAddress}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            </div>

                            <div className="col-md-7">
                              <Link
                                onClick={addBranch}
                                to="#"
                                className="add-new add-new-phone mb-3 d-block"
                              >
                                <i className="ti ti-square-rounded-plus me-2" />
                                Add Another Branch
                              </Link>
                            </div>

                            {index !== 0 && (
                              <div className="col-md-7">
                                <Link
                                  type="button"
                                  className="add-new add-new-phone d-block"
                                  onClick={() => removeBranch(index)}
                                >
                                  <i className="ti ti-trash me-1" /> Remove
                                  Branch
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="submit-button text-end">
                <Link
                  to="#"
                  className="btn btn-light sidebar-close"
                  onClick={() => setActivityToggle3(!activityToggle3)}
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
                      Create
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Add Branch */}
      {/* Edit Company */}
      <div
        className={
          activityToggleTwo ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <EditCompaney
          activityToggleTwo={activityToggleTwo}
          setActivityToggleTwo={setActivityToggleTwo}
          isSubmitLoading={isSubmitLoading}
          companyData={companyData}
          companeyDetails={companeyDetails}
          setIsSubmitLoading={setIsSubmitLoading}
          fatchCompaneyData={fatchCompaneyData}
        />
      </div>
      {/* /Edit Company */}
      {/* Delete Company */}
      <div
        className="modal custom-modal fade"
        id="delete_company"
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
              <div className="success-message text-center">
                <div className="success-popup-icon">
                  <i className="ti ti-trash-x" />
                </div>
                <h3>Remove Company?</h3>
                <p className="del-info">
                  Company {companeyDetails?.companyName} from your Account.
                </p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    // onClick={handleDelete}
                  >
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Company */}
    </Fragment>
  );
};

export default Companey;
