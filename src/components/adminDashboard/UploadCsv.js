import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const UploadCsv = () => {
  const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
  const [totalStrategies, setTotalStrategies] = useState(0);
  const [usersWithAllotedStrategy, setUsersWithAllotedStrategy] = useState([]);

  const { totalSubmitedStrategies, submittedNames } = useSelector((state) => ({
    totalSubmitedStrategies: state.totalSubmitedStrategies,
    submittedNames: state.filledNames,
  }));

  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const today = `${day}-${month}-${year}`;

  const uploadDataHandler = () => {
    setShowUploadConfirmation(true);
  };

  const confirmUploadDataHandler = () => {
    const data = "success";
    axios
      .post("http://172.16.1.47:4000/response", { data })
      .then((res) => {
        alert(res.data.data);
        strategiesLength();
      })
      .catch((err) => {
        console.log(err);
      });
    setShowUploadConfirmation(false);
  };

  const cancelUploadDataHandler = () => {
    setShowUploadConfirmation(false);
  };

  const strategiesLength = () => {
    axios
      .get("/total/strategies")
      .then((response) => {
        const { dataLength, users_with_alotted_strategies } = response.data;
        setTotalStrategies(dataLength);
        setUsersWithAllotedStrategy(users_with_alotted_strategies);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    strategiesLength();
  }, []);

  const notSubmittedUsers = usersWithAllotedStrategy.filter(
    (user) => !submittedNames.includes(user)
  );

  return (
    <div style={{ backgroundColor: "rgb(225, 236, 200)", padding: "1rem" }}>
      <Button
        sx={{
          mr: 2,
          float: "left",
        }}
        variant="contained"
        onClick={uploadDataHandler}
      >
        Upload ({today})'s Data
      </Button>
      {showUploadConfirmation && (
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
            zIndex: 9998,
            gap: "3rem",
          }}
        >
          <p style={{ color: "white", fontSize: "1.5rem" }}>
            Are you sure, you want to upload today's ({today}) data?
          </p>
          <Button
            sx={{
              backgroundColor: "tomato",
            }}
            variant="contained"
            onClick={confirmUploadDataHandler}
          >
            Yes
          </Button>
          <Button
            sx={{
              backgroundColor: "green",
            }}
            variant="contained"
            onClick={cancelUploadDataHandler}
          >
            NO
          </Button>
        </div>
      )}
      <div style={{ float: "right", display: "flex" }}>
        <Card sx={{ width: 170, height: 100, mr: 2 }}>
          <CardContent sx={{ padding: "0", textAlign: "center" }}>
            <h4>Alloted Strategies</h4>
            <p>{totalStrategies}</p>
          </CardContent>
        </Card>
        <Card sx={{ width: 170, height: 100, mr: 2 }}>
          <CardContent sx={{ padding: "0", textAlign: "center" }}>
            <h4>Submitted Strategies</h4>
            <p>{totalSubmitedStrategies}</p>
          </CardContent>
        </Card>
        <Card sx={{ width: 170, height: "auto" }}>
          <CardContent sx={{ padding: "0", textAlign: "center" }}>
            <h4>Not Submitted Yet</h4>
            {notSubmittedUsers.map((item, index) => (
              <p style={{display:"inline", color:"red"}} key={index}>{item}, </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadCsv;
