import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";

function SlideTransition(props) {
  const [checked, setChecked] = useState(false);

  const icon = (
    <Typography
      component="h5"
      variant="h3"
      textAlign="center"
      color={props.color}
      marginTop="0"
      marginBottom="4rem"
      gutterBottom
    >
      {props.text}
    </Typography>
  );

  useEffect(() => {
    setChecked(true);
  }, []);

  return (
    <Box sx={{ height: 180 }}>
      <Grow
        in={checked}
        style={{ transformOrigin: "100 100 0" }}
        {...(checked ? { timeout: 3500 } : {})}
      >
        {icon}
      </Grow>
    </Box>
  );
}

export default SlideTransition;
