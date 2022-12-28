import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { deleteUser } from "../store";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/material";

const ConfirmDelete = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth, users } = useSelector((state) => state);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleClickOpen}>
        Delete Account
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Warning!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure that you want to delete your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Go Back</Button>
          <Button
            onClick={() => {
              dispatch(deleteUser(auth));
              navigate("/");
            }}
            autoFocus>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ConfirmDelete;
