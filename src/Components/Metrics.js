import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmailSummary from "./EmailSummary";
import UserTasksGraph from "./UserTasksGraph";
import TeamTasksGraph from "./TeamTasksGraph";
import { fetchTasks, fetchProjects } from "../store";

const Metrics = () => {
  const { auth, tasks } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects()), dispatch(fetchTasks());
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        flexWrap: "wrap",
        flexDirection: "row",
      }}
    >
      <div>
        {tasks && auth ? <UserTasksGraph tasks={tasks} id={auth.id} /> : ""}
      </div>
      <div>
        {tasks && auth ? <TeamTasksGraph tasks={tasks} id={auth.id} /> : ""}
      </div>
    </div>
  );
};

export default Metrics;
