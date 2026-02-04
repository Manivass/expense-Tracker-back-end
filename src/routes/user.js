const express = require("express");
const userAuth = require("../middleware/userAuth");

const userRouter = express.Router();

userRouter.patch("/user/startingAmount", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const { startingAmount } = req.body;
    if (startingAmount < 0) {
      return res.status(401).send("starting Amount must be greater than 0");
    }
    loggedUser.startingAmount = startingAmount;
    await loggedUser.save();
    res.json({
      message: `startingAmount : ${startingAmount} is successfully added`,
      data: loggedUser,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = { userRouter };
