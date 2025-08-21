const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const MemberSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);

const ExpenseSchema = new Schema(
  {
    expenseId: {
      type: String,
      default: uuidv4,
      unique: true,
      immutable: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      trim: true,
      default: "uncategorized",
    },

    type: {
      type: String,
      enum: ["individual", "group"],
      required: true,
    },

    splitType: {
      type: String,
      enum: ["equal", "exact", "percentage", "itemizedExpense"],
      default: "equal",
    },

    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    members: {
      type: [MemberSchema],
      validate: (v) => Array.isArray(v) && v.length >= 1,
    },

    summary: {
      type: Object,
      default: {},
    },

    exactAmounts: {
      type: Map,
      of: Number,
      default: null,
    },

    percentages: {
      type: Map,
      of: Number,
      default: null,
    },

    items: [
      {
        name: String,
        cost: Number,
        assignedTo: String,
      },
    ],

    taxPercent: {
      type: Number,
      default: null,
    },

    tipPercent: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Expense", ExpenseSchema);
