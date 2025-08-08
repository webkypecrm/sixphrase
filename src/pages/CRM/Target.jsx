import React, { Fragment, useEffect, useState } from "react";
import { all_routes } from "../Router/all_routes";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
import DataTable from "../../components/Table/DataTable";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import axios from "axios";
import { toast } from "react-toastify";
// import { use } from "react";
// import TargetForm from "./Teams/TargetForm";
import Select from "react-select";

const Target = () => {
  const [targetData, setTargetData] = useState([]);
  const [memberTtargetData, setMemberTargetData] = useState([]);
  const [staffId, setStaffId] = useState(null);
  console.log("id", staffId);
  const [activityToggle, setActivityToggle] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";
  const route = all_routes;

  //  Get All Target
  const getAllTarget = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/product/team-members-of-all-team`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      console.log("first", res?.data?.data);
      // setTargetData(res?.data?.data?.map((item) => item));
      setTargetData(res?.data?.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getAllTarget();
  }, []);

  // get target Data by member id
  const getTarget = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/product/target-list?teamMemberId=${staffId}&month=&year=`,
        { headers: { Authorization: `Bearer ${Token}` } }
      );
      setMemberTargetData(res.data.data);

      console.log("allTarget", res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (!staffId) return;
    getTarget();
  }, [staffId]);

  // delete Target
  const deleteTarget = async () => {
    try {
      const res = await axios.delete(
        `${apiUrl}/product/delete-target/${staffId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
      toast.success(res.data.message);
      getAllTarget();
    } catch (error) {
      toast.error(err.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "staffId",
      render: (text, record) => (
        <Link to="#" className="table-avatar d-flex align-items-center">
          {record?.staff?.profilePic ? (
            <Link to="#" className="avatar">
              <img src={record?.staff?.profilePic} alt="UserImage" />
            </Link>
          ) : (
            <Link to="#" className="avatar bg-pending">
              <i className="ti ti-user" />
            </Link>
          )}
          <Link className="profile-split d-flex flex-column">
            {record?.staff?.name}
            {/* <span>id : {record.staff?.staffId}</span> */}
          </Link>
        </Link>
      ),
      sorter: (a, b) => a.staff?.name?.localeCompare(b.staff?.name),
    },
    {
      title: "Details",
      dataIndex: "details",
      render: (text, record) => (
        <div>
          <ul>
            <li>{record.staff?.department?.name || "-"}</li>
            <li>{record.staff?.role?.name || "-"}</li>
            <li>{record.staff?.group?.name || "-"}</li>
            <li>{record.staff?.jobType?.name || "-"}</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Team Name",
      dataIndex: "teamName",
      render: (text, record) => <span>{record?.team?.teamName}</span>,
    },
    {
      title: "Team Manager",
      dataIndex: "teamManager",
      render: (text, record) => (
        <ul>
          <li>
            <div>{record?.team?.teamManager?.name}</div>
          </li>
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
              data-tooltip-content="View Target"
              onClick={() => {
                setStaffId(record?.id), setActivityToggle(true);
              }}
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
          {/* <li>
            <Link
              className=""
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_target"
              onClick={() => setStaffId(record.id)}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Delete Target"
            >
              <i className="ti ti-trash text-danger me-2" />
            </Link>
          </li> */}

          {/* <li>
            <div className="status-toggle">
              <input
                type="checkbox"
                id={`disable-${index}`}
                className="check"
              />
              <label htmlFor={`disable-${index}`} className="checktoggle" />
            </div>
          </li> */}
          <Tooltip id={`tooltip-${index}`} place="top" />
        </div>
      ),
    },
  ];

  const ratingOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString(),
  }));

  const getQuarter = (month) => {
    const q1 = ["April", "May", "June"];
    const q2 = ["July", "August", "September"];
    const q3 = ["October", "November", "December"];
    const q4 = ["January", "February", "March"];
    if (q1.includes(month)) return "Q1";
    if (q2.includes(month)) return "Q2";
    if (q3.includes(month)) return "Q3";
    if (q4.includes(month)) return "Q4";
    return "";
  };

  const prepareTableData = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const quarter = getQuarter(item.month);
      const key = `${item.year}-${quarter}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });

    const sortedKeys = Object.keys(grouped).sort(); // sort by year-Q1..Q4
    const finalData = [];

    sortedKeys.forEach((key, index) => {
      const records = grouped[key];

      finalData.push(...records);

      const totalSalePrice = records.reduce(
        (sum, r) => sum + parseFloat(r.salePrice || 0),
        0
      );
      const totalSaleUnit = records.reduce(
        (sum, r) => sum + parseFloat(r.saleUnit || 0),
        0
      );

      finalData.push({
        isSummary: true,
        key: `summary-${key}`,
        quarter: key.split("-")[1],
        year: key.split("-")[0],
        salePrice: totalSalePrice,
        saleUnit: totalSaleUnit,
      });

      // ✅ Only insert header if there is a next quarter group
      if (index < sortedKeys.length - 1) {
        finalData.push({
          isSpacer: true,
          key: `spacer-${sortedKeys[index + 1]}`,
        });
        finalData.push({
          isHeader: true,
          key: `header-${sortedKeys[index + 1]}`,
        });
      }
    });

    return finalData;
  };

  const columns2 = [
    {
      title: "Month/Year",
      key: "monthYear",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? (
          <strong>Total</strong>
        ) : record.isHeader ? (
          <strong>Month/Year</strong>
        ) : (
          <span>
            {record?.month}-{record?.year}
          </span>
        ),
    },
    {
      title: "QTR",
      key: "qtr",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isHeader ? (
          <strong>Qtr</strong>
        ) : (
          <span>{record?.quarter || "-"}</span>
        ),
    },
    {
      title: "Sales Target",
      key: "target",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? (
          <strong>{record.salePrice}</strong>
        ) : record.isHeader ? (
          <strong>Sales Target</strong>
        ) : (
          <span>{record?.salePrice}</span>
        ),
    },
    {
      title: "Sales Unit",
      key: "unit",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? (
          <strong>{record.saleUnit}</strong>
        ) : record.isHeader ? (
          <strong>Sales Unit</strong>
        ) : (
          <span>{record?.saleUnit}</span>
        ),
    },
    {
      title: "Achievement",
      key: "achievement",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? (
          "0"
        ) : record.isHeader ? (
          <strong>Achievement</strong>
        ) : (
          record.staff?.email || "0"
        ),
    },
    {
      title: "Achieve Unit",
      key: "achieveUnit",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? (
          "0"
        ) : record.isHeader ? (
          <strong>Achieve Unit</strong>
        ) : (
          record.staff?.department?.name || "0"
        ),
    },
    {
      title: "Rating",
      width: 80,
      key: "rating",
      className: "text-end",
      render: (text, record) =>
        record.isSpacer ? (
          ""
        ) : record.isSummary ? null : record.isHeader ? (
          <strong>Rating</strong>
        ) : (
          <Select
            options={ratingOptions}
            placeholder="Select"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              container: (base) => ({
                ...base,
                width: 80,
                fontSize: "12px",
              }),
              control: (base) => ({
                ...base,
                minHeight: 25,
                height: 25,
                fontSize: "12px",
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: 25,
              }),
              valueContainer: (base) => ({
                ...base,
                height: 25,
                padding: "0 8px",
                fontSize: "12px",
              }),
              singleValue: (base) => ({
                ...base,
                fontSize: "12px",
              }),
              option: (base) => ({
                ...base,
                fontSize: "12px",
              }),
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
              }),
            }}
          />
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
                      Target<span className="count-title">{1}</span>
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
                            placeholder="Search Target"
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

                            {/* <li>
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
                                    </li> */}
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
                      dataSource={targetData}
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

      {/* show Target */}

      <div
        className={
          activityToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout" style={{ maxWidth: "72%" }}>
          <div
            className="sidebar-header"
            style={{ backgroundColor: "#2f5796", padding: "5px 20px" }}
          >
            <h6 style={{ color: "#fff" }}>Targets</h6>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setActivityToggle(false)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>

          <div className="toggle-body">
            {memberTtargetData && memberTtargetData.length > 0 && (
              <div className="row">
                <div className="col-md-2">
                  <div className="form-wrap mb-2">
                    <div className="profile-upload">
                      <div
                        className="profile-upload-img"
                        style={{ height: "70px",border:"none" }}
                      >
                        <img
                          src={memberTtargetData[0].profilePic}
                          alt="Preview"
                          style={{
                            borderRadius: "5px",
                            width: "80px",
                            height: "80px",
                            maxWidth: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-wrap">
                    <h5>
                      Name : {memberTtargetData[0]?.teamMember?.staff?.name}
                    </h5>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-wrap">
                    <h5>
                      Team Name :{" "}
                      {memberTtargetData[0]?.teamMember?.team?.teamName}
                    </h5>
                  </div>
                </div>
              </div>
            )}
            <div className="row mt-3 p-2">
              <div className="table-responsive custom-table-css target-table p-0 mb-4">
                <DataTable
                  dataSource={prepareTableData(memberTtargetData)}
                  columns={columns2}
                  disableSelection={true}
                  pagination={false}
                  rowClassName={(record) =>
                    record.isSummary
                      ? "table-summary-row"
                      : record.isHeader
                      ? "table-header-repeat table-header-spacing"
                      : ""
                  }
                />
              </div>
            </div>
            <div className="submit-button text-end">
              <Link
                to="#"
                className="btn btn-light sidebar-close"
                onClick={() => setActivityToggle(false)}
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* show Target */}

      {/* Delete Target Modal */}
      {/* <div className="modal custom-modal fade" id="delete_target" role="dialog">
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
                <h3>Remove Target?</h3>
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
                    onClick={deleteTarget}
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* Delete Target Modal */}
    </Fragment>
  );
};

export default Target;
