import { useEffect, useState } from "react";
import Sidebar from "../components/Layouts/Sidebar/Sidebar";
import Header from "../components/Layouts/Header/Header";

// import SalesDashboard from "../components/Content/SalesDashboard"
import { Outlet } from "react-router-dom";
import ThemeSettings from "../components/Layouts/ThemeSetting/ThemeSetting";
import { HeaderCollapseContext } from "../context/HeaderCollapseContext";
import { useLocation } from "react-router-dom";

const Feature = () => {
  const [miniSidebar, setMiniSidebar] = useState(false);
  const [expandMenu, setExpandMenu] = useState(false);
  const [headerCollapse, setHeaderCollapse] = useState(false);
  const [mobileSidebar, setmobileSidebar] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  // sidebar chota k liye
  const { pathname } = useLocation();

   useEffect(() => {
    if (pathname.toLowerCase().includes("chatbot")) {
      setMiniSidebar(true); // Collapse on dashboard
    } else {
      setMiniSidebar(false); // Expand elsewhere if needed
    }
  }, [pathname]);

  return (
    <HeaderCollapseContext.Provider
      value={{ headerCollapse, setHeaderCollapse }}
    >
      <div
        className={`
      ${miniSidebar ? "mini-sidebar" : ""}
      ${expandMenu ? "expand-menu" : ""}`}
      >
        <div
          className={`main-wrapper 
        ${headerCollapse ? "header-collapse" : ""} 
        ${mobileSidebar ? "slide-nav" : ""}`}
        >
          <Header
            setMiniSidebar={setMiniSidebar}
            setExpandMenu={setExpandMenu}
          />
          <Sidebar setExpandMenu={setExpandMenu} miniSidebar={miniSidebar}/>
          <Outlet />
          {/* <ThemeSettings themeOpen={themeOpen} setThemeOpen={setThemeOpen} /> */}
        </div>
        <div className="sidebar-overlay"></div>
        {/* </div> */}
        <div
          className={`sidebar-themeoverlay ${themeOpen ? "open" : ""}`}
          onClick={() => setThemeOpen(!themeOpen)}
        ></div>
      </div>
    </HeaderCollapseContext.Provider>
  );
};

export default Feature;
