import React, { useState, useEffect } from "react";
import { createUser, fetchUsers } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Paper, TextField, Typography } from "@mui/material";

const Register = (loginToggleState) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const { setToggle } = loginToggleState; 

  const onChange = (ev) => {
    setCredentials({ ...credentials, [ev.target.name]: ev.target.value });
  };

  const onChangeConfirm = (ev) => {
    setConfirmPassword(ev.target.value);
  };

  const login = (ev) => {
    ev.preventDefault();
    credentials.username && credentials.password && confirmPassword
      ? users.filter((user) => user.username === credentials.username).length
        ? alert("username taken")
        : credentials.password === confirmPassword
        ? dispatch(createUser(credentials), navigate("/"))
        : alert("password must match")
      : alert("all fields required");
  };
  return (
    <Paper>
      <Button onClick={()=> setToggle(false)}> back to Login page</Button>
      <Typography variant='h3'>Register</Typography>
      <form onSubmit={login}>
        <TextField 
           label='Username'
           value={credentials.username} 
           onChange={onChange} 
           name="username" 
           margin="normal" 
           inputProps={{maxLength: 15}} 
           fullWidth
        />
        <TextField 
           label='First Name'
           value={credentials.firstName} 
           onChange={onChange} 
           name="firstName" 
           margin="normal"  
           fullWidth
        />
        <TextField 
           label='Last Name'
           value={credentials.lastName} 
           onChange={onChange} 
           name="lastName" 
           margin="normal"  
           fullWidth
        />
        <TextField 
           label='Email'
           value={credentials.email} 
           onChange={onChange} 
           name="email" 
           margin="normal"  
           fullWidth
        />
        <TextField 
           label='Password'
           type='password'
           value={credentials.password} 
           onChange={onChange} 
           name="password" 
           margin="normal"  
           fullWidth
        />
        <TextField 
           label='Confirm Password'
           type='password'
           value={confirmPassword} 
           onChange={onChangeConfirm} 
           name="confirmPassword" 
           margin="normal"  
           fullWidth
        />
        <Button type="submit" variant="contained"> Register </Button>
      </form>
    </Paper>
  );
};

export default Register;
