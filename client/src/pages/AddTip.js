import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import axios from "axios";
import Dropdown from "./../components/Dropdown";
import { useState } from "react";
import Container from "@mui/material/Container";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useContext } from 'react';
import { AuthContext } from '../components/auth-context';
import "./AddTip.css"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

function AddTip(props) {
  const [category, setCategory] = useState();
  const auth = useContext(AuthContext);

  const codeExample =
  `
  ~~~javascript
  function() {
    const num1 = 5;
    const num2 = 3;
   }
  ~~~
  `
  const codeBlSyntax=
  `
  ~~~
  \`\`\`<codeLanguage>
  <code>
  \`\`\`
  ~~~
  `
  const syntaxExample=
  `
  ~~~
  \`\`\`javascript
  function() {
    const num1 = 5;
    const num2 = 3;
   }
  \`\`\`
  ~~~
  `

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

    const AddNewTip = async () => {
      const newTip = { category: category, description: formikTip.values.description, creator: auth.userId };
      console.log(newTip);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/api/tips/addtip`,
          newTip,
          {
            headers: {
              "Content-Type": "application/json",
              'Accept': 'application/json',
              Authorization: 'Bearer ' + auth.token
            },
          }
        );
        console.log(response);
        formikTip.values.description = "";
        formikTip.errors.description = "";
      } catch (err) {
        console.log(err.message)
      }
    };

    const validateTip = (values) => {
      const errors = {};

      if (!values.description) {
        errors.description = "Required tip description";
      }
      if(!values.category){
        errors.category = "Required tip category"
      }
      return errors;
    };

    const formikTip = useFormik({
      initialValues: {
        description: "",
        category: category,
      },
      validate: validateTip,
      onSubmit: AddNewTip,
    });

    let textColor = "";
    let backgroundColor = "";
    let textAreaOutlineColor = "";
    let attentionBackground = "";
    if(props.theme === 'light') {
      textColor = 'black'
      backgroundColor = 'white';
      textAreaOutlineColor = 'primary';
      attentionBackground = "#f2f6fc";
    }
    else {
      textColor = '#ECECEC';
      backgroundColor = '#1c1c1c';
      textAreaOutlineColor = '#bb86fc';
      attentionBackground = "#373737";
    }

  return (
    <div data-testid="addTipPage">
      <Typography
        component="h5"
        variant="h3"
        textAlign="center"
        color={textColor}
        marginTop="3rem"
        gutterBottom
      >
        Add New Tip To The List
      </Typography>
      <Box
        component="form"
        onSubmit={formikTip.handleSubmit}
        textAlign="center"
        flexGrow="1"
        sx={{
          "& > :not(style)": { mt: 3, ml: 3, mr: 3, width: "50%" , height: '100%'},
        }}
        noValidate
        autoComplete="off"
      >
        <Box
          flexGrow="1"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& > :not(style)": { mt: 3, ml: "125%", mr: "31%", width: "100%" },
          }}
        >
          <Dropdown
            isSearchable
            placeHolder="Select..."
            options={categoryOptions}
            onChange={(value) => {
              setCategory(value.value);
              formikTip.values.category = value.value;
            }}
          />
        </Box>
        <TextField
          id="description"
          name="description"
          label="New Tip Description"
          multiline={true}
          rows={10}
          variant="outlined"
          inputProps={{ maxLength: 2000 }}
          onChange={formikTip.handleChange}
          value={formikTip.values.description}
          sx={{
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: textAreaOutlineColor,
            },
            backgroundColor: backgroundColor
          }}
        />
        {formikTip.errors.category ? (
          <Box
            display="inline-flex"
            style={{ color: "red", textAlign: "inherit" }}
          >
            {formikTip.errors.category}
          </Box>
        ) : null}
        {formikTip.errors.description ? (
          <Box
            display="inline-flex"
            style={{ color: "red", textAlign: "inherit" }}
          >
            {formikTip.errors.description}
          </Box>
        ) : null}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          className="buttons"

        >
          Add New Tip
        </Button>
        <Container
          style={{
            background: attentionBackground,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "8px"
          }}
        >
          <h1 className="text">Attention!</h1>
          <div style={{ textAlign: "left", paddingBottom: "10px"}}>
            <p className="text">
              This page supports markdown and syntax highlight code. To create
              codeblock with highlight write:
            </p>
            <ReactMarkdown children={codeBlSyntax} />
            <p className="text">Example:</p>
            <ReactMarkdown children={syntaxExample} />
            <p className="text">Output:</p>
            <ReactMarkdown
              children={codeExample}
              components={{
                p: ({ node, ...props }) => <p style={{ color: textColor }} {...props} />,
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
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
        </Container>
      </Box>
    </div>
  );
}

export default AddTip;
