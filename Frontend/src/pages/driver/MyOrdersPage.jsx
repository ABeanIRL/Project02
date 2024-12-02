import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const driver = useSelector((state) => state.driver.driver); // Get logged-in driver info from Redux store

  useEffect(() => {
    // Fetch orders filtered by ORDER_STATUS and driver
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders`, {
          params: {
            status: "READY_FOR_DELIVERY",
            driverId: driver._id,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (driver) fetchOrders();
  }, [driver]);

  if (!driver) {
    return <p>Please log in as a driver to view your orders.</p>;
  }

  return (
    <div>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders available for delivery.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Delivery Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{`${order.firstName} ${order.lastName}`}</td>
                <td>{order.deliveryAddress}</td>
                <td>
                  <Link to={`/tracking/fulfillment/${order._id}`}>
                    <button>Fulfill Order</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrdersPage;
