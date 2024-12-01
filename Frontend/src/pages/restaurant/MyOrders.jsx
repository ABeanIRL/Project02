import { Typography } from "@mui/material/";
import { useState } from "react";
import RestaurantFooter from "../../components/RestaurantFooter";
import RestaurantHeader from "../../components/RestaurantHeader";

//NOW USE THE MENULIST TO DEPLAY ORDER DETAILS SOMEHOW

const MyOrders = () => {
  const [orderID, setOrderID] = useState("");
  const [orderDetails, setOrderDetails] = useState(null); // State to store the response data
  const [error, setError] = useState(null); // State to handle errors

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/restaurant/order/status",
        {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ orderID }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Good response received!");
        setOrderDetails(data);
        setError(null);
      } else {
        setError("Failed to fetch order details");
        setOrderDetails(null);
      }
    } catch (error) {
      console.error("Request failed:", error.message);
      setOrderDetails(null);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <RestaurantHeader />
      </div>
      <div style={{ margin: "100px" }}>
        <form onSubmit={handleSubmit}>
          <div>
            <p>My Orders</p>
            <input //order id(?) not username
              id="orderid"
              name="orderid"
              type="text"
              placeholder="Enter your order ID number here!"
              required
              value={orderID}
              onChange={(e) => setOrderID(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>

        {error && (
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        )}

        {orderDetails && (
          <Typography color="error" variant="body1">
            {orderDetails}
          </Typography>
        )}
      </div>
      <div style={{ marginTop: "auto" }}>
        <RestaurantFooter />
      </div>
    </div>
  );
};

export default MyOrders;
