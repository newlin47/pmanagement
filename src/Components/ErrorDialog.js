import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AdminError = () => {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          Delete Account
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Error"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Team admins cannot delete their profile before assigning a new
              admin. Please 'set new admin' on your 'my teammates' page.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>OK</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}

export default AdminError