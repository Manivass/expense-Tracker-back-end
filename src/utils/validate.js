const validator = require("validator");
const { allowedCategory } = require("../utils/constant");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("please fill all creditenials");
  } else if (firstName.length <= 2) {
    throw new Error("first Name must have more than 3 characters");
  } else if (lastName.length <= 2) {
    throw new Error("first Name must have more than 3 characters");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong . Please Enter strong password");
  }
};

const validateAndSanitizeExpense = (req) => {
  const { amount, category, note } = req.body;
  if (amount < 0) {
    throw new Error("amount must be greater than 0");
  }
  if (!allowedCategory.includes(category)) {
    throw new Error("category is not valid");
  }
  if (note.length > 20) {
    throw new Error("note must be greater than 20");
  }
};

module.exports = { validateSignUp, validateAndSanitizeExpense };
