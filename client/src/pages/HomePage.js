import React from "react";
import Typography from "@mui/material/Typography";
import Card from "../components/Card";
import SlideTransition from "../components/SlideTransition";

function HomePage(props) {
  
  let textColor = "";
  if (props.theme === "light") {
    textColor = "black";
  } else {
    textColor = "#ECECEC";
  }
  
  const text = "Welcome to TOTD (Tip Of The Day) Application!"

  return (
    <div style={{ width: "100%" }} data-testid="homePage">
      <SlideTransition text={text} color={textColor}/>
      <Card theme={props.theme} />
    </div>
  );
}

export default HomePage;
