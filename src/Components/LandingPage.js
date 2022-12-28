import React from "react";
import landingLogo from "../../static/images/landingLogo.jpeg";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const LandingPage = () => {
	return (
		<Grid
			container
			spacing={3}
			style={{ display: "flex", justifyContent: "flex-start" }}
		>
			<Grid item style={{ padding: "1rem", margin: "1rem" }}>
				<img
					className='landingLogo'
					src='../../static/images/landingLogo.jpeg'
					style={{ height: "600px", width: "600px", position: "relative" }}
				/>
			</Grid>
			<Grid item style={{ padding: "1rem", margin: "1rem" }}>
				<Typography variant='h4'>Description of App</Typography>
				<Typography variant='p'>Features list can go here.</Typography>
			</Grid>
		</Grid>
	);
};

export default LandingPage;
