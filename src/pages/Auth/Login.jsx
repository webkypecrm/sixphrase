import React, { useState, useContext, useEffect } from "react";
import ImageWithBasePath from "../../components/ImageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../Router/all_routes";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthProvider";



const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { setPermissions, getStaff, staffData } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(false);
  const [writenOtp, setWritenOtp] = useState("");
  const [staffId, setStaffId] = useState(null);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Admin");

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  // const handleOtp = async () => {
  //   if (!email || !password) return toast.error("Email and Password are required");
  //   if (!validateEmail(email)) return toast.error("Invalid email format.");
  //   if (!validatePassword(password)) return toast.error("Password must be at least 6 characters long.");

  //   try {
  //     const response = await fetch(`${apiUrl}/staff/staffLogin`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password, staffType: isAdmin ? 1 : 0 }),
  //     });
  //     const data = await response.json();

  //     if (data.status === "success") {
  //       setOtp(true);
  //       setStaffId(data.data.staffId);
  //       toast.success("OTP sent successfully");
  //     } else throw new Error(data.message);
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // const response = await fetch(`${apiUrl}/staff/verify-otp`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ staffId, otp: writenOtp }),
      // });
      const response = await fetch(`${apiUrl}/staff/staffLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ email, password, staffType: isAdmin ? 1 : 0 }),
        body: JSON.stringify({
          email,
          password,
          staffType: selectedRole === "Admin" ? 1 : 0,
        }),
      });
      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("profilePic", data.data.profilePic);
        localStorage.setItem("name", data.data.name);
        localStorage.setItem("type", data.data.type);
        localStorage.setItem("staffId", data.data.staffId);

        const permissionArr = JSON.parse(data.data.permissions || "[]");

        // Save to localStorage
        localStorage.setItem("permissions", JSON.stringify(permissionArr));

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.setItem("rememberedPassword", password);
        }

        // Set to context
        setPermissions(new Set(permissionArr));

        await getStaff();

        // if(staffData?.staffId){
        navigate(all_routes.salesDashboard);
        // }
      } else throw new Error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // Retrieve saved email and rememberMe status from localStorage
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  return (
    <>
    <div className="account-content">
      <div className="login-wrapper account-bg">
        <div
          className="login-content"
          style={{ backgroundColor: "rgb(255 255 255)" }}
        >
          <form onSubmit={handleLogin}>
            <div className="login-user-info">
              <div className="login-logo">
                <img
                  src="/assets/img/webkype-logo.png"
                  className="img-fluid"
                  alt="Logo"
                  style={{
                    height: "3rem",
                  }}
                />
              </div>
              <div className="login-heading">
                {/* <h4>Sign In</h4> */}
                <p>Access the CRMS panel using your email and password.</p>
              </div>

              {!otp ? (
                <>
                  {/* <div className="login_admin">
                    {["Admin", "Staff"].map((role, index) => (
                      <div
                        key={index}
                        className="login_admin_img"
                        onClick={() => setIsAdmin(index === 0)}
                      >
                        <img src={`assets/img/authentication/${index === 0 ? "admin_default" : "staff_default"}.jpeg`} className={isAdmin === (index === 0) ? "select_type" : "btn btn-help"} />
                        <p style={{ textAlign: "center", color: isAdmin === (index === 0) ? "blue" : "" }}>{role}</p>
                      </div>
                    ))}
                  </div> */}
                  <div className="login_admin">
                    {["Admin", "Staff", "Customer"].map((role, index) => {
                      const isSelected = selectedRole === role;

                      // const imageName =
                      //   role === "Admin" ? "admin_default" : "staff_default";
                      const imageName =
                        role === "Admin"
                          ? "admin_default"
                          : role === "Staff"
                          ? "staff_default"
                          : "customer_default";

                      return (
                        <div
                          key={index}
                          className="login_admin_img"
                          onClick={() => setSelectedRole(role)}
                        >
                          <img
                            src={`assets/img/authentication/${imageName}.jpeg`}
                            className={
                              isSelected ? "select_type" : "btn btn-help"
                            }
                          />
                          <p
                            style={{
                              textAlign: "center",
                              color: isSelected ? "blue" : "",
                            }}
                          >
                            {role}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="form-wrap">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ background: "#FFF" }}
                    />
                  </div>
                  <div className="form-wrap">
                    <div className="pass-group">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        className="pass-input form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ background: "##FFF" }}
                      />
                      <span
                        className={`ti toggle-password ${
                          isPasswordVisible ? "ti-eye" : "ti-eye-off"
                        }`}
                        onClick={togglePasswordVisibility}
                      ></span>
                    </div>
                  </div>
                  <div className="form-wrap form-wrap-checkbox">
                    <div className="custom-control custom-checkbox">
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                        />
                        <span className="box" /> Remember Me
                      </label>
                    </div>
                    {/* <div className="text-end">
                      <Link className="forgot-link">
                        Reset Password?
                      </Link>
                    </div> */}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  <div className="form-wrap">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter OTP"
                      value={writenOtp}
                      onChange={(e) => setWritenOtp(e.target.value)}
                      required
                      style={{ background: "#FFF" }}
                    />
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-end"
                    style={{ width: "100%" }}
                  >
                    <button
                      type="button"
                      className="btn btn-light me-2 btn-primary"
                      style={{ background: "rgb(226 180 89)", width: "50%" }}
                      onClick={() => setOtp(false)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "50%" }}
                    >
                      Sign In
                    </button>
                  </div>
                </>
              )}

              <div className="copyright-text">
                <p>Copyright ©2025 - WEBKYPE</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;


