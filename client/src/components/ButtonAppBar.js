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
import ReactSwitch from "react-switch";

import { useState } from 'react';


function ButtonAppBar(props) {
  const auth = useContext(AuthContext);
  let textColor = "";
  if(props.theme === 'light') {
    textColor = '#1976D2'
  }
  else {
    textColor = '#2D2D2D'
  }



  return (
    <Box sx={{flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor:textColor}}>
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
          <label className="toggleLabel">{props.theme == "light" ? "Light Mode" : "Dark Mode"} </label>
          <ReactSwitch onChange={props.toggleTheme} checked={props.theme === "dark"} height={14} width={28} onColor={"#BB86FC"} className="toggle"/>
          {auth.isLoggedIn && (
            <Button
              component={NavLink}
              to="/addtip"
              color="primary"
            >
              Add Tip
            </Button>
          )}
            <Button
              component={NavLink}
              to="/viewtips"
              color="inherit"
            >
              View All Tips
            </Button>
            {!auth.isLoggedIn && (
            <Button
              component={NavLink}
              to="/auth"
              color="inherit"
            >
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
