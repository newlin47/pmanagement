import React, { useEffect } from "react";
import Home from "./Home";
import Login from "./Login";
import LandingPage from "./LandingPage";
import ProjectGallery from "./ProjectGallery";
import ProjectDetail from "./ProjectDetail";
import NavBar from "./Nav";
import { useSelector, useDispatch } from "react-redux";
import { loginWithToken } from "../store";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import Profile from "./Profile";
import Team from "./Team";
import TaskGallery from "./TaskGallery";
import Typography from "@mui/material/Typography";

const App = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    dispatch(loginWithToken());
  }, []);

  if (!auth.id && pathname !== "/" && !pathname.includes("login")) {
    return (
      <div>
        <nav>
          <div className="nav">
            <NavBar />
            <div style={{ height: "60px" }}></div>
          </div>
        </nav>
        <Login />
      </div>
    );
  }
  return (
    <div>
      <div>
        <nav>
          <div className="nav">
            <NavBar />
            <div style={{ height: "60px" }}></div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/:teamIdEmail" element={<Login />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:teamIdEmail" element={<Team />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/projects" element={<ProjectGallery />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/tasks" element={<TaskGallery />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
