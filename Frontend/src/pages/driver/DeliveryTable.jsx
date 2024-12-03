import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RemoveIcon from "@mui/icons-material/Remove";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import PropTypes from "prop-types";
import UploadModal from "../../components/UploadModal";
import React, { useMemo, useState } from "react";

const DeliveryTable = ({ status, orders, onDeliver, onComplete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const handleDeliver = async (orderId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/driver/delivery/${orderId}/in-transit`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        onDeliver(orderId);
      } else {
        console.error(
          `Failed to deliver order with ID ${orderId}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error delivering order with ID ${orderId}:`, error);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const uploadImage = async (orderId, formData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/driver/delivery/${orderId}/complete`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      onComplete(orderId);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleClick = (order) => {
    if (status === "ready") {
      // If the status is "ready", start delivery
      handleDeliver(order._id);
    } else if (status === "transit") {
      // If the status is "transit", open the modal to confirm completion
      openCompleteModal(order);
    }
  };

  const openCompleteModal = (order) => {
    setCurrentOrder(order);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setCurrentOrder(null);
  };

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
    setExpandedRows(() =>
      orders.reduce((acc, order) => {
        acc[order._id] = !expandAll;
        return acc;
      }, {})
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...orders].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [orders, page, rowsPerPage]
  );

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
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell align="left" sx={{ width: 75 }}>
                  <IconButton
                    aria-label="collapse"
                    onClick={toggleExpandAll}
                    sx={{ margin: "0 auto" }}
                  >
                    {!expandAll ? <KeyboardArrowUpIcon /> : <RemoveIcon />}
                  </IconButton>
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Address</TableCell>
                {["ready", "transit"].includes(status) && (
                  <TableCell align="center">Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="textSecondary">
                      No orders available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {visibleRows.map((order) => {
                    const isExpanded = expandedRows[order._id];
                    return (
                      <React.Fragment key={order._id}>
                        <TableRow
                          hover
                          key={order._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            "&:nth-of-type(even)": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              sx={{ margin: "0 auto" }}
                              onClick={() => toggleRow(order._id)}
                            >
                              {isExpanded ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {order.customerId}
                          </TableCell>
                          <TableCell align="right">
                            {`${order.firstName} ${order.lastName}`}
                          </TableCell>
                          <TableCell align="right">
                            {order.deliveryAddress}
                          </TableCell>
                          {["ready", "transit"].includes(status) && (
                            <TableCell align="center">
                              <Button
                                variant="contained"
                                color={
                                  status === "ready" ? "primary" : "success"
                                }
                                onClick={() => handleClick(order)}
                              >
                                {status === "ready" ? "Deliver" : "Complete"}
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                          >
                            <Collapse
                              in={isExpanded}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box sx={{ margin: 1 }}>
                                {status === "delivered" && (
                                  <Paper
                                    component="img"
                                    src={`data:image/jpeg;base64,${order.imageData}`}
                                    alt={`Order ${order._id} Image`}
                                    sx={{
                                      maxWidth: "100%",
                                      maxHeight: "300px",
                                      objectFit: "contain",
                                      display: "block",
                                      margin: "0 auto",
                                      borderRadius: "4px",
                                      border: "1px solid #ccc",
                                    }}
                                  />
                                )}
                                <Typography variant="subtitle1">
                                  Order Items
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Item</TableCell>
                                      <TableCell align="right">
                                        Quantity
                                      </TableCell>
                                      <TableCell align="right">Price</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {order.items.map((item, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell align="left">
                                          {item?.menuItem?.name}
                                        </TableCell>
                                        <TableCell align="right">
                                          {item.quantity}
                                        </TableCell>
                                        <TableCell align="right">
                                          {item?.menuItem?.price}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow
                                      sx={{
                                        borderTop: "2px solid #ddd",
                                        paddingTop: 1,
                                      }}
                                    >
                                      <TableCell align="left">
                                        <Typography
                                          variant="body1"
                                          sx={{
                                            fontWeight: "bold",
                                            color: "text.primary",
                                          }}
                                        >
                                          Total
                                        </Typography>
                                      </TableCell>
                                      <TableCell colSpan={2} align="right">
                                        <Typography
                                          variant="body1"
                                          sx={{
                                            fontWeight: "bold",
                                            color: "text.primary",
                                            fontSize: "1.1rem",
                                          }}
                                        >
                                          ${order.total.toFixed(2)}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <UploadModal
        order={currentOrder}
        open={openModal}
        onClose={closeModal}
        onUpload={uploadImage}
      />
    </Box>
  );
};

DeliveryTable.propTypes = {
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
  onDeliver: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default DeliveryTable;
