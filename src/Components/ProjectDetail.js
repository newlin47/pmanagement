import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
	createTask,
	fetchProjects,
	fetchUsers,
	fetchTasks,
	fetchLog,
	updateTask,
} from "../store";
import TaskDelete from "./TaskDelete";
import CalendarButton from "./CalendarButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Grid from "@mui/material/Grid";
import DoneGraph from "./DoneGraph";
import ColumnGraph from "./ColumnGraph";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";

const ProjectDetail = () => {
	const { projects, tasks, auth, log, users } = useSelector((state) => state);
	const { id } = useParams();
	const dispatch = useDispatch();
	const [project, setProject] = useState({});
	const [backlog, setBacklog] = useState([]);
	const [todo, setTodo] = useState([]);
	const [progress, setProgress] = useState([]);
	const [done, setDone] = useState([]);
	const [columns, setColumns] = useState([]);
	const [open, setOpen] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerTask, setDrawerTask] = useState({});
	const [value, setValue] = useState(Dayjs);
	const [newTask, setNewTask] = useState({
		name: "",
		description: "",
		status: "To Do",
		projectId: id,
		teamId: "",
	});

	useEffect(() => {
		dispatch(fetchProjects()),
			dispatch(fetchUsers(), dispatch(fetchTasks()), dispatch(fetchLog(id)));
	}, []);

	useEffect(() => {
		const projectTasks = tasks
			.filter((task) => {
				return task.projectId == id;
			})
			.map((task) => {
				if (task.deadline) {
					task.datedisplay = displayDate(task.deadline);
					return task;
				}
				return task;
			});

		if (projects[0] !== undefined) {
			//kept getting project undefined error, changing from projects.length to this seems to fix it??
			const project = projects.find((project) => project.id === id);
			projectTasks.length
				? `${
						(setProject(project),
						setNewTask({ ...newTask, teamId: project.teamId }),
						setBacklog(
							projectTasks.filter((task) => task.status === "Backlog")
						),
						setTodo(projectTasks.filter((task) => task.status === "To Do")),
						setProgress(
							projectTasks.filter((task) => task.status === "In Progress")
						),
						setDone(projectTasks.filter((task) => task.status === "Done")))
				  }`
				: setProject(project);
		}
	}, [projects, tasks]);

	useEffect(() => {
		setColumns({
			1: {
				id: 1,
				name: "Backlog",
				tasks: backlog,
				shade: "red",
			},
			2: {
				id: 2,
				name: "To Do",
				tasks: todo,
				shade: "gold",
			},
			3: {
				id: 3,
				name: "In Progress",
				tasks: progress,
				shade: "white",
			},
			4: {
				id: 4,
				name: "Done",
				tasks: done,
				shade: "green",
			},
		});
	}, [project, tasks]);

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

	const getUserName = (task) => {
		if (task.userId) {
			const assigned = users.find((user) => user.id === task.userId);
			return assigned.username;
		} else {
			return "";
		}
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

	const onDeadlineEdit = (date) => {
		setDrawerTask({ ...drawerTask, deadline: date });
		dispatch(fetchTasks());
	};

	const onDeadlineCreate = (date) => {
		setNewTask({ ...newTask, deadline: date });
	};

	const createNewTask = () => {
		dispatch(createTask(newTask));
		if (newTask.status === "To Do") {
			setTodo([...todo, newTask]);
		}
		if (newTask.status === "Backlog") {
			setBacklog([...backlog, newTask]);
		}
		if (newTask.status === "In Progress") {
			setProgress([...progress, newTask]);
		}
		if (newTask.status === "Done") {
			setProgress([...done, newTask]);
		}
		setColumns({ ...columns });
		setNewTask({
			name: "",
			description: "",
			status: "To Do",
			projectId: id,
			teamId: auth.teamId,
		});
		dispatch(fetchTasks());
		handleClose();
	};

	const editTask = () => {
		dispatch(updateTask(drawerTask));
		toggleDrawer();
		setColumns({ ...columns });
		setDrawerTask({});
		dispatch(fetchTasks());
	};

	const toggleDrawer = () => {
		setDrawerOpen(false);
	};

	const onDragEnd = async (result, columns, setColumns) => {
		if (!result.destination) return;
		const { source, destination } = result;
		if (source.droppableId !== destination.droppableId) {
			const sourceColumn = columns[source.droppableId];
			const destColumn = columns[destination.droppableId];
			const sourceTasks = Array.from(sourceColumn.tasks);
			const destTasks = Array.from(destColumn.tasks);
			const [removed] = sourceTasks.splice(source.index, 1);
			destTasks.splice(destination.index, 0, removed);
			setColumns({
				...columns,
				[source.droppableId]: {
					...sourceColumn,
					tasks: sourceTasks,
				},
				[destination.droppableId]: {
					...destColumn,
					tasks: destTasks,
				},
			});
			const newStatus = columns[destination.droppableId].name;
			const changedTask = removed;
			changedTask.status = newStatus;

			try {
				await axios.put(`/api/tasks/${changedTask.id}`, changedTask);
			} catch (ex) {
				console.log(ex);
			}
		} else {
			const column = columns[source.droppableId];
			const copiedTasks = [...column.tasks];
			const [removed] = copiedTasks.splice(source.index, 1);
			copiedTasks.splice(destination.index, 0, removed);
			setColumns({
				...columns,
				[source.droppableId]: {
					...column,
					tasks: copiedTasks,
				},
			});
		}
	};
	const displayDate = (date) => {
		const formattedDate = new Date(date).toLocaleString();
		return formattedDate;
	};

	return (
		<div>
			<br />
			<Typography variant='h3' align='center'>
				Project: {project.name}
				<br />
			</Typography>
			<hr />
			<Container
				sx={{ display: "flex", justifyContent: "center", height: "100%" }}
			>
				<DragDropContext
					onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
				>
					{Object.entries(columns).map(([columnId, column], index) => {
						return (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}
								key={columnId}
							>
								<Typography variant='h4' style={{ color: column.shade }}>
									{column.name}
								</Typography>
								<div
									style={{
										margin: 8,
										display: "flex",
										flexDirection: "column",
									}}
								>
									<Droppable droppableId={columnId} key={columnId}>
										{(provided, snapshot) => {
											return (
												<Container
													{...provided.droppableProps}
													ref={provided.innerRef}
													style={{
														background: snapshot.isDraggingOver
															? "lightblue"
															: "lightgrey",
														padding: 4,
														width: 250,
														height: 500,
														overflowY: "scroll",
													}}
												>
													{!column.tasks ? (
														<Container
															style={{
																display: "flex",
																flexDirection: "column",
																// flexGrow: "1",
																minHeight: "100px",
															}}
														></Container>
													) : (
														column.tasks.map((task, index) => {
															return (
																<Draggable
																	/* I have no idea why this fixes it, 
                                without +'a' there's an error that says it doesnt have a key/draggableId */
																	key={task.id + "a"}
																	draggableId={task.id + "a"}
																	index={index}
																>
																	{(provided, snapshot) => {
																		return (
																			<Grid
																				container
																				ref={provided.innerRef}
																				{...provided.draggableProps}
																				{...provided.dragHandleProps}
																				sx={{ boxShadow: 10 }}
																				style={{
																					display: "flex",
																					flexDirection: "column",
																					userSelect: "none",

																					padding: 16,
																					margin: "0 0 8px 0",
																					minHeight: "50px",
																					backgroundColor: snapshot.isDragging
																						? "#456C86"
																						: "#252525",
																					color: "white",
																					...provided.draggableProps.style,
																				}}
																			>
																				<Grid item>
																					<Typography
																						variant='subtitle1'
																						sx={{
																							textAlign: "left",
																							fontWeight: "bold",
																							color: column.shade,
																						}}
																					>
																						{task.name}
																					</Typography>
																				</Grid>
																				<Grid item>
																					<Typography
																						variant='subtitle2'
																						sx={{ textAlign: "left" }}
																					>
																						Due:{" "}
																						{task.deadline === undefined
																							? ""
																							: task.datedisplay}
																					</Typography>
																				</Grid>
																				<Grid item>
																					<Typography
																						variant='subtitle2'
																						sx={{ textAlign: "left" }}
																					>
																						{task.userId === undefined
																							? null
																							: `Assigned: ${getUserName(
																									task
																							  )}`}
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
																									<CalendarMonthIcon
																										sx={{ color: "grey" }}
																									/>
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
																			</Grid>
																		);
																	}}
																</Draggable>
															);
														})
													)}
													{provided.placeholder}
												</Container>
											);
										}}
									</Droppable>
								</div>
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
							</div>
						);
					})}
				</DragDropContext>
			</Container>
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
			<hr />
			{log && tasks ? (
				<div style={{ display: "flex" }}>
					<DoneGraph log={log} />
					<ColumnGraph tasks={tasks} projectId={id} />
				</div>
			) : (
				""
			)}
			<hr />
		</div>
	);
};

export default ProjectDetail;
