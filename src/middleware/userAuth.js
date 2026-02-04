const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(200).send("please login!!!!!!");
    const decoded = jwt.verify(token, "EXPENSE-TRACKER@1211");
    const { _id } = decoded;
    const user = await User.findById(_id);
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = userAuth;
