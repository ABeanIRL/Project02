// import RestaurantHeader from "../../components/RestaurantHeader";
 import { Box, List, ListItem, Typography, TextField } from "@mui/material/";
 import { useState } from "react";
// import PropTypes from "prop-types";

//NOW USE THE MENULIST TO DEPLAY ORDER DETAILS SOMEHOW

const MyOrders = () => {
  const [orderID, setOrderID] = useState("");
  const [orderDetails, setOrderDetails] = useState(null); // State to store the response data
  const [error, setError] = useState(null); // State to handle errors

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/restaurant/register",
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
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      console.error("Request failed:", error.message);
    }
  };

  return (
    <div>
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
  );
};

export default MyOrders;