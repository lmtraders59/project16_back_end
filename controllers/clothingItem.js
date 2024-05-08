const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../utils/errors/badRequestError");

// const badRequestError = new BadRequestError();
const NotFoundError = require("../utils/errors/notFoundError");

// const notFoundError = new NotFoundError();
const ForbiddenError = require("../utils/errors/forbiddenError");

// const forbiddenError = new ForbiddenError();
const ServerError = require("../utils/errors/serverError");

const serverError = new ServerError();

// create a new item

const createItem = (req, res, next) => {
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
        // res
        //   .status(badRequestError.statusCode)
        //   .send({ message: "Invalid data" });
        next(new BadRequestError("Bad request, invalid data"));
      } else {
        // res
        //   .status(serverError.statusCode)
        //   .send({ message: "An error has occurred on the server" });
        next(err);
      }
    });
};

// return all clothing items

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      // res
      //   .status(serverError.statusCode)
      //   .send({ message: "An error has occurred on the server" });
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .then((item) => {
      if (!item) {
        // res
        //   .status(notFoundError.statusCode)
        //   .send({ message: "Item not found" });
        next(new NotFoundError("Item not found"));
      } else if (item.owner.equals(req.user._id)) {
        item.deleteOne().then(() => res.send({ ClothingItem: item }));
      } else {
        // res
        //   .status(forbiddenError.statusCode)
        //   .send({ message: "You are not authorized to delete this item" });
        next(new ForbiddenError("You are not authorized to delete this item"));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // res
        //   .status(badRequestError.statusCode)
        //   .send({ message: "Invalid data" });
        next(new BadRequestError("Invalid item ID"));
      } else {
        // res
        //   .status(serverError.statusCode)
        //   .send({ message: "An error has occurred on the server" });
        next(err);
      }
    });
};

// Like an item

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        // res
        //   .status(notFoundError.statusCode)
        //   .send({ message: "Item not found" });
        next(new NotFoundError("Item not found"));
      } else {
        res.send({ data: item });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // res
        //   .status(badRequestError.statusCode)
        //   .send({ message: "Invalid data" });
        next(new BadRequestError("Bad request, invalid data ID"));
      } else {
        // res
        //   .status(serverError.statusCode)
        //   .send({ message: "An error has occurred on the server" });
        next(err);
      }
    });
};

// Dislike an item

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        // res
        //   .status(notFoundError.statusCode)
        //   .send({ message: "Item not found" });
        next(new NotFoundError("Item not found"));
      } else {
        res.send({ data: item });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        // res
        //   .status(badRequestError.statusCode)
        //   .send({ message: "Invalid data" });
        next(new BadRequestError("Bad request, invalid data ID"));
      } else {
        // res
        //   .status(serverError.statusCode)
        //   .send({ message: "An error has occurred on the server" });
        next(err);
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
