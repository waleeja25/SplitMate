const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const FriendSchema = new Schema(
  {
    friendId: {
      type: String,
      default: uuidv4,
      unique: true,
      immutable: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    friend: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Friend', FriendSchema);
