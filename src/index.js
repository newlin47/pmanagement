import React from "react";
import { createRoot } from "react-dom/client";
import App from "./Components/App";
import { Provider } from "react-redux";
import store from "./store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { HashRouter } from "react-router-dom";

export const Theme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#5b9aa0",
		},
		secondary: {
			main: "#f50057",
		},
	},
});

const root = createRoot(document.querySelector("#root"));

root.render(
	<Provider store={store}>
		<HashRouter>
			<ThemeProvider theme={Theme}>
				<CssBaseline />
				<App />
			</ThemeProvider>
		</HashRouter>
	</Provider>
);
