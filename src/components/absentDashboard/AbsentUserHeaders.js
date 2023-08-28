import React from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const headCells = [
  {
    id: "Select",
    label: "Select",
  },
  {
    id: "Sr.",
    label: "Sr",
  },
  {
    id: "ID",
    label: "ID",
  },
  {
    id: "Name",
    label: "Name",
  },
  {
    id: "Team",
    label: "Team",
  },
  {
    id: "Strategy Type",
    label: "Strategy Type",
  },
  {
    id: "Strategy Name",
    label: "Strategy Name",
  },
  {
    id: "Instrument",
    label: "Instrument",
  },
  {
    id: "Abbreviation",
    label: "Abbreviation",
  },
  {
    id: "Quantity",
    label: "Quantity",
  },
];

const AbsentUserHeaders = () => {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="center">
            {headCell.id}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default AbsentUserHeaders;
