import React from 'react'
import { Link } from 'react-router-dom'


const ManageColumns = ({ handleManageColumns, manageColumns, manageColumnsSlider, setManageColumnsSlider }) => {
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
            <ul >
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Task ID
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-id"
                    className="check"
                    checked={manageColumns['Task ID']}
                    onChange={() => handleManageColumns('Task ID')}
                  />
                  <label
                    htmlFor="col-task-id"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Title
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-title"
                    className="check"
                    checked={manageColumns['Title']}
                    onChange={() => handleManageColumns('Title')}
                  />
                  <label
                    htmlFor="col-task-title"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Type
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-type"
                    className="check"
                    checked={manageColumns['Type']}
                    onChange={() => handleManageColumns('Type')}
                  />
                  <label
                    htmlFor="col-task-type"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Description
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-description"
                    className="check"
                    checked={manageColumns['Description']}
                    onChange={() => handleManageColumns('Description')}
                  />
                  <label
                    htmlFor="col-task-description"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Category
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-category"
                    className="check"
                    checked={manageColumns['Category']}
                    onChange={() => handleManageColumns('Category')}
                  />
                  <label
                    htmlFor="col-task-category"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Sub Category
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-sub-category"
                    className="check"
                    checked={manageColumns['Sub Category']}
                    onChange={() => handleManageColumns('Sub Category')}
                  />
                  <label
                    htmlFor="col-sub-category"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Assigned By
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-assigned-by"
                    className="check"
                    checked={manageColumns['Assigned By']}
                    onChange={() => handleManageColumns('Assigned By')}
                  />
                  <label
                    htmlFor="col-task-assigned-by"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Start Date
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-start-date"
                    className="check"
                    checked={manageColumns['Start Date']}
                    onChange={() => handleManageColumns('Start Date')}
                  />
                  <label
                    htmlFor="col-task-start-date"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  End Date
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-end-date"
                    className="check"
                    checked={manageColumns['End Date']}
                    onChange={() => handleManageColumns('End Date')}
                  />
                  <label
                    htmlFor="col-task-end-date"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Assigned To
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-assigned-to"
                    className="check"
                    checked={manageColumns['Assigned To']}
                    onChange={() => handleManageColumns('Assigned To')}
                  />
                  <label
                    htmlFor="col-task-assigned-to"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Priority
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-priority"
                    className="check"
                    checked={manageColumns['Priority']}
                    onChange={() => handleManageColumns('Priority')}
                  />
                  <label
                    htmlFor="col-task-priority"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Tags
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-tags"
                    className="check"
                    checked={manageColumns['Tags']}
                    onChange={() => handleManageColumns('Tags')}
                  />
                  <label
                    htmlFor="col-task-tags"
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
                    id="col-task-created-date"
                    className="check"
                    checked={manageColumns['Created Date']}
                    onChange={() => handleManageColumns('Created Date')}
                  />
                  <label
                    htmlFor="col-task-created-date"
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
                    id="col-task-status"
                    className="check"
                    checked={manageColumns['Status']}
                    onChange={() => handleManageColumns('Status')}
                  />
                  <label
                    htmlFor="col-task-status"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Attachment
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-task-attachment"
                    className="check"
                    checked={manageColumns['Attachment']}
                    onChange={() => handleManageColumns('Attachment')}
                  />
                  <label
                    htmlFor="col-task-attachment"
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
                    id="col-task-action"
                    className="check"
                    checked={manageColumns['Action']}
                    onChange={() => handleManageColumns('Action')}
                  />
                  <label
                    htmlFor="col-task-action"
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