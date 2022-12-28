import React from "react";
import { PieChart, Pie, Legend, Cell, Label } from "recharts";
import Typography from "@mui/material/Typography";

const ColumnGraph = (props) => {
  console.log("props", props);
  const tasks = props.tasks;
  const projectTasks = tasks.filter(
    (task) => task.projectId === props.projectId
  );
  const backlog = projectTasks.filter((task) => task.status === "Backlog");
  const todo = projectTasks.filter((task) => task.status === "To Do");
  const progress = projectTasks.filter((task) => task.status === "In Progress");
  const done = projectTasks.filter((task) => task.status === "Done");

  const data = [
    { name: "Backlog", value: backlog.length },
    { name: "To Do", value: todo.length },
    { name: "In Progress", value: progress.length },
    { name: "Done", value: done.length },
  ];

  return (
    <span>
      <Typography width="100%" align="center">
        Task Status
      </Typography>
      <PieChart width={730} height={250}>
        <Legend />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          innerRadius={40}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={
                entry.name === "Done"
                  ? "#eaece5"
                  : entry.name === "In Progress"
                  ? "#b2c2bf"
                  : entry.name === "To Do"
                  ? "#5b9aa0"
                  : "#5A5A5A"
              }
            />
          ))}
        </Pie>
      </PieChart>
    </span>
  );
};

export default ColumnGraph;
