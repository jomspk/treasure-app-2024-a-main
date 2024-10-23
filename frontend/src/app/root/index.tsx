import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

export function Root() {
  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  );
}

export default Root;
