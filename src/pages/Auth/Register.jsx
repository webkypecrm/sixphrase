import React, { useState } from "react";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import { Link } from "react-router-dom";
import { all_routes } from "../Router/all_routes";


const Register = () => {
    const route = all_routes;
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        confirmPassword: false,
    });

    const togglePasswordVisibility = (field) => {
        setPasswordVisibility((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };
    return (
        <div className="account-content">
            <div className="login-wrapper account-bg register-bg">
                <div className="login-content">
                    <form>
                        <div className="login-user-info">

                            <div className="login-logo">
                                <img
                                    src="/assets/img/webkype_img.png"
                                    className="img-fluid"
                                    alt="Logo"
                                />
                            </div>
                            <div className="login-heading">
                                <h4>Free signup for kypeCrm</h4>
                                <p>Team will call back for account activation.</p>
                            </div>
                            <div className="form-wrap">
                                {/* <label className="col-form-label">Name</label> */}
                                <div className="form-wrap-icon">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Company Name"
                                    />
                                    <i className="ti ti-user" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-wrap" >

                                        {/* <label className="col-form-label">Name</label> */}
                                        <div className="form-wrap-icon">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Industry"
                                            />
                                            <i className="ti ti-user" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap" >
                                        {/* <label className="col-form-label">Name</label> */}
                                        <div className="form-wrap-icon">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Number of Users"
                                            />
                                            <i className="ti ti-user" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        {/* <label className="col-form-label">Name</label> */}
                                        <div className="form-wrap-icon">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Contact Name"
                                            />
                                            <i className="ti ti-user" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        {/* <label className="col-form-label">Name</label> */}
                                        <div className="form-wrap-icon">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Contact Number"
                                            />
                                            <i className="ti ti-user" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-wrap">
                                {/* <label className="col-form-label">Email Address</label> */}
                                <div className="form-wrap-icon">
                                    <input type="text" className="form-control" placeholder="Login Email Address" />
                                    <i className="ti ti-mail" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        {/* <label className="col-form-label">Password</label> */}
                                        <div className="pass-group">
                                            <input
                                                type={passwordVisibility.password ? "text" : "password"}
                                                className="pass-input form-control"
                                                placeholder="Login Password"
                                            />
                                            <span
                                                className={`ti toggle-passwords ${passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                                                    }`}
                                                onClick={() => togglePasswordVisibility("password")}
                                            ></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-wrap">
                                        {/* <label className="col-form-label">Confirm Password</label> */}
                                        <div className="pass-group">
                                            <input
                                                type={
                                                    passwordVisibility.confirmPassword ? "text" : "password"
                                                }
                                                className="pass-input form-control"
                                                placeholder="Confirm Login Password"
                                            />
                                            <span
                                                className={`ti toggle-passwords ${passwordVisibility.confirmPassword
                                                    ? "ti-eye"
                                                    : "ti-eye-off"
                                                    }`}
                                                onClick={() => togglePasswordVisibility("confirmPassword")}
                                            ></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-wrap form-wrap-checkbox">
                                <div className="custom-control custom-checkbox">
                                    <label className="check">
                                        <input type="checkbox" />
                                        <span className="box" />I agree to the{" "}
                                        <Link to="#" className="forgot-link ms-1">
                                            Terms &amp; Privacy
                                        </Link>
                                    </label>
                                </div>
                            </div>
                            <div className="form-wrap">
                                <Link to={route.login} className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </div>
                            <div className="login-form">
                                <h6>
                                    Already have an account?
                                    <Link to={route.login} className="hover-a">
                                        {" "}
                                        Sign In Instead
                                    </Link>
                                </h6>
                            </div>
                            {/* <div className="form-set-login or-text">
                                <h4>OR</h4>
                            </div> */}
                            <div className="login-social-link">
                                <ul className="nav" style={{ visibility: "hidden" }}>
                                    <li >
                                        <Link to="#" className="facebook-logo">
                                            <ImageWithBasePath
                                                src="assets/img/icons/facebook-logo.svg"
                                                alt="Facebook"
                                            />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <ImageWithBasePath
                                                src="assets/img/icons/google-logo.svg"
                                                alt="Google"
                                            />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="apple-logo">
                                            <ImageWithBasePath
                                                src="assets/img/icons/apple-logo.svg"
                                                alt="Apple"
                                            />
                                        </Link>
                                    </li>
                                </ul>
                                <div className="copyright-text">
                                    <p>Copyright ©2024 - WEBKYPE</p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
