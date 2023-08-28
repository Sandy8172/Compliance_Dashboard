const mongoose = require('mongoose');

const tradeHistorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userID: { type: Number, required: true },
  name: { type: String, required: true },
  team_name: { type: String, required: true },
  items: [{
    userID: { type: Number, required: true },
    userID2: { type: Number, required: true },
    name: { type: String, required: true },
    team_name: { type: String, required: true },
    strategy_name: { type: String, required: true },
    strategy_type: { type: String, required: true },
    abbr: { type: String, required: true },
    inst_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, required: true },
    cluster: { type: String, required: true }
  }]
});

const TradeHistory = mongoose.model('tradehistorie', tradeHistorySchema);

module.exports = TradeHistory;