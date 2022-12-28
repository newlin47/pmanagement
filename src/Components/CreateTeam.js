import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTeams, updateUser } from "../store";

const CreateTeam = () => {
  const [input, setInput] = useState({ name: "" });

  const dispatch = useDispatch();

  const onChange = (ev) => {
    setInput({ ...input, [ev.target.name]: ev.target.value });
  };

  const formSubmit = async (ev) => {
    ev.preventDefault();
    const token = window.localStorage.getItem("token");
    const response = await axios.post("/api/teams", input, {
      headers: {
        authorization: token,
      },
    });
    dispatch(updateUser({ teamId: response.data.id }));
  };

  return (
    <Box sx={{ margin: "auto", width: "50%" }}>
      <Typography mt={7} align="center" variant="h3">
        Create a team
      </Typography>
      <form onSubmit={formSubmit}>
        <TextField
          label="Team Name"
          value={input.name}
          onChange={onChange}
          name="name"
          margin="normal"
          inputProps={{ maxLength: 15 }}
          fullWidth
        />
        <Button type="submit" variant="contained">
          {" "}
          Create Team{" "}
        </Button>
      </form>
    </Box>
  );
};

export default CreateTeam;
