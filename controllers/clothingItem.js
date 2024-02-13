const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/badRequestError");

const badRequestError = new BadRequestError();
const NotFoundError = require("../utils/errors/notFoundError");

const notFoundError = new NotFoundError();

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from Get Items", e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(500).send({ message: "Error from updateItem", e });
    });
};

const daleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      res.status(500).send({ message: "Error from deleteItem", e });
    });
};

// Like an item

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        res.status(notFoundError.statusCode).send({ message: "err.message" });
      } else {
        res.send({ data: item });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(badRequestError.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

// Unlike an item

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        res.status(badRequestError.statusCode).send({ message: "err.message" });
      } else {
        res.send({ data: item });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(badRequestError.statusCode)
          .send({ message: "Bad request, invalid data ID" });
      } 
      //   res.status(500).send({ message: err.message });
      // }
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  daleteItem,
  likeItem,
  dislikeItem,
};
