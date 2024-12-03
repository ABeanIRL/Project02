import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoutes = ({ children, userType }) => {
  const driver = useSelector((state) => state.driver);
  const customer = useSelector((state) => state.customer);

  const isAuthenticated =
    userType === "driver"
      ? driver.isAuthenticated
      : userType === "customer"
      ? customer.isAuthenticated
      : null;

  if (!isAuthenticated) {
    if (userType === "driver") {
      return <Navigate to="/driver/login" replace />;
    }
    if (userType === "customer") {
      return <Navigate to="/restaurant/login" replace />;
    }
  }

  if (userType === "driver" && driver.isAuthenticated) {
    return <Navigate to="/driver" replace />;
  }
  if (userType === "customer" && customer.isAuthenticated) {
    return <Navigate to="/restaurant" replace />;
  }
  return children;
};

PrivateRoutes.propTypes = {
  userType: PropTypes.oneOf(["driver", "customer"]).isRequired,
  children: PropTypes.node.isRequired,
};

export default PrivateRoutes;
