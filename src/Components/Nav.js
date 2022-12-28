import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store";

function NavBar() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { pathname } = useLocation();
	const { auth } = useSelector((state) => state);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position='fixed'>
				<Toolbar>
					<IconButton
						size='large'
						edge='start'
						color='inherit'
						aria-label='menu'
						sx={{ mr: 2 }}
					></IconButton>

					<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
						<div>
							{auth.id && (
								<div>
									<Button color='inherit' onClick={() => navigate("/")}>
										<Typography variant='h5' color='#6495ED'>
											Project Management App
										</Typography>
									</Button>
									{auth.teamId && (
										<Button
											color='inherit'
											onClick={() => navigate("/dashboard")}
										>
											Dashboard
										</Button>
									)}
									{auth.teamId && (
										<Button color='inherit' onClick={() => navigate("/tasks")}>
											Tasks
										</Button>
									)}
									{auth.teamId && (
										<Button
											color='inherit'
											onClick={() => navigate("/projects")}
										>
											Projects
										</Button>
									)}
									<Button color='inherit' onClick={() => navigate("/team")}>
										My Team
									</Button>
									<Button color='inherit' onClick={() => navigate("/profile")}>
										Profile
									</Button>
								</div>
							)}
						</div>
					</Typography>
					{auth.id && (
						<Typography id='welcome'>Welcome {auth.username}!</Typography>
					)}
					{auth.id ? (
						<Button
							color='inherit'
							onClick={() => {
								dispatch(logout());
								navigate("/");
							}}
						>
							Logout
						</Button>
					) : (
						<div
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<Button color='inherit' onClick={() => navigate("/")}>
								<Typography variant='h5' color='#6495ED'>
									Project Management App
								</Typography>
							</Button>
							{pathname !== "/login" && (
								<Button color='inherit' onClick={() => navigate("/login")}>
									Login
								</Button>
							)}
						</div>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	);
}

export default NavBar;
