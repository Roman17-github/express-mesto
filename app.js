const express = require("express");
const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require("mongoose");
const auth = require('./middlewares/auth');
const { celebrate, Joi } = require('celebrate');

const { login, createUser } = require('./controllers/users')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.post('/signup',celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }),
}), createUser);
app.post('/signin', login);
app.use(auth);
app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.use("/", (req, res) => {
  res.status(404).send({ message: "Ресурс не найден" });
});

app.use((err, req, res, next) => {
  if(!err.statusCode) {
    res.status(500).send({ message: "Ошибка на сервере" })
  } 
  res.status(err.statusCode).send({ message: err.message })
})

app.listen(PORT);
