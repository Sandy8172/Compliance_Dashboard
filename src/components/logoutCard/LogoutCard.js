import React, { useState } from "react";
import Button from "@mui/material/Button";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";

function LogoutCard() {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/",{replace:true})
       };
     
       const handleCancel = () => {
         setShowConfirmation(false);
       };

  return (
    <div>
    <Button
      sx={{
        backgroundColor:"tomato",
        padding:0
      }}
      variant="contained"
      onClick={() => setShowConfirmation(true)}
    >
      <LogoutIcon/>
    </Button>
    {showConfirmation && (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        gap: "3rem",
      }}
    >
      <p style={{ color: "white", fontSize: "1.5rem" }}>
      Are you sure you want to logout?
      </p>
      <Button
      sx={{
        backgroundColor:"tomato"
      }}
      variant="contained"
      onClick={handleLogout}
    >
      Yes
    </Button><Button
      sx={{
        backgroundColor:"green"
      }}
      variant="contained"
      onClick={handleCancel}        >
      NO
    </Button>
    </div>
  )}
  </div>
  )
}

export default LogoutCard;


