import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { dataSliceActions } from "../../store/dataSlice";
import AdminTableHeaders from "./AdminTableHeaders";
import PersonIcon from "@mui/icons-material/Person";
import { CSVLink } from "react-csv";

function AdminTable() {
  const [inputValues, setInputValues] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const dispatch = useDispatch();

  const { Admin_Data, isVisible, showNotification } = useSelector((state) => ({
    Admin_Data: state.Admin_Data,
    isVisible: state.isVisible,
    showNotification: state.showNotification,
  }));

  useEffect(() => {
    setInputValues(Admin_Data.map((row) => ({})));
  }, [Admin_Data]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(dataSliceActions.hideNotification());
    }, 5000);
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedValues = [...inputValues];
    if (!updatedValues[index]) {
      updatedValues[index] = {};
    }
    updatedValues[index][field] = value;
    setInputValues(updatedValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValues.length < Admin_Data.length) {
      alert("Please fill in the values");
      return;
    }
    setShowConfirmation(true);
  };
  console.log(Admin_Data);
  const totalMTM = Admin_Data.reduce((acc, curr) => {
    const mtoMValue = curr?.MtoM ? +curr.MtoM : 0;
    return acc + mtoMValue;
  }, 0);

  const totalExecutedQty = Admin_Data.reduce((acc, curr) => {
    const executedValue = curr?.Executed_Qty ? +curr.Executed_Qty : 0;
    return acc + executedValue;
  }, 0);
  const handleConfirmSubmit = async () => {
    const submittedData = inputValues.map((input, index) => {
      return {
        Id: input?.Id !== undefined ? input?.Id : Admin_Data[index].Id,
        Alloted_Abbr: Admin_Data[index].Alloted_Abbr,
        Executed_Abbr:
          input?.Abbr !== undefined
            ? input?.Abbr
            : Admin_Data[index].Executed_Abbr,
        Alloted_Qty: Admin_Data[index].Alloted_Qty,
        Executed_Qty:
          input?.Quantity !== undefined
            ? input?.Quantity
            : Admin_Data[index].Executed_Qty,
        MtoM: input?.MtoM !== undefined ? input?.MtoM : Admin_Data[index].MtoM,
        Name: Admin_Data[index].Name,
        Team: Admin_Data[index].Team,
        Strategy_name: Admin_Data[index].Strategy_name,
        Strategy_type: Admin_Data[index].Strategy_type,
        Instrument: Admin_Data[index].Instrument,
        Cluster: Admin_Data[index].Cluster,
        Day: Admin_Data[index].Day,
        Date: Admin_Data[index].Date,
        Region: Admin_Data[index].Region,
      };
    });

    try {
      const response = await axios.post("/admin-submit", { submittedData });
      alert("Successfully submitted");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred while submitting");
    }

    setShowConfirmation(false);
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  const getCsvData = () => {
    return Admin_Data.map((row) => ({
      Id: row.Id,
      Name: row.Name,
      Team: row.Team,
      Strategy_type: row.Strategy_type,
      Strategy_name: row.Strategy_name,
      Instrument: row.Instrument,
      Alloted_Abbr: row.Alloted_Abbr,
      Executed_Abbr: row.Executed_Abbr,
      Alloted_Qty: row.Alloted_Qty,
      Executed_Qty: row.Executed_Qty,
      MtoM: row.MtoM,
    }));
  };

  return (
    <>
      {showNotification && (
        <div className="notification">
          <div style={{ display: "flex", alignItems: "center" }}>
            <PersonIcon /> Admin!
          </div>
        </div>
      )}
      {isVisible ? (
        <>
          <Box sx={{ width: "100%" }}>
            <Paper
              sx={{
                width: "100%",
                mb: 2,
                maxHeight: "75.3vh",
                overflowY: "auto",
              }}
            >
              <TableContainer sx={{ height: "100%" }}>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size="small"
                >
                  <AdminTableHeaders />
                  <TableBody>
                    {Admin_Data.map((row, index) => {
                      return (
                        <TableRow hover key={index} sx={{ cursor: "pointer" }}>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            align="center"
                          >
                            {row.Id}
                          </TableCell>
                          <TableCell align="center">{row.Name}</TableCell>
                          <TableCell align="center">{row.Team}</TableCell>
                          <TableCell align="center">
                            {row.Strategy_type}
                          </TableCell>
                          <TableCell align="center">
                            {row.Strategy_name}
                          </TableCell>
                          <TableCell align="center">{row.Instrument}</TableCell>
                          <TableCell align="center">
                            {row.Alloted_Abbr}
                          </TableCell>
                          <TableCell align="center">
                            <input
                              style={{ width: "4.5rem" }}
                              value={
                                inputValues[index]?.Abbr !== undefined
                                  ? inputValues[index]?.Abbr
                                  : row.Executed_Abbr
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "Abbr",
                                  e.target.value.toUpperCase()
                                )
                              }
                              type="text"
                            />
                          </TableCell>
                          <TableCell align="center">
                            {row.Alloted_Qty}
                          </TableCell>
                          <TableCell align="center">
                            <input
                              style={{ width: "4.5rem" }}
                              value={
                                inputValues[index]?.Quantity !== undefined
                                  ? inputValues[index]?.Quantity
                                  : row.Executed_Qty
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "Quantity",
                                  e.target.value
                                )
                              }
                              type="number"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <input
                              style={{ width: "4.5rem" }}
                              value={
                                inputValues[index]?.MtoM !== undefined
                                  ? inputValues[index]?.MtoM
                                  : row.MtoM
                              }
                              onChange={(e) =>
                                handleInputChange(index, "MtoM", e.target.value)
                              }
                              type="number"
                            />
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

          <CSVLink data={getCsvData()} filename="exported_data.csv">
            <Button
              sx={{
                float: "right",
                mr: 2,
              }}
              variant="contained"
            >
              Export
            </Button>
          </CSVLink>
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
      ) : (
        <div
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "1.5rem",
            background: "#010819",
          }}
        >
          Select any user from dropdown to view strategy
        </div>
      )}
    </>
  );
}

export default AdminTable;
