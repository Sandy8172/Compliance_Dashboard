import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Paper,
} from "@mui/material";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PersonIcon from "@mui/icons-material/Person";
import TableHeaders from "./TableHeaders";
import { useDispatch, useSelector } from "react-redux";
import "./MainTable.css";
import { dataSliceActions } from "../../store/dataSlice";
import { useNavigate } from "react-router-dom";
import LogoutCard from "../logoutCard/LogoutCard";
const MainTable = () => {
  const [legsInputValues, setLegsInputValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigate = useNavigate();
  const uId = localStorage.getItem("uId");
  const userName = localStorage.getItem("userName");
  const dispatch = useDispatch();
  const { MainTable_Data, showNotification, refreshAdditionCount } =
    useSelector((state) => ({
      MainTable_Data: state.MainTable_Data,
      showNotification: state.showNotification,
      refreshAdditionCount: state.refreshAdditionCount,
    }));
  const handleRemoval = async (rowToDelete) => {
    try {
      await axios.post(`delete/${uId}`, { rowToDelete });
      fetchDataHandler();
      dispatch(dataSliceActions.refreshOnDelete());
    } catch (err) {
      console.log("Error deleting row");
    }
  };
  const fetchDataHandler = () => {
    axios
      .post("/currentUser", { uId })
      .then((response) => {
        const { userData } = response.data;

        const data = userData[0].items;
        dispatch(dataSliceActions.addMainData(data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchDataHandler();
  }, [refreshAdditionCount]);
  useEffect(() => {
    setTimeout(() => {
      dispatch(dataSliceActions.hideNotification());
    }, 5000);
  }, []);

  const handleLegsInputChange = (index, field, value) => {
    const updatedValues = [...legsInputValues];
    if (!updatedValues[index]) {
      updatedValues[index] = {};
    }
    updatedValues[index][field] = value;
    setLegsInputValues(updatedValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (legsInputValues.length < MainTable_Data.length) {
      alert("Please fill in the values");
      return;
    }

    const isEmpty = legsInputValues.some((input) => {
      return !input.MtoM || !input.legs;
    });

    if (isEmpty) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    setShowConfirmation(true);
  };

  // Get the current date
  const currentDate = new Date();
  // Get the day as a number
  const dayNumber = currentDate.getDay();
  // Create an array to map the day number to the day name
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Get the day name using the day number
  const todayDay = daysOfWeek[dayNumber];

  // Get current date
  const today = new Date();

  // Extract day, month, and year
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = today.getFullYear();
  // Format the date as dd-mm-yyyy
  const formattedDate = `${day}-${month}-${year}`;

  const handleConfirmSubmit = () => {
    const filledData = legsInputValues.map((input, index) => {
      return {
        Id: MainTable_Data[index].userID,
        Alloted_Abbr: MainTable_Data[index].abbr,
        Executed_Abbr:
          input?.Abbr !== undefined ? input?.Abbr : MainTable_Data[index].abbr,
        Alloted_Qty: MainTable_Data[index].quantity,
        Executed_Qty:
          legsInputValues[index].legs * MainTable_Data[index].quantity,
        MtoM: input?.MtoM,
        Name: MainTable_Data[index].name,
        Team: MainTable_Data[index].team_name,
        Strategy_name: MainTable_Data[index].strategy_name,
        Strategy_type: MainTable_Data[index].strategy_type,
        Instrument: MainTable_Data[index].inst_name,
        Cluster: MainTable_Data[index].cluster,
        Day: todayDay,
        Date: formattedDate,
        Region:
          MainTable_Data[index].name == "Nirmal"
            ? "Delhi-XTS"
            : "Delhi",
      };
    });
    axios
      .post("/api/submitData", { filledData })
      .then(() => {
        setIsLoading(true);
        const timer = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(timer);
          setIsLoading(false);
          navigate("/", { replace: true });
        }, 5000);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
    setShowConfirmation(false);
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  const totalMTM = legsInputValues.reduce((acc, curr) => {
    const mtoMValue = curr?.MtoM ? +curr.MtoM : 0;
    return acc + mtoMValue;
  }, 0);

  const totalExecutedQty = legsInputValues.reduce((acc, curr, ind) => {
    return acc + (curr?.legs ? curr.legs : 0) * MainTable_Data[ind]?.quantity;
  }, 0);

  return (
    <>
      <span style={{ position: "absolute", right: "0.5rem", top: "0.3rem" }}>
        <LogoutCard />
      </span>
      {isLoading && (
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
          <p style={{ color: "white", fontSize: "1.8rem" }}>
            Submitted Successfully
          </p>
          <p style={{ color: "tomato", fontSize: "1.5rem" }}>
            You are being redirected to login page... {countdown}
          </p>
        </div>
      )}

      {showNotification && (
        <div className="notification">
          <div style={{ display: "flex", alignItems: "center" }}>
            <PersonIcon /> {userName}!
          </div>
        </div>
      )}
      {MainTable_Data.length > 0 ? (
        <>
          <Box sx={{ width: "100%" }}>
            <Paper
              sx={{
                width: "100%",
                mb: 2,
                maxHeight: "80vh",
                overflowY: "auto",
                scrollBehavior: "smooth",
              }}
            >
              <TableContainer sx={{ height: "100%" }}>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size="small"
                >
                  <TableHeaders />
                  <TableBody>
                    {MainTable_Data.map((row, index) => {
                      return (
                        <TableRow hover key={index} sx={{ cursor: "pointer" }}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            align="center"
                          >
                            {row.userID}
                          </TableCell>
                          <TableCell align="center">{row.name}</TableCell>
                          <TableCell align="center">{row.team_name}</TableCell>
                          <TableCell align="center">
                            {row.strategy_type}
                          </TableCell>
                          <TableCell align="center">
                            {row.strategy_name}
                          </TableCell>
                          <TableCell align="center">{row.inst_name}</TableCell>
                          <TableCell align="center">{row.abbr}</TableCell>
                          <TableCell align="center">
                            <input
                              style={{ width: "4.5rem" }}
                              value={
                                legsInputValues[index]?.Abbr !== undefined
                                  ? legsInputValues[index]?.Abbr
                                  : row.abbr
                              }
                              onChange={(e) =>
                                handleLegsInputChange(
                                  index,
                                  "Abbr",
                                  e.target.value.toUpperCase()
                                )
                              }
                              type="text"
                            />
                          </TableCell>
                          <TableCell align="center">{row.quantity}</TableCell>
                          <TableCell align="center">
                            {row.strategy_type === "Simple" ? (
                              <>
                                <label htmlFor={`option1-${index}`}>2</label>
                                <input
                                  style={{ cursor: "pointer" }}
                                  type="radio"
                                  name={`simpleOption-${index}`}
                                  value={"2"}
                                  id={`option1-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                              </>
                            ) : row.strategy_type === "Straddle_Premium" ? (
                              <>
                                <label htmlFor={`option1-${index}`}>2</label>
                                <input
                                  style={{ cursor: "pointer" }}
                                  type="radio"
                                  name={`straddlePremiumOption-${index}`}
                                  value={"2"}
                                  id={`option1-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                              </>
                            ) : row.strategy_type === "Discount" ? (
                              <>
                                <label htmlFor={`option1-${index}`}>0</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "2rem",
                                  }}
                                  type="radio"
                                  name={`discountOption-${index}`}
                                  value={"0"}
                                  id={`option1-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor={`option2-${index}`}>1</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "2rem",
                                  }}
                                  type="radio"
                                  name={`discountOption-${index}`}
                                  value={"1"}
                                  id={`option2-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor={`option3-${index}`}>2</label>
                                <input
                                  style={{ cursor: "pointer" }}
                                  type="radio"
                                  name={`discountOption-${index}`}
                                  value={"2"}
                                  id={`option3-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                              </>
                            ) : row.strategy_type === "Trailing" ? (
                              <>
                                <label htmlFor={`option1-${index}`}>2</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "2rem",
                                  }}
                                  type="radio"
                                  name={`trailingOption-${index}`}
                                  value={"2"}
                                  id={`option1-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor={`option2-${index}`}>4</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "2rem",
                                  }}
                                  type="radio"
                                  name={`trailingOption-${index}`}
                                  value={"4"}
                                  id={`option2-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor={`option3-${index}`}>6</label>
                                <input
                                  style={{ cursor: "pointer" }}
                                  type="radio"
                                  name={`trailingOption-${index}`}
                                  value={"6"}
                                  id={`option3-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                              </>
                            )
                            : row.strategy_type === "SSDS" ? (
                              <>
                                <label htmlFor={`option1-${index}`}>2</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "1rem",
                                  }}
                                  type="radio"
                                  name={`trailingOption-${index}`}
                                  value={"2"}
                                  id={`option1-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor={`option2-${index}`}>4</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "1rem",
                                  }}
                                  type="radio"
                                  name={`trailingOption-${index}`}
                                  value={"4"}
                                  id={`option2-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                 <label htmlFor={`option3-${index}`}>5</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "1rem",
                                  }}
                                  type="radio"
                                  name={`trailingOption-${index}`}
                                  value={"5"}
                                  id={`option3-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor={`option4-${index}`}>6</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "1rem",
                                  }}
                                  type="radio"
                                  name={`trailingOption-${index}`}
                                  value={"6"}
                                  id={`option4-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor={`option5-${index}`}>7</label>
                                <input
                                  style={{ cursor: "pointer" }}
                                  type="radio"
                                  name={`trailingOption-${index}`}
                                  value={"7"}
                                  id={`option5-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                              </>
                            ) : row.strategy_type === "SimpleDiscount" ? (
                              <>
                                <label htmlFor={`option1-${index}`}>2</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "2rem",
                                  }}
                                  type="radio"
                                  name={`simpleDiscountOption-${index}`}
                                  value={"2"}
                                  id={`option1-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor={`option2-${index}`}>3</label>
                                <input
                                  style={{ cursor: "pointer" }}
                                  type="radio"
                                  name={`simpleDiscountOption-${index}`}
                                  value={"3"}
                                  id={`option2-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                              </>
                            ) : row.strategy_type === "CombinedDiscount" ? (
                              <>
                                <label htmlFor={`option1-${index}`}>0</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "2rem",
                                  }}
                                  type="radio"
                                  name={`simpleDiscountOption-${index}`}
                                  value={"0"}
                                  id={`option1-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor={`option2-${index}`}>1</label>
                                <input
                                  style={{
                                    cursor: "pointer",
                                    marginRight: "2rem",
                                  }}
                                  type="radio"
                                  name={`simpleDiscountOption-${index}`}
                                  value={"1"}
                                  id={`option2-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                                <label htmlFor={`option3-${index}`}>2</label>
                                <input
                                  style={{ cursor: "pointer" }}
                                  type="radio"
                                  name={`simpleDiscountOption-${index}`}
                                  value={"2"}
                                  id={`option3-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                              </>
                            ) :
                             (
                              <>
                                <label htmlFor={`option1-${index}`}>2</label>
                                <input
                                  style={{ cursor: "pointer" }}
                                  type="radio"
                                  name={`DaywiseOption-${index}`}
                                  value={"2"}
                                  id={`option1-${index}`}
                                  onChange={(e) =>
                                    handleLegsInputChange(
                                      index,
                                      "legs",
                                      e.target.value
                                    )
                                  }
                                />
                              </>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {legsInputValues[index]?.legs
                              ?  legsInputValues[index].legs * row.quantity
                              : "0"}
                          </TableCell>
                          <TableCell align="center">
                            <input
                              style={{ width: "4.5rem" }}
                              value={legsInputValues[index]?.MtoM || ""}
                              onChange={(e) =>
                                handleLegsInputChange(
                                  index,
                                  "MtoM",
                                  e.target.value
                                )
                              }
                              type="number"
                            />
                          </TableCell>
                          <TableCell>
                            {uId != row.userID2 ? (
                              <RemoveCircleIcon
                                onClick={() => handleRemoval(row)}
                                sx={{
                                  color: "tomato",
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
          <div>
            <Button
              sx={{
                float: "right",
                mr: 2,
              }}
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
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
                  zIndex: 9998,
                  gap: "3rem",
                }}
              >
                <p style={{ color: "white", fontSize: "1.5rem" }}>
                  Are you sure, you want to submit?
                </p>
                <Button
                  sx={{
                    backgroundColor: "tomato",
                  }}
                  variant="contained"
                  onClick={handleConfirmSubmit}
                >
                  Yes
                </Button>
                <Button
                  sx={{
                    backgroundColor: "green",
                  }}
                  variant="contained"
                  onClick={handleCancelSubmit}
                >
                  NO
                </Button>
              </div>
            )}
          </div>
        </>
      ) : (
        <p style={{ color: "red", textAlign: "center", fontSize: "1.5rem" }}>
          Data not uploaded yet
        </p>
      )}
      <Button
        sx={{
          float: "right",
          mr: 2,
        }}
        variant="contained"
      >
        Total MTM : {totalMTM}
      </Button>
      <Button
        sx={{
          float: "right",
          mr: 2,
        }}
        variant="contained"
      >
        Total ExecutedQty : {totalExecutedQty}
      </Button>
    </>
  );
};

export default MainTable;