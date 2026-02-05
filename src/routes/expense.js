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
      userId,
      amount,
      note,
      category,
    });
    await expense.save();
    res.status(200).json({
      message: "expense successfully added",
      data: expense,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

expenseRouter.get("/expense/financialOverView", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    let startingAmount = loggedUser.startingAmount;
    const expenseData = await Expense.find({ userId: loggedUser._id });
    let totalExpense = 0;
    expenseData.forEach((exp) => {
      totalExpense += exp.amount;
    });
    res.json({
      startingAmount,
      totalExpense,
      "Remaining Amount": startingAmount - totalExpense,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

expenseRouter.get("/expense/list", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const userExpense = await Expense.find({ userId: loggedUser._id })
      .select("amount category note date")
      .skip(skip)
      .limit(limit);
    res.json({ expense: userExpense });
  } catch (err) {
    res.status(401).send(err.message);
  }
});

expenseRouter.post(
  "/expense/deleteExpense/:expenseId",
  userAuth,
  async (req, res) => {
    try {
      const loggedUser = req.user;
      const expenseId = req.params.expenseId;
      const deleteExpense = await Expense.findOneAndDelete({
        $and: [{ userId: loggedUser._id }, { _id: expenseId }],
      });
      if (!deleteExpense) {
        return res.status(404).send("no expense found");
      }
      res.json({
        message: "successfully deleted",
        deleteExpense,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
);

module.exports = { expenseRouter };
