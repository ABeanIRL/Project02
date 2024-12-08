import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/driverSlice.js";
import MenuAppBar from "../../components/MenuAppBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import DeliveryTable from "./DeliveryTable.jsx";

const DriverHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const driver = useSelector((state) => state.driver);
  const [orders, setOrders] = useState({
    ready: [],
    transit: [],
    delivered: [],
  });

  useEffect(() => {
    if (driver) {
      const fetchOrders = async (status) => {
        try {
          const response = await fetch(
            `http://localhost:3000/driver/deliveries/${
              status === "transit" ? "in-transit" : status
            }`,
            { credentials: "include" }
          );
          if (response.ok) {
            const res = await response.json();
            setOrders((prev) => ({
              ...prev,
              [status]: res.data,
            }));
          } else {
            console.error(response.statusText);
          }
        } catch (error) {
          console.error(`Error fetching ${status} orders:`, error);
        }
      };
      ["ready", "transit", "delivered"].forEach(fetchOrders);
    }
  }, [driver]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/driver/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        dispatch(logout());
        navigate("/driver/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeliverUpdate = (orderId) => {
    setOrders((prev) => {
      const orderToDeliver = prev.ready.find((order) => order._id === orderId);

      if (!orderToDeliver) {
        console.error("Order not found");
        return prev;
      }

      return {
        ...prev,
        ready: prev.ready.filter((order) => order._id !== orderId),
        transit: [...prev.transit, { ...orderToDeliver, status: "transit" }],
      };
    });
  };

  const handleCompleteUpdate = (orderId) => {
    setOrders((prev) => {
      const orderToComplete = prev.transit.find(
        (order) => order._id === orderId
      );

      if (!orderToComplete) {
        console.error("Order not found");
        return prev;
      }

      return {
        ...prev,
        transit: prev.transit.filter((order) => order._id !== orderId),
        delivered: [
          ...prev.delivered,
          { ...orderToComplete, status: "delivered" },
        ],
      };
    });
  };

  return (
    <>
      <MenuAppBar user={driver.userInfo} handleLogout={handleLogout} />
      <Container>
        <Box sx={{ "&>*": { mb: 6, mt: 6 } }}>
          {Object.entries(orders).map(([status, orderList]) => (
            <DeliveryTable
              key={status}
              status={status}
              orders={orderList}
              onDeliver={handleDeliverUpdate}
              onComplete={handleCompleteUpdate}
            />
          ))}
        </Box>
      </Container>
    </>
  );
};

export default DriverHome;
