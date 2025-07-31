const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const GroupSchema = new Schema(
  {
    groupId: {
      type: String,
      default: uuidv4,
      unique: true,
      immutable: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model('Group', GroupSchema);
