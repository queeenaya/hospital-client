import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import {
  Countries,
  DiseaseTypes,
  Diseases,
  Discoveries,
  Users,
  PublicServants,
  Doctors,
  Specializations,
  Records,
  MainPage,
} from "./pages";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <NavBar />
        <Box
          sx={{
            flex: "1",
            p: "20px",
            pl: "100px",
            pr: "100px",
            backgroundColor: "#F2F2F2",
          }}
        >
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/disease-types" element={<DiseaseTypes />} />
            <Route path="/diseases" element={<Diseases />} />
            <Route path="/discoveries" element={<Discoveries />} />
            <Route path="/users" element={<Users />} />
            <Route path="/public-servants" element={<PublicServants />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/specializations" element={<Specializations />} />
            <Route path="/records" element={<Records />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
