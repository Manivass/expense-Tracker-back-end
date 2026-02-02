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
    const token = jwt.sign({ emailId: emailId }, "DEVTINDER");
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true,
    });
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("data added successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = { authRouter };
