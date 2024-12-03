import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function UploadModal({ order, open, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
    } else {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await onUpload(order._id, formData);
      onClose();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Failed to upload image. Please try again.");
    }
  };

  if (!order) return null;

  return (
    <Modal
      aria-labelledby="upload-modal-title"
      aria-describedby="upload-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="upload-modal-title" variant="h6" component="h2">
            Complete Delivery
          </Typography>
          <Typography id="upload-modal-description" sx={{ mt: 2 }}>
            Upload a proof of delivery image for the following order:
          </Typography>
          <Typography sx={{ mt: 2, fontWeight: "bold" }}>
            Order ID: {order._id}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mt={3}>
              <TextField
                type="file"
                inputProps={{ accept: "image/*" }}
                onChange={handleFileChange}
                fullWidth
              />
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button variant="contained" color="error" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!file}
              >
                Upload
              </Button>
            </Box>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
}

UploadModal.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
};
