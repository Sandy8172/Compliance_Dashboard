import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { dataSliceActions } from "../../store/dataSlice";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Select from "@mui/material/Select";

const SwitchUserButton = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [options, setOptions] = useState([]);

  const dispatch = useDispatch();
  const refreshDeleteCount = useSelector(state=>state.refreshDeleteCount);


  const selectedValueRef = useRef("");
  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = () => {
    axios
      .get("/options")
      .then((response) => {
        const { options } = response.data;
        setOptions(options);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (selectedValue !== "") {
      handleFetchData();
    }
  }, [selectedValue,refreshDeleteCount]);

  const handleFetchData = () => {
    axios
      .post("/fetch-data", { selectedValue })
      .then((response) => {
        const { data } = response.data;
        dispatch(dataSliceActions.addAbsentData(data[0].items));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    selectedValueRef.current = selectedValue;
    dispatch(dataSliceActions.tableToggle(selectedValue));
  };

  return (
    <FormControl variant="filled" sx={{ mt: 1, ml: 2, minWidth: 130 }}>
      <InputLabel id="demo-simple-select-filled-label">Add Strategy</InputLabel>
      <Select
        labelId="demo-simple-select-filled-label"
        id="demo-simple-select-filled"
        value={selectedValue}
        onChange={handleOptionChange}
        onClick={handleFetchData}
      >
        <MenuItem value={""}>
          <em>none</em>
        </MenuItem>
        {options.map((option, index) => {
          return (
            <MenuItem key={index} value={option.userID}>
              {option.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SwitchUserButton;
