const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  userID: Number,
  name: String,
});
const Attendance = mongoose.model('attendance', attendanceSchema);

module.exports = Attendance;
