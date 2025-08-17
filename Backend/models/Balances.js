const { Schema, model } = require("mongoose");

const BalanceSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  balances: {
    type: Map,
    of: Number, 
    default: {},
  },
}, { timestamps: true });

module.exports = model("Balance", BalanceSchema);
