const express = require("express");
const userAuth = require("../middleware/userAuth");
const Expense = require("../models/expense");
const User = require("../models/user");
const { validateAndSanitizeExpense } = require("../utils/validate");
const expenseRouter = express.Router();

expenseRouter.post("/expense/add", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    validateAndSanitizeExpense(req);
    const { amount, note, category } = req.body;
    const expense = new Expense({
      userId: amount,
      note,
      category,
    });
    await expense.save();
    res.send(201).json({
      message: "expense successfully added",
      data: expense,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = { expenseRouter };
