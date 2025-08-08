import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import DataTable from "../Table/DataTable.jsx";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
// import ContentLoader from "../Layouts/ContentLoader/Index.jsx";
// import ErrorLoader from "../Layouts/ErrorLoader.jsx/Index.jsx";
import DeleteData from "../DeleteData/DeleteData.jsx";
import { toast } from "react-toastify";
import { all_routes } from "../../pages/Router/all_routes.jsx";
import { render } from "@testing-library/react";
import Scrollbars from "react-custom-scrollbars-2";
import { Tooltip } from "react-tooltip";

import { useContext } from "react";
// import { RefreshContext } from "../../context/RefreshContaxt.jsx";
import { AuthContext } from "../../context/AuthProvider.jsx";
import UploadeKYC from "./UploadeKYC.jsx";

const ManageStaffList = ({
  togglePopup,
  setStaffDetails,
  data,
  setData,
  handleRefreshData,
  manageColumns,
  pageSize,
  totalPages,
  fetchData,
  staffData,
  staffDetails,
}) => {
  const [stars, setStars] = useState({});
  const [staffId, setStaffId] = useState(null);
  const [adduser, setAddUser] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [kycToggle, setKycToggle] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    Dashboard: false,
    Setup: false,
  });

  console.log("DATA", data);

  // const { refresh, setRefresh } = useContext(RefreshContext);
  const { getStaff } = useContext(AuthContext);

  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const handleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const initializeStarsState = () => {
    const starsState = {};
    data.forEach((item, index) => {
      starsState[index] = false;
    });
    setStars(starsState);
  };

  const handleDelete = async () => {
    if (staffId) {
      try {
        await axios.delete(`${apiUrl}/staff/delete/${staffId}`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });
        handleRefreshData();
        toast.success("Staff deleted successfully!");
        setStaffId(null);
      } catch (error) {
        console.log(error);
        // toast.error(error.message)

        if (error.response) {
          // Server responded with a status code outside 2xx
          console.error("Error Response:", error.response.data);
          toast.error(
            `${error.response.data.message || "Something went wrong!"}`
          );
        } else if (error.request) {
          // Request was made but no response received
          console.error("No Response:", error.request);
          toast.error("No response from server. Please try again later.");
        } else {
          // Other errors
          console.error("Error Message:", error.message);
          toast.error(`${error.message}`);
        }
      }
    }
  };

  console.log("staffDetails", staffDetails);

  const route = all_routes;
  const handleStarToggle = (index) => {
    setStars((prevStars) => ({
      ...prevStars,
      [index]: !prevStars[index],
    }));
  };

  const handleFetchData = (page) => {
    handleRefreshData(page);
  };
  const { id } = useParams();
  const columns = [
    {
      title: "Employee",
      dataIndex: "name",
      key: "staffId",
      render: (text, record) => (
        <div className="d-flex">
          <Link to="#" className="table-avatar d-flex align-items-center">
            {record?.profilePic ? (
              <Link to="#" className="avatar">
                <img src={record.profilePic} alt="UserImage" />
              </Link>
            ) : (
              <Link to="#" className="avatar bg-pending">
                <i className="ti ti-user" />
              </Link>
            )}
          </Link>

          <ul>
     
            <li>Eid : {record.staffId}</li>
            <li style={{ height: "20px" }}>   
              <Link
                to={`${route.staffmanage}/${record.staffId}`}
                className="profile-split d-flex flex-column leade-name-hover"
              >
                <strong>{record.name}</strong>
                
              </Link>
              </li>
            <li>{record.email}</li>
            <li>{record.mobile}</li>
          </ul>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "staffId",
      render: (text, record) => (
        <div>
          <Link to="#" className="table-avatar d-flex align-items-center mb-2">
            <Link to={""} className="profile-split d-flex flex-column">
              {record?.userCompany?.companyName}
            </Link>
          </Link>
          <Link to="#" className="table-avatar d-flex align-items-center">
            <Link to={"#"} className="profile-split d-flex flex-column">
              {record?.companyBranch?.name}
            </Link>
          </Link>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    // {
    //   title: "Branch",
    //   dataIndex: "branch",
    //   key: "staffId",
    //   render: (text, record) => (
    //     <Link to="#" className="table-avatar d-flex align-items-center">
    //       <Link to={"#"} className="profile-split d-flex flex-column">
    //         {record?.companyBranch?.name}
    //       </Link>
    //     </Link>
    //   ),
    //   sorter: (a, b) => a.name.localeCompare(b.name),
    // },
    // {
    //   title: "Mobile",
    //   dataIndex: "mobile",
    //   key: "staffId",
    //   sorter: (a, b) => a.mobile.localeCompare(b.mobile),
    // },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "staffId",
    //   sorter: (a, b) => a.email.localeCompare(b.email),
    // },
    // {
    //   title: "Gender",
    //   dataIndex: "gender",
    //   key: "staffId",
    //   // sorter: true,
    // },
    // {
    //   title: "Created By",
    //   dataIndex: "createdBy",
    //   key: "staffId",
    //   // sorter: (a, b) => a.createdBy.localeCompare(b.createdBy),
    // },
    {
      title: "Onboard",
      dataIndex: "department",
      key: "staffId",
      render: (text, record) => (
        <ul>
          <li>
            {record.department}
          </li>
          <li>
            {record.role}
          </li>
          <li>
            {record.group}
          </li>
          <li>
            {record.jobType}
          </li>
          <li>
            {record.workShift}
          </li>
        </ul>
      )
      // sorter: true,
    },
    // {
    //   title: "Role",
    //   dataIndex: "role",
    //   key: "staffId",
    //   // sorter: true,
    // },
    // {
    //   title: "Emergency Contact",
    //   dataIndex: "emergencyContact",
    //   key: "staffId",
    //   // sorter: true,
    // },
    // {
    //   title: "Address",
    //   dataIndex: "address",
    //   key: "staffId",
    //   // sorter: true,
    // },

    // {
    //   title: "Group",
    //   dataIndex: "group",
    //   key: "staffId",
    //   // sorter: true,
    // },
    // {
    //   title: "Job Type",
    //   dataIndex: "jobType",
    //   key: "staffId",
    //   // sorter: true,
    // },
    // {
    //   title: "Work Shift",
    //   dataIndex: "workShift",
    //   key: "staffId",
    //   // sorter: true,
    // },
    {
      title: "Offer Letter",
      dataIndex: "onBoardingDate",
      key: "staffId",
      render: (text, record, index) => (
        <div>
          <div
            className="social-links d-flex align-items-center justify-content-center"
            key={index}
          >
            <Link
              to={`/hrms/generate-offer-latter/${record?.staffId}`}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Generate Offer Letter"
            >
              <i className="ti ti-square-rounded-plus text-blue me-2" />
            </Link>
            <Link
              to={`/hrms/generate-offer-latter/${record?.staffId}`}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="View Offer Letter"
            >
              <i className="ti ti-eye text-blue me-2" />
            </Link>
            <Link
              to={`/hrms/generate-offer-latter/${record?.staffId}`}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Download"
            >
              <i className="ti ti-download text-blue me-2" />
            </Link>
          </div>

          <Tooltip id={`tooltip-${index}`} place="top" />
        </div>
      ),
    },
    {
      title: "NDA",
      dataIndex: "onBoardingDate",
      key: "staffId",
      render: (text, record, index) => (
        <div>
          <div
            className="social-links d-flex align-items-center justify-content-center"
            key={index}
          >
            <Link
              to={`/hrms/generate-NDA/${record?.staffId}`}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Generate NDA"
            >
              <i className="ti ti-square-rounded-plus text-blue me-2" />
            </Link>
            <Link
              to={`/hrms/generate-NDA/${record?.staffId}`}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="View NDA"
            >
              <i className="ti ti-eye text-blue me-2" />
            </Link>
            <Link
              to={`/hrms/generate-NDA/${record?.staffId}`}
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Download"
            >
              <i className="ti ti-download text-blue me-2" />
            </Link>
          </div>

          <Tooltip id={`tooltip-${index}`} place="top" />
        </div>
      ),
    },
    {
      title: "KYC",
      dataIndex: "onBoardingDate",
      key: "staffId",
      render: (text, record, index) => (
        <div>
          <div
            className="social-links d-flex align-items-center justify-content-center"
            key={index}
          >
            <Link
              to="#"
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="Upload Documents"
              onClick={() => {
                setKycToggle(true), setStaffId(record.staffId);
              }}
            >
              <i className="ti ti-square-rounded-plus text-blue me-2" />
            </Link>
            <Link
              to="#"
              data-tooltip-id={`tooltip-${index}`}
              data-tooltip-content="View Documents"
            >
              <i className="ti ti-eye text-blue me-2" />
            </Link>
          </div>

          <Tooltip id={`tooltip-${index}`} place="top" />
        </div>
      ),
    },
    // {
    //   title: "Payroll",
    //   dataIndex: "onBoardingDate",
    //   key: "staffId",
    // },

    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record, index) => (
        // <div className="dropdown table-action">
        <div>
          {/* <Link
            to="#"
            className="action-icon "
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link> */}
          {staffData?.staffType === 1 && (
            //  <div className="dropdown-menu dropdown-menu-right">
            <div className="social-links d-flex align-items-center" key={index}>
              <Link
                // className="dropdown-item"
                to="#"
                data-tooltip-id={`tooltip-${index}`}
                data-tooltip-content="Edit Staff"
                onClick={() => {
                  togglePopup(true);
                  setStaffDetails(record);
                }}
              >
                <i className="ti ti-edit text-blue me-2" />
              </Link>
              <Link
                // className="dropdown-item"
                to="#"
                data-bs-toggle="modal"
                data-bs-target="#delete_contact"
                data-tooltip-id={`tooltip-${index}`}
                data-tooltip-content="Delete Staff"
                onClick={() => setStaffId(record.staffId)}
              >
                <i className="ti ti-trash text-danger me-2"></i>
              </Link>
              <Link
                // className="dropdown-item"
                to="#"
                data-tooltip-id={`tooltip-${index}`}
                data-tooltip-content="Add Permissions"
                onClick={() => {
                  setAddUser(true);
                  setStaffDetails(record);
                  setStaffId(record.staffId);
                }}
              >
                <i className="ti ti-lock text-green me-2" />
              </Link>
              <li>
                <div className="status-toggle">
                  <input
                    type="checkbox"
                    id={`disable-${index}`}
                    className="check"
                    defaultChecked={record.status === "active"}
                    readOnly
                  />
                  <label
                    htmlFor={`disable-${index}`}
                    className={`checktoggle ${
                      record.status === "active" ? "bg-success" : "bg-danger"
                    }`}
                  />
                </div>
              </li>
            </div>
          )}
          <Tooltip id={`tooltip-${index}`} place="top" />
        </div>
      ),
    },
    // {
    //   title: "Permissions",
    //   dataIndex: "Permissions",
    //   render: (text, record) => (
    //     <div className="export-list text-sm-end">
    //       <ul className="d-flex justify-content-center align-items-center flex-direction-column">
    //         <li className="mb-0">
    //           <button
    //             to="#"
    //             className="btn btn-primary add-popup"
    //             onClick={() => {
    //               setAddUser(true);
    //               setStaffDetails(record);
    //               setStaffId(record.staffId)
    //             }}
    //           >
    //             <i className="ti ti-square-rounded-plus" />
    //             Add Permissions
    //           </button>
    //         </li>
    //       </ul>
    //     </div>
    //   ),
    //   // sorter: true,
    // },
  ];

  // -------------------------------------PERMITIONS---------------------

  const [permissions, setPermissions] = useState([]);
  const [formPermissions, setFormPermissions] = useState([]);

  // Fetch staff's permissions when modal opens
  useEffect(() => {
    if (staffId) {
      const fetchPermissions = async () => {
        try {
          const res = await axios.get(
            `${apiUrl}/staff/staff-details/${staffId}`,
            {
              headers: {
                Authorization: `Bearer ${Token}`,
              },
            }
          );

          if (res.data.status === "success") {
            // const permissionData = res.data.data.Permissions;
            // console.log("first", permissionData)
            // const parsedPermissions = Array.isArray(permissionData)
            //   ? permissionData
            //   : JSON.parse(permissionData || "[]");

            // setPermissions(parsedPermissions);

            const permissionData = res.data.data.Permissions;
            let parsedPermissions = [];

            if (typeof permissionData === "string") {
              try {
                parsedPermissions = JSON.parse(permissionData);
              } catch (error) {
                console.error("Invalid permission string", permissionData);
              }
            } else if (Array.isArray(permissionData)) {
              parsedPermissions = permissionData;
            }

            setPermissions(parsedPermissions);
          }
        } catch (err) {
          console.error("Fetch staff error:", err);
          toast.error("Failed to fetch staff details");
        }
      };

      fetchPermissions();
    }
  }, [staffId, adduser]);

  // Toggle permission checkbox
  const handleCheckboxChange = (perm) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${apiUrl}/staff/edit-staff-permissions/${staffId}`,
        {
          Permissions: permissions.length ? JSON.stringify(permissions) : "[]",
        },
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      // handleRefreshData();

      toast.success("Permissions updated successfully!");
      fetchData();
      setAddUser(false);
      // setStaffDetails(null);
      // setPermissions([]);
      setTimeout(() => {
        setPermissions([]); // clear after modal is closed
        setStaffDetails(null);
      }, 200);
      //setRefresh(!refresh);
      getStaff();

      // ✅ Force page reload after successful update
      // window.location.reload();
    } catch (error) {
      console.log("API Error:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to update permissions"
      );
    }
  };

  const modifiedColumns = columns.filter((column, index) => {
    if (index == 0) {
      return column;
    }

    for (const ele in manageColumns) {
      if (column.title == ele && manageColumns[ele] == true) {
        return column;
      }
    }
  });

  useEffect(() => {
    initializeStarsState();
  }, []);

  const closePermission = () => {
    setAddUser(false); // 👈 Hide the sidebar
  };

  return (
    <>
      {data.length !== 0 && (
        <>
          <div className="table-responsive custom-table">
            <DataTable
              dataSource={data}
              columns={modifiedColumns}
              // onSelectionChange={handleSelectedRowKeysChange}
              pageSize={pageSize}
              totalPages={totalPages}
              onFetchRecord={handleFetchData}
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

          <DeleteData title="Staff" onDeleteHandler={handleDelete} />
        </>
      )}

      {/* Add Permission */}
      <div className={`toggle-popup ${adduser ? "sidebar-popup" : ""}`}>
        <div className="sidebar-layout" style={{ width: "350px" }}>
          <div className="sidebar-header">
            <h4>Add Permission</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={closePermission}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <div className="pro-create">
              <form onSubmit={handleSubmit}>
                <div
                  className="sidebar sidebar-fixed-css"
                  id="sidebar"
                  style={{ position: "unset" }}
                >
                  <div className="sidebar-inner slimscroll">
                    <div id="sidebar-menu" className="sidebar-menu p-0">
                      <ul>
                        <li>
                          <h6 className="submenu-hdr">Default Module</h6>
                          <ul>
                            {/* Dashboard */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["Dashboard"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenMenus({
                                    ...openMenus,
                                    Dashboard: !openMenus.Dashboard,
                                  });
                                }}
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>Dashboard</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        value="salesDashboard"
                                        checked={permissions.includes(
                                          "salesDashboard"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                        // onChange={(e) => {
                                        //   const value = e.target.value;
                                        //   setPermissions((prev) =>
                                        //     e.target.checked
                                        //       ? [...prev, value]
                                        //       : prev.filter(
                                        //           (item) => item !== value
                                        //         )
                                        //   );
                                        // }}
                                        onChange={() =>
                                          handleCheckboxChange("salesDashboard")
                                        }
                                      />
                                      Sales Dashboard
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </li>

                            {/* HRMS */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["HRMS"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenMenus({
                                    ...openMenus,
                                    HRMS: !openMenus.HRMS,
                                  });
                                }}
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>HRMS</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        value="Company"
                                        checked={permissions.includes(
                                          "Company"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() =>
                                          handleCheckboxChange("Company")
                                        }
                                      />
                                      Company
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={permissions.includes(
                                          "Branches"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() =>
                                          handleCheckboxChange("Branches")
                                        }
                                      />
                                      Branches
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={permissions.includes("Staff")}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() =>
                                          handleCheckboxChange("Staff")
                                        }
                                      />
                                      Staff
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={permissions.includes(
                                          "Payroll"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() =>
                                          handleCheckboxChange("Payroll")
                                        }
                                      />
                                      Payroll
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={permissions.includes(
                                          "Attendance"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() =>
                                          handleCheckboxChange("Attendance")
                                        }
                                      />
                                      Attendance
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </li>

                            {/* CRM */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["CRM"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>CRM</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={permissions.includes(
                                          "Teams"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                         onChange={() =>
                                          handleCheckboxChange("Teams")
                                        }
                                      />
                                      Teams
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={permissions.includes(
                                          "Targets"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                         onChange={() =>
                                          handleCheckboxChange("Targets")
                                        }
                                      />
                                      Targets
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={permissions.includes(
                                          "Leads"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                         onChange={() =>
                                          handleCheckboxChange("Leads")
                                        }
                                      />
                                      Leads
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={permissions.includes(
                                          "Meetings"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                         onChange={() =>
                                          handleCheckboxChange("Meetings")
                                        }
                                      />
                                      Meetings
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={permissions.includes(
                                          "Calls"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                         onChange={() =>
                                          handleCheckboxChange("Calls")
                                        }
                                      />
                                      Calls
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={permissions.includes(
                                          "toDoList"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                         onChange={() =>
                                          handleCheckboxChange("toDoList")
                                        }
                                      />
                                      To Do List
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                         checked={permissions.includes(
                                          "Calender"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                         onChange={() =>
                                          handleCheckboxChange("Calender")
                                        }
                                      />
                                      Calender
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                         checked={permissions.includes(
                                          "Tasks"
                                        )}
                                        onClick={(e) => e.stopPropagation()}
                                         onChange={() =>
                                          handleCheckboxChange("Tasks")
                                        }
                                      />
                                      Tasks
                                    </span>
                                  </Link>
                                </li>
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Calender checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      IVR Calls
                                    </span>
                                  </Link>
                                </li> */}
                              </ul>
                            </li>

                            {/* Customers */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["Customers"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>Customers</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Sales checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Sales
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Clients checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Clients
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Client SOA checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Client SOA
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </li>

                            {/* Support CRM */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["SupportCRM"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>Support CRM</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Category
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Sub Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Sub Category
                                    </span>
                                  </Link>
                                </li> */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Add Ticket checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Add Ticket
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Open Ticket checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Open Ticket
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "In Progress checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      In Progress
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Closed checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Closed
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </li>

                            <h6 className="submenu-hdr mt-3">
                              Business Module
                            </h6>
                            {/* Product */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["Product"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>Product</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Category
                                    </span>
                                  </Link>
                                </li> */}
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Sub Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Sub Category
                                    </span>
                                  </Link>
                                </li> */}
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Last Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Last Category
                                    </span>
                                  </Link>
                                </li> */}
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Brand checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Brand
                                    </span>
                                  </Link>
                                </li> */}
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "OEM checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      OEM
                                    </span>
                                  </Link>
                                </li> */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Add product checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Add product
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Products checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Manage Products
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Inventory checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Inventory
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Warehouse checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Warehouse
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </li>

                            {/* Services */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["Services"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>Services</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Category
                                    </span>
                                  </Link>
                                </li> */}
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Sub Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Sub Category
                                    </span>
                                  </Link>
                                </li> */}
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Last Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Last Category
                                    </span>
                                  </Link>
                                </li> */}
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Brand checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Brand/Assurance
                                    </span>
                                  </Link>
                                </li> */}
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "OEM checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      OEM
                                    </span>
                                  </Link>
                                </li> */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Add Service checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Add Service
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Service checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Manage Service
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </li>

                            {/* Accounts */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["Accounts"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>Accounts</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Sales Orders checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Sales Orders
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Invoices checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Invoices
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Receivables checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Receivables
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Purchase Orders:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Purchase Orders
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Payables checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Payables
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "P/L Statement checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      P/L Statement
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </li>

                            {/* Vendor*/}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["Vendor"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>Vendor</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Category
                                    </span>
                                  </Link>
                                </li> */}
                                {/* <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Sub Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Sub Category
                                    </span>
                                  </Link>
                                </li> */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Add Vendor checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Add Vendor
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Vendor:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Manage Vendor
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </li>

                            {/* Expenses */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["Expenses"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>Expenses</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Category
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Sub Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Sub Category
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Add Vendor checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Add Expense
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Vendor:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Manage Expense
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Vendor:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Paid Expenses
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Vendor:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Un-Paid Expenses
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </li>

                            <h6 className="submenu-hdr mt-3">AI Add-ons</h6>

                            {/* Chatbot */}
                            <li className="submenu d-flex align-items-center gap-2">
                              <input
                                type="checkbox"
                                id="chatbot"
                                onChange={() => handleCheckboxChange("Chatbot")}
                              />
                              <Link
                                to="#"
                                className={
                                  openMenus["AIAddons"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }

                                // onClick={() =>
                                //   setOpenMenus({
                                //     ...openMenus,
                                //     AIAddons: !openMenus.AIAddons,
                                //   })
                                // }
                              >
                                <i className="ti ti-ticket"></i>
                                <span>Chatbot</span>
                              </Link>
                            </li>
                            {/* AI Chatbot */}
                            <li className="submenu d-flex align-items-center gap-2">
                              <input
                                type="checkbox"
                                id="ai-chatbot"
                                onClick={(e) => e.stopPropagation()} // prevent link toggle
                                onChange={() =>
                                  handleCheckboxChange("AI Chatbot")
                                }
                              />
                              <Link
                                to="#"
                                className={
                                  openMenus["AIAddons"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                                onClick={() =>
                                  setOpenMenus({
                                    ...openMenus,
                                    AIAddons: !openMenus.AIAddons,
                                  })
                                }
                              >
                                <i className="ti ti-ticket"></i>
                                <span>AI Chatbot</span>
                              </Link>
                            </li>
                            {/* Data Analysis */}
                            <li className="submenu d-flex align-items-center gap-2">
                              <input
                                type="checkbox"
                                id="data-analysis"
                                onClick={(e) => e.stopPropagation()} // prevents checkbox click from triggering the link toggle
                                onChange={() =>
                                  handleCheckboxChange("Data Analysis")
                                }
                              />
                              <Link
                                to="#"
                                className={
                                  openMenus["AIAddons"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                                onClick={() =>
                                  setOpenMenus({
                                    ...openMenus,
                                    AIAddons: !openMenus.AIAddons,
                                  })
                                }
                              >
                                <i className="ti ti-ticket"></i>
                                <span>Data Analysis</span>
                              </Link>
                            </li>
                            {/* AI Avatar */}
                            <li className="submenu d-flex align-items-center gap-2">
                              <input
                                type="checkbox"
                                id="ai-avatar"
                                onClick={(e) => e.stopPropagation()} // ⛔ prevent submenu toggle
                                onChange={() =>
                                  handleCheckboxChange("AI Avatar")
                                }
                              />
                              <Link
                                to="#"
                                className={
                                  openMenus["AIAddons"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                                onClick={() =>
                                  setOpenMenus({
                                    ...openMenus,
                                    AIAddons: !openMenus.AIAddons,
                                  })
                                }
                              >
                                <i className="ti ti-ticket"></i>
                                <span>AI Avatar</span>
                              </Link>
                            </li>
                            {/* AI Automation */}
                            <li className="submenu d-flex align-items-center gap-2">
                              <input
                                type="checkbox"
                                id="ai-automation"
                                onClick={(e) => e.stopPropagation()}
                                onChange={() =>
                                  handleCheckboxChange("AI Automation")
                                }
                              />
                              <Link
                                to="#"
                                className={
                                  openMenus["AIAddons"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                                onClick={() =>
                                  setOpenMenus({
                                    ...openMenus,
                                    AIAddons: !openMenus.AIAddons,
                                  })
                                }
                              >
                                <i className="ti ti-ticket"></i>
                                <span>AI Automation</span>
                              </Link>
                            </li>

                            <h6 className="submenu-hdr mt-3">Setting</h6>
                            {/* Setup */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["Setup"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  setOpenMenus({
                                    ...openMenus,
                                    Setup: !openMenus.Setup,
                                  });
                                }}
                              >
                                <i className="ti ti-settings-cog"></i>
                                <span>Setup</span>
                                <span
                                  className="menu-arrow"
                                  // style={{
                                  //   transform: openMenus["Setup"]
                                  //     ? "rotate(90deg)"
                                  //     : "rotate(0deg)",
                                  //   transition: "transform 0.3s ease",
                                  // }}
                                ></span>
                              </Link>

                              {/* {openMenus.Setup && ( */}
                              <ul>
                                {/* HRMS */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className={
                                      openMenus["hrms2"]
                                        ? "subdrop active"
                                        : "subdrop"
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleMenu("hrms2");
                                    }}
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "HRMS checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      HRMS
                                    </span>
                                    <span className="menu-arrow inside-submenu"></span>
                                  </Link>
                                  {openMenus["hrms2"] && (
                                    <ul>
                                      <li>
                                        <Link to="#">Department</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Roles</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Group</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Working Shift</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Job Type</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Requirements</Link>
                                      </li>
                                    </ul>
                                  )}
                                </li>

                                {/* CRM */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className={
                                      openMenus["crm2"]
                                        ? "subdrop active"
                                        : "subdrop"
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleMenu("crm2");
                                    }}
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "CRM checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      CRM
                                    </span>
                                    <span className="menu-arrow inside-submenu"></span>
                                  </Link>
                                  {openMenus["crm2"] && (
                                    <ul>
                                      <li>
                                        <Link to="#">Services</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Source</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Reasons</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Industry</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Stage</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Facebook Token</Link>
                                      </li>
                                    </ul>
                                  )}
                                </li>

                                {/* TASK */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className={
                                      openMenus["task2"]
                                        ? "subdrop active"
                                        : "subdrop"
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleMenu("task2");
                                    }}
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "TASK checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      TASK
                                    </span>
                                    <span className="menu-arrow inside-submenu"></span>
                                  </Link>
                                  {openMenus["task2"] && (
                                    <ul>
                                      <li>
                                        <Link to="#">Task Category</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Task Sub-Category</Link>
                                      </li>
                                    </ul>
                                  )}
                                </li>

                                {/* VENDOR */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className={
                                      openMenus["vendor2"]
                                        ? "subdrop active"
                                        : "subdrop"
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleMenu("vendor2");
                                    }}
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "VENDOR checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      VENDOR
                                    </span>
                                    <span className="menu-arrow inside-submenu"></span>
                                  </Link>
                                  {openMenus["vendor2"] && (
                                    <ul>
                                      <li>
                                        <Link to="#">Vendor Category</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Vendor Sub-Category</Link>
                                      </li>
                                    </ul>
                                  )}
                                </li>

                                {/* PRODUCT */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className={
                                      openMenus["product2"]
                                        ? "subdrop active"
                                        : "subdrop"
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleMenu("product2");
                                    }}
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "PRODUCT checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      PRODUCT
                                    </span>
                                    <span className="menu-arrow inside-submenu"></span>
                                  </Link>
                                  {openMenus["product2"] && (
                                    <ul>
                                      <li>
                                        <Link to="#">Product Category</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Sub-Category</Link>
                                      </li>
                                      <li>
                                        <Link to="#">S-Sub-Category</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Brands</Link>
                                      </li>
                                      <li>
                                        <Link to="#">OEM</Link>
                                      </li>
                                    </ul>
                                  )}
                                </li>

                                {/* SERVICE */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className={
                                      openMenus["Service2"]
                                        ? "subdrop active"
                                        : "subdrop"
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleMenu("Service2");
                                    }}
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "SERVICE checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      SERVICE
                                    </span>
                                    <span className="menu-arrow inside-submenu"></span>
                                  </Link>
                                  {openMenus["Service2"] && (
                                    <ul>
                                      <li>
                                        <Link to="#">Service Category</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Sub-Category</Link>
                                      </li>
                                      <li>
                                        <Link to="#">S-Sub-Category</Link>
                                      </li>
                                    </ul>
                                  )}
                                </li>

                                {/* EXPENSE */}
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className={
                                      openMenus["expense2"]
                                        ? "subdrop active"
                                        : "subdrop"
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleMenu("expense2");
                                    }}
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "EXPENSE checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      EXPENSE
                                    </span>
                                    <span className="menu-arrow inside-submenu"></span>
                                  </Link>
                                  {openMenus["expense2"] && (
                                    <ul>
                                      <li>
                                        <Link to="#">Category</Link>
                                      </li>
                                      <li>
                                        <Link to="#">Sub-Category</Link>
                                      </li>
                                    </ul>
                                  )}
                                </li>
                              </ul>
                              {/* )} */}
                            </li>

                            {/* API Integration */}
                            <li className="submenu">
                              <Link
                                to="#"
                                className={
                                  openMenus["APIIntegration"]
                                    ? "subdrop active"
                                    : "subdrop active"
                                }
                              >
                                <i className="ti ti-layout-2"></i>
                                <span>API Integration</span>
                                <span className="menu-arrow"></span>
                              </Link>

                              <ul>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    // className="subdrop active"
                                    style={{ paddingLeft: "28px" }}
                                    className="subdrop "
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Payment Gateway
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Sub Category checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      SMS API
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Add Vendor checked:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      WhatsApp API
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Vendor:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Google Firebase
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Vendor:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Zoho Connect
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Vendor:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Tally Integration
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Vendor:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Meta API (FB)
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Vendor:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Zapier API
                                    </span>
                                  </Link>
                                </li>
                                <li className="submenu submenu-two subdrop">
                                  <Link
                                    to="#"
                                    className="subdrop"
                                    style={{ paddingLeft: "28px" }}
                                  >
                                    <span className="d-flex align-items-center gap-2">
                                      <input
                                        type="checkbox"
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) =>
                                          console.log(
                                            "Manage Vendor:",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      Email Automation
                                    </span>
                                  </Link>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="submit-button text-end">
                  <Link
                    to="#"
                    className="btn btn-light sidebar-close"
                    onClick={closePermission}
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
      </div>

      {/* Uploade KYC */}
      <UploadeKYC
        kycToggle={kycToggle}
        setKycToggle={setKycToggle}
        staffId={staffId}
      />
      {/* Uploade KYC */}
    </>
  );
};

export default ManageStaffList;
