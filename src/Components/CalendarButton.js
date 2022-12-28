import React, { Fragment } from "react";
import { atcb_action } from "add-to-calendar-button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const CalendarButton = (props) => {
	// const task = {
	// 	name: "Test Task",
	// 	description: "Test description for add to cal button",
	// 	deadline: "2023-01-11T17:00:00.000Z",
	// };
	const { task } = props;

	return (
		<Fragment>
			<Tooltip title='Add task to calendar'>
				<IconButton>
					<CalendarMonthIcon
						onClick={(e) => {
							e.preventDefault();
							atcb_action({
								name: task.name,
								description: task.description,
								startDate: task.deadline,
								options: [
									"Apple",
									"Google",
									"iCal",
									"Microsoft365",
									"Outlook.com",
									"Yahoo",
								],
								timeZone: "America/New_York",
								iCalFileName: "Reminder-Event",
							});
						}}
					>
						Add to calendar
					</CalendarMonthIcon>
				</IconButton>
			</Tooltip>
		</Fragment>
	);
};

export default CalendarButton;
