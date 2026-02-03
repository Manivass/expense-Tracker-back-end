const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  amount: {
    type: Number,
    required: true,
    validate: function (value) {
      if (value <= 0) {
        throw new Error("The expense amount must be greater than 0");
      }
    },
  },
  category: {
    type: [String],
    required: true,
    enum: {
      values: ["food", "dress", "travel", "other expense"],
      message: `{VALUE} is not valid category`,
    },
  },
  note: {
    type: String,
    validate: function (value) {
      if (value.length > 25) {
        throw new Error("note must have less than 25 characters");
      }
    },
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Expense = new mongoose.model("Expense", expenseSchema);
module.exports = Expense;
