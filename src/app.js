const express = require("express");
const { connectionDB } = require("./config/database");

const app = express();

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
