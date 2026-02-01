const mongoose = require("mongoose");

async function connectionDB() {
  await mongoose.connect(
    "mongodb+srv://manivass:mani1012@namastenode.omxnchr.mongodb.net/expenseTracker",
  );
}

module.exports = { connectionDB };
