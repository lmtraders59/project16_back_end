const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../utils/errors/badRequestError");

const badRequestError = new BadRequestError();
const NotFoundError = require("../utils/errors/notFoundError");

const notFoundError = new NotFoundError();
const ForbiddenError = require("../utils/errors/forbiddenError");

const forbiddenError = new ForbiddenError();
const ServerError = require("../utils/errors/serverError");

const serverError = new ServerError();

// create a new item

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(badRequestError.statusCode)
          .send({ message: "Invalid data" });
      } else {
        res
          .status(serverError.statusCode)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// return all clothing items

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

// ===========
// const daleteItem = (req, res) => {
//   const { itemId } = req.params;
//   console.log(itemId);
//   ClothingItem.findByIdAndDelete(itemId)
//     .orFail()
//     .then(() => res.status(200).send({ message: "Successfully deleted" }))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         res
//           .status(notFoundError.statusCode)
//           .send({ message: "Item not found" });
//       } else if (err.name === "CastError") {
//         res
//           .status(badRequestError.statusCode)
//           .send({ message: "Invalid data" });
//       } else {
//         res
//           .status(serverError)
//           .send({ message: "An error has occurred on the server" });
//       }
//     });
// };
// =======================

const deleteItem = (req, res) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        res
          .status(notFoundError.statusCode)
          .send({ message: "Item not found" });
      }
      if (item.owner.equals(req.user._id)) {
        item.deleteOne().then(() => res.send({ ClothingItem: item }));
      } else {
        res
          .status(forbiddenError.statusCode)
          .send({ message: "You are not authorized to delete this item" });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(badRequestError.statusCode)
          .send({ message: "Invalid data" });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// Like an item

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        res
          .status(notFoundError.statusCode)
          .send({ message: "Item not found" });
      } else {
        res.send({ data: item });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(badRequestError.statusCode)
          .send({ message: "Invalid data" });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

// Dislike an item

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        res
          .status(notFoundError.statusCode)
          .send({ message: "Item not found" });
      } else {
        res.send({ data: item });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(badRequestError.statusCode)
          .send({ message: "Invalid data" });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
