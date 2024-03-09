const router = require("express").Router();

const { getCurrentUser, updateUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// const { getUsers, createUser, getUser } = require("../controllers/users");
// const { getCurrentUser, updateUser } = require("../controllers/users");
// const auth = require("../middlewares/auth");

// GET /users — returns all users
// router.get("/", getUsers);

// GET /users/:userId - returns a user by _id
// router.get("/:userId", getUser);

// POST /users — creates a new user
// router.post("/", createUser);

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateUser);

module.exports = router;
