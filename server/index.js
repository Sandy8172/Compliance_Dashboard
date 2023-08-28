const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Ids = require("./models/Ids.js");
const TradeHistory = require("./models/TradeHistory.js");
const Attendance = require("./models/Attendance.js");
const SubmitData = require("./models/SubmitData.js");
const bodyParser = require("body-parser");
const app = express();

const IP_ADDRESS = "172.16.1.47";
const PORT = 5050;
const FRONTEND_ORIGIN = "http://172.16.1.47:3000";

mongoose
  .connect("mongodb://localhost:27017/pacefin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
app.use(cors({ origin: FRONTEND_ORIGIN }));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://172.16.1.47:3000");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// app.use(express.json());
// app.use(
//   cors({
//     credentials: true,
//     origin: "http://172.16.1.47:3000",
//   })
// );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/login", async (req, res) => {
  const { currentUser, currentPassword } = req.body;
  try {
    const user = await Ids.findOne({ userID: +currentUser }).exec();
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
    } else if (user.password != +currentPassword) {
      res.status(401).json({ error: "Invalid credentials" });
    } else {
      res.json({ user });
    }
  } catch (error) {
    console.error("Error finding user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/currentUser", async (req, res) => {
  const { uId } = req.body;
  try {
    const userData = await TradeHistory.find({ userID: uId }).exec();
    res.json({ userData });
  } catch (error) {
    console.error("Error finding Data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/options", async (req, res) => {
  try {
    const options = await Attendance.find().exec();

    res.json({ options });
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/fetch-data", async (req, res) => {
  const { selectedValue } = req.body;
  try {
    if (selectedValue !== "") {
      const data = await TradeHistory.find({ userID: selectedValue }).exec();
      res.json({ data });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/data/:uId", async (req, res) => {
  const { uId } = req.params;
  const { userName } = req.body;
  const { teamName } = req.body;
  const { selectedRows } = req.body;
  const selectedValue = selectedRows[0]?.userID;
  try {
    // Fetch the user's existing data from the database
    const dataDoc = await TradeHistory.find({ userID: uId });
    if (!dataDoc) {
      return res.status(404).json({ error: "User not found" });
    } else {
      const updatedItems = selectedRows.map((row) => {
        return {
          abbr: row.abbr,
          inst_name: row.inst_name,
          quantity: row.quantity,
          strategy_type: row.strategy_type,
          strategy_name: row.strategy_name,
          userID: uId,
          userID2: row.userID,
          name: userName,
          team_name: teamName,
          date: new Date(),
          cluster: row.cluster,
        };
      });

      dataDoc[0].items = [...dataDoc[0].items, ...updatedItems];
      await dataDoc[0].save();
    }

    const selectedPerson = await TradeHistory.findOne({
      userID: selectedValue,
    });
    if (selectedPerson) {
      // Remove the selected rows from the person's data based on their abbr values
      selectedRows.forEach((row) => {
        selectedPerson.items = selectedPerson.items.filter(
          (item) => item.abbr !== row.abbr
        );
      });
      await selectedPerson.save();
    }
    res.json({ message: "Selected rows saved successfully" });
  } catch (error) {
    console.log("Error saving selected rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/delete/:uId", async (req, res) => {
  const { uId } = req.params;
  const { rowToDelete } = req.body;
  const deleteID = rowToDelete.userID2;
  try {
    const dataDoc = await TradeHistory.find({ userID: deleteID });
    if (!dataDoc) {
      return res.status(404).json({ error: "User not found" });
    }
    const teamName = dataDoc[0].team_name;
    const name = dataDoc[0].name;

    const updatedItems = {
      abbr: rowToDelete.abbr,
      inst_name: rowToDelete.inst_name,
      quantity: rowToDelete.quantity,
      strategy_type: rowToDelete.strategy_type,
      strategy_name: rowToDelete.strategy_name,
      userID: deleteID,
      userID2: deleteID,
      name: name,
      team_name: teamName,
      date: new Date(),
      cluster: rowToDelete.cluster,
    };
    dataDoc[0].items = [...dataDoc[0].items, updatedItems];
    await dataDoc[0].save();

    // to delete the row ---------------------

    const selectedPersonToDelete = await TradeHistory.findOne({ userID: uId });
    if (selectedPersonToDelete) {
      // Remove the selected rows from the person's data based on their abbr values
      selectedPersonToDelete.items = selectedPersonToDelete.items.filter(
        (item) => item.abbr !== rowToDelete.abbr
      );
      await selectedPersonToDelete.save();
    }
    res.json({ message: "Selected rows deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the row." });
  }
});

app.post("/api/submitData", async (req, res) => {
  try {
    const { filledData } = req.body;
    const { Id } = filledData[0];
    const existingData = await SubmitData.findOne({ _id: Id }).exec();

    if (existingData) {
      // Update the existing data
      existingData.items = filledData;
      await existingData.save();
      res.json({ success: true });
    } else {
      // Add new data if it doesn't exist
      const newData = new SubmitData({
        _id: Id,
        date: new Date(),
        time: new Date().toLocaleTimeString(),
        items: filledData,
      });
      await newData.save();
      res.json({ success: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/allUsers/SubmittedData/nameIds", async (req, res) => {
  try {
    const allUsersSubmittedData = await SubmitData.find().exec();
    res.json({ allUsersSubmittedData });
  } catch (err) {
    console.log(err);
  }
});

app.post("/allUsers/SubmittedData", async (req, res) => {
  const { selectedValue } = req.body;
  try {
    const userData = await SubmitData.find({ _id: selectedValue }).exec();
    res.json({ userData });
  } catch (error) {
    console.error("Error finding Data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/admin-submit", async (req, res) => {
  const { submittedData } = req.body;
  try {
    const existingData = await SubmitData.findOne({
      _id: submittedData[0].Id,
    }).exec();
    existingData.items = submittedData;
    await existingData.save();
    res.status(200).json({ message: "Data successfully updated" });
  } catch (error) {
    console.error("Error finding Data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/allUsers/data/admin", async (req, res) => {
  try {
    const allUsersData = await TradeHistory.find().exec();
    res.json({ allUsersData });
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/absentUsers/data/admin", async (req, res) => {
  try {
    const absentUsersData = await Attendance.find().exec();
    res.json({ absentUsersData });
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addAbsent/user/admin", async (req, res) => {
  const { selectedPresentUsers } = req.body;
  try {
    const insertedUsers = await Attendance.insertMany(selectedPresentUsers);
    res.status(200).json({ message: insertedUsers });
  } catch (error) {
    console.error("Error adding users to the database:", error);
    res.status(500).json({ message: "Failed to add users to the database" });
  }
});
app.post("/removeAbsent/user/admin", async (req, res) => {
  const { selectedAbsentUsers } = req.body;
  try {
    const userIds = selectedAbsentUsers.map((user) => user.userID);
    const deletedUsers = await Attendance.deleteMany({
      userID: { $in: userIds },
    });
    res.status(200).json({ message: deletedUsers });
  } catch (error) {
    console.error("Error deleting users from the database:", error);
    res
      .status(500)
      .json({ message: "Failed to delete users from the database" });
  }
});
app.get("/import/csv", async (req, res) => {
  try {
    const allSubmittedData = await SubmitData.find().exec();
    res.json({ allSubmittedData });
  } catch (error) {
    console.error("Error fetching options:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// total number of strategies ------// users with strategies----------------

app.get("/total/strategies", async (req, res) => {
  try {
    const data = await TradeHistory.find();
    const itemsData = data.map((obj) => obj.items).flat();
    const dataLength = itemsData.length;
    const users_with_alotted_strategies = data
      .map((item) => {
        if (item.items.length > 0) {
          return item.name;
        }
      })
      .filter((name) => name !== undefined);
    res.json({ dataLength, users_with_alotted_strategies });
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server is running on http://${IP_ADDRESS}:${PORT}`);
});
