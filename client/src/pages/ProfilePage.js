import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { AccountCircle, Email, Lock } from "@mui/icons-material";
import { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/auth-context";
import axios from "axios";

const ProfilePage = (props) => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);
  const [showUsernameField, setShowUsernameField] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteVerified, setDeleteVerified] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setuserData] = useState([]);
  console.log(auth.userId)
  console.log(props.userId)

  const dateView = (date) => {
    const convertDate = new Date(date).toLocaleDateString("en-GB");
    return convertDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/${props.userId}`
      );
      console.log(response.data.user);
      setuserData(response.data.user);
    };
    fetchData();
  }, [props.userId]);

  const handleCancel = () => {
    formikPassword.resetForm();
    formikEmail.resetForm();
    formikUsername.resetForm();
  };

  const handleDeleteConfirmationOpen = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmationClose = () => {
    setShowDeleteConfirmation(false);
    setDeleteVerified(false);
  };

  const handleDeleteAccount = () => {
    if (deleteVerified) {
      console.log("Account deleted!");
      deleteUser();
    }
  };

  const handleDeleteVerification = (event) => {
    setDeleteVerified(event.target.checked);
  };

  useEffect(() => {
    if (showPasswordFields || showEmailField || showUsernameField) {
      handleCancel();
    }
  }, [showPasswordFields, showEmailField, showUsernameField]);


  const handlePasswordButtonClick = () => {
    setShowPasswordFields(!showPasswordFields);
    setShowEmailField(false);
    setShowUsernameField(false);
  };

  const handleEmailButtonClick = () => {
    setShowEmailField(!showEmailField);
    setShowPasswordFields(false);
    setShowUsernameField(false);
  };

  const handleUsernameButtonClick = () => {
    setShowUsernameField(!showUsernameField);
    setShowPasswordFields(false);
    setShowEmailField(false);
  };

  const deleteUser = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/${props.userId}/delete`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      console.log(response);
      auth.logout();
      navigate("/");
    } catch (err) {}
  };

  const changePassword = async () => {
    const userDetails = {
      username: userData.username,
      email: userData.email,
      password: formikPassword.values.password,
    };
    try {
      console.log(userDetails);
      const response = await axios.patch(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/${props.userId}/update`,
        userDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      console.log(response);
      formikPassword.resetForm();
    } catch (err) {}
  };

  const changeEmail = async () => {
    const userDetails = {
      username: userData.username,
      email: formikEmail.values.email,
      password: userData.password,
    };
    try {
      console.log(userDetails);
      const response = await axios.patch(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/${props.userId}/update`,
        userDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      console.log(response);
      const modified = { ...userData };
      console.log(modified)
      modified.email = formikEmail.values.email;
      setuserData(modified);
      formikEmail.resetForm();
    } catch (err) {
      if(err.message) {
        formikEmail.errors.email = "Email already exists";
      }
    }
  };

  const changeUsername = async () => {
    const userDetails = {
      username: formikUsername.values.username,
      email: userData.email,
      password: userData.password,
    };
    try {
      console.log(userDetails);
      const response = await axios.patch(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/${props.userId}/update`,
        userDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      console.log(response);
      const modified = { ...userData };
      console.log(modified)
      modified.username = formikUsername.values.username;
      setuserData(modified);
      formikUsername.resetForm();
    } catch (err) {}
  };

  const validateEmail = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Required email address";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    return errors;
  };

  const formikEmail = useFormik({
    initialValues: {
      email: "",
    },
    validate: validateEmail,
    onSubmit: changeEmail,
  });

  const validatePassword = (values) => {
    const errors = {};

    if (!values.password) {
      errors.password = "Required new password";
    } else if (values.password.length < 8) {
      errors.password = "Password must be atleast 8 characters or more";
    }

    if (!values.newpassword) {
      errors.newpassword = "Required re-enter new password";
    } else if (values.newpassword !== values.password) {
      errors.newpassword = "Passwords arent same";
    }
    return errors;
  };

  const formikPassword = useFormik({
    initialValues: {
      password: "",
      newpassword: "",
    },
    validate: validatePassword,
    onSubmit: changePassword,
  });

  const validateUsername = (values) => {
    const errors = {};

    if (!values.username) {
      errors.username = "Required username";
    }
    return errors;
  };

  const formikUsername = useFormik({
    initialValues: {
      username: "",
    },
    validate: validateUsername,
    onSubmit: changeUsername,
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80%",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", textAlign: "center", justifyContent: "center" }}
      >
        <Grid item xs={12}>
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardHeader title="Profile" />
              <Avatar>
                <AccountCircle />
              </Avatar>
            </div>
            <CardContent>
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                <Grid item></Grid>
                <Grid item sx={{ textAlign: "center" }}>
                  <Typography variant="h6">
                    Created: {dateView(userData.created_at)}
                  </Typography>
                  <Typography variant="h6">
                    Last updated: {dateView(userData.updated_at)}
                  </Typography>
                  <Typography variant="h6">
                    Username: {userData.username}
                  </Typography>
                  <Typography variant="h6">Email: {userData.email}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title="Account Settings" />
            <CardContent>
              <Button
                startIcon={<Lock />}
                variant="outlined"
                fullWidth
                onClick={handlePasswordButtonClick}
              >
                Change Password
              </Button>
              {showPasswordFields && (
                <Box
                  component="form"
                  noValidate
                  onSubmit={formikPassword.handleSubmit}
                >
                  <TextField
                    id="password"
                    name="password"
                    label="New Password"
                    fullWidth
                    margin="normal"
                    type="password"
                    onChange={formikPassword.handleChange}
                    value={formikPassword.values.password}
                  />
                  {formikPassword.errors.password ? (
                    <div style={{ color: "red" }}>
                      {formikPassword.errors.password}
                    </div>
                  ) : null}
                  <TextField
                    label="Confirm New Password"
                    fullWidth
                    margin="normal"
                    id="newpassword"
                    name="newpassword"
                    type="password"
                    onChange={formikPassword.handleChange}
                    value={formikPassword.values.newpassword}
                  />
                  {formikPassword.errors.newpassword ? (
                    <div style={{ color: "red" }}>
                      {formikPassword.errors.newpassword}
                    </div>
                  ) : null}
                  <Button
                    variant="contained"
                    role="button"
                    type="submit"
                    sx={{ mb: 1 }}
                  >
                    Change Password
                  </Button>
                </Box>
              )}
              <Button
                startIcon={<Email />}
                variant="outlined"
                fullWidth
                onClick={handleEmailButtonClick}
              >
                Change Email
              </Button>
              {showEmailField && (
                <Box
                  component="form"
                  noValidate
                  onSubmit={formikEmail.handleSubmit}
                >
                  <TextField
                    label="New Email"
                    fullWidth
                    margin="normal"
                    id="email"
                    name="email"
                    onChange={formikEmail.handleChange}
                    value={formikEmail.values.email}
                  />
                  {formikEmail.errors.email ? (
                    <div style={{ color: "red" }}>
                      {formikEmail.errors.email}
                    </div>
                  ) : null}
                  <Button
                    variant="contained"
                    role="button"
                    type="submit"
                    sx={{ mb: 1 }}
                  >
                    Change Email
                  </Button>
                </Box>
              )}
              <Button
                startIcon={<AccountCircle />}
                variant="outlined"
                fullWidth
                onClick={handleUsernameButtonClick}
              >
                Change Username
              </Button>
              {showUsernameField && (
                <Box
                  component="form"
                  noValidate
                  onSubmit={formikUsername.handleSubmit}
                >
                  <TextField
                    label="New Username"
                    fullWidth
                    margin="normal"
                    name="username"
                    id="username"
                    onChange={formikUsername.handleChange}
                    value={formikUsername.values.username}
                  />
                  {formikUsername.errors.username ? (
                    <div style={{ color: "red" }}>
                      {formikUsername.errors.username}
                    </div>
                  ) : null}
                  <Button
                    variant="contained"
                    role="button"
                    type="submit"
                    sx={{ mb: 1 }}
                  >
                    Change Username
                  </Button>
                </Box>
              )}
              <Button
                startIcon={<AccountCircle />}
                variant="outlined"
                fullWidth
                color="error"
                onClick={handleDeleteConfirmationOpen}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={showDeleteConfirmation}
        onClose={handleDeleteConfirmationClose}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your account?</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={deleteVerified}
                onChange={handleDeleteVerification}
              />
            }
            label="I understand that this action is irreversible."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmationClose}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            disabled={!deleteVerified}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
