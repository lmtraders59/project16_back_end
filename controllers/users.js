const User = require("../models/user");

const BadRequestError = require("../utils/errors/badRequestError");

const badRequestError = new BadRequestError();
const NotFoundError = require("../utils/errors/notFoundError");

const notFoundError = new NotFoundError();

// GET users returns all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        res.status(badRequestError.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundError.statusCode)
          .send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(badRequestError.statusCode)
          .send({ message: "err.message" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
