import axios from "axios";
const log = (state = [], action) => {
  if (action.type === "SET_LOG") {
    return action.log;
  }
  if (action.type === "ADD_TO_LOG") {
    return [...state, action.logItem];
  }
  return state;
};

export const fetchLog = (id) => {
  //id of project
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.get(`/api/projects/log/${id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch({ type: "SET_LOG", log: response.data });
  };
};

export const addLog = (logItem) => {
  return async (dispatch) => {
    const response = await axios.post("/api/projects/addlog", logItem);
    dispatch({ type: "ADD_TO_LOG", logItem: response.data });
  };
};

export default log;
