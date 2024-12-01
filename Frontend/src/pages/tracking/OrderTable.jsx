import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const OrderTable = ({ status, orders, onCancel }) => {
  const handleCancel = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/tracking/order/${orderId}/cancel`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        onCancel(orderId);
      } else {
        console.error(
          `Failed to cancel order with ID ${orderId}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error cancelling order with ID ${orderId}:`, error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            pt: 1,
          }}
        >
          Orders{" "}
          {status === "transit"
            ? "In Transit"
            : status.charAt(0).toUpperCase() + status.slice(1)}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Address</TableCell>
                {["delivered", "cancelled"].includes(status) && (
                  <TableCell align="right">Driver</TableCell>
                )}
                {["ready", "transit"].includes(status) && (
                  <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No orders available
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:nth-of-type(even)": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {order.customerId}
                    </TableCell>
                    <TableCell align="right">
                      {`${order.firstName} ${order.lastName}`}
                    </TableCell>
                    <TableCell align="right">{order.deliveryAddress}</TableCell>
                    {["delivered", "cancelled"].includes(status) && (
                      <TableCell align="right">
                        {order.driver || "None"}
                      </TableCell>
                    )}
                    {["ready", "transit"].includes(status) && (
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleCancel(order._id)}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

OrderTable.propTypes = {
  status: PropTypes.oneOf(["ready", "transit", "delivered", "cancelled"])
    .isRequired,
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      deliveryAddress: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      driver: PropTypes.string,
    })
  ),
  onCancel: PropTypes.func.isRequired,
};

export default OrderTable;
