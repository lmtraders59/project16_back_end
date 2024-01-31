const User = require("../models/user");

const BadRequestError = require("../utils/errors/badRequestError");
const NotFoundError = require("../utils/errors/notFoundError");

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById({ _id })
    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Bad request, invalid ID"));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    { _id },
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Bad request, invalid data"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
};
