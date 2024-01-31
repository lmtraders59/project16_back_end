const router = require("express").Router();

//GET /users — returns all users
router.get("/", getUsers);

//GET /users/:userId - returns a user by _id
router.get("/:_id", getUser);

//POST /users — creates a new user
router.post("/", createUser);

module.exports = router;
