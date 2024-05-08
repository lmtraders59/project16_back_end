const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  JWT_SECRET = "3282618331b19a45e1df5543cbb45e12597cb9819aaed47a7d715690434f16ef",
} = process.env;

const User = require("../models/user");
const ConflictError = require("../utils/errors/conflictError");

const conflictError = new ConflictError();
const BadRequestError = require("../utils/errors/badRequestError");

// const badRequestError = new BadRequestError();
const NotFoundError = require("../utils/errors/notFoundError");

// const notFoundError = new NotFoundError();
const UnauthorizedError = require("../utils/errors/unauthorizedError");

// const unauthorizedError = new UnauthorizedError();
// const ServerError = require("../utils/errors/serverError");

// const serverError = new ServerError();

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById({ _id })
    .then((user) => {
      if (!user) {
        // res
        //   .status(notFoundError.statusCode)
        //   .send({ message: "User not found" });
        next(new NotFoundError("User not found"));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // res
        //   .status(badRequestError.statusCode)
        //   .send({ message: "Bad request, invalid ID" });
        next(new BadRequestError("Bad request, invalid ID"));
      } else {
        // res
        //   .status(serverError.statusCode)
        //   .send({ message: "An error has occurred on the server" });
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
        // res
        //   .status(badRequestError.statusCode)
        //   .send({ message: "Bad request, invalid data" });
        next(new BadRequestError("Bad request, invalid data"));
      } else {
        // res
        //   .status(serverError.statusCode)
        //   .send({ message: "An error has occurred on the server" });
        next(err);
      }
    });
};

// create new user

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    // res.status(badRequestError.statusCode).send({ message: "Invalid data" });
    next(new BadRequestError("Bad request, invalid data"));
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
        // res
        //   .status(badRequestError.statusCode)
        //   .send({ message: "Invalid data" });
        next(new BadRequestError("Bad request, invalid data"));
      } else {
        // res
        //   .status(serverError.statusCode)
        //   .send({ message: "An error has occurred on the server" });
        next(err);
      }
    });
};

// user log in

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // res.status(badRequestError.statusCode).send({ message: "Invalid data" });
    next(new BadRequestError("Bad request, invalid data"));
    return;
  }
  User.findUserByCredentials(email, password, next)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        // res
        //   .status(unauthorizedError.statusCode)
        //   .send({ message: "Incorrect email or password" });
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        // res
        //   .status(serverError.statusCode)
        //   .send({ message: "An error has occurred on the server" });
        next(err);
      }
    });
};

module.exports = {
  getCurrentUser,
  updateUser,
  createUser,
  login,
};
