import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "./auth";
const users = (state = [], action) => {
  if (action.type === "GET_USERS") {
    return action.users;
  }
  if(action.type === 'DELETE_USER') {
    return state.filter(user => user.id !== action.userId)
  }
  return state;
};

export const fetchUsers = () => {
  return async (dispatch) => {
    const response = await axios.get("/api/users");
    dispatch({ type: "GET_USERS", users: response.data });
  };
};

export const deleteUser = (user) => {
  return async(dispatch)=> {
      await axios.delete(`/api/users/${user.id}`)
      dispatch({type: 'DELETE_USER', userId: user.id})
      dispatch(logout())
  }
}

export default users;
