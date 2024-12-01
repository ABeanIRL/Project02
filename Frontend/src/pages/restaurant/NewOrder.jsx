import RestaurantHeader from "../../components/RestaurantHeader";
import RestaurantFooter from "../../components/RestaurantFooter";

import { useState, useEffect, forwardRef } from "react";
import { Box, List, ListItem, Typography } from "@mui/material/";
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import PropTypes from "prop-types";

const Menu = () => {
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/restaurant")
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
    const orderItems = items.map((item) => ({
      menuItem: item._id,
      quantity: quantities[item._id] || 0,
    })).filter(item => item.quantity > 0);
  
const dummyUser = {
  "success": true,
  "code": 200,
  "message": "User returned successfully",
  "data": {
      "_id": "67466dc0b19bf590cf17fdbf",
      "email": "jupiter@gmail.com",
      "username": "jupiter",
      "firstName": "Jupiter",
      "lastName": "Patel",
      "address": "238 Country RD 10",
      "__v": 0
  }
}

    const orderData = {
      customerId: dummyUser.data._id,
      firstName: dummyUser.data.firstName,
      lastName: dummyUser.data.lastName,
      deliveryAddress: dummyUser.data.address,
      items: orderItems,
    };
    console.log(JSON.stringify(orderData))
    fetch("http://localhost:3000/restaurant/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          console.log("Order created successfully:", response.data);
        } else {
          console.error("Failed to create order:", response.message);
        }
      })
      .catch((err) => console.error("Error:", err));
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
            <NumberInput
            aria-label="Quantity"
            placeholder="How many?"
            value={quantities[item._id] || 0}
            onChange={(event, value) =>
              handleQuantityChange(item._id, value)
            }
            />
          </Box>
          </ListItem>
        ))}
      </List>
      <Box sx={{ textAlign: "center", marginTop: "32px" }}>
        <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#8b0000",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#a81111")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#8b0000")}
        >
        Submit Order
        </button>
      </Box>
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
        <RestaurantHeader />
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

const NumberInput = forwardRef(function CustomNumberInput(props, ref) {
  const [value, setValue] = useState(0);

  const handleChange = (event, val) => {
    setValue(val);
  };

  
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: '▴',
        },
        decrementButton: {
          children: '▾',
        },
      }}
      value={value}
      onChange={handleChange}
      {...props}
      ref={ref}
    />
  );
});

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 8px;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  &:hover {
    border-color: ${blue[400]};
  }

  /* firefox */
  &:focus-visible {
    outline: 0;
  }
`,
);

const StyledInputElement = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`,
);

const StyledButton = styled('button')(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 0;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;

    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;

    &:hover {
      cursor: pointer;
      background: ${blue[400]};
      color: ${grey[50]};
    }

  border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
  color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
  }

  & .arrow {
    transform: translateY(-1px);
  }
`,
);

export default Menu;
