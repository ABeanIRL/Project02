import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const OrderTable = ({ orders }) => {
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Customer&apos;s ID</TableCell>
          <TableCell align="right">Name</TableCell>
          <TableCell align="right">Address</TableCell>
          <TableCell align="right">Status</TableCell>
          <TableCell align="right">Driver</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order.name}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {order.name}
            </TableCell>
            <TableCell align="right">{order.calories}</TableCell>
            <TableCell align="right">{order.fat}</TableCell>
            <TableCell align="right">{order.carbs}</TableCell>
            <TableCell align="right">{order.protein}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>;
};

export default OrderTable;
