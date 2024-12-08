import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Fade from "@mui/material/Fade";
import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const RestaurantHeader = ({ user, handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        {!user ? (
          <>
            <Button component={Link} color="inherit" to="/restaurant/register">
              Register
            </Button>
            <Button component={Link} color="inherit" to="/restaurant/login">
              Login
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => handleLogout()}>
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
        <MenuItem component={Link} to="/restaurant" onClick={handleClose}>
          Home
        </MenuItem>
        <MenuItem component={Link} to="/restaurant/order" onClick={handleClose}>
          New Order
        </MenuItem>
        <MenuItem
          component={Link}
          to="/restaurant/my-order"
          onClick={handleClose}
        >
          My Orders
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

RestaurantHeader.propTypes = {
  handleLogout: PropTypes.func.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }),
};

export default RestaurantHeader;
