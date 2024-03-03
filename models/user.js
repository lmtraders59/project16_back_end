const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    required: true,
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: "true",
    unique: "true",
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Email is not valid",
    },
  },
  password: {
    type: String,
    required: "true",
    select: false,
  },
});

module.exports = mongoose.model("users", userSchema);
