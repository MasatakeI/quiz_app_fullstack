// src/components/common/Modal/Modal.jsx

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmTitle,
}) {
  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        slots={{
          transition: Transition,
        }}
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>キャンセル</Button>
          <Button onClick={onConfirm}>{confirmTitle}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
