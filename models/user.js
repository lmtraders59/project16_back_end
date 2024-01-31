const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "Elise Bouer",
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    required: true,
    type: String,
    default:
      "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png",
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
});

module.exports = mongoose.model("users", userSchema);
