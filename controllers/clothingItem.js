const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/badRequestError");

const badRequestError = new BadRequestError();
const NotFoundError = require("../utils/errors/notFoundError");

const notFoundError = new NotFoundError();

// create a new item

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    // eslint-disable-next-line no-underscore-dangle
    owner: req.user._id,
  })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(badRequestError.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

// return all clothing items

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from Get Items", e });
    });
};

// Update a item

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(badRequestError.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

// delete an item by id

const daleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send({ message: "Successfully deleted" }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(notFoundError.statusCode).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Error from deleteItem" });
      }
    });
};

// const deleteItem = (req, res, next) => {
//   ClothingItem.findById(req.params.itemId)
//     .then((item) => {
//       if (!item) {
//         next(new NotFoundError("Item not found"));
//         return;
//       }
//       if (item.owner.equals(req.user._id)) {
//         item
//           .deleteOne()
//           .then(() => res.send({ ClothingItem: item }))
//           .catch(next);
//       } else {
//         next(new ForbiddenError("You are not authorized to delete this item"));
//       }
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         next(new BadRequestError("Invalid item ID"));
//       } else {
//         next(err);
//       }
//     });
// };

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

// Dislike an item

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
        res
          .status(badRequestError.statusCode)
          .send({ message: "Bad request, invalid data ID" });
      } else {
        res.status(500).send({ message: err.message });
      }
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
