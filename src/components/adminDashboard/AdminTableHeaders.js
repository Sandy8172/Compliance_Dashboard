import React from 'react';
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const headCells = [
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
    id: "Strategy type",
    label: "Strategy Type",
  },
  {
    id: "Strategy name",

    label: "Strategy Name",
  },
  {
    id: "Instrument",

    label: "Instrument",
  },
];

function AdminTableHeaders() {
    return (
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell key={headCell.id} align="center">
                {headCell.id}
              </TableCell>
            ))}
            <TableCell colSpan={2} align="center">
              Abbreviation
            </TableCell>
            <TableCell colSpan={2} align="center">
              Quantity
            </TableCell>
            <TableCell align="center">MTM</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center">Alloted</TableCell>
            <TableCell align="center">Executed</TableCell>
            <TableCell align="center">Alloted</TableCell>
            <TableCell align="center">Executed</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
      );
}

export default AdminTableHeaders