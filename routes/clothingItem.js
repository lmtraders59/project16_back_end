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
router.delete("/:itemId", auth, daleteItem);

// Like
router.put("/:itemId/likes", auth, likeItem);

// Unlike
router.delete("/:itemId/likes", auth, dislikeItem);

// Exports
module.exports = router;
