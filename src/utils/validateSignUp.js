const validator = require("validator");

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

module.exports = { validateSignUp };
