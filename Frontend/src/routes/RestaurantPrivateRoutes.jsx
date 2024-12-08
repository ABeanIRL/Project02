import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { logout, setCredentials } from "../features/auth/customerSlice.js";

const RestaurantPrivateRoutes = ({ children }) => {
  const customer = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/restaurant/session",
          {
            credentials: "include",
          }
        );
        const res = await response.json();
        if (res.data) {
          dispatch(setCredentials(res.data));
          navigate("/restaurant/order");
        } else {
          dispatch(logout());
        }
      } catch (error) {
        localStorage.removeItem("customerUser");
        console.error("Error fetching customer session data:", error);
      }
    };
    checkSession();
    if (!customer.userInfo) navigate("/restaurant/login");
  }, []);

  if (!customer.userInfo) {
    return <Navigate to="/restaurant/login" replace />;
  }

  return children;
};

RestaurantPrivateRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RestaurantPrivateRoutes;
