import React from "react";
import Typography from "@mui/material/Typography";
import Card from "../components/Card";

function HomePage(props) {
  let textColor = ''
  console.log(props.theme)
  if(props.theme === 'light') {
    textColor = 'black'
  }
  else {
    textColor = '#ECECEC'
  }
  return (
    <div style={{width: '100%'}} data-testid="homePage">
      <Typography
        component="h5"
        variant="h3"
        textAlign="center"
        color={textColor}
        marginTop="2.5rem"
        marginBottom="4rem"
        gutterBottom
      >
        Welcome to TOTD (Tip Of The Day) Application!
      </Typography>
      <Card theme={props.theme}/>
    </div>
  );
}

export default HomePage;
