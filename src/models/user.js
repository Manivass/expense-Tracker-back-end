const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
    },
    emailId: {
      type: String,
      unique: true,
      validate: function (value) {
        if (!validator.isEmail(value)) {
          throw new Error("emailId is not valid");
        }
      },
    },
    password: {
      type: String,
      validate: function (value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must have 1 upperCase ,1 special Symbols ");
        }
      },
    },
    startingAmount: {
      type: Number,
      validate: function (value) {
        if (value <= 0) {
          throw new Error("the startingAmout must be greater then 0");
        }
      },
    },
  },
  {
    timestamps: true,
  },
);
const User = new mongoose.model("User", userSchema);

module.exports = User;
