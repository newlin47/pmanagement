import React, { useState, Fragment } from "react";
import { useDispatch } from "react-redux";
import { deleteTask, fetchTasks } from "../store";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

const TaskDelete = (props) => {
	const { task } = props;
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);

	const destroyTask = () => {
		dispatch(deleteTask(task));
		handleClose();
		dispatch(fetchTasks());
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Fragment>
			<Tooltip title='Delete task'>
				<IconButton>
					<DeleteIcon onClick={handleClickOpen} sx={{ color: "#8b0000" }} />
				</IconButton>
			</Tooltip>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Delete task?</DialogTitle>
				<DialogContent>
					<DialogContentText>Task Name: {task.name}</DialogContentText>
					<DialogContentText>Description: {task.description}</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant='contained' onClick={handleClose}>
						Cancel
					</Button>
					<Button variant='contained' color={"error"} onClick={destroyTask}>
						Delete task
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

export default TaskDelete;
