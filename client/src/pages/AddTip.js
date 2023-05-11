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


function AddTip() {
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
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/addtip`,
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
      } catch (err) {}
    };



    const validateTip = (values) => {
      const errors = {};

      if (!values.description) {
        errors.description = "Required tip description";
      }
      return errors;
    };

    const formikTip = useFormik({
      initialValues: {
        description: "",
      },
      validate: validateTip,
      onSubmit: AddNewTip,
    });
  return (
    <div data-testid="addTipPage">
      <Typography
        component="h5"
        variant="h3"
        textAlign="center"
        color="text.primary"
        marginTop="3rem"
        gutterBottom
      >
        Add New Tip To The List
      </Typography>
      <Dropdown
          isSearchable
          placeHolder="Select..."
          options={categoryOptions}
          onChange={(value) => setCategory(value.value)}
        />
      <Box
        component="form"
        onSubmit={formikTip.handleSubmit}
        textAlign="center"
        flexGrow="1"
        sx={{
          "& > :not(style)": { mt: 3, ml: 3, mr: 3, width: "50%" },
        }}
        noValidate
        autoComplete="off"
      >
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
        />
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
        >
          Add New Tip
        </Button>
        <Container style={{ background: '#f2f6fc', display: 'block', marginLeft: 'auto', marginRight: 'auto'}}>
          <h1>Attention!</h1>
          <div style={{textAlign: 'left'}}>
            <p>This page supports markdown and syntax highlight code.
               To create codeblock with highlight write:</p>
            <ReactMarkdown children={codeBlSyntax}/>
            <p>Example:</p>
            <ReactMarkdown children={syntaxExample}/>
            <p>Output:</p>
            <ReactMarkdown
                    children={codeExample}
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
          </div>
        </Container>
      </Box>

    </div>
  );
}

export default AddTip;
