import axios from "axios";

const tasks = (state = [], action) => {
	if (action.type === "SET_TASKS") {
		return action.tasks;
	}
	if (action.type === "CREATE_TASK") {
		return [...state, action.task];
	}
	if (action.type === "UPDATE_TASK") {
		return state.map((task) =>
			task.id === action.task.id ? action.task : task
		);
	}
	if (action.type === "DELETE_TASK") {
		return state.filter((task) => task.id !== action.taskId);
	}
	return state;
};

export const fetchTasks = () => {
	return async (dispatch) => {
		const token = window.localStorage.getItem("token");
		const response = await axios.get("/api/tasks", {
			headers: {
				authorization: token,
			},
		});
		dispatch({ type: "SET_TASKS", tasks: response.data });
	};
};

export const createTask = (newTask) => {
	return async (dispatch) => {
		const response = await axios.post("/api/tasks/create", newTask);
		dispatch({ type: "CREATE_TASK", task: response.data });
	};
};

export const updateTask = (task) => {
	return async (dispatch) => {
		const response = await axios.put(`/api/tasks/${task.id}`, task);
		dispatch({ type: "UPDATE_TASK", task: response.data });
	};
};

export const deleteTask = (task) => {
	return async (dispatch) => {
		await axios.delete(`/api/tasks/${task.id}`);
		dispatch({ type: "DELETE_TASK", taskId: task.id });
	};
};

export default tasks;
