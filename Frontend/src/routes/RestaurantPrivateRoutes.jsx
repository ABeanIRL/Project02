import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { setCustomer } from "../slice/customerSlice.js";

const RestaurantPrivateRoutes = ({ children }) => {
  const customer = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/restaurant/session", {
          credentials: "include",
        });

        if (response.ok) {
          const res = await response.json();
          if (res.data) {
            dispatch(setCustomer({ user: res.data }));
            navigate("/restaurant");
          }
        }
      } catch (error) {
        console.error("Error fetching driver session data:", error);
      }
    };

    if (!customer.isAuthenticated) {
      checkSession();
    }
  }, [dispatch, customer.isAuthenticated, navigate]);

  if (!customer.isAuthenticated) {
    return <Navigate to="/restaurant/login" replace />;
  }

  return children;
};

RestaurantPrivateRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RestaurantPrivateRoutes;
