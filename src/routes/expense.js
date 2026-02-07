const express = require("express");
const userAuth = require("../middleware/userAuth");
const Expense = require("../models/expense");
const User = require("../models/user");
const { validateAndSanitizeExpense } = require("../utils/validate");
const {
  allowedCategory,
  allowedFieldsExpenseSchema,
} = require("../utils/constant");
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

expenseRouter.get("/expense/summary", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    let startingAmount = loggedUser.startingAmount;
    const expenseData = await Expense.find({ userId: loggedUser._id });
    let totalExpense = 0;
    const result = await Expense.aggregate([
      { $match: { userId: loggedUser._id } },
      {
        $group: {
          _id: "$category",
          Amount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          category: "$_id",
          Amount: 1,
          _id: 0,
        },
      },
    ]);
    if (result.length === 0) {
      return res.status(200).send("No categories found");
    }
    res.json({
      startingAmount,
      totalExpense,
      "Remaining Amount": startingAmount - totalExpense,
      result,
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

//expense / delete
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

expenseRouter.patch("/expense/edit/:expenseId", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const expenseId = req.params.expenseId;
    const expenseAvailable = await Expense.findOne({
      $and: [{ userId: loggedUser._id }, { _id: expenseId }],
    });

    if (!expenseAvailable) {
      return res.status(404).send("no expense found");
    }

    validateAndSanitizeExpense(req);

    Object.keys(req.body).forEach((key) => {
      if (allowedFieldsExpenseSchema.includes(key))
        expenseAvailable[key] = req.body[key];
    });

    await expenseAvailable.save();

    res.json({
      message: `${loggedUser.firstName} your expense has been successfully changed`,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

expenseRouter.get("/expense/summary/overall", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const monthlyExpense = await Expense.aggregate([
      { $match: { userId: loggedUser._id } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          year: "$_id.year",
          month: "$_id.month",
          totalAmount: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]);
    if (monthlyExpense.length === 0) {
      return res.status(200).send("no data found");
    }
    res.send(monthlyExpense);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

expenseRouter.get("/expense/monthly-category", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const year = req.query.year;
    const month = req.query.month;
    if (!year || !month) {
      return res.status(400).send("pls give the year and month");
    }
    if (month < 1 || month > 12)
      return res.status(400).send("pls give the valid month");
    const monthlyCategory = await Expense.aggregate([
      {
        $match: {
          userId: loggedUser._id,
          date: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          category: "$_id",
          totalAmount: 1,
          _id: 0,
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);
    if (monthlyCategory.length === 0) {
      return res.status(200).send("not found");
    }
    res.json({ monthlyCategory });
  } catch (err) {
    res.status(400).send(err.message);
  }
});



module.exports = { expenseRouter };
