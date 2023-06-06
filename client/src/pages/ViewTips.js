import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Dropdown from "../components/Dropdown";
import { IconButton, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useContext } from "react";
import { AuthContext } from "../components/auth-context";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import TablePagination from "@mui/material/TablePagination";
import "./ViewTips.css";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';


function ViewTips(props) {
  const [data, setData] = useState([]);
  const [openEditTip, setOpenEditTip] = useState(false);
  const [id, setId] = useState();
  const [editText, setEditText] = useState("");
  const [category, setCategory] = useState(0);
  const [categoryEdit, setCategoryEdit] = useState();
  const [error, setError] = useState("");

  const auth = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const categoryOptions = [
    { value: 11, label: "All" },
    { value: 1, label: "CSS" },
    { value: 2, label: "Java" },
    { value: 3, label: "JavaScript" },
    { value: 4, label: "HTTP" },
    { value: 5, label: "Python" },
    { value: 6, label: "CPP" },
    { value: 7, label: "Dart" },
    { value: 8, label: "Flutter" },
    { value: 9, label: "Rust" },
    { value: 10, label: "Linux" },
  ];

  const categoryOptionsEdit = [
    { value: 1, label: "CSS" },
    { value: 2, label: "Java" },
    { value: 3, label: "JavaScript" },
    { value: 4, label: "HTTP" },
    { value: 5, label: "Python" },
    { value: 6, label: "CPP" },
    { value: 7, label: "Dart" },
    { value: 8, label: "Flutter" },
    { value: 9, label: "Rust" },
    { value: 10, label: "Linux" },
  ];

  const handleCancel = () => {
    formikTip.resetForm();
  };

  const handleTipClickOpen = (id, index) => {
    setOpenEditTip(true);
    setId(id);
    setEditText(paginatedData[index].description);
  };

  const handleTipClose = () => {
    setOpenEditTip(false);
  };

  const addTheLike = async (id, index, vote) => {
    const userData = { userId: auth.userId, vote: vote };
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/${id}/like`,
        userData,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      setData(() => {
        const newTips = [...data];
        const foundIndex = newTips.findIndex((tip) => tip.id === id);
        newTips[foundIndex].likes = newTips[foundIndex].likes + vote;
        newTips[foundIndex].wholiked[auth.userId] = true;
        return [...newTips];
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/getall`
        );
        setData(response.data.tips);
        if (response.data.tips.length === 0) {
          console.log("No tips in the database");
          setError("No tips in the database");
          setData([]);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No tips in the database");
          setError("No tips in the database");
          setData([]);
        } else {
          console.error(error);
          setError(
            "An error occurred while fetching data. Please try again later."
          );
        }
      }
    };
    fetchData();
  }, []);

  const fetchDataByCategory = async () => {
    try {
      setPage(0);
      if (category === 11){
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/getall`
        );
        setData(response.data.tips);
      } else {
        const response = await axios.get(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/getall/${category}`
        );
        setData(response.data.tips);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if(category === 0){
          console.log("No category chosen");
          setError("Please choose a category.");
        }else {
          console.log("No tips with the chosen category in the database");
          setError("There are no tips with the chosen category.");
        }
        setData([]);
      } else {
        console.error(error);
        setError("An error occurred while fetching data. Please try again later.");
      }
    }
  };

  const deleteTip = async (tid) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/${tid}/delete`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      setData((prev) => prev.filter((e) => e.id !== tid));
    } catch (err) {}
  };

  const editTip = async () => {
    const editedTip = {
      description: formikTip.values.description,
      category: categoryEdit,
      creator: auth.userId,
    };
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/${id}/update`,
        editedTip,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      setData(() => {
        const newTips = [...data];
        const foundIndex = newTips.findIndex((tip) => tip.id === id);
        newTips[foundIndex].description = formikTip.values.description;
        newTips[foundIndex].category = categoryEdit;
        return [...newTips];
      });
      setCategoryEdit();
      handleTipClose();
    } catch (err) {}
  };

  const validateTip = (values) => {
    const errors = {};

    if (!values.description) {
      errors.description = "Required tip description";
    }
    if (!values.category) {
      errors.category = "Required tip category";
    }
    return errors;
  };

  const formikTip = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: editText,
      category: categoryEdit,
    },
    validate: validateTip,
    onSubmit: editTip,
  });

  let textColor = "";
  let backgroundColor = "";
  let textAreaOutlineColor = "";
  if (props.theme === "light") {
    textColor = "black";
    backgroundColor = "white";
    textAreaOutlineColor = "primary";
  } else {
    textColor = "#ECECEC";
    backgroundColor = "#1C1C1C";
    textAreaOutlineColor = "#bb86fc";
  }

  const getCategoryLabel = (categoryId) => {
    const category = categoryOptions.find(
      (option) => option.value === categoryId
    );
    return category ? category.label : "";
  };



  return (
    <div className="background"><CssBaseline />
      <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      >
      <Box sx={{ flexGrow: 1 }}>{/* content of the first box */}</Box>
      <Dropdown
        isSearchable
        placeHolder="Select..."
        options={categoryOptions}
        onChange={(value) => setCategory(value.value)} />

      <IconButton
        data-testid="fetchDataButton"
        sx={{ marginLeft: 0, mr: "30%" }}
        onClick={() => fetchDataByCategory()}
        style={{ backgroundColor: 'transparent' }}
      >
        {" "}
        <SearchIcon className="searchIcon" />{" "}
      </IconButton>
      </Box>
      <Container sx={{ py: 8 }} maxWidth="md">
        {data.length === 0 ? (
            <Typography variant="h5" align="center" style={{ color: textColor }}>
              {error}
            </Typography>
          ) : (
        <Grid container spacing={4} >
          {paginatedData &&
          paginatedData.map((item, index) => (
            <Grid item key={index} xs={10} sm={6} md={6}>
              <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: backgroundColor }}>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {getCategoryLabel(item.category)}
                  </Typography>
                  <Box style={{ overflowY: 'auto', paddingBottom: 0, marginBottom: 0 }}>
                    <ReactMarkdown
                      children={item.description}
                      components={{
                        p: ({ node, ...props }) => <p style={{ color: textColor }} {...props} />,
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, '')}
                              language={match[1]}
                              style={tomorrow}
                              {...props} />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }} />
                  </Box>
                </CardContent>
                <CardActions>
                  {(auth.role === 'admin' || auth.userId === item.creator) &&(
                    <Button
                      className="buttonsOutline"
                      style={{ display: "inline", marginRight: "2px" }}
                      variant="outlined"
                      onClick={() => {
                        handleTipClickOpen(item.id, index);
                      } }
                    >
                      Edit
                    </Button>
                  )}
                  {(auth.role === 'admin' || auth.userId === item.creator) &&(
                    <Button
                      className="buttonsOutline"
                      style={{ display: "inline", marginLeft: "2px" }}
                      variant="outlined"
                      onClick={() => {
                        deleteTip(item.id);
                      } }
                    >
                      Delete
                    </Button>
                  )}
                </CardActions>
                <Box sx={{ mt: 'auto', padding: 0, margin: 0, marginLeft: '8px', marginBottom: '5px'}}>
                    <Typography
                          sx={{ color: textColor,
                                display: 'inline',
                              }}
                        >
                          Likes: {item.likes}
                        </Typography>
                        {auth.token && !item.wholiked[auth.userId] && (
                          <>
                            <IconButton
                              data-testid="thumbUpIcon"
                              onClick={() => {
                                addTheLike(item.id, index, 1);
                              }}
                            >
                              {" "}
                              <ThumbUpIcon />{" "}
                            </IconButton>
                            <IconButton
                              data-testid="thumbDownIcon"
                              onClick={() => {
                                addTheLike(item.id, index, -1);
                              }}
                            >
                              {" "}
                              <ThumbDownIcon />{" "}
                            </IconButton>
                          </>
                        )}
                  </Box>
              </Card>
              <Dialog
                maxWidth="sm"
                id={props.theme}
                open={openEditTip}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClose={() => {
                  handleTipClose();
                } }
              >
                <Box
                  component="form"
                  noValidate
                  onSubmit={formikTip.handleSubmit}
                  sx={{ backgroundColor: backgroundColor }}
                >
                  <DialogTitle id="alert-dialog-title">
                    Change Tip With Id: {id}
                    <Dropdown
                      isSearchable
                      placeHolder="Select..."
                      options={categoryOptionsEdit}
                      onChange={(value) => {
                        setCategoryEdit(value.value)
                        formikTip.values.category = value.value;
                      }}
                      theme={props.theme} />
                    <TextField
                      name="description"
                      required
                      variant="outlined"
                      fullWidth
                      id="description"
                      label="Description"
                      multiline={true}
                      rows={10}
                      sx={{
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: textAreaOutlineColor,
                        },
                        backgroundColor: backgroundColor,
                        '& .MuiInputBase-input': {
                          color: textColor,
                        },
                        '& .MuiInputLabel-root': {
                          color: textColor,
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: textColor,
                          },
                          '&:hover fieldset': {
                            borderColor: textAreaOutlineColor,
                          }}
                      }}
                      autoFocus
                      onChange={formikTip.handleChange}
                      value={formikTip.values.description} />
                    {formikTip.errors.category ? (
                      <div style={{ color: "red" }}>
                        {formikTip.errors.category}
                      </div>
                    ) : null}
                    {formikTip.errors.description ? (
                      <div style={{ color: "red" }}>
                        {formikTip.errors.description}
                      </div>
                    ) : null}
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      variant="contained"
                      className='buttons'
                      onClick={() => {
                        handleCancel();
                        handleTipClose();
                      } }
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      role="button"
                      type="submit"
                      className="buttons"
                    >
                      Update Tip Description/Category
                    </Button>
                  </DialogActions>
                </Box>
              </Dialog>
            </Grid>
          ))}
        </Grid>
        )}
      </Container>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}
        id="pagination"
      >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          labelRowsPerPage={"Cards per page"}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          sx={{'& .MuiSelect-select':{color: textColor}}}
          id="pagination"
        />
      </div>
      </div>
  );
}

export default ViewTips;
