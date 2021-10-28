const express = require("express");
const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require("mongoose");

const {login,createUser} = require('./controllers/users')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "6169fd482918151a64231c81",
  };

  next();
});

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));
app.post('/signin', login);
app.post('/signup', createUser);
app.use("/", (req, res) => {
  res.status(404).send({ message: "Ресурс не найден" });
});

app.listen(PORT);
