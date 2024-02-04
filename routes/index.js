const router = require("express").Router();

const clothingItem = require("./clothingItem");
// const users = require("./users");
const NotFoundError = require("../utils/errors/notFoundError");
const userRouter = require("./users");

router.use("/users", userRouter);

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;
