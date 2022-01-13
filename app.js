const express = require("express");
const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require("mongoose");
const auth = require('./middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
}), login);
app.use(auth);
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use("/", (req, res, next) => {
  const err = new Error("Ресурс не найден");
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: "Ошибка на сервере" });
  }
   res.status(err.statusCode).send({ message: err.message })
})

app.listen(PORT);
