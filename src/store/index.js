import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import auth from "./auth";
import users from "./users";
import projects from "./projects";
import teams from "./teams";
import tasks from "./tasks";
import log from "./log";
import posts from "./posts";

const reducer = combineReducers({
  auth,
  users,
  projects,
  teams,
  tasks,
  log,
  posts,
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;

export * from "./auth";
export * from "./users";
export * from "./projects";
export * from "./teams";
export * from "./tasks";
export * from "./log";
export * from "./posts";
