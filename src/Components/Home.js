import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects, fetchTasks } from "../store";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import PersonIcon from "@mui/icons-material/Person";
import Post from "./Post";
import DashboardCard from "./DashboardCard";
import Metrics from "./Metrics";

const Home = () => {
  const [active, setActive] = useState("");
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const date = new Date();
  useEffect(() => {
    dispatch(fetchProjects()), dispatch(fetchTasks());
  }, []);

  if (!auth.teamId) {
    navigate("/team");
  }

  return (
    <div display="flex">
      <div style={{ height: 5 }}></div>
      <div className="dash-header">
        My Dashboard for: {date.toDateString()}
      </div>
      <div>
        <Paper sx={{ width: 200, maxWidth: "100%" }}>
          <MenuList>
            <MenuItem onClick={() => setActive("MetricsCard")}>
              <ListItemIcon>
                <EqualizerIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Metrics</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setActive("PostingCard")}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Connect</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
        <div className="dash-card">
          {active === "PostingCard" && <DashboardCard comp={<Post />} />}
          {active === "MetricsCard" && <DashboardCard comp={<Metrics />} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
