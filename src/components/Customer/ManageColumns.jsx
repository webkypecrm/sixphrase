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
            <ul>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Customer Name
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-name"
                    className="check"
                    checked={manageColumns['Customer Name']}
                    onChange={() => handleManageColumns('Customer Name')}
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
                  Customer Email
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-email"
                    className="check"
                    checked={manageColumns['Customer Email']}
                    onChange={() => handleManageColumns('Customer Email')}
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
                  Customer Mobile1
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-mobile1"
                    className="check"
                    checked={manageColumns['Customer Mobile1']}
                    onChange={() => handleManageColumns('Customer Mobile1')}
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
                  Customer Mobile2
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-mobile2"
                    className="check"
                    checked={manageColumns['Customer Mobile2']}
                    onChange={() => handleManageColumns('Customer Mobile2')}
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
                  Customer Mobile3
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-mobile3"
                    className="check"
                    checked={manageColumns['Customer Mobile3']}
                    onChange={() => handleManageColumns('Customer Mobile3')}
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
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Created By
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-owner"
                    className="check"
                    checked={manageColumns['Created By']}
                    onChange={() => handleManageColumns(' Created By')}
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
                  Assigned To
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-assign-staff"
                    className="check"
                    checked={manageColumns['Assigned To']}
                    onChange={() => handleManageColumns('Assigned To')}
                  />
                  <label
                    htmlFor="col-assign-staff"
                    className="checktoggle"
                  />
                </div>
              </li>
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
                  Requirement
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-tags3"
                    className="check"
                    checked={manageColumns['Requirement']}
                    onChange={() => handleManageColumns('Requirement')}
                  />
                  <label
                    htmlFor="col-tags3"
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
                    id="col-tags0"
                    className="check"
                    checked={manageColumns['Service']}
                    onChange={() => handleManageColumns('Service')}
                  />
                  <label
                    htmlFor="col-tags0"
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
                    id="col-tags1"
                    className="check"
                    checked={manageColumns['Industry']}
                    onChange={() => handleManageColumns('Industry')}
                  />
                  <label
                    htmlFor="col-tags1"
                    className="checktoggle"
                  />
                </div>
              </li>
              {/* <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Total Estimate Cost
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-total-estimate-cost"
                    className="check"
                    checked={manageColumns['Total Estimate Cost']}
                    onChange={() => handleManageColumns('Total Estimate Cost')}
                  />
                  <label
                    htmlFor="col-total-estimate-cost"
                    className="checktoggle"
                  />
                </div>
              </li> */}
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
                  Total Amount
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-total-amount"
                    className="check"
                    checked={manageColumns['Total Amount']}
                    onChange={() => handleManageColumns('Total Amount')}
                  />
                  <label
                    htmlFor="col-total-amount"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                  Total Paid
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-total-paid"
                    className="check"
                    checked={manageColumns['Total Paid']}
                    onChange={() => handleManageColumns('Total Paid')}
                  />
                  <label
                    htmlFor="col-total-paid"
                    className="checktoggle"
                  />
                </div>
              </li>
              <li>
                <p>
                  <i className="ti ti-grip-vertical" />
                 Total Due
                </p>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id="col-total-due"
                    className="check"
                    checked={manageColumns['Total Due']}
                    onChange={() => handleManageColumns('Total Due')}
                  />
                  <label
                    htmlFor="col-total-due"
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