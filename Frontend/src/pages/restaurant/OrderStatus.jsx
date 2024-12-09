import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import RestaurantHeader from "../../components/RestaurantHeader";
import RestaurantFooter from "../../components/RestaurantFooter";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/customerSlice";

const OrderStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderID, setOrderID] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const customer = useSelector((state) => state.customer);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/restaurant/order/status",
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ orderId: orderID }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data.data);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const options = { hour: "numeric", minute: "numeric", hour12: true };

    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], options)}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], options)}`;
    } else {
      return `on ${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })} at ${date.toLocaleTimeString([], options)}`;
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/restaurant/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        dispatch(logout());
        navigate("/restaurant");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#ffe6e6",
        color: "#7b2b2b",
      }}
    >
      <Box sx={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <RestaurantHeader
          user={customer.userInfo}
          handleLogout={handleLogout}
        />
      </Box>

      <Box sx={{ padding: "120px 24px", flexGrow: 1 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginBottom: "24px",
            fontFamily: "Cormorant Garamond, serif",
          }}
        >
          Track Your Order
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <TextField
            id="orderid"
            name="orderid"
            variant="outlined"
            label="Order ID"
            placeholder="Enter your order ID"
            fullWidth
            value={orderID}
            onChange={(e) => setOrderID(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#7b2b2b",
              color: "white",
              "&:hover": {
                backgroundColor: "#5c1d1d",
              },
            }}
          >
            Submit
          </Button>
        </Box>

        {error && (
          <Typography
            color="error"
            variant="body1"
            sx={{ textAlign: "center", marginTop: 2 }}
          >
            {error}
          </Typography>
        )}

        {orderDetails && (
          <Card
            sx={{
              marginTop: 4,
              backgroundColor: "#fdf1f1",
              maxWidth: "600px",
              margin: "24px auto",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Cormorant Garamond, serif",
                  marginBottom: "16px",
                }}
              >
                Order Details
              </Typography>
              <Typography variant="body1">
                <strong>Customer Name:</strong> {orderDetails.firstName}{" "}
                {orderDetails.lastName}
              </Typography>
              <Typography variant="body1">
                <strong>Delivery Address:</strong>{" "}
                {orderDetails.deliveryAddress}
              </Typography>
              <Typography variant="body1">
                <strong>Time Ordered:</strong>{" "}
                {formatDate(orderDetails.createdAt)}
              </Typography>

              {/* IF ORDER IS cancelled show the time in red */}
              {orderDetails.status === "CANCELLED" && (
                <div>
                  <Typography variant="body1" color="red">
                    <strong>Your order was cancelled </strong>{" "}
                    {formatDate(orderDetails.updatedAt)}
                  </Typography>
                </div>
              )}

              {/* IF ORDER IS IN TRANSIt show that the driver picked up the meal */}
              {orderDetails.status === "READY_FOR_DELIVERY" && (
                <div>
                  <Typography variant="body1" color="orange">
                    <strong>Your meal was cooked </strong>{" "}
                    {formatDate(orderDetails.updatedAt)}
                  </Typography>
                </div>
              )}

              {/* IF ORDER IS IN TRANSIt show that the driver picked up the meal */}
              {orderDetails.status === "IN_TRANSIT" && (
                <div>
                  <Typography variant="body1" color="orange">
                    <strong>Your driver picked up your meal </strong>{" "}
                    {formatDate(orderDetails.updatedAt)}
                  </Typography>
                  <Typography variant="body1" color="black">
                    {orderDetails.driver.firstName} will deliver your meal in a {orderDetails.driver.modelColor} {orderDetails.driver.vehicleModel} with license plate {orderDetails.driver.licensePlate}.
                  </Typography>
                </div>
              )}

              {/* if order is delivered, show picture and time delivered in green */}
              {orderDetails.status === "DELIVERED" && (
                <div>
                  <Typography variant="body1" color="green">
                    <strong>Your meal was delivered </strong>{" "}
                    {formatDate(orderDetails.updatedAt)}
                  </Typography>
                  <Typography variant="body1" color="black">
                    {orderDetails.driver.firstName} delivered your meal in a {orderDetails.driver.modelColor} {orderDetails.driver.vehicleModel} with license plate {orderDetails.driver.licensePlate}.
                  </Typography>
                  <Paper
                    component="img"
                    src={`data:image/jpeg;base64,${orderDetails.imageData}`}
                    alt={`Order ${orderDetails._id} Image`}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      objectFit: "contain",
                      display: "block",
                      margin: "0 auto",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              )}
              <Divider sx={{ marginY: 2 }} />
              <Typography variant="body1" gutterBottom>
                <strong>Items:</strong>
              </Typography>
              <List>
                {orderDetails.items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={item.menuItem.name}
                      secondary={`Quantity: ${
                        item.quantity
                      } - $${item.menuItem.price.toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Typography
                variant="body1"
                sx={{ marginTop: 2, fontWeight: "bold" }}
              >
                Total: ${orderDetails.total.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      <Box sx={{ marginTop: "auto" }}>
        <RestaurantFooter />
      </Box>
    </Box>
  );
};

export default OrderStatus;
