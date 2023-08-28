import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/signin&signup/SignIn";
import MainDash from "./components/mainDashboard/MainDash";
import AbsentDash from "./components/absentDashboard/AbsentDash";
import AdminPage from "./components/adminDashboard/AdminPage";
function App() {
  axios.defaults.baseURL = "http://172.16.1.47:5050";
  return (
    // <><h1 style={{ textAlign: "center", color:"white" }}>application is under maintenance we will be back shortly ! </h1></>
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route
        path="/dashboard"
        element={
          <>
            <MainDash />
            <AbsentDash />
          </>
        }
      />
      <Route path="/dashboard/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
