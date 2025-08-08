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
                  Lead Id 
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-lead_id"
                    className="check"
                    checked={manageColumns['Lead Id']}
                    onChange={() => handleManageColumns('Lead Id')}
                  />
                  <label
                    htmlFor="col-lead_id"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Lead Name
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-name"
                    className="check"
                    checked={manageColumns['Lead Name']}
                    onChange={() => handleManageColumns('Lead Name')}
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
                  Lead Email
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-email"
                    className="check"
                    checked={manageColumns['Lead Email']}
                    onChange={() => handleManageColumns('Lead Email')}
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
                  Lead Mobile1
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-mobile1"
                    className="check"
                    checked={manageColumns['Lead Mobile1']}
                    onChange={() => handleManageColumns('Lead Mobile1')}
                  />
                  <label
                    htmlFor="col-mobile1"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Lead Mobile2
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-mobile2"
                    className="check"
                    checked={manageColumns['Lead Mobile2']}
                    onChange={() => handleManageColumns('Lead Mobile2')}
                  />
                  <label
                    htmlFor="col-mobile2"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Lead Mobile3
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-mobile3"
                    className="check"
                    checked={manageColumns['Lead Mobile3']}
                    onChange={() => handleManageColumns('Lead Mobile3')}
                  />
                  <label
                    htmlFor="col-mobile3"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Company Name
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-mobile4"
                    className="check"
                    checked={manageColumns['Company Name']}
                    onChange={() => handleManageColumns('Company Name')}
                  />
                  <label
                    htmlFor="col-mobile4"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Requirement
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-leadFor"
                    className="check"
                    checked={manageColumns['Requirement']}
                    onChange={() => handleManageColumns('Requirement')}
                  />
                  <label
                    htmlFor="col-leadFor"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Industry
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-leadFor"
                    className="check"
                    checked={manageColumns['Industry']}
                    onChange={() => handleManageColumns('Industry')}
                  />
                  <label
                    htmlFor="col-leadFor"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Service
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-leadFor"
                    className="check"
                    checked={manageColumns['Service']}
                    onChange={() => handleManageColumns('Service')}
                  />
                  <label
                    htmlFor="col-leadFor"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Country
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-country"
                    className="check"
                    checked={manageColumns['Country']}
                    onChange={() => handleManageColumns('Country')}
                  />
                  <label
                    htmlFor="col-country"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  State
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-state"
                    className="check"
                    checked={manageColumns['State']}
                    onChange={() => handleManageColumns('State')}
                  />
                  <label
                    htmlFor="col-state"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  City
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-city"
                    className="check"
                    checked={manageColumns['City']}
                    onChange={() => handleManageColumns('City')}
                  />
                  <label
                    htmlFor="col-city"
                    className="checktoggle"
                  />
                </div>
              </li>
              {/* <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Company Name
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-company-name"
                    className="check"
                    checked={manageColumns['Company Name']}
                    onChange={() => handleManageColumns('Company Name')}
                  />
                  <label
                    htmlFor="col-company-name"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Company Email
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-company-email"
                    className="check"
                    checked={manageColumns['Company Email']}
                    onChange={() => handleManageColumns('Company Email')}
                  />
                  <label
                    htmlFor="col-company-email"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Company Location
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-company-location"
                    className="check"
                    checked={manageColumns['Company Location']}
                    onChange={() => handleManageColumns('Company Location')}
                  />
                  <label
                    htmlFor="col-company-location"
                    className="checktoggle"
                  />
                </div>
              </li> */}
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Source
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-source"
                    className="check"
                    checked={manageColumns['Source']}
                    onChange={() => handleManageColumns('Source')}
                  />
                  <label
                    htmlFor="col-source"
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
                    id="col-tags"
                    className="check"
                    checked={manageColumns['Tags']}
                    onChange={() => handleManageColumns('Tags')}
                  />
                  <label
                    htmlFor="col-tags"
                    className="checktoggle"
                  />
                </div>
              </li>
              {/* <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Value
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-value"
                    className="check"
                    checked={manageColumns['Value']}
                    onChange={() => handleManageColumns('Value')}
                  />
                  <label
                    htmlFor="col-value"
                    className="checktoggle"
                  />
                </div>
              </li> */}
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Owner
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-owner"
                    className="check"
                    checked={manageColumns['Owner']}
                    onChange={() => handleManageColumns('Owner')}
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
                  Assign To
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-assign-to"
                    className="check"
                    checked={manageColumns['Assign To']}
                    onChange={() => handleManageColumns('Assign To')}
                  />
                  <label
                    htmlFor="col-assign-to"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Updates
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-updates"
                    className="check"
                    checked={manageColumns['Updates']}
                    onChange={() => handleManageColumns('Updates')}
                  />
                  <label
                    htmlFor="col-updates"
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
                    id="col-created-date"
                    className="check"
                    checked={manageColumns['Created Date']}
                    onChange={() => handleManageColumns('Created Date')}
                  />
                  <label
                    htmlFor="col-created-date"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Stage
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-stage"
                    className="check"
                    checked={manageColumns['Stage']}
                    onChange={() => handleManageColumns('Stage')}
                  />
                  <label
                    htmlFor="col-stage"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Last Comment
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-last-comment"
                    className="check"
                    checked={manageColumns['Last Comment']}
                    onChange={() => handleManageColumns('Last Comment')}
                  />
                  <label
                    htmlFor="col-last-comment"
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
                    id="col-action"
                    className="check"
                    checked={manageColumns['Action']}
                    onChange={() => handleManageColumns('Action')}
                  />
                  <label
                    htmlFor="col-action"
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