import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PropTypes from "prop-types";

const CopyToClipboardButton = ({ text }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <IconButton onClick={handleClick} color="primary">
        <ContentCopyIcon />
      </IconButton>
      <Snackbar
        message="Copied to clibboard"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
};

CopyToClipboardButton.propTypes = {
  text: PropTypes.string.isRequired,
}

export default CopyToClipboardButton;
