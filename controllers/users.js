const User = require("../models/user");

// const BadRequestError = require("../utils/errors/badRequestError");
// const NotFoundError = require("../utils/errors/notFoundError");

// GET users returns all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};
// returns a user by _id
// const getUser = (req, res, next) => {
//   const { _id } = req.user;

//   User.findById({ _id })
//     .then((user) => {
//       if (!user) {
//         next(new NotFoundError("User not found"));
//       } else {
//         res.send(user);
//       }
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         next(new BadRequestError("Bad request, invalid ID"));
//       } else {
//         next(err);
//       }
//     });
// };

// creates a new user
// const newUser = (req, res, next) => {
//   const { name, avatar } = req.body;
//   const { _id } = req.user;
//   User.findByIdAndUpdate(
//     { _id },
//     { name, avatar },
//     { new: true, runValidators: true },
//   )
//     .then((user) => {
//       res.send(user);
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         next(new BadRequestError("Bad request, invalid data"));
//       } else {
//         next(err);
//       }
//     });
// };

module.exports = {
  getUsers,
  createUser,
};
