import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
import { IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useContext } from 'react';
import { AuthContext } from '../components/auth-context';
import "./viewTips.css";

function ViewTips() {
  const [data, setData] = useState([]);
  const [openEditTip, setOpenEditTip] = useState(false);
  const [id, setId] = useState();
  const [editText, setEditText] = useState("");
  const [category, setCategory] = useState(1);
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
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/getall`
      );
       console.log(response)
      setData(response.data.tips);
    };
    fetchData();
  }, []);

    const fetchDataByCategory = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/getall/${category}`
      );
       console.log(response)
      setData(response.data.tips);
    };


  const deleteTip = async (tid) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/${tid}/delete`,
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
    const editedTip = { description: formikTip.values.description, category:1 };
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/${id}/update`,
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

  // console.log(editText)

  const formikTip = useFormik({
    enableReinitialize: true,
    initialValues: {
      description: editText,
    },
    validate: validateTip,
    onSubmit: editTip,
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt:3
        }}
      >
        <Box sx={{ flexGrow: 1}}>{/* content of the first box */}</Box>
        <Dropdown
          isSearchable
          placeHolder="Select..."
          options={categoryOptions}
          onChange={(value) => setCategory(value.value)}
        />

        <IconButton
          sx={{ marginLeft: 0, mr:'30%'}}
          onClick={() => fetchDataByCategory()}
        >
          {" "}
          <SearchIcon />{" "}
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Tip Id</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Functions</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      overflow: "auto",
                    }}
                  >
                    <ReactMarkdown
                      children={item.description}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, "")}
                              language={match[1]}
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" style={{minWidth:'10rem'}}>
                    {auth.isLoggedIn && (
                      <Button
                        style={{ display: 'inline', marginRight: '2px' }}
                        variant="contained"
                        onClick={() => {
                          handleTipClickOpen(item.id, index);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {auth.isLoggedIn && (
                    <Button
                      style={{ display: 'inline', marginLeft:'2px' }}
                      variant="contained"
                      onClick={() => {
                        deleteTip(item.id);
                      }}
                    >
                      Delete
                    </Button>
                  )}
                    <Dialog
                      maxWidth="sm"
                      open={openEditTip}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      onClose={() => {
                        handleTipClose();
                      }}
                    >
                      <Box
                        component="form"
                        noValidate
                        onSubmit={formikTip.handleSubmit}
                        sx={{ mt: 3 }}
                      >
                        <DialogTitle id="alert-dialog-title">
                          Change Tip Id: {id}
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
                            value={formikTip.values.description}
                          />
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
                            }}
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
                  </TableCell>
                  <TableCell align="right">

                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ViewTips;
