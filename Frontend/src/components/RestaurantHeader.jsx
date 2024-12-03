import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import { IconButton, MenuItem, Link, Menu, Fade } from "@mui/material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCustomer } from "../slice/customerSlice";
import { useNavigate } from "react-router-dom";

const RestaurantHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const customer = useSelector((state) => state.customer.value);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/restaurant/logout", {
        method: "POST",
      });
      const res = response.json();
      if (response.ok) {
        dispatch(clearCustomer());
        navigate("/restaurant");
      } else {
        console.error("Failed to logout", res.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppBar position="static" color="error">
      <Toolbar sx={{ minHeight: 120 }}>
        <div onClick={handleClick} style={{ position: "relative" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
        </div>

        <Typography
          variant="h2"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "Courier" }}
        >
          Gustosa
        </Typography>
        {customer ? (
          <>
            <Button color="inherit" href="/restaurant/register">
              Register
            </Button>
            <Button color="inherit" href="/restaurant/login">
              Login
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>
          <Link href="/restaurant" underline="none">
            Home
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="/restaurant/order" underline="none">
            New Order
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link href="/restaurant/myOrders" underline="none">
            My Orders
          </Link>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default RestaurantHeader;
