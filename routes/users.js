const router = require("express").Router();

// const { get } = require("mongoose");
// const mongoose = require("mongoose");

const { getUsers, createUser, getUser } = require("../controllers/users");

// GET /users — returns all users
router.get("/", getUsers);

// GET /users/:userId - returns a user by _id
router.get("/:userId", getUser);

// POST /users — creates a new user
router.post("/", createUser);

module.exports = router;
