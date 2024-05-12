require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const { getItems } = require("./controllers/clothingItem");
const errorHandler = require("./middlewares/error-handler");
const {
  createUserValidation,
  loginValidation,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();


const { PORT = 3001 } = process.env;
app.use(express.json());
app.use(cors());
app.use(errorHandler);
app.use(errors());
app.post("/signin", loginValidation, login);
app.post("/signup", createUserValidation, createUser);
app.get("/items", getItems);


// app.get("", () => {
//   setTimeout(() => /crash-test{
//     throw new Error("Server will crash now");
//   }, 0);
// });

app.use(errorLogger);


app.use("/", mainRouter);
app.use(requestLogger);


mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("connected to DB");
  },
  (e) => console.log("DB error", e),
);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
