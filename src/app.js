const express = require("express");
const cookieParser = require("cookie-parser");
const { connectionDB } = require("./config/database");
const { authRouter } = require("./routes/auth");
const { expenseRouter } = require("./routes/expense");
const app = express();
app.use("/", cookieParser());
app.use("/", express.json());
app.use("/", authRouter);
app.use("/", expenseRouter);
connectionDB()
  .then(() => {
    console.log("DB Successfully connected");
    app.listen(7777, () => {
      console.log("App started successfully");
    });
  })
  .catch(() => {
    console.log("DB didnt connect");
  });
