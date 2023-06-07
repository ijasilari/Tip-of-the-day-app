import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
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
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import Dropdown from "../components/Dropdown";
import { AuthContext } from "../components/auth-context";
import axios from "axios";


const AdminPage = (props) => {

    const [showRoleField, setShowRoleField] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [showEmailField, setShowEmailField] = useState(false);
    const [showUsernameField, setShowUsernameField] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteVerified, setDeleteVerified] = useState(false);
    const auth = useContext(AuthContext);
    const [userData, setuserData] = useState([]);
    const [userId, SetuserId] = useState();
    const [selectedCard, setSelectedCard] = useState(null);

    const roleOptionsEdit = [
      { value: 1, label: "guest" },
      { value: 2, label: "admin" },
    ];


    useEffect(() => {
      const fetchData = async () => {
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/getusers`
        );
        setuserData(response.data);
      };
      fetchData();
    }, [props.userId]);

    const handleCancel = () => {
      formikPassword.resetForm();
      formikEmail.resetForm();
      formikUsername.resetForm();
      formikRole.resetForm();
    };

    const handleDeleteConfirmationOpen = (userId, index) => {
      setShowDeleteConfirmation(true);
      SetuserId(userId);
      setSelectedCard(index);
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
      if (showPasswordFields || showEmailField || showUsernameField || showRoleField) {
        handleCancel();
      }
    }, [showPasswordFields, showEmailField, showUsernameField, showRoleField]);

    const handlePasswordButtonClick = (index,userId) => {
      setShowPasswordFields(!showPasswordFields);
      setShowEmailField(false);
      setShowUsernameField(false);
      setShowRoleField(false);
      setSelectedCard(index);
      SetuserId(userId);
    };

    const handleEmailButtonClick = (index,userId) => {
      setShowEmailField(!showEmailField);
      setShowPasswordFields(false);
      setShowUsernameField(false);
      setShowRoleField(false);
      setSelectedCard(index);
      SetuserId(userId);
    };

    const handleUsernameButtonClick = (index,userId) => {
      setShowUsernameField(!showUsernameField);
      setShowPasswordFields(false);
      setShowEmailField(false);
      setShowRoleField(false);
      setSelectedCard(index);
      SetuserId(userId);
    };

    const handleRoleButtonClick = (index,userId) => {
      setShowRoleField(!showRoleField);
      setShowUsernameField(false);
      setShowPasswordFields(false);
      setShowEmailField(false);
      setSelectedCard(index);
      SetuserId(userId);
    };

    const deleteUser = async () => {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/${userId}/delete`,
          {
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        setuserData((prev) => prev.filter((e) => e.id !== userId));
        handleDeleteConfirmationClose();
      } catch (err) {}
    };

    const changePassword = async () => {
        const foundIndex = userData.findIndex((tip) => tip.id === userId);

      const userDetails = {
        username: userData[foundIndex].username,
        email: userData[foundIndex].email,
        password: formikPassword.values.password,
        role: userData[foundIndex].role
      };
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/${userId}/update`,
          userDetails,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        setuserData(() => {
          const newUserData = [...userData];
          const foundIndex = newUserData.findIndex((tip) => tip.id === userId);
          newUserData[foundIndex].password = response.data.user.password;
          return [...newUserData];
        });
        formikPassword.resetForm();
      } catch (err) {}
    };

    const changeEmail = async () => {
        const foundIndex = userData.findIndex((tip) => tip.id === userId);
      const userDetails = {
        username: userData[foundIndex].username,
        email: formikEmail.values.email,
        password: userData[foundIndex].password,
        role: userData[foundIndex].role
      };
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/${userId}/update`,
          userDetails,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        setuserData(() => {
          const newUserData = [...userData];
          const foundIndex = newUserData.findIndex((tip) => tip.id === userId);
          newUserData[foundIndex].email = response.data.user.email;
          return [...newUserData];
        });
        formikEmail.resetForm();
      } catch (err) {
        if (err.message) {
          formikEmail.errors.email = "Email already exists";
        }
      }
    };

    const changeUsername = async () => {
        const foundIndex = userData.findIndex((tip) => tip.id === userId);
      const userDetails = {
        username: formikUsername.values.username,
        email: userData[foundIndex].email,
        password: userData[foundIndex].password,
        role: userData[foundIndex].role
      };
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/${userId}/update`,
          userDetails,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        setuserData(() => {
          const newUserData = [...userData];
          const foundIndex = newUserData.findIndex((tip) => tip.id === userId);
          newUserData[foundIndex].username = response.data.user.username;
          return [...newUserData];
        });
        formikUsername.resetForm();
      } catch (err) {}
    };

    const changeRole = async () => {
      const foundIndex = userData.findIndex((tip) => tip.id === userId);
      const userDetails = {
        username: userData[foundIndex].username,
        email: userData[foundIndex].email,
        password: userData[foundIndex].password,
        role: formikRole.values.role
      };
      try {
        const response = await axios.patch(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/users/${userId}/update`,
          userDetails,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            },
          }
        );
        setuserData(() => {
          const newUserData = [...userData];
          const foundIndex = newUserData.findIndex((tip) => tip.id === userId);
          newUserData[foundIndex].role = response.data.user.role;
          return [...newUserData];
        });
        formikRole.values.role = "...Select";
        formikRole.resetForm();
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

    const validateRole = (values) => {
      const errors = {};

      if (!values.role) {
        errors.role = "Required role";
      } else if (!/^(admin|guest)$/i.test(values.role)) {
        errors.role = "Only accepted roles are |admin| or |guest|";
      }

      return errors;
    };

    const formikRole = useFormik({
      initialValues: {
        role: "...Select",
      },
      validate: validateRole,
      onSubmit: changeRole,
    });


     let textColor = "";
     let bgColor2 = "";
     let textAreaOutlineColor = "";
     let backgroundColor = "";
     if (props.theme === "light") {
       textColor = "black";
     } else {
       textColor = "#ECECEC";
       bgColor2 = "#1d1d1d";
       textAreaOutlineColor = "#bb86fc";
       backgroundColor = "#1D1D1D";
     }
  return (
    <div className="background">
      <Typography
        sx={{ color: textColor, textAlign: "center" }}
        variant="h4"
        gutterBottom
      >
        Admin Page
      </Typography>

      <Grid container spacing={2}>
        {userData &&
          userData.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: backgroundColor }}>
                <CardContent>
                  <Typography
                    sx={{ color: textColor }}
                    variant="h6"
                    component="div"
                  >
                    Username: {user.username}
                  </Typography>
                  <Typography
                    sx={{ color: textColor }}
                    variant="h6"
                    component="div"
                  >
                    Created: {user.created_at}
                  </Typography>
                  <Typography
                    sx={{ color: textColor }}
                    variant="h6"
                    component="div"
                  >
                    Email: {user.email}
                  </Typography>
                  <Typography
                    sx={{ color: textColor }}
                    variant="h6"
                    component="div"
                  >
                    Role: {user.role}
                  </Typography>
                  <Button
                    className="buttonsOutline"
                    startIcon={<Lock />}
                    variant="outlined"
                    fullWidth
                    onClick={() => handlePasswordButtonClick(index, user.id)}
                  >
                    Change Password
                  </Button>
                  {showPasswordFields && selectedCard === index && (
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
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: textAreaOutlineColor,
                            },
                        }}
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
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: textAreaOutlineColor,
                            },
                        }}
                      />
                      {formikPassword.errors.newpassword ? (
                        <div style={{ color: "red" }}>
                          {formikPassword.errors.newpassword}
                        </div>
                      ) : null}
                      <Button
                        className="buttons"
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
                    onClick={() => handleEmailButtonClick(index, user.id)}
                    className="buttonsOutline"
                  >
                    Change Email
                  </Button>
                  {showEmailField && selectedCard === index && (
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
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: textAreaOutlineColor,
                            },
                        }}
                      />
                      {formikEmail.errors.email ? (
                        <div style={{ color: "red" }}>
                          {formikEmail.errors.email}
                        </div>
                      ) : null}
                      <Button
                        className="buttons"
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
                    onClick={() => handleUsernameButtonClick(index, user.id)}
                    className="buttonsOutline"
                  >
                    Change Username
                  </Button>
                  {showUsernameField && selectedCard === index && (
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
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: textAreaOutlineColor,
                            },
                        }}
                      />
                      {formikUsername.errors.username ? (
                        <div style={{ color: "red" }}>
                          {formikUsername.errors.username}
                        </div>
                      ) : null}
                      <Button
                        className="buttons"
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
                    onClick={() => handleRoleButtonClick(index, user.id)}
                    className="buttonsOutline"
                  >
                    Change Role
                  </Button>
                  {showRoleField && selectedCard === index && (
                    <Box
                      component="form"
                      noValidate
                      onSubmit={formikRole.handleSubmit}
                    >
                      <Dropdown
                        isSearchable
                        placeHolder={formikRole.values.role}
                        options={roleOptionsEdit}
                        onChange={(value) => {
                          formikRole.values.role = value.label;
                        }}
                        theme={props.theme}
                      />
                      {formikRole.errors.role ? (
                        <div style={{ color: "red" }}>
                          {formikRole.errors.role}
                        </div>
                      ) : null}
                      <Button
                        className="buttons"
                        variant="contained"
                        role="button"
                        type="submit"
                        sx={{ mb: 1 }}
                      >
                        Change Role
                      </Button>
                    </Box>
                  )}
                  <Button
                    startIcon={<AccountCircle />}
                    variant="outlined"
                    fullWidth
                    color="error"
                    onClick={() => {
                      handleDeleteConfirmationOpen(user.id, index);
                    }}
                  >
                    Delete Account
                  </Button>
                  {selectedCard === index && (
                    <Dialog
                      open={showDeleteConfirmation}
                      onClose={handleDeleteConfirmationClose}
                    >
                      <DialogTitle
                        sx={{ backgroundColor: bgColor2, color: textColor }}
                      >
                        Delete Account
                      </DialogTitle>
                      <DialogContent sx={{ backgroundColor: bgColor2 }}>
                        <Typography sx={{ color: textColor }}>
                          Are you sure you want to delete this account?{userId}
                        </Typography>
                        <FormControlLabel
                          sx={{ color: textColor }}
                          control={
                            <Checkbox
                              data-testid="deleteCheckbox"
                              checked={deleteVerified}
                              onChange={handleDeleteVerification}
                              sx={{ color: textColor }}
                            />
                          }
                          label="I understand that this action is irreversible."
                        />
                      </DialogContent>
                      <DialogActions sx={{ backgroundColor: bgColor2 }}>
                        <Button
                          onClick={handleDeleteConfirmationClose}
                          sx={{ color: textAreaOutlineColor }}
                        >
                          Cancel
                        </Button>
                        <Button
                          data-testid="deleteButton"
                          onClick={() => {
                            handleDeleteAccount();
                          }}
                          disabled={!deleteVerified}
                          color="error"
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default AdminPage;
