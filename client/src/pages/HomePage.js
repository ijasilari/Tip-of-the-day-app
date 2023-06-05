import React from "react";
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
    <div data-testid="homePage" className="background">
      <SlideTransition text={text} color={textColor}/>
      <Card theme={props.theme} />
    </div>
  );
}

export default HomePage;
