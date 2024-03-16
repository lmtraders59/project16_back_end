const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

const User = require("../models/user");
// const UnauthorizedError = require("../utils/errors/unauthorizedError");

// const unauthorizedError = new UnauthorizedError();
const ConflictError = require("../utils/errors/conflictError");

const conflictError = new ConflictError();
const BadRequestError = require("../utils/errors/badRequestError");

const badRequestError = new BadRequestError();
const NotFoundError = require("../utils/errors/notFoundError");

const notFoundError = new NotFoundError();
const ServerError = require("../utils/errors/serverError");

const serverError = new ServerError();

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById({ _id })
    .then((user) => {
      if (!user) {
        // next(new NotFoundError("User not found"));
        res
          .status(notFoundError.statusCode)
          .send({ message: "User not found" });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // next(new BadRequestError("Bad request, invalid ID"));
        res
          .status(badRequestError.statusCode)
          .send({ message: "Bad request, invalid ID" });
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
        // next(new BadRequestError("Bad request, invalid data"));
        res
          .status(badRequestError.statusCode)
          .send({ message: "Bad request, invalid data" });
      } else {
        next(err);
      }
    });
};

// create new user

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    res.status(badRequestError.statusCode).send({ message: "Invalid data" });
    return;
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (user) {
        const error = new Error("A user with the current email already exists");
        error.statusCode = 409;
        throw error;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      }),
    )
    .then((item) =>
      res.setHeader("Content-Type", "application/json").status(201).send({
        name: item.name,
        avatar: item.avatar,
        email: item.email,
      }),
    )
    .catch((err) => {
      console.error(err);
      if (err.statusCode === 409) {
        res
          .status(conflictError.statusCode)
          .send({ message: "A user with the current email already exists" });
      } else if (err.name === "ValidationError") {
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

// user log in

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      console.error(err);
      // res
      //   .status(unauthorizedError.statusCode)
      res
        .status(badRequestError.statusCode)
        .send({ message: "Incorrect email or password" });
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
