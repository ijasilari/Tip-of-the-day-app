import React from "react";
import Typography from "@mui/material/Typography";

function HomePage() {
  return (
    <>
      <Typography
        component="h5"
        variant="h3"
        textAlign="center"
        color="text.primary"
        gutterBottom
      >
        Welcome to TOTD (Tip Of The Day) Application
      </Typography>
    </>
  );
}

export default HomePage;
