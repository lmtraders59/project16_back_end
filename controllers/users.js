const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

const User = require("../models/user");
const UnauthorizedError = require("../utils/errors/unauthorizedError");
const ConflictError = require("../utils/errors/conflictError");
const BadRequestError = require("../utils/errors/badRequestError");

const badRequestError = new BadRequestError();
const NotFoundError = require("../utils/errors/notFoundError");

// const notFoundError = new NotFoundError();
const ServerError = require("../utils/errors/serverError");

const serverError = new ServerError();

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

// GET users returns all users

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => {
//       console.error(err);
//       return res
//         .status(serverError)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// create new user

// const createUser = (req, res, next) => {
//   const { name, avatar, email, password } = req.body;

//   User.create({ name, avatar })
//    return bcrypt
//     .hash(password, 10)
//     .then(hash) => {
//       User.create({
//         name,
//         avatar,
//         email,
//         password: hash,
//       })
//     .then((user) => res.status(201).send(user))
//     .catch((err) => {
//       if (err.code === 11000) {
//         next(new ConflictError("A user with the current email already exists"));
//       }
//       console.error(err);
//       if (err.name === "ValidationError") {
//         res
//           .status(badRequestError.statusCode)
//           .send({ message: "Invalid data" });
//       } else {
//         res
//           .status(serverError)
//           .send({ message: "An error has occurred on the server" });
//       }
//     });
// };

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      console.log({ user });
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      // create the user
      User.create({
        name,
        avatar,
        email,
        password: hash,
      }),
    )
    // .then((item) =>
    //   res.setHeader("Content-Type", "application/json").status(201).send({
    //     name: item.name,
    //     avatar: item.avatar,
    //     email: item.email,
    //   }),
    // )
    
    // .then((user) => console.log("send response if successful"))
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        next(new ConflictError("A user with the current email already exists"));
      }
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(badRequestError.statusCode)
          .send({ message: "Invalid data" });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// const getUser = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res
//           .status(notFoundError.statusCode)
//           .send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(badRequestError.statusCode)
//           .send({ message: "Invalid data" });
//       }
//       return res
//         .status(serverError)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// user log in

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch(() => {
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
