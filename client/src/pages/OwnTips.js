import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from "formik";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Dropdown from "../components/Dropdown";
import { IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useContext } from 'react';
import { AuthContext } from '../components/auth-context';
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function OwnTips(props) {
  const [data, setData] = useState([]);
  const [openEditTip, setOpenEditTip] = useState(false);
  const [id, setId] = useState();
  const [editText, setEditText] = useState("");
  const [category, setCategory] = useState(1);
  const [categoryEdit, setCategoryEdit] = useState(1);
  const auth = useContext(AuthContext);

  const categoryOptions = [
    {value: 1, label: "CSS"},
    {value: 2, label: "Java"},
    {value: 3, label: "JavaScript"},
    {value: 4, label: "HTTP"},
    {value: 5, label: "Python"},
    {value: 6, label: "CPP"},
    {value: 7, label: "Dart"},
    {value: 8, label: "Flutter"},
    {value: 9, label: "Rust"},
    {value: 10, label: "Linux"}
  ]

  const getCategoryLabel = (categoryId) => {
    const category = categoryOptions.find(
      (option) => option.value === categoryId
    );
    return category ? category.label : "";
  };

  const handleCancel = () => {
    formikTip.resetForm();
  };

  const handleTipClickOpen = (id, index) => {
    setOpenEditTip(true);
    setId(id)
    setEditText(data[index].description)
  };

  const handleTipClose = () => {
    setOpenEditTip(false);
  };

  useEffect(() => {
    const creator = auth.userId;
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/getbycreator/${creator}`
      );
        console.log(response);
        setData(response.data.tips);
    };
    fetchData();
  }, [auth.userId]);

    const fetchDataByCategoryAndCreator = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/getall/${category}`
      );
       console.log(response)
       const filteredData = response.data.tips.filter((tip) => tip.creator === auth.userId);
       setData(filteredData);
    };


  const deleteTip = async (tid) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/${tid}/delete`,
        {
          headers: {
            Authorization: 'Bearer ' + auth.token
          },
        }
      );
      console.log(response);

      setData((prev) => prev.filter((e) => e.id !== tid));
    } catch (err) {}
  };

  const editTip = async () => {
    const editedTip = { description: formikTip.values.description, category: categoryEdit, creator: auth.userId };
    try {
      console.log(editedTip);
      const response = await axios.patch(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/${id}/update`,
        editedTip,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: 'Bearer ' + auth.token
          },
        }
      );
      console.log(response);

      setData(() => {
        const newTips = [...data];
        // console.log(newTips);
        const foundIndex = newTips.findIndex((tip) => tip.id === id);
        // console.log(foundIndex);
        newTips[foundIndex].description = formikTip.values.description;
        // console.log([...newTips])
        return [...newTips];
      });
      handleTipClose();
    } catch (err) {}
  };

  const validateTip = (values) => {
    const errors = {};

    if (!values.description) {
      errors.description = "Required tip description";
    }
    return errors;
  };

  let textColor = "";
  let backgroundColor = "";
  if(props.theme === 'light') {
    textColor = 'black'
    backgroundColor = 'white';
  }
  else {
    textColor = '#ECECEC';
    backgroundColor = '#1C1C1C';
  }

  const formikTip = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: editText,
    },
    validate: validateTip,
    onSubmit: editTip,
  });

  return (
      <><CssBaseline /><Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 3,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>{/* content of the first box */}</Box>
      <Dropdown
        isSearchable
        placeHolder="Select..."
        options={categoryOptions}
        onChange={(value) => setCategory(value.value)} />

      <IconButton
        sx={{ marginLeft: 0, mr: "30%" }}
        onClick={() => fetchDataByCategoryAndCreator()}
        style={{ backgroundColor: 'transparent' }}
      >
        {" "}
        <SearchIcon className="searchIcon" />{" "}
      </IconButton>
    </Box><Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4} >
          {data.map((item, index) => (
            <Grid item key={index} xs={10} sm={6} md={6}>
              <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {getCategoryLabel(item.category)}
                  </Typography>
                  <div style={{ overflowY: 'auto' }}>
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
                  </div>
                </CardContent>
                <CardActions>
                  {auth.userId === item.creator && (
                    <Button
                      style={{ display: "inline", marginRight: "2px" }}
                      variant="outlined"
                      onClick={() => {
                        handleTipClickOpen(item.id, index);
                      } }
                    >
                      Edit
                    </Button>
                  )}
                  {auth.userId === item.creator && (
                    <Button
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
              </Card>
              <Dialog
                maxWidth="sm"
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
                  sx={{ mt: 3 }}
                >
                  <DialogTitle id="alert-dialog-title">
                    Change Tip Id: {id}
                    <Dropdown
                      isSearchable
                      placeHolder="Select..."
                      options={categoryOptions}
                      onChange={(value) => setCategoryEdit(value.value)} />
                    <TextField
                      name="description"
                      required
                      variant="outlined"
                      fullWidth
                      id="description"
                      label="Description"
                      multiline={true}
                      rows={10}
                      autoFocus
                      onChange={formikTip.handleChange}
                      value={formikTip.values.description} />
                    {formikTip.errors.description ? (
                      <div style={{ color: "red" }}>
                        {formikTip.errors.description}
                      </div>
                    ) : null}
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      variant="contained"
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
                    >
                      Change Tip Description
                    </Button>
                  </DialogActions>
                </Box>
              </Dialog>
            </Grid>
          ))}
        </Grid>
      </Container></>
  );
}