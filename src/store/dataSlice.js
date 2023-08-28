import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  MainTable_Data: [],
  Absent_Data: [],
  Admin_Data: [],
  selectedValue: "",
  isVisible: false,
  selectedRows: [],
  userId: null,
  showNotification: false,
  refreshDeleteCount: 0,
  refreshAdditionCount: 0,
  totalSubmitedStrategies: 0,
  filledNames: [],
};
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    showNotification(state) {
      state.showNotification = true;
    },
    hideNotification(state) {
      state.showNotification = false;
    },

    addMainData(state, action) {
      state.MainTable_Data = action.payload;
    },
    addAbsentData(state, action) {
      state.Absent_Data = action.payload;
    },
    addAdminData(state, action) {
      state.Admin_Data = action.payload;
    },

    tableToggle(state, action) {
      const value = action.payload;
      state.selectedValue = value;
      if (state.selectedValue === "") {
        state.isVisible = false;
      } else {
        state.isVisible = true;
      }
    },
    adminTableToggle(state, action) {
      const value = action.payload;
      state.selectedValue = value;
      if (state.selectedValue === "") {
        state.isVisible = false;
      } else {
        state.isVisible = true;
      }
    },

    checkBoxHandler(state, action) {
      const isChecked = action.payload.isChecked;
      const row = action.payload.row;
      if (isChecked) {
        state.selectedRows = [...state.selectedRows, row];
      } else if (!isChecked) {
        state.selectedRows = state.selectedRows.filter(
          (selectedRows) => selectedRows.Abbr !== row.Abbr
        );
      }
    },
    addRows(state) {
      const updatedSelectedRows = state.selectedRows.map(
        (selectedRow, index) => {
          const correspondingRow = state.MainTable_Data[index];
          if (correspondingRow) {
            selectedRow.name = correspondingRow.name;
            selectedRow.team_name = correspondingRow.team_name;
            selectedRow.userID = correspondingRow.userID;
          } else if (state.MainTable_Data.length === 0) {
            // Only execute if MainTable_Data is empty
            selectedRow.userID = localStorage.getItem("uId");
            selectedRow.name = localStorage.getItem("userName");
            selectedRow.team_name = localStorage.getItem("teamName");
          }
          return selectedRow;
        }
      );

      state.MainTable_Data = state.MainTable_Data.concat(updatedSelectedRows);
      state.Absent_Data = state.Absent_Data.filter((row) => {
        return row.abbr !== state.selectedRows.abbr;
      });

      state.isVisible = false;
      state.selectedValue = "";
      state.selectedRows = [];
      state.refreshAdditionCount++;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    refreshOnDelete(state) {
      state.refreshDeleteCount++;
    },
    submittedStrategies(state, action) {
      state.totalSubmitedStrategies = action.payload;
    },
    submittedStrategyNames(state, action) {
      const filledNames = action.payload.map((item) => item.Name);
      state.filledNames = filledNames;
    },
  },
});

export const dataSliceActions = dataSlice.actions;
export default dataSlice.reducer;
