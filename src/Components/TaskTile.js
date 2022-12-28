import React, { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTasks, updateTask } from "../store";
import TaskDelete from "./TaskDelete";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CalendarButton from "./CalendarButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormControl from "@mui/material/FormControl";
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const TaskTile = (props) => {
	const { task, project, users, auth } = props;
	const dispatch = useDispatch();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerTask, setDrawerTask] = useState({});
	const [value, setValue] = useState(Dayjs);

	const onEdit = (ev) => {
		if (ev) {
			setDrawerTask({
				...drawerTask,
				[ev.target.name]: ev.target.value,
			});
			dispatch(fetchTasks());
		}
	};

	const editTask = () => {
		dispatch(updateTask(drawerTask));
		toggleDrawer();
		setDrawerTask({});
		dispatch(fetchTasks());
	};

	const onDeadlineEdit = (date) => {
		setDrawerTask({ ...drawerTask, deadline: date });
		dispatch(fetchTasks());
	};

	const toggleDrawer = () => {
		setDrawerOpen(false);
	};

	const getUserName = (task) => {
		if (task.userId) {
			const assigned = users.find((user) => user.id === task.userId);
			return assigned.username;
		} else {
			return "";
		}
	};

	let colour = "";

	if (task.status === "Backlog") {
		colour = "red";
	}

	if (task.status === "To Do") {
		colour = "gold";
	}

	if (task.status === "In Progress") {
		colour = "white";
	}

	if (task.status === "Done") {
		colour = "green";
	}

	return (
		<Fragment>
			<Grid item>
				<Typography
					variant='subtitle1'
					sx={{
						textAlign: "left",
						fontWeight: "bold",
						color: colour,
					}}
				>
					{task.name}
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant='subtitle2' sx={{ textAlign: "left" }}>
					Due: {task.deadline === undefined ? "" : task.datedisplay}
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant='subtitle2' sx={{ textAlign: "left" }}>
					{task.userId === undefined ? null : `Assigned: ${getUserName(task)}`}
				</Typography>
			</Grid>
			<Grid
				container
				style={{
					display: "flex",
					border: "1px",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Grid item>
					<TaskDelete task={task} />
				</Grid>

				{!task.deadline ? (
					<Grid item>
						<Tooltip title='No deadline'>
							<IconButton>
								<CalendarMonthIcon sx={{ color: "grey" }} />
							</IconButton>
						</Tooltip>
					</Grid>
				) : (
					<Grid item>
						<CalendarButton task={task} />
					</Grid>
				)}

				<Grid item>
					<Tooltip title='Edit task'>
						<IconButton
							onClick={() => {
								setDrawerTask(task);
								setDrawerOpen(true);
							}}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
				</Grid>
			</Grid>
			<Drawer
				anchor={"right"}
				open={drawerOpen}
				onClose={toggleDrawer}
				PaperProps={{
					sx: { width: "40%" },
				}}
			>
				<FormControl sx={{ padding: 2 }} margin='dense'>
					<Typography variant='h3'>Task Details</Typography>
					<TextField
						autoFocus
						id='name'
						label='name'
						name='name'
						type='text'
						variant='standard'
						fullWidth
						value={drawerTask.name}
						onChange={onEdit}
					/>
					<TextField
						autoFocus
						id='desc'
						label='description'
						name='description'
						type='text'
						variant='standard'
						value={drawerTask.description}
						onChange={onEdit}
						fullWidth
						multiline
					/>
					<br />
					<FormControl>
						<Select name='status' value={drawerTask.status} onChange={onEdit}>
							<MenuItem value={"To Do"}>To Do</MenuItem>
							<MenuItem value={"In Progress"}>In Progress</MenuItem>
							<MenuItem value={"Done"}>Done</MenuItem>
							<MenuItem value={"Backlog"}>Backlog</MenuItem>
						</Select>
						<FormHelperText>Status</FormHelperText>
					</FormControl>
					<FormControl>
						<Select
							name='userId'
							value={drawerTask.userId}
							onChange={onEdit}
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
					</FormControl>
					<FormControl>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								value={drawerTask.deadline || value}
								onChange={(newValue) => {
									console.log(newValue.$d);
									setValue(newValue);
									onDeadlineEdit(newValue.$d);
								}}
								renderInput={(params) => <TextField {...params} />}
							/>
							<Button
								onClick={() => {
									setValue(null);
									setDrawerTask({ ...drawerTask, deadline: null });
								}}
							>
								clear date
							</Button>
						</LocalizationProvider>
						<FormHelperText>Deadline</FormHelperText>
					</FormControl>
					<Button variant='contained' onClick={editTask}>
						Update Task
					</Button>
				</FormControl>
			</Drawer>
		</Fragment>
	);
};

export default TaskTile;
