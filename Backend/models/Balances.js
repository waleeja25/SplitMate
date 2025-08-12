const { Schema, model } = require("mongoose");

const BalanceSchema = new Schema({
  userId: {  // the user whose balances these are
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  owes: [   // whom this user owes money to
    {
      toUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      amount: { type: Number, required: true, min: 0 },
    },
  ],
  owed: [   // who owes this user money
    {
      fromUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      amount: { type: Number, required: true, min: 0 },
    },
  ],
});

module.exports = model("Balance", BalanceSchema);
