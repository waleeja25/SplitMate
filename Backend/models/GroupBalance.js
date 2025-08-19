const { Schema, model } = require("mongoose");

const GroupBalance = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balances: {
      type: Map,
      of: Number,
      default: {},
    },
    netBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

GroupBalance.index({ groupId: 1, userId: 1 }, { unique: true });

module.exports = model("GroupBalance", GroupBalance);
