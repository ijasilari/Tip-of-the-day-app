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

  let bgColor = "";
  let backgroundBttnColor
  if(props.theme === 'light') {
    bgColor = '#1976D2';
  }
  else {
    bgColor = '#1d1d1d';
    backgroundBttnColor = '#bb86fcd6';
  }



  return (
    <Box sx={{flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor:bgColor}}>
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
          <label className="toggleLabel">{props.theme == "light" ? "Light Mode" : "Dark Mode"} </label>
          <ReactSwitch  onChange={props.toggleTheme}
                        checked={props.theme === "dark"}
                        height={14}
                        width={28}
                        onColor={"#BB86FC"}
                        className="toggle"
                        uncheckedIcon={false}
                        checkedIcon={false}/>
          {auth.isLoggedIn && (
            <Button
              component={NavLink}
              to="/addtip"
              color="inherit"
              sx={{
                ':hover': {
                  bgcolor: backgroundBttnColor
                }
              }}
            >
              Add Tip
            </Button>
          )}
            <Button
              component={NavLink}
              to="/viewtips"
              color="inherit"
              sx={{
                ':hover': {
                  bgcolor: backgroundBttnColor
                },
              }}
            >
              View All Tips
            </Button>
            {auth.isLoggedIn && (
            <Button
              component={NavLink}
              to="/owntips"
              color="inherit"
              sx={{
                ':hover': {
                  bgcolor: backgroundBttnColor
                }
              }}
            >
              My Tips
            </Button>
          )}
          {auth.isLoggedIn && (
            <Button
              component={NavLink}
              to="/profilepage"
              color="inherit"
              sx={{
                ':hover': {
                  bgcolor: backgroundBttnColor
                }
              }}
            >
              ProfilePage
            </Button>
          )}
            {!auth.isLoggedIn && (
            <Button
              component={NavLink}
              to="/auth"
              color="inherit"
              sx={{
                ':hover': {
                  bgcolor: backgroundBttnColor
                },
              }}
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
              sx={{
                ':hover': {
                  bgcolor: backgroundBttnColor
                },
              }}
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
