import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { createTask, fetchTasks } from "../store";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const TaskCreate = (props) => {
	const { auth, project, users } = props;
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [value, setValue] = useState(Dayjs);
	const [newTask, setNewTask] = useState({
		name: "",
		description: "",
		status: "To Do",
		projectId: project.id,
		teamId: auth.teamId,
	});

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const onChange = (ev) => {
		newTask.name === "" || newTask.description === ""
			? setDisabled(true)
			: setDisabled(false);
		setNewTask({
			...newTask,
			[ev.target.name]: ev.target.value,
		});
	};

	const createNewTask = () => {
		dispatch(createTask(newTask));
		setNewTask({
			name: "",
			description: "",
			status: "To Do",
			projectId: project.id,
			teamId: auth.teamId,
		});
		dispatch(fetchTasks());
		handleClose();
	};

	return (
		<Fragment>
			<Button variant='contained' onClick={handleClickOpen}>
				+ Add a task
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				style={{ display: "flex", flexDirection: "column" }}
			>
				<DialogTitle>New Task</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Input task name and description:
					</DialogContentText>
					<TextField
						autoFocus
						margin='dense'
						id='name'
						label='name'
						name='name'
						type='text'
						fullWidth
						variant='standard'
						value={newTask.name}
						onChange={onChange}
					/>
					<TextField
						autoFocus
						id='desc'
						label='description'
						name='description'
						type='text'
						fullWidth
						variant='standard'
						value={newTask.description}
						onChange={onChange}
						margin='dense'
						multiline
					/>
					<Select
						name='status'
						value={newTask.status}
						onChange={onChange}
						fullWidth
						label='status'
					>
						<MenuItem value={"To Do"}>To Do</MenuItem>
						<MenuItem value={"In Progress"}>In Progress</MenuItem>
						<MenuItem value={"Done"}>Done</MenuItem>
						<MenuItem value={"Backlog"}>Backlog</MenuItem>
					</Select>
					<FormHelperText>Status</FormHelperText>
					<Select
						name='userId'
						value={newTask.userId}
						onChange={onChange}
						fullWidth
					>
						<MenuItem value={null}>none</MenuItem>
						{users
							.filter((user) => user.teamId === auth.teamId)
							.map((teamMem) => {
								return (
									<MenuItem value={teamMem.id} key={teamMem.id}>
										{teamMem.username}
									</MenuItem>
								);
							})}
					</Select>
					<FormHelperText>Assign to</FormHelperText>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							value={newTask.deadline || value}
							onChange={(newValue) => {
								setValue(newValue);
								onDeadlineCreate(newValue);
							}}
							renderInput={(params) => <TextField {...params} />}
						/>
						<Button
							onClick={() => {
								setValue(null);
								setNewTask({ ...newTask, deadline: null });
							}}
						>
							clear date
						</Button>
					</LocalizationProvider>
					<FormHelperText>Deadline</FormHelperText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button disabled={disabled} onClick={createNewTask}>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};

export default TaskCreate;
