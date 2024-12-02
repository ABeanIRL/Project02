import { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce.js"
import OrderTable from "./OrderTable";
import SearchAppBar from "./SearchAppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const TrackingHome = () => {
  const [orders, setOrders] = useState({
    ready: [],
    transit: [],
    delivered: [],
    cancelled: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchRequest = useDebounce(async () => {
    if (!searchTerm.trim()) return;
    try {
      const response = await fetch(
        `http://localhost:3000/tracking/orders/by/customer`,
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ customerId: searchTerm }),
        }
      );
      if (response.ok) {
        const res = await response.json();
        setOrders({
          ready: res.data.ready || [],
          transit: res.data.transit || [],
          delivered: res.data.delivered || [],
          cancelled: res.data.cancelled || [],
        });
      } else {
        console.error("Search failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  })

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearchRequest();
  };

  useEffect(() => {
    const fetchOrders = async (status) => {
      try {
        const response = await fetch(
          `http://localhost:3000/tracking/orders/${status}`
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
    ["ready", "transit", "delivered", "cancelled"].forEach(fetchOrders);
  }, []);

  const handleCancelUpdate = (orderId) => {
    setOrders((prev) => {
      const orderToCancel =
        prev.ready.find((order) => order._id === orderId) ||
        prev.transit.find((order) => order._id === orderId);

      if (!orderToCancel) {
        console.error("Order not found or not cancellable");
        return prev;
      }

      return {
        ...prev,
        ready: prev.ready.filter((order) => order._id !== orderId),
        transit: prev.transit.filter((order) => order._id !== orderId),
        cancelled: [
          ...prev.cancelled,
          { ...orderToCancel, status: "cancelled" },
        ],
      };
    });
  };

  return (
    <>
      <SearchAppBar
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <Container>
        <Box sx={{ "&>*": { mb: 6, mt: 6 } }}>
          {Object.entries(orders).map(([status, orderList]) => (
            <OrderTable
              key={status}
              status={status}
              orders={orderList}
              onCancel={handleCancelUpdate}
            />
          ))}
        </Box>
      </Container>
    </>
  );
};

export default TrackingHome;
