import React from "react";
import { Box } from "@mui/material";

export const MainPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ fontSize: "20px" }}>
        <h1>Welcome to the Hospital!</h1>
        <h4>
          “A good laugh and a long sleep are the best cures in the doctor’s
          book.” – Irish proverb
        </h4>
        <p>Please click on each link on the navigation bar to see tables.</p>
      </Box>
      <Box style={{ height: "700px" }}>
        <img
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          src="/shaun.jpg"
          alt="Doctor"
        />
      </Box>
    </Box>
  );
};
