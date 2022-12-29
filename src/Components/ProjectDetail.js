import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProjects, fetchUsers, fetchTasks, fetchLog } from "../store";
import TaskTile from "./TaskTile";
import TaskCreate from "./TaskCreate";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
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

	useEffect(() => {
		dispatch(fetchProjects()),
			dispatch(fetchUsers(), dispatch(fetchTasks()), dispatch(fetchLog(id)));
	}, []);

	const displayDate = (date) => {
		const formattedDate = new Date(date).toLocaleString();
		return formattedDate;
	};

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
																minHeight: "100px",
															}}
														></Container>
													) : (
														column.tasks.map((task, index) => {
															return (
																<Draggable
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
																				<TaskTile
																					task={task}
																					project={project}
																					users={users}
																					auth={auth}
																				/>
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
								<TaskCreate project={project} users={users} auth={auth} />
							</div>
						);
					})}
				</DragDropContext>
			</Container>
			<hr />
		</div>
	);
};

export default ProjectDetail;
