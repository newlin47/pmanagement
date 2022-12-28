import axios from "axios";
const auth = (state = {}, action) => {
  if (action.type === "SET_AUTH") {
    return action.auth;
  }
  if (action.type === "UPDATE_AUTH") {
    const key = Object.keys(action.auth)[0];
    return { ...state, [key]: action.auth[key] };
  }
  return state;
};

export const logout = () => {
  window.localStorage.removeItem("token");
  return { type: "SET_AUTH", auth: {} };
};

export const loginWithToken = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const response = await axios.get("/api/auth", {
        headers: {
          authorization: token,
        },
      });
      dispatch({ type: "SET_AUTH", auth: response.data });
    }
  };
};

export const attemptLogin = (credentials) => {
  return async (dispatch) => {
    const response = await axios.post("/api/auth", credentials);
    window.localStorage.setItem("token", response.data);
    dispatch(loginWithToken());
  };
};

export const createUser = (credentials) => {
  return async (dispatch) => {
    const response = await axios.post("/api/auth/create", credentials);
    window.localStorage.setItem("token", response.data);
    dispatch(loginWithToken());
  };
};

export const updateUser = (updatedInfo) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem("token");
    const response = await axios.put("/api/auth/update", updatedInfo, {
      headers: {
        authorization: token,
      },
    });
    dispatch({ type: "UPDATE_AUTH", auth: updatedInfo });
  };
};

export default auth;
