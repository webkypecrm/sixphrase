import React, { useState } from "react";
import { ticketsData } from "../../data/ticketsData";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../Router/all_routes";
import {
    initialSettings,
    priority,
    statusOption,
} from "../../selectOption/selectOption";
import DateRangePicker from "react-bootstrap-daterangepicker";
import DatePicker from "react-datepicker";
import Select from "react-select";
import CollapseHeader from '../../components/CollapseHeader/CollapseHeader';
import DataTable from "../../components/Table/DataTable";
import 'react-datepicker/dist/react-datepicker.css';

const route = all_routes;

const Tickets = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDate2, setSelectedDate2] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    const handleDateChange2 = (date) => {
        setSelectedDate2(date);
    };

    const [sidebarPopup1, setSidebarPopup1] = useState(false);
    const [sidebarPopup2, setSidebarPopup2] = useState(false);

    const openSidebarPopup1 = () => {
        setSidebarPopup1(!sidebarPopup1);
    };

    const openSidebarPopup2 = () => {
        setSidebarPopup2(!sidebarPopup2);
    };

    const dataSource = ticketsData;
    const [stars, setStars] = useState({});

    const initializeStarsState = () => {
        const starsState = {};
        ticketsData.forEach((item, index) => {
            starsState[index] = false;
        });
        setStars(starsState);
    };

    React.useEffect(() => {
        initializeStarsState();
    }, []);

    const handleStarToggle = (index) => {
        setStars((prevStars) => ({
            ...prevStars,
            [index]: !prevStars[index],
        }));
    };
    const columns = [
        {
            title: "",
            dataIndex: "",
            render: (text, record, index) => (
                <div
                    className={`set-star rating-select ${stars[index] ? "filled" : ""}`}
                    onClick={() => handleStarToggle(index)}
                >
                    <i className="fa fa-star"></i>
                </div>
            ),
        },
        {
            title: "Ticket ID",
            dataIndex: "ticketId",
            key: "ticketId",
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
        },
        {
            title: "Assigned",
            dataIndex: "assigned",
            key: "assigned",
            render: (text, record) => (
                <h2 className="table-avatar d-flex align-items-center">
                    <Link to="#" className="avatar">
                        <ImageWithBasePath
                            className="avatar-img"
                            src={record.assignedAvatar}
                            alt="User Image"
                        />
                    </Link>
                    <Link to="#" className="profile-split d-flex flex-column">
                        {record.assignedName}
                    </Link>
                </h2>
            ),
        },
        {
            title: "Created On",
            // dataIndex: "createdOn",
            key: "createdOn",
        },
        {
            title: "Due Date",
            dataIndex: "dueDate",
            key: "dueDate",
        },
        {
            title: "Assignee",
            dataIndex: "assignee",
            key: "assignee",
            render: (text, record) => (
                <h2 className="table-avatar d-flex align-items-center">
                    <Link to="#" className="avatar">
                        <ImageWithBasePath
                            className="avatar-img"
                            src={record.assigneeAvatar}
                            alt="User Image"
                        />
                    </Link>
                    <Link to="#" className="profile-split d-flex flex-column">
                        {record.assigneeName} <span>{record.role} </span>
                    </Link>
                </h2>
            ),
        },
        {
            title: "Last Reply",
            dataIndex: "lastReply",
            key: "lastReply",
        },
        {
            title: "Priority",
            dataIndex: "priority",
            render: (text) => (
                <div>
                    {text === "Medium" && (
                        <span className="badge badge-tag badge-warning-light">
                            {text}
                        </span>
                    )}
                    {text === "Low" && (
                        <span className="badge badge-tag badge-purple-light">
                            {text}
                        </span>
                    )}
                    {text === "High" && (
                        <span className="badge badge-tag badge-danger-light">
                            {text}
                        </span>
                    )}

                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => (
                <div>
                    {text === "Resolved" && (
                        <span className="badge badge-pill badge-status bg-success">
                            {text}
                        </span>
                    )}
                    {text === "Closed" && (
                        <span className="badge badge-pill badge-status bg-info">
                            {text}
                        </span>
                    )}
                    {text === "Pending" && (
                        <span className="badge badge-pill badge-status bg-warning">
                            {text}
                        </span>
                    )}
                    {text === "Open" && (
                        <span className="badge badge-pill badge-status bg-danger">
                            {text}
                        </span>
                    )}

                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: () => (
                <div className="dropdown table-action">
                    <Link
                        to="#"
                        className="action-icon"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="fa fa-ellipsis-v"></i>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                        <Link
                            className="dropdown-item edit-popup"
                            to="#"
                            onClick={openSidebarPopup2}
                        >
                            <i className="ti ti-edit text-blue"></i> Edit
                        </Link>
                        <Link
                            className="dropdown-item"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_contact"
                        >
                            <i className="ti ti-trash text-danger"></i> Delete
                        </Link>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div>
            {/* Page Wrapper */}
            <div className="page-wrapper">
                <div className="content">
                    <div className="row">
                        <div className="col-md-12">
                            {/* Page Header */}
                            <div className="page-header">
                                <div className="row align-items-center">
                                    <div className="col-8">
                                        <h4 className="page-title">
                                            Tickets<span className="count-title">123</span>
                                        </h4>
                                    </div>
                                    <div className="col-4 text-end">
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
                                            <div className="col-md-5 col-sm-4">
                                                <div className="form-wrap icon-form">
                                                    <span className="form-icon">
                                                        <i className="ti ti-search" />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search User"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-7 col-sm-8">
                                                <div className="export-list text-sm-end">
                                                    <ul>
                                                        <li>
                                                            <div className="export-dropdwon">
                                                                <Link
                                                                    to="#"
                                                                    className="dropdown-toggle"
                                                                    data-bs-toggle="dropdown"
                                                                >
                                                                    <i className="ti ti-package-export" />
                                                                    Export
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
                                                            <Link
                                                                to="#"
                                                                className="btn btn-primary add-popup"
                                                                onClick={openSidebarPopup1}
                                                            >
                                                                <i className="ti ti-square-rounded-plus" />
                                                                Add Tickets
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Search */}
                                    {/* Filter */}
                                    <div className="filter-section filter-flex">
                                        <div className="sortby-list">
                                            <ul>
                                                <li>
                                                    <div className="sort-dropdown drop-down">
                                                        <Link
                                                            to="#"
                                                            className="dropdown-toggle"
                                                            data-bs-toggle="dropdown"
                                                        >
                                                            <i className="ti ti-sort-ascending-2" />
                                                            Sort{" "}
                                                        </Link>
                                                        <div className="dropdown-menu  dropdown-menu-start">
                                                            <ul>
                                                                <li>
                                                                    <Link to="#">
                                                                        <i className="ti ti-circle-chevron-right" />
                                                                        Ascending
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link to="#">
                                                                        <i className="ti ti-circle-chevron-right" />
                                                                        Descending
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link to="#">
                                                                        <i className="ti ti-circle-chevron-right" />
                                                                        Recently Viewed
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <Link to="#">
                                                                        <i className="ti ti-circle-chevron-right" />
                                                                        Recently Added
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="form-wrap icon-form">
                                                        <span className="form-icon">
                                                            <i className="ti ti-calendar" />
                                                        </span>
                                                        <DateRangePicker initialSettings={initialSettings}>
                                                            <input
                                                                className="form-control  date-range bookingrange"
                                                                type="text"
                                                            />
                                                        </DateRangePicker>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="filter-list">
                                            <ul>
                                                <li>
                                                    <div className="manage-dropdwon">
                                                        <Link
                                                            to="#"
                                                            className="btn btn-purple-light"
                                                            data-bs-toggle="dropdown"
                                                            data-bs-auto-close="false"
                                                        >
                                                            <i className="ti ti-columns-3" />
                                                            Manage Columns
                                                        </Link>
                                                        <div className="dropdown-menu  dropdown-menu-md-end">
                                                            <h4>Want to manage datatables?</h4>
                                                            <p>
                                                                Please drag and drop your column to reorder your
                                                                table and enable see option as you want.
                                                            </p>
                                                            <ul>
                                                                <li>
                                                                    <p>
                                                                        <i className="ti ti-grip-vertical" />
                                                                        Ticket ID
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
                                                                        Subject
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
                                                                        Assigned
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
                                                                        Assigned Date
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
                                                                        Assignee
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
                                                                            defaultChecked
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
                                                    <div className="form-sorts dropdown">
                                                        <Link
                                                            to="#"
                                                            data-bs-toggle="dropdown"
                                                            data-bs-auto-close="false"
                                                        >
                                                            <i className="ti ti-filter-share" />
                                                            Filter
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
                                                                            <Link to="#" className="btn btn-light">
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
                                            </ul>
                                        </div>
                                    </div>
                                    {/* /Filter */}
                                    {/* Tickets List */}
                                    <div className="table-responsive custom-table">
                                        <DataTable columns={columns} dataSource={dataSource} />
                                    </div>
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="datatable-length" />
                                        </div>
                                        <div className="col-md-6">
                                            <div className="datatable-paginate" />
                                        </div>
                                    </div>
                                    {/* /Tickets List */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Page Wrapper */}
            {/* Add User */}
            <div className={`toggle-popup ${sidebarPopup1 ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Add New Ticket</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={openSidebarPopup1}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <form className="toggle-height">
                            <div className="pro-create">
                                <div className="accordion-lists" id="list-accord">
                                    {/* Basic Info */}
                                    <div className="manage-user-modal">
                                        <div className="manage-user-modals">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {" "}
                                                            Subject <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Assigned Name{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Created Date{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <div className="cal-icon cal-icon-info">
                                                            <input
                                                                type="text"
                                                                className="datetimepicker form-control"
                                                                placeholder="Select Date"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Due Date <span className="text-danger">*</span>
                                                        </label>
                                                        <div className="cal-icon cal-icon-info">
                                                            <input
                                                                type="text"
                                                                className="datetimepicker form-control"
                                                                placeholder="Select Date"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Assignee Name{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Priority <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            className="select"
                                                            options={priority}
                                                            placeholder="Choose"
                                                            classNamePrefix="react-select"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Status<span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            className="select"
                                                            options={statusOption}
                                                            placeholder="Closed"
                                                            classNamePrefix="react-select"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Basic Info */}
                                </div>
                            </div>
                            <div className="submit-button text-end">
                                <Link to="#" className="btn btn-light sidebar-close">
                                    Cancel
                                </Link>
                                <button type="submit" className="btn btn-primary">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* /Add User */}
            {/* Edit User */}
            <div className={`toggle-popup1 ${sidebarPopup2 ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>Edit Tickets</h4>
                        <Link
                            to="#"
                            className="sidebar-close1 toggle-btn"
                            onClick={openSidebarPopup2}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <form className="toggle-height">
                            <div className="pro-create">
                                <div className="accordion-lists" id="list-accords">
                                    {/* Basic Info */}
                                    <div className="manage-user-modal">
                                        <div className="manage-user-modals">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            {" "}
                                                            Subject <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            defaultValue="Support for theme"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Assigned Name{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            defaultValue="Richard"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Created Date{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <div className="cal-icon cal-icon-info">
                                                            <DatePicker
                                                                className="form-control datetimepicker deals-details"
                                                                selected={selectedDate}
                                                                onChange={handleDateChange}
                                                                dateFormat="dd-MM-yyyy"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Due Date <span className="text-danger">*</span>
                                                        </label>
                                                        <div className="cal-icon cal-icon-info">
                                                            <DatePicker
                                                                className="form-control datetimepicker deals-details"
                                                                selected={selectedDate2}
                                                                onChange={handleDateChange2}
                                                                dateFormat="dd-MM-yyyy"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Assignee Name{" "}
                                                            <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            defaultValue="Darlee Robertson"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Priority <span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            className="select"
                                                            options={priority}
                                                            placeholder="Choose"
                                                            classNamePrefix="react-select"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-wrap">
                                                        <label className="col-form-label">
                                                            Status<span className="text-danger">*</span>
                                                        </label>
                                                        <Select
                                                            className="select"
                                                            options={statusOption}
                                                            placeholder="Closed"
                                                            classNamePrefix="react-select"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /Basic Info */}
                                </div>
                            </div>
                            <div className="submit-button text-end">
                                <Link to="#" className="btn btn-light sidebar-close1">
                                    Cancel
                                </Link>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* /Edit User */}
            {/* Delete User */}
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
                                <h3>Remove Tickets</h3>
                                <p className="del-info">Are you sure you want to remove it.</p>
                                <div className="col-lg-12 text-center modal-btn">
                                    <Link
                                        to="#"
                                        className="btn btn-light"
                                        data-bs-dismiss="modal"
                                    >
                                        Cancel
                                    </Link>
                                    <Link to={route.tickets} className="btn btn-danger">
                                        Yes, Delete it
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Delete User */}
        </div>
    );
};

export default Tickets;
