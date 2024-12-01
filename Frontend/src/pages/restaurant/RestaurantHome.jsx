import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCustomer } from "../../slice/customerSlice";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import MenuList from "../../components/MenuList";

const RestaurantHome = () => {
  const user = useSelector((state) => state.customer.value);
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  console.log(user);

  useEffect(() => {
    fetch("http://localhost:3000/restaurant")
      .then((res) => res.json())
      .then((response) => {
        setItems(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <AppBar position="static" color="error">
        <Toolbar sx={{ minHeight: 120 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Menu
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <MenuList menuItems={items} />
    </>
  );
};

export default RestaurantHome;
