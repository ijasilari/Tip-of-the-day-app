import React from "react";
import Typography from "@mui/material/Typography";
import Card from "../components/Card";

function HomePage() {
  return (
    <div style={{width: '100%'}}>
      <Typography
        component="h5"
        variant="h3"
        textAlign="center"
        color="text.primary"
        marginTop="2.5rem"
        marginBottom="4rem"
        gutterBottom
      >
        Welcome to TOTD (Tip Of The Day) Application!
      </Typography>
      <Card/>
    </div>
  );
}

export default HomePage;
