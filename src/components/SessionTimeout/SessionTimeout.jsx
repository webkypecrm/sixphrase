import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SessionTimeout = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const Token = localStorage.getItem('token') || '';
    const navigate = useNavigate();
    const timeoutRef = useRef(null); //  Persistent reference for timeout
    

    // const logout = () => {
    //     localStorage.removeItem("token"); // Remove session token
    //     navigate("/login"); // Redirect to login page
    // };

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${apiUrl}/staff/staffLogOut`,
                {
                    headers: {
                        Authorization: `Bearer ${Token}`
                    }
                }
            );
            localStorage.removeItem('token');
            localStorage.removeItem('profilePic');
            localStorage.removeItem('name');
            localStorage.removeItem('type');
            localStorage.removeItem('staffId');

            navigate("/login");

        } catch (error) {
            console.error("Logout failed:", error.response?.data?.message || error.message);
            // toast.error(error.message)
        }

    }

    const resetTimer = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current); //  Correctly clear the previous timeout
        timeoutRef.current = setTimeout(handleLogout, 30 * 60 * 1000); //  Set new timeout for 30 min
        // console.log("Timeout ID:", timeoutRef.current);
    };

    useEffect(() => {
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("scroll", resetTimer);

        resetTimer(); //  Start the timer on mount

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current); //  Clear timeout on unmount
            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keypress", resetTimer);
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("scroll", resetTimer);
        };
    }, []);

    return null; // Component does not render anything
};

export default SessionTimeout;
