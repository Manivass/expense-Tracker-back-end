const express = require("express");
const { connectionDB } = require("./config/database");
const { authRouter } = require("./routes/auth");
const app = express();
app.use("/", express.json());
app.use("/", authRouter);
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
