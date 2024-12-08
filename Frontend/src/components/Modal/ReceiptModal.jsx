import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CopyToClipboardButton from "../Button/CopyToClipboardButton";
import PropTypes from "prop-types";

const ReceiptModal = ({ open, onClose, orderDetails }) => {
  const { items, totalPrice, confirmationNumber } = orderDetails;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Order Receipt</DialogTitle>
      <DialogContent dividers>
        <Box
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", marginBottom: "24px" }}
        >
          <Typography variant="h6" sx={{ marginBottom: "16px" }}>
            Confirmation Number:
          </Typography>
          <Paper
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              marginBottom: "24px",
              marginLeft: "12px",
              borderRadius: "8px",
              flex: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {confirmationNumber}
            </Typography>
            <CopyToClipboardButton text={confirmationNumber} />
          </Paper>
        </Box>
        <List>
          {items.map((item) => (
            <ListItem key={item.menuItem}>
              <ListItemText
                primary={`${item.name} (x${item.quantity})`}
                secondary={`Price: $${(item.price * item.quantity).toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ marginTop: "16px" }}>
          <Typography variant="h6" align="right">
            Total: <strong>${totalPrice.toFixed(2)}</strong>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#8b0000" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReceiptModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderDetails: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        menuItem: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    totalPrice: PropTypes.number.isRequired,
    confirmationNumber: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReceiptModal;
