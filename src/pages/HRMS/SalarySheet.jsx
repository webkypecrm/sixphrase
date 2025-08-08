import React, { useState, useEffect, useRef, Fragment } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import CollapseHeader from "../../components/CollapseHeader/CollapseHeader";
import DataTable from "../../components/Table/DataTable";
import { all_routes } from "../Router/all_routes";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

const SalarySheet = ({
  salarySheetToggle,
  setSalarySheetToggle,
  payrollId,
}) => {
  const [editSalaryToggle, setEditSalaryToggle] = useState(false);
  const [salarySlipToggle, setSalarySlipToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [salarySheetData, setSalarySheetData] = useState([]);
  const [employSalaryData, setEmploySalaryData] = useState([]);
  const [staffId, setStaffId] = useState("");
    const [formData, setFormData] = useState({
      salery: "",
      numberOfDaysInMonth: "",
      totalWorkingDays: "",
      officialOff: "",
      totalPresent: "",
      totalLeave: "",
      // paid: "",
      unpaidLeave: "",
      daysToBePaid: "",
      incentive: "",
      loan: "",
      deductionAmount: "",
      // balLoan: "",
      totalSalery: "",
    });

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  // get salarySheet
  const getSalarySheetData = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/staff/salarySheetList-by-salary-sheet-id?id=${payrollId}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      setSalarySheetData(res?.data?.data);
      console.log("DATAA", res?.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    if (payrollId) {
      getSalarySheetData();
    }
  }, [payrollId]);
  console.log("salarySheetData", salarySheetData);

  // get employ salary by id
  const getEmploySalaryData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/salarySheetList-by-salary-sheet-entry-id?id=${staffId}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      })

      setEmploySalaryData(res?.data?.data);
      console.log("employSalary", res?.data?.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
      
    }
  }

  useEffect(() => {
    if (staffId) {
      getEmploySalaryData();
    }
  }, [staffId]);

  // update salarySheet
    useEffect(() => {
      if (employSalaryData) {
        setFormData({
          monthlySalery: employSalaryData.monthlySalery,
          numberOfDaysInMonth: employSalaryData.numberOfDaysInMonth,
          totalWorkingDays: employSalaryData.totalWorkingDays,
          officialOff: employSalaryData.officialOff ,
          totalPresent: employSalaryData.totalPresent,
          totalLeave: employSalaryData.totalLeave,
          // paid: employSalaryData.paid,
          unpaidLeave: employSalaryData.unpaidLeave,
          daysToBePaid: employSalaryData.daysToBePaid,
          salery: employSalaryData.salery,
          incentive: employSalaryData.incentive,
          loan: employSalaryData.loan,
          deductionAmount: employSalaryData.deductionAmount,
          // balLoan: employSalaryData.balLoan,
          totalSalery: employSalaryData.totalSalery,
        });
      }
    }, [employSalaryData]);

    // handler
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    };

