import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./auth-context";
import "./ButtonAppBar.css";
import ReactSwitch from "react-switch";

import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";

function ButtonAppBar(props) {
  const auth = useContext(AuthContext);

  let bgColor = "";
  let backgroundBttnColor;
  if (props.theme === "light") {
    bgColor = "#1976D2 !important";
  } else {
    bgColor = "#1d1d1d";
    backgroundBttnColor = "#bb86fcd6";
  }

  const styles = {
    buttonStyle: {
      ":hover": {
        bgcolor: backgroundBttnColor,
      },
      "&.active": {
        textDecoration: "underline",
        textUnderlineOffset: "4px",
      },
    },
  };

  const pagess = (
    <div>
      {auth.isLoggedIn && auth.role === "guest" && (
        <Button
          component={NavLink}
          to="/addtip"
          color="inherit"
          sx={styles.buttonStyle}
        >
          Add Tip
        </Button>
      )}
      {auth.isLoggedIn && auth.role === "admin" && (
        <Button
          component={NavLink}
          to="/adminpage"
          color="inherit"
          sx={styles.buttonStyle}
        >
          AdminPage
        </Button>
      )}
      <Button
        component={NavLink}
        to="/viewtips"
        color="inherit"
        sx={styles.buttonStyle}
      >
        View All Tips
      </Button>
      {auth.isLoggedIn && auth.role === "guest" && (
        <Button
          component={NavLink}
          to="/owntips"
          color="inherit"
          sx={styles.buttonStyle}
        >
          My Tips
        </Button>
      )}
      {auth.isLoggedIn && auth.role === "guest" && (
        <Button
          component={NavLink}
          to="/profilepage"
          color="inherit"
          sx={styles.buttonStyle}
        >
          ProfilePage
        </Button>
      )}
      {!auth.isLoggedIn && (
        <Button
          component={NavLink}
          to="/auth"
          color="inherit"
          sx={styles.buttonStyle}
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
            ":hover": {
              bgcolor: backgroundBttnColor,
            },
          }}
        >
          LOGOUT
        </Button>
      )}
    </div>
  );

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: bgColor }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component={NavLink}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              color: "inherit",
              textDecoration: "none",
              "&.active": {
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              },
            }}
            to="/"
          >
            HomePage
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                "& .MuiPaper-root": {
                  backgroundColor: bgColor,
                },
              }}
            >
              <label className="toggleLabel">
                {props.theme === "light" ? "Light Mode" : "Dark Mode"}{" "}
              </label>
              <ReactSwitch
                data-testid="toggleSwitch"
                onChange={props.toggleTheme}
                checked={props.theme === "dark"}
                height={14}
                width={28}
                onColor={"#BB86FC"}
                className="toggle"
                uncheckedIcon={false}
                checkedIcon={false}
              />
              {pagess}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component={NavLink}
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
              "&.active": {
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              },
            }}
            to="/"
          >
            HomePage
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex", flexDirection: "column" },
            }}
          ></Box>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <div>
              <label className="toggleLabel">
                {props.theme === "light" ? "Light Mode" : "Dark Mode"}{" "}
              </label>
              <ReactSwitch
                data-testid="themeSwitch"
                onChange={props.toggleTheme}
                checked={props.theme === "dark"}
                height={14}
                width={28}
                onColor={"#BB86FC"}
                className="toggle"
                uncheckedIcon={false}
                checkedIcon={false}
              />
            </div>
            {pagess}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ButtonAppBar;
