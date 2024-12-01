

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const RestaurantFooter = () => {

  return (

<Box
  sx={{
    backgroundColor: "#400000",
    padding: "2rem",
    color: "white",
    marginTop: "2rem",
  }}
>
  <Typography variant="body1" sx={{ textAlign: "center" }}>
    © 2024 Gustosa | 123 Fancy Street, Toronto, ON | 416-123-4567 | OPEN Tue - Sun 5pm - 10pm
  </Typography>
</Box>

  )};

export default RestaurantFooter;