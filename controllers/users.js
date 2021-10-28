const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require("../models/user");

const getUsers = (req, res) => {
  return User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

const getUser = (req, res) => {
  return User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("Пользователь не найден");
      error.name = "UserNotFoundError";
      throw error;
    })
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "UserNotFoundError") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Неккоректный id" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Некорректные данные" });
      }
      res.status(500).send({ message: err.message });
    });
};

const upDateUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("Пользователь не найден");
      error.name = "UserNotFoundError";
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "UserNotFoundError") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(400).send({ message: "Некорректные данные" });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Неккоректный id" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

const upDateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("Пользователь не найден");
      error.name = "UserNotFoundError";
      throw error;
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "UserNotFoundError") {
        res.status(404).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(400).send({ message: "Некорректные данные" });
      } else if (err.name === "CastError") {
        res.status(400).send({ message: "Неккоректный id" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
   
  return user.findUserByCredentials(email,password)
  .then((user) => {
    const token = jwt.sign({_id: user._id},'super-strong-secret',{ expiresIn: '7d' });

    res.cookie('jwt',token,{
      maxAge: 3600000,
      httpOnly: true
    })
    .catch((err) => {
      res.status(401).send({ message: err.message })
    })
  })

    

}

module.exports = { getUsers, getUser, createUser, upDateUser, upDateAvatar, login };
