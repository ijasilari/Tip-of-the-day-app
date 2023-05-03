import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import axios from "axios";

function AddTip() {

    const AddNewTip = async () => {
      const newTip = { description: formikTip.values.description };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_LOCAL_BACKEND_URL}/addtip`,
          newTip,
          {
            headers: {
              "Content-Type": "application/json",
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
    <>
      <Typography
        component="h5"
        variant="h3"
        textAlign="center"
        color="text.primary"
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
      </Box>
    </>
  );
}

export default AddTip;
