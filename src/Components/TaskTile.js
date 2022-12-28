import React, { Fragment } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const TaskTile = (props) => {
	const { task } = props;
	return (
		<Fragment>
			<Grid item>
				<Typography variant='subtitle1'>{task.name}</Typography>
			</Grid>
		</Fragment>
	);
};

export default TaskTile;
