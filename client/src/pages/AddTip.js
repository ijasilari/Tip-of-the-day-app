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
    <div data-testid="addTipPage" className="background" style={{paddingBottom: '10px', paddingTop: '20px'}}>
      <Typography
        component="h5"
        variant="h3"
        textAlign="center"
        color={textColor}
        marginTop="3rem"
        gutterBottom
        sx={{marginTop: '0'}}
      >
        Add New Tip To The List
      </Typography>
      <Box
        component="form"
        onSubmit={formikTip.handleSubmit}
        textAlign="center"
        alignContent="center"
        justifyContent="center"
        display="-ms-inline-grid"
        flexGrow="1"
        sx={{
          "& > :not(style)": {
            mt: 3,
            ml: "auto",
            mr: "auto",
            width: "90%",
            height: "100%",
            maxWidth: "800px"
          },
        }}
        noValidate
        autoComplete="off"
      >
        <Box
          display="block"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            "& > :not(style)": {
              mt: 3,
              width: "100%",
            },
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
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: textAreaOutlineColor,
              },
            backgroundColor: backgroundColor,
          }}
        />
        {formikTip.errors.category ? (
          <Box
            display="block"
            style={{ color: "red", textAlign: "inherit" }}
          >
            {formikTip.errors.category}
          </Box>
        ) : null}
        {formikTip.errors.description ? (
          <Box
            display="block"
            style={{ color: "red", textAlign: "inherit" }}
          >
            {formikTip.errors.description}
          </Box>
        ) : null}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, display: "block" }}
          className="buttons"
        >
          Add New Tip
        </Button>
        <Container
          style={{
            background: attentionBackground,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "8px",
          }}
        >
          <h1 className="text">Attention!</h1>
          <div style={{ textAlign: "left", paddingBottom: "10px"}}>
            <p className="text">
              This page supports markdown and syntax highlight code. To create
              codeblock with highlight write:
            </p>
            <ReactMarkdown className="nested" children={codeBlSyntax} />
            <p className="text">Example:</p>
            <ReactMarkdown className="nested" children={syntaxExample} />
            <p className="text">Output:</p>
            <ReactMarkdown
              className="nested"
              children={codeExample}
              components={{
                p: ({ node, ...props }) => (
                  <p style={{ color: textColor }} {...props} />
                ),
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
            <p style={{marginTop: "30px"}} className="text">To add a new line of text use <code>\</code>:</p>
            <code className="nested">First Line sentence \
                  Second Line sentence </code>
            <p className="text" style={{marginTop: "30px"}}>Or you can press <code>space key</code> two times then <code>Enter</code>:</p>
            <pre className="nested">
              <p><code>First Line sentence␠␠</code></p>
              <p><code>Second Line sentence</code></p>
            </pre>
          </div>
        </Container>
      </Box>
    </div>
  );
}

export default AddTip;
