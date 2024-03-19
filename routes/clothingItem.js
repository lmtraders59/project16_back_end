const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  daleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.use(auth);
// Create
router.post("/", createItem);

// Delete
router.delete("/:itemId", daleteItem);

// Like
router.put("/:itemId/likes", likeItem);

// Unlike
router.delete("/:itemId/likes", dislikeItem);

// Exports
module.exports = router;
