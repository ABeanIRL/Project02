import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { setDriver } from "../slice/driverSlice.js";

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

        if (response.ok) {
          const res = await response.json();
          if (res.data) {
            dispatch(setDriver({ user: res.data }));
            navigate("/driver");
          }
        }
      } catch (error) {
        console.error("Error fetching driver session data:", error);
      }
    };

    if (!driver.isAuthenticated) {
      checkSession();
    }
  }, [dispatch, driver.isAuthenticated, navigate]);

  if (!driver.isAuthenticated) {
    return <Navigate to="/driver/login" replace />;
  }

  return children;
};

DriverPrivateRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DriverPrivateRoutes;
