require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler");
const {
  createUserValidation,
  loginValidation,
} = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;
app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: "5d8b8592978f8bd833ca8133",
//   };
//   console.log(req);
//   next();
// });

app.use("/", mainRouter);
app.use(errors());
app.use(requestLogger);

app.post("/signin", loginValidation, login);
app.post("/signup", createUserValidation, createUser);

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to DB");
  },
  (e) => console.log("DB error", e),
);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
  console.log("This is working");
});
