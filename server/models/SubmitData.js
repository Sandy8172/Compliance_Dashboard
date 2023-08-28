const mongoose = require("mongoose");

const submitSchema = new mongoose.Schema({
  Id: { type: Number, required: true },
  Alloted_Abbr: { type: String, required: true },
  Executed_Abbr: { type: String, required: true },
  Alloted_Qty: { type: Number, required: true },
  Executed_Qty: { type: Number, required: true },
  MtoM: { type: Number, required: true },
  Name: { type: String, required: true },
  Team: { type: String, required: true },
  Strategy_type: { type: String, required: true },
  Strategy_name: { type: String, required: true },
  Instrument: { type: String, required: true },
  Cluster: { type: String, required: true },
  Day: { type: String, required: true },
  Date: { type: String, required: true },
  Region: { type: String, required: true },
});

const submittedSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  items: { type: [submitSchema], default: [] },
});

const SubmitData = mongoose.model("SubmitData", submittedSchema);

module.exports = SubmitData;
