import RestaurantHeader from "../../components/RestaurantHeader";
import NewOrderMenuList from "../../components/NewOrderMenuList";
import { Box, List, ListItem, Typography, TextField } from "@mui/material/";
import PropTypes from "prop-types";

const Menu = () => {
  const user = {
    email: "jupiter@gmail.com",
    username: "jupiter",
    firstName: "Jupiter",
    lastName: "Patel",
    address: "238 Country RD 10",
    _id: "67466dc0b19bf590cf17fdbf",
  };

  const MenuList = ({ menuItems }) => {
    return (
      <Box
        sx={{
          width: "60%",
          padding: "64px",
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          marginTop: "128px",
        }}
      >
        <List>
          {menuItems &&
            menuItems.map((item) => {
              return (
                <ListItem
                  key={item._id}
                  sx={{
                    borderBottom: "1px solid rgb(0, 0, 0, 0.2)",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {item.description}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ marginTop: "8px", fontWeight: "bold" }}
                    >
                      ${item.price}
                    </Typography>
                    <TextField> </TextField>
                  </Box>
                </ListItem>
              );
            })}
        </List>
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
      <NewOrderMenuList />
      <RestaurantHeader />
    </div>
  );
};

export default Menu;
