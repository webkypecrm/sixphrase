import React, { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import CollapseHeader from "../../../components/CollapseHeader/CollapseHeader";
import DataTable from "../../../components/Table/DataTable";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import debounce from "lodash/debounce";
import { format } from "date-fns";
import TeamForm from "./TeamForm";
import TeamMembers from "./TeamMembers";

const initialForm = {
  teamName: "",
  teamCompanyId: null,
  branchId: null,
  teamManagerId: null,
  teamMemberIds: [],
  logo: "",
};

const Teams = () => {
  const [activityToggle, setActivityToggle] = useState(false); // Add
  const [activityToggle2, setActivityToggle2] = useState(false); // Edit
  const [activityToggle3, setActivityToggle3] = useState(false); // members
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [count, setCount] = useState(0);

  const [companyOptions, setCompanyOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [managerOptions, setManagerOptions] = useState([]);
  const [staffOptions, setStaffOptions] = useState([]);

  const [teamsData, setTeamsData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamId, setTeamId] = useState(null);

  console.log("teamis",teamId)

  const companyIdRef = useRef(null);
  const branchIdRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const route = all_routes;

  // Refs
  useEffect(() => {
    companyIdRef.current = formData.teamCompanyId;
    branchIdRef.current = formData.branchId;
  }, [formData]);

  // Reset form state
  const resetForm = () => {
    setFormData(initialForm);
    setImagePreview(null);
    setSelectedTeam(null);
    setBranchOptions([]);
    setManagerOptions([]);
    setStaffOptions([]);
  };

  // Fetch company list
  const getCompanyData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/product/get-comany-list`, {
        headers: { Authorization: `Bearer ${Token}` },
      });
      const options = res.data.data.map((c) => ({
        label: c.companyName,
        value: c.id,
      }));
      setCompanyOptions(options);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch branch list
  const getBranchData = async (companyId) => {
    try {
      const res = await axios.get(
        `${apiUrl}/product/company-branch-list-byid/${companyId}`,
        { headers: { Authorization: `Bearer ${Token}` } }
      );
      setBranchOptions(
        res.data.data.map((b) => ({ label: b.name, value: b.id }))
      );
    } catch (err) {
      toast.error("Branch fetch failed");
    }
  };

  // Fetch managers
  const getManagerData = async (companyId, branchId, search = "") => {
    try {
      const res = await axios.get(
        `${apiUrl}/product/company-staff-list?userCompanyId=${companyId}&companyBranchId=${
          branchId || ""
        }&teamManager=yes&search=${search}`,
        { headers: { Authorization: `Bearer ${Token}` } }
      );
      setManagerOptions(
        res.data.data.map((m) => ({ label: m.name, value: m.staffId }))
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch team members
  const getStaffData = async (companyId, branchId, search = "") => {
    try {
      const res = await axios.get(
        `${apiUrl}/product/company-staff-list?userCompanyId=${companyId}&companyBranchId=${
          branchId || ""
        }&search=${search}`,
        { headers: { Authorization: `Bearer ${Token}` } }
      );
      const newOptions = res.data.data.map((s) => ({
        label: s.name,
        value: s.staffId,
      }));
      setStaffOptions((prev) =>
        search
          ? Array.from(
              new Map(
                [...prev, ...newOptions].map((i) => [i.value, i])
              ).values()
            )
          : newOptions
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const debouncedGetStaff = debounce((input) => {
    getStaffData(companyIdRef.current, branchIdRef.current, input);
  }, 400);

  // Form submit
 const handleSubmit = async (e, isEdit = false) => {
  e.preventDefault();
  setIsSubmitLoading(true);

  try {
    const payload = new FormData();
    payload.append("teamName", formData.teamName);
    payload.append("teamCompanyId", formData.teamCompanyId);
    if (formData.branchId) payload.append("branchId", formData.branchId);
    if (formData.teamManagerId !== null)
      payload.append("teamManagerId", formData.teamManagerId);

    formData.teamMemberIds.forEach((id, i) =>
      payload.append(`teamMemberIds[${i}]`, id)
    );

    if (formData.logo instanceof File) {
      payload.append("logo", formData.logo);
    }

    const url = isEdit
      ? `${apiUrl}/product/add-update/${selectedTeam?.id}`
      : `${apiUrl}/product/add-team`;

    const config = {
      headers: {
        Authorization: `Bearer ${Token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const res = isEdit
      ? await axios.put(url, payload, config)
      : await axios.post(url, payload, config);

    toast.success(res.data.message || (isEdit ? "Team updated!" : "Team created!"));

    resetForm();
    setActivityToggle(false);
    setActivityToggle2(false);
    getTeams();
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  } finally {
    setIsSubmitLoading(false);
  }
};


  // Open Edit
  const openEdit = async (record) => {
    setSelectedTeam(record);
    setFormData({
      teamName: record.teamName || "",
      teamCompanyId: record.teamCompanyId ?? null,
      branchId: record.branchId ?? null,
      teamManagerId: record.teamManagerId ?? null,
      teamMemberIds: record.teamMembers?.map((m) => m.staff?.staffId) || [],
      logo: "",
    });
    setImagePreview(record.logo || null);

    await getBranchData(record.teamCompanyId);
    await getManagerData(record.teamCompanyId, record.branchId);
    await getStaffData(record.teamCompanyId, record.branchId);
    setActivityToggle2(true);
  };

  // Get all teams
  const getTeams = async () => {
    try {
      const res = await axios.get(`${apiUrl}/product/team-list`, {
        headers: { Authorization: `Bearer ${Token}` },
      });

      console.log("allTeam", res.data.data);
      setTeamsData(res.data.data);
      setCount(res.data.totalCount);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Init
  useEffect(() => {
    getCompanyData();
    getTeams();
  }, []);

  useEffect(() => {
    if (formData.teamCompanyId) {
      getBranchData(formData.teamCompanyId);
      getManagerData(formData.teamCompanyId, formData.branchId);
      getStaffData(formData.teamCompanyId, formData.branchId);
    }
  }, [formData.teamCompanyId, formData.branchId]);

  // delete team
  const deleteTeam = async () => {
    try {
      const res = await axios.delete(
        `${apiUrl}/product/delete-team/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      getTeams();
      toast.success(res.data.message || "Team deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      render: (text, record) => (
        <ul>
          <li>
            <div className="table-avatar d-flex align-items-center table-padding">
              <Link
                to="#"
                className="company-img me-0"
                style={{ height: "70px", width: "70px" }}
              >
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
      title: "Team",
      dataIndex: "name",
      render: (text, record) => (
        <ul>
          <li>
            <div className="table-avatar d-flex align-items-center table-padding">
              <Link to="#" className="profile-split">
                {record?.teamName}
              </Link>
            </div>
          </li>
          <li>
            <div>
              <span style={{ fontWeight: "500" }}>Created At :</span>{" "}
              {/* {record?.createdAt} */}
              {format(new Date(record.createdAt), "dd MMM yyyy")}
            </div>
          </li>
        </ul>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Members",
      dataIndex: "status",
      render: (text, record) => (
        <ul>
          <li>
            <div onClick={() => {setTeamId(record.id), setActivityToggle3(true)}}>
              <Link>{record?.teamMembersCount}</Link>
            </div>
          </li>
        </ul>
      ),
    },
    {
      title: "Manager",
      dataIndex: "phone",
      render: (text, record) => (
        <ul>
          <li>
            <div>{record?.teamManager?.name}</div>
          </li>
        </ul>
      ),
    },
    {
      title: "Company",
      dataIndex: "status",
      render: (text, record) => (
        <ul>
          <li>
            <div>{record?.teamCompany?.companyName}</div>
          </li>
        </ul>
      ),
    },
    {
      title: "Branch",
      dataIndex: "status",
      render: (text, record) => (
        <ul>
          <li>
            <div>{record?.branch?.name}</div>
          </li>
        </ul>
      ),
    },
    {
      title: "Sales Target",
      dataIndex: "status",
      render: (text, record) => (
        <ul>
          <li>

              {record?.totalSalePrice}

          </li>
        </ul>
      ),
    },
    {
      title: "Sales Achievement",
      dataIndex: "status",
      render: (text, record) => (
        <ul>
          <li>
            {/* <div>
              <span style={{ fontWeight: "500" }}>Name</span> :{" "}
             {record?.bankAccountNumber}CASSA
            </div> */}
          </li>
          {/* <li>
            <div>
              <span style={{ fontWeight: "500" }}>{record?.contactNumber}</span>
            </div>
          </li> */}
          {/* <li>
            <div>
              <span style={{ fontWeight: "500" }}>{record?.designation}</span>
            </div>
          </li> */}
          {/* <li>
                <div>
                  <span style={{ fontWeight: "500" }}>Website</span> :{" "}
                  <Link to="#">gajenn@webkype.com</Link>
                </div>
              </li> */}
        </ul>
      ),
    },
    {
      title: "Action",
      render: (text, record, index) => (
        <div className="social-links d-flex align-items-center" key={index}>
           <li>
            <Link
              to="#"
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="View Members"
              onClick={() => {setTeamId(record.id), setActivityToggle3(true)}}
            >
              <i className=" ti ti-eye me-2"></i>
            </Link>
          </li>
          {/* <li>
            <Link
              className=""
              to=""
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Edit Team"
              onClick={() => openEdit(record)}
            >
              <i className="ti ti-edit me-2" />
            </Link>
          </li> */}
          <li>
            <Link
              className=""
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_team"
              onClick={() => setTeamId(record.id)}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Delete Team"
            >
              <i className="ti ti-trash text-danger me-2" />
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
    } else {
      toast.error("Please select a valid image.");
    }
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
                      Teams<span className="count-title">{count}</span>
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
                            placeholder="Search Teams"
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

                            <li>
                              <Link
                                to="#"
                                className="btn btn-primary add-popup"
                                onClick={() =>
                                  setActivityToggle(!activityToggle)
                                }
                              >
                                <i className="ti ti-square-rounded-plus" />
                                Add Teams
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
                      dataSource={teamsData}
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

      {/* Add Team */}
      <div
        className={
          activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <TeamForm
          title="Add New Team"
          formData={formData}
          companyOptions={companyOptions}
          branchOptions={branchOptions}
          managerOptions={managerOptions}
          staffOptions={staffOptions}
          imagePreview={imagePreview}
          onLogoChange={handleLogoChange}
          onFormChange={setFormData}
          onSubmit={(e) => handleSubmit(e, false)}
          onCancel={() => {
            setActivityToggle(false);
            resetForm();
          }}
          isLoading={isSubmitLoading}
          debouncedGetStaff={debouncedGetStaff}
        />
      </div>

      {/* Edit Team */}
      <div
        className={
          activityToggle2 ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <TeamForm
          title="Edit Team"
          formData={formData}
          companyOptions={companyOptions}
          branchOptions={branchOptions}
          managerOptions={managerOptions}
          staffOptions={staffOptions}
          imagePreview={imagePreview}
          onLogoChange={handleLogoChange}
          onFormChange={setFormData}
          onSubmit={(e) => handleSubmit(e, true)}
          onCancel={() => {
            setActivityToggle2(false);
            resetForm();
          }}
          isLoading={isSubmitLoading}
          debouncedGetStaff={debouncedGetStaff}
        />
      </div>

      {/* Delete Teams Modal */}
      <div className="modal custom-modal fade" id="delete_team" role="dialog">
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
                <h3>Remove Team?</h3>
                <p className="del-info">Are you sure you want to remove it.</p>
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
                    onClick={deleteTeam}
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Teams Modal */}


        <div
        className={
          activityToggle3 ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >

      <TeamMembers teamId={teamId} isLoading={isSubmitLoading} onCancel={() => {
            setActivityToggle3(false);
          }}/>
      </div>
    </Fragment>
  );
};

export default Teams;
