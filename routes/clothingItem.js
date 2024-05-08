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

router.use(auth);
// Create
router.post("/", auth, createItemValidation, createItem);

// Delete
router.delete("/:itemId", auth, idValidation, deleteItem);

// Like
router.put("/:itemId/likes", auth, idValidation, likeItem);

// Unlike
router.delete("/:itemId/likes", auth, idValidation, dislikeItem);

// Exports
module.exports = router;
