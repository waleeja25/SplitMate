// models/User.js
const { Schema, model } = require('mongoose');
const { v4: uuidv4 }  = require('uuid');
const bcrypt          = require('bcryptjs');   
const validator       = require('validator');  

const SALT_ROUNDS = 12; 

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      default: uuidv4,          
      unique: true,
      immutable: true,          
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,         
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please enter a valid e‑mail address',
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 3,            
      maxlength: 1024,
      select: false,           
    },
  },
  {
    timestamps: true,          
  }
);


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 

  try {
    const salt   = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = model('User', UserSchema);

