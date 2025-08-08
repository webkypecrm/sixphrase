import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

// let num = 0;

export const AuthProvider = ({ children }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [staffData, setStaffData] = useState({});
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // Initialize with token from localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(!localStorage.getItem("token")); // Check if token exists
    const [permissions, setPermissions] = useState(new Set());

    const login = (newToken) => {
        localStorage.setItem("token", newToken); // Save token to localStorage
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token"); // Remove token
        localStorage.removeItem("permissions"); // Remove permissions
        setToken("");
        setIsAuthenticated(false);
        setStaffData({}); // Clear staff data on logout
        setPermissions(new Set());
    };
    

    // const getStaff = async () => {
    //     const url = `${apiUrl}/staff/staff`;
    //     try {
    //         const response = await fetch(url, {
    //             method: "GET",
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         if (data.status === "success") {
    //             setStaffData(data.data);
    //             let permissionArr = [];
    //             if (Array.isArray(data.data.Permissions)) {
    //                 permissionArr = data.data.Permissions
    //             } else {
    //                 permissionArr = JSON.parse(data.data.Permissions);
    //             }

    //             setPermissions(new Set(permissionArr))
    //         } else {
    //             toast.error("Failed to fetch employee data");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching staff data:", error);
    //         toast.error("An error occurred while fetching staff data");
    //     }
    // };

const getStaff = async () => {
    try {
      const response = await fetch(`${apiUrl}/staff/staff`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.status === "success") {
        setStaffData(data.data);

        let permissionArr = [];
        if (Array.isArray(data.data.Permissions)) {
          permissionArr = data.data.Permissions;
        } else {
          permissionArr = JSON.parse(data.data.Permissions || "[]");
        }

        setPermissions(new Set(permissionArr));
        localStorage.setItem("permissions", JSON.stringify(permissionArr)); // store locally ✅
      } else {
        toast.error("Failed to fetch employee data");
      }
    } catch (error) {
      console.error("Error fetching staff data:", error);
      toast.error("An error occurred while fetching staff data");
    }
  };





    const checkTokenExpiration = () => {
        const expirationTime = localStorage.getItem("tokenExpiration");

        if (expirationTime && Date.now() >  9 * 60 * 60 * 1000) {
            logout(); // Expire the session if time is up
        }
    };

    useEffect(() => {
        checkTokenExpiration(); // Check expiration when the app starts
        if (token) {
            getStaff();
        }

        // Set up an interval to check token expiration every minute
        const interval = setInterval(checkTokenExpiration, 60 * 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [token]);
    // num++
    // console.log(num)
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, staffData, setToken, permissions, setPermissions, getStaff }}>
            {children}
        </AuthContext.Provider>
    );
};
