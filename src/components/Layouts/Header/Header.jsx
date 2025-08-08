
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"
import ImageWithBasePath from "../../ImageWithBasePath"
import { all_routes } from "../../../pages/Router/all_routes";
import { Tooltip } from 'react-tooltip'
import { AuthContext } from "../../../context/AuthProvider";
import { SearchContext } from "../../../context/SearchProvider";
import axios from "axios";
import { getDate, getTime } from "../../../selectOption/selectFunction";
import { format, isToday, isYesterday, parseISO } from 'date-fns';

const Header = ({ setMiniSidebar, setExpandMenu }) => {
    const { staffData } = useContext(AuthContext);
    const { setSearchTerms } = useContext(SearchContext)
    const location = useLocation()
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const [layoutBs, setLayoutBs] = useState(localStorage.getItem("dataTheme"));
    const [isUserInfo, setIsUserInfo] = useState(false)
    const route = all_routes;
    const name = localStorage.getItem('name') || '';
    const type = localStorage.getItem('type') || '';
    const profilePic = localStorage.getItem('profilePic') || '';
    const [customerData, setCustomerData] = useState([]);
    const [prevCustomerCount, setPrevCustomerCount] = useState(0);
    const [hasNewCustomer, setHasNewCustomer] = useState(false);

    // const profilePic = staffData?.profilePicUrl || '';

    // const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    function toggleMiniSidebar() {
        setMiniSidebar(prev => !prev)
    }
    const toggleExpandMenu = () => {
        setExpandMenu(true);
    };
    const toggleExpandMenu2 = () => {
        setExpandMenu(false);
    };
    const LayoutDark = () => {
        localStorage.setItem("dataTheme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
        setLayoutBs("dark");
    };
    const LayoutLight = () => {
        localStorage.setItem("dataTheme", "light");
        document.documentElement.setAttribute("data-theme", "light");
        setLayoutBs("light");
    };

    // const fetchCustomerData = async (page) => {
    //     try {
    //         let url = `${apiUrl}/customer/customer-list?page=${page ? page : 1}&pageSize=${5}`
    //         const response = await axios.get(url,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${Token}`
    //                 }
    //             });
    //         const formattedData = response.data.data.map((item) => ({
    //             ...item,
    //             key: item.leadId,
    //         }));
    //         setCustomerData(formattedData);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // };

    const handleSearch = (e) => {
        // console.log("value =>", e.target.value)
        setSearchTerms(e.target.value)

        if (location.pathname !== "/sales/leads") {
            navigate("/sales/leads");
        }
    }


    const fetchCustomerData = async (page) => {
        try {
            let url = `${apiUrl}/customer/customer-list?page=${page || 1}&pageSize=5`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${Token}` },
            });

            const formattedData = response.data.data.map((item) => ({
                ...item,
                key: item.leadId,
            }));

            // Check if a new customer is added
            if (formattedData.length > prevCustomerCount) {
                setHasNewCustomer(true);
            }

            setPrevCustomerCount(formattedData.length);
            setCustomerData(formattedData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCustomerData();
        const interval = setInterval(() => {
            fetchCustomerData(); // Fetch every 30 seconds
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Handle notification click (mark as read)
    const handleNotificationClick = () => {
        setHasNewCustomer(false);
    };


    // useEffect(() => {
    //     fetchCustomerData();
    // }, [])

    // const handleSearch = (e) => {
    //     e.preventDefault(); // Prevent default form submission
    //     if (searchQuery.trim()) {
    //         navigate(`/sales/leads`);
    //     }
    // };

    const handleLogout = async () => {
        try {
            if (!Token) {
                console.warn("No token found, redirecting to login...");
                // localStorage.clear();
                localStorage.removeItem("token");
                localStorage.removeItem("profilePic");
                localStorage.removeItem("name");
                localStorage.removeItem("type");
                localStorage.removeItem("staffId");

                navigate("/login");
                return;
            }

            const response = await axios.get(`${apiUrl}/staff/staffLogOut`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }
            );
            // localStorage.clear();
            localStorage.removeItem("token");
            localStorage.removeItem("profilePic");
            localStorage.removeItem("name");
            localStorage.removeItem("type");
            localStorage.removeItem("staffId");


            navigate("/login");

        } catch (error) {
            console.error("Logout failed:", error.response?.data?.message || error.message);
            // toast.error(error.message)
        }

    }

    // Notification Api
    const [notificationData, setNotificationData] = useState([]);

    const getNotification = async () => {
        try {
            let url = `${apiUrl}/product/get-all-notifications`;
            const response = await axios.get(url,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                });
            setNotificationData(response.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getNotification();
    },[])

    // console.log("notificationData", notificationData)

    // date day format
   const formatNotificationDate = (isoDateString) => {
  const date = parseISO(isoDateString); // Converts ISO string to Date object

  if (isToday(date)) {
    return `Today at ${format(date, 'hh:mm a')}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'hh:mm a')}`;
  } else if (Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return `${format(date, 'EEEE')} at ${format(date, 'hh:mm a')}`;
  } else {
    return format(date, 'MMM dd \'at\' hh:mm a'); // Jul 26 at 10:21 AM
  }
};

// Route of notification
const typeToRouteMap = {
  "Company": route.companey,
  "Lead": route.leads,
  "Company Branch": route.branch,
  "Staff": route.manageStaff,
};

    return <div className="header">
        {/* Logo */}
        <div className="header-left active" onMouseEnter={toggleExpandMenu} onMouseLeave={toggleExpandMenu2}>
            <Link to={route.salesDashboard} className="logo logo-normal w-100">
                <img src="/six-logo.png" alt="Logo" style={{ width: "135px", height: 'auto',objectFit: "contain",}} />
            </Link>
            <Link to={route.salesDashboard} className="logo-small">
                <img src="/six-logo.png" alt="Logo" style={{ width: "60px", height: 'auto' }}/>
            </Link>
            <Link id="toggle_btn" to="#" onClick={toggleMiniSidebar}>
                <i className="ti ti-arrow-bar-to-left" />
            </Link>
        </div>
        {/* /Logo */}
        <Link
            id="mobile_btn"
            className="mobile_btn"
            to="#sidebar"
        // onClick={toggleMobileSidebar}
        >
            <span className="bar-icon">
                <span />
                <span />
                <span />
            </span>
        </Link>
        <div className="header-user">
            <ul className="nav user-menu"style={{padding:"0 1px"}}>
                {/* Search */}
                <li className="nav-item nav-search-inputs me-auto">
                    <div className="top-nav-search">
                        <Link to={route.leads} className="responsive-search">
                            <i className="fa fa-search" />
                        </Link>
                        <form className="dropdown">
                            <div className="searchinputs" id="dropdownMenuClickable">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    onChange={handleSearch}
                                // onClick={() => {
                                //     navigate("/sales/leads")
                                // }}
                                />
                                <div className="search-addon">
                                    <button type="submit">
                                        <i className="ti ti-command" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>
                {/* /Search */}
                   {/* Nav List */}
                   <li className="nav-item nav-list">
                    <ul className="nav">
                        <li className="dark-mode-list">
                            <Link
                                to="#"
                                className={`dark-mode-toggle ${layoutBs ? "" : "active"}`}
                                id="dark-mode-toggle"
                            >
                                <i
                                    className={`ti ti-sun light-mode ${layoutBs === "dark" ? "" : "active"
                                        }`}
                                    onClick={LayoutLight}
                                >
                                    {" "}
                                </i>
                                <i
                                    className={`ti ti-moon dark-mode ${layoutBs === "dark" ? "active" : ""
                                        }`}
                                    onClick={LayoutDark}
                                ></i>
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link
                                to="#"
                                className="btn btn-header-list"
                                data-bs-toggle="dropdown"
                                data-tooltip-id="sevices-tooltip"
                                data-tooltip-content="Services"
                            >
                                <i className="ti ti-layout-grid-add" />
                            </Link>
                            <Tooltip id="sevices-tooltip"
                                style={{ backgroundColor: "#E0F5D7", color: "#00918E" }}
                            />
                            <div className="dropdown-menu dropdown-menu-end menus-info">
                                <div className="row">
                                    <div className="col-md-6">
                                        <ul className="menu-list">
                                            <li>
                                                <Link to={route.customerList}>
                                                    <div className="menu-details">
                                                        <span className="menu-list-icon bg-violet">
                                                            <i className="ti ti-user-up" />
                                                        </span>
                                                        <div className="menu-details-content">
                                                            <p>Contacts</p>
                                                            <span>Add New Contact</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={route.pipeline}>
                                                    <div className="menu-details">
                                                        <span className="menu-list-icon bg-green">
                                                            <i className="ti ti-timeline-event-exclamation" />
                                                        </span>
                                                        <div className="menu-details-content">
                                                            <p>Pipline</p>
                                                            <span>Add New Pipline</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={route.activities}>
                                                    <div className="menu-details">
                                                        <span className="menu-list-icon bg-pink">
                                                            <i className="ti ti-bounce-right" />
                                                        </span>
                                                        <div className="menu-details-content">
                                                            <p>Activities</p>
                                                            <span>Add New Activity</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={route.analytics}>
                                                    <div className="menu-details">
                                                        <span className="menu-list-icon bg-info">
                                                            <i className="ti ti-analyze" />
                                                        </span>
                                                        <div className="menu-details-content">
                                                            <p>Analytics</p>
                                                            <span>Shows All Information</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={route.projects}>
                                                    <div className="menu-details">
                                                        <span className="menu-list-icon bg-danger">
                                                            <i className="ti ti-atom-2" />
                                                        </span>
                                                        <div className="menu-details-content">
                                                            <p>Projects</p>
                                                            <span>Add New Project</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <ul className="menu-list">
                                            <li>
                                                <Link to={route.deals}>
                                                    <div className="menu-details">
                                                        <span className="menu-list-icon bg-info">
                                                            <i className="ti ti-medal" />
                                                        </span>
                                                        <div className="menu-details-content">
                                                            <p>Deals</p>
                                                            <span>Add New Deals</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={route.leads}>
                                                    <div className="menu-details">
                                                        <span className="menu-list-icon bg-secondary">
                                                            <i className="ti ti-chart-arcs" />
                                                        </span>
                                                        <div className="menu-details-content">
                                                            <p>Leads</p>
                                                            <span>Add New Leads </span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={route.companies}>
                                                    <div className="menu-details">
                                                        <span className="menu-list-icon bg-tertiary">
                                                            <i className="ti ti-building-community" />
                                                        </span>
                                                        <div className="menu-details-content">
                                                            <p>Company</p>
                                                            <span>Add New Company</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={route.tasks}>
                                                    <div className="menu-details">
                                                        <span className="menu-list-icon bg-success">
                                                            <i className="ti ti-list-check" />
                                                        </span>
                                                        <div className="menu-details-content">
                                                            <p>Tasks</p>
                                                            <span>Add New Task</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={route.campaign}>
                                                    <div className="menu-details">
                                                        <span className="menu-list-icon bg-purple">
                                                            <i className="ti ti-brand-campaignmonitor" />
                                                        </span>
                                                        <div className="menu-details-content">
                                                            <p>Campaign</p>
                                                            <span>Add New Campaign</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link to={route.chat} className="btn btn-help"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Chat"
                            >
                                <i className="ti ti-message-exclamation" />
                            </Link>
                            <Tooltip id="tooltip"
                                style={{ backgroundColor: "#F3EDFF", color: "#3C2371" }}
                            />

                        </li>
                        <li className="nav-item">
                            <Link to={route.audioCall} className="btn btn-help"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Audio"
                            >
                                <i className="ti ti-phone-calling" />
                            </Link>

                        </li>
                        <li className="nav-item">
                            <Link to={route.videoCall} className="btn btn-help"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Video"
                            >
                                <i className="ti ti-video-plus" />
                            </Link>

                        </li>
                        <li className="nav-item">
                            <Link to={route.callHistory} className="btn btn-help"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Call History"
                            >
                                <i className="ti ti-history-toggle" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={route.calendar} className="btn btn-help"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Calendar"
                            >
                                <i className="ti ti-calendar-month" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={route.todo} className="btn btn-help"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="ToDo"
                            >
                                <i className="ti ti-clipboard-list" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={route.notes} className="btn btn-help"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="Notes"
                            >
                                <i className="ti ti-note" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={route.fileManager} className="btn btn-help"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="File Manager"
                            >
                                <i className="ti ti-file-analytics" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={route.faq} className="btn btn-help"
                                data-tooltip-id="tooltip"
                                data-tooltip-content="FAQ"
                            >
                                <i className="ti ti-help-hexagon" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={route.membershipplan} className="btn btn-chart-pie"
                                data-tooltip-id="plans-tooltip"
                                data-tooltip-content="Plans"
                            >
                                <i className="ti ti-chart-pie" />
                            </Link>
                            <Tooltip id="plans-tooltip"
                                style={{ backgroundColor: "#FFF7D8", color: "#FFA201" }}
                            />
                        </li>
                    </ul>
                </li>
                {/* /Nav List */}
                {/* Email */}
                <li className="nav-item nav-item-email nav-item-box">
                    <Link to={route.email}
                        data-tooltip-id="email-tooltip"
                        data-tooltip-content="Email"
                    >
                        <i className="ti ti-message-circle-exclamation" />
                        <span className="badge rounded-pill">14</span>
                    </Link>
                    <Tooltip id="email-tooltip"
                        style={{ backgroundColor: "lightgrey", color: "#3E4265" }}
                    />
                </li>
                {/* /Email */}
                {/* Notifications */}
                <li className="nav-item dropdown nav-item-box">
                    <Link to="#" className="nav-link" data-bs-toggle="dropdown"
                        data-tooltip-id="email-tooltip"
                        data-tooltip-content="Notification"
                    >
                        <i className="ti ti-bell" />
                        <span className="badge rounded-pill">13</span>
                    </Link>
                    <div className="dropdown-menu dropdown-menu-end notification-dropdown">
                        <div className="topnav-dropdown-header">
                            <h4 className="notification-title">Notifications</h4>
                        </div>
                        {notificationData.length > 0 && (
                            <div className="noti-content">
                            <ul className="notification-list">
                                {notificationData.map((item, index) => (
                                     <li className="notification-message" key={index}>
                                    {/* <Link to={route.activities}> */}
                                   <Link to={typeToRouteMap[item.type]}>
                                        <div className="media d-flex align-items-center">
                                            <span className="avatar flex-shrink-0">
                                                {/* <ImageWithBasePath
                                                    src="assets/img/profiles/avatar-02.jpg"
                                                    alt="Profile"
                                                /> */}
                                                <img src={item.createdByProfilePic} alt="Profile" />
                                                <span className="badge badge-info rounded-pill" style={{left:"-4px"}}/>
                                            </span>
                                            <div className="media-body flex-grow-1">
                                                <p className="noti-details m-0">
                                                    {item.createdByName} {item.message}
                                                </p>
                                                <p className="noti-time">
                                                    {/* Last Wednesday at 9:42 am */}
                                                    {formatNotificationDate(item.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                ))}
                               
                                {/* <li className="notification-message">
                                    <Link to={route.activities}>
                                        <div className="media d-flex">
                                            <span className="avatar flex-shrink-0">
                                                <ImageWithBasePath
                                                    src="assets/img/profiles/avatar-03.jpg"
                                                    alt="Profile"
                                                />
                                            </span>
                                            <div className="media-body flex-grow-1">
                                                <p className="noti-details">
                                                    Denise Nedry replied to Anna Srzand
                                                </p>
                                                <p className="noti-sub-details">
                                                    “Oh, I finished de-bugging the phones, but the
                                                    system's compiling for eighteen minutes, or
                                                    twenty. So, some minor systems may go on and off
                                                    for a while.”
                                                </p>
                                                <p className="noti-time">
                                                    Last Wednesday at 9:42 am
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li className="notification-message">
                                    <Link to={route.activities}>
                                        <div className="media d-flex">
                                            <span className="avatar flex-shrink-0">
                                                <ImageWithBasePath
                                                    alt=""
                                                    src="assets/img/profiles/avatar-06.jpg"
                                                />
                                            </span>
                                            <div className="media-body flex-grow-1">
                                                <p className="noti-details">
                                                    John Hammond attached a file to Isla Nublar SOC2
                                                    compliance report
                                                </p>
                                                <div className="noti-pdf">
                                                    <div className="noti-pdf-icon">
                                                        <span>
                                                            <i className="ti ti-chart-pie" />
                                                        </span>
                                                    </div>
                                                    <div className="noti-pdf-text">
                                                        <p>EY_review.pdf</p>
                                                        <span>2mb</span>
                                                    </div>
                                                </div>
                                                <p className="noti-time">
                                                    Last Wednesday at 9:42 am
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </li> */}
                            </ul>
                        </div>
                        )}
                        
                        <div className="topnav-dropdown-footer">
                            <Link to={route.activities} className="view-link">
                                View all
                            </Link>
                            <Link to="#" className="clear-link">
                                Clear all
                            </Link>
                        </div>
                    </div>
                </li> 
                 {/* Notifications */}

              
                {/* Profile Dropdown */}
                <li className="nav-item dropdown has-arrow main-drop"
                    data-tooltip-id="email-tooltip"
                    data-tooltip-content="Profile">
                    <a href="#"
                        className="nav-link userset"
                        data-bs-toggle="dropdown"
                        onClick={() => { setIsUserInfo(!isUserInfo) }}>
                        <span className="user-info">
                            <span className="user-letter">
                                <img src={profilePic ? profilePic : "/assets/img/profiles/admin_default.jpeg"} alt="Profile" />
                            </span>
                            <span className="badge badge-success rounded-pill"></span>
                        </span>
                    </a>
                    <div className="dropdown-menu menu-drop-user">
                        <div className="profilename">
                            <Link className="dropdown-item" to={route.salesDashboard}>
                                <i className="ti ti-layout-2"></i> Dashboard
                            </Link>
                            <Link className="dropdown-item" to={route.profile}>
                                <i className="ti ti-user-pin"></i> My Profile
                            </Link>
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => { handleLogout() }}
                            >
                                <i className="ti ti-lock"></i> Logout
                            </button>
                        </div>
                    </div>
                </li>

                {/* Profile Dropdown */}
            </ul>
        </div>
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
            <Link
                // to="#"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="fa fa-ellipsis-v" />
            </Link>
            <div className={` dropdown-menu `}>
                <Link className="dropdown-item" to={route.salesDashboard}>
                    <i className="ti ti-layout-2" /> Dashboard
                </Link>
                <Link className="dropdown-item" to={route.profile}>
                    <i className="ti ti-user-pin" /> My Profile
                </Link>
                <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => { handleLogout() }}
                >
                    <i className="ti ti-lock"></i> Logout
                </button>
            </div>
        </div>
        {/* /Mobile Menu */}
    </div>
}


export default Header