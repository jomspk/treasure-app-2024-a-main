import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// TODO: いい感じの色にする
const theme = createTheme({
  palette: {
    primary: {
      main: "#4160F8",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
