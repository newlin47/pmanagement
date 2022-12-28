import React from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { fetchProjects, fetchTeams, setNewAdmin } from "../store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import CreateTeam from "./CreateTeam";
import { JoinTeam } from "./JoinTeam";
import CancelIcon from "@mui/icons-material/Cancel";
import { RemoveTeamMember } from "../store";
import axios from "axios";
import { useState } from "react";
import EmailSummary from "./EmailSummary";

const Team = () => {
  const dispatch = useDispatch();
  const { teams, auth } = useSelector((state) => state);
  let adminView = false;

  const [selectedTab, setSelectedTab] = useState("team");

  const [alertConditions, setAlertConditions] = useState({
    removedUser: false,
    newAdmin: false,
    invitedUser: false,
  });

  const [recipientInfo, setRecipientInfo] = useState({
    email: "",
  });

  const closeRemovedUser = (ev, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertConditions({ ...alertConditions, removedUser: false });
  };

  const closeNewAdmin = (ev, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertConditions({ ...alertConditions, newAdmin: false });
  };

  const closeInvitedUser = (ev, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertConditions({ ...alertConditions, invitedUser: false });
    setRecipientInfo({ email: "" });
  };

  const tabChange = (ev, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    dispatch(fetchTeams());
    dispatch(fetchProjects());
    if (!auth.teamId) {
      setSelectedTab("joinTeam");
    }
    if (auth.teamId) {
      setSelectedTab("team");
    }
  }, [auth]);

  if (auth.id === teams.adminId) {
    adminView = true;
  }

  const onChange = (ev) => {
    setRecipientInfo({ ...recipientInfo, [ev.target.name]: ev.target.value });
  };

  const inviteToTeam = async (ev) => {
    ev.preventDefault();
    await axios.post("/api/emails/invite/team", {
      teamId: teams.id,
      recipient: recipientInfo.email,
      senderName: auth.firstName,
    });
    setAlertConditions({ ...alertConditions, invitedUser: true });
  };

  const removeUser = (user) => {
    dispatch(RemoveTeamMember(user));
    setAlertConditions({ ...alertConditions, removedUser: true });
  };

  const switchAdmin = (user) => {
    dispatch(setNewAdmin(user));
    setAlertConditions({ ...alertConditions, newAdmin: true });
  };

  return (
    <Container>
      {auth.teamId !== null ? (
        <Paper>
          <div style={{ height: "5px" }}></div>

          <Box sx={{ margin: "auto", border: 1, width: "50%" }}>
            <Tabs
              value={selectedTab}
              onChange={tabChange}
              textColor="secondary"
              indicatorColor="secondary"
              centered
            >
              <Tab value="team" label="Team overview" />
              <Tab value="invite" label="Invite member" />
              {adminView && (
                <Tab value="emailSummary" label="Send Email Summary" />
              )}
            </Tabs>
          </Box>
          {selectedTab === "team" && (
            <Container>
              <Typography mt={7} align="center" variant="h3">
                My Team
              </Typography>
              <Grid
                container
                spacing={3}
                sx={{
                  margin: "1rem",
                  padding: "1rem",
                }}
              >
                {teams.users &&
                  teams.users.map((user) => {
                    return (
                      <Grid
                        key={user.id}
                        container
                        align="center"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: 5,
                          borderRadius: 2,
                          margin: "1rem",
                          padding: "1rem",
                          width: "300px",
                        }}
                      >
                        <Grid item>
                          <Typography variant="h6">
                            Username - {user.username}
                          </Typography>
                        </Grid>
                        <Grid item align="left">
                          <Typography variant="subtitle2">
                            First Name: {user.firstName}
                          </Typography>
                        </Grid>
                        <Grid item align="left">
                          <Typography variant="subtitle2">
                            Last Name: {user.lastName}
                          </Typography>
                        </Grid>
                        <Grid item align="left">
                          <Typography variant="subtitle2">
                            Email: {user.email}
                          </Typography>
                        </Grid>
                        {adminView && user.id !== teams.adminId && (
                          <Grid
                            container
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
                            <Grid item>
                              <Button
                                onClick={() => {
                                  removeUser(user);
                                }}
                              >
                                {" "}
                                <CancelIcon />
                              </Button>
                            </Grid>
                            <Grid item>
                              <Button onClick={() => switchAdmin(user)}>
                                Set as new admin
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    );
                  })}
              </Grid>
            </Container>
          )}
          {selectedTab === "invite" && (
            <form onSubmit={(ev) => inviteToTeam(ev)}>
              <Typography mt={7} align="center" variant="h3">
                Invite new user to team
              </Typography>
              <TextField
                sx={{ margin: "auto", width: "50%" }}
                label="Recipient's email address"
                name="email"
                onChange={onChange}
                value={recipientInfo.email}
                required
              />
              <Button
                sx={{ margin: "auto", width: "50%" }}
                variant="contained"
                type="submit"
              >
                Invite User
              </Button>
            </form>
          )}
          {adminView && selectedTab === "emailSummary" && <EmailSummary />}
        </Paper>
      ) : (
        <Paper>
          <Box sx={{ margin: "auto", border: 1, width: "50%" }}>
            <Tabs
              value={selectedTab}
              onChange={tabChange}
              textColor="secondary"
              indicatorColor="secondary"
              centered
            >
              <Tab value="joinTeam" label="Join a team" />
              <Tab value="createTeam" label="Create Team" />
            </Tabs>
          </Box>
          {selectedTab === "joinTeam" && <JoinTeam />}
          {selectedTab === "createTeam" && <CreateTeam />}
        </Paper>
      )}
      <Snackbar
        autoHideDuration={4000}
        open={alertConditions.removedUser}
        onClose={closeRemovedUser}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={closeRemovedUser}
          severity="success"
          sx={{ width: "100%" }}
        >
          User removed Successfully
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={4000}
        open={alertConditions.newAdmin}
        onClose={closeNewAdmin}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={closeNewAdmin}
          severity="success"
          sx={{ width: "100%" }}
        >
          New Admin set Successfully
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={4000}
        open={alertConditions.invitedUser}
        onClose={closeInvitedUser}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={closeInvitedUser}
          severity="success"
          sx={{ width: "100%" }}
        >
          Invite Successfully sent to {recipientInfo.email}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Team;
