import React, { useState } from "react";
import ImageWithBasePath from '../../../components/ImageWithBasePath'
import { Link } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import CollapseHeader from '../../../components/CollapseHeader/CollapseHeader';
const route = all_routes;
const Appearance = () => {
  const options1 = [
    { value: "large", label: "Large - 250px" },
    { value: "small", label: "Small - 85px" },
  ];

  const options2 = [
    { value: "noto-sans", label: "Noto Sans" },
    { value: "nunito", label: "Nunito" },
  ];
  const [isActive, setIsActive] = useState(null);

  const setActive = (theme) => {
    setIsActive(theme);
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-8">
                    <h4 className="page-title">Settings</h4>
                  </div>
                  <div className="col-4 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              {/* Settings Menu */}
              <div className="card settings-tab">
                <div className="card-body pb-0">
                  <div className="settings-menu">
                    <ul className="nav">
                      <li>
                        <Link to={route.profile}>
                          <i className="ti ti-settings-cog" /> General Settings
                        </Link>
                      </li>
                      <li>
                        <Link to={route.companySettings} className="active">
                          <i className="ti ti-world-cog" /> Website Settings
                        </Link>
                      </li>
                      <li>
                        <Link to={route.invoiceSettings}>
                          <i className="ti ti-apps" /> App Settings
                        </Link>
                      </li>
                      <li>
                        <Link to={route.emailSettings}>
                          <i className="ti ti-device-laptop" /> System Settings
                        </Link>
                      </li>
                      <li>
                        <Link to={route.paymentGateways}>
                          <i className="ti ti-moneybag" /> Financial Settings
                        </Link>
                      </li>
                      <li>
                        <Link to={route.storage}>
                          <i className="ti ti-flag-cog" /> Other Settings
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Settings Menu */}
              <div className="row">
                <div className="col-xl-3 col-lg-12 theiaStickySidebar">
                  {/* Settings Sidebar */}
                  <div className="card">
                    <div className="card-body">
                      <div className="settings-sidebar">
                        <h4>Website Settings</h4>
                        <ul>
                          <li>
                            <Link to={route.companySettings}>
                              Company Settings
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
                            <Link to={route.appearance} className="active">
                              Appearance
                            </Link>
                          </li>
                          <li>
                            <Link to={route.language}>Language</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* /Settings Sidebar */}
                </div>
                <div className="col-xl-9 col-lg-12">
                  {/* Appearance */}
                  <div className="card">
                    <div className="card-body settings-form">
                      <div className="settings-header">
                        <h4>Appearance</h4>
                      </div>
                      <form>
                        <div className="profile-details border-0 mb-0">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="setting-title">
                                <h6>Select Theme</h6>
                                <p>Select theme of the website</p>
                              </div>
                            </div>
                            <div className="col-md-8">
                              <div className="form-wrap mb-0">
                                <div className="theme-type-images d-flex align-items-center mb-4">
                                  <div
                                    className={`theme-image ${
                                      isActive === "Light" ? "active" : ""
                                    }`}
                                    onClick={() => setActive("Light")}
                                  >
                                    <div className="theme-image-set">
                                      <ImageWithBasePath
                                        src="assets/img/theme/theme-01.jpg"
                                        alt="Light Theme"
                                      />
                                    </div>
                                    <span>Light</span>
                                  </div>
                                  <div
                                    className={`theme-image ${
                                      isActive === "Dark" ? "active" : ""
                                    }`}
                                    onClick={() => setActive("Dark")}
                                  >
                                    <div className="theme-image-set">
                                      <ImageWithBasePath
                                        src="assets/img/theme/theme-02.jpg"
                                        alt="Dark Theme"
                                      />
                                    </div>
                                    <span>Dark</span>
                                  </div>
                                  <div
                                    className={`theme-image ${
                                      isActive === "Automatic" ? "active" : ""
                                    }`}
                                    onClick={() => setActive("Automatic")}
                                  >
                                    <div className="theme-image-set">
                                      <ImageWithBasePath
                                        src="assets/img/theme/theme-03.jpg"
                                        alt="Automatic Theme"
                                      />
                                    </div>
                                    <span>Automatic</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="setting-title">
                                <h6>Accent Color</h6>
                                <p>Select accent color of website</p>
                              </div>
                            </div>
                            <div className="col-md-8">
                              <div className="form-wrap">
                                <div className="theme-colors">
                                <ul>
                            <li>
                              <span
                                className={`themecolorset defaultcolor ${
                                  isActive === "defaultcolor" ? "active" : ""
                                }`}
                                onClick={() => setActive("defaultcolor")}
                              ></span>
                            </li>
                            <li>
                              <span
                                className={`themecolorset theme-violet ${
                                  isActive === "theme-violet" ? "active" : ""
                                }`}
                                onClick={() => setActive("theme-violet")}
                              ></span>
                            </li>
                            <li>
                              <span
                                className={`themecolorset theme-blue ${
                                  isActive === "theme-blue" ? "active" : ""
                                }`}
                                onClick={() => setActive("theme-blue")}
                              ></span>
                            </li>
                            <li>
                              <span
                                className={`themecolorset theme-brown ${
                                  isActive === "theme-brown" ? "active" : ""
                                }`}
                                onClick={() => setActive("theme-brown")}
                              ></span>
                            </li>
                          </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="setting-title">
                                <h6>Expand Sidebar</h6>
                                <p>To display in all the pages</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <div className="status-toggle">
                                  <input
                                    type="checkbox"
                                    id="prefer3"
                                    className="check"
                                    defaultChecked
                                  />
                                  <label
                                    htmlFor="prefer3"
                                    className="checktoggle"
                                  >
                                    {" "}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="setting-title">
                                <h6>Sidebar Size</h6>
                                <p>Select size of sidebar to display</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <Select
                                  className="select"
                                  defaultValue={options1[0]}
                                  options={options1}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="setting-title">
                                <h6>Font Family</h6>
                                <p>Select font family of website</p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-wrap">
                                <Select
                                  className="select"
                                  defaultValue={options2[0]}
                                  options={options2}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="submit-button">
                          <Link to="#" className="btn btn-light">
                            Cancel
                          </Link>
                          <button type="submit" className="btn btn-primary">
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* /Appearance */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearance;
