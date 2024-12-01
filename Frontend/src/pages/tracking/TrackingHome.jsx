import { useEffect, useState } from "react";
import OrderTable from "./OrderTable";

const TrackingHome = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3000/tracking/orders");
        if (response.ok) {
          const res = await response.json();
          console.log(res.data);
          setOrders(res.data);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <OrderTable orders={orders}></OrderTable>
    </div>
  );
};

export default TrackingHome;
