import React from "react";
import AdminTable from "./AdminTable";
import SelectUser from "./SelectUser";
import UpdateAbsent from "./UpdateAbsent";
import UploadCsv from "./UploadCsv";
import ExportData from "./ExportData";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import LogoutCard from "../logoutCard/LogoutCard";

import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const drawerBleeding = 10;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

function AdminPage() {

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <Root>
        <CssBaseline />
        <Global
          styles={{
            ".MuiDrawer-root > .MuiPaper-root": {
              height: `calc(50% - ${drawerBleeding}px)`,
              overflow: "visible",
            },
          }}
        />
        <Box
          sx={{ textAlign: "center", pt: 1, background: "rgb(225, 236, 200)" }}
        >
          <Button onClick={toggleDrawer(true)}>
            <b>Actions</b>
          </Button>
        </Box>
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <StyledBox
            sx={{
              height: "100%",
              overflow: "auto",
              backgroundColor: "rgb(225, 236, 200)",
              border: "1rem solid white",
            }}
          >
            <span
              style={{ position: "absolute", right: "1rem", top: "1rem" }}
            >
              <LogoutCard />
            </span>
            <UpdateAbsent />
            <ExportData />
            <UploadCsv />
          </StyledBox>
        </SwipeableDrawer>
      </Root>
      <SelectUser />
      <AdminTable />
    </>
  );
}

export default AdminPage;
