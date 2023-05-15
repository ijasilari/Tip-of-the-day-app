import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './auth-context';
import "./ButtonAppBar.css";

function ButtonAppBar() {
  const auth = useContext(AuthContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            color="inherit"
            variant="h6"
            sx={{ mr: 2 }}
            component={NavLink}
            to="/"
          >
            HomePage
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          {auth.isLoggedIn && (
            <Button component={NavLink} to="/addtip" color="inherit">
              Add Tip
            </Button>
          )}
          <Button component={NavLink} to="/viewtips" color="inherit">
            View All Tips
          </Button>
          {auth.isLoggedIn && (
            <Button
              component={NavLink}
              to="/profilepage"
              color="inherit"
            >
              ProfilePage
            </Button>
          )}
          {!auth.isLoggedIn && (
            <Button component={NavLink} to="/auth" color="inherit">
              Login
            </Button>
          )}
          {auth.isLoggedIn && (
            <Button
              component={NavLink}
              to="/"
              color="inherit"
              onClick={auth.logout}
            >
              LOGOUT
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ButtonAppBar;
