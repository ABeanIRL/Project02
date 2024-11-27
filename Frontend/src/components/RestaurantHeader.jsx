import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Toolbar from '@mui/material/Toolbar';
import { IconButton, MenuItem, Link, Menu, Fade } from '@mui/material';
import { useState } from 'react';

const RestaurantHeader = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <AppBar
            position="static"
            color="error"
        >
            <Toolbar sx={{ minHeight: 120 }}>
                <div
                    onClick={handleClick}
                    style={{ position: 'relative' }}
                >
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

                <Typography variant="h2" component="div" sx={{ flexGrow: 1, fontFamily: 'Veranda' }}>
                    Gustosa
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={handleClose}><Link href="/restaurant" underline="none">Home</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link href="/restaurant/order" underline="none">New Order</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link href="/restaurant/myOrders" underline="none">My Orders</Link></MenuItem>
            </Menu>
        </AppBar>


    )
}

export default RestaurantHeader;