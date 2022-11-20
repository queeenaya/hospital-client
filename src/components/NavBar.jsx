import { Link } from "react-router-dom";

import { Container, Typography, AppBar, Box, Toolbar } from "@mui/material";

export const NavBar = () => {
  return (
    <Container
      maxWidth="100%"
      sx={{ padding: "20px", background: "#D3E0EA", color: "white" }}
    >
      <AppBar
        elevation={0}
        position="static"
        sx={{
          background: "#D3E0EA",
          color: "white",
        }}
      >
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              flexDirection: "row",
              display: "flex",
              pl: "60px",
              gap: "80px",
              alignItems: "center",
            }}
          >
            <Typography variant="overline" component="div">
              <Link to="/">Main Page</Link>
            </Typography>
            <Box
              sx={{
                flexDirection: "row",
                display: "flex",
                gap: "64px",
              }}
            >
              <Typography variant="overline" component="div">
                <Link to="/disease-types">Disease Types</Link>
              </Typography>
              <Typography variant="overline" component="div">
                <Link to="/countries">Countries</Link>
              </Typography>
              <Typography variant="overline" component="div">
                <Link to="/diseases">Diseases</Link>
              </Typography>
              <Typography variant="overline" component="div">
                <Link to="/discoveries">Discoveries</Link>
              </Typography>
              <Typography variant="overline" component="div">
                <Link to="/users">Users</Link>
              </Typography>
              <Typography variant="overline" component="div">
                <Link to="/public-servants">Public Servants</Link>
              </Typography>
              <Typography variant="overline" component="div">
                <Link to="/doctors">Doctors</Link>
              </Typography>
              <Typography variant="overline" component="div">
                <Link to="/specializations">Specializations</Link>
              </Typography>
              <Typography variant="overline" component="div">
                <Link to="/records">Records</Link>
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Container>
  );
};
