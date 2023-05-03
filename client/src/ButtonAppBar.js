import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";

function ButtonAppBar() {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            component={NavLink}
            to="/"
            variant="h6"
            color="inherit"
            sx={{ flexGrow: 1 }}
          >
            HomePage
          </Typography>
            <Button
              component={NavLink}
              to="/addtip"
              color="inherit"
            >
              Add Tip
            </Button>
            <Button
              component={NavLink}
              to="/viewtips"
              color="inherit"
            >
              View All Tips
            </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ButtonAppBar;
