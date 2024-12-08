import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { logout, setCredentials } from "../features/auth/driverSlice.js";

const DriverPrivateRoutes = ({ children }) => {
  const driver = useSelector((state) => state.driver);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/driver/session", {
          credentials: "include",
        });
        const res = await response.json();
        if (res.data) {
          dispatch(setCredentials(res.data));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        localStorage.removeItem("driverUser");
        console.error("Error fetching driver session data:", error);
      }
    };
    checkSession();
    if (!driver.userInfo) navigate("/driver/login");
  }, []);

  if (!driver.userInfo) {
    return <Navigate to="/driver/login" replace />;
  }

  return children;
};

DriverPrivateRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DriverPrivateRoutes;
