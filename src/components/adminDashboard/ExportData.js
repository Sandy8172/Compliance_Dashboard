import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import Button from "@mui/material/Button";
import axios from "axios";
import { useDispatch } from "react-redux";
import { dataSliceActions } from "../../store/dataSlice";

function ExportData() {
  const [csvData, setCsvData] = useState([]);
  const [qtyCsvData, setQtyCsvData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCsvData();
  }, []);

  const fetchCsvData = () => {
    axios
      .get("/import/csv")
      .then((response) => {
        const { allSubmittedData } = response.data;
        const itemsData = allSubmittedData.flatMap((item) => item.items);
        setCsvData(itemsData);
        const dataWithoutBlitz = itemsData.filter(
          (ele) => !ele.Name.includes("_B")
        );
        //-------------For  Total Quantity-------------
        // Create an object to store the total executed quantities
        const totals = {};
        // Iterate over the array of objects
        for (let i = 0; i < dataWithoutBlitz.length; i++) {
          const { Name, Executed_Qty, Instrument } = dataWithoutBlitz[i];

          // Check if the name already exists in the totals object
          if (totals[Name]) {
            // Update the total executed quantity for the corresponding row (Nifty or BankNifty)
            if (Instrument === "Nifty") {
              totals[Name].Nifty += Executed_Qty;
            } else if (Instrument === "Banknifty") {
              totals[Name].BankNifty += Executed_Qty;
            } else if (Instrument === "FinNifty") {
              totals[Name].FinNifty += Executed_Qty;
            }
          } else {
            // Initialize the total executed quantities for the name
            totals[Name] = {
              Name,
              Nifty: Instrument === "Nifty" ? Executed_Qty : 0,
              BankNifty: Instrument === "Banknifty" ? Executed_Qty : 0,
              FinNifty: Instrument === "FinNifty" ? Executed_Qty : 0,
            };
          }
        }
        // Convert the totals object into an array of objects
        const result = Object.values(totals);
        setQtyCsvData(result);

        //---------------------------------

        dispatch(dataSliceActions.submittedStrategies(itemsData.length));
      })
      .catch((err) => console.log(err));
  };

  const exportCsvData = () => {
    fetchCsvData();
  };
  const exportQtyDAta = () => {
    fetchCsvData();
  };
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const today = day + month + year;

  const formatedQtyData = [];
  for (let i = 0; i < qtyCsvData.length; i++) {
    const { Name, Nifty, BankNifty, FinNifty } = qtyCsvData[i];
    formatedQtyData.push({
      Name,
      Instrument: "Nifty",
      "Total Quantity": Nifty,
    });
    formatedQtyData.push({
      Instrument: "BankNifty",
      "Total Quantity": BankNifty,
    });
    formatedQtyData.push({
      Instrument: "FinNifty",
      "Total Quantity": FinNifty,
    });
    formatedQtyData.push({});
  }

  return (
    <div style={{ backgroundColor: "rgb(225, 236, 200)" }}>
      <CSVLink data={csvData} filename={`ComplianceData_${today}.csv`}>
        <Button
          sx={{
            ml: 2,
          }}
          variant="contained"
          onClick={exportCsvData}
        >
          Export Compliance
        </Button>
      </CSVLink>
      <CSVLink data={formatedQtyData} filename={`TQuantityData_${today}.csv`}>
        <Button
          sx={{
            ml: 2,
          }}
          variant="contained"
          onClick={exportQtyDAta}
        >
          Export QTY Data
        </Button>
      </CSVLink>
    </div>
  );
}
export default ExportData;
