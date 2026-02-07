const express = require("express");
const User = require("../models/user");
const { validateSignUp } = require("../utils/validate");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAuth = require("../middleware/userAuth");
const validator = require("validator");

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

authRouter.post("/logout", userAuth, async (req, res) => {
  res
    .cookie("token", "", {
      expires: new Date(0),
    })
    .send("logout successfully");
});

authRouter.post("/auth/change-password", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const isPasswordCrt = await bcrypt.compare(
      oldPassword,
      loggedUser.password,
    );
    if (!isPasswordCrt) {
      return res.status(400).send("your old password is wrong");
    }
    if (oldPassword === newPassword) {
      return res.status(400).send("new password must be different");
    }
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).send("your new password is not strong");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    loggedUser.password = passwordHash;
    await loggedUser.save();
    res.json({ message: "password successfully changed" });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = { authRouter };
