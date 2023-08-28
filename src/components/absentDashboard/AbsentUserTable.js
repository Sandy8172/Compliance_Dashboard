import React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import AbsentUserHeaders from "./AbsentUserHeaders";
import { useSelector, useDispatch } from "react-redux";
import { dataSliceActions } from "../../store/dataSlice";

const AbsentUserTable = () => {
  const dispatch = useDispatch();
  const { Absent_Data, isVisible, selectedRows } = useSelector((state) => ({
    Absent_Data: state.Absent_Data,
    isVisible: state.isVisible,
    selectedRows: state.selectedRows,
  }));

  const handleCheckboxChange = (event, row) => {
    const isChecked = event.target.checked;
    dispatch(dataSliceActions.checkBoxHandler({ isChecked, row }));
  };

  const addRowHandler = async () => {
    try {
      const uId = localStorage.getItem("uId");
      const userName = localStorage.getItem("userName");
      const teamName = localStorage.getItem("teamName");
      await axios
      .post(`/api/data/${uId}`, { selectedRows, userName,teamName })
      .then(() => {
        dispatch(dataSliceActions.addRows());
      })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log("Error saving selected rows:", error);
    }
  };

  return (
    <>
      {isVisible && (
        <div>
          <Box sx={{ width: "100%" }}>
            <Paper
              sx={{
                width: "100%",
                mb: 2,
                maxHeight: "50vh",
                overflowY: "auto",
              }}
            >
              <TableContainer sx={{ height: "100%" }}>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size="small"
                >
                  <AbsentUserHeaders />
                  <TableBody>
                    {Absent_Data.map((row, ind) => {
                      return (
                        <TableRow key={ind} hover sx={{ cursor: "pointer" }}>
                          <TableCell align="center">
                            <Checkbox
                              onChange={(event) =>
                                handleCheckboxChange(event, row)
                              }
                            />
                          </TableCell>
                          <TableCell align="center">{ind + 1}</TableCell>
                          <TableCell align="center">{row.userID}</TableCell>
                          <TableCell align="center">{row.name}</TableCell>
                          <TableCell align="center">{row.team_name}</TableCell>
                          <TableCell align="center">
                            {row.strategy_name}
                          </TableCell>
                          <TableCell align="center">
                            {row.strategy_type}
                          </TableCell>
                          <TableCell align="center">{row.inst_name}</TableCell>
                          <TableCell align="center">{row.abbr}</TableCell>
                          <TableCell align="center">{row.quantity}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
          <Fab
            onClick={addRowHandler}
            color="primary"
            aria-label="add"
            sx={{ float: "right", mb: 5, mr: 2 }}
          >
            <AddIcon />
          </Fab>
        </div>
      )}
    </>
  );
};

export default AbsentUserTable;
