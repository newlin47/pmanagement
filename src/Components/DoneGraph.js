import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label } from "recharts";
import Typography from "@mui/material/Typography";

const DoneGraph = (props) => {
  const log = props.log;
  if (log.length > 7) {
    log = log.slice(-7);
  }
  const data = [];
  log.forEach(function (logItem) {
    let date = logItem.date.slice(5, 10);
    // date[2] = "/"; //should be like mm/dd
    data.push({ date: date, total: logItem.total, done: logItem.value });
  });

  return (
    <span>
      <Typography width="100%" align="center">
        Tasks Done per Day
      </Typography>
      <BarChart
        data={data}
        width={800}
        height={200}
        margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="date">
          <Label value="Date" offset={-5} position="insideBottom" />
        </XAxis>
        <YAxis>
          {" "}
          <Label
            value="# of Tasks"
            offset={15}
            position="insideBottomLeft"
            angle={-90}
          />
        </YAxis>
        <Tooltip />
        <Legend verticalAlign="top" />
        <Bar dataKey="total" fill="#5b9aa0" />
        <Bar dataKey="done" fill="#b2c2bf" />
      </BarChart>
    </span>
  );
};

export default DoneGraph;
