import { Link } from 'react-router-dom'

const ManageColumns = ({ handleManageColumns, manageColumns, manageColumnsSlider, setManageColumnsSlider }) => {

    // console.log('manageColumns =>', manageColumns)

    return (
        <div className={`toggle-popup ${manageColumnsSlider ? "sidebar-popup" : ""}`}>
            <div className="sidebar-layout" style={{ maxWidth: '320px' }}>
                <div className="manage-dropdwon">
                    <div className="sidebar-header">
                        <h4>Manage Columns?</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => {
                                setManageColumnsSlider(false)
                            }}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="dropdown-menu dropdown-menu-md-end show" style={{ width: '100%' }} >
                        <ul>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Name
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-name"
                                        className="check"
                                        checked={manageColumns['Name']}
                                        onChange={() => handleManageColumns('Name')}
                                    />
                                    <label
                                        htmlFor="col-staff-name"
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
                                        id="col-staff-email"
                                        className="check"
                                        checked={manageColumns['Email']}
                                        onChange={() => handleManageColumns('Email')}
                                    />
                                    <label
                                        htmlFor="col-staff-email"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Mobile
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-mobile"
                                        className="check"
                                        checked={manageColumns['Mobile']}
                                        onChange={() => handleManageColumns('Mobile')}
                                    />
                                    <label
                                        htmlFor="col-staff-mobile"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Gender
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-gender"
                                        className="check"
                                        checked={manageColumns['Gender']}
                                        onChange={() => handleManageColumns('Gender')}
                                    />
                                    <label
                                        htmlFor="col-staff-gender"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Created By
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-created-by"
                                        className="check"
                                        checked={manageColumns['Created By']}
                                        onChange={() => handleManageColumns('Created By')}
                                    />
                                    <label
                                        htmlFor="col-staff-created-by"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Department
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-deparment"
                                        className="check"
                                        checked={manageColumns['Department']}
                                        onChange={() => handleManageColumns('Department')}
                                    />
                                    <label
                                        htmlFor="col-staff-deparment"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Role
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-role"
                                        className="check"
                                        checked={manageColumns['Role']}
                                        onChange={() => handleManageColumns('Role')}
                                    />
                                    <label
                                        htmlFor="col-staff-role"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Emergency Contact
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-emergency-contact"
                                        className="check"
                                        checked={manageColumns['Emergency Contact']}
                                        onChange={() => handleManageColumns('Emergency Contact')}
                                    />
                                    <label
                                        htmlFor="col-staff-emergency-contact"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Address
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-address"
                                        className="check"
                                        checked={manageColumns['Address']}
                                        onChange={() => handleManageColumns('Address')}
                                    />
                                    <label
                                        htmlFor="col-staff-address"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Group
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-group"
                                        className="check"
                                        checked={manageColumns['Group']}
                                        onChange={() => handleManageColumns('Group')}
                                    />
                                    <label
                                        htmlFor="col-staff-group"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Job Type
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-job-type"
                                        className="check"
                                        checked={manageColumns['Job Type']}
                                        onChange={() => handleManageColumns('Job Type')}
                                    />
                                    <label
                                        htmlFor="col-staff-job-type"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                            <li>
                                <p>
                                    <i className="ti ti-grip-vertical" />
                                    Work Shift
                                </p>
                                <div className="status-toggle">
                                    <input
                                        type="checkbox"
                                        id="col-staff-work-shift"
                                        className="check"
                                        checked={manageColumns['Work Shift']}
                                        onChange={() => handleManageColumns('Work Shift')}
                                    />
                                    <label
                                        htmlFor="col-staff-work-shift"
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
                                        id="col-staff-created-date"
                                        className="check"
                                        checked={manageColumns['Created Date']}
                                        onChange={() => handleManageColumns('Created Date')}
                                    />
                                    <label
                                        htmlFor="col-staff-created-date"
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
                                        id="col-staff-status"
                                        className="check"
                                        checked={manageColumns['Status']}
                                        onChange={() => handleManageColumns('Status')}
                                    />
                                    <label
                                        htmlFor="col-staff-status"
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
                                        id="col-staff-action"
                                        className="check"
                                        checked={manageColumns['Action']}
                                        onChange={() => handleManageColumns('Action')}
                                    />
                                    <label
                                        htmlFor="col-staff-action"
                                        className="checktoggle"
                                    />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageColumns 