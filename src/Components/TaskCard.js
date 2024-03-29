import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchTasks, updateTask } from "../store";
import TaskDelete from "./TaskDelete";
import CalendarButton from "./CalendarButton";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Drawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const TaskCard = (props) => {
	const { task, project, user, _users } = props;
	const dispatch = useDispatch();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerTask, setDrawerTask] = useState(task);
	const [value, setValue] = useState(Dayjs);

	const toggleDrawer = () => {
		setDrawerOpen(false);
	};

	const onEdit = (ev) => {
		if (ev) {
			setDrawerTask({
				...drawerTask,
				[ev.target.name]: ev.target.value,
			});
			if (ev.target.name === "status") {
				dispatch(fetchTasks());
			}
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

	let newDate = "";
	if (task.deadline) {
		newDate = new Date(task.deadline).toLocaleString();
	}

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
		<Grid
			container
			align='center'
			sx={{
				display: "flex",
				flexDirection: "column",
				bgcolor: "rgba(255, 255, 255, 0.12)",
				elevation: 3,
				boxShadow: 5,
				borderRadius: 2,
				margin: "1rem",
				marginBottom: 0,
				padding: "1rem",
				width: 300,
				height: 300,
			}}
		>
			<Grid item>
				<Typography
					variant='h6'
					sx={{
						textAlign: "left",
						fontWeight: "bold",
						color: colour,
					}}
				>
					{task === undefined ? "" : task.name}
				</Typography>
			</Grid>
			<Divider sx={{ margin: "0.25rem" }} />
			<Grid
				container
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<Grid item>
					<TaskDelete task={task} />
				</Grid>
				<Grid item>
					{project === undefined ? (
						""
					) : (
						<Link to={`/projects/${project.id}`}>
							<Tooltip title='Go to project page'>
								<IconButton>
									<DashboardIcon />
								</IconButton>
							</Tooltip>
						</Link>
					)}
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
			<Divider sx={{ margin: "0.25rem" }} />
			<Grid item align='left'>
				<Typography variant='subtitle2'>
					Project: {project === undefined ? "" : project.name}
				</Typography>
			</Grid>
			<Grid item align='left'>
				<Typography variant='subtitle2' sx={{ color: colour }}>
					Status: {task === undefined ? "" : task.status}
				</Typography>
			</Grid>
			<Grid item align='left'>
				<Typography variant='subtitle2'>
					Deadline: {task.deadline === undefined ? "" : newDate}
				</Typography>
			</Grid>
			<Grid item align='left'>
				<Typography variant='subtitle2'>
					Assigned to: {user === undefined ? "" : user.firstName}
				</Typography>
			</Grid>
			<Divider sx={{ margin: "0.25rem" }} />
			<Grid item align='left'>
				<Typography variant='subtitle2'>Description:</Typography>
			</Grid>
			<Grid item align='left'>
				<Typography variant='subtitle2' noWrap width='280px'>
					{task === undefined ? "" : task.description}
				</Typography>
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
							<MenuItem value={""}>none</MenuItem>
							{_users === undefined
								? ""
								: _users.map((teamMem) => {
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
		</Grid>
	);
};

export default TaskCard;
