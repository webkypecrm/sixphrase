import { useEffect, useState, useContext, Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../ImageWithBasePath";
import Scrollbars from "react-custom-scrollbars-2";
import { all_routes } from "../../../pages/Router/all_routes";
import { sidebarPanel } from "../../../selectOption/selectOption";
import { AuthContext } from "../../../context/AuthProvider";
import { RefreshContext } from "../../../context/RefreshContaxt.jsx";
import lock from "../../../../public/lock.webp";

const Sidebar = ({ setExpandMenu, miniSidebar }) => {
  const { staffData, permissions } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const route = all_routes;
  const profileName = localStorage.getItem("name") || "";
  const type = localStorage.getItem("type") || "";
  const profilePic = localStorage.getItem("profilePic") || "";
  const [sidebarRefresh, setSidebarRefresh] = useState(false);

  

  const navigate = useNavigate();

  //  Modal
  const handleUpgradeClick = () => {
    // Close modal manually
    const modalEl = document.querySelector(".modal.show");
    if (modalEl) {
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    }

    // Navigate after closing
    navigate(route.membershipplan);
  };

  function handleMenu(menu) {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  }

  const { refresh, setRefresh } = useContext(RefreshContext);

  const hasPermission = (module) => permissions.has(module);

  const hasPermission2 = (key) => {
    const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
    return permissions.includes(key);
  };

  useEffect(() => {
    setSidebarRefresh(!sidebarRefresh);
  }, [refresh]);

  return (
    <Fragment>
      <div
        className="sidebar"
        id="sidebar"
        onMouseEnter={() => setExpandMenu(true)}
        onMouseLeave={() => setExpandMenu(false)}
      >
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                <li className="clinicdropdown" >
                  <Link to="profile.html"style={{background:"black"}}>
                    <img
                      src={
                        profilePic || "/assets/img/profiles/admin_default.jpeg"
                      }
                      className="img-fluid"
                      alt="Profile"
                    />
                    <div className="user-names">
                      {/* <h5>{profileName}</h5> */}
                      <h5>6P Admin</h5>
                      <h6>{type === "1" ? "6P Admin" : "Employee"}</h6>
                    </div>
                  </Link>
                </li>
              </ul>
              <ul>
                <li>
                  <h6 className="submenu-hdr">Phase One</h6>
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
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            Dashboard: !openMenus.Dashboard,
                          })
                        }
                      >
                        <i className="ti ti-layout-2"></i>
                        <span>Dashboard</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["Dashboard"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.Dashboard && (
                        <ul>
                          {hasPermission2("salesDashboard") && (
                            <li>
                              <Link to={route.salesDashboard}>
                                Sales Dashboard
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
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
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            HRMS: !openMenus.HRMS,
                          })
                        }
                      >
                        <i className="ti ti-layout-2"></i>
                        <span>HRMS</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["HRMS"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.HRMS && (
                        <ul>
                          {hasPermission2("Company") && (
                            <li>
                              <Link to={route.companey}>Company</Link>
                            </li>
                          )}

                          {hasPermission2("Branches") && (
                            <li>
                              <Link to={route.branch}>Branches</Link>
                            </li>
                          )}

                          {hasPermission2("Staff") && (
                            <li>
                              <Link to={route.manageStaff}>Staff</Link>
                            </li>
                          )}

                          {hasPermission2("Payroll") && (
                            <li>
                              <Link to={route.payroll}>Payroll</Link>
                            </li>
                          )}

                          {hasPermission2("Attendance") && (
                            <li>
                              <Link to={route.attendanceLog}>Attendance</Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>

                    {/* CRM */}
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["CRM"] ? "subdrop active" : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            CRM: !openMenus.CRM,
                          })
                        }
                      >
                        <i className="ti ti-chart-arcs"></i>
                        <span>CRM</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["CRM"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.CRM && (
                        <ul>
                          {hasPermission2("Teams") && (
                            <li>
                              <Link to={route.teams}>Teams</Link>
                            </li>
                          )}
                          {hasPermission2("Targets") && (
                            <li>
                              <Link to={route.targets}>Targets</Link>
                            </li>
                          )}
                          {hasPermission2("Leads") && (
                            <li>
                              <Link to={route.leads}>Leads</Link>
                            </li>
                          )}
                          {hasPermission2("Meetings") && (
                            <li>
                              <Link to={route.upcomingAppointments}>
                                Meetings
                              </Link>
                            </li>
                          )}
                          {hasPermission2("Calls") && (
                            <li>
                              <Link to={route.upcomingCalls}>Calls</Link>
                            </li>
                          )}
                          {hasPermission2("toDoList") && (
                            <li>
                              <Link to={route.todo}>To Do List</Link>
                            </li>
                          )}
                          {hasPermission2("Calender") && (
                            <li>
                              <Link to={route.calendar}>Calender</Link>
                            </li>
                          )}
                          {hasPermission2("Tasks") && (
                            <li>
                              <Link to={route.tasks}>Tasks</Link>
                            </li>
                          )}

                        </ul>
                      )}
                    </li>

                    {/* Customers */}
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["Customer"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            Customer: !openMenus.Customer,
                          })
                        }
                      >
                        <i className="ti ti-user-up"></i>
                        <span>Customer</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["Customer"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.Customer && (
                        <ul>
                          <li>
                            <Link to={route.customers}>Sales</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Clients</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Client SOA</Link>
                          </li>
                        </ul>
                      )}
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
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            SupportCRM: !openMenus.SupportCRM,
                          })
                        }
                      >
                        <i className="ti ti-ticket"></i>
                        <span>Support CRM</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["SupportCRM"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.SupportCRM && (
                        <ul>
                          {/* <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Category</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Sub Category</Link>
                          </li> */}
                          <li>
                            <Link to={route.manegeTicket}>Add Ticket</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Open Ticket</Link>
                          </li>
                          <li>
                            <Link to={route.progressTicket}>In Progress</Link>
                          </li>
                          <li>
                            <Link to={route.closedTicket}>Closed</Link>
                          </li>
                        </ul>
                      )}
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
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            Services: !openMenus.Services,
                          })
                        }
                      >
                        <i className="ti ti-chart-arcs"></i>
                        <span>Services</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["Services"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.Services && (
                        <ul>
                          {/* <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Category</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Sub Category</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Last Category</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Brand/Assurance</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>OEM</Link>
                          </li> */}
                          <li>
                            <Link to={route.services}>Add Service</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Manage Service</Link>
                          </li>
                        </ul>
                      )}
                    </li>

                    <h6 className="submenu-hdr mt-3">Phase Two</h6>
                    {/* Product */}
                    {/* <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["Product"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            Product: !openMenus.Product,
                          })
                        }
                      >
                        <i className="ti ti-chart-arcs"></i>
                        <span>Product</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["Product"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.Product && (
                        <ul>
    
                          <li>
                            <Link to={route.product}>Add Product</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Manage Products</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Inventory</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Warehouse</Link>
                          </li>
                        </ul>
                      )}
                    </li> */}

                   

                    {/* Accounts */}
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["Accounts"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            Accounts: !openMenus.Accounts,
                          })
                        }
                      >
                        <i className="ti ti-chart-arcs"></i>
                        <span>Accounts</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["Accounts"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.Accounts && (
                        <ul>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Sales Orders</Link>
                          </li>
                          <li>
                            <Link to={route.customerList}>Invoices</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Receivables</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Purchase Orders</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Payables</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>P/L Statement</Link>
                          </li>
                        </ul>
                      )}
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
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            Vendor: !openMenus.Vendor,
                          })
                        }
                      >
                        <i className="ti ti-chart-arcs"></i>
                        <span>Vendor</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["Vendor"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.Vendor && (
                        <ul>
                          {/* <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Category</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Sub Category</Link>
                          </li> */}
                          <li>
                            <Link to={route.vendors}>Add Vendor</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Manage Vendor</Link>
                          </li>
                        </ul>
                      )}
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
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            Expenses: !openMenus.Expenses,
                          })
                        }
                      >
                        <i className="ti ti-chart-arcs"></i>
                        <span>Expenses</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["Expenses"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.Expenses && (
                        <ul>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Category</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Sub Category</Link>
                          </li>
                          <li>
                            <Link to={route.expense}>Add Expense</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Manage Expense</Link>
                          </li>
                          <li>
                            <Link to={route.paidExpense}>Paid Expenses</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Un-Paid Expenses</Link>
                          </li>
                        </ul>
                      )}
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
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            Setup: !openMenus.Setup,
                          })
                        }
                      >
                        <i className="ti ti-settings-cog"></i>
                        <span>Setup</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["Setup"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.Setup && (
                        <ul>
                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["hrms2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("hrms2");
                              }}
                            >
                              HRMS
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["hrms2"] && (
                              <ul>
                                <li>
                                  <Link to={route.department}>Department</Link>
                                </li>
                                <li>
                                  <Link to={route.role}>Roles</Link>
                                </li>
                                <li>
                                  <Link to={route.group}>Group</Link>
                                </li>
                                <li>
                                  <Link to={route.workShift}>
                                    Working Shift
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.jobType}>Job Type</Link>
                                </li>
                                <li>
                                  <Link to={route.leadFor}>Requirements </Link>
                                </li>
                                <li>
                                  <Link to={route.grade}>Grade </Link>
                                </li>
                              </ul>
                            )}
                          </li>

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["crm2"] ? "subdrop active" : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("crm2");
                              }}
                            >
                              CRM
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["crm2"] && (
                              <ul>
                                <li>
                                  <Link to={route.service}>Services</Link>
                                </li>
                                <li>
                                  <Link to={route.source}>Source</Link>
                                </li>
                                <li>
                                  <Link to={route.reasons}>Reasons</Link>
                                </li>
                                <li>
                                  <Link to={route.category}>Industry</Link>
                                </li>
                                <li>
                                  <Link to={route.stage}>Stage</Link>
                                </li>
                                <li>
                                  <Link to={route.facebookToken}>
                                    Facebook Token
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["task2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("task2");
                              }}
                            >
                              TASK
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["task2"] && (
                              <ul>
                                <li>
                                  <Link to={route.taskCategory}>
                                    Task Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.taskSubCategory}>
                                    Task Sub-Category
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["vendor2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("vendor2");
                              }}
                            >
                              VENDOR
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["vendor2"] && (
                              <ul>
                                <li>
                                  <Link to={route.vendorCategory}>
                                    Vendor Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.vendorSubCategory}>
                                    Vendor Sub-Category
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>

                          {/* <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["product2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("product2");
                              }}
                            >
                              PRODUCT
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["product2"] && (
                              <ul>
                                <li>
                                  <Link to={route.productCategory}>
                                    Product Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.productSubCategory}>
                                    Sub-Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.productS_SubCategory}>
                                    S-Sub-Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.productBrands}>Brands</Link>
                                </li>
                                <li>
                                  <Link to={route.productOEM}>OEM</Link>
                                </li>
                              </ul>
                            )}
                          </li> */}

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["Service2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("Service2");
                              }}
                            >
                              SERVICE
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["Service2"] && (
                              <ul>
                                <li>
                                  <Link to={route.serviceCategory}>
                                    Service Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.serviceSubCategory}>
                                    Sub-Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.serviceS_SubCategory}>
                                    S-Sub-Category
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["expense2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("expense2");
                              }}
                            >
                              EXPENSE
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["expense2"] && (
                              <ul>
                                <li>
                                  <Link to={"#"}>Category</Link>
                                </li>
                                <li>
                                  <Link to={"#"}>Sub-Category</Link>
                                </li>
                              </ul>
                            )}
                          </li>

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["support"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("support");
                              }}
                            >
                              Support CRM
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["support"] && (
                              <ul>
                                <li>
                                  <Link to={route.supportCategory}>
                                    Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.supportSubCategory}>
                                    Sub-Category
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>
                        </ul>
                      )}
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
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            APIIntegration: !openMenus.APIIntegration,
                          })
                        }
                      >
                        <i className="ti ti-ticket"></i>
                        <span>API Integration</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["APIIntegration"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.APIIntegration && (
                        <ul>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Payment Gateway</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>SMS API</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Whatsapp API</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Google Firebase</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Zoho Connect</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Tally integration</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Meta API (FB)</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Zapier API</Link>
                          </li>
                          <li
                            data-bs-toggle="modal"
                            data-bs-target="#temp_modal"
                          >
                            <Link to={"#"}>Email Automation</Link>
                          </li>
                        </ul>
                      )}
                    </li>

                    {/* Settings */}
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["setting"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            setting: !openMenus.setting,
                          })
                        }
                      >
                        <i className="ti ti-settings-cog"></i>
                        <span>Settings</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["setting"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.setting && (
                        <ul>
                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["subMenu2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("subMenu2");
                              }}
                            >
                              General Settings
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["subMenu2"] && (
                              <ul>
                                <li>
                                  <Link to={route.profile}>Profile</Link>
                                </li>
                                <li>
                                  <Link to={route.security}>Security</Link>
                                </li>
                                <li>
                                  <Link to={route.notification}>
                                    Notification
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.connectedApps}>
                                    Connected App
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>
                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["subMenu3"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("subMenu3");
                              }}
                            >
                              Website Settings
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["subMenu3"] && (
                              <ul>
                                <li>
                                  <Link to={route.companySettings}>
                                    Company Setting
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.localization}>
                                    Localization
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.prefixes}>Prefixes</Link>
                                </li>
                                <li>
                                  <Link to={route.preference}>Preference</Link>
                                </li>
                                <li>
                                  <Link to={route.appearance}>Appearance</Link>
                                </li>
                                <li>
                                  <Link to={route.language}>Language</Link>
                                </li>
                              </ul>
                            )}
                          </li>
                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["subMenu4"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("subMenu4");
                              }}
                            >
                              App Settings
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["subMenu4"] && (
                              <ul>
                                <li>
                                  <Link to={route.invoiceSettings}>
                                    Invoice
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.printers}>Printers</Link>
                                </li>
                                <li>
                                  <Link to={route.customFields}>
                                    Custom Fields
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>
                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["subMenu5"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("subMenu5");
                              }}
                            >
                              System Settings
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["subMenu5"] && (
                              <ul>
                                <li>
                                  <Link to={route.emailSettings}>Email</Link>
                                </li>
                                <li>
                                  <Link to={route.smsGateways}>
                                    SMS-Gateways
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.gdprCookies}>
                                    GDPR-Cookies
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>
                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["subMenu6"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("subMenu6");
                              }}
                            >
                              Financial Settings
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["subMenu6"] && (
                              <ul>
                                <li>
                                  <Link to={route.paymentGateways}>
                                    Payment Gateways
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.bankAccount}>
                                    Bank Accounts
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.taxRates}>Tax Rates</Link>
                                </li>
                                <li>
                                  <Link to={route.currencies}>Currencies</Link>
                                </li>
                              </ul>
                            )}
                          </li>
                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["subMenu7"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("subMenu7");
                              }}
                            >
                              Other Settings
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["subMenu7"] && (
                              <ul>
                                <li>
                                  <Link to={route.storage}>Storage</Link>
                                </li>
                                <li>
                                  <Link to={route.banIpAddrress}>
                                    Ban IP Address
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>
                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["subMenu8"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("subMenu8");
                              }}
                            >
                              Master
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["subMenu8"] && (
                              <ul>
                                <li>
                                  <Link to={route.sources}>Sources</Link>
                                </li>
                                <li>
                                  <Link to={route.lostReason}>
                                    Lost Reasons
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.contactStage}>
                                    Contact Stage
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.industry}>Industry</Link>
                                </li>
                                <li>
                                  <Link to={route.calls}>Calls</Link>
                                </li>
                              </ul>
                            )}
                          </li>
                        </ul>
                      )}
                    </li>

                    {/* SUBSCRIPTION */}
                    {/* <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["Subscription"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            Subscription: !openMenus.Subscription,
                          })
                        }
                      >
                        <i className="ti ti-building-community"></i>
                        <span>Subscription</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["Subscription"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus["Subscription"] && (
                        <ul>
                          <li>
                            <Link to={route.companies}>Manage Companies </Link>
                          </li>
                          <li>
                            <Link to={route.membershipplan}>
                              Membership Plans{" "}
                            </Link>
                          </li>
                          <li>
                            <Link to={route.membershipAddon}>
                              Membership Addons{" "}
                            </Link>
                          </li>
                          <li>
                            <Link to={route.membershipTransaction}>
                              Transactions{" "}
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li> */}
                  </ul>
                </li>
              </ul>
              {/* <div className="d-flex align-items-center justify-content-center">
                <p className="mb-0" style={{ fontSize: "18px" }}>
                  <b>Powered By</b>
                </p>
                <img
                  src="/assets/img/caasaa-logo-website.png"
                  alt=""
                  style={{
                    width: "90px",
                    height: "auto",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                />
              </div> */}
              <div className="powered-by-section d-flex align-items-center justify-content-center">
                <p
                  className="mb-0 powered-by-text"
                  style={{ fontSize: "18px" }}
                >
                  <b>Powered By</b>
                </p>
                <img
                  src="/assets/img/caasaa-logo-website.png"
                  alt=""
                  className="powered-by-logo"
                  style={{
                    width: "90px",
                    height: "auto",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                />
              </div>

              {/* -------------------------------------------------------------------------------------------- */}
              <ul>
                <li>
                  {/* <h6 className="submenu-hdr">Main Menu</h6> */}
                  <ul>
                    {/* Dashboard */}
                    {/* {hasPermission("Dashboard") && (
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["dashboard"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            dashboard: !openMenus.dashboard,
                          })
                        }
                      >
                        <i className="ti ti-layout-2"></i>
                        <span>Dashboard</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["dashboard"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.dashboard && (
                        <ul>
                          <li>
                            <Link to={route.salesDashboard}>
                              Sales Dashboard
                            </Link>
                          </li>
                          {type == "1" && (
                            <li>
                              <Link to={route.salesReports}>Sales Reports</Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                  )} */}

                    {/* companey */}
                    {/* {hasPermission("Lead") && (
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["customer"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            customer: !openMenus.customer,
                          })
                        }
                      >
                        <i className="ti ti-chart-arcs"></i>
                        <span>Company</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["customer"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.customer && (
                        <ul>
                          <li>
                            <Link to={route.companey}>Manage Company</Link>
                          </li>
                          <li>
                            <Link to={"#"}>Manage Branches</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  )} */}

                    {/* Staff */}
                    {/* {type == "1" && (
                    <li className="submenu">
                      <Link
                        to={route.manageStaff}
                        className={
                          openMenus["hrms"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({ ...openMenus, hrms: !openMenus.hrms })
                        }
                      >
                        <i className="ti ti-file-invoice"></i>
                        <span>Staff</span>
                      </Link>
                    </li>
                  )} */}

                    {/* {type == "1" && (
                    <li className="submenu">
                      <Link
                        to={route.attendanceLog}
                        className={
                          openMenus["hrms"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({ ...openMenus, hrms: !openMenus.hrms })
                        }
                      >
                        <i className="ti ti-file-invoice"></i>
                        <span>Attendance</span>
                      </Link>
                    </li>
                  )} */}

                    {/* Leads */}
                    {/* {hasPermission("Lead") && (
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["sales"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            sales: !openMenus.sales,
                          })
                        }
                      >
                        <i className="ti ti-chart-arcs"></i>
                        <span>Leads</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["sales"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.sales && (
                        <ul>
                          <li>
                            <Link to={route.leads}>Manage Leads</Link>
                          </li>
                          <li>
                            <Link to={route.upcomingAppointments}>
                              Upcoming Meeting
                            </Link>
                          </li>
                          <li>
                            <Link to={route.upcomingCalls}>Upcoming Calls</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  )} */}

                    {/* Customers */}
                    {/* {hasPermission("Customer") && (
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["Menu6"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            Menu6: !openMenus.Menu6,
                          })
                        }
                      >
                        <i className="ti ti-user-up"></i>
                        <span>Customer</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["Menu6"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.Menu6 && (
                        <ul>
                          <li>
                            <Link to={route.customers}>Manage Customer</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  )} */}
                    {/* 
                  {hasPermission("Lead") && (
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["task"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({ ...openMenus, task: !openMenus.task })
                        }
                      >
                        <i className="ti ti-chart-arcs"></i>
                        <span>Task</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["task"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.task && (
                        <ul>
                          <li>
                            <Link to={route.tasks}>Manage Task</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  )} */}

                    {/* <li className="submenu">
                    <Link
                      to="#"
                      className={
                        openMenus["vendors"]
                          ? "subdrop active"
                          : "subdrop active"
                      }
                      onClick={() =>
                        setOpenMenus({
                          ...openMenus,
                          vendors: !openMenus.vendors,
                        })
                      }
                    >
                      <i className="ti ti-chart-arcs"></i>
                      <span>Vendors</span>
                      <span
                        className="menu-arrow"
                        style={{
                          transform: openMenus["vendors"]
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      ></span>
                    </Link>
                    {openMenus.vendors && (
                      <ul>
                        <li>
                          <Link to={route.vendors}>Manage Vendors</Link>
                        </li>
                      </ul>
                    )}
                  </li> */}
                    {/* <li className="submenu">
                    <Link
                      to="#"
                      className={
                        openMenus["expense"]
                          ? "subdrop active"
                          : "subdrop active"
                      }
                      onClick={() =>
                        setOpenMenus({
                          ...openMenus,
                          expense: !openMenus.expense,
                        })
                      }
                    >
                      <i className="ti ti-chart-arcs"></i>
                      <span>Expenses</span>
                      <span
                        className="menu-arrow"
                        style={{
                          transform: openMenus["expense"]
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      ></span>
                    </Link>
                    {openMenus.expense && (
                      <ul>
                        <li>
                          <Link to={route.expense}>Add Expenses</Link>
                        </li>
                        <li>
                          <Link to={route.paidExpense}>Paid Expenses</Link>
                        </li>
                        <li>
                          <Link to={route.expense}>Expense Report</Link>
                        </li>
                      </ul>
                    )}
                  </li> */}

                    {/* Setup */}
                    {/* {hasPermission("Setup") && (
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["setup"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            setup: !openMenus.setup,
                          })
                        }
                      >
                        <i className="ti ti-settings-cog"></i>
                        <span>Setup</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["setup"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.setup && (
                        <ul>
                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["hrms2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("hrms2");
                              }}
                            >
                              HRMS
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["hrms2"] && (
                              <ul>
                                <li>
                                  <Link to={route.department}>Department</Link>
                                </li>
                                <li>
                                  <Link to={route.role}>Roles</Link>
                                </li>
                                <li>
                                  <Link to={route.group}>Group</Link>
                                </li>
                                <li>
                                  <Link to={route.workShift}>
                                    Working Shift
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.jobType}>Job Type</Link>
                                </li>
                                <li>
                                  <Link to={route.leadFor}>Requirements </Link>
                                </li>
                              </ul>
                            )}
                          </li>

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["crm2"] ? "subdrop active" : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("crm2");
                              }}
                            >
                              CRM
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["crm2"] && (
                              <ul>
                                <li>
                                  <Link to={route.service}>Services</Link>
                                </li>
                                <li>
                                  <Link to={route.source}>Source</Link>
                                </li>
                                <li>
                                  <Link to={route.reasons}>Reasons</Link>
                                </li>
                                <li>
                                  <Link to={route.category}>Industry</Link>
                                </li>
                                <li>
                                  <Link to={route.stage}>Stage</Link>
                                </li>
                                {type == "1" && (
                                  <li>
                                    <Link to={route.facebookToken}>
                                      Facebook Token
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            )}
                          </li>

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["task2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("task2");
                              }}
                            >
                              TASK
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["task2"] && (
                              <ul>
                                <li>
                                  <Link to={route.taskCategory}>
                                    Task Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.taskSubCategory}>
                                    Task Sub-Category
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["vendor2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("vendor2");
                              }}
                            >
                              VENDOR
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["vendor2"] && (
                              <ul>
                                <li>
                                  <Link to={route.vendorCategory}>
                                    Vendor Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.vendorSubCategory}>
                                    Vendor Sub-Category
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>
                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["product2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("product2");
                              }}
                            >
                              PRODUCT
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["product2"] && (
                              <ul>
                                <li>
                                  <Link to={route.productCategory}>
                                    Product Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.productSubCategory}>
                                    Sub-Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.productS_SubCategory}>
                                    S-Sub-Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.productBrands}>Brands</Link>
                                </li>
                                <li>
                                  <Link to={route.productOEM}>OEM</Link>
                                </li>
                              </ul>
                            )}
                          </li>

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["Service2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("Service2");
                              }}
                            >
                              SERVICE
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["Service2"] && (
                              <ul>
                                <li>
                                  <Link to={route.serviceCategory}>
                                    Service Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.serviceSubCategory}>
                                    Sub-Category
                                  </Link>
                                </li>
                                <li>
                                  <Link to={route.serviceS_SubCategory}>
                                    S-Sub-Category
                                  </Link>
                                </li>
                              </ul>
                            )}
                          </li>

                          <li className="submenu submenu-two subdrop">
                            <Link
                              to="#"
                              className={
                                openMenus["expense2"]
                                  ? "subdrop active"
                                  : "subdrop"
                              }
                              onClick={() => {
                                handleMenu("expense2");
                              }}
                            >
                              EXPENSE
                              <span className="menu-arrow inside-submenu"></span>
                            </Link>
                            {openMenus["expense2"] && (
                              <ul>
                                <li>
                                  <Link to={"#"}>Category</Link>
                                </li>
                                <li>
                                  <Link to={"#"}>Sub-Category</Link>
                                </li>
                              </ul>
                            )}
                          </li>
                        </ul>
                      )}
                    </li>
                  )} */}
                    {/* {hasPermission("Setup") && (
                    <li className="submenu">
                      <Link
                        to="#"
                        className={
                          openMenus["product"]
                            ? "subdrop active"
                            : "subdrop active"
                        }
                        onClick={() =>
                          setOpenMenus({
                            ...openMenus,
                            product: !openMenus.product,
                          })
                        }
                      >
                        <i className="ti ti-brand-slack"></i>
                        <span>Product</span>
                        <span
                          className="menu-arrow"
                          style={{
                            transform: openMenus["product"]
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        ></span>
                      </Link>
                      {openMenus.product && (
                        <ul>
                          <li>
                            <Link to={route.product}>Manage Product</Link>
                          </li>
                          <li>
                            <Link to={route.product}>Disabled Product </Link>
                          </li>
                          <li>
                            <Link to={route.product}>Add Product</Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  )} */}

                    {/* <li className="submenu">
                    <Link
                      to="#"
                      className={
                        openMenus["services"]
                          ? "subdrop active"
                          : "subdrop active"
                      }
                      onClick={() =>
                        setOpenMenus({
                          ...openMenus,
                          services: !openMenus.services,
                        })
                      }
                    >
                      <i className="ti ti-file-report"></i>
                      <span>Services</span>
                      <span
                        className="menu-arrow"
                        style={{
                          transform: openMenus["services"]
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      ></span>
                    </Link>
                    {openMenus.services && (
                      <ul>
                        <li>
                          <Link to={route.services}>Manage Services</Link>
                        </li>
                        <li>
                          <Link to={route.services}>Disabled Services </Link>
                        </li>
                        <li>
                          <Link to={route.services}>Add Services</Link>
                        </li>
                      </ul>
                    )}
                  </li> */}

                    {/* <li className="submenu">
                    <Link
                      to="#"
                      className={
                        openMenus["finance"]
                          ? "subdrop active"
                          : "subdrop active"
                      }
                      onClick={() =>
                        setOpenMenus({
                          ...openMenus,
                          finance: !openMenus.finance,
                        })
                      }
                    >
                      <i className="ti ti-file-report"></i>
                      <span>Finance</span>
                      <span
                        className="menu-arrow"
                        style={{
                          transform: openMenus["finance"]
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      ></span>
                    </Link>
                    {openMenus.finance && (
                      <ul>
                        <li>
                          <Link to={route.customerList}>View Contracts</Link>
                        </li>
                        <li>
                          <Link to={route.customerList}>Payment Schedule</Link>
                        </li>
                        <li>
                          <Link to={route.customerList}>Create Invoices</Link>
                        </li>
                        <li>
                          <Link to={route.customerList}>New Invoices</Link>
                        </li>
                        <li>
                          <Link to={route.customerList}>Due Invoices</Link>
                        </li>
                        <li>
                          <Link to={route.customerList}>Paid Invoices</Link>
                        </li>
                        <li>
                          <Link to={route.customerList}>Customer SOA</Link>
                        </li>
                        <li>
                          <Link to={route.customerList}>Connect Zoho</Link>
                        </li>
                        <li>
                          <Link to={route.customerList}>Connect SAP</Link>
                        </li>
                        <li>
                          <Link to={route.customerList}>Connect Tally</Link>
                        </li>
                      </ul>
                    )}
                  </li> */}
                    {/* <li className="submenu">
                    <Link
                      to="#"
                      className={
                        openMenus["support"]
                          ? "subdrop active"
                          : "subdrop active"
                      }
                      onClick={() =>
                        setOpenMenus({
                          ...openMenus,
                          support: !openMenus.support,
                        })
                      }
                    >
                      <i className="ti ti-ticket"></i>
                      <span>Support</span>
                      <span
                        className="menu-arrow"
                        style={{
                          transform: openMenus["support"]
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      ></span>
                    </Link>
                    {openMenus.support && (
                      <ul>
                        <li>
                          <Link to={route.manegeTicket}>Manage Ticket</Link>
                        </li>
                        <li>
                          <Link to={route.ticketStage}>
                            Create Support Ticket
                          </Link>
                        </li>
                        <li>
                          <Link to={route.ticketStage}>Open Tickets</Link>
                        </li>
                        <li>
                          <Link to={route.ticketStage}>In Process Tickets</Link>
                        </li>
                        <li>
                          <Link to={route.ticketStage}>Closed Tickets</Link>
                        </li>
                        <li>
                          <Link to={route.ticketStage}>Hold Tickets</Link>
                        </li>
                        <li>
                          <Link to={route.ticketStage}>AI Chatbot</Link>
                        </li>
                        <li>
                          <Link to={route.ticketStage}>Video Chat</Link>
                        </li>
                        <li>
                          <Link to={route.ticketStage}>Voice Calls</Link>
                        </li>
                      </ul>
                    )}
                  </li> */}
                  </ul>
                </li>
              </ul>
              {/* -------------------------------------------------------------------------------------------- */}
              <ul>
                <li>
                  {/* <h6 className="submenu-hdr">Add On</h6> */}
                  <ul>
                    {/* <li className="submenu">
                    <Link
                      to="#"
                      className={
                        openMenus["Menu9"] ? "subdrop active" : "subdrop"
                      }
                      onClick={() => {
                        handleMenu("Menu9");
                      }}
                    >
                      <i className="ti ti-timeline-event-exclamation"></i>
                      <span>MARKETING</span>
                      <span className="menu-arrow"></span>
                    </Link>
                    <ul>
                      <li>
                        <Link to={route.campaign}>Campaigns</Link>
                      </li>
                      <li>
                        <Link to={route.email}>Emails</Link>
                      </li>
                      <li>
                        <Link to={route.deals}>Deals</Link>
                      </li>
                    </ul>
                  </li> */}
                    {/* <li className="submenu">
                    <Link
                      to="#"
                      className={
                        openMenus["menu-sub"] ? "subdrop active" : "subdrop"
                      }
                      onClick={() => {
                        handleMenu("menu-sub");
                      }}
                    >
                      <i className="ti ti-building-community"></i>
                      <span>SUBSCRIPTION</span>
                      <span className="menu-arrow"></span>
                    </Link>
                    {openMenus["menu-sub"] && (
                      <ul>
                        <li>
                          <Link to={route.companies}>Manage Companies </Link>
                        </li>
                        <li>
                          <Link to={route.membershipplan}>
                            Membership Plans{" "}
                          </Link>
                        </li>
                        <li>
                          <Link to={route.membershipAddon}>
                            Membership Addons{" "}
                          </Link>
                        </li>
                        <li>
                          <Link to={route.membershipTransaction}>
                            Transactions{" "}
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li> */}

                    {/* <li className="submenu">
                    <Link
                      to="#"
                      className={
                        openMenus["setting"] ? "subdrop active" : "subdrop"
                      }
                      onClick={() => {
                        handleMenu("setting");
                      }}
                    >
                      <i className="ti ti-settings-cog"></i>
                      <span>SETTINGS</span>
                      <span className="menu-arrow"></span>
                    </Link>

                    <ul>
                      <li className="submenu submenu-two subdrop">
                        <Link
                          to="#"
                          className={
                            openMenus["subMenu2"] ? "subdrop active" : "subdrop"
                          }
                          onClick={() => {
                            handleMenu("subMenu2");
                          }}
                        >
                          General Settings
                          <span className="menu-arrow inside-submenu"></span>
                        </Link>
                        {openMenus["subMenu2"] && (
                          <ul>
                            <li>
                              <Link to={route.profile}>Profile</Link>
                            </li>
                            <li>
                              <Link to={route.security}>Security</Link>
                            </li>
                            <li>
                              <Link to={route.notification}>Notification</Link>
                            </li>
                            <li>
                              <Link to={route.connectedApps}>
                                Connected App
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                      <li className="submenu submenu-two subdrop">
                        <Link
                          to="#"
                          className={
                            openMenus["subMenu3"] ? "subdrop active" : "subdrop"
                          }
                          onClick={() => {
                            handleMenu("subMenu3");
                          }}
                        >
                          Website Settings
                          <span className="menu-arrow inside-submenu"></span>
                        </Link>
                        {openMenus["subMenu3"] && (
                          <ul>
                            <li>
                              <Link to={route.companySettings}>
                                Company Setting
                              </Link>
                            </li>
                            <li>
                              <Link to={route.localization}>Localization</Link>
                            </li>
                            <li>
                              <Link to={route.prefixes}>Prefixes</Link>
                            </li>
                            <li>
                              <Link to={route.preference}>Preference</Link>
                            </li>
                            <li>
                              <Link to={route.appearance}>Appearance</Link>
                            </li>
                            <li>
                              <Link to={route.language}>Language</Link>
                            </li>
                          </ul>
                        )}
                      </li>
                      <li className="submenu submenu-two subdrop">
                        <Link
                          to="#"
                          className={
                            openMenus["subMenu4"] ? "subdrop active" : "subdrop"
                          }
                          onClick={() => {
                            handleMenu("subMenu4");
                          }}
                        >
                          App Settings
                          <span className="menu-arrow inside-submenu"></span>
                        </Link>
                        {openMenus["subMenu4"] && (
                          <ul>
                            <li>
                              <Link to={route.invoiceSettings}>Invoice</Link>
                            </li>
                            <li>
                              <Link to={route.printers}>Printers</Link>
                            </li>
                            <li>
                              <Link to={route.customFields}>Custom Fields</Link>
                            </li>
                          </ul>
                        )}
                      </li>
                      <li className="submenu submenu-two subdrop">
                        <Link
                          to="#"
                          className={
                            openMenus["subMenu5"] ? "subdrop active" : "subdrop"
                          }
                          onClick={() => {
                            handleMenu("subMenu5");
                          }}
                        >
                          System Settings
                          <span className="menu-arrow inside-submenu"></span>
                        </Link>
                        {openMenus["subMenu5"] && (
                          <ul>
                            <li>
                              <Link to={route.emailSettings}>Email</Link>
                            </li>
                            <li>
                              <Link to={route.smsGateways}>SMS-Gateways</Link>
                            </li>
                            <li>
                              <Link to={route.gdprCookies}>GDPR-Cookies</Link>
                            </li>
                          </ul>
                        )}
                      </li>
                      <li className="submenu submenu-two subdrop">
                        <Link
                          to="#"
                          className={
                            openMenus["subMenu6"] ? "subdrop active" : "subdrop"
                          }
                          onClick={() => {
                            handleMenu("subMenu6");
                          }}
                        >
                          Financial Settings
                          <span className="menu-arrow inside-submenu"></span>
                        </Link>
                        {openMenus["subMenu6"] && (
                          <ul>
                            <li>
                              <Link to={route.paymentGateways}>
                                Payment Gateways
                              </Link>
                            </li>
                            <li>
                              <Link to={route.bankAccount}>Bank Accounts</Link>
                            </li>
                            <li>
                              <Link to={route.taxRates}>Tax Rates</Link>
                            </li>
                            <li>
                              <Link to={route.currencies}>Currencies</Link>
                            </li>
                          </ul>
                        )}
                      </li>
                      <li className="submenu submenu-two subdrop">
                        <Link
                          to="#"
                          className={
                            openMenus["subMenu7"] ? "subdrop active" : "subdrop"
                          }
                          onClick={() => {
                            handleMenu("subMenu7");
                          }}
                        >
                          Other Settings
                          <span className="menu-arrow inside-submenu"></span>
                        </Link>
                        {openMenus["subMenu7"] && (
                          <ul>
                            <li>
                              <Link to={route.storage}>Storage</Link>
                            </li>
                            <li>
                              <Link to={route.banIpAddrress}>
                                Ban IP Address
                              </Link>
                            </li>
                          </ul>
                        )}
                      </li>
                      <li className="submenu submenu-two subdrop">
                        <Link
                          to="#"
                          className={
                            openMenus["subMenu8"] ? "subdrop active" : "subdrop"
                          }
                          onClick={() => {
                            handleMenu("subMenu8");
                          }}
                        >
                          Master
                          <span className="menu-arrow inside-submenu"></span>
                        </Link>
                        {openMenus["subMenu8"] && (
                          <ul>
                            <li>
                              <Link to={route.sources}>Sources</Link>
                            </li>
                            <li>
                              <Link to={route.lostReason}>Lost Reasons</Link>
                            </li>
                            <li>
                              <Link to={route.contactStage}>Contact Stage</Link>
                            </li>
                            <li>
                              <Link to={route.industry}>Industry</Link>
                            </li>
                            <li>
                              <Link to={route.calls}>Calls</Link>
                            </li>
                          </ul>
                        )}
                      </li>
                    </ul>
                  </li> */}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>

      {/* Modal */}
      <div className="modal custom-modal fade" id="temp_modal" role="dialog">
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
                  {/* <i className="ti ti-trash-x" /> */}
                  <img src={lock} alt="" />
                </div>
                <p className="sidebar-modal-text">
                  ⚠️ Oops! You don’t have a subscription for this service. To
                  continue, please upgrade your plan or contact the Caasaa Sales
                  Team for assistance.
                </p>
                <p
                  className="del-info mt-1"
                  style={{ color: "#000", fontSize: "15.5px" }}
                >
                  📞 Sales Support: <b>+91-8130352808</b>
                </p>
                <p
                  className="del-info mt-1"
                  style={{ color: "#000", fontSize: "15.5px" }}
                >
                  💼 Explore Plans:{" "}
                  <Link
                    to=""
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpgradeClick();
                    }}
                  >
                    <span style={{ fontWeight: "700" }}>
                      Upgrade Subscription
                    </span>
                  </Link>
                </p>
                <div className="col-lg-12 text-center modal-btn">
                  <button
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;
