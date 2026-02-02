const express = require("express");
const User = require("../models/user");
const { validateSignUp } = require("../utils/validateSignUp");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
authRouter.post("/signUp", async (req, res) => {
  try {
    validateSignUp(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    const token = jwt.sign({ _id: user._id }, "EXPENSE-TRACKER@1211");
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    res.send("data added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const isAccountAvailable = await User.findOne({ emailId: emailId });
    if (!isAccountAvailable) {
      return res.status(404).send("invalid credentials");
    }
    const isPasswordCorrect =
      await isAccountAvailable.comparePasswordAndHash(password);
    if (!isPasswordCorrect) {
      return res.status(404).send("invalid credentials");
    }

    const token = await isAccountAvailable.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 24 * 60 * 60),
    });

    res.send("successfully logged in");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = { authRouter };
