import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const UpdateAbsent = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [absentUsers, setAbsentUsers] = useState([]);
  const [selectedPresentUsers, setSelectedPresentUsers] = useState([]);
  const [selectedAbsentUsers, setSelectedAbsentUsers] = useState([]);
  const [showPresentOptions, setShowPresentOptions] = useState(false);
  const [showAbsentOptions, setShowAbsentOptions] = useState(false);

  useEffect(() => {
    fetchAllData();
    fetchAbsentData();
  }, []);

  const fetchAllData = () => {
    axios
      .get("/allUsers/data/admin")
      .then((response) => {
        const { allUsersData } = response.data;
        const allNameIds = allUsersData.map((item) => {
          return {
            userID: item.userID,
            name: item.name,
          };
        });

        setAllUsers(allNameIds);
      })
      .catch((err) => console.log(err));
  };

  const fetchAbsentData = () => {
    axios
      .get("/absentUsers/data/admin")
      .then((response) => {
        const { absentUsersData } = response.data;
        const sortedAbsentUsers = absentUsersData.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const absentNameIds = sortedAbsentUsers.map((item) => {
          return {
            userID: item.userID,
            name: item.name,
          };
        });

        setAbsentUsers(absentNameIds);
      })
      .catch((err) => console.log(err));
  };
  const sortedPresentUsers = allUsers.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const presentUsers = sortedPresentUsers.filter(
    (user) => !absentUsers.some((absentUser) => absentUser.name === user.name)
  );

  const handleAllUserCheckboxChange = (event, userID) => {
    const { checked } = event.target;
    const user = presentUsers.find((item) => item.userID === userID);

    if (checked) {
      setSelectedPresentUsers((prevSelected) => [...prevSelected, user]);
    } else {
      setSelectedPresentUsers((prevSelected) =>
        prevSelected.filter((item) => item.userID !== userID)
      );
    }
  };

  const handleAbsentUserCheckboxChange = (event, userID) => {
    const { checked } = event.target;
    const user = absentUsers.find((item) => item.userID === userID);

    if (checked) {
      setSelectedAbsentUsers((prevSelected) => [...prevSelected, user]);
    } else {
      setSelectedAbsentUsers((prevSelected) =>
        prevSelected.filter((item) => item.userID !== userID)
      );
    }
  };
  const addAbsentHandler = () => {
    if (selectedPresentUsers.length > 0) {
      axios
        .post("/addAbsent/user/admin", { selectedPresentUsers })
        .then((res) => {
          setShowPresentOptions(false);
          setSelectedPresentUsers([]);
          fetchAllData();
          fetchAbsentData();
        })
        .catch((err) => console.log(err));
    } else {
      alert("choose atleast one user!");
    }
  };
  const removeAbsentHandler = () => {
    if (selectedAbsentUsers.length > 0) {
      axios
        .post("/removeAbsent/user/admin", { selectedAbsentUsers })
        .then((res) => {
          setShowAbsentOptions(false);
          setSelectedAbsentUsers([]);
          fetchAbsentData();
          fetchAllData();
        })
        .catch((err) => console.log(err));
    } else {
      alert("choose atleast one user!");
    }
  };

  return (
    <div
      style={{
        gap: "2rem",
        backgroundColor: "rgb(225, 236, 200)",
        padding: " 1rem 1rem",
      }}
    >
      <div className="dropdown-trigger">
        <Button
          variant="contained"
          sx={{ backgroundColor: "grey" }}
          className="dropdown-button"
          onClick={() => setShowPresentOptions((prev) => !prev)}
        >
          Present Users
          <span className="arrow">&#9662;</span>
        </Button>
        {showPresentOptions && (
          <>
            <div className="dropdown-options">
              {presentUsers.map((value, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      value={value.userID}
                      checked={selectedPresentUsers.some(
                        (user) => user.userID === value.userID
                      )}
                      onChange={(event) =>
                        handleAllUserCheckboxChange(event, value.userID)
                      }
                    />
                  }
                  label={value.name}
                />
              ))}
            </div>
            <Button
              variant="contained"
              color="success"
              onClick={addAbsentHandler}
              sx={{ fontSize: "0.8rem", padding: "2px" }}
            >
              Add To Absent
            </Button>
          </>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "grey" }}
          className="dropdown-button"
          onClick={() => setShowAbsentOptions((prev) => !prev)}
        >
          Absent Users
          <span className="arrow">&#9662;</span>
        </Button>
        {showAbsentOptions && (
          <>
            <div className="dropdown-options">
              {absentUsers.map((value, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      value={value.userID}
                      checked={selectedAbsentUsers.some(
                        (user) => user.userID === value.userID
                      )}
                      onChange={(event) =>
                        handleAbsentUserCheckboxChange(event, value.userID)
                      }
                    />
                  }
                  label={value.name}
                />
              ))}
            </div>
            <Button
              variant="contained"
              color="success"
              onClick={removeAbsentHandler} //   sx={{ color: "white" }}
              sx={{ fontSize: "0.8rem", padding: "2px" }}
            >
              Remove From Absent
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateAbsent;
