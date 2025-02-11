import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { updateLoginStatus } from "./features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// const TIME = 5;

function AlertPopup({ openAlert, msg, TIME, onclose}) {
  const [open, setOpen] = React.useState(openAlert);
  const [countDown, setCountDown] = React.useState(TIME);
  const handleClose = () => {
    setOpen(false);
    if (onclose !== null) {
      onclose();
    }
  };
  React.useEffect(() => {
    let time = TIME;
    const interval = setInterval(() => {
      if (time > 0) {
        setCountDown(time - 1);
        time = time -1;
      } else {
        clearInterval(interval);
        handleClose();
      }
    }, 1000);
  }, []);
  return (
    <React.Fragment >
      <Dialog
        className="popup_alert"
        open={open}
        onClose={handleClose}
        aria-hidden={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"login expired"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Ok ({countDown})</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AlertPopup;