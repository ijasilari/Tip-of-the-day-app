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
import SearchIcon from "@mui/icons-material/Search";
import { useContext } from "react";
import { AuthContext } from "../components/auth-context";
//import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import TablePagination from "@mui/material/TablePagination";
import { css } from '@emotion/react';
import "./OwnTips.css"

const labelStyle = css`
  color: red; /* Change the text color */
`;
function ViewTips(props) {
  const [data, setData] = useState([]);
  const [openEditTip, setOpenEditTip] = useState(false);
  const [id, setId] = useState();
  const [editText, setEditText] = useState("");
  const [category, setCategory] = useState(1);
  const [categoryEdit, setCategoryEdit] = useState(1);
  const [like, setLike] = useState(10);
  const [likeActive, setLikeActive] = useState(false);


  const auth = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);
  console.log(paginatedData)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const categoryOptions = [
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
  const removeTheLike = async (id, index) => {
    const res = await axios.patch(
      `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/${id}/likeminus`,
      {
        headers: {
          Authorization: 'Bearer ' + auth.token
        },
      }
    );
    console.log(index);
    if(res) {
      setLike(data[index].likes);
    }
  }

  const addTheLike = async (id, index) => {
    const res = await axios.patch(
      `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/${id}/likeplus`,
      {
        headers: {
          Authorization: 'Bearer ' + auth.token
        },
      }
    );
    if(res) {
      setLike(data[index].likes);
    }
  }

  const likeEff = (id, index) => {
    if(likeActive) {
      setLikeActive(false);
      removeTheLike(id, index);
    } else {
      setLikeActive(true);
      addTheLike(id, index);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/getall`
      );
      //console.log(response);
      setData(response.data.tips);
    };
    fetchData();
  }, []);

  const fetchDataByCategory = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/getall/${category}`
    );
    //console.log(response);
    setData(response.data.tips);
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
      //console.log(response);

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
      //console.log(editedTip);
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
      //console.log(response);

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

  let textColor = "";
  let backgroundColor = "";
  let textAreaOutlineColor = "";
  if(props.theme === 'light') {
    textColor = 'black'
    backgroundColor = 'white';
    textAreaOutlineColor = 'primary';
  }
  else {
    textColor = '#ECECEC';
    backgroundColor = '#1C1C1C';
    textAreaOutlineColor = '#bb86fc';
  }

  return (
    <div data-testid="viewTipsPage">
      <Box
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
          onChange={(value) => setCategory(value.value)}
        />

        <IconButton
          data-testid="fetchDataButton"
          sx={{ marginLeft: 0, mr: "30%" }}
          onClick={() => fetchDataByCategory()}
          style={{ backgroundColor: "transparent" }}
        >
          {" "}
          <SearchIcon className="searchIcon" />{" "}
        </IconButton>
      </Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, backgroundColor: { backgroundColor } }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: textColor }}>Tip Id</TableCell>
              <TableCell align="left" sx={{ color: textColor }}>
                Description
              </TableCell>
              <TableCell align="center" sx={{ color: textColor }}>
                Functions
              </TableCell>
              <TableCell align="center" sx={{ color: textColor }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData &&
              paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ color: textColor }}
                  >
                    {item.id}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      overflow: "auto",
                    }}
                  >
                    <div
                      style={{
                        overflow: "auto",
                        maxWidth: "1000px",
                      }}
                    >
                      <ReactMarkdown
                        children={item.description}
                        components={{
                          p: ({ node, ...props }) => (
                            <p style={{ color: textColor }} {...props} />
                          ),
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <SyntaxHighlighter
                                children={String(children).replace(/\n$/, "")}
                                language={match[1]}
                                style={tomorrow}
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
                    </div>
                  </TableCell>
                  <TableCell align="center" style={{ minWidth: "10rem" }}>
                    {auth.userId === item.creator && (
                      <Button
                        className="buttons"
                        style={{ display: "inline", marginRight: "2px" }}
                        variant="contained"
                        onClick={() => {
                          handleTipClickOpen(item.id, index);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {auth.userId === item.creator && (
                      <Button
                        className="buttons"
                        style={{ display: "inline", marginLeft: "2px" }}
                        variant="contained"
                        onClick={() => {
                          deleteTip(item.id);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                    <IconButton onClick={() => {
                          likeEff(item.id, index);
                        }}> <ThumbUpIcon/> </IconButton>
                    <Dialog
                      maxWidth="sm"
                      id={props.theme}
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
                        sx={{ backgroundColor: backgroundColor }}
                      >
                        <DialogTitle id="alert-dialog-title">
                          Change Tip Id: {id}
                          <Dropdown
                            isSearchable
                            placeHolder="Select..."
                            options={categoryOptions}
                            onChange={(value) => setCategoryEdit(value.value)}
                            theme={props.theme}
                          />
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
                            className='buttons'
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
                            className="buttons"
                          >
                            Change Tip Description
                          </Button>
                        </DialogActions>
                      </Box>
                    </Dialog>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          sx={{
            color: textColor
          }}
        />
      </div>
    </div>
  );
}

export default ViewTips;
