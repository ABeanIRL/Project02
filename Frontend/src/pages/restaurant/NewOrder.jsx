import RestaurantHeader from "../../components/RestaurantHeader";
import { useState, useEffect, forwardRef } from "react";
import { Box, List, ListItem, Typography } from "@mui/material/";
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import PropTypes from "prop-types";
//import { styled } from '@mui/system';

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
    items.forEach((item) => {
      const quantity = quantities[item._id] || 0;
      console.log(`Item: ${item.name}, Quantity: ${quantity}`);
    });
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
                    <NumberInput
                      aria-label="Demo number input"
                      placeholder="How many do you want?"
                      value={quantities[item._id] || 0}
                      onChange={(event, value) => handleQuantityChange(item._id, value)}
                    />
                  </Box>
                </ListItem>
              );
            })}
        </List>
        <button onClick={handleSubmit}>Submit Order</button>
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
      <RestaurantHeader />
      <MenuList menuItems={items} />
    </div>
  );
};

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
