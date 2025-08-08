import React from 'react'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../ImageWithBasePath'

const LeadItem = () => {
    return (
        <div className="kanban-list-items">
            <div className="kanban-list-head">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="kanban-title-head dot-warning">
                        <h5>Contacted</h5>
                        <span>45 Leads - $15,44,540</span>
                    </div>
                    <div className="kanban-action-btns d-flex align-items-center">
                        <Link to="#" className="plus-btn add-popup" onClick={() => togglePopup(false)}>
                            <i className="ti ti-plus" />
                        </Link>
                        <div className="dropdown table-action">
                            <Link
                                to="#"
                                className="action-icon dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fa fa-ellipsis-v" />
                            </Link>
                            <div className="dropdown-menu dropdown-menu-right">
                                <Link className="dropdown-item edit-popup" to="#" onClick={() => togglePopup(true)}>
                                    <i className="fa-solid fa-pencil text-blue" /> Edit
                                </Link>
                                <Link
                                    className="dropdown-item"
                                    to="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#delete_deal"
                                >
                                    <i className="fa-regular fa-trash-can text-danger" />{" "}
                                    Delete
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul className="kanban-drag-wrap">
                <li>
                    <div className="kanban-card">
                        <div className="kanban-card-head">
                            <span className="bar-design bg-warning" />
                            <div className="kanban-card-title">
                                <Link to="/leads-details">
                                    <span>SM</span>
                                </Link>
                                <h6>
                                    <Link to="/leads-details">Schumm</Link>
                                </h6>
                            </div>
                        </div>
                        <div className="kanban-card-body">
                            <ul>
                                <li>
                                    <i className="ti ti-report-money" />
                                    $03,50,000
                                </li>
                                <li>
                                    <i className="ti ti-mail" />
                                    darleeo@example.com
                                </li>
                                <li>
                                    <i className="ti ti-phone" />
                                    +1 12445-47878
                                </li>
                                <li>
                                    <i className="ti ti-map-pin-pin" />
                                    Newyork, United States
                                </li>
                            </ul>
                        </div>
                        <div className="kanban-card-footer d-flex align-items-center justify-content-between">
                            <span>
                                <ImageWithBasePath src="assets/img/icons/company-icon-09.svg" alt="" />
                            </span>
                            <ul className="icons-social">
                                <li>
                                    <Link to="#">
                                        <i className="ti ti-phone-check" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#">
                                        <i className="ti ti-message-circle-2" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#">
                                        <i className="ti ti-color-swatch" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li>
                    <div className="kanban-card">
                        <div className="kanban-card-head">
                            <span className="bar-design bg-success" />
                            <div className="kanban-card-title">
                                <Link to="/leads-details">
                                    <span>CS</span>
                                </Link>
                                <h6>
                                    <Link to="/leads-details">Collins</Link>
                                </h6>
                            </div>
                        </div>
                        <div className="kanban-card-body">
                            <ul>
                                <li>
                                    <i className="ti ti-report-money" />
                                    $02,10,000
                                </li>
                                <li>
                                    <i className="ti ti-mail" />
                                    robertson@example.com
                                </li>
                                <li>
                                    <i className="ti ti-phone" />
                                    +1 13987-90231
                                </li>
                                <li>
                                    <i className="ti ti-map-pin-pin" />
                                    Austin, United States
                                </li>
                            </ul>
                        </div>
                        <div className="kanban-card-footer d-flex align-items-center justify-content-between">
                            <span>
                                <ImageWithBasePath src="assets/img/icons/company-icon-01.svg" alt="" />
                            </span>
                            <ul className="icons-social">
                                <li>
                                    <Link to="#">
                                        <i className="ti ti-phone-check" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#">
                                        <i className="ti ti-message-circle-2" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#">
                                        <i className="ti ti-color-swatch" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li>
                    <div className="kanban-card">
                        <div className="kanban-card-head">
                            <span className="bar-design bg-danger" />
                            <div className="kanban-card-title">
                                <Link to="/leads-details">
                                    <span>KI</span>
                                </Link>
                                <h6>
                                    <Link to="/leads-details">Konopelski</Link>
                                </h6>
                            </div>
                        </div>
                        <div className="kanban-card-body">
                            <ul>
                                <li>
                                    <i className="ti ti-report-money" />
                                    $02,18,000
                                </li>
                                <li>
                                    <i className="ti ti-mail" />
                                    sharon@example.com
                                </li>
                                <li>
                                    <i className="ti ti-phone" />
                                    +1 17932-04278
                                </li>
                                <li>
                                    <i className="ti ti-map-pin-pin" />
                                    Atlanta, United States
                                </li>
                            </ul>
                        </div>
                        <div className="kanban-card-footer d-flex align-items-center justify-content-between">
                            <span>
                                <ImageWithBasePath src="assets/img/icons/company-icon-02.svg" alt="" />
                            </span>
                            <ul className="icons-social">
                                <li>
                                    <Link to="#">
                                        <i className="ti ti-phone-check" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#">
                                        <i className="ti ti-message-circle-2" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#">
                                        <i className="ti ti-color-swatch" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default LeadItem