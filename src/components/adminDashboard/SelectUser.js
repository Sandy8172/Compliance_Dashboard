import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { dataSliceActions } from "../../store/dataSlice";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import Select from "@mui/material/Select";
import { useEffect } from "react";

// Rest of the code...

function SelectUser() {
  const [selectedValue, setSelectedValue] = useState("");
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = () => {
    axios
      .get("/allUsers/SubmittedData/nameIds")
      .then((response) => {
        const { allUsersSubmittedData } = response.data;
        const namesAndIds = allUsersSubmittedData.map((item) => {
          const { _id, items, time } = item;
          const { Id, Name } = items[0];
          const formattedTime = time.replace(/:\d+ /, " ");
          return { Id, Name, time: formattedTime };
        });
        setOptions(namesAndIds);
        dispatch(dataSliceActions.submittedStrategyNames(namesAndIds));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (selectedValue !== "") {
      handleFetchData();
    }
  }, [selectedValue]);

  const handleFetchData = () => {
    axios
      .post("/allUsers/SubmittedData", { selectedValue })
      .then((response) => {
        const { userData } = response.data;
        const data = userData[0].items;
        dispatch(dataSliceActions.addAdminData(data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    dispatch(dataSliceActions.adminTableToggle(selectedValue));
  };

  return (
    <div style={{ background: "#010819" }}>
      <FormControl variant="filled" sx={{ mt: 1, ml: 2, mb: 3, minWidth: 130 }}>
        <InputLabel id="demo-simple-select-filled-label">Users</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={selectedValue}
          onChange={handleOptionChange}
        >
          <MenuItem value="">
            <em>none</em>
          </MenuItem>
          {options.map((option, index) => {
            return (
              <MenuItem
                key={index}
                value={option.Id}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                {index + 1}: {option.Name}
                <span
                  style={{
                    color:
                      new Date(`2000-01-01 ${option.time}`) <=
                      new Date(`2000-01-01 '4:00 PM'`)
                        ? "blue"
                        : "red",
                    fontSize: "0.9rem",
                    paddingLeft: "1rem",
                  }}
                >
                  {option.time}
                </span>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}

export default SelectUser;
