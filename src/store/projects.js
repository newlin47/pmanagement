import axios from "axios";
const projects = (state = [], action) => {
  if (action.type === "SET_PROJECTS") {
    return action.projects;
  }
  if (action.type === "CREATE_PROJECT") {
    return [...state, action.project];
  }
  if (action.type === "DELETE_PROJECT") {
    return state.filter((project) => project.id !== action.id);
  }
  if (action.type === "UPDATE_PROJECT") {
    return state.map((project) =>
      project.id === action.project.id ? action.project : project
    );
  }
  return state;
};

export const fetchProjects = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.get("/api/projects", {
      headers: {
        authorization: token,
      },
    });
    dispatch({ type: "SET_PROJECTS", projects: response.data });
  };
};

export const createProject = (newProject) => {
  return async (dispatch) => {
    const response = await axios.post("/api/projects/create", newProject);
    dispatch({ type: "CREATE_PROJECT", project: response.data });
  };
};

export const deleteProject = (projectId, navigate) => {
  return async (dispatch) => {
    const response = await axios.delete(`/api/projects/${projectId}`);
    dispatch({ type: "DELETE_PROJECT", id: projectId });
    navigate("/projects");
  };
};

export const putProject = (editProject) => {
  return async (dispatch) => {
    const response = await axios.put(
      `/api/projects/${editProject.id}`,
      editProject
    );
    dispatch({ type: "UPDATE_PROJECT", project: response.data });
  };
};

export default projects;