// auto calculate salary
  useEffect(() => {
  const salery = parseFloat(formData.salery) || 0;
  const incentive = parseFloat(formData.incentive) || 0;
  const deduction = parseFloat(formData.deductionAmount) || 0;

  const calculatedSalary = (salery + incentive) - deduction;

  setFormData((prevForm) => ({
    ...prevForm,
    totalSalery: calculatedSalary, // rounded to 2 decimals
  }));
}, [formData.salery, formData.incentive, formData.deductionAmount]);




    // post Api
    const updateSalarySheet = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const submitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      try {
        const res = await axios.post(`${apiUrl}/staff/updateSalarySheet?id=${staffId}`, submitData, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        toast.success(res?.data?.message);
        setIsLoading(false);
        setEditSalaryToggle(false);
        getSalarySheetData(); 
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message);
        setIsLoading(false);
      }
      
    }

 


  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <ul>
          <li>
            <Link to="#" className="table-avatar ">
              <Link to="#" className="profile-split d-flex flex-column">
                ID : {record.staffId}
              </Link>
            </Link>
          </li>
        </ul>
      ),
    },
    {
      // title: "Employee Name",
      title: (
        <>
          Employee
          <br />
          Name
        </>
      ),
      dataIndex: "name",
      render: (text, record) => (
        <ul>
          <li>{record.name}</li>
        </ul>
      ),
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Monthly Salary ",
      dataIndex: "salary",
      render: (text, record) => (
        <ul>
          <li>{record.monthlySalery}</li>
        </ul>
      ),
      // sorter: (a, b) => a.phone.length - b.phone.length,
    },
    {
      title: "Month Days",
      dataIndex: "mdays",
      render: (text, record) => (
        <ul>
          <li>{record.numberOfDaysInMonth}</li>
        </ul>
      ),
    },
    {
      title: "Working Days",
      dataIndex: "wdays",
      render: (text, record) => (
        <ul>
          <li>{record.totalWorkingDays}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Official OFF",
      dataIndex: "off",
      render: (text, record) => (
        <ul>
          <li>{record.officialOff}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Total Present",
      dataIndex: "present",
      render: (text, record) => (
        <ul>
          <li>{record.totalPresent}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Leave Taken",
      dataIndex: "leave",
      render: (text, record) => (
        <ul>
          <li>{record.totalLeave}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Paid Leave",
      dataIndex: "pleave",
      render: (text, record) => (
        <ul>
          <li>Na</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Unpaid Leave",
      dataIndex: "uleave",
      render: (text, record) => (
        <ul>
          <li>{record.unpaidLeave}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Days Paid",
      dataIndex: "paidDays",
      render: (text, record) => (
        <ul>
          <li>{record.daysToBePaid}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Calculate Salary",
      dataIndex: "calcSalary",
      render: (text, record) => (
        <ul>
          <li>{record.salery}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Incentive Given",
      dataIndex: "incentive",
      render: (text, record) => (
        <ul>
          <li>{record.incentive}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Loan Given",
      dataIndex: "loan",
      render: (text, record) => (
        <ul>
          <li>{record.loan}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Deduction Applied",
      dataIndex: "deduction",
      render: (text, record) => (
        <ul>
          <li>{record.deductionAmount}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Bal Loan",
      dataIndex: "balLoan",
      render: (text, record) => (
        <ul>
          <li>Na</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Payable salary",
      dataIndex: "PayableSalary",
      render: (text, record) => (
        <ul>
          <li>{record.totalSalery}</li>
        </ul>
      ),

      // sorter: (a, b) => a.tags.length - b.tags.length,
    },
    {
      title: "Action",
      render: (text, record, index) => (
        <div className="social-links d-flex align-items-center" key={index}>
          <li>
            <Link
              className=""
              to="#"
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Edit Salary Sheet"
              onClick={() =>{setEditSalaryToggle(true),setStaffId(record.id)}}
            >
              <i className="ti ti-edit me-2" />
            </Link>
          </li>
          <li>
            <Link
              to={"/hrms/salary-slip"}
              target="_blank"
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="View Salary Slip"
              onClick={() => {
                // ReactTooltip.hide();
                // setSalarySheetToggle(true);
                // setLeadDetails((prev) => ({ ...record }));
              }}
            >
              <i className=" ti ti-eye me-2"></i>
            </Link>
          </li>

          <Tooltip id={`tooltip-${index}`} place="top" />
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <div
        className={
          salarySheetToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout" style={{ maxWidth: "95%" }}>
          <div className="sidebar-header">
            <h4>July Salary Sheet</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setSalarySheetToggle(false)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>

          <div className="toggle-body">
            {/* Contact List */}
            <div className="table-responsive custom-table">
              <DataTable
                columns={columns}
                dataSource={salarySheetData}
                disableSelection={true}
              />
            </div>
            {/* Submit Buttons */}
            <div className="submit-button text-end mt-3">
              <Link
                to="#"
                className="btn btn-light sidebar-close me-2"
                onClick={() => setSalarySheetToggle(false)}
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Salary */}
      <div
        className={
          editSalaryToggle ? "toggle-popup sidebar-popup" : "toggle-popup"
        }
      >
        <div className="sidebar-layout" style={{ maxWidth: "50%" }}>
          <div className="sidebar-header">
            <h4>Edit Salary Sheet</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={() => setEditSalaryToggle(false)}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <form onSubmit={updateSalarySheet} className="toggle-height">
              <div className="pro-create">
                <div className="accordion-lists">
                  <div className="user-accordion-item">
                    <div
                      className="accordion-collapse collapse show"
                      // id="basic"
                      // data-bs-parent="#list-accord"
                    >
                      <div
                        className="content-collapse"
                        style={{ borderTop: "none" }}
                      >
                        <div className="row">
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Monthly Salary{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="salery"
                                value={formData.monthlySalery}
                                // onChange={handleInputChange}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Days Month{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="numberOfDaysInMonth"
                                value={formData.numberOfDaysInMonth}
                                // onChange={handleInputChange}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Working Days{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="totalWorkingDays"
                                value={formData.totalWorkingDays}
                                // onChange={handleInputChange}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Official OFF{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="officialOff"
                                value={formData.officialOff}
                                // onChange={handleInputChange}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Total Present{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="totalPresent"
                                value={formData.totalPresent}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Leave Taken{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="totalLeave"
                                value={formData.totalLeave}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Paid Leave{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                // name="paid"
                                // value={formData.paid}
                                // onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Unpaid Leave{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="unpaidLeave"
                                value={formData.unpaidLeave}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Days Paid{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="daysToBePaid"
                                value={formData.daysToBePaid}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Calculate Salary{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="salery"
                                value={formData.salery}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Incentive Given{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="incentive"
                                value={formData.incentive}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Loan Given{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="loan"
                                value={formData.loan}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Deduction Applied{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="deductionAmount"
                                value={formData.deductionAmount}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Bal Loan{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                // name="balLoan"
                                // value={formData.balLoan}
                                // onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="form-wrap">
                              <label className="col-form-label">
                                Payable salary{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="totalSalery"
                                value={formData.totalSalery}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Submit Buttons */}
              <div className="submit-button text-end mt-3">
                <Link
                  to="#"
                  className="btn btn-light sidebar-close me-2"
                  onClick={() => setEditSalaryToggle(false)}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Edit Salart */}
    </Fragment>
  );
};

export default SalarySheet;
