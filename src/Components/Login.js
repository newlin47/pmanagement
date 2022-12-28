import React, { useState } from "react";
import { attemptLogin } from "../store";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Register from "./Register";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const onChange = (ev) => {
    setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
  };

  const [toggle, setToggle] = useState(false);
  const { teamIdEmail } = useParams();
  const login = (ev) => {
    ev.preventDefault();
    dispatch(attemptLogin(credentials));
    if (teamIdEmail) {
      navigate(`/team/${teamIdEmail}`);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Container>
      <Box sx={{ margin: "auto", width: "50%" }}>
        {!toggle && (
          <Container>
            <Typography variant="h3" align="center" mt={7}>
              {" "}
              Login{" "}
            </Typography>
            <form onSubmit={login}>
              <TextField
                sx={{ margin: "auto", width: "50%", background: "#424242" }}
                label="Username"
                variant="filled"
                value={credentials.username}
                onChange={onChange}
                name="username"
                margin="normal"
                fullWidth
              />

              <TextField
                sx={{ margin: "auto", width: "50%", background: "#424242" }}
                variant="filled"
                type="password"
                label="Password"
                value={credentials.password}
                onChange={onChange}
                name="password"
                margin="normal"
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ margin: "auto", width: "50%" }}>
                Login
              </Button>
              <br></br>
              <Button
                sx={{ margin: "auto", width: "50%" }}
                onClick={() => setToggle(true)}
                variant="contained">
                Create Account
              </Button>
            </form>
          </Container>
        )}
        {toggle && <Register toggle={toggle} setToggle={setToggle} />}
      </Box>
    </Container>
  );
};

export default Login;
