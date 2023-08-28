const mongoose = require('mongoose');

const idsSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
  userID: Number,
  password: Number,
  name:String,
  team_name:String,
});
const Ids = mongoose.model('ids', idsSchema);

module.exports = Ids;
