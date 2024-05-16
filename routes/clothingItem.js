const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItemValidation,
  idValidation,
} = require("../middlewares/validation");
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// router.use(auth);
// Create
router.post("/", createItemValidation, createItem);

// Delete
router.delete("/:itemId", idValidation, deleteItem);

// Like
router.put("/:itemId/likes", idValidation, likeItem);

// Unlike
router.delete("/:itemId/likes", idValidation, dislikeItem);

// Exports
module.exports = router;
