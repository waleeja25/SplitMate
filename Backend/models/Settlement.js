const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const SettlementSchema = new Schema(
  {
    settlementId: {
      type: String,
      default: uuidv4,
      unique: true,
      immutable: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    paymentMode: {
      type: String,
      enum: ['cash', 'online', 'other'],
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Settlement', SettlementSchema);
