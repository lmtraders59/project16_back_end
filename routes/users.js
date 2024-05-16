const router = require("express").Router();

const { getCurrentUser, updateUser } = require("../controllers/users");
// const auth = require("../middlewares/auth");

router.get("/me", getCurrentUser);

router.patch("/me", updateUser);

module.exports = router;
