import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";

const OrderTable = ({ orders }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer&apos;s ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Driver</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {order.customerId}
              </TableCell>
              <TableCell align="right">
                {`${order.firstName} ${order.lastName}`}
              </TableCell>
              <TableCell align="right">{order.deliveryAddress}</TableCell>
              <TableCell align="right">{order.status}</TableCell>
              <TableCell align="right">{order.driver || "None"}</TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

OrderTable.propTypes = {
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
};

export default OrderTable;
