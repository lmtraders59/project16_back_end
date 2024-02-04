const router = require("express").Router();

// GET /users — returns all users
router.get("/", () => console.log("GET users"));

// GET /users/:userId - returns a user by _id
router.get("/:userId", () => console.log("GET users by ID"));

// POST /users — creates a new user
router.post("/", () => console.log("POST users"));

module.exports = router;
