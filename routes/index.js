const router = require("express").Router();
const clothingItem = require("./clothingItem");
const auth = require("../middlewares/auth");
const NotFoundError = require("../utils/errors/notFoundError");

// const notFoundError = new NotFoundError();
const userRouter = require("./users");

router.use(auth);
router.use("/users", userRouter);

router.use("/items", clothingItem);

router.use((req, res, next) => {
  // res.status(notFoundError.statusCode).send({ message: "Router not found" });
  next(new NotFoundError("Item not found"));
});

module.exports = router;
