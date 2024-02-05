const router = require("express").Router();

const { getUsers, createUser } = require("../controllers/users");

// GET /users — returns all users
router.get("/", getUsers);

// GET /users/:userId - returns a user by _id
router.get("/:userId", () => console.log("GET users by ID"));

// POST /users — creates a new user
router.post("/", createUser);

module.exports = router;
