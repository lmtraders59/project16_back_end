const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  daleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// CRUD

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId", updateItem);

// Delete
router.delete("/:itemId", daleteItem);

// Like
router.put("/:itemId/likes", likeItem);

// Unlike
router.delete("/:itemId/likes", dislikeItem);

// Exports
module.exports = router;
