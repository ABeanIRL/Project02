import RestaurantHeader from "../../components/RestaurantHeader";
import RestaurantFooter from "../../components/RestaurantFooter";
import { useState, useEffect } from "react";
import { Box, List, ListItem, Typography } from "@mui/material/";
import Button from "@mui/material/Button";
import ReceiptModal from "../../components/Modal/ReceiptModal";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/customerSlice";

const OrderMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    items: [],
    totalPrice: 0,
    confirmationNumber: "",
  });
  const customer = useSelector((state) => state.customer);
  const isOrderEmpty = !Object.values(quantities).some(
    (quantity) => quantity > 0
  );

  useEffect(() => {
    fetch("http://localhost:3000/restaurant/menu")
      .then((res) => res.json())
      .then((itemsJSON) => {
        setItems(itemsJSON.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    const orderItems = items
      .map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: quantities[item._id] || 0,
      }))
      .filter((item) => item.quantity > 0);

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderData = {
      customerId: customer.userInfo._id,
      deliveryAddress: customer.userInfo.address,
      firstName: customer.userInfo.firstName,
      lastName: customer.userInfo.lastName,
      items: JSON.stringify(
        orderItems.map(({ menuItem, quantity }) => ({
          menuItem,
          quantity,
        }))
      ),
    };

    fetch("http://localhost:3000/restaurant/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setOrderDetails({
            items: orderItems,
            totalPrice,
            confirmationNumber: response.data,
          });
          setModalOpen(true);
        } else {
          console.error("Failed to create order:", response.message);
        }
      })
      .catch((err) => console.error("Error:", err));
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

  const onModalClose = () => {
    setModalOpen(false);
    setOrderDetails({ items: [], totalPrice: 0, confirmationNumber: "" });
    setQuantities({});
  };

  const MenuList = ({ menuItems }) => {
    return (
      <Box
        sx={{
          width: "70%",
          marginX: "auto", // Horizontal margin
          marginY: "64px", // Vertical margin
          padding: "32px",
          backgroundColor: "#fff8f0",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e0a899",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginBottom: "24px",
            color: "#8b0000",
            fontFamily: "Georgia, serif",
          }}
        >
          Select Your Favorite Dishes
        </Typography>
        <List>
          {menuItems &&
            menuItems.map((item) => (
              <ListItem
                key={item._id}
                sx={{
                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#8b0000",
                      marginBottom: "8px",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: "#555",
                      marginBottom: "8px",
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      color: "#8b0000",
                      marginBottom: "8px",
                    }}
                  >
                    ${item.price}
                  </Typography>
                  <input
                    type="number"
                    aria-label="Quantity"
                    placeholder="How many?"
                    value={quantities[item._id] || 0}
                    onChange={(event) =>
                      handleQuantityChange(
                        item._id,
                        parseInt(event.target.value, 10) || 0
                      )
                    }
                    style={{
                      width: "50px",
                      textAlign: "center",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </Box>
              </ListItem>
            ))}
        </List>
        <Box sx={{ textAlign: "center", marginTop: "32px" }}>
          <Button
            onClick={handleSubmit}
            disabled={isOrderEmpty}
            sx={{
              backgroundColor: isOrderEmpty ? "#ccc" : "#8b0000",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: isOrderEmpty ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
              "&:hover": {
                backgroundColor: isOrderEmpty ? "#ccc" : "#a81111",
              },
            }}
          >
            Submit Order
          </Button>
        </Box>
        <ReceiptModal
          open={isModalOpen}
          onClose={onModalClose}
          orderDetails={orderDetails}
        />
      </Box>
    );
  };

  MenuList.propTypes = {
    menuItems: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
  };
  return (
    <div>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <RestaurantHeader
          user={customer.userInfo}
          handleLogout={handleLogout}
        />
      </div>
      <div style={{ paddingTop: "64px" }}>
        <MenuList menuItems={items} />
      </div>
      <div>
        <RestaurantFooter />
      </div>
    </div>
  );
};

export default OrderMenu;
